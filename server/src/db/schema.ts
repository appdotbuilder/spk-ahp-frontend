import { serial, text, pgTable, timestamp, integer, numeric, pgEnum, json } from 'drizzle-orm/pg-core';

// Enum for user roles
export const userRoleEnum = pgEnum('user_role', ['admin', 'operator', 'guru']);

// Enum for pairwise comparison types
export const pairwiseTypeEnum = pgEnum('pairwise_type', ['criteria', 'alternative']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Criteria table
export const criteriaTable = pgTable('criteria', {
  id: serial('id').primaryKey(),
  code: text('code'),
  name: text('name').notNull(),
  weight: numeric('weight', { precision: 10, scale: 6 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Alternatives table
export const alternativesTable = pgTable('alternatives', {
  id: serial('id').primaryKey(),
  code: text('code'),
  name: text('name').notNull(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Pairwise entries table for storing comparison values
export const pairwiseEntriesTable = pgTable('pairwise_entries', {
  id: serial('id').primaryKey(),
  row_id: integer('row_id').notNull(),
  col_id: integer('col_id').notNull(),
  value: numeric('value', { precision: 10, scale: 6 }).notNull(),
  type: pairwiseTypeEnum('type').notNull(),
  user_id: integer('user_id'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// AHP results table for storing calculated weights and consistency ratios
export const ahpResultsTable = pgTable('ahp_results', {
  id: serial('id').primaryKey(),
  weights: json('weights').notNull(), // JSON object storing weights as key-value pairs
  consistency_ratio: numeric('consistency_ratio', { precision: 10, scale: 6 }),
  type: pairwiseTypeEnum('type').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// TypeScript types for database operations
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Criteria = typeof criteriaTable.$inferSelect;
export type NewCriteria = typeof criteriaTable.$inferInsert;

export type Alternative = typeof alternativesTable.$inferSelect;
export type NewAlternative = typeof alternativesTable.$inferInsert;

export type PairwiseEntry = typeof pairwiseEntriesTable.$inferSelect;
export type NewPairwiseEntry = typeof pairwiseEntriesTable.$inferInsert;

export type AHPResult = typeof ahpResultsTable.$inferSelect;
export type NewAHPResult = typeof ahpResultsTable.$inferInsert;

// Export all tables for relation queries
export const tables = {
  users: usersTable,
  criteria: criteriaTable,
  alternatives: alternativesTable,
  pairwiseEntries: pairwiseEntriesTable,
  ahpResults: ahpResultsTable,
};