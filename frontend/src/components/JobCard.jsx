import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Building } from "lucide-react";

const JobCard = ({ job }) => {
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

  return (
    <Link to={`/jobs/${job._id}`}>
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 hover:bg-gray-800 transition-all duration-200 cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">
              {job.title}
            </h3>
            <div className="flex items-center text-gray-400 mb-2">
              <Building className="h-4 w-4 mr-1" />
              <span>{job.company}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {timeAgo(job.createdAt)}
            </div>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
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
          </div>
        </div>

        <div className="flex items-center text-gray-400 mb-3 space-x-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{job.location}</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm">{job.salary}</span>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {job.description}
        </p>

        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-800 text-gray-300 rounded-md text-xs"
              >
                {tag}
              </span>
            ))}
            {job.tags.length > 4 && (
              <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded-md text-xs">
                +{job.tags.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default JobCard;
