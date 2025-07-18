'use client'
import React from 'react'
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import "./addpost.scss"
import Navbar from '@/components/HomePage/Navbar/Navbar'
import Image from 'next/image'
import LoginImage from '@/public/images/login-info.svg'
import axios from 'axios'
import { ThemeProvider } from 'next-themes'
import API_URL from '@/config'
import swal from 'sweetalert'

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
 const [loading, setLoading] = useState(true);
 const router = useRouter();
 const degreesList = [
  'Master',
  'Bachelor',
  'Doctor',
  'Associate',
  'Diploma',
  'Bac+2',
  'Bac+3',
  'Bac+5',
  'Ingener',
  'DEUST',
  'DEUG',
  'Baccalaureat',
  'Certificate',
  'Postgraduate Diploma',
  'Postgraduate Certificate',
  'Professional Degree',
  'Advanced Diploma',
  'Graduate Diploma',
  'Graduate Certificate',
  'Technical Diploma',
  'Vocational Diploma'
];
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    // Toggle dropdown open/close
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
        console.log(selectedDegrees)
    };

    // Handle degree selection and deselection
    const handleDegreeChange = (degree: string) => {
        if (selectedDegrees.includes(degree)) {
            setSelectedDegrees(selectedDegrees.filter(d => d !== degree));
        } else {
            setSelectedDegrees([...selectedDegrees, degree]);
        }
    };

    // Remove a degree tag
    const handleRemoveDegree = (degree: string) => {
        setSelectedDegrees(selectedDegrees.filter(d => d !== degree));
    };

 useEffect(() => {
  const role = localStorage.getItem('role');
  if (role !== "ADMIN" && role !== "CUSTOMER") {
      swal('Authenticate yourself when you are a EMPLOYER', '', 'error');
      router.push('/');
  }
  else{
      setTimeout(() => {
          setLoading(false);
        }, 1500);
  }
  
}, []);
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)  =>{
		e.preventDefault()
    const id=localStorage.getItem('ID');
    const token = localStorage.getItem("token");
		axios.post(API_URL+'/api/v1/jobs', {
			"name": jobTitle,
      "description": jobDescription,
      "minSalary": minSalary,
      "maxSalary": maxSalary,
      "type": jobType,
      "openDate": jobOpenDate,
      "closeDate": jobCloseDate,
      "numberOfPositions": positionNumber,
      "address": adress,
      "remoteStatus": true,
      "degrees": selectedDegrees,
      "customer":{
        "id": id
      }
		  }, {
				headers: {
					'Authorization': 'Bearer ' + token
				}
			})
		  .then(function (response) {
        localStorage.setItem('matching', 'true');
        swal('Your post had been sent to admin', '', 'success');
		  })
		  .catch(function (error) {
        swal(error.message, '', 'error');
		  });
      /*axios.post(API_URL+'/api/v1/candidate-jobs', {
        "name": jobTitle,
        "description": jobDescription,
        "minSalary": minSalary,
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        .then(function (response) {
        swal('Your post had been sent to admin', '', 'success');
        })
        .catch(function (error) {
          swal(error.message, '', 'error');
        });*/
	}

 return (
<>
<ThemeProvider enableSystem={true} attribute="class" >


  <Navbar/>
  {!loading && (
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

            <div className='degrees'></div>
              <label htmlFor="degrees">Degrees</label>
              <div className="dropdown">
                <button type="button" onClick={toggleDropdown}>
                    {dropdownOpen ? 'Close' : 'Select Degrees'}
                </button>
                {dropdownOpen && (
                    <div className="dropdown-menu">
                        {degreesList.map((degree, index) => (
                            <div key={index} className="dropdown-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedDegrees.includes(degree)}
                                        onChange={() => handleDegreeChange(degree)}
                                    />
                                    {degree}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
              </div>    
            </div>

          <button type="submit" id='submit'>Submit</button>
          
          </form>
        </div>
      </div>
    </div>
  </div>
  )}
  {loading && (
      <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  )}
</ThemeProvider>
</>
 );
};