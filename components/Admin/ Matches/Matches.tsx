'use client'
import API_URL from "@/config"
import axios from "axios"
import { useState, useEffect } from "react"
import Select,{ SingleValue } from "react-select"
import './Matches.scss'

interface appliedCandidates{
    id: number;
    status: string;
    candidate: {
        id: number;
        firstName: string;
        lastName: string;
    };
    job: {
        id: number;
        name: string;
    };
}

interface Candidate{
    id:number;
     firstName:string;
    lastName:string;
  }

  interface Job {
    id: number;
    name: string;
  }

const Applies = () =>{
    const [candidatesData,setCandidatesData] = useState<Candidate[]>([]);
    const [jobsData, setJobsData] = useState<Job[]>([]);
    const [selectedCandidate, setSelectedCandidate] = useState<SingleValue<{ value: number; label: string }> | null>(null);
    const [selectedJob, setSelectedJob] = useState<SingleValue<{ value: number; label: string }> | null>(null);
    const [appliedCandidatesData, setAppliedCandidatesData] = useState<appliedCandidates[]>([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const token = localStorage.getItem("token")
            const response = await axios.get(API_URL+'/api/v1/candidates', {
              headers: {
                'Authorization': 'Bearer ' + token
              }
            });   
            const res = await axios.get(API_URL+'/api/v1/jobs/list', {
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              });         
              setJobsData(res.data);
            setCandidatesData(response.data);
            const response1 = await axios.get<appliedCandidates[]>(API_URL+'/api/v1/candidate-jobs', {
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              });
            setAppliedCandidatesData(response1.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        };
        fetchData();
     }, []);

     interface LastCandidates {
        n: number;
        appliedCandidatesData: appliedCandidates[];
     }

     const ListAppliedCandidates: React.FC<LastCandidates> = ({ n, appliedCandidatesData }) => {
        const lastFourCandidateJobs = appliedCandidatesData.slice(-6);

        return (
            <>
                {lastFourCandidateJobs.map((candidateJob) => (
                    <tr key={candidateJob.id}>
                        <td>
                        {candidateJob.candidate?.firstName ?? 'N/A'} {candidateJob.candidate?.lastName ?? 'N/A'}
                    </td>
                    <td>{candidateJob.job?.name ?? 'N/A'}</td>
                    <td>{candidateJob.candidate?.firstName ?? 'N/A'}</td>
                        <td><span >{candidateJob.status}</span></td>
                    </tr>
                ))}
            </>
        );
      }

      const handleCandidateChange = (newValue: SingleValue<{ value: number; label: string }>) => {
        setSelectedCandidate(newValue);
      };
    
      const handleJobChange = (newValue: SingleValue<{ value: number; label: string }>) => {
        setSelectedJob(newValue);
      };
    
      const candidateOptions = candidatesData.map(candidate => ({
        value: candidate.id,
        label: `${candidate.firstName} ${candidate.lastName}`
      }));

      const jobOptions = jobsData.map(job => ({
        value: job.id,
        label: job.name
      }));

      return (
        <div className="recentOrders">
        <div className="cardHeader">
            <h2 id="Applies-h">Matches</h2>
        </div>
        <div className="sort">
            <h4>By job </h4>
            <Select id="jobs"
        name="jobs"
        value={selectedJob}
        onChange={handleJobChange}
        options={jobOptions}></Select>
            <h4>By Candidate</h4>
            <Select  id="candidates"
        name="candidates"
        value={selectedCandidate}
        onChange={handleCandidateChange}
        options={candidateOptions}></Select>
        </div>

        <table id="Applies">
            <thead>
                <tr>
                    <td>Candidate</td>
                    <td>Job</td>
                    <td>Employer</td>
                    <td>Status</td>
                </tr>
            </thead>

            <tbody>
                <ListAppliedCandidates n={appliedCandidatesData.length} appliedCandidatesData={appliedCandidatesData} />
            </tbody>
        </table>
    </div>
      );
}
export default Applies;