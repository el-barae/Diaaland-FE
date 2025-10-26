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

  // Memoized filtered data - recalculated only when dependencies change
  const filteredData = useMemo(() => {
    let filtered = matchingData;

    if (selectedCandidate?.value !== null && selectedCandidate?.value !== undefined) {
      filtered = filtered.filter(m => m.candidate.id === selectedCandidate.value);
    }

    if (selectedJob?.value !== null && selectedJob?.value !== undefined) {
      filtered = filtered.filter(m => m.job.id === selectedJob.value);
    }

    return filtered;
  }, [matchingData, selectedCandidate, selectedJob]);

  // Memoized options
  const candidateOptions = useMemo(() => [
    { value: null, label: 'All Candidates' },
    ...candidatesData.map(candidate => ({
      value: candidate.id,
      label: `${candidate.firstName} ${candidate.lastName}`
    }))
  ], [candidatesData]);

  const jobOptions = useMemo(() => [
    { value: null, label: 'All Jobs' },
    ...jobsData.map(job => ({
      value: job.id,
      label: job.name
    }))
  ], [jobsData]);

  // Optimized handlers
  const handleCandidateChange = useCallback((newValue: SingleValue<OptionType>) => {
    setSelectedCandidate(newValue);
  }, []);

  const handleJobChange = useCallback((newValue: SingleValue<OptionType>) => {
    setSelectedJob(newValue);
  }, []);

  // Fetch all data in parallel - only once
  useEffect(() => {
    if (!token || !customerId || matchingData.length > 0) return;

    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Parallel requests for better performance
        const [candidatesRes, jobsRes, matchingRes] = await Promise.all([
          axios.get(`${API_URL}/api/v1/profiles/candidates`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/api/v1/jobs/byCustomer/${customerId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/api/v1/jobs/matching/customer/${customerId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        setCandidatesData(candidatesRes.data || []);
        setJobsData(jobsRes.data || []);
        setMatchingData(matchingRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load matching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [token, customerId]); // Removed matchingData from dependencies

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
            <td>Employer</td>
            <td>Score matching</td>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((m) => (
              <tr key={m.id}>
                <td>{m.candidate?.firstName ?? 'N/A'} {m.candidate?.lastName ?? 'N/A'}</td>
                <td>{m.job?.name ?? 'N/A'}</td>
                <td>{m.job?.customer?.name ?? 'N/A'}</td>
                <td><span>{(m.score * 130).toFixed(2)}%</span></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>
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