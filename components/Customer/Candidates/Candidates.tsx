'use client'
import { useState,useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import './Candidates.scss'
import API_URL from "@/config";
import { jwtDecode } from "jwt-decode";

interface MyToken {
  sub: string; // email
  id: number;
  name: string;
  role: string;
  exp: number;
}

interface Candidate {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    jobStatus: string;
  }

  interface RepeatClassNTimesProps {
    className: string;
    n: number;
    candidatesData: Candidate[];
  }

const Candidates = () =>{
    const [candidatesData,setCandidatesData] = useState([])
    const router = useRouter();

  const ViewMore = (id:number) => {
    localStorage.setItem('IDSelected',String(id));
    router.push("../View/Candidate")
  }

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, candidatesData }) => {
    if(candidatesData.length != 0)
      return(
        <>
        {candidatesData.map((candidate) => (
          <div key={candidate.id} className={className}>
          <h1>{candidate.firstName} {candidate.lastName}:</h1>
          <span> Email: </span>{candidate.email}
          <p><span> Job statut: </span> {candidate.jobStatus}  </p>
          <button onClick={() => ViewMore(candidate.id)}>More</button>
        </div>
        ))}
        </>
      )
    }
    useEffect(() => {
        const fetchData = async () => {
          try {
            const token = localStorage.getItem("token");
                    if (!token) {
                      alert("Token not found. Please log in again.");
                      return;
                    }
              
                    const decoded = jwtDecode<MyToken>(token);
                    const id = decoded.id;
            const response = await axios.get(API_URL+'/api/v1/jobs/candidate-jobs/byCustomer/'+String(id), {
              headers: {
                'Authorization': 'Bearer ' + token
              }
              });        
                  
            setCandidatesData(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        };
        fetchData();
  }, []);
    return(
    <div className="jobs">
        <h1>Latest candidates</h1>
        <div className='lists'>
                  <RepeatClassNTimes className="list" n={candidatesData.length} candidatesData={candidatesData} />
                </div>
    </div>
    );
}

export default Candidates;