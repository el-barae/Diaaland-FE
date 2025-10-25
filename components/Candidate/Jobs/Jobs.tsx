import './jobs.scss'
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
    type: string;
    description: string;
    numberOfPositions: number;
    closeDate: string;
  }

  interface RepeatClassNTimesProps {
    className: string;
    n: number;
    jobsData: Job[];
  }

const Jobs = () =>{
    const [jobsData, setJobsData] = useState<Job[]>([]);
    
    // ✅ Supprimer une candidature
  const handleDelete = async (e: any, jobId: number) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token not found, please log in again.");
        return;
      }

      const decoded = jwtDecode<MyToken>(token);
      const candidateId = decoded.id;

      await axios.delete(`${API_URL}/api/v1/jobs/candidate-jobs/${candidateId}/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🔄 Mise à jour locale
      setJobsData((prev) => prev.filter((job) => job.id !== jobId));
      console.log(`Job ${jobId} deleted successfully`);
    } catch (error) {
      console.error("Erreur lors de la suppression du job :", error);
    }
  };

  // ✅ Récupérer les jobs du candidat connecté
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode<MyToken>(token);
        const candidateId = decoded.id;

        const response = await axios.get(
          `${API_URL}/api/v1/jobs/candidate-jobs/byCandidate/${candidateId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setJobsData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
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
            <h1>{job.name} </h1>
            <span> Type: </span>{job.type}
            <p><span> Number of positions: </span> {job.numberOfPositions} </p>
            <p><span> Close Date: </span>{job.closeDate}</p>
            <button onClick={(e) => handleDelete(e, job.id)}>Delete</button>
          </div>
          ))}
          </>
        )
      }

  return(
    <>
    <div className='jobs'>
        <h1>My jobs</h1>
                <div className='lists'>
                  <RepeatClassNTimes className="list" n={jobsData.length} jobsData={jobsData} />
                </div>
    </div>
    </>
  );
}
export default Jobs;