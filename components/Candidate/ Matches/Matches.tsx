'use client'
import API_URL from "@/config"
import { useState } from "react"
import Select, { SingleValue } from "react-select"
import React from 'react';
import { useCandidateContext } from '@/contexts/CandidateContext'
import { useAPIQuery } from '@/hooks/useOptimizedAPI'
import './Matches.scss'

interface Matching {
  id: number;
  score: number;
  candidate: {
    id: number;
    firstName: string;
    lastName: string;
  };
  job: {
    id: number;
    name: string;
    customer: {
      id: number;
      name: string;
    }
  };
}

interface Job {
  id: number;
  name: string;
}

const Matches = () => {
  const { matches, candidateId } = useCandidateContext();
  const [selectedJob, setSelectedJob] = useState<SingleValue<{ value: number | null; label: string }> | null>(null);
  const [filteredData, setFilteredData] = useState<Matching[]>(matches);

  // Update filtered data when matches change
  React.useEffect(() => {
    filterMatchingData(selectedJob?.value ?? null);
  }, [matches]);

  // Charger la liste des jobs
  const { data: jobsData = [], loading: loadingJobs } = useAPIQuery<Job[]>(
    `${API_URL}/api/v1/jobs/list`,
    {
      cacheKey: 'jobs-list',
      enabled: !!candidateId
    }
  );

  interface LastCandidates {
    n: number;
    matchingData: Matching[];
  }

  const ListMatching: React.FC<LastCandidates> = ({ n, matchingData }) => {
    if (matchingData.length !== 0)
      return (
        <>
          {matchingData.map((m) => (
            <tr key={m.id}>
              <td>{m.job?.name ?? 'N/A'}</td>
              <td>{m.job?.customer?.name ?? 'N/A'}</td>
              <td><span>{(m.score * 100).toFixed(2)}%</span></td>
            </tr>
          ))}
        </>
      );
    return null;
  };

  const filterMatchingData = (jobId: number | null) => {
    let filtered = matches;

    if (jobId !== null) {
      filtered = filtered.filter((m) => m.job?.id === jobId);
    }

    setFilteredData(filtered);
  };

  const handleJobChange = (newValue: SingleValue<{ value: number | null; label: string }>) => {
    setSelectedJob(newValue);
    filterMatchingData(newValue?.value ?? null);
  };

  const jobOptions = [
    { value: null, label: 'All Jobs' },
    ...(jobsData || []).map((job: Job) => ({
      value: job.id,
      label: job.name
    }))
  ];

  return (
    <div className="cadr-matches">
      <div className="matches">
        <h2 id="Matches-h">Matches</h2>
      </div>
      <div className="sort">
        <h4>By job</h4>
        <Select
          id="jobs"
          name="jobs"
          value={selectedJob}
          onChange={handleJobChange}
          options={jobOptions}
          isLoading={loadingJobs}
        />
      </div>

      <table id="Applies">
        <thead>
          <tr>
            <td>Job</td>
            <td>Employer</td>
            <td>Score matching</td>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            <ListMatching n={filteredData.length} matchingData={filteredData} />
          ) : (
            <tr>
              <td colSpan={3}>No matching data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Matches;