import React from 'react'
import Image from 'next/image'
import FounderImage from '@/public/images/founder.png'
import './Founder.scss'

export default function Founder() {
  return (
    <div id="about-section" className="founder">
      <div className="container">
        <h3>meet the founder</h3>
        <div className="founder-content">
          <div className="biographie">
            <h4>Diaa Alhak EL FALLOUS</h4>
            <p>IT State Engineer (INPT 2005 graduate) with 18 years of experience in IT. He is a member of the MACS association and has been actively involved in organizing the Computer Olympiad in Morocco.Previously, he served as the director of the national programming competition, MCPC.</p>
          </div>
          <div className="img">
            <Image 
              src={FounderImage}
              width={150}
              height={150}
              alt='iamge represent the founder of diaa land mr diaa alhak el fallous'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
