import React, { useState,useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./ModalXp.scss";
import API_URL from "@/config";

interface xp{
  id: number;
  name : string;
  startDate : string;
  endDate : string;
}

interface ModalProps {
    isOpen: boolean;
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    onClose: () => void;
    setXpData: React.Dispatch<React.SetStateAction<xp[]>>;
  }

  export default function Modal({ isOpen, id, name, startDate, endDate, onClose, setXpData }: ModalProps) {
    const token = localStorage.getItem("token");
  const [modifiedName, setModifiedName] = useState(name);
  const [modifiedStartDate, setModifiedStartDate] = useState(startDate);
  const [modifiedEndDate, setModifiedEndDate] = useState(endDate);

    const toggleModal = () => {
      onClose();
    };

    const handleModifyXp = async (e: any) => {
      e.preventDefault();
      try{
      const idC = Cookies.get('id');
      axios
        .put(API_URL+'/api/v1/experiences/' + String(id), {
          id: id,
          name: modifiedName,
          startDate: modifiedStartDate,
          endDate: modifiedEndDate,
          candidate: {
            id: idC,
          },
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
          setXpData(prevXpData => {
            const updatedXpData = prevXpData.map(xp => {
              if (xp.id === id) {
                return {
                  ...xp,
                  name: modifiedName,
                  startDate: modifiedStartDate,
                  endDate: modifiedEndDate
                };
              }
              return xp;
            });
            return updatedXpData;
          });
          onClose();
        }catch(error) {
          console.log(error);
        };
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
            <button onClick={handleModifyXp}>Modify project</button>
              </div>
          </div>
        )}
      </>
    );
  }
  