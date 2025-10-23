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

const Skills = () => {
    const [skillsData,setSkillsData] = useState<skill[]>([])
  
      useEffect(() => {
          const fetchData = async () => {
            try {
              var ID = localStorage.getItem("IDSelected");
              const token = localStorage.getItem("token");
              const response = await axios.get(API_URL+'/api/v1/profiles/candidate-skills/byCandidate/' + String(ID), {
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              });
              const candidateSkills: skill[] = response.data;
              setSkillsData(candidateSkills);
            } catch (error) {
              console.error('Erreur lors de la récupération des données :', error);
            }
          };
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
            </div>
            ))}
            </>
          )
        }

    return(
        <>
            <div className="jobs">
                <h1>My skills</h1>
                <div className='lists'>
                  <RepeatClassNTimes className="list" n={skillsData.length} skillsData={skillsData} />
                </div>
            </div>
        </>
    )
}

export default Skills;