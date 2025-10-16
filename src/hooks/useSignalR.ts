import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import type { JobStatus } from '../types';

const getHubUrl = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const baseUrl = apiBaseUrl.replace(/\/api$/, '');
  return `${baseUrl}/hubs/todo-progress`;
};

interface UseSignalRResult {
  connection: signalR.HubConnection | null;
  jobStatus: JobStatus | null;
  error: string | null;
}

export function useSignalR(jobId: string | null): UseSignalRResult {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) {
      setConnection(null);
      setJobStatus(null);
      setError(null);
      return;
    }

    const hubUrl = getHubUrl();
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    const startConnection = async () => {
      try {
        await newConnection.start();

        // Join the job group
        await newConnection.invoke('JoinJobGroup', jobId);

        // Listen for job status updates
        newConnection.on('JobStatusUpdate', (status: JobStatus) => {
          setJobStatus(status);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'SignalR connection failed');
      }
    };

    startConnection();

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [jobId]);

  return { connection, jobStatus, error };
}
