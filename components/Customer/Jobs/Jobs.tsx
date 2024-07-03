import './jobs.scss'
import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
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
  degrees: string[];
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
      const token = localStorage.getItem("token");
      axios.delete(API_URL+'/api/v1/jobs/'+String(idJ), {
				headers: {
				  'Authorization': 'Bearer ' + token
				}
			  })
       .catch(function (error) {
        console.log(error);
       });
    }

    useEffect(() => {
        const fetchData = async () => {
          try {
            const token = localStorage.getItem("token");
            const id = localStorage.getItem("ID");
            const response = await axios.get(API_URL+'/api/v1/jobs/byCustomer/'+String(id), {
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

  const [modalOpen, setModalOpen] = useState(false);
    const [jobId, setJobId] = useState(0);
    const [jobTitle, setJobTitle] = useState('');
    const [minSalary, setMinSalary] = useState(0);
    const [maxSalary, setMaxSalary] = useState(0);
    const [positionNumber, setPositionNumber] = useState(0);
    const [openDate, setOpenDate] = useState('');
    const [endDate, setEndDate] = useState(''); 
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [degrees, setDegrees] = useState<string[]>([]);

    const handleModifyClick = (e: any, job: Job) => {
      setJobId(job.id);
      setJobTitle(job.name);
      setMinSalary(job.minSalary);
      setMaxSalary(job.maxSalary);
      setPositionNumber(job.numberOfPositions);
      setOpenDate(job.openDate);
      setEndDate(job.closeDate);
      setAddress(job.address);
      setStatus(job.remoteStatus);
      setType(job.type);
      setDescription(job.description);
      setDegrees(job.degrees);
      setModalOpen(true);
    };

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, jobsData }) => {
    if(jobsData.length != 0)
      return(
        <>
        {jobsData.map((job) => (
          <div key={job.id} className={className}>
          <h1>{job.name}</h1>
          <span> Type: </span>{job.type}
          <p><span> Number of positions: </span> {job.numberOfPositions} </p>
          <p><span> Close Date: </span>{job.closeDate}</p>
          <button onClick={(e) => handleDelete(e, job.id)}>Delete</button>
          <button onClick={(e) => handleModifyClick(e, job)}>Modify</button>
          <Modal isOpen={modalOpen} id={jobId} jobTitle={jobTitle} minSalary={minSalary} maxSalary={maxSalary} positionNumber={positionNumber} openDate={openDate} endDate={endDate} address={address} status={status} type={type} description={description} degrees={degrees} onClose={() => setModalOpen(false)} setJobData={setJobsData}/>
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