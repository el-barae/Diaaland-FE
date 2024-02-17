import React, { useState,useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./ModalLink.scss";
import API_URL from "@/config";

interface ModalProps {
    isOpen: boolean;
    id: number;
    name: string;
    url: string;
    description: string;
    onClose: () => void;
  }

  export default function Modal({ isOpen, id, name, url, description, onClose }: ModalProps) {
  const [modifiedName, setModifiedName] = useState(name);
  const [modifiedStartDate, setModifiedStartDate] = useState('');
  const [modifiedEndDate, setModifiedEndDate] = useState('');
  const [modifiedDescription, setModifiedDescription] = useState(description);

    const toggleModal = () => {
      onClose();
    };

    const handleModifyProject = async (e: any) => {
      e.preventDefault();
      const idC = Cookies.get('id');
      axios
        .put(API_URL+'/api/v1/projects/' + String(id), {
          id: id,
          name: modifiedName,
          startDate: modifiedStartDate,
          endDate: modifiedEndDate,
          description: modifiedDescription,
          candidate: {
            id: idC,
          },
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

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setModifiedName(e.target.value);
    };
  
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setModifiedStartDate(e.target.value);
    };
  
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setModifiedEndDate(e.target.value);
    };
  
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setModifiedDescription(e.target.value);
    }

    return (
      <>
        {isOpen && (
          <div className="modal">
            <div onClick={toggleModal} className="overlay"></div>
              <button id="close-btn" onClick={toggleModal}>CLOSE</button>
              <div className="modal-content">
              <label htmlFor="name">Name:</label>
            <input type="text" id="name" placeholder="Enter name project" value={modifiedName} onChange={handleNameChange} />
            <label htmlFor="startDate">Start Date:</label>
            <input type="date" id="startDate" value={modifiedStartDate} onChange={handleStartDateChange} />
            <label htmlFor="CloseDate">End Date:</label>
            <input type="date" id="CloseDate" value={modifiedEndDate} onChange={handleEndDateChange} />
            <label htmlFor="description">Description:</label>
            <textarea className="desc" id="description" placeholder="Enter description" value={modifiedDescription} onChange={handleDescriptionChange} />
            <button onClick={handleModifyProject}>Modify project</button>
              </div>
          </div>
        )}
      </>
    );
  }
  