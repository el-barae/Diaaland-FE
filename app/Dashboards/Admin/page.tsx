'use client'
import { useState ,useEffect} from "react"
import React from 'react';
import './style.scss';
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'
import Jobs from '@/components/Admin/jobs/jobs'
import Dashboard from '@/components/Admin/Dashboard/Dashboard'
import Candidates from '@/components/Admin/Candidates/Candidates'
import Customers from '@/components/Admin/Customers/Customer'
import Skills from '@/components/Admin/Skills/Skills'
import Messages from '@/components/Admin/Messages/Messages'
import axios from "axios";
import API_URL from "@/config";

const Admin = () =>{
    var [x,setX] = useState("Dashboard");
    const [notif,setNotif] = useState(false); 

    useEffect(() => {
        axios.get(API_URL+'/api/v1/messages/viewed')
          .then(response => {
            setNotif(response.data);
          })
          .catch(error => {
            console.error('Error fetching message status:', error);
          });
    }, []);

    const markAllMessagesViewed = () => {
        axios.put(API_URL+'/api/v1/messages/mark-viewed')
          .catch(error => {
            console.error('Error marking messages as viewed:', error);
        });
    };

    const handleClick = (value : string) => {
        setX(value);
        if (value === "Messages") {
            markAllMessagesViewed();
            setNotif(false);
        }
        y();
      };

      const y = () => {
        if (x === "Jobs") {
          return <Jobs />;
        }
        if (x === "Dashboard") {
            return <Dashboard/>;
          }
          if (x === "Candidates") {
            return <Candidates/>;
          }
          if (x === "Customers") {
            return <Customers/>;
          }
          if (x === "Skills") {
            return <Skills/>;
          }
          if (x === "Messages") {
            return <Messages/>;
          }
      }



    return (
        <ThemeProvider enableSystem={true} attribute="class">
            <Navbar/>
            <div className="admin">
    <div className="navigation">
        <ul>
            <li>
                <a href="#" onClick={() => handleClick("Dashboard")}>
                    <span className="title">Dashboard</span>
                </a>
            </li>

            <li>
                <a href="#" onClick={() => handleClick("Jobs")}>
                    <span className="title">Jobs</span>
                </a>
            </li>

            <li>
                <a href="#" onClick={() => handleClick("Customers")}>
                    <span className="title">Customers</span>
                </a>
            </li>

            <li>
                <a href="#" onClick={() => handleClick("Candidates")}>
                    <span className="title">Candidates</span>
                </a>
            </li>

            <li>
                <a href="#" onClick={() => handleClick("Skills")}>
                    <span className="title">Skills</span>
                </a>
            </li>

            <li>
                <a href="#" onClick={() => handleClick("Messages")}>
                    <span className="title">Messages
                    {notif === false ? null : <span className="badge">{notif}</span>}
                    </span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span className="title">Matches</span>
                </a>
            </li>

        </ul>
    </div>
    <div className="main">
        {y()}
    </div>
</div>


        </ThemeProvider>
    );
}
  
  export default Admin;

