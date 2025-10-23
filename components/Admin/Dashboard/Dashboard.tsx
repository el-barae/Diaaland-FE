import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
import API_URL from "@/config";

interface Job {
    id: number;
    name: string;
    description: string;
    numberOfPositions: number;
    closeDate: string;
   }
interface appliedCandidates{
  id: number;
  status: string;
  candidate: {
      id: number;
      firstName: string;
      lastName: string;
  } | null;
  job: {
      id: number;
      name: string;
      customer: {
        id: number;
        name: string;
      } | null;
  } | null;
}

function getStatusClass(status: string) {
    switch (status) {
      case 'refuse':
        return 'delivered-refuse';
      case 'accept':
        return 'delivered-accept';
      case 'pending':
        return 'delivered-pending';
      default:
        return 'delivered';
    }
  }

const Dashboard = ({ handleClick }: { handleClick: (value: string) => void }) => {

    const [appliedCandidatesData, setAppliedCandidatesData] = useState<appliedCandidates[]>([]);
    const [jobsData, setJobsData] = useState<Job[]>([]);
    const [countJobs, setCountJobs] = useState(0);
    const [countCandidates, setCountCandidates] = useState(0);
    const [countCustomers, setCountCustomers] = useState(0);
    
    useEffect(() => {
        const token = localStorage.getItem("token")
        const fetchData = async () => {
          try {
            const response = await axios.get(API_URL+"/api/v1/jobs/list", {
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              });
            setJobsData(response.data);
            const countJ = await axios.get(API_URL+'/api/v1/users/admin/jobs', {
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              });
            setCountJobs(countJ.data);
            const countCa = await axios.get(API_URL+'/api/v1/users/admin/candidates', {
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              });
            setCountCandidates(countCa.data);
            const countCu = await axios.get(API_URL+'/api/v1/users/admin/customers', {
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              });
            setCountCustomers(countCu.data);
            const response1 = await axios.get<appliedCandidates[]>(API_URL+'/api/v1/jobs/candidate-jobs', {
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

 interface LastJobs {
    n: number;
    jobsData: Job[];
 }
 interface LastCandidates {
    n: number;
    appliedCandidatesData: appliedCandidates[];
 }

    const ListJobs: React.FC<LastJobs> = ({ n, jobsData }) => {
        const lastjobsData = jobsData.slice(-4);
      if(lastjobsData.length != 0)
      return(
        <>
        {lastjobsData.map((job) => (
            <div key={job.id} >
                    <tr>

                        <td>
                            <h4>{job.name}<br/> <span>{job.numberOfPositions}</span></h4>
                        </td>
                    </tr>
            </div>
        ))}
        </>
      )
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
                    <td>{candidateJob.job?.customer?.name ?? 'N/A'}</td>
                    <td><span className={getStatusClass(candidateJob.status)}>{candidateJob.status}</span></td>
                </tr>
            ))}
            </>
        );
      }

      const [x, setX] = useState(""); // State variable to store the value of x

  const handle = (value : string) => {
    handleClick(value); // Call handleClick function with the value
    setX(value); // Update the value of x
  }

    return(
        <>
        <div className="topbar">

            <h1>Dashboard</h1>

            <div className="user">
            </div>
        </div>

        <div className="cardBox">
            <div className="card" onClick={() => handle("Candidates")}>
                <div>
                    <div className="numbers">{countCandidates}</div>
                    <div className="cardName">Candidates</div>
                </div>
            </div>

            <div className="card" onClick={() => handle("Customers")}>
                <div>
                    <div className="numbers">{countCustomers}</div>
                    <div className="cardName">Employers</div>
                </div>
            </div>

            <div className="card" onClick={() => handle("Jobs")}>
                <div>
                    <div className="numbers">{countJobs}</div>
                    <div className="cardName">Jobs</div>
                </div>
            </div>
        </div>

        <div className="details">
            <div className="recentOrders">
                <div className="cardHeader">
                    <h2>Last applied candidates</h2>
                    <a href="#" className="btn" onClick={() => handle("Applies")}>View All</a>
                </div>

                <table>
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
            <div className="recentCustomers">
            <div className="cardHeader">
                    <h2>Last jobs</h2>
            </div>
                <table>
                    <ListJobs n={jobsData.length} jobsData={jobsData} />
                </table>
            </div>
        </div>
        </>
    );
}
export default Dashboard;