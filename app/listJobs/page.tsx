'use client'
import Image from 'next/image'
import ListImage from '@/public/images/listjobs.png'
import service2 from '@/public/images/service2.svg'
import React from 'react';
import './style.scss';
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'

interface RepeatClassNTimesProps {
    className: string;
    n: number;
  }

const RepeatClassNTimes : React.FC<RepeatClassNTimesProps> = ({ className, n }) => {
    const elements = [];

  for (let i = 0; i < n; i++) {
    elements.push(
       <div key={i} className={className}>
                            <h1>Job {` ${i + 1}`}:</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt reprehenderit quis non deserunt cumque consequuntur harum dolorum labore delectus. Quibusdam rem voluptatibus ab magnam commodi ea totam quia laborum iste.</p>
                            <button >Apply</button>
        </div>
    );
  }
  
    return <>{elements}</>;
  };


const ListJobs = () => {
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
                        <RepeatClassNTimes className="list" n={5} />
                    </div>
                </div>
            </div>
    </ThemeProvider>
    );
  }
  
  export default ListJobs;