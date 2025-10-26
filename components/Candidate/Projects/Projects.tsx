'use client'
import './Projects.scss';
import { useState } from 'react';
import React from 'react';
import Modal from './ModalProject/ModalProject'
import { useCandidateContext } from '@/contexts/CandidateContext'
import { useAPIMutation } from '@/hooks/useOptimizedAPI'
import API_URL from '@/config'
import axios from 'axios';

interface Project {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface RepeatClassNTimesProps {
  className: string;
  n: number;
  projectsData: Project[];
}

const Projects = () => {
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [desc, setDesc] = useState('')
  const [modalOpen, setModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [currentName, setCurrentName] = useState("");
  const [currentStartDate, setCurrentStartDate] = useState("");
  const [currentEndDate, setCurrentEndDate] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");

  const { projects, candidateId, refreshProjects } = useCandidateContext();

  const addProjectMutation = useAPIMutation(
    async () => {
      const token = localStorage.getItem("token");
      return axios.post(`${API_URL}/api/v1/profiles/projects`, {
        name,
        startDate,
        endDate,
        description: desc,
        candidate: { id: candidateId }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    {
      onSuccess: async () => {
        await refreshProjects();
        setName('');
        setStartDate('');
        setEndDate('');
        setDesc('');
        alert("Project added successfully!");
      },
      onError: (error: any) => {
        alert(error.message);
      },
      invalidatePatterns: ['projects']
    }
  );

  const deleteProjectMutation = useAPIMutation(
    async (projectId: number) => {
      const token = localStorage.getItem("token");
      return axios.delete(`${API_URL}/api/v1/profiles/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    {
      onSuccess: async () => {
        await refreshProjects();
      },
      onError: (error) => {
        console.error("Error deleting project:", error);
      },
      invalidatePatterns: ['projects']
    }
  );

  const handleAddProject = async (e: any) => {
    e.preventDefault();
    if (!candidateId) {
      alert("Please log in again.");
      return;
    }
    addProjectMutation.mutate({ name, startDate, endDate, description: desc });
  }

  const handleDelete = async (e: any, id: number) => {
    e.preventDefault();
    await deleteProjectMutation.mutate(id);
  }

  const handleModifyClick = (e: any, id: number, name: string, startDate: string, endDate: string, description: string) => {
    setCurrentId(id);
    setCurrentName(name);
    setCurrentStartDate(startDate);
    setCurrentEndDate(endDate);
    setCurrentDescription(description);
    setModalOpen(true);
  };

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, projectsData }) => {
    if (projectsData.length !== 0)
      return (
        <>
          {projectsData.map((project) => (
            <div key={project.id} className={className}>
              <h1>{project.name}:</h1>
              <p>startDate: {project.startDate}</p>
              <p>Close Date: {project.endDate}</p>
              <p>Description: {project.description}</p>
              <button 
                onClick={(e) => handleDelete(e, project.id)}
                disabled={deleteProjectMutation.loading}
              >
                {deleteProjectMutation.loading ? 'Deleting...' : 'Delete'}
              </button>
              <button onClick={(e) => handleModifyClick(e, project.id, project.name, project.startDate, project.endDate, project.description)}>
                Modify
              </button>
              <Modal 
                isOpen={modalOpen} 
                id={currentId} 
                name={currentName} 
                startDate={currentStartDate} 
                endDate={currentEndDate} 
                description={currentDescription} 
                onClose={() => setModalOpen(false)} 
                setProjectsData={refreshProjects} 
              />
            </div>
          ))}
        </>
      )
    return null;
  }

  return (
    <div className="jobs">
      <h1>Add Project</h1>
      <div className='add'>
        <div className="part1">
          <label htmlFor="name">Name:</label>
          <input type="text" placeholder='Enter name project' value={name} onChange={(e) => setName(e.target.value)} />
          <label htmlFor="startDate">Start Date:</label>
          <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <label htmlFor="CloseDate">End Date:</label>
          <input type="date" id="CloseDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className='part2'>
          <label htmlFor="decription">description:</label>
          <input type="text" placeholder='Enter description' value={desc} onChange={(e) => setDesc(e.target.value)} />
          <button 
            onClick={handleAddProject}
            disabled={addProjectMutation.loading}
          >
            {addProjectMutation.loading ? 'Adding...' : 'Add project'}
          </button>
        </div>
      </div>
      <h1>Projects</h1>
      <div className='lists'>
        <RepeatClassNTimes className="list" n={projects.length} projectsData={projects} />
      </div>
    </div>
  )
}

export default Projects;