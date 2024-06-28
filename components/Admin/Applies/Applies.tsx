'use client'
import API_URL from "@/config"
import axios from "axios"
import { useState, useEffect } from "react"
import './Applies.scss'

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

const Applies = () =>{
    const [appliedCandidatesData, setAppliedCandidatesData] = useState<appliedCandidates[]>([]);
    useEffect(() => {
        const token = localStorage.getItem("token")
        const fetchData = async () => {
          try {
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
                    <td>{candidateJob.job?.customer?.name ?? 'N/A'}</td>
                        <td><span className={getStatusClass(candidateJob.status)}>{candidateJob.status}</span></td>
                    </tr>
                ))}
            </>
        );
      }

      return (
        <div className="recentOrders">
        <div className="cardHeader">
            <h2 id="Applies-h">Applied candidates</h2>
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