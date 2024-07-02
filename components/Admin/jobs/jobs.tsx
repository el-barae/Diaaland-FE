import './jobs.scss'
import { useState ,useEffect} from "react"
import axios from 'axios'
import { useRouter } from 'next/navigation';
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
  customer:{
    id: number
  }
}

  interface RepeatClassNTimesProps {
    className: string;
    n: number;
    filteredJobs: Job[];
  }

const Jobs = () =>{
    const [jobsData, setJobsData] = useState<Job[]>([]);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = async (e:any, idJ:number) =>{
      e.preventDefault()
      const idC = localStorage.getItem("ID");
      const token = localStorage.getItem("token");
      axios.delete(API_URL+'/api/v1/candidate-jobs/'+String(idC)+'/'+String(idJ), {
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
            const response = await axios.get(API_URL+'/api/v1/jobs/list', {
              headers: {
                'Authorization': 'Bearer ' + token
              }
            });         
            setJobsData(response.data);
            setFilteredJobs(response.data)
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
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

    const handleSearch = (term: string) => {
      const filtered = jobsData.filter((j) =>
        j.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredJobs(filtered);
   };


    const handleAddClick = (e:any)  =>{
      e.preventDefault()
      router.push('/addPost')
    }

    const handleModifyClick = (e: any, job: Job) => {
      localStorage.setItem("IDSelected",String(job.customer.id));
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

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, filteredJobs }) => {
    if(filteredJobs.length != 0)
      return(
        <>
        {filteredJobs.map((job) => (
          <div key={job.id} className={className}>
          <h1>{job.name} :</h1>
          <span> Type: </span>{job.type}
          <p><span> Number of positions: </span> {job.numberOfPositions} </p>
          <p><span> Close Date: </span>{job.closeDate}</p>
          <button onClick={(e) => handleDelete(e, job.id)}>Delete</button>
          <button onClick={(e) => handleModifyClick(e, job)}>Modify</button>
          <Modal isOpen={modalOpen} id={jobId} jobTitle={jobTitle} minSalary={minSalary} maxSalary={maxSalary} positionNumber={positionNumber} openDate={openDate} endDate={endDate} address={address} status={status} type={type} description={description} degrees={degrees} onClose={() => setModalOpen(false)} setJobData={setFilteredJobs}/>
        </div>
        ))}
        </>
      )
    }

  return(
    <>
    <div className='panel'>
        <div className='head'>
          <h1>Jobs</h1>
          <button type="button" className="button" onClick={handleAddClick}>
          <span className="button__text">Add</span>
          <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" className="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span>
          </button>
        </div>
        <div className="search">
                <label>
                    <input type="text" placeholder="Search here" value={searchTerm} onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                    }}
                    required></input>
                </label>
          </div>
                <div className='lists'>
                  <RepeatClassNTimes className="list" n={filteredJobs.length} filteredJobs={filteredJobs} />
                </div>
    </div>
    </>
  );
}
export default Jobs;