import React from 'react';
import { useMatchingStatus } from '@/hooks/useMatchingStatus';
import './MatchingStatusBanner.scss';

interface MatchingStatusBannerProps {
  candidateId: number | null;
  onMatchingComplete?: () => void;
}

export const MatchingStatusBanner: React.FC<MatchingStatusBannerProps> = ({ 
  candidateId, 
  onMatchingComplete 
}) => {
  const { status, isPolling, startPolling } = useMatchingStatus(candidateId);

  React.useEffect(() => {
    if (candidateId) {
      startPolling();
    }
  }, [candidateId, startPolling]);

  React.useEffect(() => {
    if (status?.status === 'COMPLETED' && onMatchingComplete) {
      onMatchingComplete();
    }
  }, [status, onMatchingComplete]);

  if (!status || status.status === 'UNKNOWN') {
    return null;
  }

  const getStatusConfig = () => {
    switch (status.status) {
      case 'PENDING':
        return {
          className: 'status-pending',
          icon: '⏳',
          message: 'Matching request queued...'
        };
      case 'PROCESSING':
        return {
          className: 'status-processing',
          icon: '⚙️',
          message: 'Analyzing your profile...'
        };
      case 'COMPLETED':
        return {
          className: 'status-completed',
          icon: '✅',
          message: `Matching complete! Found ${status.matchCount} matches`
        };
      case 'FAILED':
        return {
          className: 'status-failed',
          icon: '❌',
          message: 'Matching failed. Please try again.'
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <div className={`matching-status-banner ${config.className}`}>
      <span className="status-icon">{config.icon}</span>
      <span className="status-message">{config.message}</span>
      {isPolling && status.status !== 'COMPLETED' && status.status !== 'FAILED' && (
        <span className="spinner"></span>
      )}
    </div>
  );
};