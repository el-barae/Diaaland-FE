import React from 'react'
import goal1 from '@/public/images/goal1.png'
import goal2 from '@/public/images/goal2.png'
import goal3 from '@/public/images/goal3.svg'
import Image from 'next/image'
import './Goals.scss'

export default function Goals() {
  return (
    <div id="goals-section" className='goals'>
      <div className="container">
        <h3>Our goal is to revolutionalize the IT Recruitement</h3>
        <div className="goals-list">
          <div className="goal">
            <div className="img">
              <Image 
                src={goal1}
                width={100}
                height={100}
                alt="picture describe the goal number 1"
              />
            </div>
            <div className="goal-content">
              <h4>Candidate-Centric Approach</h4>
              <p>
                We put candidates first, providing personalized 
                support for successful career matches
              </p>
            </div>
          </div>
          <div className="goal">
            <div className="img">
              <Image 
                src={goal2}
                width={100}
                height={100}
                alt="picture describe the goal number 1"
              />
            </div>
            <div className="goal-content">
              <h4>Diversity and Inclusion</h4>
              <p>
                We Foster opportunities and embracing diverse talents for inclusive IT recruitment
              </p>
            </div>
          </div>
          <div className="goal">
            <div className="img">
              <Image 
                src={goal3}
                width={100}
                height={100}
                alt="picture describe the goal number 1"
              />
            </div>
            <div className="goal-content">
              <h4>Collaboration and Partnerships</h4>
              <p>
                We collaborate with experts and organizations to
                drive innovation in IT recruitment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
