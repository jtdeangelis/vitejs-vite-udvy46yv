import React, { useState, useEffect } from 'react';
import { Room, IndividualRoom } from '../types';
import { Calendar, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, ArrowRight } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface TimelineItem {
  id: number;
  name: string;
  phase: string;
  duration: number;
  cost: number;
  category: string;
  dependencies: number[];
  status: 'not-started' | 'in-progress' | 'completed';
  startDate: Date | null;
  endDate: Date | null;
}

interface ProjectTimelineProps {
  fixedRooms: Room[];
  bedrooms: IndividualRoom[];
  bathrooms: IndividualRoom[];
  customRooms: Room[];
  totalCost: number;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  fixedRooms,
  bedrooms,
  bathrooms,
  customRooms,
  totalCost
}) => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [expandedPhases, setExpandedPhases] = useState<string[]>(['Demolition', 'Construction', 'Finishing']);
  const [isEditingOutline, setIsEditingOutline] = useState(false);
  const [editedDurations, setEditedDurations] = useState<Record<number, number>>({});

  useEffect(() => {
    generateTimeline();
  }, [fixedRooms, bedrooms, bathrooms, customRooms, startDate]);

  const generateTimeline = () => {
    let currentDate = new Date(startDate);
    let taskId = 1;
    const items: TimelineItem[] = [];

    const addTask = (
      name: string,
      phase: string,
      duration: number,
      cost: number,
      category: string,
      dependencies: number[] = []
    ) => {
      const startDate = new Date(currentDate);
      const endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + (editedDurations[taskId] || duration) - 1);

      items.push({
        id: taskId++,
        name,
        phase,
        duration: editedDurations[taskId] || duration,
        cost,
        category,
        dependencies,
        status: 'not-started',
        startDate,
        endDate
      });

      currentDate.setDate(currentDate.getDate() + (editedDurations[taskId] || duration));
    };

    // Generate tasks for each room
    [...fixedRooms, ...bedrooms, ...bathrooms, ...customRooms]
      .filter(room => room.customized)
      .forEach(room => {
        addTask(
          `${room.name} Demo`,
          'Demolition',
          2,
          room.cost * 0.1,
          room.type || 'room',
          []
        );

        addTask(
          `${room.name} Construction`,
          'Construction',
          5,
          room.cost * 0.6,
          room.type || 'room',
          [taskId - 1]
        );

        addTask(
          `${room.name} Finishing`,
          'Finishing',
          3,
          room.cost * 0.3,
          room.type || 'room',
          [taskId - 1]
        );
      });

    setTimelineItems(items);
    setEndDate(new Date(currentDate));
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'TBD';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const togglePhase = (phase: string) => {
    setExpandedPhases(prev => 
      prev.includes(phase) 
        ? prev.filter(p => p !== phase)
        : [...prev, phase]
    );
  };

  const handleDurationChange = (taskId: number, newDuration: number) => {
    setEditedDurations(prev => ({
      ...prev,
      [taskId]: Math.max(1, newDuration)
    }));
    generateTimeline();
  };

  const getChartData = () => {
    return {
      labels: timelineItems.map(item => item.name),
      datasets: [{
        label: 'Timeline',
        data: timelineItems.map(item => ({
          x: [item.startDate, item.endDate],
          y: item.name,
          duration: item.duration,
          cost: item.cost,
          phase: item.phase
        })),
        backgroundColor: timelineItems.map(item => {
          switch (item.phase) {
            case 'Demolition': return 'rgba(239, 68, 68, 0.7)';
            case 'Construction': return 'rgba(59, 130, 246, 0.7)';
            case 'Finishing': return 'rgba(16, 185, 129, 0.7)';
            default: return 'rgba(107, 114, 128, 0.7)';
          }
        }),
        borderWidth: 0,
        borderRadius: 4
      }]
    };
  };

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'MMM d'
          }
        },
        title: {
          display: true,
          text: 'Timeline'
        }
      },
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const item = context.raw;
            return [
              `Phase: ${item.phase}`,
              `Duration: ${item.duration} days`,
              `Cost: $${item.cost.toLocaleString()}`
            ];
          }
        }
      }
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Project Timeline</h2>
            <p className="mt-1 text-sm text-gray-500">
              Estimated duration: {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
            </p>
          </div>
          
          <button
            onClick={() => setIsEditingOutline(!isEditingOutline)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isEditingOutline ? 'Done Editing' : 'Edit Timeline'}
          </button>
        </div>
      </div>

      <div className="px-4 py-5 sm:p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                Project Start Date
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="start-date"
                  value={startDate.toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: '600px' }}>
          <Bar data={getChartData()} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;