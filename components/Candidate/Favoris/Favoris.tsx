'use client'
import './favoris.scss'
import React from 'react';
import axios from 'axios'
import API_URL from '@/config'
import { useCandidateContext } from '@/contexts/CandidateContext'
import { useAPIMutation } from '@/hooks/useOptimizedAPI'

interface Job {
    id: number;
    name: string;
    description: string;
    numberOfPositions: number;
    closeDate: string;
}

interface RepeatClassNTimesProps {
    className: string;
    n: number;
    jobsData: Job[];
}

const Favoris = () => {
  // Utiliser le context
  const { favoris, candidateId, refreshFavoris } = useCandidateContext();

  // Mutation pour la candidature
  const applyMutation = useAPIMutation(
    async (jobId: number) => {
      const token = localStorage.getItem("token");
      return axios.post(
        `${API_URL}/api/v1/jobs/candidate-jobs`,
        {
          status: "pending",
          candidate: { id: candidateId },
          job: { id: jobId },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    {
      onSuccess: () => {
        alert("Application sent successfully!");
      },
      onError: (error) => {
        console.error("Error during job application:", error);
        alert("Failed to apply for job");
      },
      invalidatePatterns: ['candidate-jobs'] // Invalider le cache des jobs
    }
  );

  // Mutation pour supprimer un favori
  const deleteFavorisMutation = useAPIMutation(
    async (jobId: number) => {
      const token = localStorage.getItem("token");
      return axios.delete(`${API_URL}/api/v1/jobs/favoris/${candidateId}/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: async () => {
        // Rafraîchir la liste après suppression
        await refreshFavoris();
      },
      onError: (error) => {
        console.error("Erreur lors de la suppression du favori :", error);
      },
      invalidatePatterns: ['favoris'] // Invalider le cache des favoris
    }
  );

  const handleApply = async (e: any, jobId: number) => {
    e.preventDefault();
    if (!candidateId) {
      alert("Please log in again.");
      return;
    }
    await applyMutation.mutate(jobId);
  };

  const handleDelFavoris = async (e: any, jobId: number) => {
    e.preventDefault();
    await deleteFavorisMutation.mutate(jobId);
  };

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, jobsData }) => {
    if (jobsData.length !== 0)
      return (
        <>
          {jobsData.map((job) => (
            <div key={job.id} className={className}>
              <h1>{job.name} :</h1>
              <p>
                Description: {job.description} <br /> Number of positions: {job.numberOfPositions}
              </p>
              <p>Close Date: {job.closeDate}</p>
              <button 
                onClick={(e) => handleDelFavoris(e, job.id)}
                disabled={deleteFavorisMutation.loading}
              >
                {deleteFavorisMutation.loading ? 'Deleting...' : 'Delete'}
              </button>
              <button 
                onClick={(e) => handleApply(e, job.id)}
                disabled={applyMutation.loading}
              >
                {applyMutation.loading ? 'Applying...' : 'Apply'}
              </button>
            </div>
          ))}
        </>
      )
    return null;
  }

  return (
    <>
      <div className='jobs'>
        <h1>My favoris</h1>
        <div className='lists'>
          <RepeatClassNTimes className="list" n={favoris.length} jobsData={favoris} />
        </div>
      </div>
    </>
  );
}

export default Favoris;