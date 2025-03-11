import React, { useState } from 'react';
import { Download, FileText, Loader } from 'lucide-react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Room, IndividualRoom, PropertyDetails } from '../types';
import { formatCurrency } from '../utils/formatters';

// Initialize pdfmake with fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface PDFExporterProps {
  propertyDetails: PropertyDetails;
  fixedRooms: Room[];
  bedrooms: IndividualRoom[];
  bathrooms: IndividualRoom[];
  customRooms: Room[];
  totalCost: number;
  timeline: any[];
}

const PDFExporter: React.FC<PDFExporterProps> = ({
  propertyDetails,
  fixedRooms,
  bedrooms,
  bathrooms,
  customRooms,
  totalCost,
  timeline
}) => {
  const [exporting, setExporting] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'property',
    'rooms',
    'timeline',
    'costs'
  ]);

  const generatePropertySection = () => {
    return [
      { text: 'Property Details', style: 'sectionHeader' },
      {
        table: {
          widths: ['*', '*'],
          body: [
            ['Address:', propertyDetails.address],
            ['City:', propertyDetails.city],
            ['State:', propertyDetails.state],
            ['Zip Code:', propertyDetails.zipCode],
            ['Square Feet:', propertyDetails.squareFeet?.toString() || 'N/A'],
            ['Year Built:', propertyDetails.yearBuilt?.toString() || 'N/A'],
            ['Purchase Price:', formatCurrency(propertyDetails.purchasePrice || 0)],
            ['Estimated ARV:', formatCurrency(propertyDetails.estimatedARV || 0)]
          ]
        },
        layout: 'lightHorizontalLines'
      },
      { text: '', margin: [0, 10, 0, 10] }
    ];
  };

  const generateRoomsSection = () => {
    const roomsContent = [];

    // Fixed Rooms
    roomsContent.push(
      { text: 'Common Areas', style: 'subsectionHeader' },
      {
        table: {
          widths: ['*', 'auto', 'auto'],
          body: [
            [
              { text: 'Room', style: 'tableHeader' },
              { text: 'Status', style: 'tableHeader' },
              { text: 'Cost', style: 'tableHeader' }
            ],
            ...fixedRooms.map(room => [
              room.name,
              room.customized ? 'Customized' : 'Not Customized',
              formatCurrency(room.cost)
            ])
          ]
        },
        layout: 'lightHorizontalLines'
      },
      { text: '', margin: [0, 10, 0, 10] }
    );

    // Bedrooms
    roomsContent.push(
      { text: 'Bedrooms', style: 'subsectionHeader' },
      {
        table: {
          widths: ['*', 'auto', 'auto'],
          body: [
            [
              { text: 'Room', style: 'tableHeader' },
              { text: 'Status', style: 'tableHeader' },
              { text: 'Cost', style: 'tableHeader' }
            ],
            ...bedrooms.map(room => [
              room.name,
              room.customized ? 'Customized' : 'Not Customized',
              formatCurrency(room.cost)
            ])
          ]
        },
        layout: 'lightHorizontalLines'
      },
      { text: '', margin: [0, 10, 0, 10] }
    );

    // Bathrooms
    roomsContent.push(
      { text: 'Bathrooms', style: 'subsectionHeader' },
      {
        table: {
          widths: ['*', 'auto', 'auto'],
          body: [
            [
              { text: 'Room', style: 'tableHeader' },
              { text: 'Status', style: 'tableHeader' },
              { text: 'Cost', style: 'tableHeader' }
            ],
            ...bathrooms.map(room => [
              room.name,
              room.customized ? 'Customized' : 'Not Customized',
              formatCurrency(room.cost)
            ])
          ]
        },
        layout: 'lightHorizontalLines'
      }
    );

    // Custom Rooms
    if (customRooms.length > 0) {
      roomsContent.push(
        { text: 'Custom Rooms', style: 'subsectionHeader', pageBreak: 'before' },
        {
          table: {
            widths: ['*', 'auto', 'auto'],
            body: [
              [
                { text: 'Room', style: 'tableHeader' },
                { text: 'Status', style: 'tableHeader' },
                { text: 'Cost', style: 'tableHeader' }
              ],
              ...customRooms.map(room => [
                room.name,
                room.customized ? 'Customized' : 'Not Customized',
                formatCurrency(room.cost)
              ])
            ]
          },
          layout: 'lightHorizontalLines'
        }
      );
    }

    return [
      { text: 'Rooms Overview', style: 'sectionHeader' },
      ...roomsContent
    ];
  };

  const generateTimelineSection = () => {
    return [
      { text: 'Project Timeline', style: 'sectionHeader', pageBreak: 'before' },
      {
        table: {
          widths: ['*', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'Task', style: 'tableHeader' },
              { text: 'Duration', style: 'tableHeader' },
              { text: 'Start Date', style: 'tableHeader' },
              { text: 'End Date', style: 'tableHeader' }
            ],
            ...timeline.map(item => [
              item.name,
              `${item.duration} days`,
              item.startDate?.toLocaleDateString() || 'TBD',
              item.endDate?.toLocaleDateString() || 'TBD'
            ])
          ]
        },
        layout: 'lightHorizontalLines'
      }
    ];
  };

  const generateCostsSection = () => {
    return [
      { text: 'Cost Summary', style: 'sectionHeader', pageBreak: 'before' },
      {
        table: {
          widths: ['*', 'auto'],
          body: [
            ['Total Project Cost:', formatCurrency(totalCost)],
            ['Materials Cost:', formatCurrency(totalCost * 0.6)],
            ['Labor Cost:', formatCurrency(totalCost * 0.4)],
            ['Overhead (15%):', formatCurrency(totalCost * 0.15)],
            ['Contingency (10%):', formatCurrency(totalCost * 0.10)],
            ['Profit Margin (20%):', formatCurrency(totalCost * 0.20)]
          ]
        },
        layout: 'lightHorizontalLines'
      }
    ];
  };

  const handleExport = async () => {
    setExporting(true);

    try {
      const docDefinition = {
        content: [
          {
            text: 'Phoenix Rehab Estimation Report',
            style: 'header'
          },
          {
            text: new Date().toLocaleDateString(),
            alignment: 'right',
            margin: [0, 0, 0, 20]
          },
          ...(selectedSections.includes('property') ? generatePropertySection() : []),
          ...(selectedSections.includes('rooms') ? generateRoomsSection() : []),
          ...(selectedSections.includes('timeline') ? generateTimelineSection() : []),
          ...(selectedSections.includes('costs') ? generateCostsSection() : [])
        ],
        styles: {
          header: {
            fontSize: 24,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          sectionHeader: {
            fontSize: 18,
            bold: true,
            margin: [0, 20, 0, 10]
          },
          subsectionHeader: {
            fontSize: 14,
            bold: true,
            margin: [0, 15, 0, 5]
          },
          tableHeader: {
            bold: true,
            fillColor: '#f3f4f6'
          }
        },
        defaultStyle: {
          fontSize: 10
        },
        pageSize: 'LETTER',
        pageMargins: [40, 40, 40, 40]
      };

      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.download(`phoenix-rehab-estimate-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const toggleSection = (section: string) => {
    setSelectedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Export Options</h3>
        <button
          onClick={handleExport}
          disabled={exporting || selectedSections.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <>
              <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="-ml-1 mr-2 h-5 w-5" />
              Export PDF
            </>
          )}
        </button>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Select sections to include:</h4>
        <div className="space-y-2">
          {[
            { id: 'property', label: 'Property Details' },
            { id: 'rooms', label: 'Rooms Overview' },
            { id: 'timeline', label: 'Project Timeline' },
            { id: 'costs', label: 'Cost Summary' }
          ].map(section => (
            <label key={section.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedSections.includes(section.id)}
                onChange={() => toggleSection(section.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{section.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex">
          <FileText className="h-5 w-5 text-blue-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Export Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>The PDF will include:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Detailed cost breakdowns for each selected section</li>
                <li>High-quality tables and formatting</li>
                <li>Project timeline and schedule</li>
                <li>Material and labor cost estimates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFExporter;