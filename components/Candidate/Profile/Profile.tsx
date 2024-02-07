'use client'
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import '../../../app/(accounts)/register/style.scss';
import './Profile.scss'
import Link from 'next/link'
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import axios from 'axios';
import Candidate from '@/app/Dashboards/Candidate/page';

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
	const [city, setCity] = useState('')
	const [country, setCountry] = useState('')
	const [url, setUrl] = useState('')
	const [adress, setAdress] = useState('')
	const [logo, setLogo] = useState('')
	const [candidate, setCandidate] = useState('')
	const [candidateData,setCandidateData] = useState<string[]>([])
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
const [image, setImage] = useState<string>(''); // Je suppose que "image" est un lien URL


	const [passState, setPassState] = useState('hide');
	
	const handleSubmit = async (e:any)  =>{
		e.preventDefault()
		axios.post('http://localhost:7777/api/v1/auth/register', {
			"name": name,
			"email":email,
			"password": password,
			"city": city,
			"country": country,
			"url": url,
			"adress": adress,
			"logo": logo,
			"role": "CLIENT"
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
				Cookies.set("id","1")
				const id = Cookies.get("id");
				const response = await axios.get('http://localhost:7777/api/v1/candidates/tostring/'+String(id));         
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
				  const response = await axios.get('http://localhost:7777/api/v1/candidates/name/'+String(id));         
				  
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
			const candidateAttributes = candidate.split('|');
			setFirstName(candidateAttributes[0]);
			setLastName(candidateAttributes[0]);
			setEmail(candidateAttributes[1]);
			setCity(candidateAttributes[2]);
			setCountry(candidateAttributes[3]);
			setAddress(candidateAttributes[4]);
			setAccountStatus(candidateAttributes[5]);
			setPhone(candidateAttributes[6]);
			setJobStatus(candidateAttributes[7]);
			setExpectedSalary(parseFloat(candidateAttributes[8])); // Converting string to number
			setLinkedin(candidateAttributes[9]);
			setGithub(candidateAttributes[10]);
			setPortfolio(candidateAttributes[11]);
			setBlog(candidateAttributes[12]);
			setResume(candidateAttributes[13]);
			setImage(candidateAttributes[14]);
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
										<label htmlFor="firstname">Name</label>
										<input type="text" name="firstname" id="firstname" placeholder="Enter your company name " value={firstName} autoFocus required onInvalid={invalidFirstname} onChange={(e) => setLastName(e.target.value)} />
										<p ref={firstnameErrorRef} className="error username-error"></p>
										<label htmlFor="email">Email</label>
										<input type="email" name="email" id="email" placeholder="Enter your email" value={email} required onInvalid={invalidEmail} onChange={(e) => setEmail(e.target.value)} />
										<p ref={emailErrorRef} className="error email-error"></p>
										<div className="nation">
											<label htmlFor="city">City:</label>
											<input type="text" name="city" id="city" placeholder='Enter your city' value={city} required onChange={(e) => setCity(e.target.value)}  />
											<label htmlFor="country">Country:</label>
											<input type="text" name="country" id="country" required onChange={(e) => setCountry(e.target.value)}  />
										</div>
										<div className="url-adress">
											<label htmlFor="adress">Adress:</label>
											<input type="text" name="adress" id="adress" required onChange={(e) => setAdress(e.target.value)}  />
										</div>
										<label htmlFor="url">Account statut:</label>
											<input type="text" name="url" required onChange={(e) => setUrl(e.target.value)}  />
											<label htmlFor="url">Phone:</label>
											<input type="text" name="url" required onChange={(e) => setUrl(e.target.value)}  />
											<label htmlFor="url">Job statut:</label>
											<input type="text" name="url" required onChange={(e) => setUrl(e.target.value)}  />
											<label htmlFor="url">Expected salary:</label>
											<input type="text" name="url" required onChange={(e) => setUrl(e.target.value)}  />
					</div>
					<div className='div2'>									
								
											<label htmlFor="url">Linkedin:</label>
											<input type="text" name="url" required onChange={(e) => setUrl(e.target.value)}  />
											<label htmlFor="url">Github:</label>
											<input type="text" name="url" required onChange={(e) => setUrl(e.target.value)}  />
											<label htmlFor="url">Portofolio:</label>
											<input type="text" name="url" required onChange={(e) => setUrl(e.target.value)}  />
											<label htmlFor="url">Blog:</label>
											<input type="text" name="url" required onChange={(e) => setUrl(e.target.value)}  />
											<label htmlFor="url">Resume:</label>
											<input type="text" name="url" required onChange={(e) => setUrl(e.target.value)}  />
											<label htmlFor="logo">Image:</label>
											<input type="file" id="fileInput" name="fileInput" required onChange={(e) => setLogo(e.target.value)}/>
											<label htmlFor="logo">Diplome:</label>
											<input type="file" id="fileInput" name="fileInput" required onChange={(e) => setLogo(e.target.value)}/>
										<label htmlFor="password">New password</label>
										<div className="password-input">
											<input type={passState === 'show' ? 'text' : 'password'} name="password" id="password" placeholder="Enter your password" onChange={handlePasswordChange} required onInvalid={invalidPassword} />
											<div className="icon" onClick={handleIconClick}>
												{passState === 'hide' ? <FaEyeSlash /> : <FaEye />}
											</div>
										</div>										<p ref={passwordErrorRef} className="error password-error"></p>
										<div className="password-strength">
											<div ref={passwordMessageRef} className="message hidden">
											</div>
										</div>
										<input className='inline checkbox' type="checkbox" name="term-of-use" id="term-of-use" required onInvalid={invalidTerms} />
										<p ref={termsErrorRef} className='error terms-error'></p>
										<button className='block' type="submit" onClick={handleSubmit}>Modify</button>
					</div>
		</div>
    )
}
export default Profile;