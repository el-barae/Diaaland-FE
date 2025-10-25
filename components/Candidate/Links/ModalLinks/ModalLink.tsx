import React, { useState,useEffect } from "react";
import axios from "axios";
import "./ModalLink.scss";
import API_URL from "@/config";
import { jwtDecode } from "jwt-decode";

interface MyToken {
  sub: string; // email
  id: number;
  name: string;
  role: string;
  exp: number;
}

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
  const [modifiedUrl, setModifiedUrl] = useState(url);
  const [modifiedDescription, setModifiedDescription] = useState(description);

    const toggleModal = () => {
      onClose();
    };

    const handleModifyLink = async (e: any) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
            if (!token) return;
      
            const decoded = jwtDecode<MyToken>(token);
            const idC = decoded.id;
      axios
        .put(API_URL+'/api/v1/profiles/other_links/' + String(id), {
          id: id,
          name: modifiedName,
          url: modifiedUrl,
          description: modifiedDescription,
          candidate: {
            id: idC,
          },
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
  
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setModifiedDescription(e.target.value);
    }

    return (
      <>
        {isOpen && (
          <div className="modal-link">
            <div onClick={toggleModal} className="overlay"></div>
              <button id="close-btn" onClick={toggleModal}>CLOSE</button>
              <div className="modal-content">
              <label htmlFor="name">Name:</label>
            <input type="text" id="name" placeholder="Enter name link" value={modifiedName} onChange={handleNameChange} />
            <label htmlFor="url">Url:</label>
            <input type="text" id="url" placeholder="Enter url link" value={modifiedUrl} onChange={handleUrlChange} />
            <label htmlFor="description">Description:</label>
            <textarea className="desc" id="description" placeholder="Enter description" value={modifiedDescription} onChange={handleDescriptionChange} />
            <button onClick={handleModifyLink}>Modify project</button>
              </div>
          </div>
        )}
      </>
    );
  }
  