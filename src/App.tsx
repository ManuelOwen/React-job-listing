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

  useEffect(() => {
    fetch('/data.json')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error('Failed to fetch jobs:', err));
  }, []);

  // Get all unique tags (roles, languages, tools)
  const allTags = Array.from(new Set(jobs.flatMap(job => [job.role, ...job.languages, ...job.tools])));

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

  const roleFilteredJobs = selectedRole === 'all'
    ? filteredJobs
    : filteredJobs.filter(job =>
        job.role === selectedRole ||
        job.languages.includes(selectedRole) ||
        job.tools.includes(selectedRole)
      );

  return (
    <div className="bg-[#effafa] min-h-screen px-4 py-12 md:px-24 space-y-8">
      {/* Filter Bar */}
      {filters.length > 0 && (
        <div className="bg-white shadow-md rounded px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            {filters.map((filter) => (
              <span key={filter} className="flex items-center bg-teal-100 text-teal-700 font-bold rounded overflow-hidden">
                <span className="px-2">{filter}</span>
                <button
                  onClick={() => handleRemoveFilter(filter)}
                  className="bg-teal-700 text-white px-2 hover:bg-black"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <button onClick={clearFilters} className="text-gray-700 hover:underline">
            Clear
          </button>
        </div>
      )}

      {/* Filter Tag Dropdown */}
      <div className="mb-6">
        <label htmlFor="role-filter" className="mr-2 font-bold">Filter by:</label>
        <select
          id="role-filter"
          value={selectedRole}
          onChange={handleRoleChange}
          className="p-2 rounded border border-gray-300"
        >
          <option value="all">All</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {/* Job Cards */}
      {roleFilteredJobs.map((job) => (
        <div
          key={job.id}
          className={`bg-white p-6 rounded shadow-md flex flex-col md:flex-row items-start gap-4 border-l-4 ${
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
    </div>
  );
}
