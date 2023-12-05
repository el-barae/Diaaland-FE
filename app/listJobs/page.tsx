'use client'
import Image from 'next/image'
import ListImage from '@/public/images/listjobs.png'
import service2 from '@/public/images/service2.svg'
import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
import './style.scss';
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'

interface Job {
  id: number;
  name: string;
  description: string;
  numberOfPositions: number;
  closeDate: string;
  //location: string;
  // Ajoutez d'autres propriétés au besoin
}

const ListJobs = () => {
  const [jobsData, setJobsData] = useState<Job[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:7777/api/v1/jobs');

        setJobsData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, []);
  interface RepeatClassNTimesProps {
    className: string;
    n: number;
    jobsData: Job[];
  }

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, jobsData }) => {
    return (
      <>
        {jobsData.map((job, index) => (
          <div key={job.id} className={className}>
            <h1>{job.name} :</h1>
            <p>
              Description: {job.description} <br/> Number of positions: {job.numberOfPositions} 
            </p>
            <p>Close Date: {job.closeDate}</p>
            <button>Apply</button>
          </div>
        ))}
      </>
    );
  };
  //const [data, setData] = useState<Job[]>([]);
  /*const handleSubmit = async (e:any)  =>{
		e.preventDefault()
		axios.get('http://localhost:7777/api/v1/jobs', {
		  })
		  .then(function (response) {
      setJobsData(response.data);
			console.log(response);
      alert("Your post had been sent to admin ")
		  })
		  .catch(function (error) {
			alert(error.message);
		  });
	}*/
    return (
    <ThemeProvider enableSystem={true} attribute="class">
        <Navbar/>
            <div className='listJobs'>
                <div className='container'>
                  <div className='header'>
                    <h1>List Jobs</h1>
                    <div className='search'>
                      <label htmlFor="email">Search</label>
                      <input type="search" name="search" id="search" placeholder="search jobs" required  />
                    </div>
                    <div className='list-image'>
                    <Image
                      src={ListImage}
                      width={380}
                      height={360}
                      alt='image of service'
                    />
                    </div>
                  </div>
                    <div className='lists'>
                        <RepeatClassNTimes className="list" n={jobsData.length} jobsData={jobsData} />
                    </div>
                </div>
            </div>
    </ThemeProvider>
    );
  }
  
  export default ListJobs;