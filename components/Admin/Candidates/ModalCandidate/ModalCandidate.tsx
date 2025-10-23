import React, { useState,useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./ModalCandidate.scss"
import API_URL from "@/config";

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


interface ModalProps {
    isOpen: boolean;
    id:number;
    onClose: () => void;
  }

  export default function Modal({ isOpen, id, onClose}: ModalProps) {
    const [score, setScore] = useState(0);
    const [skillsData,setSkillsData] = useState<skill[]>([])

    const toggleModal = () => {
      onClose();
    };

    const router = useRouter();

    const handleMore = async () =>{
      router.push('/Dashboards/Candidate');
      localStorage.setItem('ID',String(id));
    }

    const handleDelete = async (e:any, idS:number) =>{
      e.preventDefault()
      try{
        const token = localStorage.getItem("token")
      axios.delete(API_URL+'/api/v1/profiles/candidate-skills/'+String(id)+'/'+String(idS), {
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

    const handleScore = async (e:any, idS:number) =>{
      e.preventDefault()
      try{
        const token = localStorage.getItem("token")
      axios.put(API_URL+'/api/v1/profiles/candidate-skills/'+String(idS), {
        "id": 2,
        "score": score,
        "candidate": {
          "id": id
        },
        "skill": {
          "id": idS
        }
        }, {
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
      if (isOpen) {
        document.body.classList.add('active-modal');
      } else {
        document.body.classList.remove('active-modal');
      }
      const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(API_URL+'/api/v1/profiles/candidate-skills/byCandidate/' + id, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        const candidateSkills: skill[] = response.data;
        setSkillsData(candidateSkills);
        
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    }
    fetchData();
  
      return () => {
        document.body.classList.remove('active-modal');
      };
    }, [isOpen]);

    const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, skillsData }) => {
      if(skillsData.length != 0)
        return(
          <>
          {skillsData.map((skill) => (
            <div key={skill.id} className={className}>
            <h1>{skill.name} :</h1>
            <p>type: {skill.type} </p>
            <label htmlFor="score">Score:</label>
            <input type="number" id="score" placeholder="Enter score" value={score} onChange={(e) => setScore(parseInt(e.target.value))} />
            <button onClick={(e) => handleDelete(e, skill.id)}>Delete</button>
            <button onClick={(e) => handleScore(e, skill.id)}>Set score</button>
          </div>
          ))}
          </>
        )
      }
    

    return (
      <>
        {isOpen && (
          <div className="modal-Candidate">
            <div onClick={toggleModal} className="overlay"></div>
              <button id="close-btn" onClick={toggleModal}>CLOSE</button>
              <div className="modal-content">
                  <div className="div-skills">
                  <h1>Skills</h1>
                <div className='lists'>
                  <RepeatClassNTimes className="list" n={skillsData.length} skillsData={skillsData} />
                </div>
                <button onClick={handleMore}>More details</button>
                  </div>
              </div>
          </div>
        )}
      </>
    );
  }
  