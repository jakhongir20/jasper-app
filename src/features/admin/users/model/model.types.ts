export type User = {
  user_id: number;
  name: string;
  username: string;
  is_active: boolean;
  is_admin: boolean;
  is_factory: boolean;
  telegram_user_id: number;
  telegram_group_id?: number;
  created_at: number;
};

export type CreateUserPayload = {
  name: string;
  username: string;
  password: string;
  is_active: boolean;
  is_admin: boolean;
  is_factory: boolean;
  telegram_user_id: number;
};

export type UpdateUserPayload = Partial<CreateUserPayload> & {
  user_id: number;
};

export type UserFormData = {
  name: string;
  username: string;
  password?: string;
  confirm_password?: string;
  is_active: boolean;
  is_admin: boolean;
  is_factory: boolean;
  telegram_user_id: number;
  telegram_group_id?: number;
};