'use client'
import './Projects.scss';
import { useState,useEffect } from 'react';
import axios from 'axios';
import Modal from './ModalProject/ModalProject'
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
  const [name,setName] = useState('')
  const [startDate,setStartDate] = useState('')
  const [endDate,setEndDate] = useState('')
  const [desc,setDesc] = useState('')
  const [projectsData, setProjectsData] = useState<Project[]>([]);

    const handleAddProject = async (e:any)  =>{
      e.preventDefault()
      const id = localStorage.getItem("ID");
      const token = localStorage.getItem("token");
      axios.post(API_URL+'/api/v1/projects', {
        "name": name,
        "startDate": startDate,
        "endDate": endDate,
        "description": desc,
        "candidate": {
          "id": id
        }
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        .then(function (response) {
          setProjectsData(prevProjectsData => [...prevProjectsData, response.data]);
        console.log(response);
        alert("Your post had been sent to admin ")
        })
        .catch(function (error) {
        alert(error.message);
        });
    }

    const handleDelete = async (e:any, id:number) =>{
      e.preventDefault()
      try{
        const token = localStorage.getItem("token");
      axios.delete(API_URL+'/api/v1/projects/'+String(id), {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const updatedProjectsData = projectsData.filter(pro => pro.id !== id)
      setProjectsData(updatedProjectsData)
      }catch (error) {
        console.log(error);
       };
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [currentId, setCurrentId] = useState(0);
    const [currentName, setCurrentName] = useState("");
    const [currentStartDate, setCurrentStartDate] = useState("");
    const [currentEndDate, setCurrentEndDate] = useState("");
    const [currentDescription, setCurrentDescription] = useState("");
    const handleModifyClick = (e:any, id:number, name:string, startDate: string, endDate:string, description:string) => {
      setCurrentId(id);
      setCurrentName(name);
      setCurrentStartDate(startDate);
      setCurrentEndDate(endDate);
      setCurrentDescription(description);
      setModalOpen(true);
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const id = localStorage.getItem("ID");
            const token = localStorage.getItem("token");
            const response = await axios.get(API_URL+'/api/v1/projects/byCandidate/'+String(id), {
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
          <button onClick={(e) => handleDelete(e, project.id)}>Delete</button>
          <button onClick={(e) => handleModifyClick(e, project.id, project.name, project.startDate, project.endDate, project.description)}>Modify</button>
          <Modal isOpen={modalOpen} id={currentId} name={currentName} startDate={currentStartDate} endDate={currentEndDate} description={currentDescription} onClose={() => setModalOpen(false)} setProjectsData={setProjectsData} />
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