import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API_URL from '@/config';

interface MatchingStatus {
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'UNKNOWN';
  matchCount: number;
  timestamp: string;
}

export const useMatchingStatus = (candidateId: number | null) => {
  const [status, setStatus] = useState<MatchingStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const checkStatus = useCallback(async () => {
    if (!candidateId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/v1/jobs/matching/status/${candidateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(response.data);
      
      // Arrêter le polling si le matching est terminé ou a échoué
      if (response.data.status === 'COMPLETED' || response.data.status === 'FAILED') {
        setIsPolling(false);
      }
    } catch (error) {
      console.error('Error checking matching status:', error);
    }
  }, [candidateId]);

  useEffect(() => {
    if (!isPolling || !candidateId) return;

    // Vérifier le statut immédiatement
    checkStatus();

    // Puis vérifier toutes les 3 secondes
    const interval = setInterval(checkStatus, 3000);

    return () => clearInterval(interval);
  }, [isPolling, candidateId, checkStatus]);

  const startPolling = () => setIsPolling(true);
  const stopPolling = () => setIsPolling(false);

  return { status, isPolling, startPolling, stopPolling, checkStatus };
};
