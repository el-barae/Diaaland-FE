'use client'
import { useState ,useEffect} from "react"
import React from 'react';
import './style.scss';
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'
import { useRouter } from "next/navigation";
import Jobs from '@/components/Admin/jobs/jobs'
import Dashboard from '@/components/Admin/Dashboard/Dashboard'
import Candidates from '@/components/Admin/Candidates/Candidates'
import Customers from '@/components/Admin/Customers/Customer'
import Skills from '@/components/Admin/Skills/Skills'
import Messages from '@/components/Admin/Messages/Messages'
import Applies from '@/components/Admin/Applies/Applies'
import Matches from '@/components/Admin/ Matches/Matches'
import axios from "axios";
import API_URL from "@/config";
import swal from "sweetalert";
import {jwtDecode} from "jwt-decode";

const Admin = () =>{
    var [x,setX] = useState("Dashboard");
    const [notif,setNotif] = useState(true); 
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            swal('No token found. Please log in.', '', 'error');
            router.push('/');
            return;
        }

        try {
            const decoded: any = jwtDecode(token);
            const role = decoded.role;

            if (role !== "ADMIN") {
            swal('Authenticate yourself when you are an ADMIN', '', 'error');
            router.push('/');
            return;
            }

            // ADMIN logic
            setTimeout(() => {
            setLoading(false);
            }, 500);

            axios.get(`${API_URL}/api/v1/users/messages/viewed/DIAALAND`)
            .then(response => setNotif(response.data))
            .catch(error => console.error('Error fetching message status:', error));

        } catch (error) {
            console.error('Invalid token:', error);
            swal('Invalid or expired token', '', 'error');
            router.push('/');
        }
        }, []);


    const markAllMessagesViewed = () => {
        axios.put(API_URL+'/api/v1/users/messages/mark-viewed/DIAALAND')
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
        if (x === "Applies") {
            return <Applies />;
        }
        if (x === "Dashboard") {
            return <Dashboard handleClick={handleClick}/>;
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
          if (x === "Matches") {
            return <Matches/>;
          }
      }



    return (
        <ThemeProvider enableSystem={true} attribute="class">
            <Navbar/>
            {!loading && (
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
                <a href="#" onClick={() => handleClick("Applies")}>
                    <span className="title">Applies</span>
                </a>
            </li>

            <li>
                <a href="#" onClick={() => handleClick("Customers")}>
                    <span className="title">Employers</span>
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
                <a href="#" onClick={() => handleClick("Matches")}>
                    <span className="title">Matches</span>
                </a>
            </li>
            
        </ul>
    </div>
    <div className="main">
        {y()}
    </div>
    
</div>
            )}
            {loading && (
                <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            )}
        </ThemeProvider>
    );
}
  
  export default Admin;

