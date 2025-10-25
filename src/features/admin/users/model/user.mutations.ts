import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { UserService } from "./user.service";
import { CreateUserPayload, UpdateUserPayload, User } from "./model.types";

export function useCreateUser(
  options?: UseMutationOptions<User, unknown, CreateUserPayload>,
) {
  const mutationFn: MutationFunction<User, CreateUserPayload> = async (payload) =>
    await UserService.create(payload);

  return useMutation<User, unknown, CreateUserPayload>({
    mutationKey: ["createUser"],
    mutationFn,
    ...options,
  });
}

export function useUpdateUser(
  options?: UseMutationOptions<User, unknown, { userId: number; payload: UpdateUserPayload }>,
) {
  const mutationFn: MutationFunction<User, { userId: number; payload: UpdateUserPayload }> =
    async ({ userId, payload }) => await UserService.update(userId, payload);

  return useMutation<User, unknown, { userId: number; payload: UpdateUserPayload }>({
    mutationKey: ["updateUser"],
    mutationFn,
    ...options,
  });
}

export function useDeleteUser(
  options?: UseMutationOptions<void, unknown, number>,
) {
  const mutationFn: MutationFunction<void, number> = async (userId) =>
    await UserService.delete(userId);

  return useMutation<void, unknown, number>({
    mutationKey: ["deleteUser"],
    mutationFn,
    ...options,
  });
} 