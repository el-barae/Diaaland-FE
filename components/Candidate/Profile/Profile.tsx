'use client'
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import '../../../app/(accounts)/register/style.scss';
import './Profile.scss'
import Link from 'next/link'
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import axios from 'axios';
import Image from 'next/image'
import RegisterImg from '@/public/images/registeration.png'
import Candidate from '@/app/Dashboards/Candidate/page';
import API_URL from '@/config'
import { Diplomata } from 'next/font/google';

interface candidate{
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

const passwordStrength = (password: string) => {
	let res = 0;

	for (let i = 0; i < password.length; i++) {
		if (password[i] >= '0' && password[i] <= '9') {
			res += 8;
		}
		if (password[i] >= 'a' && password[i] <= 'z') {
			res += 4;
		}
		if (password[i] >= 'A' && password[i] <= 'Z') {
			res += 6;
		}
		if ((password[i] >= '!' && password[i] <= '/') || 
				(password[i] >= ':' && password[i] <= '@') || 
				(password[i] >= '[' && password[i] <= '`') || 
				(password[i] >= '{' && password[i] <= '~')) {
			res += 10;
		}
	}
	return res;
}
const Profile = () =>{
	const token = localStorage.getItem("token");
    const firstnameErrorRef = useRef<HTMLParagraphElement>(null);
	const lastnameErrorRef = useRef<HTMLParagraphElement>(null);
	const emailErrorRef = useRef<HTMLParagraphElement>(null);
	const passwordErrorRef = useRef<HTMLParagraphElement>(null);
	const termsErrorRef = useRef<HTMLParagraphElement>(null);
	const router = useRouter();

	const passwordMessageRef = useRef<HTMLDivElement>(null);

	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [password, setPassword] = useState('')
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


	const [passState, setPassState] = useState('hide');
	
	const handleSubmit = async (e:any)  =>{
		e.preventDefault()
		axios.post(API_URL+'/api/v1/auth/register', {
			"name": name,
			"email":email,
			"password": password,
			"city": city,
			"country": country,
			"role": "CLIENT"
		  }, {
			headers: {
			  'Authorization': 'Bearer ' + token
			}
		  })
		  .then(function (response) {
			console.log(response);
			Cookies.set("loggedin", "true");
			router.push('/addPost')
		  })
		  .catch(function (error) {
			console.log(error);
		  });
	}

	const handleIconClick = () => {
		if (passState === 'hide') {
			setPassState('show');
		} else {
			setPassState('hide');
		}
	}

	useEffect(() => {
		let messageColors = ['text-red-600', 'text-red-400', 'text-yellow-600', 'text-green-400', 'text-green-600', 'text-green-500', 'text-green-700'];
		let res = passwordStrength(password);

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

			const fetchData1 = async () => {
				try {
				  Cookies.set("id","1")
				  const id = Cookies.get("id");
				  const response = await axios.get(API_URL+'/api/v1/candidates/name/'+String(id), {
					headers: {
					  'Authorization': 'Bearer ' + token
					}
				  });         
				  
				} catch (error) {
				  console.error('Erreur lors de la récupération des données :', error);
				}
			  };
			  fetchData1();

		messageColors.map((color) => {
			passwordMessageRef.current?.classList.remove(color);
		})
		if (res < 30 && passwordMessageRef.current) {
			passwordMessageRef.current.classList.add(messageColors[0]);
			passwordMessageRef.current.innerText = 'very weak password';
		} else if (res >= 30 && res < 50 && passwordMessageRef.current) {
			passwordMessageRef.current.classList.add(messageColors[1]);
			passwordMessageRef.current.innerText = 'weak password';
		} else if (res >= 50 && res < 70 && passwordMessageRef.current) {
			passwordMessageRef.current.classList.add(messageColors[2]);
			passwordMessageRef.current.innerText = 'average password';
		} else if (res >= 70 && res < 90 && passwordMessageRef.current) {
			passwordMessageRef.current.classList.add(messageColors[3]);
			passwordMessageRef.current.innerText = 'strong password';
		} else if (res >= 90 && passwordMessageRef.current) {
			passwordMessageRef.current.classList.add(messageColors[4]);
			passwordMessageRef.current.innerText = 'very strong password';
		}
	}, [password])

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

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		passwordMessageRef.current?.classList.remove('hidden');
	}

	const invalidFirstname = (e: any) => {
		e.preventDefault();
		if (firstnameErrorRef.current) {
			firstnameErrorRef.current.innerText = 'firstname must be at least 6 characters long';
		}
	}

	const invalidLastname = (e: any) => {
		e.preventDefault();
		if (lastnameErrorRef.current) {
			lastnameErrorRef.current.innerText = 'lastname must be at least 6 characters long';
		}
	}

	
	const invalidEmail = (e: any) => {
		e.preventDefault();
		if (emailErrorRef.current) {
			emailErrorRef.current.innerText = 'invalid Email';
		}
	}

	const invalidPassword = (e: any) => {
		e.preventDefault();
		if (passwordErrorRef.current) {
			passwordErrorRef.current.innerText = e.target.validationMessage;
		}
	}

	const invalidTerms = (e: any) => {
		e.preventDefault();
		if (termsErrorRef.current) {
			termsErrorRef.current.innerText = 'you must accept the terms of use';
		}
	}

    return(
        <div className="form-candidate">
					<div className='div1'>
					<h1>Profile</h1>

					<br></br>
										<label htmlFor="firstname">First name</label>
										<input type="text" name="firstname" id="firstname" placeholder="Enter your first name " value={firstName} autoFocus required onInvalid={invalidFirstname} onChange={(e) => setFirstName(e.target.value)} />
										<p ref={firstnameErrorRef} className="error username-error"></p>
										<label htmlFor="lastname">Last name</label>
										<input type="text" name="lastname" id="lastname" placeholder="Enter your last name " value={lastName} autoFocus required onInvalid={invalidLastname} onChange={(e) => setLastName(e.target.value)} />
										<p ref={lastnameErrorRef} className="error username-error"></p>
										<label htmlFor="email">Email</label>
										<input type="email" name="email" id="email" placeholder="Enter your email" value={email} required onInvalid={invalidEmail} onChange={(e) => setEmail(e.target.value)} />
										<p ref={emailErrorRef} className="error email-error"></p>
										<div className="nation">
											<label htmlFor="city">City:</label>
											<input type="text" name="city" id="city" placeholder='Enter your city' value={city} required onChange={(e) => setCity(e.target.value)}  />
											<label htmlFor="country">Country:</label>
											<input type="text" name="country" id="country" placeholder='Enter your country' value={country} required onChange={(e) => setCountry(e.target.value)}  />
										</div>
										<div className="url-adress">
											<label htmlFor="adress">Address:</label>
											<div className="info-image">
							</div>		<input type="text" name="adress" id="adress" placeholder='Enter your address' value={address} required onChange={(e) => setAddress(e.target.value)}  />
										</div>
										<label htmlFor="url">Account statut:</label>
											<input type="text" name="url" value={accountStatus} placeholder='Enter your account status' required onChange={(e) => setAccountStatus(e.target.value)}  />
											<label htmlFor="url">Phone:</label>
											<input type="text" name="url" value={phone} placeholder='Enter your phone number' required onChange={(e) => setPhone(e.target.value)}  />
											<label htmlFor="url">Job statut:</label>
											<input type="text" name="url" value={jobStatus} placeholder='Enter your job stauts' required onChange={(e) => setJobStatus(e.target.value)}  />
							
					</div>
					<div className='div2'>									

											<label htmlFor="url">Expected salary:</label>
											<input type="text" name="url" value={expectedSalary}
											 required onChange={(e) => setExpectedSalary(expectedSalary)}  />
											<label htmlFor="url">Linkedin:</label>
											<input type="text" name="url" value={linkedin} placeholder='Enter your linkedin' required onChange={(e) => setLinkedin(e.target.value)}  />
											<label htmlFor="url">Github:</label>
											<input type="text" name="url" value={github} placeholder='Enter your github' required onChange={(e) => setGithub(e.target.value)}  />
											<label htmlFor="url">Portofolio:</label>
											<input type="text" name="url" value={portfolio} placeholder='Enter your portfolio' required onChange={(e) => setPortfolio(e.target.value)}  />
											<label htmlFor="url">Blog:</label>
											<input type="text" name="url" value={blog} placeholder='Enter your blog' required onChange={(e) => setBlog(e.target.value)}  />
											<label htmlFor="logo">Description:</label>
											<input type="textarea" id="desc" name="desc" placeholder='Enter your description' value={desc} required onChange={(e) => setDesc(e.target.value)}/>
											<label htmlFor="url">Resume:</label>
											<input type="file" id="fileInput" name="fileInput" required onChange={(e) => setResume(e.target.value)}/>
											<label htmlFor="logo">Image:</label>
											<input type="file" id="fileInput" name="fileInput" required onChange={(e) => setImage(e.target.value)}/>
											
										<input className='inline checkbox' type="checkbox" name="term-of-use" id="term-of-use" required onInvalid={invalidTerms} />
										<p ref={termsErrorRef} className='error terms-error'></p>
										<button className='block' type="submit" onClick={handleSubmit}>Modify</button>
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