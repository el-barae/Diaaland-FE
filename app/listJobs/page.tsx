'use client'

import Image from 'next/image'
import ListImage from '@/public/images/listjobs.png'
import SearchImage from '@/public/images/search1.png'
import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
import './style.scss';
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'
import Modal from './Modal/Modal'
import API_URL from '@/config'

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
    const authToken = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL+"/api/v1/jobs/list", {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
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
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentId, setCurrentId] = useState(0);
  const [currentName, setCurrentName] = useState("");

  const handleApplyClick = (id:number, name:string, description: string) => {
    setCurrentDescription(description);
    setCurrentId(id);
    setCurrentName(name);
    setModalOpen(true);
  };

      if(jobsData.length != 0)
      return(
        <>
        {jobsData.map((job) => (
          <div key={job.id} className={className}>
          <h1>{job.name} :</h1>
          <p>
            <br/> Number of positions: {job.numberOfPositions} 
          </p>
          <p>Close Date: {job.closeDate}</p>
          <button onClick={() => handleApplyClick(job.id, job.name, job.description)}>View</button>
          <Modal isOpen={modalOpen} id={currentId} name={currentName} description={currentDescription} onClose={() => setModalOpen(false)}/>
        </div>
        ))}
        </>
      )
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