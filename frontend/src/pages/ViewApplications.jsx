import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Calendar, User } from 'lucide-react';
import axios from 'axios';

const ViewApplications = () => {
  const { jobId } = useParams();
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
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

    fetchJob();
    fetchApplications();
  }, [isSignedIn, user, navigate, jobId]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/jobs/${jobId}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = await user.getToken();
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const token = await user.getToken();
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/applications/${applicationId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status } : app
      ));
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900 text-yellow-300';
      case 'reviewed':
        return 'bg-blue-900 text-blue-300';
      case 'accepted':
        return 'bg-green-900 text-green-300';
      case 'rejected':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  const timeAgo = (date) => {
    const now = new Date();
    const applied = new Date(date);
    const diffTime = Math.abs(now - applied);
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
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate('/recruiter')}
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </button>

      {job && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Applications for: {job.title}</h1>
          <p className="text-gray-400 mb-4">{job.company} • {job.location}</p>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {applications.length} application{applications.length !== 1 ? 's' : ''}
            </span>
            <Link
              to={`/jobs/${job._id}`}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              View Job Details
            </Link>
          </div>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-lg">No applications received yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application._id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 mr-2 text-gray-400" />
                    <h3 className="text-lg font-semibold text-white">
                      {application.candidateId.firstName} {application.candidateId.lastName}
                    </h3>
                  </div>
                  
                  <div className="flex items-center text-gray-400 mb-3">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{application.candidateId.email}</span>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Applied {timeAgo(application.createdAt)}</span>
                  </div>

                  {application.coverLetter && (
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Cover Letter:</h4>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}
                </div>

                <div className="ml-6 text-right">
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {application.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(application._id, 'reviewed')}
                          className="block w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                        >
                          Mark as Reviewed
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(application._id, 'accepted')}
                          className="block w-full px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(application._id, 'rejected')}
                          className="block w-full px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {application.status === 'reviewed' && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(application._id, 'accepted')}
                          className="block w-full px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(application._id, 'rejected')}
                          className="block w-full px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(application._id, 'pending')}
                          className="block w-full px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                        >
                          Mark as Pending
                        </button>
                      </>
                    )}

                    {(application.status === 'accepted' || application.status === 'rejected') && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(application._id, 'pending')}
                          className="block w-full px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                        >
                          Mark as Pending
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(application._id, 'reviewed')}
                          className="block w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                        >
                          Mark as Reviewed
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
