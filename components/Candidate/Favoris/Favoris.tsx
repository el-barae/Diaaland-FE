import './favoris.scss'
import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
import API_URL from '@/config'
import { jwtDecode } from "jwt-decode";

interface MyToken {
  sub: string; // email
  id: number;
  name: string;
  role: string;
  exp: number;
}

interface Job {
    id: number;
    name: string;
    description: string;
    numberOfPositions: number;
    closeDate: string;
  }

  interface RepeatClassNTimesProps {
    className: string;
    n: number;
    jobsData: Job[];
  }

const Favoris = () =>{  

  const [jobsData, setJobsData] = useState<Job[]>([]);

  // ✅ Candidature à un job
  const handleApply = async (e: any, jobId: number) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const decoded = jwtDecode<MyToken>(token);
      const candidateId = decoded.id;

      await axios.post(
        `${API_URL}/api/v1/jobs/candidate-jobs`,
        {
          status: "pending",
          candidate: { id: candidateId },
          job: { id: jobId },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Application sent successfully!");
    } catch (error) {
      console.error("Error during job application:", error);
    }
  };

  // ✅ Supprimer un job des favoris
  const handleDelFavoris = async (e: any, jobId: number) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwtDecode<MyToken>(token);
      const candidateId = decoded.id;

      await axios.delete(`${API_URL}/api/v1/jobs/favoris/${candidateId}/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Mise à jour locale de la liste
      setJobsData((prev) => prev.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error("Erreur lors de la suppression du favori :", error);
    }
  };

  // ✅ Récupérer les jobs favoris du candidat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode<MyToken>(token);
        const candidateId = decoded.id;

        const response = await axios.get(`${API_URL}/api/v1/jobs/favoris/${candidateId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setJobsData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
      }
    };
    fetchData();
  }, []);
  
  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, jobsData }) => {
    if(jobsData.length != 0)
      return(
        <>
        {jobsData.map((job) => (
          <div key={job.id} className={className}>
          <h1>{job.name} :</h1>
          <p>
            {job.id}
            Description: {job.description} <br/> Number of positions: {job.numberOfPositions} 
          </p>
          <p>Close Date: {job.closeDate}</p>
          <button onClick={(e) => handleDelFavoris(e, job.id)}>Delete</button>
          <button onClick={(e) => handleApply(e, job.id)}>Apply</button>
        </div>
        ))}
        </>
      )
    }


  return(
    <>
    <div className='jobs'>
        <h1>My favoris</h1>
                <div className='lists'>
                  <RepeatClassNTimes className="list" n={jobsData.length} jobsData={jobsData} />
                </div>
    </div>
    </>
  );
}
export default Favoris;