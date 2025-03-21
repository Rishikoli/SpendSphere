'use client';

import { useState, useRef, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import { FaUpload, FaCamera, FaRegTimesCircle, FaSave } from 'react-icons/fa';

interface ExtractedExpense {
  amount: string;
  date: string;
  merchant: string;
  category?: string;
}

export default function BillScanner() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedExpense | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const preprocessImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas size to match image
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image onto canvas
          ctx?.drawImage(img, 0, 0);
          
          // Get data URL
          const dataUrl = canvas.toDataURL('image/jpeg');
          resolve(dataUrl);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const extractExpenseData = (text: string): ExtractedExpense => {
    // Regular expressions for matching common patterns in bills
    const amountRegex = /(?:total|amount|\$|₹)[\s]*([\d,.]+)/i;
    const dateRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/;
    const merchantRegex = /(?:merchant|store|market|shop|restaurant):[\s]*([^\n]+)/i;

    // Extract data using regex
    const amountMatch = text.match(amountRegex);
    const dateMatch = text.match(dateRegex);
    const merchantMatch = text.match(merchantRegex);

    return {
      amount: amountMatch ? amountMatch[1] : '',
      date: dateMatch ? dateMatch[1] : '',
      merchant: merchantMatch ? merchantMatch[1].trim() : '',
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setError('');

      // Preprocess the image
      const processedImage = await preprocessImage(file);

      // Initialize Tesseract worker
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      // Perform OCR
      const { data: { text } } = await worker.recognize(processedImage);
      
      // Extract expense data
      const expense = extractExpenseData(text);
      setExtractedData(expense);

      // Terminate worker
      await worker.terminate();
    } catch (err) {
      setError('Error processing image. Please try again.');
      console.error('OCR Error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (err) {
      setError('Error accessing camera. Please try again.');
      console.error('Camera Error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOpen(false);
    }
  };

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
          try {
            setIsProcessing(true);
            setError('');

            // Process captured image
            const processedImage = await preprocessImage(file);
            const worker = await createWorker();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data: { text } } = await worker.recognize(processedImage);
            const expense = extractExpenseData(text);
            setExtractedData(expense);
            await worker.terminate();

            // Close camera after successful capture
            stopCamera();
          } catch (err) {
            setError('Error processing captured image. Please try again.');
            console.error('Capture Error:', err);
          } finally {
            setIsProcessing(false);
          }
        }
      }, 'image/jpeg');
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="bg-dark-card rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-dark-text mb-6">Scan Bill</h2>
      
      {/* Upload Section */}
      <div className="mb-6 flex gap-4">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-primary-blue hover:bg-primary-blue/80 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          disabled={isProcessing || isCameraOpen}
        >
          <FaUpload />
          {isProcessing ? 'Processing...' : 'Upload Bill'}
        </button>
        <button
          onClick={isCameraOpen ? stopCamera : startCamera}
          className="bg-primary-green hover:bg-primary-green/80 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          disabled={isProcessing}
        >
          {isCameraOpen ? <FaRegTimesCircle /> : <FaCamera />}
          {isCameraOpen ? 'Close Camera' : 'Open Camera'}
        </button>
      </div>

      {/* Camera Section */}
      {isCameraOpen && (
        <div className="mb-6 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
          <canvas ref={canvasRef} className="hidden" />
          <button
            onClick={captureImage}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary-blue hover:bg-primary-blue/80 text-white px-6 py-3 rounded-full font-medium"
          >
            Capture
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-primary-red mb-4">
          {error}
        </div>
      )}

      {/* Results Section */}
      {extractedData && (
        <div className="bg-dark-background rounded-lg p-4">
          <h3 className="text-xl font-semibold text-dark-text mb-4">Extracted Information</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Amount:</span>
              <span className="text-primary-green font-medium">
                ₹{extractedData.amount}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Date:</span>
              <span className="text-dark-text">{extractedData.date}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Merchant:</span>
              <span className="text-dark-text">{extractedData.merchant}</span>
            </div>
          </div>

          <button
            className="mt-6 w-full bg-primary-green hover:bg-primary-green/80 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
            onClick={() => {
              // Here you can add logic to save the expense
              console.log('Saving expense:', extractedData);
            }}
          >
            <FaSave />
            Save Expense
          </button>
        </div>
      )}
    </div>
  );
}
