let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;
  return ioInstance;
};

export const getIO = () => ioInstance;