import React, { useState,useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./ModalEducation.scss";
import API_URL from "@/config";

interface ModalProps {
    isOpen: boolean;
    id: number;
    name: string;
    url: string;
    school: string;
    startDate: string;
    endDate: string;
    description: string;
    onClose: () => void;
  }

  export default function Modal({ isOpen, id, name, url, school,  startDate, endDate, description, onClose }: ModalProps) {
    const token = localStorage.getItem("token");
  const [modifiedName, setModifiedName] = useState(name);
  const [modifiedUrl, setModifiedUrl] = useState(url);
  const [modifiedSchool, setModifiedSchool] = useState(school);
  const [modifiedStartDate, setModifiedStartDate] = useState(startDate);
  const [modifiedEndDate, setModifiedEndDate] = useState(endDate);
  const [modifiedDescription, setModifiedDescription] = useState(description);

    const toggleModal = () => {
      onClose();
    };

    const handleModifyEducation = async (e: any) => {
      e.preventDefault();
      const idC = Cookies.get('id');
      axios
        .put(API_URL+'/api/v1/educations/' + String(id), {
          id: id,
          name: modifiedName,
          url: modifiedUrl,
          description: modifiedDescription,
          candidate: {
            id: idC,
          },
          school: modifiedSchool,
          startDate: modifiedStartDate,
          endDate: modifiedEndDate
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
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

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setModifiedUrl(e.target.value);
    };

    const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setModifiedSchool(e.target.value);
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
          <div className="modal-education">
            <div onClick={toggleModal} className="overlay"></div>
              <button id="close-btn" onClick={toggleModal}>CLOSE</button>
              <div className="modal-content">
              <label htmlFor="name">Name:</label>
            <input type="text" id="name" placeholder="Enter name education" value={modifiedName} onChange={handleNameChange} />
            <label htmlFor="url">Url:</label>
            <input type="text" id="url" placeholder="Enter url education" value={modifiedUrl} onChange={handleUrlChange} />
            <label htmlFor="school">School:</label>
            <input type="text" id="school" placeholder="Enter school education" value={modifiedSchool} onChange={handleSchoolChange} />
            <label htmlFor="startDate">Start Date:</label>
            <input type="date" id="startDate" value={modifiedStartDate} onChange={handleStartDateChange} />
            <label htmlFor="CloseDate">End Date:</label>
            <input type="date" id="CloseDate" value={modifiedEndDate} onChange={handleEndDateChange} />
            <label htmlFor="description">Description:</label>
            <textarea className="desc" id="description" placeholder="Enter description" value={modifiedDescription} onChange={handleDescriptionChange} />
            <button onClick={handleModifyEducation}>Modify education</button>
              </div>
          </div>
        )}
      </>
    );
  }
  