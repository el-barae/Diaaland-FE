'use client'
import { useState,useEffect } from "react";
import axios from "axios";
import './Candidates.scss'
import API_URL from "@/config";
import Modal from "./ModalCandidate/ModalCandidate"

interface Candidate{
  id:number;
	firstName:string;
  lastName:string;
	email:string;
	city:string;
	country:string;
	adress:string;
	accountStatus:string;
	phone:string;
	jobStatus:string;
	expectedSalary:number;
	linkedin:string;
	github:string;
	portofolio:string;
	blog:string;
	resume:string;
	image:string;
}

interface skill{
  id: number;
  name : string;
  type : string;
}

interface RepeatClassNTimesProps1 {
  className: string;
  n: number;
  skillsAll: skill[];
}

  interface RepeatClassNTimesProps {
    className: string;
    n: number;
    candidatesData: Candidate[];
  }
  const token = localStorage.getItem("token")

  const handleDelete = async (e:any, idC:number) =>{
    e.preventDefault()
    axios.delete(API_URL+'/api/v1/candidates'+'/'+String(idC), {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
     .catch(function (error) {
      console.log(error);
     });
  }

const Candidates = () =>{
    const [candidatesData,setCandidatesData] = useState<Candidate[]>([]);
    const [candidateId, setCandidateId] = useState<number>(0);
const [candidateFirstName, setCandidateFirstName] = useState<string>('');
const [candidateLastName, setCandidateLastName] = useState<string>('');
const [candidateEmail, setCandidateEmail] = useState<string>('');
const [candidateCity, setCandidateCity] = useState<string>('');
const [candidateCountry, setCandidateCountry] = useState<string>('');
const [candidateAddress, setCandidateAddress] = useState<string>('');
const [candidateAccountStatus, setCandidateAccountStatus] = useState<string>('');
const [candidatePhone, setCandidatePhone] = useState<string>('');
const [candidateJobStatus, setCandidateJobStatus] = useState<string>('');
const [candidateExpectedSalary, setCandidateExpectedSalary] = useState<number>(0);
const [candidateLinkedin, setCandidateLinkedin] = useState<string>('');
const [candidateGithub, setCandidateGithub] = useState<string>('');
const [candidatePortfolio, setCandidatePortfolio] = useState<string>('');
const [candidateBlog, setCandidateBlog] = useState<string>('');
const [candidateResume, setCandidateResume] = useState<string>('');
const [candidateImage, setCandidateImage] = useState<string>('');
const [modalOpen, setModalOpen] = useState(false);

const [skill,setSkill] = useState('Java')
const [skillsAll,setSkillsAll] = useState<skill[]>([])

const handleModify = (id: number, firstName: string, lastName: string, email: string, city: string, country: string, address: string, accountStatus: string, phone: string, jobStatus: string, expectedSalary: number, linkedin: string, github: string, portfolio: string, blog: string, resume: string, image: string) => {
  setCandidateId(id);
  setCandidateFirstName(firstName);
  setCandidateLastName(lastName);
  setCandidateEmail(email);
  setCandidateCity(city);
  setCandidateCountry(country);
  setCandidateAddress(address);
  setCandidateAccountStatus(accountStatus);
  setCandidatePhone(phone);
  setCandidateJobStatus(jobStatus);
  setCandidateExpectedSalary(expectedSalary);
  setCandidateLinkedin(linkedin);
  setCandidateGithub(github);
  setCandidatePortfolio(portfolio);
  setCandidateBlog(blog);
  setCandidateResume(resume);
  setCandidateImage(image);
  setModalOpen(true);
};

const getSkillIdByName = (skillName: string): number | null => {
  const foundSkill = skillsAll.find(skill => skill.name === skillName);
  return foundSkill ? foundSkill.id : null;
};

const handleFiltre = async () =>{
  const ID = getSkillIdByName(skill);
  if (ID !== null) {
    try {
      const response = await axios.get(API_URL+'/api/v1/candidate-skills/bySkill/' + String(ID), {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const candidateSkills: Candidate[] = response.data;
      setCandidatesData(candidateSkills);
      console.log('Candidates filtred');
    }catch(error){
  
    }
  } else {
    console.log('candidates not found');
    console.log(skill)
  }
  
}


const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, candidatesData }) => {
  if(candidatesData.length != 0)
    return(
      <>
      {candidatesData.map((c) => (
        <div key={c.id} className={className}>
        <h1>{c.firstName} {c.lastName}:</h1>
        <p>
          Email: {c.email} <br/> Job statut: {c.jobStatus} 
        </p>

        <button onClick={(e) => handleDelete(e, c.id)}>Delete</button>
        <button onClick={() => handleModify(c.id, c.firstName, c.lastName, c.email, c.city, c.country, c.adress, c.accountStatus, c.phone, c.jobStatus, c.expectedSalary, c.linkedin, c.github, c.portofolio, c.blog, c.resume, c.image)}>Modify</button>
        <Modal isOpen={modalOpen} id={candidateId} firstName={candidateFirstName} lastName={candidateLastName} email={candidateEmail} city={candidateCity} country={candidateCountry} adress={candidateAddress} accountStatus={candidateAccountStatus} phone={candidatePhone} jobStatus={candidateJobStatus} expectedSalary={candidateExpectedSalary} linkedin={candidateLinkedin} github={candidateGithub} portofolio={candidatePortfolio} blog={candidateBlog} resume={candidateResume} image={candidateImage} onClose={() => setModalOpen(false)} setCandidatesData={setCandidatesData} />
      </div>
      ))}
      </>
    )
  }

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(API_URL+'/api/v1/candidates', {
              headers: {
                'Authorization': 'Bearer ' + token
              }
            });   
            const res = await axios.get(API_URL+'/api/v1/skills', {
              headers: {
                'Authorization': 'Bearer ' + token
              }
            });
            const allSkills: skill[] = res.data;
            setSkillsAll(allSkills);
            setCandidatesData(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        };
        fetchData();
  }, []);

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
    <div className="panel">
        <div className='head'>
          <h1>Candidates</h1>
          <button type="button" className="button">
          <span className="button__text">Add</span>
          <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" className="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span>
          </button>
        </div>
        <div className="filtre">
          <h2>filter by Skills</h2>
          <select id="skills" name="skills" value={skill} onChange={(e) => setSkill(e.target.value)}>
                    <RepeatClassNTimes1 className="list" n={skillsAll.length} skillsAll={skillsAll} />
                </select>
          <button onClick={(e) => handleFiltre()}>Filter</button>
        </div>
        <div className='lists'>
                  <RepeatClassNTimes className="list" n={candidatesData.length} candidatesData={candidatesData} />
                </div>
    </div>
    );
}

export default Candidates;