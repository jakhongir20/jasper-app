import { UseMutationOptions } from "@tanstack/react-query";

export interface LoginResponse {
  token: string;
  expires_on: number; // Unix timestamp

  user: User;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export type LoginMutationOptions = UseMutationOptions<
  LoginResponse,
  unknown,
  LoginFormData
>;

export type User = {
  user_id: number;
  name: string;
  username: string;
  is_active: boolean;
  is_supervisor: boolean;
  is_admin: boolean;
  is_factory: boolean;
  telegram_user_id: number;
  telegram_group_id: number | null;
  created_at: number; // Unix timestamp
};
