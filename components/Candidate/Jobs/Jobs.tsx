import './jobs.scss'
import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
import Cookies from 'js-cookie';

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

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, jobsData }) => {
    if(jobsData.length != 0)
      return(
        <>
        {jobsData.map((job) => (
          <div key={job.id} className={className}>
          <h1>{job.name} :</h1>
          <p>
            Description: {job.description} <br/> Number of positions: {job.numberOfPositions} 
          </p>
          <p>Close Date: {job.closeDate}</p>
        </div>
        ))}
        </>
      )
    }

const Jobs = () =>{
    const [jobsData, setJobsData] = useState<Job[]>([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            Cookies.set("id","1")
            const id = Cookies.get("id");
            const response = await axios.get('http://localhost:7777/api/v1/candidate-jobs/byCandidate/'+String(id));         
            setJobsData(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        };
        fetchData();
  }, []);
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