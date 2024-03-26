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

  interface RepeatClassNTimesProps {
    className: string;
    n: number;
    candidatesData: Candidate[];
  }

  const handleDelete = async (e:any, idC:number) =>{
    e.preventDefault()
    axios.delete(API_URL+'/api/v1/candidates'+'/'+String(idC))
     .catch(function (error) {
      console.log(error);
     });
  }

const Candidates = () =>{
    const [candidatesData,setCandidatesData] = useState([])
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
        <Modal isOpen={modalOpen} id={candidateId} firstName={candidateFirstName} lastName={candidateLastName} email={candidateEmail} city={candidateCity} country={candidateCountry} adress={candidateAddress} accountStatus={candidateAccountStatus} phone={candidatePhone} jobStatus={candidateJobStatus} expectedSalary={candidateExpectedSalary} linkedin={candidateLinkedin} github={candidateGithub} portfolio={candidatePortfolio} blog={candidateBlog} resume={candidateResume} image={candidateImage} onClose={() => setModalOpen(false)} setCandidateData={setCandidatesData} />
      </div>
      ))}
      </>
    )
  }

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(API_URL+'/api/v1/candidates');   
                  
            setCandidatesData(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        };
        fetchData();
  }, []);
    return(
    <div className="jobs">
        <h1>Candidates</h1>
        <div className='lists'>
                  <RepeatClassNTimes className="list" n={candidatesData.length} candidatesData={candidatesData} />
                </div>
    </div>
    );
}

export default Candidates;