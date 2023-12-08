'use client'
import React from 'react'
import { useState } from "react"
import "./addpost.scss"
import Navbar from '@/components/HomePage/Navbar/Navbar'
import Image from 'next/image'
import LoginImage from '@/public/images/login-info.svg'
import axios from 'axios'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/navigation';
export default function AddPost() {


 const [jobTitle, setJobTitle] = useState('');
 const [minSalary, setMinSalary] = useState('');
 const [maxSalary, setMaxSalary] = useState('');
 const [positionNumber , setPositionNumber] = useState('');
 const [jobOpenDate , setJobOpenDate] = useState('');
 const [jobCloseDate , setJobCloseDate] = useState('');
 const [jobDescription, setJobDescription] = useState('');
 const [adress , setAdress] = useState(''); 
 const [Experience, setExperience] = useState('InterShip');
 const [jobType, setJobType] = useState('remote');
 const router = useRouter();  

 const authToken = localStorage.getItem('token');
 
  const handleSubmit = async (e:any)  =>{
		e.preventDefault()
		axios.post('http://localhost:7777/api/v1/jobs', {
			"name": jobTitle,
      "description": jobDescription,
      "minSalary": minSalary,
      "maxSalary": maxSalary,
      "type": jobType,
      "openDate": jobOpenDate,
      "closeDate": jobCloseDate,
      "numberOfPositions": positionNumber,
      "address": adress,
      "remoteStatus": true
		  }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
		  .then(function (response) {
			console.log(response);
      alert("Your post had been sent to admin ")
		  })
		  .catch(function (error) {
			alert(error.message);
		  });
	}

 return (
<>
<ThemeProvider enableSystem={true} attribute="class" >


  <Navbar/>
  <div className="addpost">
    <div className="container">
      <div className="addpost-box">
        <div className="info-side">
          <div className="info">
          <h1>Post your Job :</h1>
          <p>
           Welcome To add post page please fill all the necessary details!</p>
          </div>
          <div className="info-image">
          <Image 
									src={LoginImage}
									width={300}
									height={300}
									alt="login image"
                  id='img'
								/>
          </div>
        </div>
        <div className="from-description">
          <form onSubmit={handleSubmit} >
          <div className='JobTitle'>
            <label htmlFor="jobTitle">Job Title:</label>
            <input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>
        
          <div className='Adress'>
            <label htmlFor="adress">Enter your Adress:</label>
            <input 
            type="text"
            id='adress' 
            value={adress} 
            onChange={(e) => setAdress(e.target.value)} 
            required/>
          </div>
         
          <div className="salary">
            <label htmlFor="maxSalary">Your maximum salary</label>
            <input
            type="number"
            id="maxSalary"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
            required
            />
            <label htmlFor="minSalary">Your minimum salary</label>
            <input
            type="number"
            id="minSalary"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            required
            />
          </div>

          <div className="job-date">
            <label htmlFor="startDate">Start Date:</label>
            <input 
            type="date" 
            id="startDate" 
            value={jobOpenDate} 
            onChange={(e) => setJobOpenDate(e.target.value)}
            />
            <label htmlFor="CloseDate">End Date:</label>
            <input 
            type="date" 
            id="CloseDate" 
            value={jobCloseDate} 
            onChange={(e) => setJobCloseDate(e.target.value)}
            />
          </div>

          <div className="options">
            <label htmlFor="jobType">Job Type</label>
            <select id="jobType" name="jobType" value={jobType} onChange={(e) => setJobType(e.target.value)}>
              <option value="remote">Remote</option>  
              <option value="OnSite">On-site</option>
              <option value="Hybrid">Hybrid </option>
            </select>
            <label  htmlFor="Experience">Experience Level</label>
            <select id="Experience" name="Experience" value={Experience} onChange={(e) => setExperience(e.target.value)}>
              <option value="Intership">Intership</option>
              <option value="EntryLevel">Entry Level</option>
              <option value="Senior">Senior </option>
              <option value="MidSenior">Mid-Senior</option>
              <option value="Leader">Leader</option>   
            </select>
          </div>

          <div className='JobDesc'>
            <label htmlFor="jobDescription">Job Description:</label>
            <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
            />
          </div>
      
          <div className='foot'>
            <label htmlFor="positionNumber">Number of position</label>
            <input type="number" 
            id='positionNumber'
            value={positionNumber}
            onChange={(e) => setPositionNumber(e.target.value)} 
            required/>        
      
  
            <button type="submit" id='submit'>Submit</button>
          </div>
          
          </form>
        </div>
      </div>
    </div>
  </div>
</ThemeProvider>
</>
 );
};