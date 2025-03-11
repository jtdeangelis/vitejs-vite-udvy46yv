import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PropertyDetails, Room, IndividualRoom } from '../types';
import { formatCurrency } from './formatters';

interface PDFExporterOptions {
  propertyDetails: PropertyDetails;
  fixedRooms: Room[];
  bedrooms: IndividualRoom[];
  bathrooms: IndividualRoom[];
  customRooms: Room[];
  totalCost: number;
  timeline: any[];
}

export class PDFExporter {
  private options: PDFExporterOptions;
  private pdf: jsPDF;

  constructor(options: PDFExporterOptions) {
    this.options = options;
    this.pdf = new jsPDF('p', 'mm', 'a4');
  }

  private async generatePDFFromHTML(element: HTMLElement): Promise<void> {
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdfWidth = this.pdf.internal.pageSize.getWidth();
    const pdfHeight = this.pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;

    this.pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
  }

  private createReportHTML(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'pdf-container';
    container.style.padding = '40px';
    container.style.maxWidth = '800px';
    container.style.margin = '0 auto';
    container.style.fontFamily = 'Arial, sans-serif';

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
          <td style="padding: 8px; border: 1px solid #ddd;">${this.options.propertyDetails.address || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">City:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${this.options.propertyDetails.city || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">State:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${this.options.propertyDetails.state || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Square Feet:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${this.options.propertyDetails.squareFeet || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Purchase Price:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formatCurrency(this.options.propertyDetails.purchasePrice || 0)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Estimated ARV:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formatCurrency(this.options.propertyDetails.estimatedARV || 0)}</td>
        </tr>
      </table>
    `;
    container.appendChild(propertySection);

    // Rooms Section
    const roomsSection = document.createElement('div');
    roomsSection.innerHTML = `
      <h2 style="font-size: 20px; margin: 20px 0;">Rooms Overview</h2>
      ${this.generateRoomsTable()}
    `;
    container.appendChild(roomsSection);

    // Cost Summary
    const costSection = document.createElement('div');
    costSection.innerHTML = this.generateCostSummary();
    container.appendChild(costSection);

    return container;
  }

  private generateRoomsTable(): string {
    const tableStyle = 'width: 100%; border-collapse: collapse; margin-bottom: 20px;';
    const thStyle = 'padding: 8px; border: 1px solid #ddd; background-color: #f8f9fa; text-align: left;';
    const tdStyle = 'padding: 8px; border: 1px solid #ddd;';

    const generateRoomRows = (rooms: Room[] | IndividualRoom[], type: string) => {
      return rooms.map(room => `
        <tr>
          <td style="${tdStyle}">${room.name}</td>
          <td style="${tdStyle}">${room.customized ? 'Customized' : 'Not Customized'}</td>
          <td style="${tdStyle}">${formatCurrency(room.cost)}</td>
        </tr>
      `).join('');
    };

    return `
      <table style="${tableStyle}">
        <thead>
          <tr>
            <th style="${thStyle}">Room</th>
            <th style="${thStyle}">Status</th>
            <th style="${thStyle}">Cost</th>
          </tr>
        </thead>
        <tbody>
          ${generateRoomRows(this.options.fixedRooms, 'Fixed')}
          ${generateRoomRows(this.options.bedrooms, 'Bedroom')}
          ${generateRoomRows(this.options.bathrooms, 'Bathroom')}
          ${generateRoomRows(this.options.customRooms, 'Custom')}
        </tbody>
      </table>
    `;
  }

  private generateCostSummary(): string {
    const totalCost = this.options.totalCost;
    const materialsCost = totalCost * 0.6;
    const laborCost = totalCost * 0.4;
    const overhead = totalCost * 0.15;
    const contingency = totalCost * 0.10;
    const profitMargin = totalCost * 0.20;

    return `
      <h2 style="font-size: 20px; margin: 20px 0;">Cost Summary</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Materials Cost:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formatCurrency(materialsCost)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Labor Cost:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formatCurrency(laborCost)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Overhead (15%):</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formatCurrency(overhead)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Contingency (10%):</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formatCurrency(contingency)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Profit Margin (20%):</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formatCurrency(profitMargin)}</td>
        </tr>
        <tr style="font-weight: bold; background-color: #f8f9fa;">
          <td style="padding: 8px; border: 1px solid #ddd;">Total Project Cost:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formatCurrency(totalCost)}</td>
        </tr>
      </table>
    `;
  }

  public async generateAndDownload(): Promise<void> {
    try {
      const element = this.createReportHTML();
      document.body.appendChild(element);
      
      await this.generatePDFFromHTML(element);
      
      document.body.removeChild(element);
      
      const fileName = `phoenix-rehab-estimate-${new Date().toISOString().split('T')[0]}.pdf`;
      this.pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }
}