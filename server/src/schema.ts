import { z } from 'zod';

// User role enum
export const userRoleSchema = z.enum(['admin', 'operator', 'guru']);
export type UserRole = z.infer<typeof userRoleSchema>;

// User schema
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: userRoleSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});
export type User = z.infer<typeof userSchema>;

// Input schemas for user operations
export const createUserInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: userRoleSchema,
});
export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const updateUserInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: userRoleSchema.optional(),
});
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Authentication schemas
export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

export const authResponseSchema = z.object({
  user: userSchema,
  token: z.string(),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

// Criteria schema
export const criteriaSchema = z.object({
  id: z.number(),
  code: z.string().nullable(),
  name: z.string(),
  weight: z.number().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});
export type Criteria = z.infer<typeof criteriaSchema>;

// Input schemas for criteria operations
export const createCriteriaInputSchema = z.object({
  code: z.string().nullable(),
  name: z.string().min(1),
  weight: z.number().nullable(),
});
export type CreateCriteriaInput = z.infer<typeof createCriteriaInputSchema>;

export const updateCriteriaInputSchema = z.object({
  id: z.number(),
  code: z.string().nullable().optional(),
  name: z.string().min(1).optional(),
  weight: z.number().nullable().optional(),
});
export type UpdateCriteriaInput = z.infer<typeof updateCriteriaInputSchema>;

// Alternative schema
export const alternativeSchema = z.object({
  id: z.number(),
  code: z.string().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});
export type Alternative = z.infer<typeof alternativeSchema>;

// Input schemas for alternative operations
export const createAlternativeInputSchema = z.object({
  code: z.string().nullable(),
  name: z.string().min(1),
  description: z.string().nullable(),
});
export type CreateAlternativeInput = z.infer<typeof createAlternativeInputSchema>;

export const updateAlternativeInputSchema = z.object({
  id: z.number(),
  code: z.string().nullable().optional(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
});
export type UpdateAlternativeInput = z.infer<typeof updateAlternativeInputSchema>;

// Pairwise entry type enum
export const pairwiseTypeSchema = z.enum(['criteria', 'alternative']);
export type PairwiseType = z.infer<typeof pairwiseTypeSchema>;

// Pairwise entry schema
export const pairwiseEntrySchema = z.object({
  id: z.number(),
  row_id: z.number(),
  col_id: z.number(),
  value: z.number(),
  type: pairwiseTypeSchema,
  user_id: z.number().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});
export type PairwiseEntry = z.infer<typeof pairwiseEntrySchema>;

// Input schemas for pairwise entry operations
export const createPairwiseEntryInputSchema = z.object({
  row_id: z.number(),
  col_id: z.number(),
  value: z.number().positive(),
  type: pairwiseTypeSchema,
  user_id: z.number().nullable(),
});
export type CreatePairwiseEntryInput = z.infer<typeof createPairwiseEntryInputSchema>;

export const updatePairwiseEntryInputSchema = z.object({
  id: z.number(),
  value: z.number().positive(),
});
export type UpdatePairwiseEntryInput = z.infer<typeof updatePairwiseEntryInputSchema>;

// Bulk pairwise update schema
export const bulkPairwiseUpdateInputSchema = z.object({
  entries: z.array(z.object({
    row_id: z.number(),
    col_id: z.number(),
    value: z.number().positive(),
  })),
  type: pairwiseTypeSchema,
  user_id: z.number().nullable(),
});
export type BulkPairwiseUpdateInput = z.infer<typeof bulkPairwiseUpdateInputSchema>;

// AHP Result schema
export const ahpResultSchema = z.object({
  id: z.number(),
  weights: z.record(z.string(), z.number()), // Record<string, number> for JSON storage
  consistency_ratio: z.number().nullable(),
  type: pairwiseTypeSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});
export type AHPResult = z.infer<typeof ahpResultSchema>;

// Input schemas for AHP result operations
export const createAHPResultInputSchema = z.object({
  weights: z.record(z.string(), z.number()),
  consistency_ratio: z.number().nullable(),
  type: pairwiseTypeSchema,
});
export type CreateAHPResultInput = z.infer<typeof createAHPResultInputSchema>;

// Process AHP calculation input schema
export const processAHPInputSchema = z.object({
  type: pairwiseTypeSchema,
});
export type ProcessAHPInput = z.infer<typeof processAHPInputSchema>;

// ID parameter schema for delete operations
export const deleteInputSchema = z.object({
  id: z.number(),
});
export type DeleteInput = z.infer<typeof deleteInputSchema>;

// Get by ID schema
export const getByIdInputSchema = z.object({
  id: z.number(),
});
export type GetByIdInput = z.infer<typeof getByIdInputSchema>;

// Export report input schema
export const exportReportInputSchema = z.object({
  format: z.enum(['pdf', 'csv']),
  type: z.enum(['full', 'criteria', 'alternatives', 'results']).optional(),
});
export type ExportReportInput = z.infer<typeof exportReportInputSchema>;