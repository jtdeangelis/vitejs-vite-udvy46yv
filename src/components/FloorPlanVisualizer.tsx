import React, { useState, useRef, useEffect } from 'react';
import { Room, IndividualRoom } from '../types';
import { Info, ZoomIn, ZoomOut, Move, Trash, Loader } from 'lucide-react';

interface GridCell {
  id: string;
  roomId: number | null;
  roomName: string | null;
  roomType: string | null;
  color: string;
}

interface FloorPlanVisualizerProps {
  fixedRooms: Room[];
  bedrooms: IndividualRoom[];
  bathrooms: IndividualRoom[];
  customRooms: Room[];
}

const defaultColors: Record<string, string> = {
  'Kitchen': '#FF9F80',
  'Living Room': '#A7C7E7',
  'Family Room': '#9FE2BF',
  'Dining Room': '#FFDF9F',
  'Foyer': '#D5A6BD',
  'Laundry Room': '#C3B1E1',
  'Garage': '#CCCCCC',
  'Exterior': '#B5EAD7',
  'bedroom': '#9ACEEB', // Default color for all bedrooms
  'bathroom': '#FDFD96', // Default color for all bathrooms
  'custom': '#E6E6FA'  // Default color for custom rooms
};

// Helper function to generate a unique ID for the grid cell
const generateCellId = (row: number, col: number) => `cell-${row}-${col}`;

const FloorPlanVisualizer: React.FC<FloorPlanVisualizerProps> = ({
  fixedRooms,
  bedrooms,
  bathrooms,
  customRooms
}) => {
  const [gridSize, setGridSize] = useState({ rows: 12, cols: 12 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [selectedRoom, setSelectedRoom] = useState<{ id: number; name: string; type: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const minZoom = 0.5;
  const maxZoom = 2;

  // Initialize grid with empty cells
  useEffect(() => {
    generateEmptyGrid();
  }, [gridSize]);

  const generateEmptyGrid = () => {
    const newGrid: GridCell[][] = [];
    for (let row = 0; row < gridSize.rows; row++) {
      const gridRow: GridCell[] = [];
      for (let col = 0; col < gridSize.cols; col++) {
        gridRow.push({
          id: generateCellId(row, col),
          roomId: null,
          roomName: null,
          roomType: null,
          color: 'white'
        });
      }
      newGrid.push(gridRow);
    }
    setGrid(newGrid);
  };

  // Auto-generate a basic floor plan based on the rooms in the project
  const generateFloorPlan = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      // Create a new empty grid
      const newGrid: GridCell[][] = [];
      for (let row = 0; row < gridSize.rows; row++) {
        const gridRow: GridCell[] = [];
        for (let col = 0; col < gridSize.cols; col++) {
          gridRow.push({
            id: generateCellId(row, col),
            roomId: null,
            roomName: null,
            roomType: null,
            color: 'white'
          });
        }
        newGrid.push(gridRow);
      }
      
      // Simple floor plan layout logic
      // This is a very basic algorithm that places rooms
      // in a somewhat logical layout

      // Place fixed rooms first
      // Kitchen in the bottom left
      if (fixedRooms.find(r => r.name === 'Kitchen')) {
        placeRoomOnGrid(newGrid, 7, 2, 3, 3, 'Kitchen', fixedRooms.find(r => r.name === 'Kitchen')?.id || 1, 'fixed');
      }
      
      // Dining Room next to Kitchen
      if (fixedRooms.find(r => r.name === 'Dining Room')) {
        placeRoomOnGrid(newGrid, 7, 5, 3, 3, 'Dining Room', fixedRooms.find(r => r.name === 'Dining Room')?.id || 4, 'fixed');
      }
      
      // Living Room in the middle
      if (fixedRooms.find(r => r.name === 'Living Room')) {
        placeRoomOnGrid(newGrid, 4, 2, 3, 4, 'Living Room', fixedRooms.find(r => r.name === 'Living Room')?.id || 2, 'fixed');
      }
      
      // Family Room on the right side
      if (fixedRooms.find(r => r.name === 'Family Room')) {
        placeRoomOnGrid(newGrid, 4, 6, 3, 4, 'Family Room', fixedRooms.find(r => r.name === 'Family Room')?.id || 3, 'fixed');
      }
      
      // Foyer at the top
      if (fixedRooms.find(r => r.name === 'Foyer')) {
        placeRoomOnGrid(newGrid, 1, 4, 2, 2, 'Foyer', fixedRooms.find(r => r.name === 'Foyer')?.id || 5, 'fixed');
      }
      
      // Laundry Room small room
      if (fixedRooms.find(r => r.name === 'Laundry Room')) {
        placeRoomOnGrid(newGrid, 1, 8, 2, 2, 'Laundry Room', fixedRooms.find(r => r.name === 'Laundry Room')?.id || 6, 'fixed');
      }
      
      // Garage on the right side
      if (fixedRooms.find(r => r.name === 'Garage')) {
        placeRoomOnGrid(newGrid, 1, 10, 4, 2, 'Garage', fixedRooms.find(r => r.name === 'Garage')?.id || 7, 'fixed');
      }
      
      // Place bedrooms at the top
      let bedroomCol = 1;
      bedrooms.forEach((bedroom, index) => {
        if (bedroomCol + 3 <= gridSize.cols) {
          placeRoomOnGrid(newGrid, 1, bedroomCol, 3, 3, bedroom.name, bedroom.id, 'bedroom');
          bedroomCol += 3;
        }
      });
      
      // Place bathrooms
      let bathroomRow = 4;
      let bathroomCol = 10;
      bathrooms.forEach((bathroom, index) => {
        if (bathroomRow + 2 <= gridSize.rows) {
          placeRoomOnGrid(newGrid, bathroomRow, bathroomCol, 2, 2, bathroom.name, bathroom.id, 'bathroom');
          bathroomRow += 2;
        }
      });
      
      // Update the grid
      setGrid(newGrid);
      setIsGenerating(false);
    }, 1500); // Simulate loading for better UX
  };

  // Helper function to place a room on the grid
  const placeRoomOnGrid = (
    grid: GridCell[][],
    startRow: number,
    startCol: number,
    height: number,
    width: number,
    roomName: string,
    roomId: number,
    roomType: string
  ) => {
    // Make sure the room fits on the grid
    const endRow = Math.min(startRow + height, gridSize.rows);
    const endCol = Math.min(startCol + width, gridSize.cols);
    
    // Get the color for this room type
    let color = defaultColors[roomName] || defaultColors[roomType] || '#EEEEEE';
    
    // Fill the room area
    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        if (grid[row] && grid[row][col]) {
          grid[row][col].roomId = roomId;
          grid[row][col].roomName = roomName;
          grid[row][col].roomType = roomType;
          grid[row][col].color = color;
        }
      }
    }
  };

  const handleCellClick = (cell: GridCell) => {
    if (selectedRoom) {
      // Apply the selected room to this cell
      const newGrid = [...grid];
      
      // Find the cell and update it
      for (let row = 0; row < gridSize.rows; row++) {
        for (let col = 0; col < gridSize.cols; col++) {
          if (newGrid[row][col].id === cell.id) {
            newGrid[row][col].roomId = selectedRoom.id;
            newGrid[row][col].roomName = selectedRoom.name;
            newGrid[row][col].roomType = selectedRoom.type;
            
            // Determine the color
            let color = defaultColors[selectedRoom.name] || 
                        defaultColors[selectedRoom.type] || 
                        '#EEEEEE';
            
            newGrid[row][col].color = color;
            break;
          }
        }
      }
      
      setGrid(newGrid);
    } else if (cell.roomId) {
      // If no room is selected and we click on a cell with a room, select that room
      setSelectedRoom({
        id: cell.roomId,
        name: cell.roomName || '',
        type: cell.roomType || ''
      });
    }
  };

  const handleRoomSelect = (id: number, name: string, type: string) => {
    setSelectedRoom({ id, name, type });
  };

  const clearSelectedRoom = () => {
    setSelectedRoom(null);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, maxZoom));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, minZoom));
  };

  const clearFloorPlan = () => {
    if (window.confirm('Are you sure you want to clear the floor plan?')) {
      generateEmptyGrid();
    }
  };

  // Dragging functionality
  const handleMouseDown = () => {
    if (gridRef.current) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && containerRef.current && gridRef.current) {
      containerRef.current.style.cursor = 'grabbing';
      gridRef.current.style.pointerEvents = 'none';
      
      // Implement panning logic here
      // This is a simple example, for production you might want to use a library
    }
  };

  const handleMouseUp = () => {
    if (isDragging && containerRef.current && gridRef.current) {
      setIsDragging(false);
      containerRef.current.style.cursor = 'default';
      gridRef.current.style.pointerEvents = 'auto';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Floor Plan Visualizer</h2>
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            onClick={() => setShowInfo(!showInfo)}
            title="Information"
          >
            <Info size={20} />
          </button>
        </div>
      </div>
      
      {showInfo && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="text-blue-800 font-medium mb-2">How to use the Floor Plan Visualizer</h3>
          <ul className="text-blue-700 text-sm list-disc pl-5 space-y-1">
            <li>Click "Generate Floor Plan" to automatically create a basic layout</li>
            <li>Select a room from the list, then click on the grid to place it</li>
            <li>Use the zoom controls to adjust the view</li>
            <li>Click "Clear" to reset the floor plan</li>
          </ul>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row">
        {/* Room selection sidebar */}
        <div className="w-full md:w-1/4 pr-0 md:pr-4 mb-4 md:mb-0">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Select a Room</h3>
            
            {selectedRoom && (
              <div className="bg-blue-50 p-2 rounded mb-3 flex justify-between items-center">
                <span>Selected: <strong>{selectedRoom.name}</strong></span>
                <button
                  onClick={clearSelectedRoom}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Trash size={16} />
                </button>
              </div>
            )}
            
            <div className="space-y-1 mb-6 max-h-40 overflow-y-auto">
              <div className="font-medium text-gray-500 text-xs uppercase mt-2 mb-1">Common Areas</div>
              {fixedRooms.map(room => (
                <div 
                  key={room.id}
                  className={`p-2 rounded text-sm cursor-pointer flex items-center ${
                    selectedRoom?.id === room.id && selectedRoom?.type === 'fixed' ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleRoomSelect(room.id, room.name, 'fixed')}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: defaultColors[room.name] || '#CCCCCC' }}
                  ></div>
                  {room.name}
                </div>
              ))}
              
              <div className="font-medium text-gray-500 text-xs uppercase mt-2 mb-1">Bedrooms</div>
              {bedrooms.map(room => (
                <div 
                  key={room.id}
                  className={`p-2 rounded text-sm cursor-pointer flex items-center ${
                    selectedRoom?.id === room.id && selectedRoom?.type === 'bedroom' ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleRoomSelect(room.id, room.name, 'bedroom')}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: defaultColors['bedroom'] }}
                  ></div>
                  {room.name}
                </div>
              ))}
              
              <div className="font-medium text-gray-500 text-xs uppercase mt-2 mb-1">Bathrooms</div>
              {bathrooms.map(room => (
                <div 
                  key={room.id}
                  className={`p-2 rounded text-sm cursor-pointer flex items-center ${
                    selectedRoom?.id === room.id && selectedRoom?.type === 'bathroom' ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleRoomSelect(room.id, room.name, 'bathroom')}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: defaultColors['bathroom'] }}
                  ></div>
                  {room.name}
                </div>
              ))}
              
              {customRooms.length > 0 && (
                <>
                  <div className="font-medium text-gray-500 text-xs uppercase mt-2 mb-1">Custom Rooms</div>
                  {customRooms.map(room => (
                    <div 
                      key={room.id}
                      className={`p-2 rounded text-sm cursor-pointer flex items-center ${
                        selectedRoom?.id === room.id && selectedRoom?.type === 'custom' ? 'bg-blue-100' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleRoomSelect(room.id, room.name, 'custom')}
                    >
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: defaultColors['custom'] }}
                      ></div>
                      {room.name}
                    </div>
                  ))}
                </>
              )}
            </div>
            
            <div className="flex flex-col space-y-2">
              <button
                onClick={generateFloorPlan}
                disabled={isGenerating}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex justify-center items-center disabled:bg-blue-300"
              >
                {isGenerating ? (
                  <>
                    <Loader className="animate-spin mr-2" size={16} />
                    Generating...
                  </>
                ) : (
                  'Generate Floor Plan'
                )}
              </button>
              <button
                onClick={clearFloorPlan}
                className="w-full py-2 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        
        {/* Grid container */}
        <div 
          className="w-full md:w-3/4 bg-gray-100 rounded-lg overflow-hidden"
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="bg-white border-b border-gray-200 p-2 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {selectedRoom ? `Placing: ${selectedRoom.name}` : 'Click on a room to select it'}
            </div>
            <div className="flex items-center space-x-1">
              <button 
                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                onClick={handleZoomOut}
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-sm text-gray-600 w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
              <button 
                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                onClick={handleZoomIn}
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
              <button 
                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded ml-2"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIsDragging(true);
                }}
                title="Pan"
              >
                <Move size={18} />
              </button>
            </div>
          </div>
          
          <div 
            className="grid-container p-4 overflow-auto"
            style={{ height: '400px' }}
          >
            <div
              ref={gridRef}
              style={{ 
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                transition: 'transform 0.2s ease'
              }}
            >
              <div 
                className="grid gap-0.5 bg-gray-200"
                style={{ 
                  gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
                  width: `${gridSize.cols * 40}px` 
                }}
              >
                {grid.map((row, rowIndex) => (
                  row.map((cell, colIndex) => (
                    <div 
                      key={cell.id}
                      className={`cell h-10 w-10 relative ${cell.roomId ? '' : 'border border-dashed border-gray-300'}`}
                      style={{ 
                        backgroundColor: cell.color
                      }}
                      onClick={() => handleCellClick(cell)}
                    >
                      {cell.roomId && rowIndex === 0 && colIndex === 0 && cell.roomName && (
                        <div className="absolute top-0 left-0 text-xs bg-white/80 p-0.5 rounded">
                          {cell.roomName}
                        </div>
                      )}
                    </div>
                  ))
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanVisualizer;