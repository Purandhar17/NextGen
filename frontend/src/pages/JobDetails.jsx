import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  MapPin,
  Clock,
  Building,
  Calendar,
  ArrowLeft,
  Send,
} from "lucide-react";
import axios from "axios";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJob();
    if (isSignedIn && user?.publicMetadata?.role === "candidate") {
      checkIfApplied();
    }
  }, [id, isSignedIn, user]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/jobs/${id}`);
      setJob(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching job:", error);
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    try {
      const token = await user?.getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/applications/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const applied = response.data.some((app) => app.jobId._id === id);
      setHasApplied(applied);
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      navigate("/login");
      return;
    }

    setApplying(true);
    try {
      const token = await user.getToken();
      await axios.post(
        "http://localhost:5000/api/applications",
        { jobId: id, coverLetter },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHasApplied(true);
      setShowApplicationForm(false);
      setCoverLetter("");
    } catch (error) {
      console.error("Error applying to job:", error);
      alert("Failed to apply to job. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const timeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
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

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Job not found</p>
        <button
          onClick={() => navigate("/jobs")}
          className="mt-4 text-blue-500 hover:text-blue-400 underline"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  const isCandidate = user?.publicMetadata?.role === "candidate";

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/jobs")}
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </button>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-800">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {job.title}
              </h1>
              <div className="flex items-center text-gray-400 mb-4">
                <Building className="h-5 w-5 mr-2" />
                <span className="text-lg">{job.company}</span>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  job.jobType === "Full-time"
                    ? "bg-green-900 text-green-300"
                    : job.jobType === "Part-time"
                    ? "bg-yellow-900 text-yellow-300"
                    : job.jobType === "Contract"
                    ? "bg-blue-900 text-blue-300"
                    : "bg-purple-900 text-purple-300"
                }`}
              >
                {job.jobType}
              </span>
              <div className="flex items-center text-gray-500 mt-2">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">Posted {timeAgo(job.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center text-gray-300">
              <MapPin className="h-5 w-5 mr-3 text-gray-400" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <span>{job.salary}</span>
            </div>
          </div>

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {job.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded-md text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Apply Button */}
          {isSignedIn && isCandidate && (
            <div>
              {hasApplied ? (
                <div className="bg-green-900 text-green-300 px-6 py-3 rounded-lg inline-flex items-center">
                  <span>✓ Application Submitted</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Apply Now
                </button>
              )}
            </div>
          )}

          {!isSignedIn && (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Sign In to Apply
            </button>
          )}
        </div>

        {/* Job Description */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Job Description
          </h2>
          <div className="text-gray-300 whitespace-pre-line leading-relaxed">
            {job.description}
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-semibold text-white">
                Apply for {job.title}
              </h3>
              <p className="text-gray-400 mt-1">at {job.company}</p>
            </div>

            <form onSubmit={handleApply} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                  placeholder="Tell us why you're interested in this position..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors disabled:opacity-50"
                >
                  {applying ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
