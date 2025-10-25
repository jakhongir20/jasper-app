import { useQuery, useMutation, type UseQueryResult, type UseMutationOptions } from "@tanstack/react-query";
import { ProfileService } from "./profile.service";
import { User, UpdateUserPayload } from "@/features/admin/users/model/model.types";

export function useCurrentUser(): UseQueryResult<User> {
    return useQuery<User>({
        queryKey: ["current-user"],
        queryFn: () => ProfileService.getCurrentUser(),
    });
}

export function useUpdateProfile(
    options?: UseMutationOptions<User, unknown, UpdateUserPayload>,
) {
    return useMutation<User, unknown, UpdateUserPayload>({
        mutationFn: (payload) => ProfileService.updateProfile(payload),
        ...options,
    });
}
