import './jobs.scss'
import { useState, useEffect, useContext, useCallback } from "react"
import axios from 'axios'
import React from 'react';
import API_URL from '@/config';
import Modal from './ModalJobs/ModalJobs';
import { CustomerContext } from '../../../app/Dashboards/Customer/page';

interface Job {
  id: number;
  name: string;
  description: string;
  minSalary: number;
  maxSalary: number;
  type: string;
  openDate: string;
  closeDate: string; 
  numberOfPositions: number;
  address: string;
  remoteStatus: string;
  degrees: string[];
}

const Jobs = () => {
  const { token, customerId } = useContext(CustomerContext);
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Optimized delete handler with callback
  const handleDelete = useCallback(async (e: React.MouseEvent, idJ: number) => {
    e.preventDefault();
    
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/api/v1/jobs/${idJ}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Update local state instead of refetching
      setJobsData(prevJobs => prevJobs.filter(job => job.id !== idJ));
    } catch (error) {
      console.error('Error deleting job:', error);
      setError('Failed to delete job');
    }
  }, [token]);

  // Optimized modify handler
  const handleModifyClick = useCallback((e: React.MouseEvent, job: Job) => {
    e.preventDefault();
    setSelectedJob(job);
    setModalOpen(true);
  }, []);

  // Close modal handler
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedJob(null);
  }, []);

  // Fetch jobs only once
  useEffect(() => {
    // Skip if already loaded or no valid context
    if (!token || !customerId || jobsData.length > 0) return;

    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_URL}/api/v1/jobs/byCustomer/${customerId}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        setJobsData(response.data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [token, customerId]); // Removed jobsData from dependencies

  // Loading state
  if (isLoading) {
    return (
      <div className='jobs'>
        <h1>My jobs</h1>
        <div className='loading-state'>Loading jobs...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='jobs'>
        <h1>My jobs</h1>
        <div className='error-state'>{error}</div>
      </div>
    );
  }

  // Empty state
  if (jobsData.length === 0) {
    return (
      <div className='jobs'>
        <h1>My jobs</h1>
        <div className='empty-state'>No jobs found. Create your first job!</div>
      </div>
    );
  }

  return (
    <div className='jobs'>
      <h1>My jobs</h1>
      <div className='lists'>
        {jobsData.map((job) => (
          <div key={job.id} className="list">
            <h1>{job.name}</h1>
            <span>Type: </span>{job.type}
            <p><span>Number of positions: </span>{job.numberOfPositions}</p>
            <p><span>Close Date: </span>{job.closeDate}</p>
            <button onClick={(e) => handleDelete(e, job.id)}>Delete</button>
            <button onClick={(e) => handleModifyClick(e, job)}>Modify</button>
          </div>
        ))}
      </div>

      {modalOpen && selectedJob && (
        <Modal 
          isOpen={modalOpen}
          id={selectedJob.id}
          jobTitle={selectedJob.name}
          minSalary={selectedJob.minSalary}
          maxSalary={selectedJob.maxSalary}
          positionNumber={selectedJob.numberOfPositions}
          openDate={selectedJob.openDate}
          endDate={selectedJob.closeDate}
          address={selectedJob.address}
          status={selectedJob.remoteStatus}
          type={selectedJob.type}
          description={selectedJob.description}
          degrees={selectedJob.degrees}
          onClose={handleCloseModal}
          setJobData={setJobsData}
        />
      )}
    </div>
  );
}

export default Jobs;