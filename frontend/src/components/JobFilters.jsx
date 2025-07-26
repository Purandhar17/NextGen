import React from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';

const JobFilters = ({ filters, onFilterChange }) => {
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote'];
  const popularTags = ['React', 'JavaScript', 'Node.js', 'Python', 'Full Stack', 'Frontend', 'Backend', 'UI/UX'];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
      <h2 className="text-lg font-semibold text-white mb-4">Filter Jobs</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search jobs or companies..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Location..."
            value={filters.location}
            onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Job Type */}
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={filters.jobType}
            onChange={(e) => onFilterChange({ ...filters, jobType: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="">All Types</option>
            {jobTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => onFilterChange({ search: '', location: '', jobType: '', tags: '' })}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
        >
          Clear Filters
        </button>
      </div>

      {/* Popular Tags */}
      <div className="mt-4">
        <p className="text-sm text-gray-400 mb-2">Popular Tags:</p>
        <div className="flex flex-wrap gap-2">
          {popularTags.map(tag => (
            <button
              key={tag}
              onClick={() => onFilterChange({ ...filters, tags: tag })}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filters.tags === tag
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobFilters;