'use client'
import Image from 'next/image'
import { useState, useEffect, useMemo, createContext } from "react"
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
import { CustomerContext } from './CustomerContexts'

interface MyToken {
  sub: string;
  id: number;
  name: string;
  role: string;
  exp: number;
}

interface Message {
  id: number;
  email: string;
  subject: string;
  message: string;
}

const Customer = () => {
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomer] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [notif, setNotif] = useState<number | false>(false);
  const [messagesData, setMessagesData] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState("Profile");
  const router = useRouter();

  // Mémorisation du token et des infos utilisateur
  const userContext = useMemo(() => {
  if (typeof window === "undefined") {
    return { token: null, customerId: null, customerEmail: null };
  }

  const token = localStorage.getItem("token");
  if (!token) return { token: null, customerId: null, customerEmail: null };
  
  try {
    const decoded = jwtDecode<MyToken>(token);
    return {
      token,
      customerId: decoded.id,
      customerEmail: decoded.sub
    };
  } catch (error) {
    console.error("Erreur de décodage du token:", error);
    return { token: null, customerId: null, customerEmail: null };
  }
}, []);


  // Charger les messages seulement quand le dropdown s'ouvre
  const handleToggle = async () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (!userContext.token || !userContext.customerEmail) return;

    // Charger les messages seulement si on ouvre le dropdown ET qu'on n'a pas déjà les messages
    if (newIsOpen && messagesData.length === 0) {
      try {
        // Marquer les messages comme vus
        await axios.put(
          `${API_URL}/api/v1/users/messages/mark-viewed/${userContext.customerEmail}`,
          {},
          { headers: { Authorization: `Bearer ${userContext.token}` } }
        );

        setNotif(false);

        // Récupérer les messages
        const response = await axios.get(
          `${API_URL}/api/v1/users/messages/recipient/${userContext.customerEmail}`,
          { headers: { Authorization: `Bearer ${userContext.token}` } }
        );

        setMessagesData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!userContext.token || !userContext.customerEmail) return;

    try {
      await axios.delete(
        `${API_URL}/api/v1/users/messages/recipient/${userContext.customerEmail}`,
        { headers: { Authorization: `Bearer ${userContext.token}` } }
      );

      setMessagesData([]);
      setIsOpen(false);
      setNotif(false);
    } catch (error) {
      console.error("Erreur lors de la suppression des messages:", error);
    }
  };

  const handleAddClick = () => {
    router.push("../addPost");
  };

  const handleTabClick = (value: string) => {
    setActiveTab(value);
  };

  // Rendu conditionnel des composants
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "Profile":
        return <Profile />;
      case "Jobs":
        return <Jobs />;
      case "Applies":
        return <Applies />;
      case "Candidates":
        return <Candidates />;
      case "Matches":
        return <Matches />;
      default:
        return <Profile />;
    }
  };

  // Initialisation unique au chargement
  useEffect(() => {
    const initializeCustomer = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        swal("Authentication required", "", "error");
        router.push("/");
        return;
      }

      try {
        const decoded = jwtDecode<MyToken>(token);
        const { role, name, sub: email } = decoded;

        // Vérification du rôle
        if (role !== "CUSTOMER" && role !== "ADMIN") {
          swal("Authenticate yourself when you are a CUSTOMER", "", "error");
          router.push("/");
          return;
        }

        setCustomer(name);

        // Chargement initial (uniquement les notifications)
        try {
          // Récupération du nombre de notifications non vues
          const resNotif = await axios.get(
            `${API_URL}/api/v1/users/messages/viewed/${email}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setNotif(resNotif.data);

          // Vérification du matching en cours
          const matching = localStorage.getItem("matching");
          if (matching) {
            const resp = await axios.get(
              `${API_URL}/api/v1/jobs/lastJobId`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const jobId = resp.data;

            localStorage.removeItem("matching");
            await axios.get(
              `${API_URL}/api/v1/jobs/matching/byJob/${jobId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            swal("The matching process is currently running.");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des notifications:", error);
        }

        // Délai minimal pour une meilleure UX
        setTimeout(() => setLoading(false), 300);

      } catch (error) {
        console.error("Erreur de décodage du token:", error);
        swal("Invalid token", "", "error");
        router.push("/");
      }
    };

    initializeCustomer();
  }, [router]); // Dépendance minimale

  return (
    <CustomerContext.Provider value={userContext}>
      <ThemeProvider enableSystem={true} attribute="class">
        <Navbar />
        {!loading && (
          <div className='Customer'>
            <div className='header'>
              <h1>{customerData}</h1>
              <button type="button" className="button" onClick={handleAddClick}>
                Add job
              </button>
              
              {isOpen && (
                <button className="btn" onClick={handleDelete}>
                  <svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" className="icon">
                    <path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path>
                  </svg>
                </button>
              )}
              
              <button onClick={handleToggle} aria-label="Notifications">
                <Image 
                  src={Notif}
                  width={50}
                  height={50}
                  alt="notifications"
                />
                {notif !== false && notif > 0 && (
                  <span className="badge">{notif}</span>
                )}
              </button>
              
              {isOpen && (
                <ul className="dropdown-list">
                  {messagesData.length > 0 ? (
                    messagesData.map(message => (
                      <li key={message.id}>
                        <p><strong>Sujet:</strong> {message.subject}</p>
                        <p><strong>Message:</strong> {message.message}</p>
                      </li>
                    ))
                  ) : (
                    <li>No messages</li>
                  )}
                </ul>
              )}
            </div>
            
            <div className='content'>
              <div className='Menu'>
                <button 
                  onClick={() => handleTabClick("Profile")}
                  className={activeTab === "Profile" ? "active" : ""}
                >
                  Profile
                </button>
                <button 
                  onClick={() => handleTabClick("Jobs")}
                  className={activeTab === "Jobs" ? "active" : ""}
                >
                  My jobs
                </button>
                <button 
                  onClick={() => handleTabClick("Applies")}
                  className={activeTab === "Applies" ? "active" : ""}
                >
                  Applies
                </button>
                <button 
                  onClick={() => handleTabClick("Candidates")}
                  className={activeTab === "Candidates" ? "active" : ""}
                >
                  Candidates
                </button>
                <button 
                  onClick={() => handleTabClick("Matches")}
                  className={activeTab === "Matches" ? "active" : ""}
                >
                  Matches
                </button>
              </div>
              
              <div className='Customer-box'>
                {renderActiveComponent()}
              </div>
            </div>
          </div>
        )}
        
        {loading && (
          <div className="lds-roller">
            <div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div>
          </div>
        )}
      </ThemeProvider>
    </CustomerContext.Provider>
  );
};

export default Customer;