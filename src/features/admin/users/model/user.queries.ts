import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { UserService } from "./user.service";
import { User } from "./model.types";

export function useUserDetail(
  userId: number,
): UseQueryResult<User> {
  return useQuery<User>({
    queryKey: ["user-detail", userId],
    queryFn: () => UserService.getById(userId),
    enabled: !!userId,
  });
}

export function useUsersList(): UseQueryResult<User[]> {
  return useQuery<User[]>({
    queryKey: ["users-list"],
    queryFn: () => UserService.getAll(),
  });
}
