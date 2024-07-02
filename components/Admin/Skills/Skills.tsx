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

/*interface RepeatClassNTimesProps {
    className: string;
    n: number;
    filteredSkills: skill[];
  }
  interface RepeatClassNTimesProps1 {
    className: string;
    n: number;
    skillsAll: skill[];
  }
*/
  interface Skills {
    n: number;
    filteredSkills: skill[];
 }

const Skills = () => {
    const [name,setName] = useState('')
    const [type,setType] = useState('')
    const [skill,setSkill] = useState('')
    const [skillsData,setSkillsData] = useState<skill[]>([])
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSkills, setFilteredSkills] = useState<skill[]>([]);

    const handleSearch = (term: string) => {
      const filtered = skillsData.filter((skill) =>
        skill.name.toLowerCase().includes(term.toLowerCase())/* ||
        skill.type.toLowerCase().includes(searchTerm.toLowerCase())*/
      );
      setFilteredSkills(filtered);
   };

    const handleAddSkill = async (e:any, sname:string, stype:string)  =>{
      e.preventDefault()
      setSkill('');
      setType('');
      try {
        const token = localStorage.getItem("token")
        await axios.post(API_URL+'/api/v1/skills', {
          "name": sname,
          "type": stype
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });        
        const response = await axios.get(API_URL+'/api/v1/skills', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        const candidateSkills: skill[] = response.data;
        setSkillsData(candidateSkills);
        setFilteredSkills(candidateSkills);
      } catch (error) {
        console.log(error);
      }
    }
    
  
      const handleDelete = async (e:any, idS:number) =>{
        e.preventDefault()
        try{
          const token = localStorage.getItem("token")
        axios.delete(API_URL+'/api/v1/skills/'+String(idS), {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        const updatedSkillsData = skillsData.filter(skill => skill.id !== idS)
        setSkillsData(updatedSkillsData)
        setFilteredSkills(updatedSkillsData)
        }catch (error) {
        console.log(error);
       };
      }
  
      useEffect(() => {
          const fetchData = async () => {
            try {
              const token = localStorage.getItem("token")
              const response = await axios.get(API_URL+'/api/v1/skills', {
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              });
              const candidateSkills: skill[] = response.data;
              setSkillsData(candidateSkills);
              setFilteredSkills(candidateSkills);
            } catch (error) {
              console.error('Erreur lors de la récupération des données :', error);
            }
          };{handleAddSkill}
          fetchData();
    }, []);
  
    /*const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, filteredSkills }) => {
      if (filteredSkills.length !== 0)
        return (
          <>
            {filteredSkills.map((skill) => (
              <div key={skill.id} className={className}>
                <h1>{skill.name}</h1>
                <p>type: {skill.type} </p>
                <button onClick={(e) => handleDelete(e, skill.id)}>Delete</button>
              </div>
            ))}
          </>
        );
    };*/
    
    const AllSkills: React.FC<Skills> = ({ n, filteredSkills }) => {
      const skills = filteredSkills;
      return (
        <>
          {skills.map((skill) => (
            <tr key={skill.id}>
              <td>{skill.name}</td>
              <td>{skill.type}</td>
              <td><button onClick={(e) => handleDelete(e, skill.id)}>    Delete</button></td>
            </tr>
          ))}
        </>
      );
    };
    

    return(
        <>
            <div className="panel">
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
                <div className="search">
                <label>
                    <input type="text" placeholder="Search here" value={searchTerm} onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                    }}
                    required></input>
                </label>
              </div>
                <table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Type</td>
                            <td>Delete</td>
                        </tr>
                    </thead>

                    <tbody>
                    <AllSkills n={filteredSkills.length} filteredSkills={filteredSkills} /> 
                    </tbody>
                </table>
                {/*
                <div className='lists-skills'>
                  <RepeatClassNTimes className="list-skill" n={filteredSkills.length} filteredSkills={filteredSkills} />
                </div>
                */}
            </div>
        </>
    )
}

export default Skills;