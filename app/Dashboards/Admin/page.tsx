'use client'
import Image from 'next/image'
import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
import Cookies from 'js-cookie';
import './style.scss';
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'
import Candidate from '../Candidate/page';
import API_URL from '@/config';
import Jobs from '@/components/Admin/jobs/jobs'
import Dashboard from '@/components/Admin/Dashboard/Dashboard'
import Candidates from '@/components/Admin/Candidates/Candidates'

interface Job {
    id: number;
    name: string;
    description: string;
    numberOfPositions: number;
    closeDate: string;
   }
interface appliedCandidates{
    id: number;
    status: string;
    candidate: {
        id: number;
        firstName: string;
        lastName: string;
    };
    job: {
        id: number;
        name: string;
    };
}

function getStatusClass(status: string) {
    switch (status) {
      case 'refuse':
        return 'delivered-refuse';
      case 'accept':
        return 'delivered-accept';
      case 'en attends':
        return 'delivered-enattends';
      default:
        return 'delivered';
    }
  }

const Admin = () =>{
    const [appliedCandidatesData, setAppliedCandidatesData] = useState<appliedCandidates[]>([]);
    const [jobsData, setJobsData] = useState<Job[]>([]);
    const [countJobs, setCountJobs] = useState(0);
    const [countCandidates, setCountCandidates] = useState(0);
    const [countCustomers, setCountCustomers] = useState(0);
    const [status, setStatus] = useState('refuse');
    var [x,setX] = useState("Dashboard");

    const handleClick = (value : string) => {
        setX(value);
        y();
      };

      const y = () => {
        if (x === "Jobs") {
          return <Jobs />;
        }
        if (x === "Dashboard") {
            return <Dashboard/>;
          }
          if (x === "Candidates") {
            return <Candidates/>;
          }
      }
    
 useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL+'/api/v1/jobs/list');
        setJobsData(response.data);
        const countJ = await axios.get(API_URL+'/api/v1/admin/jobs');
        setCountJobs(countJ.data);
        const countCa = await axios.get(API_URL+'/api/v1/admin/candidates');
        setCountCandidates(countCa.data);
        const countCu = await axios.get(API_URL+'/api/v1/admin/customers');
        setCountCustomers(countCu.data);
        const response1 = await axios.get<appliedCandidates[]>(API_URL+'/api/v1/candidate-jobs');
        setAppliedCandidatesData(response1.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };
    fetchData();
 }, []);

 interface LastJobs {
    n: number;
    jobsData: Job[];
 }
 interface LastCandidates {
    n: number;
    appliedCandidatesData: appliedCandidates[];
 }

    const ListJobs: React.FC<LastJobs> = ({ n, jobsData }) => {
        const lastjobsData = jobsData.slice(-4);
      if(lastjobsData.length != 0)
      return(
        <>
        {lastjobsData.map((job) => (
            <div key={job.id} >
                    <tr>
                        <td width="60px">
                            <div className="imgBx"></div>
                        </td>
                        <td>
                            <h4>{job.name}<br/> <span>{job.numberOfPositions}</span></h4>
                        </td>
                    </tr>
            </div>
        ))}
        </>
      )
    }

    const ListAppliedCandidates: React.FC<LastCandidates> = ({ n, appliedCandidatesData }) => {
        const lastFourCandidateJobs = appliedCandidatesData.slice(-4);

        return (
            <>
                {lastFourCandidateJobs.map((candidateJob) => (
                    <tr key={candidateJob.id}>
                        <td>{candidateJob.candidate.firstName} {candidateJob.candidate.lastName}</td>
                        <td>{candidateJob.job.name}</td>
                        <td>{candidateJob.candidate.firstName}</td>
                        <td><span className={getStatusClass(candidateJob.status)}>{candidateJob.status}</span></td>
                    </tr>
                ))}
            </>
        );
      }

    return (
        <ThemeProvider enableSystem={true} attribute="class">
            <Navbar/>
            <div className="admin">
    <div className="navigation">
        <ul>
            <li>
                <a href="#" onClick={() => handleClick("Dashboard")}>
                    <span className="title">Dashboard</span>
                </a>
            </li>

            <li>
                <a href="#" onClick={() => handleClick("Jobs")}>
                    <span className="title">Jobs</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span className="title">Customers</span>
                </a>
            </li>

            <li>
                <a href="#" onClick={() => handleClick("Candidates")}>
                    <span className="title">Candidates</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span className="title">Matches</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span className="title">Settings</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span className="title">Messages</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span className="title">Report</span>
                </a>
            </li>
        </ul>
    </div>
    <div className="main">
        {y()}
    </div>
</div>


        </ThemeProvider>
    );
}
  
  export default Admin;

