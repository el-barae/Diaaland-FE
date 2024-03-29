'use client'
import './Skills.scss'
import { useState, useEffect } from "react"
import Cookies from "js-cookie";
import axios from "axios";
import API_URL from '@/config';

interface skill{
    id: number;
    name : string;
    type : string;
}

interface RepeatClassNTimesProps {
    className: string;
    n: number;
    skillsData: skill[];
  }
  interface RepeatClassNTimesProps1 {
    className: string;
    n: number;
    skillsAll: skill[];
  }

  interface Skills {
    n: number;
    skillsData: skill[];
 }

const Skills = () => {
    const [name,setName] = useState('')
    const [type,setType] = useState('')
    const [skill,setSkill] = useState('')
    const [skillsData,setSkillsData] = useState<skill[]>([])

    const handleAddSkill = async (e:any, sname:string, stype:string)  =>{
      e.preventDefault()
      setSkill('');
      setType('');
      try {
        await axios.post(API_URL+'/api/v1/skills', {
          "name": sname,
          "type": stype
           /*, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }*/
        });        
        const response = await axios.get(API_URL+'/api/v1/skills');
        const candidateSkills: skill[] = response.data;
        setSkillsData(candidateSkills);
      } catch (error) {
        console.log(error);
      }
    }
    
  
      const handleDelete = async (e:any, idS:number) =>{
        e.preventDefault()
        try{
        axios.delete(API_URL+'/api/v1/skills/'+String(idS))
        const updatedSkillsData = skillsData.filter(skill => skill.id !== idS)
        setSkillsData(updatedSkillsData)
        }catch (error) {
        console.log(error);
       };
      }
  
      useEffect(() => {
          const fetchData = async () => {
            try {
              const response = await axios.get(API_URL+'/api/v1/skills');
              const candidateSkills: skill[] = response.data;
              setSkillsData(candidateSkills);
            } catch (error) {
              console.error('Erreur lors de la récupération des données :', error);
            }
          };{handleAddSkill}
          fetchData();
    }, []);
  
      const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, skillsData }) => {
        if(skillsData.length != 0)
          return(
            <>
            {skillsData.map((skill) => (
              <div key={skill.id} className={className}>
              <h1>{skill.name}</h1>
              <p>type: {skill.type} </p>
              <button onClick={(e) => handleDelete(e, skill.id)}>Delete</button>
            </div>
            ))}
            </>
          )
        }

        const AllSkills: React.FC<Skills> = ({ n, skillsData }) => {
          const skills = skillsData;
          return (
              <>
                  {skills.map((skill) => (
                      <tr key={skill.id}>
                          <td>{skill.name}</td>
                          <td>{skill.type}</td>
                          <td><button onClick={(e) => handleDelete(e, skill.id)}>Delete</button></td>
                      </tr>
                  ))}
              </>
          );
        }

    return(
        <>
            <div className="jobs">
            <h1>Add skills</h1>
              <div className="add">
                <div className='list'>
                <label htmlFor="startDate">Name:</label>           
                  <input type="text" id="add-skill" placeholder="Enter skill name" value={skill} onChange={(e) => setSkill(e.target.value)} />
                  <label htmlFor="startDate">Type:</label>
                  <input type="text" id="skill-type" placeholder="Enter skill type" value={type} onChange={(e) => setType(e.target.value)} />
              </div>   
                <button onClick={(e) => handleAddSkill(e, skill,type)}>Add skill</button>
            </div>
                <h1>Skills</h1>
                <table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Type</td>
                            <td>Delete</td>
                        </tr>
                    </thead>

                    <tbody>
                    <AllSkills n={skillsData.length} skillsData={skillsData} /> 
                    </tbody>
                </table>
                <div className='lists-skills'>
                  <RepeatClassNTimes className="list-skill" n={skillsData.length} skillsData={skillsData} />
                </div>
            </div>
        </>
    )
}

export default Skills;