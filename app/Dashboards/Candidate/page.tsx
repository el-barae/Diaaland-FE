'use client'
import Image from 'next/image'
import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
import Cookies from 'js-cookie';
import './style.scss';
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'

interface Job {
    id: number;
    name: string;
    description: string;
    numberOfPositions: number;
    closeDate: string;
  }

  interface RepeatClassNTimesProps {
    className: string;
    n: number;
    jobsData: Job[];
  }

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, jobsData }) => {
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

const Profile = () => {
    const [jobsData, setJobsData] = useState<Job[]>([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            Cookies.set("id","1")
            const id = Cookies.get("id");
            const response = await axios.get('http://localhost:7777/api/v1/candidate-jobs/byCandidate/'+String(id));         
            setJobsData(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        };
        fetchData();
  }, []);
    return (
        <ThemeProvider enableSystem={true} attribute="class">
            <Navbar/>
            <div className='Candidate'>
              <div className='header'>
                <h1>Candidate</h1>
              </div>
              <div className='content'>
              <div className='Menu'>
              <li>
                <ul>profile</ul>
                <ul>settings</ul>
                <ul></ul>
              </li>
              </div>
              <div className='Candidate-box'>
                <h1>My jobs:</h1>
                <div className='lists'>
                  <RepeatClassNTimes className="list" n={jobsData.length} jobsData={jobsData} />
                </div>
                <h1>My favorites:</h1>
                <div className='favories'>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates laborum ex velit doloremque officia. Commodi doloremque inventore magnam tempora exercitationem earum blanditiis. Optio earum aliquam soluta minima velit. Reiciendis, aperiam?
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, suscipit id harum sit, vero tenetur deleniti perferendis odio nobis consequatur quae nisi, debitis molestiae! Eius aliquid impedit incidunt aspernatur ut?
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam animi perspiciatis, eos est reiciendis deserunt neque explicabo nisi rem, saepe iste nihil maiores praesentium quidem at. Facere repudiandae architecto alias.
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla accusantium distinctio consequuntur magni, facere similique suscipit rerum excepturi doloribus omnis error illum placeat optio laboriosam eligendi et qui eum modi.
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis quas autem quidem cum impedit quia vero vitae! Itaque, sunt voluptate, corporis maiores fugit fuga odit, veniam provident esse non ab!
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam nesciunt quae distinctio laborum, molestiae consectetur at temporibus, exercitationem voluptatibus blanditiis, a praesentium. Eaque consectetur atque inventore ipsum et aut sint!
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi tenetur aut debitis consequuntur. Iste quasi architecto officiis doloremque dolorum reiciendis commodi cupiditate in esse deleniti inventore, tenetur, ab, aut praesentium!
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae sequi cupiditate laudantium, illum consequatur dicta alias voluptatum repellat omnis fugit necessitatibus assumenda cum! Nesciunt ea quaerat corporis! Numquam, officia deserunt!
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero eveniet numquam totam quia, vero a neque. Exercitationem unde accusantium aliquam sapiente ad, enim eligendi animi, nesciunt, tempore incidunt ut aliquid.
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, temporibus saepe porro eveniet fugiat officia in ea maxime iure, quis et. Expedita repellendus iure sint. Adipisci modi odit beatae velit!
                  </p>
                </div>
              </div>
              </div>
            </div>
        </ThemeProvider>
    );
  }
  
  export default Profile;

