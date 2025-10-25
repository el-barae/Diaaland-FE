'use client'
import React from 'react';
import './style.scss';
import { useState ,useEffect} from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'
import Jobs from '@/components/Candidate/Jobs/Jobs'
import Favoris from '@/components/Candidate/Favoris/Favoris';
import Profile from '@/components/Candidate/Profile/Profile';
import Skills from '@/components/Candidate/Skills/Skills';
import Projects from '@/components/Candidate/Projects/Projects';
import Ex from '@/components/Candidate/Experiances/Ex';
import Links from '@/components/Candidate/Links/Links';
import Matches from '@/components/Candidate/ Matches/Matches'
import Image from 'next/image'
import Notif from '@/public/images/notif.png'
import swal from 'sweetalert';
import API_URL from '@/config';
import {jwtDecode} from "jwt-decode";

interface Message {
  id: number;
  email: string;
  subject: string;
  message: string;
  date: string;
}

const Candidate = () => {
  var [x,setX] = useState("Skills"); 
  const [candidateData,setCandidateData] = useState('');
  const handleClick = (value : string) => {
    setX(value);
    y();
  };
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [notif,setNotif] = useState(false); 
  const [messagesData, setMessagesData] = useState<Message[]>([]);
  const handleFindClick = () =>{
    router.push("../listJobs");
  }

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

  const router = useRouter();

  const y = () => {
    if (x === "Profile"){ 
      return <Profile />;
    }
    if (x === "Jobs") {
      return <Jobs />;
    }
    if (x === "Favoris") {
      return <Favoris />;
    }
    if (x === "Skills") {
      return <Skills />;
    }
    if (x === "Projects") {
      return <Projects />;
    }
    if (x === "Ex") {
      return <Ex />;
    }
    if (x === "Links") {
      return <Links />;
    }
    if (x === "Matches") {
      return <Matches/>;
    }
  };

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
        setCandidateData(name);

        // ✅ Vérification du rôle
        if (role !== "CANDIDAT" && role !== "ADMIN") {
          swal("Authenticate yourself when you are a CANDIDATE", "", "error");
          router.push("/");
          return;
        }

        // ✅ Fonction pour charger les données
        const fetchData = async () => {
          try {

            // Vérifier si des messages ont été vus
            const resNotif = await axios.get(`${API_URL}/api/v1/users/messages/viewed/${email}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
            setNotif(resNotif.data);

            // Vérifier le matching en cours
            const matching = localStorage.getItem("matching");
            if (matching) {
              swal("The matching process is currently running.");
              await axios.get(`${API_URL}/api/v1/jobs/matching/byCandidate/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              localStorage.removeItem("matching");
            }

            setTimeout(() => setLoading(false), 500);
          } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
          }
        };

        fetchData();
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
            <div className='Candidate'>
              <div className='header'>
                {candidateData}
                <button type="button" className="button" onClick={handleFindClick}>Find job</button>
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
                  <button onClick={() => handleClick("Favoris")}>Favoris</button>
                  <button onClick={() => handleClick("Skills")}>Skills</button>
                  <button onClick={() => handleClick("Projects")}>Projects</button>
                  <button onClick={() => handleClick("Ex")}>Xp</button>
                  <button onClick={() => handleClick("Links")}>Links</button>
                  <button onClick={() => handleClick("Matches")}>Matches</button>
                </div>
                <div className='Candidate-box'>
                    {y()}
                </div>
              </div>
            </div>
            )}
            {loading && (
                <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            )}
        </ThemeProvider>
    );
  }
  
  export default Candidate;

