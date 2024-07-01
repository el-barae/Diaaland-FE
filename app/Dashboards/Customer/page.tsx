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
import Applies from '@/components/Customer/Applies/Applies'
import Matches from '@/components/Customer/ Matches/Matches'
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

  interface Message {
    id: number;
    email: string;
    subject: string;
    message: string;
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
  const [loading, setLoading] = useState(true);
    const [customerData, setCustomer] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [notif,setNotif] = useState(false);
    const [messagesData, setMessagesData] = useState<Message[]>([]);
  const handleToggle = async () => {
    setIsOpen(!isOpen);
    const email = localStorage.getItem('email');
    axios.put(API_URL+'/api/v1/messages/mark-viewed/'+email)
          .catch(error => {
            console.error('Error marking messages as viewed:', error);
        });
    setNotif(false);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL+'/api/v1/messages/recipient/'+email, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });         
      setMessagesData(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
}

const handleDelete = async (e:any) =>{
  try{
    const email = localStorage.getItem('email');
  axios.delete(API_URL+'/api/v1/messages/recipient/'+email)
  const updatedMessagesData = messagesData.filter(m => m.email !== email)
      setMessagesData(updatedMessagesData)
  }catch(error) {
    console.log(error);
   };

   setIsOpen(!isOpen);
}

const handleAddClick = () =>{
  router.push("../addPost");
}

    const router = useRouter();

    var [x,setX] = useState("Profile"); 

  const handleClick = (value : string) => {
    setX(value);
    y();
  };
 
  const options = ['Message 1', 'Message 2', 'Message 3'];

    const y = () => {
      if (x === "Profile"){ 
        return <Profile />;
      }
      if (x === "Jobs") {
        return <Jobs />;
      }
      if (x === "Applies") {
        return <Applies />;
      }
      if (x === "Candidates") {
        return <Candidates />;
      }
      if (x === "Matches") {
        return <Matches/>;
      }
    }

    useEffect(() => {
      const role = localStorage.getItem('role');
      if (role !== "CUSTOMER" && role !== "ADMIN") {
        swal('Authenticate yourself when you are a CUSTOMER', '', 'error');
        router.push('/');
    } else {
        const fetchCustomerData = async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await axios.get(API_URL+'/api/v1/customers/name/1', {
              headers: {
                'Authorization': 'Bearer ' + token
              }
            });
            setCustomer(response.data);
            const email = localStorage.getItem('email');
            axios.get(API_URL+'/api/v1/messages/viewed/'+email)
          .then(response => {
            setNotif(response.data);
          });
          const matching = localStorage.getItem('matching');
          if(matching){
            const resp = await axios.get(API_URL+'/api/v1/jobs/lastJobId', {
              headers: {
                'Authorization': 'Bearer ' + token
              }
            });
            const jobId = JSON.stringify(resp.data);
            swal('The matching process is currently running.');
            axios.get(API_URL+'/api/v1/matching/byJob/'+ String(jobId), {
              headers: {
                'Authorization': 'Bearer ' + token
              }
            }).then(response => {
              localStorage.removeItem("matching");
            });
          }
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
                <button type="button" className="button" onClick={handleAddClick}>Add job</button>
                {isOpen && (
                <button className="btn" onClick={(e) => handleDelete(e)}>
                <svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" className="icon">
                <path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path>
              </svg>
              </button>)}
                <button onClick={handleToggle}>
                <Image 
									src={Notif}
									width={50}
									height={50}
									alt="login image"
								/>
                {notif === false ? null : <span className="badge">{notif}</span>}
                </button>
                {isOpen && (
        <ul className="dropdown-list">
          {messagesData.map(message => (
          <li key={message.id}>
            <p><strong>Sujet :</strong> {message.subject}</p>
            <p><strong>Message :</strong> {message.message}</p>
          </li>
        ))}
        </ul>
      )}
              </div>
              <div className='content'>
                <div className='Menu'>
                  <button onClick={() => handleClick("Profile")}>Profile</button>
                  <button onClick={() => handleClick("Jobs")}>My jobs</button>
                  <button onClick={() => handleClick("Applies")}>Applies</button>
                  <button onClick={() => handleClick("Candidates")}>Candidates</button>
                  <button onClick={() => handleClick("Matches")}>Matches</button>
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

