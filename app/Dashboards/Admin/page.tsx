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
    };
    job: {
        id: number;
    };
}

const Admin = () =>{
    const [appliedCandidatesData, setAppliedCandidatesData] = useState<appliedCandidates[]>([]);
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
 useEffect(() => {
    const fetchData1 = async () => {
      try {
        const response1 = await axios.get<appliedCandidates[]>('http://localhost:7777/api/v1/candidate-jobs');
        setAppliedCandidatesData(response1.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };
    fetchData1();
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
      if(jobsData.length != 0)
      return(
        <>
        {jobsData.map((job) => (
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
        if(appliedCandidatesData.length != 0)
        return(
          <>
          {appliedCandidatesData.map((app) => (
              <div key={app.id} >
                      <tr>
                            <td>{app.id}</td>
                            <td>{app.job.id}</td>
                            <td>{app.candidate.id}</td>
                            <td><span className="status delivered">{app.status}</span></td>
                        </tr>
              </div>
          ))}
          </>
        )
      }

    return (
        <ThemeProvider enableSystem={true} attribute="class">
            <Navbar/>
            <div className="admin">
    <div className="navigation">
        <ul>
            <li>
                <a href="#">
                    <span className="title">Dashboard</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span className="title">Jobs</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span className="title">Customers</span>
                </a>
            </li>

            <li>
                <a href="#">
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
        <div className="topbar">

            <div className="search">
                <label>
                    <input type="text" placeholder="Search here"></input>
                </label>
            </div>

            <div className="user">
            </div>
        </div>

        <div className="cardBox">
            <div className="card">
                <div>
                    <div className="numbers">1,504</div>
                    <div className="cardName">Candidates</div>
                </div>
            </div>

            <div className="card">
                <div>
                    <div className="numbers">80</div>
                    <div className="cardName">Customers</div>
                </div>
            </div>

            <div className="card">
                <div>
                    <div className="numbers">284</div>
                    <div className="cardName">Jobs</div>
                </div>
            </div>
        </div>

        <div className="details">
            <div className="recentOrders">
                <div className="cardHeader">
                    <h2>Last applied candidates</h2>
                    <a href="#" className="btn">View All</a>
                </div>

                <table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Job</td>
                            <td>Customer</td>
                            <td>Status</td>
                        </tr>
                    </thead>

                    <tbody>
                        <ListAppliedCandidates n={appliedCandidatesData.length} appliedCandidatesData={appliedCandidatesData} />
                    </tbody>
                </table>
            </div>
            <div className="recentCustomers">
            <div className="cardHeader">
                    <h2>Last jobs</h2>
            </div>
                <table>
                    <ListJobs n={jobsData.length} jobsData={jobsData} />
                </table>
            </div>
        </div>
    </div>
</div>


        </ThemeProvider>
    );
}
  
  export default Admin;

