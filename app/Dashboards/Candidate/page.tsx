'use client'
import React from 'react';
import './style.scss';
import { useState } from 'react';
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'
import Jobs from '@/components/Candidate/Jobs/Jobs'
import Favoris from '@/components/Candidate/Favoris/Favoris';
import Profile from '@/components/Candidate/Profile/Profile';
  

const Candidate = () => {
  var [x,setX] = useState("Favoris"); 

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
                  <button onClick={() => handleClick("Favoris")}>My favoris</button>
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

