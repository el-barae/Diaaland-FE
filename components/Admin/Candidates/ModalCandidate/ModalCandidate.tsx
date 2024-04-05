import React, { useState,useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./ModalCandidate.scss"
import API_URL from "@/config";

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

interface RepeatClassNTimesProps {
  className: string;
  n: number;
  skillsData: skill[];
}


interface ModalProps {
    isOpen: boolean;
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
    onClose: () => void;
    setCandidatesData: React.Dispatch<React.SetStateAction<Candidate[]>>;
  }

  export default function Modal({ isOpen, id, firstName, lastName, email, city, country, adress, accountStatus, phone, jobStatus, expectedSalary, linkedin, github, portofolio, blog, resume, image, onClose, setCandidatesData }: ModalProps) {
    const [McandidateFirstName, setCandidateFirstName] = useState(firstName);
    const [McandidateLastName, setCandidateLastName] = useState(lastName);
    const [McandidateEmail, setCandidateEmail] = useState(email);
    const [McandidateCity, setCandidateCity] = useState(city);
    const [McandidateCountry, setCandidateCountry] = useState(country);
    const [McandidateAddress, setCandidateAddress] = useState(adress);
    const [McandidateAccountStatus, setCandidateAccountStatus] = useState(accountStatus);
    const [McandidatePhone, setCandidatePhone] = useState(phone);
    const [McandidateJobStatus, setCandidateJobStatus] = useState(jobStatus);
    const [McandidateExpectedSalary, setCandidateExpectedSalary] = useState(expectedSalary);
    const [McandidateLinkedin, setCandidateLinkedin] = useState(linkedin);
    const [McandidateGithub, setCandidateGithub] = useState(github);
    const [McandidatePortfolio, setCandidatePortfolio] = useState(portofolio);
    const [McandidateBlog, setCandidateBlog] = useState(blog);
    const [McandidateResume, setCandidateResume] = useState(resume);
    const [McandidateImage, setCandidateImage] = useState(image);
    const [score, setScore] = useState(0);
    const [skillsData,setSkillsData] = useState<skill[]>([])
    const token = localStorage.getItem("token")

    const toggleModal = () => {
      onClose();
    };

    const handleDelete = async (e:any, idS:number) =>{
      e.preventDefault()
      try{
      axios.delete(API_URL+'/api/v1/candidate-skills/'+String(id)+'/'+String(idS), {
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
      axios.put(API_URL+'/api/v1/candidate-skills/'+String(idS), {
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

    const handleModify = async (e: any) => {
      e.preventDefault();
      axios
        .put(API_URL+'/api/v1/candidates/' + String(id), {
          id: id,
          firstName: McandidateFirstName,
lastName: McandidateLastName,
email: McandidateEmail,
city: McandidateCity,
country: McandidateCountry,
adress: McandidateAddress,
accountStatus: McandidateAccountStatus,
phone: McandidatePhone,
jobStatus: McandidateJobStatus,
expectedSalary: McandidateExpectedSalary,
linkedin: McandidateLinkedin,
github: McandidateGithub,
portofolio: McandidatePortfolio,
blog: McandidateBlog,
resume: McandidateResume,
image: McandidateImage

        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        .then(function (response) {
          setCandidatesData(prevCData => {
            const updatedCData = prevCData.map(c => {
              if (c.id === id) {
                return {
                  ...c,
name: McandidateFirstName,
lastName: McandidateLastName,
email: McandidateEmail,
city: McandidateCity,
country: McandidateCountry,
address: McandidateAddress,
accountStatus: McandidateAccountStatus,
phone: McandidatePhone,
jobStatus: McandidateJobStatus,
expectedSalary: McandidateExpectedSalary,
linkedin: McandidateLinkedin,
github: McandidateGithub,
portofolio: McandidatePortfolio,
blog: McandidateBlog,
resume: McandidateResume,
image: McandidateImage

                };
              }
              return c;
            });
            return updatedCData;
          });
          onClose();
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    useEffect(() => {
      if (isOpen) {
        document.body.classList.add('active-modal');
      } else {
        document.body.classList.remove('active-modal');
      }
      const fetchData = async () => {
      try {
        const response = await axios.get(API_URL+'/api/v1/candidate-skills/byCandidate/' + id, {
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

    const handleCandidateFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCandidateFirstName(value);
    };
    
    const handleCandidateLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCandidateLastName(value);
    };
    
    const handleCandidateEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCandidateEmail(value);
    };
    
    const handleCandidateCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCandidateCity(value);
    };
    
    const handleCandidateCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCandidateCountry(value);
    };
    
    const handleCandidateAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCandidateAddress(value);
    };
    
    const handleCandidateAccountStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCandidateAccountStatus(value);
    };
    
    const handleCandidatePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCandidatePhone(value);
    };
    
    const handleCandidateJobStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCandidateJobStatus(value);
    };
    
    const handleCandidateExpectedSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setCandidateExpectedSalary(value);
    };
    
    const handleCandidateLinkedinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCandidateLinkedin(value);
    };
    
    const handleCandidateGithubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCandidateGithub(value);
    };
    
    const handleCandidatePortofolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCandidatePortfolio(value);
    };
    
    const handleCandidateBlogChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCandidateBlog(value);
    };
    
    const handleCandidateResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCandidateResume(value);
    };
    
    const handleCandidateImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCandidateImage(value);
    };

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
                <div className="div-1">
              <label htmlFor="candidateFirstName">First Name:</label>
<input type="text" id="candidateFirstName" placeholder="Enter first name" value={McandidateFirstName} onChange={(e) => setCandidateFirstName(e.target.value)} />

<label htmlFor="candidateLastName">Last Name:</label>
<input type="text" id="candidateLastName" placeholder="Enter last name" value={McandidateLastName} onChange={(e) => setCandidateLastName(e.target.value)} />

<label htmlFor="candidateEmail">Email:</label>
<input type="email" id="candidateEmail" placeholder="Enter email" value={McandidateEmail} onChange={(e) => setCandidateEmail(e.target.value)} />

<label htmlFor="candidateCity">City:</label>
<input type="text" id="candidateCity" placeholder="Enter city" value={McandidateCity} onChange={(e) => setCandidateCity(e.target.value)} />

<label htmlFor="candidateCountry">Country:</label>
<input type="text" id="candidateCountry" placeholder="Enter country" value={McandidateCountry} onChange={(e) => setCandidateCountry(e.target.value)} />

<label htmlFor="candidateAddress">Address:</label>
<input type="text" id="candidateAddress" placeholder="Enter address" value={McandidateAddress} onChange={(e) => setCandidateAddress(e.target.value)} />

<label htmlFor="candidateAccountStatus">Account Status:</label>
<input type="text" id="candidateAccountStatus" placeholder="Enter account status" value={McandidateAccountStatus} onChange={(e) => setCandidateAccountStatus(e.target.value)} />

<label htmlFor="candidatePhone">Phone:</label>
<input type="text" id="candidatePhone" placeholder="Enter phone" value={McandidatePhone} onChange={(e) => setCandidatePhone(e.target.value)} />
<button onClick={handleModify}>Modify Candidate</button>
                    </div><div className="div-2">

<label htmlFor="candidateJobStatus">Job Status:</label>
<input type="text" id="candidateJobStatus" placeholder="Enter job status" value={McandidateJobStatus} onChange={(e) => setCandidateJobStatus(e.target.value)} />

<label htmlFor="candidateExpectedSalary">Expected Salary:</label>
<input type="number" id="candidateExpectedSalary" placeholder="Enter expected salary" value={McandidateExpectedSalary} onChange={(e) => setCandidateExpectedSalary(parseFloat(e.target.value))} />

<label htmlFor="candidateLinkedin">Linkedin:</label>
<input type="text" id="candidateLinkedin" placeholder="Enter linkedin URL" value={McandidateLinkedin} onChange={(e) => setCandidateLinkedin(e.target.value)} />

<label htmlFor="candidateGithub">Github:</label>
<input type="text" id="candidateGithub" placeholder="Enter github URL" value={McandidateGithub} onChange={(e) => setCandidateGithub(e.target.value)} />

<label htmlFor="candidatePortfolio">Portfolio:</label>
<input type="text" id="candidatePortfolio" placeholder="Enter portfolio URL" value={McandidatePortfolio} onChange={(e) => setCandidatePortfolio(e.target.value)} />

<label htmlFor="candidateBlog">Blog:</label>
<input type="text" id="candidateBlog" placeholder="Enter blog URL" value={McandidateBlog} onChange={(e) => setCandidateBlog(e.target.value)} />

<label htmlFor="candidateResume">Resume:</label>
<input type="text" id="candidateResume" placeholder="Enter resume URL" value={McandidateResume} onChange={(e) => setCandidateResume(e.target.value)} />

<label htmlFor="candidateImage">Image:</label>
<input type="text" id="candidateImage" placeholder="Enter image URL" value={McandidateImage} onChange={(e) => setCandidateImage(e.target.value)} />


                  </div>  
                  <div className="div-skills">
                  <h1>Skills</h1>
                <div className='lists'>
                  <RepeatClassNTimes className="list" n={skillsData.length} skillsData={skillsData} />
                </div>
                  </div>
              </div>
          </div>
        )}
      </>
    );
  }
  