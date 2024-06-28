'use client'
import API_URL from "@/config"
import axios from "axios"
import { useState, useEffect } from "react"
import Select,{ SingleValue } from "react-select"
import './Matches.scss'

interface Matching{
  id: number;
  score: number;
  candidate: {
      id: number;
      firstName: string;
      lastName: string;
  };
  job: {
      id: number;
      name: string;
      customer:{
        id: number;
        name: string;
      }
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
  const [matchingData, setMatchingData] = useState<Matching[]>([]);
  const [filteredData, setFilteredData] = useState<Matching[]>([]);
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
          const response1 = await axios.get<Matching[]>(API_URL+'/api/v1/matching', {
              headers: {
                'Authorization': 'Bearer ' + token
              }
            });
          setMatchingData(response1.data);
          setFilteredData(response1.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des données :', error);
        }
      };
      fetchData();
   }, []);

   interface LastCandidates {
      n: number;
      matchingData: Matching[];
   }

   const ListMatching: React.FC<LastCandidates> = ({ n, matchingData }) => {
    if (matchingData.length !== 0)
      return (
        <>
          {matchingData.map((m) => (
            <tr key={m.id}>
              <td>{m.candidate?.firstName ?? 'N/A'} {m.candidate?.lastName ?? 'N/A'}</td>
              <td>{m.job?.name ?? 'N/A'}</td>
              <td>{m.job?.customer?.name ?? 'N/A'}</td>
              <td><span>{m.score}</span></td>
            </tr>
          ))}
        </>
      );
    return null;
  };

  const filterMatchingData = (candidateId: number | undefined, jobId: number | undefined) => {
    let filtered = matchingData;

    if (candidateId) {
      filtered = filtered.filter((m) => m.candidate.id === candidateId);
    }

    if (jobId) {
      filtered = filtered.filter((m) => m.job.id === jobId);
    }

    setFilteredData(filtered);
  };

  const handleCandidateChange = (newValue: SingleValue<{ value: number; label: string }>) => {
    setSelectedCandidate(newValue);
    filterMatchingData(newValue?.value, selectedJob?.value);
  };

  const handleJobChange = (newValue: SingleValue<{ value: number; label: string }>) => {
    setSelectedJob(newValue);
    filterMatchingData(selectedCandidate?.value, newValue?.value);
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
                  <td>Score matching</td>
              </tr>
          </thead>

          <tbody>
          {filteredData.length > 0 ? (
          <ListMatching n={filteredData.length} matchingData={filteredData} />
        ) : (
          <tr>
            <td colSpan={4}>No matching data available</td>
          </tr>
        )}
          </tbody>
      </table>
  </div>
    );
}
export default Applies;