import React from 'react';
import { Info } from 'lucide-react';

interface MeasurementGuideProps {
  roomType: string;
  measurementType: string;
}

const MeasurementGuide: React.FC<MeasurementGuideProps> = ({ roomType, measurementType }) => {
  const getExplanation = () => {
    // Common areas
    if (roomType === 'kitchen') {
      if (measurementType === 'cabinets') {
        return "Measure the total linear feet of cabinets needed along walls. For a typical kitchen, measure the length of all walls where cabinets will be installed. Standard kitchen cabinets are 24\" deep for base cabinets and 12\" deep for wall cabinets.";
      } else if (measurementType === 'countertops') {
        return "Measure the length of all countertop runs and multiply by the depth (typically 25\" or 2.08 feet). Include any islands or peninsulas. For L-shaped or U-shaped counters, measure each section separately and add them together.";
      } else if (measurementType === 'backsplash') {
        return "Measure the length of the wall space where backsplash will be installed and multiply by the height (typically 18\" or 1.5 feet from countertop to bottom of upper cabinets).";
      } else if (measurementType === 'flooring') {
        return "Multiply the room length by width to get the square footage. Add 10% extra for waste and cuts. For irregularly shaped kitchens, divide into rectangles, calculate each area separately, and add them together.";
      }
    } else if (roomType === 'bathroom') {
      if (measurementType === 'vanity') {
        return "Measure the wall space where the vanity will be installed. Standard vanities range from 24\" to 72\" wide. For double vanities, typically allow at least 60\" of width.";
      } else if (measurementType === 'shower') {
        return "For standard showers, measure the floor space (typically 36\" × 36\" or 9 sq ft). For walk-in showers, measure the actual floor dimensions (often 4' × 4' or larger). For tub/shower combos, standard size is 30\" × 60\" (12.5 sq ft).";
      } else if (measurementType === 'tile') {
        return "For shower walls, measure the height (typically 7') and the perimeter of the shower, then multiply. For floor tile, calculate the square footage of the bathroom floor. Add 10-15% extra for cuts and waste.";
      } else if (measurementType === 'flooring') {
        return "Multiply the bathroom length by width to get the square footage. Add 10% extra for waste and cuts, especially around fixtures like toilets and vanities.";
      }
    } else if (roomType === 'bedroom') {
      if (measurementType === 'flooring') {
        return "Multiply the room length by width to get the square footage. For carpet, add 10% extra for matching patterns and waste. For hardwood or laminate, add 5-10% for waste.";
      } else if (measurementType === 'paint') {
        return "Calculate wall area by measuring the perimeter of the room and multiplying by ceiling height. Subtract window and door areas. One gallon typically covers 350-400 sq ft.";
      } else if (measurementType === 'closet') {
        return "For walk-in closets, measure the interior floor space. Standard reach-in closets are typically 24\" deep with varying widths. Custom closets are priced based on linear feet of shelving and hanging space.";
      } else if (measurementType === 'trim') {
        return "For baseboards, measure the perimeter of the room. For crown molding, also measure the perimeter. For 'both', the linear footage is the same but the cost per foot is higher due to installing both types.";
      }
    } else if (roomType === 'living' || roomType === 'family') {
      if (measurementType === 'flooring') {
        return "Multiply the room length by width to get the square footage. For open floor plans, define the boundaries of the living area. Add 10% extra for waste and cuts.";
      } else if (measurementType === 'paint') {
        return "Calculate wall area by measuring the perimeter of the room and multiplying by ceiling height (typically 8-9 feet). Subtract window and door areas. One gallon typically covers 350-400 sq ft.";
      } else if (measurementType === 'trim') {
        return "For baseboards, measure the perimeter of the room. For crown molding, also measure the perimeter. For 'both', the linear footage is the same but the cost per foot is higher due to installing both types.";
      } else if (measurementType === 'builtIns') {
        return "Measure the wall space where built-ins will be installed. Standard depths are 12\" for bookshelves and 18-24\" for entertainment centers. Height is typically from floor to ceiling or a standard 84\".";
      }
    } else if (roomType === 'laundry') {
      if (measurementType === 'cabinets') {
        return "Measure the wall space where cabinets will be installed. Standard laundry room cabinets are 12\" deep for wall cabinets and 24\" deep for base cabinets.";
      } else if (measurementType === 'countertops') {
        return "Measure the length of countertop runs and multiply by the depth (typically 24\" or 2 feet). Include any space needed over appliances if creating a continuous surface.";
      } else if (measurementType === 'flooring') {
        return "Multiply the room length by width to get the square footage. Choose durable, water-resistant flooring for laundry rooms. Add 10% extra for waste and cuts.";
      }
    } else if (roomType === 'garage') {
      if (measurementType === 'flooring') {
        return "Multiply the garage length by width to get the square footage. For epoxy coatings, the entire floor must be treated. For tile, you may choose specific areas only.";
      } else if (measurementType === 'storage') {
        return "Measure the wall space where storage will be installed. Standard depths are 12-16\" for shelving and 24\" for cabinets. Calculate linear feet along walls where storage solutions will be installed.";
      }
    } else if (roomType === 'exterior') {
      if (measurementType === 'siding') {
        return "Calculate the exterior wall area by measuring the perimeter of the house and multiplying by the average wall height. Subtract window and door areas. Add 10% for waste.";
      } else if (measurementType === 'roof') {
        return "For simple roofs, multiply the house footprint by 1.1 (for a 5/12 pitch) up to 1.3 (for steeper roofs). For complex roofs, measure each section separately. Always add 10-15% for waste and overlaps.";
      } else if (measurementType === 'landscaping') {
        return "Measure the yard areas to be landscaped. Front yards typically use 50-70% of the lot width × depth from house to street. Backyards vary widely but can be calculated as lot width × depth from house to rear property line.";
      } else if (measurementType === 'driveway') {
        return "Measure the length and width of the driveway area. Standard single driveways are 10-12 feet wide, while double driveways are 20-24 feet wide. Multiply length by width to get square footage.";
      }
    }

    // Default explanation for any other combination
    return "Measure the dimensions accurately and calculate the area or linear footage based on the specific requirements of your project. Add 10% extra for waste and cuts.";
  };

  return (
    <div className="mt-2 bg-blue-50 p-3 rounded-md">
      <div className="flex items-start">
        <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-700">{getExplanation()}</p>
      </div>
    </div>
  );
};

export default MeasurementGuide;