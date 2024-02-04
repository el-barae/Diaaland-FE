'use client'
import './Projects.scss';
import { useState,useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Link from 'next/link';

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

const Projects = () => {
  const [name,setName] = useState('')
  const [startDate,setStartDate] = useState('')
  const [endDate,setEndDate] = useState('')
  const [desc,setDesc] = useState('')
  const [candidateId,setCandidateId] = useState(1)
    const [projectsData,setProjectsData] = useState<project[]>([])

    const handleAddProject = async (e:any)  =>{
      e.preventDefault()
      const id = Cookies.get("id");
      axios.post('http://localhost:7777/api/v1/projects', {
        "name": name,
        "startDate": startDate,
        "endDate": endDate,
        "description": desc,
        "candidate": {
          "id": id
        }
        }/*, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }*/)
        .then(function (response) {
        console.log(response);
        alert("Your post had been sent to admin ")
        })
        .catch(function (error) {
        alert(error.message);
        });
    }

    const handleDelete = async (e:any, id:number) =>{
      e.preventDefault()
      axios.delete('http://localhost:7777/api/v1/projects/'+String(id))
       .catch(function (error) {
        console.log(error);
       });
    }

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
          <button onClick={(e) => handleDelete(e, project.id)}>Delete</button>
        </div>
        ))}
        </>
      )
    }

    return(
      <>
        <div className="jobs">
        <h1 >Add Project</h1>
        <div className='add'>
            <div className="part1">
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
          <div className='part2'>
            <label htmlFor="decription">description:</label>
            <input type="text" placeholder='Enter description' value={desc} onChange={(e) => setDesc(e.target.value)}/>
            <button onClick={handleAddProject}>add project</button>
          </div>
        </div>
        <h1 >Projects</h1>
        <div className='lists'>
                  <RepeatClassNTimes className="list" n={projectsData.length} projectsData={projectsData} />
            </div>
        </div>
      </>
    )
}

export default Projects;