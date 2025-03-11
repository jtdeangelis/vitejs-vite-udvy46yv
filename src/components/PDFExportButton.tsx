import React, { useState } from 'react';
import { FileText, Loader } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatCurrency } from '../utils/formatters';

interface PDFExportButtonProps {
  propertyDetails: any;
  fixedRooms: any[];
  bedrooms: any[];
  bathrooms: any[];
  customRooms: any[];
  totalCost: number;
  className?: string;
}

const PDFExportButton: React.FC<PDFExportButtonProps> = ({ 
  propertyDetails, 
  fixedRooms, 
  bedrooms, 
  bathrooms, 
  customRooms,
  totalCost,
  className = '' 
}) => {
  const [exporting, setExporting] = useState(false);

  const generatePDF = async () => {
    setExporting(true);
    
    try {
      // Create the report content
      const container = document.createElement('div');
      container.style.padding = '40px';
      container.style.maxWidth = '800px';
      container.style.margin = '0 auto';
      container.style.fontFamily = 'Arial, sans-serif';
      container.style.background = 'white';

      // Header
      const header = document.createElement('div');
      header.innerHTML = `
        <h1 style="font-size: 24px; margin-bottom: 10px;">Phoenix Rehab Estimation Report</h1>
        <p style="text-align: right; color: #666;">${new Date().toLocaleDateString()}</p>
      `;
      container.appendChild(header);

      // Property Details
      const propertySection = document.createElement('div');
      propertySection.innerHTML = `
        <h2 style="font-size: 20px; margin: 20px 0;">Property Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Address:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${propertyDetails.address || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">City:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${propertyDetails.city || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">State:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${propertyDetails.state || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Square Feet:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${propertyDetails.squareFeet || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Purchase Price:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${formatCurrency(propertyDetails.purchasePrice || 0)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Estimated ARV:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${formatCurrency(propertyDetails.estimatedARV || 0)}</td>
          </tr>
        </table>
      `;
      container.appendChild(propertySection);

      // Rooms Section
      const roomsSection = document.createElement('div');
      roomsSection.innerHTML = `
        <h2 style="font-size: 20px; margin: 20px 0;">Rooms Overview</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Room</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Status</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Cost</th>
            </tr>
          </thead>
          <tbody>
            ${[...fixedRooms, ...bedrooms, ...bathrooms, ...customRooms]
              .map(room => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${room.name}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${room.customized ? 'Customized' : 'Not Customized'}</td>
                  <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(room.cost)}</td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      `;
      container.appendChild(roomsSection);

      // Cost Summary
      const costSection = document.createElement('div');
      costSection.innerHTML = `
        <h2 style="font-size: 20px; margin: 20px 0;">Cost Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Materials Cost (60%):</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(totalCost * 0.6)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Labor Cost (40%):</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(totalCost * 0.4)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Overhead (15%):</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(totalCost * 0.15)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Contingency (10%):</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(totalCost * 0.10)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Profit Margin (20%):</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(totalCost * 0.20)}</td>
          </tr>
          <tr style="font-weight: bold; background-color: #f8f9fa;">
            <td style="padding: 8px; border: 1px solid #ddd;">Total Project Cost:</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(totalCost)}</td>
          </tr>
        </table>
      `;
      container.appendChild(costSection);

      // Add container to document temporarily
      document.body.appendChild(container);

      // Generate PDF
      const canvas = await html2canvas(container, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      // Remove the temporary container
      document.body.removeChild(container);

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      // Save the PDF
      const fileName = `phoenix-rehab-estimate-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={exporting}
      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed ${className}`}
    >
      {exporting ? (
        <>
          <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
          Generating PDF...
        </>
      ) : (
        <>
          <FileText className="-ml-1 mr-2 h-5 w-5" />
          Export PDF
        </>
      )}
    </button>
  );
};

export default PDFExportButton;