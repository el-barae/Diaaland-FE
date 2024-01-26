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

const Skills = () => {
    const [name,setName] = useState('')
    const [score,setScore] = useState(0)
    const [skill,setSkill] = useState('')
    const [skillsData,setSkillsData] = useState<skill[]>([])

    const handleAddSkill = async (e:any, sid:number)  =>{
        e.preventDefault()
        const id = Cookies.get("id");
        axios.post('http://localhost:7777/api/v1/candidate-skills', {
          "name": name,
          "score": score,
          "candidate": {
            "id": id
          },
          "skill": {
            "id": sid
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
        axios.delete('http://localhost:7777/api/v1/candidate-skills')
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
              setSkillsData(response.data);
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
            <button onClick={(e) => handleDelete(e, skill.id)}>Delete</button>
          </div>
          ))}
          </>
        )
      }

    return(
        <>
            <div className="jobs">
                <h1>My skills</h1>
                <div className="add">
                <h2>Add skills</h2>
                <select id="skills" name="skills" value={skill} onChange={(e) => setSkill(e.target.value)}>
                    <option value="java">Java</option>  
                    <option value="c">C/C++</option>
                    <option value="python">Python </option>
                    <option value="spring">Spring-boot </option>
                    <option value="laravel">Laravel </option>  
                    <option value="react">React </option>
                    <option value="Vue">vue </option>
                    <option value="Angular">Angular </option>
                    <option value=".net">.Net </option>
                </select>
                <button onClick={(e) => handleAddSkill(e, 1)}>Add skill</button>
            </div>
                <div className='lists'>
                  <RepeatClassNTimes className="list" n={skillsData.length} skillsData={skillsData} />
                </div>
            </div>
        </>
    )
}

export default Skills;