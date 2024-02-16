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

	const [firstname, setFirstname] = useState('')
	const [lastname, setLastname] = useState('')
	const [password, setPassword] = useState('')
	const [email, setEmail] = useState('')

	const [passState, setPassState] = useState('hide');
	
	const handleSubmit = async (e:any)  =>{
		e.preventDefault()
		axios.post(API_URL+'/api/v1/auth/register', {
			"firstName": firstname,
			"lastName": lastname,
			"email":email,
			"password": password,
			"role": "USER"
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
									<div className="form-group">
										<label htmlFor="firstname">Firstname</label>
										<input type="text" name="firstname" id="firstname" placeholder="Enter your firstname" autoFocus required onInvalid={invalidFirstname} onChange={(e) => setFirstname(e.target.value)} />
										<p ref={firstnameErrorRef} className="error username-error"></p>
										<label htmlFor="lastname">Lastname</label>
										<input type="text" name="lastname" id="lastname" placeholder="Enter your lastname" autoFocus required onInvalid={invalidLastname} onChange={(e) => setLastname(e.target.value)} />
										<p ref={lastnameErrorRef} className="error username-error"></p>
										<label htmlFor="email">Email</label>
										<input type="email" name="email" id="email" placeholder="Enter your email" required onInvalid={invalidEmail} onChange={(e) => setEmail(e.target.value)} />
										<p ref={emailErrorRef} className="error email-error"></p>
										<label htmlFor="password">Password</label>
										<div className="password-input">
											<input type={passState === 'show' ? 'text' : 'password'} name="password" id="password" placeholder="Enter your password" onChange={handlePasswordChange} required onInvalid={invalidPassword} />
											<div className="icon" onClick={handleIconClick}>
												{passState === 'hide' ? <FaEyeSlash /> : <FaEye />}
											</div>
										</div>
										<p ref={passwordErrorRef} className="error password-error"></p>
										<div className="password-strength">
											<div ref={passwordMessageRef} className="message hidden">

											</div>
										</div>
										<input className='inline checkbox' type="checkbox" name="term-of-use" id="term-of-use" required onInvalid={invalidTerms} />
										<label className='inline-block checkbox-label mb-4' htmlFor="term-of-use">i accept the term of use</label>
										<p ref={termsErrorRef} className='error terms-error'></p>
										<button className='block' type="submit" onClick={handleSubmit}>Register</button>
										<p className='have-account'>
											Already have an account? <Link href="/login">Login</Link>Or <Link href='/user'>Register as a client</Link>
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