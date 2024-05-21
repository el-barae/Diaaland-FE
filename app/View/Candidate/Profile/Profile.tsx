'use client'
import { useState,useEffect } from 'react';
import './Profile.scss'
import axios from 'axios';
import Image from 'next/image'
import RegisterImg from '@/public/images/registeration.png'
import API_URL from '@/config'

const Profile = () =>{
	const token = localStorage.getItem("token");

	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [desc, setDesc] = useState('')
	const [city, setCity] = useState('')
	const [country, setCountry] = useState('')
	const [candidate, setCandidate] = useState('')
const [address, setAddress] = useState<string>('');
const [accountStatus, setAccountStatus] = useState<string>('');
const [phone, setPhone] = useState<string>('');
const [jobStatus, setJobStatus] = useState<string>('');
const [expectedSalary, setExpectedSalary] = useState<number>(0);
const [linkedin, setLinkedin] = useState<string>('');
const [github, setGithub] = useState<string>('');
const [portfolio, setPortfolio] = useState<string>('');
const [blog, setBlog] = useState<string>('');
const [resume, setResume] = useState<string>('');
const [image, setImage] = useState<string>('');



	useEffect(() => {
			const fetchData = async () => {
			  try {
				const id = localStorage.getItem("ID");
				const response = await axios.get(API_URL+'/api/v1/candidates/tostring/'+String(id), {
					headers: {
					  'Authorization': 'Bearer ' + token
					}
				  });       
				setCandidate(response.data);
			  } catch (error) {
				console.error('Erreur lors de la récupération des données :', error);
			  }
			};
			fetchData();

	}, [])

	useEffect(() => {
		if (candidate) {
			const candidateAttributes = candidate.split('|~');
			if(candidateAttributes[0]!=="null")
			setFirstName(candidateAttributes[0]);
			if(candidateAttributes[1]!=="null")
			setLastName(candidateAttributes[1]);
			if(candidateAttributes[2]!=="null")
			setEmail(candidateAttributes[2]);
			if(candidateAttributes[3]!=="null")
			setDesc(candidateAttributes[3]);
			if(candidateAttributes[5]!=="null")
			setCity(candidateAttributes[5]);
			if(candidateAttributes[6]!=="null")
			setCountry(candidateAttributes[6]);
			if(candidateAttributes[4]!=="null")
			setAddress(candidateAttributes[4]);
			if(candidateAttributes[8]!=="null")
			setAccountStatus(candidateAttributes[8]);
			if(candidateAttributes[7]!=="null")
			setPhone(candidateAttributes[7]);
			if(candidateAttributes[10]!=="null")
			setJobStatus(candidateAttributes[10]);
			if(candidateAttributes[15]!=="0")
			setExpectedSalary(parseFloat(candidateAttributes[15])); 
			if(candidateAttributes[11]!=="null")
			setLinkedin(candidateAttributes[11]);
			if(candidateAttributes[12]!=="null")
			setGithub(candidateAttributes[12]);
			if(candidateAttributes[13]!=="null")
			setPortfolio(candidateAttributes[13]);
			if(candidateAttributes[14]!=="null")
			setBlog(candidateAttributes[14]);
			if(candidateAttributes[16]!=="null")
			setResume(candidateAttributes[16]);
			if(candidateAttributes[17]!=="null")
			setImage(candidateAttributes[17]);
		}
	}, [candidate]);

    return(
        <div className="form-candidate">
					<div className='div1'>
    <h1>Profile</h1>
    <br></br>
    <label>First name:</label>
    <p>{firstName}</p>
    
    <label>Last name:</label>
    <p>{lastName}</p>
    
    <label>Email:</label>
    <p>{email}</p>
    
    <div className="nation">
        <label>City:</label>
        <p>{city}</p>
        
        <label>Country:</label>
        <p>{country}</p>
    </div>
    
    <div className="url-adress">
        <label>Address:</label>
        <p>{address}</p>
    </div>
    
    <label>Account status:</label>
    <p>{accountStatus}</p>
    
    <label>Phone:</label>
    <p>{phone}</p>
    
    <label>Job status:</label>
    <p>{jobStatus}</p>
</div>

<div className='div2'>
    <label>Expected salary:</label>
    <p>{expectedSalary}</p>
    
    <label>LinkedIn:</label>
    <p>{linkedin}</p>
    
    <label>Github:</label>
    <p>{github}</p>
    
    <label>Portfolio:</label>
    <p>{portfolio}</p>
    
    <label>Blog:</label>
    <p>{blog}</p>
    
    <label>Description:</label>
    <p>{desc}</p>
    
    <label>Resume:</label>
    <p>{resume ? "Uploaded" : "Not uploaded"}</p>
    
    <label>Image:</label>
    <p>{image ? "Uploaded" : "Not uploaded"}</p>
</div>

<div className="div-image">
    <Image 
        src={RegisterImg}
        width={400}
        height={600}
        alt="register image"
    />
</div>

		</div>
		
    )
}
export default Profile;