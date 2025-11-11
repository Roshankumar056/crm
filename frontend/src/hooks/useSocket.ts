import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addLead, updateLeadInList } from '@/store/slices/leadsSlice';
import { addActivity } from '@/store/slices/activitiesSlice';
import { toast } from 'sonner';

export const useSocket = () => {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080', {
      auth: { token },
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
    });

    socketRef.current.on('lead:new', (lead) => {
      dispatch(addLead(lead));
      toast.info('New lead created');
    });

    socketRef.current.on('lead:assigned', (lead) => {
      dispatch(updateLeadInList(lead));
      toast.info('Lead assignment updated');
    });

    socketRef.current.on('lead:updated', (lead) => {
      dispatch(updateLeadInList(lead));
      toast.info('Lead status updated');
    });

    socketRef.current.on('activity:new', (activity) => {
      dispatch(addActivity(activity));
      toast.info('New activity added');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [dispatch]);

  return socketRef.current;
};
