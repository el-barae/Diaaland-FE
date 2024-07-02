import React, { useState,useEffect } from "react";
import axios from "axios";
import "./ModalCertificate.scss";
import API_URL from "@/config";

interface ModalProps {
    isOpen: boolean;
    id: number;
    name: string;
    url: string;
    domain: string;
    description: string;
    onClose: () => void;
  }

  export default function Modal({ isOpen, id, name, url, domain, description, onClose }: ModalProps) {
  const [modifiedName, setModifiedName] = useState(name);
  const [modifiedUrl, setModifiedUrl] = useState(url);
  const [modifiedDomain, setModifiedDomain] = useState(domain);
  const [modifiedDescription, setModifiedDescription] = useState(description);

    const toggleModal = () => {
      onClose();
    };

    const handleModifyCertificate = async (e: any) => {
      e.preventDefault();
      const idC = localStorage.getItem("ID");
      const token = localStorage.getItem("token");
      axios
        .put(API_URL+'/api/v1/certificates/' + String(id), {
          id: id,
          name: modifiedName,
          url: modifiedUrl,
          description: modifiedDescription,
          candidate: {
            id: idC,
          },
          domain: modifiedDomain
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
  
    const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setModifiedDomain(e.target.value);
    };
  
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setModifiedDescription(e.target.value);
    }

    return (
      <>
        {isOpen && (
          <div className="modal-certificate">
            <div onClick={toggleModal} className="overlay"></div>
              <button id="close-btn" onClick={toggleModal}>CLOSE</button>
              <div className="modal-content">
              <label htmlFor="name">Name:</label>
            <input type="text" id="name" placeholder="Enter name certificate" value={modifiedName} onChange={handleNameChange} />
            <label htmlFor="url">Url:</label>
            <input type="text" id="url" placeholder="Enter url certificate" value={modifiedUrl} onChange={handleUrlChange} />
            <label htmlFor="domain">Domain:</label>
            <input type="text" id="domain" placeholder="Enter domain certificate" value={modifiedDomain} onChange={handleDomainChange} />
            <label htmlFor="description">Description:</label>
            <textarea className="desc" id="description" placeholder="Enter description" value={modifiedDescription} onChange={handleDescriptionChange} />
            <button onClick={handleModifyCertificate}>Modify certificate</button>
              </div>
          </div>
        )}
      </>
    );
  }
  