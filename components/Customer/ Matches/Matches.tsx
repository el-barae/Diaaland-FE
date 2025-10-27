'use client'
import API_URL from "@/config"
import axios from "axios"
import { useState, useEffect, useContext, useMemo, useCallback } from "react"
import Select, { SingleValue } from "react-select"
import './Matches.scss'
import { CustomerContext } from '../../../app/Dashboards/Customer/page';

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

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
}

interface Job {
  id: number;
  name: string;
}

type OptionType = { value: number | null; label: string };

const Matches = () => {
  const { token, customerId } = useContext(CustomerContext);
  const [candidatesData, setCandidatesData] = useState<Candidate[]>([]);
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [matchingData, setMatchingData] = useState<Matching[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCandidate, setSelectedCandidate] = useState<SingleValue<OptionType>>(null);
  const [selectedJob, setSelectedJob] = useState<SingleValue<OptionType>>(null);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    let filtered = matchingData;

    if (selectedCandidate?.value !== null && selectedCandidate?.value !== undefined) {
      filtered = filtered.filter(m => m.candidate?.id === selectedCandidate.value);
    }

    if (selectedJob?.value !== null && selectedJob?.value !== undefined) {
      filtered = filtered.filter(m => m.job?.id === selectedJob.value);
    }

    return filtered;
  }, [matchingData, selectedCandidate, selectedJob]);

  // Memoized options - extract from matching data directly
  const candidateOptions = useMemo(() => {
    const uniqueCandidates = Array.from(
      new Map(
        matchingData
          .filter(m => m.candidate)
          .map(m => [m.candidate.id, m.candidate])
      ).values()
    );

    return [
      { value: null, label: 'All Candidates' },
      ...uniqueCandidates.map(candidate => ({
        value: candidate.id,
        label: `${candidate.firstName} ${candidate.lastName}`
      }))
    ];
  }, [matchingData]);

  const jobOptions = useMemo(() => {
    const uniqueJobs = Array.from(
      new Map(
        matchingData
          .filter(m => m.job)
          .map(m => [m.job.id, m.job])
      ).values()
    );

    return [
      { value: null, label: 'All Jobs' },
      ...uniqueJobs.map(job => ({
        value: job.id,
        label: job.name
      }))
    ];
  }, [matchingData]);

  // Optimized handlers
  const handleCandidateChange = useCallback((newValue: SingleValue<OptionType>) => {
    setSelectedCandidate(newValue);
  }, []);

  const handleJobChange = useCallback((newValue: SingleValue<OptionType>) => {
    setSelectedJob(newValue);
  }, []);

  // Fetch matching data with enriched candidate/job details
  useEffect(() => {
    if (!token || !customerId) return;

    const fetchMatchingData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Use the new endpoint that returns enriched data
        const response = await axios.get(
          `${API_URL}/api/v1/jobs/matching/customer/${customerId}/details`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        setMatchingData(response.data || []);
      } catch (error) {
        console.error('Error fetching matching data:', error);
        setError('Failed to load matching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchingData();
  }, [token, customerId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="cadr-matches">
        <div className="matches">
          <h2 id="Matches-h">Matches</h2>
        </div>
        <div className='loading-state'>Loading matches...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="cadr-matches">
        <div className="matches">
          <h2 id="Matches-h">Matches</h2>
        </div>
        <div className='error-state'>{error}</div>
      </div>
    );
  }

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
        />
        
        <h4>By Candidate</h4>
        <Select
          id="candidates"
          name="candidates"
          value={selectedCandidate}
          onChange={handleCandidateChange}
          options={candidateOptions}
        />
      </div>

      <table id="Applies">
        <thead>
          <tr>
            <td>Candidate</td>
            <td>Job</td>
            <td>Score matching</td>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((m) => (
              <tr key={m.id}>
                <td>
                  {m.candidate 
                    ? `${m.candidate.firstName} ${m.candidate.lastName}` 
                    : 'N/A'}
                </td>
                <td>{m.job?.name ?? 'N/A'}</td>
                <td><span>{(m.score * 100).toFixed(2)}%</span></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>
                {matchingData.length === 0 ? 'No matches available' : 'No matches found for selected filters'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Matches;