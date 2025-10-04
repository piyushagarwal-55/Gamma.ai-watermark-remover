import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Upload, 
  FileText, 
  Zap, 
  Download, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Sparkles,
  Shield,
  Target
} from 'lucide-react';
import GammaLogo from './GammaLogo';
import './WatermarkRemover.css';

const WatermarkRemover = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setResult(null);
        toast.success('PDF file selected successfully!');
      } else {
        toast.error('Please select a PDF file');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const handleRemoveWatermark = async () => {
    if (!file) {
      toast.error('Please select a PDF file first');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setResult(null);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('pdf_file', file);

      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await axios.post(`${API_URL}/api/remove-watermark`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.data.success) {
        setResult(response.data);
        if (response.data.details.total_removed > 0) {
          toast.success(`Successfully removed ${response.data.details.total_removed} watermark elements!`);
        } else {
          toast.success('No watermarks found to remove');
        }
      }
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      console.error('Error:', error);
      const errorMessage = error.response?.data?.detail || 'An error occurred while processing the file';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.download_url) return;

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await axios.get(`${API_URL}${result.download_url}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', result.details.output_filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('File downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  return (
    <div className="watermark-remover">
      <motion.div 
        className="container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GammaLogo />
          <h1>AI Watermark Remover</h1>
          <p>Remove watermarks from your PDF files with AI precision</p>
        </motion.div>

        <motion.div 
          className="features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="feature">
            <Shield className="feature-icon" />
            <span>Secure Processing</span>
          </div>
          <div className="feature">
            <Target className="feature-icon" />
            <span>AI Precision</span>
          </div>
          <div className="feature">
            <Sparkles className="feature-icon" />
            <span>High Quality</span>
          </div>
        </motion.div>

        <motion.div
          className={`upload-area ${isDragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
          {...getRootProps()}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input {...getInputProps()} />
          
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="upload"
                className="upload-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Upload className="upload-icon" />
                <h3>
                  {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF file'}
                </h3>
                <p>or click to select a file</p>
                <div className="upload-note">
                  Only PDF files are supported
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="file"
                className="file-info"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <FileText className="file-icon" />
                <div className="file-details">
                  <h4>{file.name}</h4>
                  <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <CheckCircle className="check-icon" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.button
          className={`process-btn ${!file || isProcessing ? 'disabled' : ''}`}
          onClick={handleRemoveWatermark}
          disabled={!file || isProcessing}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={!isProcessing && file ? { scale: 1.05 } : {}}
          whileTap={!isProcessing && file ? { scale: 0.95 } : {}}
        >
          {isProcessing ? (
            <>
              <Loader2 className="btn-icon spinning" />
              Processing... {Math.round(progress)}%
            </>
          ) : (
            <>
              <Zap className="btn-icon" />
              Remove Watermarks
            </>
          )}
        </motion.button>

       
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              className="progress-container"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && !isProcessing && (
            <motion.div
              className="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`result-card ${result.details.total_removed > 0 ? 'success' : 'info'}`}>
                <div className="result-header">
                  {result.details.total_removed > 0 ? (
                    <CheckCircle className="result-icon success" />
                  ) : (
                    <XCircle className="result-icon info" />
                  )}
                  <h3>{result.message}</h3>
                </div>
                
                {result.details.total_removed > 0 && (
                  <div className="result-stats">
                    <div className="stat">
                      <span className="stat-value">{result.details.total_removed}</span>
                      <span className="stat-label">Total Removed</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{result.details.images_removed}</span>
                      <span className="stat-label">Images</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{result.details.links_removed}</span>
                      <span className="stat-label">Links</span>
                    </div>
                  </div>
                )}

                {result.download_url && (
                  <motion.button
                    className="download-btn"
                    onClick={handleDownload}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="btn-icon" />
                    Download Cleaned PDF
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default WatermarkRemover;