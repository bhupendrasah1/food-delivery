import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;