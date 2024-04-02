import './favoris.scss'
import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
import Cookies from 'js-cookie';
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
  const token = localStorage.getItem("token");

  const handleApply = async (e:any, id:number) =>{
		e.preventDefault()
		axios.post(API_URL+'/api/v1/candidate-jobs', {
			"status": "pending",
      "candidate": {
        "id": 1
      },
      "job": {
        "id": id
      }
		 }, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
		 .then(function (response) {
		 })
		 .catch(function (error) {
			console.log(error);
		 });
	}

const Favoris = () =>{  

  const [jobsData, setJobsData] = useState<Job[]>([]);

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

    const handleDelFavoris = async (e:any, idJ:number) =>{
      e.preventDefault()
      try {
      Cookies.set("id","1")
      const idC = Cookies.get("id");
      axios.delete(API_URL+'/api/v1/favoris/'+String(idC)+'/'+String(idJ), {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      const updatedJobsData = jobsData.filter(job => job.id !== idJ)
      setJobsData(updatedJobsData)
    } catch (error) {
      console.error('Erreur lors de la modification des données :', error);
    }
    }

    useEffect(() => {
         const fetchData = async () => {
    try {
      Cookies.set("id","1")
      const id = Cookies.get("id");
      const response = await axios.get(API_URL+'/api/v1/favoris/'+String(id), {
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
        <h1>My favoris</h1>
                <div className='lists'>
                  <RepeatClassNTimes className="list" n={jobsData.length} jobsData={jobsData} />
                </div>
    </div>
    </>
  );
}
export default Favoris;