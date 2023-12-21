'use client'
import Image from 'next/image'
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

  interface RepeatClassNTimesProps {
    className: string;
    n: number;
    jobsData: Job[];
  }

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, jobsData }) => {
      return(
        <>
        {jobsData.map((job) => (
          <div key={job.id} className={className}>
          <h1>{job.name} :</h1>
          <p>
            Description: {job.description} <br/> Number of positions: {job.numberOfPositions} 
          </p>
          <p>Close Date: {job.closeDate}</p>
        </div>
        ))}
        </>
      )
    }

const Profile = () => {
    const [jobsData, setJobsData] = useState<Job[]>([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:7777/api/v1/candidate-jobs/byCandidate/1');
            
            setJobsData(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        };
        fetchData();
  }, []);
    return (
        <ThemeProvider enableSystem={true} attribute="class">
            <Navbar/>
            <div className='lists'>
                        <RepeatClassNTimes className="list" n={jobsData.length} jobsData={jobsData} />
            </div>
        </ThemeProvider>
    );
  }
  
  export default Profile;

