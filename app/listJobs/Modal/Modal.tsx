import React, { useState,useEffect,useRef, ChangeEvent  } from "react";
import axios from "axios";
import "./Modal.scss";
import API_URL from "@/config";
import swal from "sweetalert";

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


type FileState = File | null;

export default function Modal({ isOpen, id, description, name, onClose }: ModalProps) {
  const [file, setFile] = useState<FileState>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [diploma, setDiploma] = useState<FileState>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isFavoris, setIsFavoris] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const diplomaInputRef = useRef<HTMLInputElement>(null);

    const toggleModal = () => {
      onClose();
    };
  
    const handleApply = async (e:React.MouseEvent<HTMLButtonElement>) =>{
		e.preventDefault()
    const role = localStorage.getItem("role");
    if(role === "CANDIDAT")
     setShowModal(true);
    else
      swal("Authenticate yourself when you are a CANDIDATE", '', "error")
	}

  const handleAddFavoris = async (e:any, id:number) =>{
		e.preventDefault()
    const role = localStorage.getItem("role");
    if(role === "CANDIDAT"){
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
    else
      swal("Authenticate yourself when you are a CANDIDATE", '', "error")
	}

    useEffect(() => {
      async function fetchData() {
        const role = localStorage.getItem("role");
        if(role === "CANDIDAT"){
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
      }
      fetchData();
      async function fetchData1() {
        const role = localStorage.getItem("role");
        if(role === "CANDIDAT"){
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

  
    useEffect(() => {
      const fetchCV = async () => {
        const role = localStorage.getItem("role");
        if(role === "CANDIDAT"){
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found in localStorage');
          }
  
          const response = await fetch('http://localhost:7777/api/v1/candidates/resumefile/1', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const blob = await response.blob();
          const file = new File([blob], 'cv.pdf', { type: 'application/pdf' });
          setFile(file);
          setFileName(file.name);
        } catch (error) {
          console.error('Error fetching the CV:', error);
        }
        }
      };
  
      fetchCV();
    }, []);

    const handleSubmit = (e:any, id:number) => {
      e.preventDefault();
      var idC = localStorage.getItem("ID");
      const token = localStorage.getItem("token");
  axios.get(API_URL+'/api/v1/candidate-skills/haveSkills/'+idC, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .then(function (response) {
    if (response.data === true) {
      if (!file || !diploma) {
        console.error('CV or diploma file is missing');
        return;
      }
  
      const formData = new FormData();
      formData.append('candidateId', String(idC));
      formData.append('jobId', id.toString());
      formData.append('cv', file);
      formData.append('diploma', diploma);
      formData.append('coverLetter', coverLetter);

    fetch(API_URL+'/api/v1/candidate-jobs/send', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        swal("Your apply sent successfully", '', "success");
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
    else{
      swal("Your should add skills", '', 'error');
    }
  })
  .catch(function (error) {
    console.log(error);
  });
  setFile(null);
  setFileName(null);
  setCoverLetter('');
  setDiploma(null);
  setShowModal(false);
 };
  
    const handleFileSelect = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };
  
    return (
      <>
        {isOpen && (
          <div className="modal">
            <div onClick={toggleModal} className="overlay"></div>
              <button id="close-btn" onClick={toggleModal}>CLOSE</button>
              <div className="modal-content">
                <h1>{name}</h1>
                <p>{description}</p>
                {!showModal && !isApplied && <button id="apply-btn" onClick={handleApply}>Apply</button>}
            {!showModal && !isFavoris && <button id="favoris-btn" onClick={(e) => handleAddFavoris(e, 1)}>Add to favoris</button>}
            {showModal && (
              <div className="form-apply">
                <label>CV:</label>
                <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.doc,.docx"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;
          if (file) { 
            setFile(file);
            setFileName(file.name);
          } else {
            setFile(null);
            setFileName('');
          }
        }}
      />
      {/* Custom file input button */}
      <button id="btn-file" onClick={handleFileSelect}>
        {fileName ? `${fileName}` : 'Choose File'}
      </button>
      {/*fileName && (
        <div>
          <a href={URL.createObjectURL(file!)} download={fileName}>
            Download {fileName}
          </a>
        </div>
      )*/}
                <label>Cover Letter:</label>
                <input type="text" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
                <label>Diploma:</label>
                <input type="file" id="fileInput"  accept=".pdf,.doc,.docx" name="diploma" ref={diplomaInputRef}
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    setDiploma(file);
                  }} required />
                <button type="submit" onClick={(e) => handleSubmit(e, 1)}>Submit</button>
              </div>
            )}
              </div>
          </div>
        )}
      </>
    );
  }
  