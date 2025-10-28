'use client'
import React from 'react';
import './style.scss';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ThemeProvider } from 'next-themes'
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
import { jwtDecode } from "jwt-decode";
import { CandidateProvider, useCandidateContext } from '@/contexts/CandidateContext'
import { MatchingStatusBanner } from './MatchingStatusBanner';

interface Message {
  id: number;
  email: string;
  subject: string;
  message: string;
  date: string;
}

const CandidateContent = () => {
  const [x, setX] = useState("Skills");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [notif, setNotif] = useState(false);
  const [messagesData, setMessagesData] = useState<Message[]>([]);
  const router = useRouter();

  // Utiliser le context
  const { candidateName, candidateEmail, candidateId } = useCandidateContext();

  const handleClick = (value: string) => {
    setX(value);
  };

  const handleFindClick = () => {
    router.push("../listJobs");
  }

  const handleToggle = async () => {
    setIsOpen(!isOpen);

    const token = localStorage.getItem("token");
    if (!token || !candidateEmail) return;

    try {
      // Marquer les messages comme vus
      await axios.put(`${API_URL}/api/v1/users/messages/mark-viewed/${candidateEmail}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .catch(error => {
          console.error('Erreur lors du marquage des messages :', error);
        });

      setNotif(false);

      // Récupérer les messages de l'utilisateur
      const response = await axios.get(`${API_URL}/api/v1/users/messages/recipient/${candidateEmail}`, {
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
      if (!token || !candidateEmail) return;

      await axios.delete(`${API_URL}/api/v1/users/messages/recipient/${candidateEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedMessagesData = messagesData.filter(
        (m: any) => m.email !== candidateEmail
      );
      setMessagesData(updatedMessagesData);
    } catch (error) {
      console.error("Erreur lors de la suppression des messages :", error);
    } finally {
      setIsOpen(!isOpen);
    }
  };

  const y = () => {
    if (x === "Profile") {
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
      return <Matches />;
    }
  };

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    swal("Authentication required", "", "error");
    router.push("/");
    return;
  }

  // Decode token safely
  let decoded: any;
  try {
    decoded = jwtDecode(token);
  } catch (error) {
    console.error("Erreur de décodage du token :", error);
    swal("Invalid token", "", "error");
    router.push("/");
    return;
  }

  const role = decoded.role;

  // ✅ Vérification stricte du rôle
  if (role !== "CANDIDAT" && role !== "ADMIN") {
    swal("Authenticate yourself when you are a CANDIDATE", "", "error");
    router.push("/");
    return;
  }

  // ✅ Attendre que les infos du candidat soient bien chargées
  if (!candidateEmail || !candidateId) {
    return; // do nothing until context is ready
  }

  const fetchData = async () => {
    try {
      // Vérifier si des messages ont été vus
      const resNotif = await axios.get(
        `${API_URL}/api/v1/users/messages/viewed/${candidateEmail}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotif(resNotif.data);

      // Vérifier le matching en cours
      // const matching = localStorage.getItem("matching");
      // if (matching) {
      //           localStorage.removeItem("matching");
      //   await axios.get(`${API_URL}/api/v1/jobs/matching/byCandidate/${candidateId}`, {
      //     headers: { Authorization: `Bearer ${token}` },
      //   });
      //   swal("The matching process is currently running.");
      // }

      setTimeout(() => setLoading(false), 500);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setLoading(false);
    }
  };

  fetchData();
}, [candidateEmail, candidateId, router]);

const handleMatchingComplete = async () => {
    // Rafraîchir les données de matching
    swal({
      title: "Matching Complete!",
      text: "Your job matches are ready to view.",
      icon: "success",
      timer: 3000
    });
    
    // Optionnel: forcer le rechargement des matches
    window.location.reload();
  };


  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <Navbar />
      {!loading && (
        <div className='Candidate'>
          <MatchingStatusBanner 
        candidateId={candidateId} 
        onMatchingComplete={handleMatchingComplete}
      />
          <div className='header'>
            {candidateName}
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

const Candidate = () => {
  return (
    <CandidateProvider>
      <CandidateContent />
    </CandidateProvider>
  );
}

export default Candidate;