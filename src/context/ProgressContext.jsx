import React, { createContext, useContext, useCallback } from 'react';
import { logAttempt as serviceLogAttempt, getUserAttempts, getLinkedStudents, getUserProgress, updateUserProgress } from '../services/progressService';
import { useSession } from './SessionContext';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const { session } = useSession();

  const logAttempt = useCallback(async (attemptData) => {
    if (!session?.user?.id) {
      console.warn('[logAttempt] No session - attempt NOT saved. User must be logged in.');
      return;
    }
    try {
      console.log('[logAttempt] Saving attempt for userId:', session.user.id, '| module:', attemptData.module, '| correct:', attemptData.correct);
      await serviceLogAttempt({ ...attemptData, user_id: session.user.id });
      console.log('[logAttempt] ✅ Attempt saved successfully');
    } catch (error) {
      console.error('[logAttempt] ❌ Failed to log attempt:', error.message, error);
    }
  }, [session]);

  const fetchAttempts = useCallback(async (userId, module) => {
    try {
      return await getUserAttempts(userId, module);
    } catch (error) {
      console.error("Failed to fetch attempts", error);
      return [];
    }
  }, []);

  const fetchUserProgress = useCallback(async (userIdOrModule, moduleArg) => {
    // If only one arg is provided, it's the module and we use session user
    const userId = moduleArg ? userIdOrModule : session?.user?.id;
    const module = moduleArg ? moduleArg : userIdOrModule;
    if (!userId) return [];
    try {
      return await getUserProgress(userId, module);
    } catch (error) {
      console.error("Failed to fetch user progress", error);
      return [];
    }
  }, [session]);

  const saveUserProgress = useCallback(async (module, level, accuracy) => {
    if (!session?.user?.id) {
      console.warn('[saveUserProgress] No session - progress NOT saved.');
      return null;
    }
    try {
      console.log('[saveUserProgress] Saving progress:', { module, level, accuracy, userId: session.user.id });
      const result = await updateUserProgress(session.user.id, module, level, accuracy);
      console.log('[saveUserProgress] ✅ Progress saved');
      return result;
    } catch (error) {
      console.error('[saveUserProgress] ❌ Failed:', error.message, error);
      return null;
    }
  }, [session]);

  const fetchLinkedStudents = useCallback(async () => {
    if (!session?.user?.id) return [];
    try {
      return await getLinkedStudents(session.user.id);
    } catch (error) {
      console.error("Failed to fetch linked students", error);
      return [];
    }
  }, [session]);

  return (
    <ProgressContext.Provider value={{ logAttempt, fetchAttempts, fetchLinkedStudents, fetchUserProgress, saveUserProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};
