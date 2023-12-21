'use client'
import Image from 'next/image'
import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
import './style.scss';
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'

interface Candidate {
    id: number;
    firstName: string;
    lastName: string;
    description: string;
    email: string;
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

const Profile = () => {
    const [candidatesData, setCandidatesData] = useState<Candidate[]>([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:7777/api/v1/candidate-jobs/byJob/2');
            
            setCandidatesData(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        };
        fetchData();
  }, []);
    return (
        <ThemeProvider enableSystem={true} attribute="class">
            <Navbar/>
            <div className='lists'>
                        <RepeatClassNTimes className="list" n={candidatesData.length} candidatesData={candidatesData} />
            </div>
        </ThemeProvider>
    );
  }
  
  export default Profile;

