'use client'
import { ThemeProvider } from 'next-themes'
import React from 'react'
import Navbar from '@/components/HomePage/Navbar/Navbar'
import Serv1logo1 from '@/public/images/servlogo1.png'
import Serv1logo2 from '@/public/images/servlogo2.png'
import Serv1logo3 from '@/public/images/servlogo3.png'
import Image from 'next/image'
import ServicePage1 from '@/public/images/servicePage1.png'
import ServicePage2 from '@/public/images/servicePage2.png'
import ServicePage3 from '@/public/images/servicePage2.png'
import './style.scss'

export default function ServicesPage() {
  return (
    <ThemeProvider enableSystem={true} attribute="class" >
      <Navbar />
      <div className="services-page">
        <div className="container">
          <div className="services-list">
            <div className="service-card">
              <div className="img">
                <Image
                  src={ServicePage1}
                  width={500}
                  height={500}
                  alt='image describe the service number 1'
                />
              </div>
              <div className="serv-content">
                <h2>Consultance technique IT</h2>
                <div className="desc">
                  <div className="logo">
                    <Image
                      src={Serv1logo1}
                      width={200}
                      height={200}
                      alt='logo of the architecture&apos;s system informations'
                    />
                  </div>
                  <div className="desc-content">
                    <h3>
                      Architecture of system informations
                    </h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
                  </div>
                </div>
                <div className="desc">
                  <div className="logo">
                    <Image
                      src={Serv1logo2}
                      width={200}
                      height={200}
                      alt='IT project management and monitoring'
                    />
                  </div>
                  <div className="desc-content">
                    <h3>
                      Gestion et suivi des projects IT
                    </h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
                  </div>
                </div>
                <div className="desc">
                  <div className="logo">
                    <Image
                      src={Serv1logo3}
                      width={200}
                      height={200}
                      alt='Organize IT events'
                    />
                  </div>
                  <div className="desc-content">
                    <h3>
                      Organize IT events
                    </h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="service-card">
              <div className="img">
                <Image
                  src={ServicePage1}
                  width={500}
                  height={500}
                  alt='image describe the service number 1'
                />
              </div>
              <div className="serv-content">
                <h2>Consultance technique IT</h2>
                <div className="desc">
                  <div className="logo">
                    <Image
                      src={Serv1logo1}
                      width={200}
                      height={200}
                      alt='logo of the architecture&apos;s system informations'
                    />
                  </div>
                  <div className="desc-content">
                    <h3>
                      Architecture of system informations
                    </h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
                  </div>
                </div>
                <div className="desc">
                  <div className="logo">
                    <Image
                      src={Serv1logo2}
                      width={200}
                      height={200}
                      alt='IT project management and monitoring'
                    />
                  </div>
                  <div className="desc-content">
                    <h3>
                      Gestion et suivi des projects IT
                    </h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
                  </div>
                </div>
                <div className="desc">
                  <div className="logo">
                    <Image
                      src={Serv1logo3}
                      width={200}
                      height={200}
                      alt='Organize IT events'
                    />
                  </div>
                  <div className="desc-content">
                    <h3>
                      Organize IT events
                    </h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="service-card">
              <div className="img">
                <Image
                  src={ServicePage1}
                  width={500}
                  height={500}
                  alt='image describe the service number 1'
                />
              </div>
              <div className="serv-content">
                <h2>Consultance technique IT</h2>
                <div className="desc">
                  <div className="logo">
                    <Image
                      src={Serv1logo1}
                      width={200}
                      height={200}
                      alt='logo of the architecture&apos;s system informations'
                    />
                  </div>
                  <div className="desc-content">
                    <h3>
                      Architecture of system informations
                    </h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
                  </div>
                </div>
                <div className="desc">
                  <div className="logo">
                    <Image
                      src={Serv1logo2}
                      width={200}
                      height={200}
                      alt='IT project management and monitoring'
                    />
                  </div>
                  <div className="desc-content">
                    <h3>
                      Gestion et suivi des projects IT
                    </h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
                  </div>
                </div>
                <div className="desc">
                  <div className="logo">
                    <Image
                      src={Serv1logo3}
                      width={200}
                      height={200}
                      alt='Organize IT events'
                    />
                  </div>
                  <div className="desc-content">
                    <h3>
                      Organize IT events
                    </h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
