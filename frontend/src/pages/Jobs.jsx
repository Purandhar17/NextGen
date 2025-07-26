import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import axios from 'axios';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    tags: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, filters]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`);
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = jobs;

    if (filters.search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.jobType) {
      filtered = filtered.filter(job => job.jobType === filters.jobType);
    }

    if (filters.tags) {
      filtered = filtered.filter(job =>
        job.tags && job.tags.some(tag =>
          tag.toLowerCase().includes(filters.tags.toLowerCase())
        )
      );
    }

    setFilteredJobs(filtered);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Browse Jobs</h1>
        <p className="text-gray-400">Discover your next career opportunity</p>
      </div>

      <JobFilters filters={filters} onFilterChange={setFilters} />

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-400">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No jobs found matching your criteria.</p>
          <button
            onClick={() => setFilters({ search: '', location: '', jobType: '', tags: '' })}
            className="mt-4 text-blue-500 hover:text-blue-400 underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
