'use client'
import { useState, useEffect } from 'react'
import Logo from '@/components/HomePage/Logo/Logo'
import Image from 'next/image'
import ResetPasswordImage from '@/public/images/forgot-password.svg'
import Cookies from 'js-cookie'
import swal from 'sweetalert'
import API_URL from '@/config'
import '../style.scss'

export default function ChangePass() {

  const [email, setEmail] = useState('');

  function isValidEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  const handleSubmitClick = () => {
    if (email === '') {
      swal('Please enter your email', '', 'error');
    } else if (!isValidEmail(email)) {
      swal('Please enter a valid email', '', 'error');
    } else {
      swal('Email sent', '', 'success');
      Cookies.set("resetToken", "");
    }
  }

  return (
    <div className="reset-password">
      <div className="reset h-screen w-screen flex gap-8">
        <div className="info-side p-12">
          <div className="logo text-3xl">
            <Logo />
          </div>
          <div className="image">
            <Image 
              src={ResetPasswordImage}
              alt="reset password image"
            />
          </div>
        </div>
        <div className="forgot-box bg-blue-100 p-12">
          <div className="logo text-5xl font-bold">
            <Logo />
          </div>
          <h3>Change password</h3>
          <p>New password:</p>
          <input type="password" name="password" id="password" placeholder="Enter password" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" name="password" id="password" placeholder="Confirm password" onChange={(e) => setEmail(e.target.value)} />
          <input type="submit" value="Reset my password" onClick={handleSubmitClick} />
        </div>
      </div>
    </div>
  )
}