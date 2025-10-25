import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { AuthService } from "@/features/auth/login/model/auth.service";
import { User } from "@/features/auth/login/model/auth.types";
import { getCookie } from "@/shared/lib/services";

export function useProfile(): UseQueryResult<User> {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => {
      // Check if we have a token before making the request
      const token = getCookie("__token") || localStorage.getItem("__token");
      if (!token) {
        throw new Error("No authentication token");
      }
      return AuthService.getProfile();
    },
    retry: false, // Don't retry on failure
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
  });
}
