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
  const [positionNumber, setPositionNumber] = useState('');
  const [jobOpenDate, setJobOpenDate] = useState('');
  const [jobCloseDate, setJobCloseDate] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [adress, setAdress] = useState(''); 
  const [Experience, setExperience] = useState('Intership');
  const [jobType, setJobType] = useState('remote');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const degreesList = [
    'Master', 'Bachelor', 'Doctor', 'Associate', 'Diploma',
    'Bac+2', 'Bac+3', 'Bac+5', 'Ingener', 'DEUST', 'DEUG',
    'Baccalaureat', 'Certificate', 'Postgraduate Diploma',
    'Postgraduate Certificate', 'Professional Degree',
    'Advanced Diploma', 'Graduate Diploma', 'Graduate Certificate',
    'Technical Diploma', 'Vocational Diploma'
  ];
  
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleDegreeChange = (degree: string) => {
    if (selectedDegrees.includes(degree)) {
      setSelectedDegrees(selectedDegrees.filter(d => d !== degree));
    } else {
      setSelectedDegrees([...selectedDegrees, degree]);
    }
  };

  const handleRemoveDegree = (degree: string) => {
    setSelectedDegrees(selectedDegrees.filter(d => d !== degree));
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== "ADMIN" && role !== "CUSTOMER") {
      swal('Authenticate yourself when you are a EMPLOYER', '', 'error');
      router.push('/');
    } else {
      setTimeout(() => setLoading(false), 1500);
    }
  }, [router]);
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const id = localStorage.getItem('ID');
    const token = localStorage.getItem("token");
    
    axios.post(API_URL + '/api/v1/jobs', {
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
      "customer": { "id": id }
    }, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(function (response) {
      localStorage.setItem('matching', 'true');
      swal('Your post had been sent to admin', '', 'success');
    })
    .catch(function (error) {
      swal(error.message, '', 'error');
    });
  }

  return (
    <>
      <ThemeProvider enableSystem={true} attribute="class">
        <Navbar />
        
        {loading ? (
          <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        ) : (
          <div className="addpost">
            <div className="container">
              <div className="addpost-wrapper">
                
                {/* Sidebar Info */}
                <aside className="info-sidebar">
                  <div className="info-content">
                    <h1>Post your Job</h1>
                    <p>Welcome to add post page please fill all the necessary details!</p>
                  </div>
                  <div className="info-illustration">
                    <Image 
                      src={LoginImage}
                      width={280}
                      height={280}
                      alt="Job posting illustration"
                      priority
                    />
                  </div>
                </aside>

                {/* Main Form */}
                <main className="form-container">
                  <form onSubmit={handleSubmit} className="job-form">
                    
                    {/* Job Title */}
                    <div className="form-field">
                      <label htmlFor="jobTitle">Job Title</label>
                      <input
                        type="text"
                        id="jobTitle"
                        placeholder="e.g., Senior Software Engineer"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        required
                      />
                    </div>

                    {/* Address */}
                    <div className="form-field">
                      <label htmlFor="adress">Enter Your Address</label>
                      <input 
                        type="text"
                        id="adress"
                        placeholder="e.g., 123 Main Street, City"
                        value={adress} 
                        onChange={(e) => setAdress(e.target.value)} 
                        required
                      />
                    </div>

                    {/* Salary Range */}
                    <div className="form-grid">
                      <div className="form-field">
                        <label htmlFor="maxSalary">Maximum Salary</label>
                        <input
                          type="number"
                          id="maxSalary"
                          placeholder="50000"
                          value={maxSalary}
                          onChange={(e) => setMaxSalary(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="minSalary">Minimum Salary</label>
                        <input
                          type="number"
                          id="minSalary"
                          placeholder="30000"
                          value={minSalary}
                          onChange={(e) => setMinSalary(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="form-grid">
                      <div className="form-field">
                        <label htmlFor="startDate">Start Date</label>
                        <input 
                          type="date" 
                          id="startDate" 
                          value={jobOpenDate} 
                          onChange={(e) => setJobOpenDate(e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="CloseDate">End Date</label>
                        <input 
                          type="date" 
                          id="CloseDate" 
                          value={jobCloseDate} 
                          onChange={(e) => setJobCloseDate(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Job Type & Experience */}
                    <div className="form-grid">
                      <div className="form-field">
                        <label htmlFor="jobType">Job Type</label>
                        <select 
                          id="jobType" 
                          value={jobType} 
                          onChange={(e) => setJobType(e.target.value)}
                        >
                          <option value="remote">Remote</option>  
                          <option value="OnSite">On-site</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                      <div className="form-field">
                        <label htmlFor="Experience">Experience Level</label>
                        <select 
                          id="Experience" 
                          value={Experience} 
                          onChange={(e) => setExperience(e.target.value)}
                        >
                          <option value="Intership">Internship</option>
                          <option value="EntryLevel">Entry Level</option>
                          <option value="Senior">Senior</option>
                          <option value="MidSenior">Mid-Senior</option>
                          <option value="Leader">Leader</option>   
                        </select>
                      </div>
                    </div>

                    {/* Job Description */}
                    <div className="form-field">
                      <label htmlFor="jobDescription">Job Description</label>
                      <textarea
                        id="jobDescription"
                        placeholder="Describe the role, responsibilities, and requirements..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        rows={5}
                        required
                      />
                    </div>

                    {/* Positions & Degrees */}
                    <div className="form-grid">
                      <div className="form-field">
                        <label htmlFor="positionNumber">Number of Positions</label>
                        <input 
                          type="number" 
                          id="positionNumber"
                          placeholder="1"
                          min="1"
                          value={positionNumber}
                          onChange={(e) => setPositionNumber(e.target.value)} 
                          required
                        />   
                      </div>
                      
                      <div className="form-field">
                        <label htmlFor="degrees">Required Degrees</label>
                        <div className="custom-dropdown">
                          <button 
                            type="button" 
                            onClick={toggleDropdown}
                            className="dropdown-btn"
                          >
                            {dropdownOpen ? '✕ Close' : '+ Select Degrees'}
                          </button>
                          
                          {dropdownOpen && (
                            <div className="dropdown-panel">
                              {degreesList.map((degree, index) => (
                                <label key={index} className="dropdown-option">
                                  <input
                                    type="checkbox"
                                    checked={selectedDegrees.includes(degree)}
                                    onChange={() => handleDegreeChange(degree)}
                                  />
                                  <span>{degree}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Selected Degrees Tags */}
                    {selectedDegrees.length > 0 && (
                      <div className="selected-degrees">
                        <span className="degrees-label">Selected:</span>
                        <div className="degree-tags">
                          {selectedDegrees.map((degree, index) => (
                            <span key={index} className="degree-tag">
                              {degree}
                              <button 
                                type="button" 
                                onClick={() => handleRemoveDegree(degree)}
                                aria-label={`Remove ${degree}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button type="submit" className="submit-btn">
                      Submit Job Post
                    </button>
                    
                  </form>
                </main>
                
              </div>
            </div>
          </div>
        )}
      </ThemeProvider>
    </>
  );
}