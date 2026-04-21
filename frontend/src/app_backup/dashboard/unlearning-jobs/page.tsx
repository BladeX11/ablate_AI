"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function UnlearningJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Unlearning Jobs</h1>
      <div className="bg-slate-900 rounded-xl p-4">
        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-2">ID</th>
                <th className="p-2">Status</th>
                <th className="p-2">Target</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} className="border-b border-slate-800/50">
                  <td className="p-2">{job.id}</td>
                  <td className="p-2">{job.status}</td>
                  <td className="p-2">{job.target_data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
