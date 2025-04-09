import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseFetchOptions {
  successMessage?: string;
  errorMessage?: string;
}

export function useFetch() {
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async <T>(
    url: string, 
    options?: RequestInit & UseFetchOptions
  ): Promise<T | null> => {
    const { successMessage, errorMessage, ...fetchOptions } = options || {};
    
    try {
      setIsLoading(true);
      
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'An error occurred');
      }
      
      const data = await response.json();
      
      if (successMessage) {
        toast({
          title: "Success",
          description: successMessage,
        });
      }
      
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage || message,
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    fetchData
  };
} 