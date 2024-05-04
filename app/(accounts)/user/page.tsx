'use client'
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import './style.scss';
import Navbar from '@/components/HomePage/Navbar/Navbar'
import Image from 'next/image'
import {ThemeProvider} from 'next-themes'
import Link from 'next/link'
import RegisterImg from '@/public/images/register-info.svg'
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import axios from 'axios';
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
	const firstnameErrorRef = useRef<HTMLParagraphElement>(null);
	const lastnameErrorRef = useRef<HTMLParagraphElement>(null);
	const emailErrorRef = useRef<HTMLParagraphElement>(null);
	const passwordErrorRef = useRef<HTMLParagraphElement>(null);
	const termsErrorRef = useRef<HTMLParagraphElement>(null);
	const router = useRouter();

	const passwordMessageRef = useRef<HTMLDivElement>(null);

	const [name, setName] = useState('')
	const [password, setPassword] = useState('')
	const [email, setEmail] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [city, setCity] = useState('')
	const [country, setCountry] = useState('')
	const [url, setUrl] = useState('')
	const [adress, setAdress] = useState('')
	const [logo, setLogo] = useState('')

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
		  } catch (error) {
			console.error('Erreur lors de la récupération des données :', error);
		  }
		}
	
	const handleSubmit = async (e:any)  =>{
		e.preventDefault()
			const response = axios.post(API_URL+'/api/v1/auth/register/customer', {
				"name": name,
				"email":email,
				"phoneNumber": phoneNumber,
				"password": password,
				"role": "CUSTOMER"
			}).then(function (response) {
		  localStorage.setItem('token',response.data.token)
		  localStorage.setItem('role',response.data.role)
		  Cookies.set("loggedin", "true");
		  fetchID();
		  router.push('Dashbords/Customer')
		}). catch(function (error) {
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
									<div className="form-group">
										<label htmlFor="name">Name</label>
										<input type="text" name="name" id="name" placeholder="Enter your company name " autoFocus required onInvalid={invalidFirstname} onChange={(e) => setName(e.target.value)} />
										<p ref={firstnameErrorRef} className="error username-error"></p>
										<label htmlFor="email">Email</label>
										<input type="email" name="email" id="email" placeholder="Enter your email" required onInvalid={invalidEmail} onChange={(e) => setEmail(e.target.value)} />
										<p ref={emailErrorRef} className="error email-error"></p>
										<label htmlFor="phoneNumber">Phone number:</label>
											<input type="text" id="phoneNumber" placeholder="Enter your phonr number" name="phoneNumber" required onChange={(e) => setPhoneNumber(e.target.value)}/>
										{/*
										<div className="nation">
											<label htmlFor="city">City:</label>
											<input type="text" name="city" id="city" required onChange={(e) => setCity(e.target.value)}  />
											<label htmlFor="country">Country:</label>
											<input type="text" name="country" id="country" required onChange={(e) => setCountry(e.target.value)}  />
										</div>
										<div className="url-adress">
											<label htmlFor="adress">Adress:</label>
											<input type="text" name="adress" id="adress" required onChange={(e) => setAdress(e.target.value)}  />
											<label htmlFor="url">Company URL:</label>
											<input type="text" name="url" id="url" required onChange={(e) => setUrl(e.target.value)}  />
										</div>
											<label htmlFor="logo">Select the logo file:</label>
											<input type="file" id="fileInput" name="fileInput" required onChange={(e) => setLogo(e.target.value)}/>
										*/}
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
										<input className='inline checkbox' type="checkbox" name="term-of-use" id="term-of-use" required onInvalid={invalidTerms} />
										<label className='inline-block checkbox-label mb-4' htmlFor="term-of-use">i accept the term of use</label>
										<p ref={termsErrorRef} className='error terms-error'></p>
										<button className='block' type="submit" onClick={handleSubmit}>Register</button>
										<p className='have-account'>
											Already have an account? <Link href="/login">Login</Link> OR <Link href="/register">Register as a candidate</Link>
										</p>
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