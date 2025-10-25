'use client'
import './Ex.scss';
import { useState,useEffect } from 'react';
import axios from 'axios';
import API_URL from '@/config'
import ModalXp from './ModalXp/ModalXp'
import { jwtDecode } from "jwt-decode";

interface MyToken {
  sub: string; // email
  id: number;
  name: string;
  role: string;
  exp: number;
}

interface xp{
    id: number;
    name : string;
    startDate : string;
    endDate : string;
}

interface RepeatClassNTimesProps {
    className: string;
    n: number;
    xpData: xp[];
  }

const Xp = () => {
  const [name,setName] = useState('')
  const [startDate,setStartDate] = useState('')
  const [endDate,setEndDate] = useState('')
  const [xpData,setXpData] = useState<xp[]>([])
  const [modalOpen, setModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [currentName, setCurrentName] = useState("");
  const [currentStartDate, setCurrentStartDate] = useState("");
  const [currentEndDate, setCurrentEndDate] = useState("");
  const handleApplyClick = (id:number, name:string, startDate: string, endDate:string) => {
    setCurrentId(id);
    setCurrentName(name);
    setCurrentStartDate(startDate);
    setCurrentEndDate(endDate);
    setModalOpen(true);
  };

     const handleAddXp = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Token not found, please log in again.");

      const decoded = jwtDecode<MyToken>(token);
      const candidateId = decoded.id;

      const response = await axios.post(
        `${API_URL}/api/v1/profiles/experiences`,
        {
          name,
          startDate,
          endDate,
          candidate: { id: candidateId },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setXpData((prev) => [...prev, response.data]);
      alert("Your experience has been added successfully.");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  // ✅ Supprimer une expérience
  const handleDelete = async (e: any, id: number) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(`${API_URL}/api/v1/profiles/experiences/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Mettre à jour localement
      setXpData((prev) => prev.filter((xp) => xp.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  // ✅ Récupérer les expériences du candidat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode<MyToken>(token);
        const candidateId = decoded.id;

        const response = await axios.get(
          `${API_URL}/api/v1/profiles/experiences/byCandidate/${candidateId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setXpData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchData();
  }, []);


  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, xpData }) => {
    if(xpData.length != 0)
      return(
        <>
        {xpData.map((xp) => (
          <div key={xp.id} className={className}>
          <h1>{xp.name} :</h1>
          <p>
            startDate: {xp.startDate}
          </p>
          <p>Close Date: {xp.endDate}</p>
          <button onClick={(e) => handleDelete(e, xp.id)}>Delete</button>
          <button onClick={() => handleApplyClick(xp.id, xp.name, xp.startDate, xp.endDate)}>Modify</button>
          <ModalXp isOpen={modalOpen} id={currentId} name={currentName} startDate={currentStartDate} endDate={currentEndDate} onClose={() => setModalOpen(false)} setXpData={setXpData} />
        </div>
        ))}
        </>
      )
    }

    return(
      <>
        
        <div className="jobs">
          <h1 id='add'>Add Experience</h1>
        <div className='add' id='addEx'>
              <label htmlFor="name">Name:</label>
              <input type="text" placeholder='Enter name project' value={name} onChange={(e) => setName(e.target.value)}/>
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
        </div>
        <button id='btn-add' onClick={handleAddXp}>add xp</button>
            <h1>Experiences</h1>
            <div className='lists'>
                  <RepeatClassNTimes className="list" n={xpData.length} xpData={xpData} />
            </div>
        </div>
      </>
    )
}

export default Xp;