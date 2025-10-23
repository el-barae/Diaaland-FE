'use client'
import React from 'react';
import './style.scss';
import { useState ,useEffect} from 'react';
import axios from 'axios';
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'
import Profile from './Profile/Profile';
import Skills from './Skills/Skills';
import Projects from './Projects/Projects';
import Ex from './Experiances/Ex';
import Links from './Links/Links';
import API_URL from '@/config';

const ViewCandidate = () => {
  var [x,setX] = useState("Profile"); 
  const [candidateData,setCandidateData] = useState('');
  const handleClick = (value : string) => {
    setX(value);
    y();
  };
  const [loading, setLoading] = useState(true);

  const y = () => {
    if (x === "Profile"){ 
      return <Profile />;
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
  };

  useEffect(() => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');
          var ID = localStorage.getItem('IDSelected');
          const response = await axios.get(API_URL+'/api/v1/profiles/candidates/name/'+String(ID), {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          setCandidateData(response.data);
          setTimeout(() => {
            setLoading(false);
          }, 1500);
        } catch (error) {
          console.error('Erreur lors de la récupération des données :', error);
        }
      };
      fetchData();
  }, []);
    return (
        <ThemeProvider enableSystem={true} attribute="class">
          <Navbar/>
          {!loading && (
            <div className='Candidate'>
              <div className='header'>
                {candidateData}
              </div>
              <div className='content'>
                <div className='Menu'>
                  <button onClick={() => handleClick("Profile")}>Profile</button>
                  <button onClick={() => handleClick("Skills")}>Skills</button>
                  <button onClick={() => handleClick("Projects")}>Projects</button>
                  <button onClick={() => handleClick("Ex")}>Xp</button>
                  <button onClick={() => handleClick("Links")}>Links</button>
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
  
  export default ViewCandidate;

