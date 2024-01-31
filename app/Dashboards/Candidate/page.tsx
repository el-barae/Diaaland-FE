'use client'
import React from 'react';
import './style.scss';
import { useState } from 'react';
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'
import Jobs from '@/components/Candidate/Jobs/Jobs'
import Favoris from '@/components/Candidate/Favoris/Favoris';
import Profile from '@/components/Candidate/Profile/Profile';
import Skills from '@/components/Candidate/Skills/Skills';
import Projects from '@/components/Candidate/Projects/Projects';
import Ex from '@/components/Candidate/Experiances/Ex';
import Links from '@/components/Candidate/Links/Links';
  

const Candidate = () => {
  var [x,setX] = useState("Jobs"); 

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
    if (x === "Favoris") {
      return <Favoris />;
      console.log(x);
    }
    if (x === "Skills") {
      return <Skills />;
      console.log(x);
    }
    if (x === "Projects") {
      return <Projects />;
      console.log(x);
    }
    if (x === "Ex") {
      return <Ex />;
      console.log(x);
    }
    if (x === "Links") {
      return <Links />;
      console.log(x);
    }
  };
    return (
        <ThemeProvider enableSystem={true} attribute="class">
          <Navbar/>
            <div className='Candidate'>
              <div className='header'>
                <h1>Candidate</h1>
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
                </div>
                <div className='Candidate-box'>
                    {y()}
                </div>
              </div>
            </div>
        </ThemeProvider>
    );
  }
  
  export default Candidate;

