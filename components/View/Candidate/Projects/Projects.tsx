'use client'
import { useState,useEffect } from 'react';
import axios from 'axios';
import API_URL from '@/config'


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
  const [projectsData, setProjectsData] = useState<Project[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const id = localStorage.getItem("IDSelected");
            const token = localStorage.getItem("token");
            const response = await axios.get(API_URL+'/api/v1/profiles/projects/byCandidate/'+String(id), {
              headers: {
                'Authorization': 'Bearer ' + token
              }
            });         
            setProjectsData(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        };
        fetchData();
  }, []);

  

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, projectsData }) => {

    if(projectsData.length != 0)
      return(
        <>
        {projectsData.map((project) => (
          <div key={project.id} className={className}>
          <h1>{project.name} :</h1>
          <p>startDate: {project.startDate}</p>
          <p>Close Date: {project.endDate}</p>
          <p>Description: {project.description}</p>
        </div>
        ))}
        </>
      )
    }

    return(
      <>
        <div className="jobs">
        <h1 >Projects</h1>
        <div className='lists'>
                  <RepeatClassNTimes className="list" n={projectsData.length} projectsData={projectsData} />
            </div>
        </div>
      </>
    )
}

export default Projects;