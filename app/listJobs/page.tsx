'use client'
import Image from 'next/image'
import ListImage from '@/public/images/listjobs.png'
import SearchImage from '@/public/images/search1.png'
import Search2Image from '@/public/images/search.png'
import service2 from '@/public/images/service2.svg'
import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
import './style.scss';
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'

interface Job {
  id: number;
  name: string;
  description: string;
  numberOfPositions: number;
  closeDate: string;
}

var c=0;

const ListJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  // Fonction de recherche
  const handleSearch = () => {
    c=1;
    const filtered = jobsData.filter((job) =>
      job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  };
  const [jobsData, setJobsData] = useState<Job[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:7777/api/v1/jobs/list');

        setJobsData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, []);
  interface RepeatClassNTimesProps {
    className: string;
    n: number;
    jobsData: Job[];
  }

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, jobsData }) => {
    if(c==0){
      return(
        <>
        {jobsData.map((job) => (
          <div key={job.id} className={className}>
          <h1>{job.name} :</h1>
          <p>
            Description: {job.description} <br/> Number of positions: {job.numberOfPositions} 
          </p>
          <p>Close Date: {job.closeDate}</p>
          <button onClick={handleApplyClick}>Apply</button>
          {showPanel && (
      <div className="job-panel">
        <h2>{jobDetails.name}</h2>
        <p>{jobDetails.description}</p>
        <button onClick={handleClosePanel}>Close</button>
      </div>
    )}
        </div>
        ))}
        </>
      )
    }
    else{
      return (
      <>
        {filteredJobs.map((job) => (
          <div key={job.id} className={className}>
            <h1>{job.name} :</h1>
            <p>
              Description: {job.description} <br/> Number of positions: {job.numberOfPositions} 
            </p>
            <p>Close Date: {job.closeDate}</p>
            <button onClick={handleApplyClick}>Apply</button>
            {showPanel && (
        <div className="job-panel">
          <h2>{jobDetails.name}</h2>
          <p>{jobDetails.description}</p>
          <button onClick={handleClosePanel}>Close</button>
        </div>
      )}
          </div>
        ))}
      </>
      );
    }
  };
  
  const [showPanel, setShowPanel] = useState(false);

  const jobDetails = {
    name: 'Titre de l\'emploi',
    description: 'Description détaillée de l\'emploi...'
  };

  const handleApplyClick = () => {
    setShowPanel(true);
  };

  const handleClosePanel = () => {
    setShowPanel(false);
  };
    return (
    <ThemeProvider enableSystem={true} attribute="class">
        <Navbar/>
            <div className='listJobs'>
                <div className='container'>
                  <div className='header'>
                    <h1>List Jobs</h1>
                    <div className='search'>
                    <label htmlFor='search'>Search</label>
        <div className='search-input'>
        <input
          type='search'
          name='search'
          id='search'
          placeholder='search jobs'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          required
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>
        <Image
                      src={SearchImage}
                      width={45}
                      height={45}
                      alt='image of service'
                    />
        </button>
        </div>
                    </div>
                    <div className='list-image'>
                    <Image
                      src={ListImage}
                      width={380}
                      height={360}
                      alt='image of service'
                    />
                    </div>
                  </div>
                    <div className='lists'>
                        <RepeatClassNTimes className="list" n={jobsData.length} jobsData={jobsData} />
                    </div>
                </div>
            </div>
    </ThemeProvider>
    );
  }
  
  export default ListJobs;