import { z } from 'zod';

// Base schemas for common options
const DimensionsSchema = z.object({
  length: z.number().min(1),
  width: z.number().min(1)
});

const MaterialOptionSchema = z.object({
  needed: z.boolean(),
  type: z.string(),
  squareFeet: z.number().optional(),
  linearFeet: z.number().optional(),
  count: z.number().optional(),
  installType: z.enum(['install', 'refinish']).optional()
});

const CustomLineItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  quantity: z.number().min(1),
  unitCost: z.number().min(0),
  totalCost: z.number().min(0),
  description: z.string().optional()
});

// Room-specific option schemas
const KitchenOptionsSchema = z.object({
  dimensions: DimensionsSchema,
  cabinets: MaterialOptionSchema.optional(),
  countertops: MaterialOptionSchema.optional(),
  flooring: MaterialOptionSchema.optional(),
  appliances: MaterialOptionSchema.optional(),
  backsplash: MaterialOptionSchema.optional(),
  trim: MaterialOptionSchema.optional(),
  customLineItems: z.array(CustomLineItemSchema).optional(),
  notes: z.string().optional()
});

const BedroomOptionsSchema = z.object({
  dimensions: DimensionsSchema,
  flooring: MaterialOptionSchema.optional(),
  paint: MaterialOptionSchema.optional(),
  closet: MaterialOptionSchema.optional(),
  lighting: MaterialOptionSchema.optional(),
  windows: MaterialOptionSchema.optional(),
  trim: MaterialOptionSchema.optional(),
  fan: MaterialOptionSchema.optional(),
  customLineItems: z.array(CustomLineItemSchema).optional(),
  notes: z.string().optional()
});

const BathroomOptionsSchema = z.object({
  dimensions: DimensionsSchema,
  flooring: MaterialOptionSchema.optional(),
  vanity: MaterialOptionSchema.optional(),
  shower: MaterialOptionSchema.optional(),
  toilet: MaterialOptionSchema.optional(),
  lighting: MaterialOptionSchema.optional(),
  tile: MaterialOptionSchema.optional(),
  customLineItems: z.array(CustomLineItemSchema).optional(),
  notes: z.string().optional()
});

// Generic room options schema for validation
export const RoomOptionsSchema = z.object({
  dimensions: DimensionsSchema,
  flooring: MaterialOptionSchema.optional(),
  paint: MaterialOptionSchema.optional(),
  lighting: MaterialOptionSchema.optional(),
  windows: MaterialOptionSchema.optional(),
  trim: MaterialOptionSchema.optional(),
  customLineItems: z.array(CustomLineItemSchema).optional(),
  notes: z.string().optional()
}).passthrough(); // Allow additional properties

// Validate room options before calculation
export const validateRoomOptions = (options: unknown): boolean => {
  try {
    RoomOptionsSchema.parse(options);
    return true;
  } catch (error) {
    console.warn('Room options validation warning:', error);
    return false;
  }
};

// Validate cost calculation inputs
export const validateCostInputs = (
  materialCost: number,
  quantity: number,
  laborRate: number = 0.4
): boolean => {
  if (materialCost < 0) throw new Error('Material cost cannot be negative');
  if (quantity < 0) throw new Error('Quantity cannot be negative');
  if (laborRate < 0 || laborRate > 1) throw new Error('Labor rate must be between 0 and 1');
  
  return true;
};