'use client'
import React from 'react'
import { useRef, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import Contact from '@/public/images/contactus.png'
import { MdMail, MdTimer, MdPhone, MdLocationPin } from 'react-icons/md'
import './ContactUs.scss'
import swal from 'sweetalert'
import API_URL from '@/config'

export default function ContactUs() {

  const emailError = useRef<HTMLParagraphElement>(null);
  const passwordError = useRef<HTMLParagraphElement>(null);
  const messageError = useRef<HTMLParagraphElement>(null);

  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const handleEmailChange = (e:any) => {
    setEmail(e.target.value);
  };
  
  const handleSubjectChange = (e:any) => {
    setSubject(e.target.value);
  };
  
  const handleMessageChange = (e:any) => {
    setMessage(e.target.value);
  };

  const emailHandleError = (e : any) => {
    e.preventDefault();
    if (e.target.validationMessage.length && emailError.current)
      emailError.current.innerText = e.target.validationMessage;
  }

  const passwordHandleError = (e : any) => {
    e.preventDefault();
    if (e.target.validationMessage.length && passwordError.current)
      passwordError.current.innerText = e.target.validationMessage;
  }

  const messageHandleError = (e : any) => {
    e.preventDefault();
    if (e.target.validationMessage.length && messageError.current)
      messageError.current.innerText = e.target.validationMessage;
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    try {
      await axios.post(API_URL+'/api/v1/messages', {
        "email": email,
        "subject": subject,
        "date": "2024-04-16T12:00:00",
        "message": message,
        "recipient": "DIAALAND",
        "view": false
      });
      swal('Email sent', '', 'success');
    } catch (error) {
      swal('Email not send', '', 'error');
      console.error('Error submitting message:', error);
    }
  };

  return (
    <div id="contact-section" className="contact">
      <div className="container">
        <h3>have any questions/issue?</h3>
        <div className="infos">
          <div className="img">
            <Image
              src={Contact}
              width={800}
              height={800}
              alt='contact image'
            />
          </div>
          <div className="infolist">
            <h4>Contact Us:</h4>
            <div className="info location">
              <MdLocationPin size={26} />
              <p>Boulevard Hassan II, Bureaux NakhilEtage 4 N35,Tetouan 93000</p>
            </div>
            <div className="info mail">
              <MdMail size={20} />
              <p>me@diaaland.com</p>
            </div>
            <div className="info time">
              <MdTimer size={20} />
              <p>Lundi - Jeudi9:30AM - 03:00PM</p>
            </div>
            <div className="info phone">
              <MdPhone size={20} />
              <p>+212 8 08 53 17 91</p>
            </div>
          </div>
        </div>
        <div className="form">
          <form action="" onSubmit={handleSubmit}>
            <label htmlFor="email">email address:</label>
            <input id='email' type="email" placeholder='enter your email' value={email} onChange={handleEmailChange} required onInvalid={emailHandleError} />
            <p ref={emailError} className='errorEmail'></p>
            <label htmlFor="subject">subject:</label>
            <input id='subject' type="text" placeholder='Enter your subject' value={subject} onChange={handleSubjectChange} required onInvalid={passwordHandleError} />
            <p ref={passwordError} className='errorPassword'></p>
            <label htmlFor="message">message:</label>
            <textarea name="" id="message" cols={30} rows={10} placeholder='Type your message here...' value={message} onChange={handleMessageChange} required onInvalid={messageHandleError} ></textarea>
            <p ref={messageError} className='errorMessage'></p>
            <button type="submit">send my message</button>
          </form>
        </div>
      </div>
    </div>
  )
}
