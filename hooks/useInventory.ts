
import { supabase } from '../services/supabase';
import { MovementType } from '../types';
// Fix: Import React Query hooks from the library instead of window object.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useInventory() {
  const queryClient = useQueryClient();

  const { data: products, isLoading: isLoadingProducts, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => supabase.getProducts(),
  });

  const { data: locations, isLoading: isLoadingLocations, error: locationsError } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => supabase.getLocations(),
  });

  const { data: movements, isLoading: isLoadingMovements, error: movementsError } = useQuery({
    queryKey: ['movements'],
    queryFn: async () => supabase.getMovements(),
  });

  const addMovementMutation = useMutation({
    mutationFn: ({ type, productId, quantity, fromLocationId, toLocationId }: {
      type: MovementType;
      productId: string;
      quantity: number;
      fromLocationId?: string;
      toLocationId?: string;
    }) => supabase.addMovement(type, productId, quantity, fromLocationId, toLocationId),
    onSuccess: () => {
      // Invalidate and refetch queries to show updated data
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['movements'] });
    },
  });

  return {
    products,
    isLoadingProducts,
    productsError,
    locations,
    isLoadingLocations,
    locationsError,
    movements,
    isLoadingMovements,
    movementsError,
    addMovement: addMovementMutation.mutate,
    isAddingMovement: addMovementMutation.isPending,
    addMovementError: addMovementMutation.error,
  };
}
