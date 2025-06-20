import { useEffect, useState } from 'react';

interface Job {
  id: number;
  company: string;
  logo: string;
  new: boolean;
  featured: boolean;
  position: string;
  role: string;
  level: string;
  postedAt: string;
  contract: string;
  location: string;
  languages: string[];
  tools: string[];
}

export default function JobBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/data.json')
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch jobs:', err);
        setLoading(false);
      });
  }, []);

  const allTags = Array.from(
    new Set(jobs.flatMap((job) => [job.role, ...job.languages, ...job.tools]))
  );

  const handleTagClick = (tag: string) => {
    if (!filters.includes(tag)) {
      setFilters([...filters, tag]);
    }
  };

  const handleRemoveFilter = (tag: string) => {
    setFilters(filters.filter((f) => f !== tag));
  };

  const clearFilters = () => setFilters([]);

  const filterJobs = (job: Job): boolean => {
    const jobTags = [job.role, job.level, ...job.languages, ...job.tools];
    return filters.every((filter) => jobTags.includes(filter));
  };

  const filteredJobs = filters.length ? jobs.filter(filterJobs) : jobs;

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  const roleFilteredJobs =
    selectedRole === 'all'
      ? filteredJobs
      : filteredJobs.filter(
          (job) =>
            job.role === selectedRole ||
            job.languages.includes(selectedRole) ||
            job.tools.includes(selectedRole)
        );

  return (
    <>
      {/* Green Header with Wave */}
      <div className="relative bg-teal-500 h-48 md:h-56">
        <svg
          className="absolute bottom-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#effafa"
            fillOpacity="1"
            d="M0,160L60,154.7C120,149,240,139,360,149.3C480,160,600,192,720,192C840,192,960,160,1080,144C1200,128,1320,128,1380,128L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Main Section */}
      <div className="bg-[#effafa] -mt-8 md:-mt-14 px-4 py-8 md:px-20 space-y-6">
        {/* Filter Bar */}
        <div className="bg-white shadow-md rounded px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Selected Tags */}
          <div className="flex flex-wrap gap-3 min-h-[28px]">
            {filters.length > 0 ? (
              filters.map((filter) => (
                <span
                  key={filter}
                  className="flex items-center bg-teal-100 text-teal-700 font-bold rounded overflow-hidden"
                >
                  <span className="px-2">{filter}</span>
                  <button
                    onClick={() => handleRemoveFilter(filter)}
                    className="bg-teal-700 text-white px-2 hover:bg-black"
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-400 italic text-sm">No filters selected</span>
            )}
          </div>

          {/* Clear Button */}
          <div className="text-right">
            <button
              onClick={clearFilters}
              disabled={filters.length === 0}
              className={`text-sm font-medium underline ${
                filters.length > 0
                  ? 'text-teal-600 hover:text-teal-800'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Dropdown */}
        <div className="mb-4">
          <label htmlFor="role-filter" className="mr-2 font-bold">
            Filter by:
          </label>
          <select
            id="role-filter"
            value={selectedRole}
            onChange={handleRoleChange}
            className="p-2 rounded border border-gray-300"
          >
            <option value="all">All</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <svg
              className="animate-spin h-10 w-10 text-teal-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        ) : (
          <>
            {/* Job Cards */}
            {roleFilteredJobs.map((job) => (
              <div
                key={job.id}
                className={`bg-white p-6 rounded shadow-md hover:shadow-lg transition-shadow mt-5 flex flex-col md:flex-row items-start gap-4 border-l-4 ${
                  job.featured ? 'border-teal-500' : 'border-transparent'
                }`}
              >
                {/* Logo */}
                <img
                  src={job.logo}
                  alt={`${job.company} logo`}
                  className="w-16 h-16 -mt-10 md:mt-0 md:static"
                />

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-1">
                    <h3 className="text-teal-500 font-bold text-sm">{job.company}</h3>
                    {job.new && (
                      <span className="bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">
                        New!
                      </span>
                    )}
                    {job.featured && (
                      <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">{job.position}</h2>
                  <div className="text-gray-400 text-sm mt-1 flex gap-3">
                    <span>{job.postedAt}</span>
                    <span>•</span>
                    <span>{job.contract}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 mt-4 md:mt-0 md:ml-auto border-t md:border-t-0 pt-4 md:pt-0">
                  {[job.role, job.level, ...job.languages, ...job.tools].map((tag) => (
                    <span
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="bg-teal-50 text-teal-700 font-bold text-sm px-3 py-1 rounded cursor-pointer hover:bg-teal-500 hover:text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
