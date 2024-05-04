'use client'
import Image from 'next/image'
import { useState ,useEffect} from "react"
import { useRouter } from 'next/navigation'
import axios from 'axios'
import React from 'react';
import swal from 'sweetalert'
import './style.scss';
import Profile from '@/components/Customer/Profile/Profile';
import Jobs from '@/components/Customer/Jobs/Jobs'
import Candidates from '@/components/Customer/Candidates/Candidates'
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'
import Notif from '@/public/images/notif.png'
import API_URL from '@/config';

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
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
    const [customerData, setCustomer] = useState('');
    const router = useRouter();

    var [x,setX] = useState("Profile"); 

  const handleClick = (value : string) => {
    setX(value);
    y();
  };

  const [isOpen, setIsOpen] = useState(false);
  const [notif,setNotif] = useState(2); 
  const options = ['Message 1', 'Message 2', 'Message 3'];
  const handleToggle = () => {
    setIsOpen(!isOpen);
    setNotif(0);
  };

    const y = () => {
      if (x === "Profile"){ 
        return <Profile />;
      }
      if (x === "Jobs") {
        return <Jobs />;
      }
      if (x === "Candidates") {
        return <Candidates />;
      }
    }

    useEffect(() => {
      const role = localStorage.getItem('role');
      if (role !== "CUSTOMER") {
        swal('Authenticate yourself when you are a CUSTOMER', '', 'error');
        router.push('/');
    } else {
        const fetchCustomerData = async () => {
          try {
            const response = await axios.get(API_URL+'/api/v1/customers/name/1', {
              headers: {
                'Authorization': 'Bearer ' + token
              }
            });
            
            setCustomer(response.data);
            setTimeout(() => {
              setLoading(false);
            }, 1500);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        };
        fetchCustomerData();
    }
  }, []);
    return (
      <ThemeProvider enableSystem={true} attribute="class">
      <Navbar/>
      {!loading && (
      <div className='Customer'>
              <div className='header'>
                <h1>{customerData}</h1>
                <button onClick={handleToggle}>
                <Image 
									src={Notif}
									width={50}
									height={50}
									alt="login image"
								/>
                {notif === 0 ? null : <span className="badge">{notif}</span>}
                </button>
                {isOpen && (
        <ul className="dropdown-list">
          {options.map((option) => (
            <li key={option} >
              {option}
            </li>
          ))}
        </ul>
      )}
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
        )}
        {loading && (
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        )}
  </ThemeProvider>
  )
  }
  
  export default Customer;

