import React, { useState,useEffect,useRef, ChangeEvent  } from "react";
import axios from "axios";
import "./Modal.scss";
import API_URL from "@/config";
import { jwtDecode } from "jwt-decode";
import swal from "sweetalert";

interface MyToken {
  sub: string; // email
  id: number;
  name: string;
  role: string;
  exp: number;
}

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
    email: string;
    description: string;
    onClose: () => void;
  }


type FileState = File | null;

export default function Modal({ isOpen, id, description, name,email, onClose }: ModalProps) {
  const [file, setFile] = useState<FileState>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [diploma, setDiploma] = useState<FileState>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isFavoris, setIsFavoris] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const diplomaInputRef = useRef<HTMLInputElement>(null);

    const toggleModal = () => {
      onClose();
    };

    const handleSend = async (e: any) => {
      e.preventDefault();
      const token = localStorage.getItem("token")
      axios
        .post(API_URL+'/api/v1/users/messages', {
          "email": "me.diaaland@gmail.com",
          "subject": "Application",
          "message": "You are new application for your job"+name,
          "date": "2024-04-16T12:00:00",
          "recipient": email,
          "view": false
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
  
    // ✅ Handle Apply
  const handleApply = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return swal("Authentication required", "", "error");

    const decoded = jwtDecode<MyToken>(token);
    if (decoded.role === "CANDIDAT") setShowModal(true);
    else swal("Authenticate yourself when you are a CANDIDATE", "", "error");
  };

  // ✅ Handle Add to Favoris
  const handleAddFavoris = async (e: any, jobId: number) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return swal("Authentication required", "", "error");

    const decoded = jwtDecode<MyToken>(token);
    if (decoded.role === "CANDIDAT") {
      try {
        await axios.post(
          `${API_URL}/api/v1/jobs/favoris`,
          {
            candidate: { id: decoded.id },
            job: { id: jobId },
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        onClose();
      } catch (error) {
        console.error("Error adding favoris:", error);
      }
    } else {
      swal("Authenticate yourself when you are a CANDIDATE", "", "error");
    }
  };

  // ✅ Vérifier si le candidat a déjà postulé ou ajouté en favoris
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode<MyToken>(token);
    if (decoded.role !== "CANDIDAT") return;

    const fetchApplyAndFavoris = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [applyRes, favorisRes] = await Promise.all([
          axios.get(`${API_URL}/api/v1/jobs/candidate-jobs/itsApplied/${decoded.id}/${id}`, { headers }),
          axios.get(`${API_URL}/api/v1/jobs/favoris/itsFavoris/${decoded.id}/${id}`, { headers }),
        ]);

        setIsApplied(applyRes.data);
        setIsFavoris(favorisRes.data);
      } catch (error) {
        console.error("Error fetching apply/favoris status:", error);
      }
    };

    fetchApplyAndFavoris();

    // gestion du modal body scroll
    document.body.classList.toggle("active-modal", isOpen);
    return () => document.body.classList.remove("active-modal");
  }, [id, isOpen]);

  // ✅ Charger le CV depuis le token.id
  useEffect(() => {
    const fetchCV = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwtDecode<MyToken>(token);
      if (decoded.role !== "CANDIDAT") return;

      try {
        const response = await fetch(`${API_URL}/api/v1/profiles/candidates/resumefile/${decoded.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const blob = await response.blob();
        const file = new File([blob], "cv.pdf", { type: "application/pdf" });
        setFile(file);
        setFileName(file.name);
      } catch (error) {
        console.error("Error fetching CV:", error);
      }
    };

    fetchCV();
  }, []);

  // ✅ Handle Submit candidature
  const handleSubmit = async (e: any, jobId: number) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return swal("Authentication required", "", "error");

    const decoded = jwtDecode<MyToken>(token);

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const skillRes = await axios.get(
        `${API_URL}/api/v1/profiles/candidate-skills/haveSkills/${decoded.id}`,
        { headers }
      );

      if (!skillRes.data) {
        swal("You should add skills", "", "error");
        return;
      }

      if (!file || !diploma) {
        console.error("CV or diploma file is missing");
        return;
      }

      const formData = new FormData();
      formData.append("candidateId", String(decoded.id));
      formData.append("jobId", jobId.toString());
      formData.append("cv", file);
      formData.append("diploma", diploma);
      formData.append("coverLetter", coverLetter);

      const response = await fetch(`${API_URL}/api/v1/jobs/candidate-jobs/send`, {
        method: "POST",
        body: formData,
        headers,
      });

      const data = await response.json();
      console.log("Success:", data);
      swal("Your apply sent successfully", "", "success");

      // Nettoyage
      setFile(null);
      setFileName(null);
      setCoverLetter("");
      setDiploma(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting application:", error);
    }
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
                <p id="desc">{description}</p>
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
                <button id="submit" type="submit" onClick={(e) => handleSubmit(e, id)}>Submit</button>
              </div>
            )}
              </div>
          </div>
        )}
      </>
    );
  }
  