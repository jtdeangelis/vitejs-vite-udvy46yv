import React, { useState } from 'react';
import { File as FilePdf } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface GeneratePDFButtonProps {
  contentRef: React.RefObject<HTMLDivElement>;
  fileName?: string;
}

const GeneratePDFButton: React.FC<GeneratePDFButtonProps> = ({ 
  contentRef, 
  fileName = 'renovation-estimate' 
}) => {
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    if (!contentRef.current) return;
    
    setLoading(true);
    
    try {
      const content = contentRef.current;
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Store original display and visibility styles of all elements
      const elementsToHide = content.querySelectorAll('.hide-in-pdf');
      const originalDisplays: { [key: string]: string } = {};
      
      // Hide elements with class 'hide-in-pdf'
      elementsToHide.forEach((el, i) => {
        const htmlEl = el as HTMLElement;
        originalDisplays[i] = htmlEl.style.display;
        htmlEl.style.display = 'none';
      });
      
      // Show all sections for PDF generation
      const sections = content.querySelectorAll('.section-content');
      const sectionStates: { [key: string]: boolean } = {};
      sections.forEach((section, i) => {
        const htmlSection = section as HTMLElement;
        sectionStates[i] = htmlSection.style.display === 'none';
        htmlSection.style.display = 'block';
      });
      
      // Dimensions
      const scale = 1.5; // Increase scale for better quality
      const width = content.offsetWidth * scale;
      const height = content.offsetHeight * scale;
      
      // Create canvas with increased scale
      const canvas = await html2canvas(content, {
        scale: scale,
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: width,
        windowHeight: height,
      });
      
      // Get the PDF dimensions
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate aspect ratio to fit the content in the PDF
      const contentAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;
      
      let imgWidth = pdfWidth;
      let imgHeight = imgWidth / contentAspectRatio;
      let currentY = 0;
      
      // If content is taller than a single page, we need to split it
      while (currentY < canvas.height) {
        // For pages after the first page
        if (currentY > 0) {
          pdf.addPage();
        }
        
        // Calculate the portion of the canvas to add to the current page
        const remainingHeight = canvas.height - currentY;
        const pageContentHeight = Math.min(canvas.width / pdfAspectRatio, remainingHeight);
        
        // Add the image to the PDF
        pdf.addImage(
          imgData,
          'JPEG',
          0,
          0,
          pdfWidth,
          (pageContentHeight * pdfWidth) / canvas.width,
          '',
          'FAST',
          0,
          currentY / canvas.height * canvas.width / pdfAspectRatio
        );
        
        // Move to the next portion of the canvas
        currentY += pageContentHeight;
      }
      
      // Restore original display and visibility styles
      elementsToHide.forEach((el, i) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.display = originalDisplays[i] || '';
      });
      
      // Restore section states
      sections.forEach((section, i) => {
        if (sectionStates[i]) {
          (section as HTMLElement).style.display = 'none';
        }
      });
      
      // Save the PDF
      pdf.save(`${fileName}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={loading}
      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
      }`}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Generating...
        </>
      ) : (
        <>
          <FilePdf className="mr-2 h-4 w-4" />
          Export PDF
        </>
      )}
    </button>
  );
};

export default GeneratePDFButton;