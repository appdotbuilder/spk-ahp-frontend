import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import {
  loginInputSchema,
  createUserInputSchema,
  updateUserInputSchema,
  deleteInputSchema,
  getByIdInputSchema,
  createCriteriaInputSchema,
  updateCriteriaInputSchema,
  createAlternativeInputSchema,
  updateAlternativeInputSchema,
  createPairwiseEntryInputSchema,
  updatePairwiseEntryInputSchema,
  bulkPairwiseUpdateInputSchema,
  processAHPInputSchema,
  createAHPResultInputSchema,
  exportReportInputSchema,
  pairwiseTypeSchema,
} from './schema';

// Import handlers
import { login, logout, me } from './handlers/auth';
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from './handlers/users';
import {
  getCriteria,
  getCriteriaById,
  createCriteria,
  updateCriteria,
  deleteCriteria
} from './handlers/criteria';
import {
  getAlternatives,
  getAlternativeById,
  createAlternative,
  updateAlternative,
  deleteAlternative
} from './handlers/alternatives';
import {
  getPairwiseEntries,
  getPairwiseMatrix,
  createPairwiseEntry,
  updatePairwiseEntry,
  bulkUpdatePairwise,
  deletePairwiseEntry,
  normalizePairwiseMatrix
} from './handlers/pairwise';
import {
  processAHP,
  getAHPResults,
  getLatestAHPResult,
  createAHPResult,
  calculateConsistencyRatio
} from './handlers/ahp';
import {
  exportReport,
  getReportData
} from './handlers/reports';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  auth: router({
    login: publicProcedure
      .input(loginInputSchema)
      .mutation(({ input }) => login(input)),
    
    logout: publicProcedure
      .mutation(() => logout()),
    
    me: publicProcedure
      .query(({ ctx }) => me(1)), // TODO: Extract user ID from auth context
  }),

  // User management routes (Admin only)
  users: router({
    getAll: publicProcedure
      .query(() => getUsers()),
    
    getById: publicProcedure
      .input(getByIdInputSchema)
      .query(({ input }) => getUserById(input)),
    
    create: publicProcedure
      .input(createUserInputSchema)
      .mutation(({ input }) => createUser(input)),
    
    update: publicProcedure
      .input(updateUserInputSchema)
      .mutation(({ input }) => updateUser(input)),
    
    delete: publicProcedure
      .input(deleteInputSchema)
      .mutation(({ input }) => deleteUser(input)),
  }),

  // Criteria management routes
  criteria: router({
    getAll: publicProcedure
      .query(() => getCriteria()),
    
    getById: publicProcedure
      .input(getByIdInputSchema)
      .query(({ input }) => getCriteriaById(input)),
    
    create: publicProcedure
      .input(createCriteriaInputSchema)
      .mutation(({ input }) => createCriteria(input)),
    
    update: publicProcedure
      .input(updateCriteriaInputSchema)
      .mutation(({ input }) => updateCriteria(input)),
    
    delete: publicProcedure
      .input(deleteInputSchema)
      .mutation(({ input }) => deleteCriteria(input)),
  }),

  // Alternatives management routes
  alternatives: router({
    getAll: publicProcedure
      .query(() => getAlternatives()),
    
    getById: publicProcedure
      .input(getByIdInputSchema)
      .query(({ input }) => getAlternativeById(input)),
    
    create: publicProcedure
      .input(createAlternativeInputSchema)
      .mutation(({ input }) => createAlternative(input)),
    
    update: publicProcedure
      .input(updateAlternativeInputSchema)
      .mutation(({ input }) => updateAlternative(input)),
    
    delete: publicProcedure
      .input(deleteInputSchema)
      .mutation(({ input }) => deleteAlternative(input)),
  }),

  // Pairwise comparison routes
  pairwise: router({
    getEntries: publicProcedure
      .input(pairwiseTypeSchema)
      .query(({ input }) => getPairwiseEntries(input)),
    
    getMatrix: publicProcedure
      .input(pairwiseTypeSchema)
      .query(({ input }) => getPairwiseMatrix(input)),
    
    create: publicProcedure
      .input(createPairwiseEntryInputSchema)
      .mutation(({ input }) => createPairwiseEntry(input)),
    
    update: publicProcedure
      .input(updatePairwiseEntryInputSchema)
      .mutation(({ input }) => updatePairwiseEntry(input)),
    
    bulkUpdate: publicProcedure
      .input(bulkPairwiseUpdateInputSchema)
      .mutation(({ input }) => bulkUpdatePairwise(input)),
    
    delete: publicProcedure
      .input(deleteInputSchema)
      .mutation(({ input }) => deletePairwiseEntry(input)),
    
    normalize: publicProcedure
      .input(pairwiseTypeSchema)
      .query(({ input }) => normalizePairwiseMatrix(input)),
  }),

  // AHP calculation routes
  ahp: router({
    process: publicProcedure
      .input(processAHPInputSchema)
      .mutation(({ input }) => processAHP(input)),
    
    getResults: publicProcedure
      .input(pairwiseTypeSchema.optional())
      .query(({ input }) => getAHPResults(input)),
    
    getLatestResult: publicProcedure
      .input(pairwiseTypeSchema)
      .query(({ input }) => getLatestAHPResult(input)),
    
    createResult: publicProcedure
      .input(createAHPResultInputSchema)
      .mutation(({ input }) => createAHPResult(input)),
    
    calculateConsistency: publicProcedure
      .input(pairwiseTypeSchema)
      .query(({ input }) => calculateConsistencyRatio(input)),
  }),

  // Reporting routes
  reports: router({
    export: publicProcedure
      .input(exportReportInputSchema)
      .mutation(({ input }) => exportReport(input)),
    
    getData: publicProcedure
      .query(() => getReportData()),
  }),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();