export interface Branch {
  branch_id: number;
  name: string;
  branch_phone_number?: string;
  created_at: number;
  company?: {
    company_id: number;
    name: string;
  };
}

export interface CreateBranchPayload {
  name: string;
  branch_phone_number?: string;
}

export interface UpdateBranchPayload {
  branch_id: number;
  name?: string;
  branch_phone_number?: string;
}

export interface BranchFormData {
  name: string;
  branch_phone_number?: string;
}
