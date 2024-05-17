'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/HomePage/Logo/Logo'
import Image from 'next/image'
import ResetPasswordImage from '@/public/images/forgot-password.svg'
import Cookies from 'js-cookie'
import swal from 'sweetalert'
import axios from 'axios'
import API_URL from '@/config'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import '../style.scss'

export default function ChangePass() {

  const passwordErrorRef = useRef<HTMLDivElement>(null);
  const [passState, setPassState] = useState('hide');
  const iconRef = useRef<HTMLDivElement>(null);

  const [currentPassword, setCurentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const router = useRouter();

  const invalidPassword = (e: any) => {
		e.preventDefault();
		if (passwordErrorRef.current) {
			passwordErrorRef.current.innerHTML = e.target.validationMessage;
		}
	}

  const handleIconClick = () => {
		if (passState === 'hide') {
			setPassState('show');
		} else {
			setPassState('hide');
		}
	}

  const handleSubmitClick = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
      swal('Password chaged', '', 'success');
      try{
      axios.patch(API_URL+'/api/v1/users',{
        "currentPassword": currentPassword,
         "newPassword": newPassword,
         "confirmationPassword": cPassword 
      }, {
				headers: {
					'Authorization': 'Bearer ' + token
				}
			})
      if(role !== "ADMIN"){
        const email = localStorage.getItem("email");
        axios.post(API_URL+'/api/v1/auth', {
        "email": email,
        "password": newPassword
        })
        .then(function (response) {
        localStorage.setItem('token',response.data.token)
        localStorage.setItem('role',response.data.role)
        Cookies.set("loggedin", "true");
        if(response.data.role === 'CANDIDAT')
          router.push('Dashboards/Candidate')
        else{ if(response.data.role === 'CUSTOMER')
            router.push('Dashboards/Customer')
          else(response.data.role === 'ADMIN')
            router.push('Dashboards/Admin')
        }
        })
        .catch(function (error) {
        console.log(error);
        });
      }
      }catch(error){
        swal('Password not chaged', '', 'error');
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
          <p>Current password:</p>
          <div className="password-input">
											<input type={passState === 'show' ? "text" : "password"} name="password" id="password" placeholder="Enter your current password" required value={currentPassword} onChange={(e) => setCurentPassword(e.target.value)} onInvalid={invalidPassword} />
											<div ref={iconRef} className="icon" onClick={handleIconClick}>
												{passState === 'hide' ? <FaEyeSlash /> : <FaEye />}
											</div>
										</div>
										<div ref={passwordErrorRef} className="password-error error"></div>
										<div className="forgot-password"></div>
          
          <p>New password:</p>
          <div className="password-input">
                    <input type={passState === 'show' ? "text" : "password"} name="password" id="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
											<div ref={iconRef} className="icon" onClick={handleIconClick}>
												{passState === 'hide' ? <FaEyeSlash /> : <FaEye />}
											</div>
										</div>
										<div ref={passwordErrorRef} className="password-error error"></div>
										<div className="forgot-password"></div>
                    <div className="password-input">
                    <input type={passState === 'show' ? "text" : "password"} name="password" id="password" placeholder="Confirm password" value={cPassword} onChange={(e) => setCPassword(e.target.value)}  />
											<div ref={iconRef} className="icon" onClick={handleIconClick}>
												{passState === 'hide' ? <FaEyeSlash /> : <FaEye />}
											</div>
										</div>
										<div ref={passwordErrorRef} className="password-error error"></div>
										<div className="forgot-password"></div>
          <input type="submit" value="Reset my password" onClick={handleSubmitClick} />
        </div>
      </div>
    </div>
  )
}
