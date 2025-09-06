import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './ExportOptions.css';

const ExportOptions = ({ resumeData, template }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleDownloadPDF = async () => {
    try {
      setIsExporting(true);
      setExportProgress(10);
      
      // Get the actual resume template wrapper (not the entire preview)
      const resumeElement = document.querySelector('.resume-template-wrapper');
      if (!resumeElement) {
        throw new Error('Resume template not found');
      }
      
      setExportProgress(30);
      
      // Use html2canvas to convert only the resume content to an image
      const canvas = await html2canvas(resumeElement, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: resumeElement.scrollWidth,
        height: resumeElement.scrollHeight
      });
      
      setExportProgress(60);
      
      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate dimensions to fit A4
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const canvasAspectRatio = canvas.height / canvas.width;
      const pdfAspectRatio = pdfHeight / pdfWidth;
      
      let finalWidth, finalHeight;
      
      if (canvasAspectRatio > pdfAspectRatio) {
        // Canvas is taller, fit to height
        finalHeight = pdfHeight;
        finalWidth = pdfHeight / canvasAspectRatio;
      } else {
        // Canvas is wider, fit to width
        finalWidth = pdfWidth;
        finalHeight = pdfWidth * canvasAspectRatio;
      }
      
      // Center the image on the page
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = (pdfHeight - finalHeight) / 2;
      
      // Add the image to the PDF
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        xOffset,
        yOffset,
        finalWidth,
        finalHeight
      );
      
      setExportProgress(90);
      
      // Generate filename with template and date
      const date = new Date().toLocaleDateString().replace(/\//g, '-');
      const filename = `${resumeData.personal.firstName || 'Resume'}_${resumeData.personal.lastName || ''}_${template}_${date}.pdf`;
      
      // Download the PDF
      pdf.save(filename);
      
      setExportProgress(100);
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating your PDF. Please try again.');
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleCloudSave = () => {
    // In a real app, this would save to the cloud
    console.log('Saving to cloud for template:', template, 'with data:', resumeData);
    alert('Resume saved to cloud (simulated)');
  };

  const handlePrint = () => {
    // Open print dialog for the resume
    const resumeElement = document.querySelector('.resume-template-wrapper');
    if (resumeElement) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Resume - ${resumeData.personal.firstName} ${resumeData.personal.lastName}</title>
            <style>
              body { margin: 0; padding: 0; }
              @media print {
                body { margin: 0; }
                * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
              }
            </style>
          </head>
          <body>
            ${resumeElement.outerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="export-options">
      <div className="export-header">
        <h3>Export & Share</h3>
        <p>Download your professional resume</p>
      </div>
      
      {isExporting && (
        <div className="export-progress-container">
          <div className="export-progress-bar">
            <div 
              className="export-progress-fill" 
              style={{ width: `${exportProgress}%` }}
            ></div>
          </div>
          <span className="export-progress-text">Generating PDF... {exportProgress}%</span>
        </div>
      )}
      
      <div className="export-buttons">
        <button 
          className={`export-button pdf ${isExporting ? 'disabled' : ''}`}
          onClick={handleDownloadPDF}
          disabled={isExporting}
        >
          <div className="button-icon">📄</div>
          <div className="button-content">
            <span className="button-title">Download PDF</span>
            <span className="button-subtitle">Best for applications</span>
          </div>
        </button>
        
        <button 
          className={`export-button print ${isExporting ? 'disabled' : ''}`}
          onClick={handlePrint}
          disabled={isExporting}
        >
          <div className="button-icon">🖨️</div>
          <div className="button-content">
            <span className="button-title">Print Resume</span>
            <span className="button-subtitle">Physical copy</span>
          </div>
        </button>
        
        <button 
          className={`export-button cloud ${isExporting ? 'disabled' : ''}`}
          onClick={handleCloudSave}
          disabled={isExporting}
        >
          <div className="button-icon">☁️</div>
          <div className="button-content">
            <span className="button-title">Save to Cloud</span>
            <span className="button-subtitle">Access anywhere</span>
          </div>
        </button>
      </div>
      
      <div className="export-tips">
        <div className="tip-item">
          <span className="tip-icon">💡</span>
          <span>PDF format ensures consistent formatting across all devices</span>
        </div>
        <div className="tip-item">
          <span className="tip-icon">🎯</span>
          <span>ATS-optimized templates improve your chances with applicant tracking systems</span>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;
