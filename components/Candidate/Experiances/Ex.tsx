'use client'
import './Ex.scss';
import { useState } from 'react';
import React from 'react';
import ModalXp from './ModalXp/ModalXp'
import { useCandidateContext } from '@/contexts/CandidateContext'
import { useAPIMutation } from '@/hooks/useOptimizedAPI'
import API_URL from '@/config'
import axios from 'axios';

interface Xp {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

interface RepeatClassNTimesProps {
  className: string;
  n: number;
  xpData: Xp[];
}

const Xp = () => {
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [modalOpen, setModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [currentName, setCurrentName] = useState("");
  const [currentStartDate, setCurrentStartDate] = useState("");
  const [currentEndDate, setCurrentEndDate] = useState("");

  const { experiences, candidateId, refreshExperiences } = useCandidateContext();

  const addXpMutation = useAPIMutation(
    async () => {
      const token = localStorage.getItem("token");
      return axios.post(`${API_URL}/api/v1/profiles/experiences`, {
        name,
        startDate,
        endDate,
        candidate: { id: candidateId }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    {
      onSuccess: async () => {
        await refreshExperiences();
        setName('');
        setStartDate('');
        setEndDate('');
        alert("Experience added successfully!");
      },
      onError: (error: any) => {
        alert(error.message);
      },
      invalidatePatterns: ['experiences']
    }
  );

  const deleteXpMutation = useAPIMutation(
    async (xpId: number) => {
      const token = localStorage.getItem("token");
      return axios.delete(`${API_URL}/api/v1/profiles/experiences/${xpId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    {
      onSuccess: async () => {
        await refreshExperiences();
      },
      onError: (error) => {
        console.error("Error deleting experience:", error);
      },
      invalidatePatterns: ['experiences']
    }
  );

  const handleAddXp = async (e: any) => {
    e.preventDefault();
    if (!candidateId) {
      alert("Please log in again.");
      return;
    }
    await addXpMutation.mutate({ name, startDate, endDate});

  };

  const handleDelete = async (e: any, id: number) => {
    e.preventDefault();
    await deleteXpMutation.mutate(id);
  };

  const handleApplyClick = (id: number, name: string, startDate: string, endDate: string) => {
    setCurrentId(id);
    setCurrentName(name);
    setCurrentStartDate(startDate);
    setCurrentEndDate(endDate);
    setModalOpen(true);
  };

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, xpData }) => {
    if (xpData.length !== 0)
      return (
        <>
          {xpData.map((xp) => (
            <div key={xp.id} className={className}>
              <h1>{xp.name}:</h1>
              <p>startDate: {xp.startDate}</p>
              <p>Close Date: {xp.endDate}</p>
              <button 
                onClick={(e) => handleDelete(e, xp.id)}
                disabled={deleteXpMutation.loading}
              >
                {deleteXpMutation.loading ? 'Deleting...' : 'Delete'}
              </button>
              <button onClick={() => handleApplyClick(xp.id, xp.name, xp.startDate, xp.endDate)}>
                Modify
              </button>
              <ModalXp 
                isOpen={modalOpen} 
                id={currentId} 
                name={currentName} 
                startDate={currentStartDate} 
                endDate={currentEndDate} 
                onClose={() => setModalOpen(false)} 
                setXpData={refreshExperiences} 
              />
            </div>
          ))}
        </>
      )
    return null;
  }

  return (
    <div className="jobs">
      <h1 id='add'>Add Experience</h1>
      <div className='add' id='addEx'>
        <label htmlFor="name">Name:</label>
        <input type="text" placeholder='Enter name project' value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor="startDate">Start Date:</label>
        <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label htmlFor="CloseDate">End Date:</label>
        <input type="date" id="CloseDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <button 
        id='btn-add' 
        onClick={handleAddXp}
        disabled={addXpMutation.loading}
      >
        {addXpMutation.loading ? 'Adding...' : 'Add xp'}
      </button>
      <h1>Experiences</h1>
      <div className='lists'>
        <RepeatClassNTimes className="list" n={experiences.length} xpData={experiences} />
      </div>
    </div>
  )
}

export default Xp;