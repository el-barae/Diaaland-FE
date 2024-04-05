'use client'
import './Skills.scss'
import { useState, useEffect } from "react"
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

const Skills = () => {
    const [name,setName] = useState('')
    const [score,setScore] = useState(0)
    const [skill,setSkill] = useState('')
    const [skillsAll,setSkillsAll] = useState<skill[]>([])
    const [skillsData,setSkillsData] = useState<skill[]>([])
    const token = localStorage.getItem("token");
    const handleAddSkill = async (e:any, sname:string)  =>{
      e.preventDefault()
      console.log(skill);
      setSkill('');
      var ID = localStorage.getItem("ID");
      const response = await axios.get(API_URL+'/api/v1/skills/id/'+sname, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const skillId = response.data;
      try{
        const res = await axios.get(API_URL+'/api/v1/skills/'+String(response.data), {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }).then(function (res) {
        setSkillsData(prevSkillsData => [...prevSkillsData, res.data]);
        console.log(res);
        })
      }catch (error) {
        console.log(error);
       };
      axios.post(API_URL+'/api/v1/candidate-skills', {
        "score": score,
        "candidate": {
          "id": ID
        },
        "skill": {
          "id": skillId
        }
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        .then(function (response) {
        const updatedSkillsAll = skillsAll.filter(skill => skill.id !== skillId)
        setSkillsAll(updatedSkillsAll)
        if (skillsAll.length > 0) {
          setSkill(skillsAll[0].name);
        }
        console.log(response);
        alert("Your post had been sent to admin ")
        })
        .catch(function (error) {
        alert(error.message);
        });
    } 
  
      const handleDelete = async (e:any, idS:number) =>{
        e.preventDefault()
        try{
          var ID = localStorage.getItem("ID");
        axios.delete(API_URL+'/api/v1/candidate-skills/'+String(ID)+'/'+String(idS), {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        const updatedSkillsData = skillsData.filter(skill => skill.id !== idS)
        setSkillsData(updatedSkillsData)
        }catch (error) {
        console.log(error);
       };
      }
  
      useEffect(() => {
          const fetchData = async () => {
            try {
              var ID = localStorage.getItem("ID");
              const response = await axios.get(API_URL+'/api/v1/candidate-skills/byCandidate/' + String(ID), {
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              });
              const candidateSkills: skill[] = response.data;
              const res = await axios.get(API_URL+'/api/v1/skills', {
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              });
              const allSkills: skill[] = res.data;
              setSkillsData(candidateSkills);
              if(candidateSkills !== null && candidateSkills.length > 0){
                const skillAll = allSkills.filter(skill => !candidateSkills.some(candidateSkill => candidateSkill.id === skill.id));             
                setSkillsAll(skillAll);
              }
              else{
                setSkillsAll(allSkills);
              }
                setSkill(skillsAll[0].name);
              
              console.log("skillAll: "+skillsAll[0].name);
              console.log("skill: "+skill);
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

        const RepeatClassNTimes1: React.FC<RepeatClassNTimesProps1> = ({ className, n, skillsAll }) => {
          if(skillsAll.length != 0)
            return(
              <>
              {skillsAll.map((skill) => (
                <option key={skill.name} value={skill.name} >{skill.name}</option>
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
                    <RepeatClassNTimes1 className="list" n={skillsAll.length} skillsAll={skillsAll} />
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