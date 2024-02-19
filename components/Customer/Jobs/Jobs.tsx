import './jobs.scss'
import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
import Cookies from 'js-cookie';
import API_URL from '@/config';
import Modal from './ModalJobs/ModalJobs';

interface Job {
  id: number;
  name: string;
  description: string;
  minSalary: number;
  maxSalary: number;
  type: string;
  openDate: string;
  closeDate: string; 
  numberOfPositions: number;
  address: string;
  remoteStatus: string;
}


  interface RepeatClassNTimesProps {
    className: string;
    n: number;
    jobsData: Job[];
  }

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, jobsData }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const handleApplyClick = () => {
      setModalOpen(true);
    };
    if(jobsData.length != 0)
      return(
        <>
        {jobsData.map((job) => (
          <div key={job.id} className={className}>
          <h1>{job.name} :</h1>
          <p>
            Type: {job.type} <br/> Number of positions: {job.numberOfPositions} 
          </p>
          <p>Close Date: {job.closeDate}</p>
          <button onClick={(e) => handleDelete(e, job.id)}>Delete</button>
          <button onClick={() => handleApplyClick()}>Modify</button>
          <Modal isOpen={modalOpen} id={job.id} jobTitle={job.name} minSalary={job.minSalary} maxSalary={job.maxSalary} positionNumber={job.numberOfPositions} openDate={job.openDate} endDate={job.closeDate} adress={job.address} xp={job.remoteStatus} type={job.type} description={job.description} onClose={() => setModalOpen(false)}/>
        </div>
        ))}
        </>
      )
    }
    const handleDelete = async (e:any, idJ:number) =>{
      e.preventDefault()
      Cookies.set("id","1")
      const idC = Cookies.get("id");
      axios.delete(API_URL+'/api/v1/candidate-jobs/'+String(idC)+'/'+String(idJ))
       .catch(function (error) {
        console.log(error);
       });
    }

const Jobs = () =>{
    const [jobsData, setJobsData] = useState<Job[]>([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            Cookies.set("id","1")
            const id = Cookies.get("id");
            const response = await axios.get(API_URL+'/api/v1/jobs/byCustomer/'+String(id));         
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