'use client'
import React from 'react';
import './style.scss';
import { useState ,useEffect} from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'
import Jobs from '@/components/Candidate/Jobs/Jobs'
import Favoris from '@/components/Candidate/Favoris/Favoris';
import Profile from '@/components/Candidate/Profile/Profile';
import Skills from '@/components/Candidate/Skills/Skills';
import Projects from '@/components/Candidate/Projects/Projects';
import Ex from '@/components/Candidate/Experiances/Ex';
import Links from '@/components/Candidate/Links/Links';
import Image from 'next/image'
import Notif from '@/public/images/notif.png'
import API_URL from '@/config';
  
interface candidate{
  id:number;
	name:string;
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

const Candidate = () => {
  var [x,setX] = useState("Jobs"); 
  const [candidateData,setCandidateData] = useState('');
  const handleClick = (value : string) => {
    setX(value);
    y();
  };
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);
  const [notif,setNotif] = useState(2); 
  const options = ['Message 1', 'Message 2', 'Message 3'];
  const handleToggle = () => {
    setIsOpen(!isOpen);
    setNotif(0);
  };

  const handleOptionClick = (option: string) => {
    if (option==='Candidate'){
      router.push('/Dashboards/Candidate');
  }
  else if (option==='Customer'){
      router.push('/Dashboards/Customer');
  }
  else if (option==='Admin'){
      router.push('/Dashboards/Admin');
  }
    setIsOpen(false);
  };
  const router = useRouter();

  const y = () => {
    if (x === "Profile"){ 
      return <Profile />;
    }
    if (x === "Jobs") {
      return <Jobs />;
    }
    if (x === "Favoris") {
      return <Favoris />;
    }
    if (x === "Skills") {
      return <Skills />;
    }
    if (x === "Projects") {
      return <Projects />;
    }
    if (x === "Ex") {
      return <Ex />;
    }
    if (x === "Links") {
      return <Links />;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        Cookies.set("id","1")
        const id = Cookies.get("id");
        const response = await axios.get(API_URL+'/api/v1/candidates/name/'+String(id), {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });         
        setCandidateData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };
    fetchData();
}, []);

    return (
        <ThemeProvider enableSystem={true} attribute="class">
          <Navbar/>
            <div className='Candidate'>
              <div className='header'>
                {candidateData}
                <button onClick={handleToggle}>
                <Image 
									src={Notif}
									width={50}
									height={50}
									alt="login image"
								/>
                {notif === 0 ? null : <span className="badge">{notif}</span>}
                </button>
                {isOpen && (
        <ul className="dropdown-list">
          {options.map((option) => (
            <li key={option} onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
              </div>
              <div className='content'>
                <div className='Menu'>
                  <button onClick={() => handleClick("Profile")}>Profile</button>
                  <button onClick={() => handleClick("Jobs")}>My jobs</button>
                  <button onClick={() => handleClick("Favoris")}>Favoris</button>
                  <button onClick={() => handleClick("Skills")}>Skills</button>
                  <button onClick={() => handleClick("Projects")}>Projects</button>
                  <button onClick={() => handleClick("Ex")}>Xp</button>
                  <button onClick={() => handleClick("Links")}>Links</button>
                </div>
                <div className='Candidate-box'>
                    {y()}
                </div>
              </div>
            </div>
        </ThemeProvider>
    );
  }
  
  export default Candidate;

