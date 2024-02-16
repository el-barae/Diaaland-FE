import React, { useState,useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./Modal.scss";
import API_URL from "@/config";

interface ModalProps {
    isOpen: boolean;
    id: number;
    name: string;
    description: string;
    onClose: () => void;
  }

export default function Modal({ isOpen, id, description, name, onClose }: ModalProps) {
    const toggleModal = () => {
      onClose();
    };
    
    const handleApply = async (e:any, id:number) =>{
		e.preventDefault()
		axios.post(API_URL+'/api/v1/candidate-jobs', {
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

  const handleAddFavoris = async (e:any, id:number) =>{
		e.preventDefault()
		axios.post(API_URL+'/api/v1/favoris', {
      "candidate": {
        "id": 1
      },
      "job": {
        "id": id
      }
		 })
		 .then(function (response) {
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
                <h1>{name}</h1>
                <p>{description}</p>
                <button id="apply-btn" onClick={(e) => handleApply(e, id)}>Apply</button>
                <button id="favoris-btn" onClick={(e) => handleAddFavoris(e, id)}>Add favoris</button>
              </div>
          </div>
        )}
      </>
    );
  }
  