import React, { useState,useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./ModalJobs.scss";
import API_URL from "@/config";

interface ModalProps {
    isOpen: boolean;
    id: number;
    jobTitle: string;
    minSalary: number;
    maxSalary: number;
    positionNumber: number;
    openDate: string;
    endDate: string; 
    adress: string;
    xp: string;
    type: string;
    description: string;
    onClose: () => void;
  }

  export default function Modal({ isOpen, id, jobTitle, minSalary, maxSalary, positionNumber, openDate, endDate, adress, xp, type, description, onClose }: ModalProps) {
    const [MjobTitle, setJobTitle] = useState(jobTitle);
 const [MminSalary, setMinSalary] = useState( minSalary);
 const [MmaxSalary, setMaxSalary] = useState(maxSalary);
 const [MpositionNumber , setPositionNumber] = useState(positionNumber);
 const [MjobOpenDate , setJobOpenDate] = useState(openDate);
 const [MjobCloseDate , setJobCloseDate] = useState(endDate);
 const [MjobDescription, setJobDescription] = useState(description);
 const [Madress , setAdress] = useState(adress); 
 const [MExperience, setExperience] = useState(xp);
 const [MjobType, setJobType] = useState(type);

    const toggleModal = () => {
      onClose();
    };

    const handleModifyJob = async (e: any) => {
      e.preventDefault();
      const idC = Cookies.get('id');
      axios
        .put(API_URL+'/api/v1/jobs/' + String(id), {
          id: id,
          "name": MjobTitle,
          "description": MjobDescription,
          "minSalary": MminSalary,
          "maxSalary": MmaxSalary,
          "type": MjobType,
          "openDate": MjobOpenDate,
          "closeDate": MjobCloseDate,
          "numberOfPositions": MpositionNumber,
          "address": Madress,
          "remoteStatus": true
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    useEffect(() => {
      if (isOpen) {
        document.body.classList.add('active-modal');
      } else {
        document.body.classList.remove('active-modal');
      }
  
      return () => {
        document.body.classList.remove('active-modal');
      };
    }, [isOpen]);

    const handleMinSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setMinSalary(value);
    };

    const handleMaxSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setMaxSalary(value);
    };

    const handleNbPositionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setPositionNumber(value);
    };

    return (
      <>
        {isOpen && (
          <div className="modal-jobs">
            <div onClick={toggleModal} className="overlay"></div>
              <button id="close-btn" onClick={toggleModal}>CLOSE</button>
              <div className="modal-content">
              <label htmlFor="jobTitle">Job Title:</label>
    <input type="text" id="jobTitle" placeholder="Enter job title" value={MjobTitle} onChange={(e) => setJobTitle(e.target.value)} />
    <label htmlFor="minSalary">Minimum Salary:</label>
    <input type="number" id="minSalary" placeholder="Enter minimum salary" value={MminSalary} onChange={handleMaxSalaryChange} />
    <label htmlFor="maxSalary">Maximum Salary:</label>
    <input type="number" id="maxSalary" placeholder="Enter maximum salary" value={MmaxSalary} onChange={handleMinSalaryChange} />
    <label htmlFor="positionNumber">Position Number:</label>
    <input type="number" id="positionNumber" placeholder="Enter position number" value={MpositionNumber} onChange={handleNbPositionsChange} />
    <label htmlFor="jobOpenDate">Job Open Date:</label>
    <input type="date" id="jobOpenDate" value={MjobOpenDate} onChange={(e) => setJobOpenDate(e.target.value)} />
    <label htmlFor="jobCloseDate">Job Close Date:</label>
    <input type="date" id="jobCloseDate" value={MjobCloseDate} onChange={(e) => setJobCloseDate(e.target.value)} />
    <label htmlFor="jobDescription">Job Description:</label>
    <textarea className="desc" id="jobDescription" placeholder="Enter job description" value={MjobDescription} onChange={(e) => setJobDescription(e.target.value)} />
    <label htmlFor="adress">Address:</label>
    <input type="text" id="adress" placeholder="Enter address" value={Madress} onChange={(e) => setAdress(e.target.value)} />
    <label htmlFor="experience">Experience:</label>
    <input type="text" id="experience" placeholder="Enter experience" value={MExperience} onChange={(e) => setExperience(e.target.value)} />
    <label htmlFor="jobType">Job Type:</label>
    <input type="text" id="jobType" placeholder="Enter job type" value={MjobType} onChange={(e) => setJobType(e.target.value)} />
    <button onClick={handleModifyJob}>Modify Job</button>
              </div>
          </div>
        )}
      </>
    );
  }
  