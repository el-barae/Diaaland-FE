'use client'
import Image from 'next/image'
import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import './style.scss';
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'
import Jobs from '@/components/Candidate/Jobs/Jobs'

const router = useRouter();

const toJobs = () =>{
  
}

let x = 1;

const Profile = () => {
    return (
        <ThemeProvider enableSystem={true} attribute="class">
            <Navbar/>
            <div className='Candidate'>
              <div className='header'>
                <h1>Candidate</h1>
              </div>
              <div className='content'>
                <div className='Menu'>
                  <button>Profile</button>
                  <button>My jobs</button>
                  <button>My favoris</button>
              </div>
              <div className='Candidate-box'>
                <Jobs/>
              </div>
              </div>
            </div>
        </ThemeProvider>
    );
  }
  
  export default Profile;

