'use client'
import './Skills.scss'
import { useState, useEffect } from "react"
import Cookies from "js-cookie";
import axios from "axios";

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
    skills1: skill[];
  }

const Skills = () => {
    const [name,setName] = useState('')
    const [score,setScore] = useState(0)
    const [skill,setSkill] = useState('')
    const [skills1,setSkills1] = useState<skill[]>([])
    const [skillsData,setSkillsData] = useState<skill[]>([])

    const handleAddSkill = async (e:any, sname:string)  =>{
        e.preventDefault()
        const id = Cookies.get("id");
        const response = await axios.get('http://localhost:7777/api/v1/skills/id/'+sname);
        axios.post('http://localhost:7777/api/v1/candidate-skills', {
          "name": name,
          "score": score,
          "candidate": {
            "id": id
          },
          "skill": {
            "id": response.data
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
        axios.delete('http://localhost:7777/api/v1/candidate-skills'+String(id))
         .catch(function (error) {
          console.log(error);
         });
      }
  
      useEffect(() => {
          const fetchData = async () => {
            try {
              Cookies.set("id","1")
              const id = Cookies.get("id");
              const response = await axios.get('http://localhost:7777/api/v1/candidate-skills/byCandidate/'+String(id));
              const res = await axios.get('http://localhost:7777/api/v1/skills');         
              setSkillsData(response.data);
              setSkills1(res.data)
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
              <h1>{skill.name} :</h1>
              <p>type: {skill.type} </p>
              <button onClick={(e) => handleDelete(e, skill.id)}>Delete</button>
            </div>
            ))}
            </>
          )
        }

        const RepeatClassNTimes1: React.FC<RepeatClassNTimesProps1> = ({ className, n, skills1 }) => {
          if(skills1.length != 0)
            return(
              <>
              {skills1.map((skill) => (
                <option value="skill">{skill.name}</option>
              ))}
              </>
            )
          }

    return(
        <>
            <div className="jobs">
            <h1>Add skills</h1>
              <div className="add">
                
                <select id="skills" name="skills" value={skill} onChange={(e) => setSkill(e.target.value)}>
                    <RepeatClassNTimes1 className="list" n={skills1.length} skills1={skills1} />
                </select>
                <button onClick={(e) => handleAddSkill(e, skill)}>Add skill</button>
            </div>
                <h1>My skills</h1>
                <div className='lists'>
                  <RepeatClassNTimes className="list" n={skillsData.length} skillsData={skillsData} />
                </div>
            </div>
        </>
    )
}

export default Skills;