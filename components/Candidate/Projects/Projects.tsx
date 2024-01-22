'use client'
import './Projects.scss';
import { useState,useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

interface project{
    id: number;
    name : string;
    startDate : string;
    endDate : string;
    description : string;
}

interface RepeatClassNTimesProps {
    className: string;
    n: number;
    projectsData: project[];
  }

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, projectsData }) => {
    if(projectsData.length != 0)
      return(
        <>
        {projectsData.map((project) => (
          <div key={project.id} className={className}>
          <h1>{project.name} :</h1>
          <p>
            Description: {project.description}
          </p>
          <p>
            startDate: {project.startDate}
          </p>
          <p>Close Date: {project.endDate}</p>
        </div>
        ))}
        </>
      )
    }

const Projects = () => {
    const [projectsData,setProjectsData] = useState<project[]>([])
    useEffect(() => {
        const fetchData = async () => {
          try {
            Cookies.set("id","1")
            const id = Cookies.get("id");
            const response = await axios.get('http://localhost:7777/api/v1/projects/byCandidate/'+String(id));         
            setProjectsData(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        };
        fetchData();
  }, []);
    return(
        <div className="jobs">
            <h1>Projects</h1>
            <div className='lists'>
                  <RepeatClassNTimes className="list" n={projectsData.length} projectsData={projectsData} />
            </div>
        </div>
    )
}

export default Projects;