'use client'
import React from 'react'
import { useRef , useState} from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import './style.scss';
import Cookies from 'js-cookie';
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import LoginImage from '@/public/images/login-info.svg'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { signIn } from 'next-auth/react';

export default function Login() {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const emailErrorRef = useRef<HTMLDivElement>(null);
	const passwordErrorRef = useRef<HTMLDivElement>(null);
	const SubmitErrorRef = useRef<HTMLDivElement>(null);
	const iconRef = useRef<HTMLDivElement>(null);
	const [passState, setPassState] = useState('hide');
	const router = useRouter();

	const handleSubmit = async (e:any)  =>{
		e.preventDefault()
		Cookies.set("loggedin", "true");
		axios.post('http://localhost:7777/api/v1/auth', {
			"email": email,
			"password": password
		  })
		  .then(function (response) {
			
			Cookies.set("loggedin", "true");
			router.push('/addPost')
		  })
		  .catch(function (error) {
			console.log(error);
			invalidSubmit(e);
		  });
	}
	const handleIconClick = () => {
		if (passState === 'hide') {
			setPassState('show');
		} else {
			setPassState('hide');
		}
	}

	const invalidSubmit = (e: any) => {
		e.preventDefault();

		if (SubmitErrorRef.current) {
			SubmitErrorRef.current.innerHTML = "Invalid email or password. Please try again."
		}
	}

	const invalidEmail = (e: any) => {
		e.preventDefault();

		if (emailErrorRef.current) {
			emailErrorRef.current.innerHTML = e.target.validationMessage;
		}
	}

	const invalidPassword = (e: any) => {
		e.preventDefault();
		if (passwordErrorRef.current) {
			passwordErrorRef.current.innerHTML = e.target.validationMessage;
		}
	}
	
	return (
		<ThemeProvider enableSystem={true} attribute="class" >
			<Navbar />
			<div className="login">
				<div className="container">
					<div className="login-box">
						<div className="info-side">
							<div className="info">
								<h3>Welcome To DIAALAND</h3>
								<p>The right place to find your perfect match condidate or opportunities</p>
							</div>
							<div className="info-image">
								<Image 
									src={LoginImage}
									width={300}
									height={300}
									alt="login image"
								/>
							</div>
						</div>
						<div className="form-side">
							<div className="form">
								<h3 className='text-3xl capitalize text-medium'>Weclome back :&#41; </h3>
								<form onSubmit={handleSubmit}>
									<div className="form-group">
										<label htmlFor="email">Email</label>
										<input type="email" name="email" id="email" placeholder="Enter your email" required onChange={(e) => setEmail(e.target.value)} onInvalid={invalidEmail} />
										<div ref={emailErrorRef} className="email-error error"></div>
										<label htmlFor="password">Password</label>
										<div className="password-input">
											<input type={passState === 'show' ? "text" : "password"} name="password" id="password" placeholder="Enter your password" required onChange={(e) => setPassword(e.target.value)} onInvalid={invalidPassword} />
											<div ref={iconRef} className="icon" onClick={handleIconClick}>
												{passState === 'hide' ? <FaEyeSlash /> : <FaEye />}
											</div>
										</div>
										<div ref={passwordErrorRef} className="password-error error"></div>
										<div className="forgot-password">
											<a href='/login/reset'>Forgot password?</a>
										</div>
										<input className='inline checkbox' type="checkbox" name="remember-me" id="remember-me" />
										<label className='inline-block checkbox-label mt-6 mb-2' htmlFor="remember-me">remember me</label>
										<div className="submit-btn">
											<button type="submit">Sign in</button>
											<button onClick={()=>signIn("google" , {callbackUrl:'/#home-section'})}>
												Login with Google
											</button>
										</div>
										<div ref={SubmitErrorRef} className="email-error error"></div>
										<div className="register-link">
											<p>Don&apos;t have an account? <Link href='/register'>Sign Up</Link></p>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ThemeProvider>
	)
}