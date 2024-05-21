'use client'
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import './style.scss';
import Navbar from '@/components/HomePage/Navbar/Navbar'
import {ThemeProvider} from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import RegisterImg from '@/public/images/register-info.svg'
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import axios from 'axios';
import swal from 'sweetalert';
import API_URL from '@/config';

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

export default function Register() {
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [resume, setResume] = useState('');

	const firstnameErrorRef = useRef<HTMLParagraphElement>(null);
	const lastnameErrorRef = useRef<HTMLParagraphElement>(null);
	const emailErrorRef = useRef<HTMLParagraphElement>(null);
	const passwordErrorRef = useRef<HTMLParagraphElement>(null);
	const termsErrorRef = useRef<HTMLParagraphElement>(null);
	const router = useRouter();

	const passwordMessageRef = useRef<HTMLDivElement>(null);

	const [password, setPassword] = useState('')
	const [email, setEmail] = useState('')

	const [passState, setPassState] = useState('hide');

	const fetchID = async () => {
		try {
			const token = localStorage.getItem("token");
			const resp = await axios.get(API_URL+'/api/v1/users/relatedId/'+String(email), {
				headers: {
					'Authorization': 'Bearer ' + token
				}
			});
			const ID = JSON.stringify(resp.data);
			localStorage.setItem('ID',ID)
			return ID;
		  } catch (error) {
			console.error('Erreur lors de la récupération des données :', error);
		  }
		}

		const handleFileChange = (e: any) => {
			if (e.target.files && e.target.files[0]) {
			  setResume(e.target.files[0]);
			} else {
			  setResume('');
			}
		  };
	
		  const handleSubmit = async (e:any)  =>{
			e.preventDefault()
			try {
				var id;
			axios.post(API_URL+'/api/v1/auth/register/candidate', {
				"firstName": firstName,
				"lastName": lastName,
				"email":email,
				"resumeLink": " ",
				"password": password,
				"role": "CANDIDAT"
			  })
			  .then(function (response) {
				console.log(response);
				localStorage.setItem('token',response.data.token)
				localStorage.setItem('role',response.data.role)
				Cookies.set("loggedin", "true");
				id = fetchID();
				router.push('Dashboards/Candidate')
			  })
			  .catch(function (error) {
				console.log(error);
			  });
			  const formData = new FormData();
        		formData.append('file', resume);
        	const response = await axios.post(API_URL+'/api/v1/files/upload/'+String(id), formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            	}
        	});
			} catch (error) {
				console.log(error);
			}
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

	return (
		<>
		<ThemeProvider enableSystem={true} attribute="class" >
			<Navbar />
			<div className="register">
				<div className="container">
					<div className="register-box">
						<div className="info-side">
							<div className="info">
								<h3>Welcome To DIAALAND</h3>
								<p>The right place to find your perfect match condidate or opportunities</p>
							</div>
							<div className="info-image">
								<Image 
									src={RegisterImg}
									width={400}
									height={400}
									alt="register image"
								/>
							</div>
						</div>
						<div className="form-side">
							<div className="form">
								<form >
									<div className="form-divs">
									<div className='div1'>
										<label htmlFor="firstname">First name</label>
										<input type="text" name="firstname" id="firstname" placeholder="Enter your first name " value={firstName} autoFocus required onInvalid={invalidFirstname} onChange={(e) => setFirstName(e.target.value)} />
										<p ref={firstnameErrorRef} className="error username-error"></p>
										<label htmlFor="lastname">Last name</label>
										<input type="text" name="lastname" id="lastname" placeholder="Enter your last name " value={lastName} autoFocus required onInvalid={invalidLastname} onChange={(e) => setLastName(e.target.value)} />
										<p ref={lastnameErrorRef} className="error username-error"></p>
										<label htmlFor="email">Email</label>
										<input type="email" name="email" id="email" placeholder="Enter your email" value={email} required onInvalid={invalidEmail} onChange={(e) => setEmail(e.target.value)} />
										<p ref={emailErrorRef} className="error email-error"></p>
										<label htmlFor="url">Resume:</label>
										<input type="file" id="fileInput" name="resume" required onChange={handleFileChange}/>
										<label htmlFor="password">Password</label>
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
										{/*
										<div className="nation">
											<label htmlFor="city">City:</label>
											<input type="text" name="city" id="city" placeholder='Enter your city' value={city} required onChange={(e) => setCity(e.target.value)}  />
											<label htmlFor="country">Country:</label>
											<input type="text" name="country" id="country" required onChange={(e) => setCountry(e.target.value)}  />
										</div>
										<div className="url-adress">
											<label htmlFor="adress">Adress:</label>
											<div className="info-image">
							</div>		<input type="text" name="adress" id="adress" required onChange={(e) => setAdress(e.target.value)}  />
										</div>
										<label htmlFor="url">Account statut:</label>
											<input type="text" name="url" required onChange={(e) => setUrl(e.target.value)}  />
											<label htmlFor="url">Phone:</label>
											<input type="text" name="url" required onChange={(e) => setUrl(e.target.value)}  />
											<label htmlFor="url">Job statut:</label>
											<input type="text" name="url" required onChange={(e) => setUrl(e.target.value)}  />
					</div>
					<div className='div2'>									
											<label htmlFor="url">Expected salary:</label>
											<input type="text" name="url" required onChange={(e) => setUrl(e.target.value)}  />
											<label htmlFor="url">Linkedin:</label>
											<input type="text" name="url" required onChange={(e) => setUrl(e.target.value)}  />
											<label htmlFor="url">Github:</label>
											<input type="text" name="url" required onChange={(e) => setUrl(e.target.value)}  />
											<label htmlFor="url">Portofolio:</label>
											<input type="text" name="url" required onChange={(e) => setUrl(e.target.value)}  />
											<label htmlFor="url">Blog:</label>
											<input type="text" name="url" required onChange={(e) => setUrl(e.target.value)}  />										
											<label htmlFor="logo">Image:</label>
											<input type="file" id="fileInput" name="fileInput" required onChange={(e) => setLogo(e.target.value)}/>
											<label htmlFor="logo">Diplome:</label>
											<input type="file" id="fileInput" name="fileInput" required onChange={(e) => setLogo(e.target.value)}/>
									*/}
										<input className='inline checkbox' type="checkbox" name="term-of-use" id="term-of-use" required onInvalid={invalidTerms} />
										<p ref={termsErrorRef} className='error terms-error'></p>
										<button className='block' type="submit" onClick={handleSubmit}>Register</button>
										<p className='have-account'>
											Already have an account? <Link href="/login">Login</Link>Or <Link href='/user'>Register as a employer</Link>
										</p>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ThemeProvider>
		</>
	)
}