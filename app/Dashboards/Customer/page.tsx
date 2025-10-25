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
import {jwtDecode} from "jwt-decode";

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

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const email = decoded.sub;

      // Marquer les messages comme vus
      await axios.put(`${API_URL}/api/v1/users/messages/mark-viewed/${email}`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
        .catch(error => {
          console.error('Erreur lors du marquage des messages :', error);
        });

      setNotif(false);

      // Récupérer les messages de l'utilisateur
      const response = await axios.get(`${API_URL}/api/v1/users/messages/recipient/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessagesData(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  const handleDelete = async (e: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded: any = jwtDecode(token);
      const email = decoded.sub;

      await axios.delete(`${API_URL}/api/v1/users/messages/recipient/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedMessagesData = messagesData.filter(
        (m: any) => m.email !== email
      );
      setMessagesData(updatedMessagesData);
    } catch (error) {
      console.error("Erreur lors de la suppression des messages :", error);
    } finally {
      // Fermer le menu après suppression
      setIsOpen(!isOpen);
    }
  };

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
        const token = localStorage.getItem("token");
        if (!token) {
          swal("Authentication required", "", "error");
          router.push("/");
          return;
        }

        try {
          // ✅ Décodage du token JWT
          const decoded: any = jwtDecode(token);
          const role = decoded.role;
          const email = decoded.sub; 
          const id = decoded.id;
          const name = decoded.name;
          setCustomer(name);

          // ✅ Vérification du rôle
          if (role !== "CUSTOMER" && role !== "ADMIN") {
            swal("Authenticate yourself when you are a CUSTOMER", "", "error");
            router.push("/");
            return;
          }

          // ✅ Chargement des données
          const fetchCustomerData = async () => {
            try {
              // Récupération des notifications (messages)
              const resNotif = await axios.get(
                `${API_URL}/api/v1/users/messages/viewed/${email}`
              , {
                  headers: { Authorization: `Bearer ${token}` },
                });
              setNotif(resNotif.data);

              // Vérification du matching en cours
              const matching = localStorage.getItem("matching");
              if (matching) {
                const resp = await axios.get(`${API_URL}/api/v1/jobs/lastJobId`, {
                  headers: { Authorization: `Bearer ${token}` },
                });

                const jobId = resp.data; // inutile de stringify ici
                swal("The matching process is currently running.");

                await axios.get(`${API_URL}/api/v1/jobs/matching/byJob/${jobId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });

                localStorage.removeItem("matching");
              }

              setTimeout(() => setLoading(false), 1500);
            } catch (error) {
              console.error("Erreur lors de la récupération des données :", error);
            }
          };

          fetchCustomerData();
        } catch (error) {
          console.error("Erreur de décodage du token :", error);
          swal("Invalid token", "", "error");
          router.push("/");
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

