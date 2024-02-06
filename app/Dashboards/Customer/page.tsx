'use client'
import Image from 'next/image'
import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
import Cookies from 'js-cookie';
import './style.scss';
import Profile from '@/components/Customer/Profile/Profile';
import Jobs from '@/components/Customer/Jobs/Jobs'
import Candidates from '@/components/Customer/Candidates/Candidates'
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'
import Notif from '@/public/images/notif.png'

interface Candidate {
    id: number;
    firstName: string;
    lastName: string;
    description: string;
    email: string;
  }
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
    candidatesData: Candidate[];
  }

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, candidatesData }) => {
      return(
        <>
        {Array.isArray(candidatesData) && candidatesData.map((candidate) => (
          <div key={candidate.id} className={className}>
          <h1>{candidate.firstName} {candidate.lastName} :</h1>
          <p>
            Description: {candidate.description} <br/> email: {candidate.email} 
          </p>
        </div>
        ))}
        </>
      )
    }
  
    interface RepeatClassJobNTimesProps {
      className: string;
      n: number;
      jobsData: Job[];
    }
  
    const RepeatClassJobNTimes: React.FC<RepeatClassJobNTimesProps> = ({ className, n, jobsData }) => {
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

const Customer = () => {
    const [candidatesData, setCandidatesData] = useState<Candidate[]>([]);
    const [jobsData, setJobsData] = useState<Job[]>([]);

    var [x,setX] = useState("Profile"); 

  const handleClick = (value : string) => {
    setX(value);
    y();
  };

    const y = () => {
      if (x === "Profile"){ 
        return <Profile />;
        console.log(x);
      }
      if (x === "Jobs") {
        return <Jobs />;
        console.log(x);
      }
      if (x === "Candidates") {
        return <Candidates />;
        console.log(x);
      }
    }

    useEffect(() => {
        const fetchCandidateData = async () => {
          try {
            const response = await axios.get('http://localhost:7777/api/v1/candidate-jobs/byJob/2');
            
            setCandidatesData(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        };
        const fetchJobData = async () => {
          try {
            Cookies.set("id","1")
            const id = Cookies.get("id");
            const response = await axios.get('http://localhost:7777/api/v1/jobs/byCustomer/'+String(id));         
            setJobsData(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        };
        fetchJobData();
  }, []);
    return (
      <ThemeProvider enableSystem={true} attribute="class">
      <Navbar/>
      <div className='Customer'>
              <div className='header'>
                <h1>Customer</h1>
                <button>
                <Image 
									src={Notif}
									width={50}
									height={50}
									alt="login image"
								/>
                </button>
              </div>
              <div className='content'>
                <div className='Menu'>
                  <button onClick={() => handleClick("Profile")}>Profile</button>
                  <button onClick={() => handleClick("Jobs")}>My jobs</button>
                  <button onClick={() => handleClick("Candidates")}>Candidates</button>
                </div>
                <div className='Customer-box'>
                   {y()} 
                </div>
              </div>
        </div>
  </ThemeProvider>
  )
  }
  
  export default Customer;

