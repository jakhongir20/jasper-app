export interface Color {
  color_id: number;
  name: string;
}

export interface CreateColorPayload {
  name: string;
}

export interface UpdateColorPayload {
  color_id: number;
  name: string;
}

export interface ColorFormData {
  name: string;
}
