'use client'

import Link from 'next/link'
import NavbarTools from './../NavbarTools/NavbarTools';
import { useRouter } from 'next/navigation';
import Logo from './../Logo/Logo';
import ImageP from '@/public/images/profile.png'
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import React, { useRef } from "react";
import axios from 'axios';
import './Navbar.scss'
//import SigninButton from './SigninButton';
//import { useSession, signIn, signOut } from 'next-auth/react';
import API_URL from '@/config';



const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const menu = ['Home', 'Services', 'Contact', 'About'];


  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleToggle = () => {
    const option = localStorage.getItem("role");
    if (option==='CANDIDAT'){
      router.push('/Dashboards/Candidate');
  }
  else if (option==='CUSTOMER'){
      router.push('/Dashboards/Customer');
  }
  else if (option==='ADMIN'){
      router.push('/Dashboards/Admin');
  }
  else{
    router.push('/login');
  }

    setIsLoading(true);
  };

  const handleMenuClick = (option: string) => {
    if (option==='Home'){
      scrollToHome();
  }
  else if (option==='About'){
      scrollToAbout();
  }
  else if (option==='Services'){
      scrollToServices();
  }
  else if (option==='Contact'){
    scrollToContact();
}
    setIsOpen(false);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //const { data: session } = useSession();
  const router = useRouter();

  const logout = async ()=>{
    const token = localStorage.getItem('token')
		axios.post(API_URL+'/api/v1/auth/logout', {
			"token" : token
		  }, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
		  .then(function (response) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('ID');
    setIsLoggedIn(false);
    setIsLoading(true);
			Cookies.set("loggedin", "false");
			router.push('/login')
		  })
		  .catch(function (error) {
			console.log(error);
		  });
    localStorage.removeItem('token');
  }

  const signin = () => {
    setIsLoading(true);
    router.push('/login');
  }

  const scrollToHome = () => {
    const goalsSection = document.getElementById('home-section');

    if (goalsSection) {
      
      goalsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const scrollToAbout = () => {
    const goalsSection = document.getElementById('about-section');

    if (goalsSection) {
      
      goalsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const scrollToServices = () => {
    const goalsSection = document.getElementById('services-section');

    if (goalsSection) {
      goalsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const scrollToContact = () => {
    const goalsSection = document.getElementById('contact-section');

    if (goalsSection) {
      goalsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const loggedIn = Cookies.get("loggedin") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  return (
    <>
      <div className="navbar py-4">
        <div className="container">
          <Logo />
          <ul >
            <Link href="/#home-section" >home</Link>
            <Link href="/#services-section" >services</Link>
            <Link href="/#contact-section" >contact us</Link>
            <Link href="/#about-section" id='about'>about us</Link>
          </ul>
          
          <div className='right'>
          {isLoggedIn ? (
            <li>
              <button className='btnlogin' onClick={logout}>Sign Out</button>
            </li>
          ) : (
            <li>
              <button className='btnlogin' onClick={signin}>Sign In</button>
            </li>
          )}
          
          <NavbarTools />
              <button onClick={handleToggle}>
              <Image
                        src={ImageP}
                        width={38}
                        height={36}
                        alt='image of profile'
                      />
              </button>
              {isLoading && <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>}

          <button className='list' onClick={toggleMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
          </button>
          {showMenu && (
        <ul className="dropdown-list">  
            <li >
            <Link href="/#home-section" >home</Link>
            </li>
            <li >
            <Link href="/#services-section" >services</Link>
            </li>
            <li >
            <Link href="/#contact-section" >contact us</Link>
            </li>
            <li >
            <Link href="/#about-section" id='about'>about us</Link>
            </li>    
        </ul>
      )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
