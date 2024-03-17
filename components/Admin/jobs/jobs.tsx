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
            const response = await axios.get(API_URL+'/api/v1/jobs/list');         
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
    const [xp, setXp] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');

const handleModifyClick = (e: any, id: number, name: string, minSalary: number, maxSalary: number, positionNumber: number, openDate: string, endDate: string, address: string, xp: string, type: string, description: string) => {
    setJobId(id);
    setJobTitle(name);
    setMinSalary(minSalary);
    setMaxSalary(maxSalary);
    setPositionNumber(positionNumber);
    setOpenDate(openDate);
    setEndDate(endDate);
    setAddress(address);
    setXp(xp);
    setType(type);
    setDescription(description);
    setModalOpen(true);
};

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, jobsData }) => {
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
          <button onClick={(e) => handleModifyClick(e, job.id, job.name, job.minSalary, job.maxSalary, job.numberOfPositions, job.openDate, job.closeDate, job.address, job.remoteStatus, job.type, job.description)}>Modify</button>
          <Modal isOpen={modalOpen} id={jobId} jobTitle={jobTitle} minSalary={minSalary} maxSalary={maxSalary} positionNumber={positionNumber} openDate={openDate} endDate={endDate} adress={address} xp={xp} type={type} description={description} onClose={() => setModalOpen(false)} setJobData={setJobsData}/>
        </div>
        ))}
        </>
      )
    }

  return(
    <>
    <div className='jobs'>
        <h1>Jobs</h1>
                <div className='lists'>
                  <RepeatClassNTimes className="list" n={jobsData.length} jobsData={jobsData} />
                </div>
    </div>
    </>
  );
}
export default Jobs;