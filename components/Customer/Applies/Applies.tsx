'use client'
import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import axios from "axios";
import API_URL from "@/config";
import { CustomerContext } from '../../../app/Dashboards/Customer/page';
import './Applies.scss'

interface CandidateJobs {
    id: number;
    status: string;
    cv: string;
    diploma: string;
    coverLetter: string;
    candidate: {
        firstName: string;
        lastName: string;
    }
}

interface CandidateFiles {
    [candidateId: number]: {
        resume: File | null;
        diploma: File | null;
    };
}

const Applies = () => {
  const { token, customerId } = useContext(CustomerContext);
  const [candidateJobsData, setCandidateJobsData] = useState<CandidateJobs[]>([]);
  const [candidateFiles, setCandidateFiles] = useState<CandidateFiles>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingFiles, setLoadingFiles] = useState<Set<number>>(new Set());

  // Optimized accept handler
  const handleAccept = useCallback(async (id: number) => {
    if (!token) return;

    // Optimistic update
    setCandidateJobsData(prevJobs => 
      prevJobs.map(job => job.id === id ? { ...job, status: "accept" } : job)
    );

    try {
      await axios.put(
        `${API_URL}/api/v1/jobs/candidate-jobs/status/accept/${id}`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      swal("Accepted")
    } catch (error) {
      console.error('Error accepting candidate:', error);
      // Revert on error
      setCandidateJobsData(prevJobs => 
        prevJobs.map(job => job.id === id ? { ...job, status: "pending" } : job)
      );
    }
  }, [token]);

  // Optimized refuse handler
  const handleRefuse = useCallback(async (id: number) => {
    if (!token) return;

    // Optimistic update
    setCandidateJobsData(prevJobs => 
      prevJobs.map(job => job.id === id ? { ...job, status: "refuse" } : job)
    );

    try {
      await axios.put(
        `${API_URL}/api/v1/jobs/candidate-jobs/status/refuse/${id}`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      swal("Refused")
    } catch (error) {
      console.error('Error refusing candidate:', error);
      // Revert on error
      setCandidateJobsData(prevJobs => 
        prevJobs.map(job => job.id === id ? { ...job, status: "pending" } : job)
      );
    }
  }, [token]);

  // Optimized file fetching
  const fetchFile = useCallback(async (url: string, fileName: string): Promise<File | null> => {
    if (!token) return null;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      return new File([blob], String(fileName.split('/').pop()), { type: blob.type });
    } catch (error) {
      console.error('Error fetching file:', error);
      return null;
    }
  }, [token]);

  // Lazy load files only when needed
  const loadCandidateFiles = useCallback(async (candidateId: number) => {
    if (!token || loadingFiles.has(candidateId) || candidateFiles[candidateId]) return;

    setLoadingFiles(prev => new Set(prev).add(candidateId));

    try {
      const candidateJob = candidateJobsData.find(cj => cj.id === candidateId);
      if (!candidateJob) return;

      const [resumeFile, diplomaFile] = await Promise.all([
        fetchFile(`${API_URL}/api/v1/jobs/candidate-jobs/cv/${candidateId}`, candidateJob.cv),
        fetchFile(`${API_URL}/api/v1/jobs/candidate-jobs/diploma/${candidateId}`, candidateJob.diploma)
      ]);

      setCandidateFiles(prev => ({
        ...prev,
        [candidateId]: {
          resume: resumeFile,
          diploma: diplomaFile
        }
      }));
    } catch (error) {
      console.error('Error loading candidate files:', error);
    } finally {
      setLoadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(candidateId);
        return newSet;
      });
    }
  }, [token, candidateJobsData, candidateFiles, loadingFiles, fetchFile]);

  // Fetch candidate jobs only once
  useEffect(() => {
    if (!token || !customerId || candidateJobsData.length > 0) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_URL}/api/v1/jobs/candidate-jobs/candidatejobsByCustomer/${customerId}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        setCandidateJobsData(response.data || []);
      } catch (error) {
        console.error('Error fetching candidate jobs:', error);
        setError('Failed to load applications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, customerId]); // Removed candidateJobsData from dependencies

  // Loading state
  if (isLoading) {
    return (
      <div className="jobs">
        <h1>Applies</h1>
        <div className='loading-state'>Loading applications...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="jobs">
        <h1>Applies</h1>
        <div className='error-state'>{error}</div>
      </div>
    );
  }

  // Empty state
  if (candidateJobsData.length === 0) {
    return (
      <div className="jobs">
        <h1>Applies</h1>
        <div className='empty-state'>No applications yet</div>
      </div>
    );
  }

  return (
    <div className="jobs">
      <h1>Applies</h1>
      <div className='lists'>
        {candidateJobsData.map((cj) => (
          <div key={cj.id} className="list">
            <span>Candidate: </span>
            {cj.candidate.firstName} {cj.candidate.lastName}
            <br />
            <span>Status: </span>{cj.status}
            
            <div>
              <label>CV:</label>
              <div className="files">
                {candidateFiles[cj.id]?.resume ? (
                  <a
                    href={URL.createObjectURL(candidateFiles[cj.id]?.resume as Blob)}
                    download={candidateFiles[cj.id]?.resume?.name || 'CV.pdf'}
                  >
                    Download CV
                  </a>
                ) : (
                  <button 
                    onClick={() => loadCandidateFiles(cj.id)}
                    disabled={loadingFiles.has(cj.id)}
                  >
                    {loadingFiles.has(cj.id) ? 'Loading...' : 'Load CV'}
                  </button>
                )}
              </div>
            </div>

            <div>
              <label>Diploma:</label>
              <div className="files">
                {candidateFiles[cj.id]?.diploma ? (
                  <a
                    href={URL.createObjectURL(candidateFiles[cj.id]?.diploma as Blob)}
                    download={candidateFiles[cj.id]?.diploma?.name || 'diploma.pdf'}
                  >
                    Download Diploma
                  </a>
                ) : (
                  <button 
                    onClick={() => loadCandidateFiles(cj.id)}
                    disabled={loadingFiles.has(cj.id)}
                  >
                    {loadingFiles.has(cj.id) ? 'Loading...' : 'Load Diploma'}
                  </button>
                )}
              </div>
            </div>

                <div className="flex">
             {cj.status !== "accept" && (
              <button  style={{ backgroundColor: "green" }} onClick={() => handleAccept(cj.id)}>Accept</button>
            )}
            {cj.status !== "refuse" && (
              <button  style={{ backgroundColor: "red" }} onClick={() => handleRefuse(cj.id)}>Refuse</button>
            )}
                </div>
           
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applies;