'use client'
import React from 'react'
import { useRef } from 'react'
import Logo from './../Logo/Logo'
import './Footer.scss'
import Link from 'next/link'
import { TiSocialFacebook, TiSocialInstagram, TiSocialLinkedin, TiSocialTwitter } from 'react-icons/ti'
import { TbSend } from 'react-icons/tb'

export default function Footer() {

  const emailError = useRef<HTMLParagraphElement>(null);

  const handleSubscription = (e : any) => {
    e.preventDefault();
    if (emailError.current && e.target.validationMessage.length)
      emailError.current.innerText = e.target.validationMessage;
  }

  return (
    <div className="footer">
      <div className="container">
        <div className="logo">
          <Logo />
        </div>
        <div className="newsletter">
          <div className="social">
            <p>Meet you on our social media:</p>
            <div className="links">
              <div className="facebook">
                <Link href="https://facebook.com/" target="_blank" >
                  <TiSocialFacebook size={32} /> 
                </Link>
              </div>
              <div className="linkedin">
                <Link href="https://facebook.com/" target="_blank" >
                  <TiSocialLinkedin size={32} /> 
                </Link>
              </div>
              <div className="twitter">
                <Link href="https://facebook.com/" target="_blank" >
                  <TiSocialTwitter size={32} /> 
                </Link>
              </div>
              <div className="instargram">
                <Link href="https://facebook.com/" target="_blank" >
                  <TiSocialInstagram size={32} /> 
                </Link>
              </div>
            </div>
          </div>
          <div className="subscription">
            <p>Be the first one to recieve our new</p>
            <form className="input">
              <input type="email" placeholder='enter your email' required onInvalid={handleSubscription} />
              <button className="send" >
                <TbSend size={20} />
              </button>
            </form>
            <div ref={emailError} className="error"></div>
          </div>
        </div>
        <div className="rights">
          <p>All rights reserved &copy; DiaaLand 2023</p>
        </div>
      </div>
    </div>
  )
}
