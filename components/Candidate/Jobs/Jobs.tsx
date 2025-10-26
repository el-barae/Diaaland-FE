'use client'
import './jobs.scss'
import React from 'react';
import { useCandidateContext } from '@/contexts/CandidateContext'
import { useAPIMutation } from '@/hooks/useOptimizedAPI'
import API_URL from '@/config'
import axios from 'axios'

interface Job {
  id: number;
  name: string;
  type: string;
  description: string;
  numberOfPositions: number;
  closeDate: string;
}

interface RepeatClassNTimesProps {
  className: string;
  n: number;
  jobsData: Job[];
}

const Jobs = () => {
  const { jobs, candidateId, refreshJobs } = useCandidateContext();

  const deleteMutation = useAPIMutation(
    async (jobId: number) => {
      const token = localStorage.getItem("token");
      return axios.delete(`${API_URL}/api/v1/jobs/candidate-jobs/${candidateId}/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: async () => {
        await refreshJobs();
      },
      onError: (error) => {
        console.error("Error deleting job:", error);
      },
      invalidatePatterns: ['candidate-jobs']
    }
  );

  const handleDelete = async (e: any, jobId: number) => {
    e.preventDefault();
    if (!candidateId) {
      alert("Please log in again.");
      return;
    }
    await deleteMutation.mutate(jobId);
  };

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, jobsData }) => {
    if (jobsData.length !== 0)
      return (
        <>
          {jobsData.map((job) => (
            <div key={job.id} className={className}>
              <h1>{job.name}</h1>
              <span>Type: </span>{job.type}
              <p><span>Number of positions: </span>{job.numberOfPositions}</p>
              <p><span>Close Date: </span>{job.closeDate}</p>
              <button 
                onClick={(e) => handleDelete(e, job.id)}
                disabled={deleteMutation.loading}
              >
                {deleteMutation.loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </>
      )
    return null;
  }

  return (
    <div className='jobs'>
      <h1>My jobs</h1>
      <div className='lists'>
        <RepeatClassNTimes className="list" n={jobs.length} jobsData={jobs} />
      </div>
    </div>
  );
}

export default Jobs;