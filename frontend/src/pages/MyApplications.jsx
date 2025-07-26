import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, DollarSign, Calendar, Eye } from "lucide-react";
import axios from "axios";

const MyApplications = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login");
      return;
    }

    if (user?.publicMetadata?.role !== "candidate") {
      navigate("/");
      return;
    }

    fetchApplications();
  }, [isSignedIn, user, navigate]);

  const fetchApplications = async () => {
    try {
      const token = await user.getToken();
      const response = await axios.get(
        "http://localhost:5000/api/applications/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900 text-yellow-300";
      case "reviewed":
        return "bg-blue-900 text-blue-300";
      case "accepted":
        return "bg-green-900 text-green-300";
      case "rejected":
        return "bg-red-900 text-red-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  const timeAgo = (date) => {
    const now = new Date();
    const applied = new Date(date);
    const diffTime = Math.abs(now - applied);
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
        <p className="text-gray-400">
          Track the status of your job applications
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">
            You haven't applied to any jobs yet.
          </p>
          <Link
            to="/jobs"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application._id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {application.jobId.title}
                  </h3>
                  <p className="text-gray-400 mb-3">
                    {application.jobId.company}
                  </p>

                  <div className="flex items-center text-gray-400 space-x-6 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {application.jobId.location}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {application.jobId.salary}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          application.jobId.jobType === "Full-time"
                            ? "bg-green-900 text-green-300"
                            : application.jobId.jobType === "Part-time"
                            ? "bg-yellow-900 text-yellow-300"
                            : application.jobId.jobType === "Contract"
                            ? "bg-blue-900 text-blue-300"
                            : "bg-purple-900 text-purple-300"
                        }`}
                      >
                        {application.jobId.jobType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {application.status.charAt(0).toUpperCase() +
                      application.status.slice(1)}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Applied {timeAgo(application.createdAt)}</span>
                  </div>
                </div>
              </div>

              {application.coverLetter && (
                <div className="mb-4 p-3 bg-gray-800 rounded-md">
                  <p className="text-sm text-gray-400 mb-1">Cover Letter:</p>
                  <p className="text-gray-300 text-sm">
                    {application.coverLetter}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <Link
                    to={`/jobs/${application.jobId._id}`}
                    className="flex items-center text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Job Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
