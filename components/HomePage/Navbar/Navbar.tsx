'use client'

import Link from 'next/link'
import NavbarTools from './../NavbarTools/NavbarTools';
import Logo from './../Logo/Logo';
import ImageP from '@/public/images/profile.png'
import Image from 'next/image';
import { useState } from 'react';
import './Navbar.scss'
import SigninButton from './SigninButton';
import { useSession, signIn, signOut } from 'next-auth/react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { data: session } = useSession();

  // Fonction pour gérer le clic sur le bouton
  const handleClick = () => {
    // Inverser l'état actuel
    setIsLoggedIn(!isLoggedIn);
  };
  const buttonText = isLoggedIn ? 'Logout' : 'Login';


  /*
  const router = useRouter();
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
      router.push('/')
      goalsSection.scrollIntoView();
      goalsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const scrollToContact = () => {
    const goalsSection = document.getElementById('contact-section');

    if (goalsSection) {
      goalsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  #services-section
  */

  return (
    <>
      <div className="navbar py-4">
        <div className="container">
          <Logo />
          <div className="list">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
          </div>
          <ul >
            <Link href="/#home-section" >home</Link>
            <Link href="/#services-section" >services</Link>
            {/*<Link href="/blog" >blog</Link>*/}
            <Link href="/#contact-section" >contact us</Link>
            <Link href="/#about-section" >about us</Link>
          </ul>
          <div className='right'>
            {session ? (
              <li>
                <button onClick={() => signOut()}>Logout</button>
              </li>
            ) : (
              <li>
                <a href="/login">Sign In</a>
              </li>
            )}
              <NavbarTools />
              <button>
              <Image
                        src={ImageP}
                        width={38}
                        height={36}
                        alt='image of profile'
                      />
              </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
