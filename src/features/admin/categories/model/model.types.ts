export interface Category {
    section: number;
    name: string;
    category_id: number;
    created_at?: number;
}

export interface CreateCategoryPayload {
    name: string;
    section_index?: number | null;
}

export interface UpdateCategoryPayload {
    category_id: number;
    name: string;
    section_index?: number | null;
}

export interface CategoryFormData {
    name: string;
    section?: number | null;
}

export interface GetCategoriesParams {
    offset?: number;
    limit?: number;
}

export interface PaginatedCategoriesResponse {
    results: Category[];
    count: number;
    next: string | null;
    previous: string | null;
}
