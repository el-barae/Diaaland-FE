'use client'
import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import './Candidates.scss'
import API_URL from "@/config";
import { CustomerContext } from '../../../app/Dashboards/Customer/page';

interface Candidate {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    jobStatus: string;
}

const Candidates = () => {
    const { token, customerId } = useContext(CustomerContext);
    const [candidatesData, setCandidatesData] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Optimized view more handler
    const handleViewMore = useCallback((id: number) => {
        localStorage.setItem('IDSelected', String(id));
        router.push("../View/Candidate");
    }, [router]);

    // Fetch candidates only once
    useEffect(() => {
        if (!token || !customerId || candidatesData.length > 0) return;

        const fetchCandidates = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `${API_URL}/api/v1/jobs/candidate-jobs/byCustomer/${customerId}`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                
                setCandidatesData(response.data || []);
            } catch (error) {
                console.error('Error fetching candidates:', error);
                setError('Failed to load candidates');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCandidates();
    }, [token, customerId]); // Removed candidatesData from dependencies

    // Loading state
    if (isLoading) {
        return (
            <div className="jobs">
                <h1>Latest candidates</h1>
                <div className='loading-state'>Loading candidates...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="jobs">
                <h1>Latest candidates</h1>
                <div className='error-state'>{error}</div>
            </div>
        );
    }

    // Empty state
    if (candidatesData.length === 0) {
        return (
            <div className="jobs">
                <h1>Latest candidates</h1>
                <div className='empty-state'>No candidates found</div>
            </div>
        );
    }

    return (
        <div className="jobs">
            <h1>Latest candidates</h1>
            <div className='lists'>
                {candidatesData.map((candidate) => (
                    <div key={candidate.id} className="list">
                        <h1>{candidate.firstName} {candidate.lastName}</h1>
                        <span>Email: </span>{candidate.email}
                        <p><span>Job status: </span>{candidate.jobStatus}</p>
                        <button onClick={() => handleViewMore(candidate.id)}>More</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Candidates;