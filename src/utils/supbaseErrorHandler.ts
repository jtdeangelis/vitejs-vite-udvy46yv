/**
 * Utility to format Supabase error messages
 */
export const formatSupabaseError = (error: any): string => {
  if (!error) return 'Unknown error occurred';
  
  if (error.message) {
    // Handle known error patterns
    if (error.message.includes('JWT')) {
      return 'Your session has expired. Please sign in again.';
    }
    
    if (error.message.includes('network')) {
      return 'A network error occurred. Please check your connection and try again.';
    }
    
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Log error details for debugging
 */
export const logErrorDetails = (error: any, context: string): void => {
  console.error(`Error in ${context}:`, error);
  
  if (error.code) {
    console.error(`Error code: ${error.code}`);
  }
  
  if (error.details) {
    console.error(`Error details:`, error.details);
  }
};

/**
 * Wrapper function to handle Supabase errors
 */
export const handleSupabaseError = <T>(
  data: T | null,
  error: any,
  context: string,
  setError?: (message: string) => void
): { data: T | null; errorMessage: string | null } => {
  if (error) {
    logErrorDetails(error, context);
    const errorMessage = formatSupabaseError(error);
    
    if (setError) {
      setError(errorMessage);
    }
    
    return { data: null, errorMessage };
  }
  
  return { data, errorMessage: null };
};