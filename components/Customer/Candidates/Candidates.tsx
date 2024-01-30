'use client'
import { useState,useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import './Candidates.scss'

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

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, candidatesData }) => {
    if(candidatesData.length != 0)
      return(
        <>
        {candidatesData.map((candidate) => (
          <div key={candidate.id} className={className}>
          <h1>{candidate.firstName} {candidate.lastName}:</h1>
          <p>
            Email: {candidate.email} <br/> Job statut: {candidate.jobStatus} 
          </p>
        </div>
        ))}
        </>
      )
    }

const Candidates = () =>{
    const [candidatesData,setCandidatesData] = useState([])
    useEffect(() => {
        const fetchData = async () => {
          try {
            Cookies.set("id","1")
            const id = Cookies.get("id");
            const response = await axios.get('http://localhost:7777/api/v1/candidate-jobs/byCustomer/'+String(id));   
                  
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