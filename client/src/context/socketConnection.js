// import React from 'react';
import { createContext, useEffect } from 'react';
import io from "socket.io-client"; 


export const socket =io.connect(process.env.REACT_APP_BASE_URL_BACKEND);


export const SocketContext = createContext(null);



// export const connectSocket = async () => {
//     return new Promise((resolve, reject) => {
//       const socket = io.connect(process.env.REACT_APP_BASE_URL_BACKEND);
  
//       socket.on('connect', () => {
//         resolve(socket);
//       });
  
//       socket.on('connect_error', (error) => {
//         reject(error);
//       });
//     });
//   };


// import React, { createContext, useEffect, useState } from 'react';
// import io from 'socket.io-client';

// Create a new context
// export const SocketContext = createContext(null);

// Create a socket connection and provide it through the context
// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     // Create the socket connection
//     const newSocket = io.connect(process.env.REACT_APP_BASE_URL_BACKEND); // Replace with your server URL

//     // Set the socket in the state
//     console.log(newSocket,"socket");
//     setSocket(newSocket);

//     // Clean up the socket connection on component unmount
//     return () => newSocket.close();
//   }, []);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };


