import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, Eye } from 'lucide-react';
import axios from 'axios';

const RecruiterDashboard = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/login');
      return;
    }

    if (user?.publicMetadata?.role !== 'recruiter') {
      navigate('/');
      return;
    }

    fetchMyJobs();
  }, [isSignedIn, user, navigate]);

  const fetchMyJobs = async () => {
    try {
      const token = await user.getToken();
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/jobs/my/posted`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const token = await user.getToken();
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job. Please try again.');
    }
  };

  const timeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Recruiter Dashboard</h1>
          <p className="text-gray-400">Manage your job postings and applications</p>
        </div>
        <Link
          to="/recruiter/post-job"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Total Jobs Posted</h3>
          <p className="text-3xl font-bold text-blue-500">{jobs.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Active Jobs</h3>
          <p className="text-3xl font-bold text-green-500">
            {jobs.filter(job => job.isActive).length}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">This Month</h3>
          <p className="text-3xl font-bold text-purple-500">
            {jobs.filter(job => {
              const jobDate = new Date(job.createdAt);
              const now = new Date();
              return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Your Job Postings</h2>
        </div>

        {jobs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 text-lg mb-4">You haven't posted any jobs yet.</p>
            <Link
              to="/recruiter/post-job"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {jobs.map((job) => (
              <div key={job._id} className="p-6 hover:bg-gray-800 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{job.title}</h3>
                    <p className="text-gray-400 mb-3">{job.company}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <span>Posted {timeAgo(job.createdAt)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${job.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        job.jobType === 'Full-time' ? 'bg-green-900 text-green-300' :
                        job.jobType === 'Part-time' ? 'bg-yellow-900 text-yellow-300' :
                        job.jobType === 'Contract' ? 'bg-blue-900 text-blue-300' :
                        'bg-purple-900 text-purple-300'
                      }`}>
                        {job.jobType}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                      {job.description}
                    </p>

                    {job.tags && job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 rounded-md text-xs">
                            {tag}
                          </span>
                        ))}
                        {job.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded-md text-xs">
                            +{job.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    <Link
                      to={`/recruiter/applications/${job._id}`}
                      className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Applications
                    </Link>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                    <Link
                      to={`/recruiter/edit-job/${job._id}`}
                      className="flex items-center px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
