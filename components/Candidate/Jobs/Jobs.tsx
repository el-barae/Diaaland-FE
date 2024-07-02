import './jobs.scss'
import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
import API_URL from '@/config'

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

const Jobs = () =>{
    const [jobsData, setJobsData] = useState<Job[]>([]);
    const handleDelete = async (e:any, idJ:number) =>{
      e.preventDefault()
      var ID = localStorage.getItem("ID");
      const token = localStorage.getItem("token");
      axios.delete(API_URL+'/api/v1/candidate-jobs/'+String(ID)+'/'+String(idJ), {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
       .catch(function (error) {
        console.log(error);
       });
    }

    const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, jobsData }) => {
      if(jobsData.length != 0)
        return(
          <>
          {jobsData.map((job) => (
            <div key={job.id} className={className}>
            <h1>{job.name} :</h1>
            <span> Description: </span>{job.description}
            <p><span> Number of positions: </span> {job.numberOfPositions} </p>
            <p><span> Close Date: </span>{job.closeDate}</p>
            <button onClick={(e) => handleDelete(e, job.id)}>Delete</button>
          </div>
          ))}
          </>
        )
      }
      
    useEffect(() => {
        const fetchData = async () => {
          try {
            var ID = localStorage.getItem("ID");
            const token = localStorage.getItem("token");
            const response = await axios.get(API_URL+'/api/v1/candidate-jobs/byCandidate/'+String(ID), {
              headers: {
                'Authorization': 'Bearer ' + token
              }
            });     
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