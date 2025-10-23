'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "@/config";

// Interface for the candidate jobs data
interface CandidateJobs {
    id: number;
    status: string;
    cv: string;
    diploma: string;
    coverLetter: string;
    candidate:{
        firstName: string;
        lastName: string;
    }
}


interface CandidateFiles {
    [candidateId: number]: {
        resume: File | null;
        diploma: File | null;
    };
}

// Interface for the RepeatClassNTimes component props
interface RepeatClassNTimesProps {
    className: string;
    n: number;
    candidateJobsData: CandidateJobs[];
}

// Main component for displaying candidate jobs
const Applies = () => {
  const [candidateJobsData, setCandidateJobsData] = useState<CandidateJobs[]>([]);
  const [candidateFiles, setCandidateFiles] = useState<CandidateFiles>({});

    // Function to accept a candidate's job application
    const handleAccept = (id: number) => {
        const token = localStorage.getItem("token");
            // Update status locally
            const updatedJobs = candidateJobsData.map(job => {
                if (job.id === id) {
                    return { ...job, status: "accept" };
                }
                return job;
            });
            setCandidateJobsData(updatedJobs);

            try {
            const respense= axios.put(`${API_URL}/api/v1/jobs/candidate-jobs/status/accept/`+String(id),{}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error accepting the candidate:', error);
        }
    };

    // Function to refuse a candidate's job application
    const handleRefuse = (id: number) => {
        const token = localStorage.getItem("token");
            const updatedJobs = candidateJobsData.map(job => {
                if (job.id === id) {
                    return { ...job, status: "refuse" };
                }
                return job;
            });
            setCandidateJobsData(updatedJobs);

            try {
                const respense = axios.put(`${API_URL}/api/v1/jobs/candidate-jobs/status/refuse/`+String(id),{}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error refusing the candidate:', error);
        }
    };

  
    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = localStorage.getItem("ID");
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API_URL}/api/v1/jobs/candidate-jobs/candidatejobsByCustomer/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCandidateJobsData(response.data);
            } catch (error) {
                console.error('Error fetching candidate jobs data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        candidateJobsData.forEach(cj => {
            fetchFiles(cj.id, token);
        });
    }, [candidateJobsData]);

    const fetchFiles = async (candidateId: number, token: string) => {
        try {
            const candidateJob = candidateJobsData.find(candidate => candidate.id === candidateId);
        if (!candidateJob) {
            throw new Error(`Candidate job with id ${candidateId} not found`);
        }
            const cvName = String(candidateJob.cv);
            const diplomaName = String(candidateJob.diploma);
            const resumeFile = await fetchFile(`${API_URL}/api/v1/jobs/candidate-jobs/cv/${candidateId}`,cvName , token);
            const diplomaFile = await fetchFile(`${API_URL}/api/v1/jobs/candidate-jobs/diploma/${candidateId}`,diplomaName , token);

            setCandidateFiles(prevFiles => ({
                ...prevFiles,
                [candidateId]: {
                    resume: resumeFile,
                    diploma: diplomaFile
                }
            }));
        } catch (error) {
            console.error('Error fetching candidate files:', error);
        }
    };

    const fetchFile = async (url: string, fileName: string, token: string): Promise<File | null> => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob();
            return new File([blob], String(fileName.split('/').pop()), { type: blob.type });
        } catch (error) {
            console.error('Error fetching file:', error);
            return null;
        }
    };

    const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, candidateJobsData }) => {
        if (candidateJobsData.length === 0) {
            return <div>No applies available</div>;
        }
    
        return (
            <>
                {candidateJobsData.map((cj) => (
                    <div key={cj.id} className={className}>
                        <span>candidate: </span>{cj.candidate.firstName} {cj.candidate.lastName}<br></br>
                        <span>Status: </span>{cj.status}
                        <div>
                          <label htmlFor={`cv-${cj.id}`}>CV:</label>
                          <div className="files">
                            {candidateFiles[cj.id]?.resume && (
                                <a
                                href={URL.createObjectURL(candidateFiles[cj.id]?.resume as Blob)}
                                download={candidateFiles[cj.id]?.resume?.name || 'defaultCV.pdf'}
                            >
                                Download CV
                            </a>
                            
                            )}
                        </div>
                        </div>
                    <div>
                        <label>Diploma:</label>
                        <div className="files">
                            {candidateFiles[cj.id]?.diploma && (
                                <a
                                    href={URL.createObjectURL(candidateFiles[cj.id]?.diploma as Blob)}
                                    download={candidateFiles[cj.id]?.diploma?.name || 'diploma.pdf'}
                                >
                                    Download Diploma
                                </a>
                            )}
                        </div>
                    </div>
                    {cj.status !== "accept" && <button onClick={() => handleAccept(cj.id)}>Accept</button>}
                    {cj.status !== "refuse" && <button onClick={() => handleRefuse(cj.id)}>Refuse</button>}
                </div>
                ))}
            </>
        );
    };

    return (
        <div className="jobs">
            <h1>Applies</h1>
            <div className='lists'>
                <RepeatClassNTimes className="list" n={candidateJobsData.length} candidateJobsData={candidateJobsData} />
            </div>
        </div>
    );
};

export default Applies;
