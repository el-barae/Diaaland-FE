import React, { useState,useEffect } from "react";
import axios from "axios";
import "./Modal.scss";
import API_URL from "@/config";

interface Job {
  id: number;
  name: string;
  description: string;
  numberOfPositions: number;
  closeDate: string;
 }

interface ModalProps {
    isOpen: boolean;
    id: number;
    name: string;
    description: string;
    onClose: () => void;
  }

export default function Modal({ isOpen, id, description, name, onClose }: ModalProps) {
  const [isApplied, setIsApplied] = useState(false);
  const [isFavoris, setIsFavoris] = useState(false);
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);
  const [cv, setCV] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [diploma, setDiploma] = useState('');

    const toggleModal = () => {
      onClose();
    };

    const handleSubmit = (e:any, id:number) => {
      e.preventDefault();
      var ID = localStorage.getItem("ID");
    //ID = '1';
  axios.get(API_URL+'/api/v1/candidate-skills/haveSkills/'+ID, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .then(function (response) {
    if (response.data === true) {
      axios.post(API_URL+'/api/v1/candidate-jobs', {
        "status": "pending",
        "candidate": {
          "id": ID
        },
        "job": {
          "id": id
        },
        "cv": cv,
        "diploma": diploma,
        "coverLetter": coverLetter
      }, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then(function (response) {
        onClose();
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    else{
      alert("Your should add skills");
    }
  })
  .catch(function (error) {
    console.log(error);
  });
      setCV('');
      setCoverLetter('');
      setDiploma('');
      setShowModal(false);
    };
    
    const handleApply = async (e:any) =>{
		e.preventDefault()
    setShowModal(true);
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
		 }, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
		 .then(function (response) {
      onClose();
		 })
		 .catch(function (error) {
			console.log(error);
		 });
	}

    useEffect(() => {
      async function fetchData() {
        try {
          const response = await axios.get(API_URL + '/api/v1/candidate-jobs/itsApplied/' + 1 + '/' + id, {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          setIsApplied(response.data);  
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      fetchData();
      async function fetchData1() {
        try {
          const response1 = await axios.get(API_URL + '/api/v1/favoris/itsFavoris/' + 1 + '/' + id, {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          setIsFavoris(response1.data); 
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      fetchData1();
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
                {!showModal && !isApplied && <button id="apply-btn" onClick={(e) => handleApply(e)}>Apply</button>}
                {!showModal && !isFavoris && <button id="favoris-btn" onClick={(e) => handleAddFavoris(e, id)}>Add favoris</button>}
                {showModal && (
              <div className="form-apply">
                <label>CV:</label>
                <input type="text" value={cv} onChange={(e) => setCV(e.target.value)} />
                <label>Cover Letter:</label>
                <input type="text" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
                <label>Diploma:</label>
                <input type="text" value={diploma} onChange={(e) => setDiploma(e.target.value)} />
                <button type="submit" onClick={(e) =>handleSubmit(e, id)}>Submit</button>
              </div>
      )}
              </div>
          </div>
        )}
      </>
    );
  }
  