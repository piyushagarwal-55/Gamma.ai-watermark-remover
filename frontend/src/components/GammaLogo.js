import React from 'react';
import { motion } from 'framer-motion';

const GammaLogo = () => {
  return (
    <motion.div
      className="gamma-logo"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <svg 
        width="200" 
        height="40" 
        viewBox="0 0 1111 192" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 10px rgba(123, 104, 238, 0.3))' }}
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#7b68ee', stopOpacity: 1}} />
            <stop offset="50%" style={{stopColor: '#9370db', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#6a5acd', stopOpacity: 1}} />
          </linearGradient>
        </defs>
        <motion.path 
          fill="url(#logoGradient)" 
          d="M47.2,14.4c-14.4,8.2-26,19.6-34.4,33.6C4.3,62.1,0,77.7,0,94.3s4.3,32.2,12.7,46.3c8.5,14.1,20,25.4,34.4,33.6,14.4,8.2,30.4,12.4,47.7,12.4h69.8v-112.5h-81v39.1h38.2v31.8h-25.6c-9.1,0-17.6-2.3-25.2-6.9-7.6-4.6-13.8-10.8-18.3-18.4-4.5-7.7-6.7-16.2-6.7-25.3s2.3-17.7,6.7-25.3c4.5-7.7,10.6-13.9,18.3-18.4,7.6-4.6,16.1-6.9,25.2-6.9h68.5V2h-69.8c-17.3,0-33.3,4.2-47.7,12.4h0Z"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path 
          fill="url(#logoGradient)" 
          d="M267.6.2c-42.7,0-77.4,34.8-77.4,77.6v108.8h42v-54.6h70.8v54.6h42v-108.8c0-42.8-34.7-77.6-77.4-77.6ZM303,93h-70.8v-15.3c0-19.6,15.9-35.5,35.4-35.5s35.4,15.9,35.4,35.5v15.3Z"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.path 
          fill="url(#logoGradient)" 
          d="M576.4,0c-32.1,0-58.2,26.2-58.2,58.4v74.2c0,8.7-7,15.7-15.7,15.7s-15.7-7-15.7-15.7V58.5c0-32.2-26.1-58.4-58.2-58.4s-58.2,26.2-58.2,58.4v128.2h42.6V58.5c0-8.7,7-15.7,15.7-15.7s15.7,7,15.7,15.7v74.1c0,32.2,26.1,58.4,58.2,58.4s58.2-26.2,58.2-58.4V58.4c0-8.7,7-15.7,15.7-15.7s15.7,7,15.7,15.7v128.3h42.6V58.4c0-32.2-26.1-58.4-58.2-58.4h0Z"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
        />
        <motion.path 
          fill="url(#logoGradient)" 
          d="M1033.1.3c-42.7,0-77.4,34.8-77.4,77.6v108.8h42v-54.6h70.8v54.6h42v-108.8c0-42.8-34.7-77.6-77.4-77.6ZM1068.5,93.2h-70.8v-15.3c0-19.6,15.9-35.5,35.4-35.5s35.4,15.9,35.4,35.5v15.3Z"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.6 }}
        />
        <motion.path 
          fill="url(#logoGradient)" 
          d="M872,0c-32.1,0-58.2,26.2-58.2,58.4v74.2c0,8.7-7,15.7-15.7,15.7s-15.7-7-15.7-15.7V58.4c0-32.2-26.1-58.4-58.2-58.4s-58.2,26.2-58.2,58.4v128.3h42.6V58.4c0-8.7,7-15.7,15.7-15.7s15.7,7,15.7,15.7v74.2c0,32.2,26.1,58.4,58.2,58.4s58.2-26.2,58.2-58.4V58.4c0-8.7,7-15.7,15.7-15.7s15.7,7,15.7,15.7v128.3h42.6V58.4c0-32.2-26.1-58.4-58.2-58.4Z"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
        />
      </svg>
    </motion.div>
  );
};

export default GammaLogo;