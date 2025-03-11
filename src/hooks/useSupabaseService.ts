import { useState, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';

interface Project {
  id?: string;
  name: string;
  address: string;
  data: any;
  user_id?: string;
  is_public?: boolean;
}

export const useSupabaseService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save a project
  const saveProject = useCallback(async (project: Project): Promise<{ success: boolean; id?: string }> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select('id');
      
      if (error) throw error;
      
      return { success: true, id: data?.[0]?.id };
    } catch (err: any) {
      console.error('Error saving project:', err);
      setError(err.message || 'Failed to save project');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's projects
  const getUserProjects = useCallback(async (userId: string): Promise<Project[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message || 'Failed to load projects');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a project by ID
  const getProjectById = useCallback(async (projectId: string): Promise<Project | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (err: any) {
      console.error('Error fetching project:', err);
      setError(err.message || 'Failed to load project');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a project
  const deleteProject = useCallback(async (projectId: string, userId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return true;
    } catch (err: any) {
      console.error('Error deleting project:', err);
      setError(err.message || 'Failed to delete project');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all public projects
  const getPublicProjects = useCallback(async (): Promise<Project[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (err: any) {
      console.error('Error fetching public projects:', err);
      setError(err.message || 'Failed to load public projects');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Retry wrapper function for any Supabase operation
  const withRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> => {
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        return await operation();
      } catch (err) {
        retries++;
        if (retries >= maxRetries) throw err;
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, retries - 1)));
      }
    }
    
    throw new Error('Maximum retries exceeded');
  }, []);

  return {
    loading,
    error,
    saveProject,
    getUserProjects,
    getProjectById,
    deleteProject,
    getPublicProjects,
    withRetry
  };
};