import React, { useState,useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./Modal.scss";

interface ModalProps {
    isOpen: boolean;
    id: number;
    name: string;
    description: string;
    onClose: () => void;
  }

export default function Modal({ isOpen, id, description, name, onClose }: ModalProps) {
  const [startDate,setStartDate] = useState('')
  const [endDate,setEndDate] = useState('')
  const [desc,setDesc] = useState('')
    const toggleModal = () => {
      onClose();
    };
    
    const handleModifyProject = async (e:any) =>{
		e.preventDefault()
		axios.post('http://localhost:7777/api/v1/candidate-jobs', {
			"status": "en attends",
      "candidate": {
        "id": 1
      },
      "job": {
        "id": id
      }
		 })
		 .then(function (response) {
			console.log(response);
		 })
		 .catch(function (error) {
			console.log(error);
		 });
	}

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
  
    return (
      <>
        {isOpen && (
          <div className="modal">
            <div onClick={toggleModal} className="overlay"></div>
              <button id="close-btn" onClick={toggleModal}>CLOSE</button>
              <div className="modal-content">
              <label htmlFor="name">Name:</label>
              <input type="text" placeholder='Enter name project' value={name} />
              <label htmlFor="startDate">Start Date:</label>
              <input 
              type="date" 
              id="startDate" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              />
              <label htmlFor="CloseDate">End Date:</label>
              <input 
              type="date" 
              id="CloseDate" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              />
             <label htmlFor="description">Description:</label>
              <textarea className='desc' placeholder='Enter description' value={desc} onChange={(e) => setDesc(e.target.value)}/>
            <button onClick={handleModifyProject}>Modify project</button>
              </div>
          </div>
        )}
      </>
    );
  }
  