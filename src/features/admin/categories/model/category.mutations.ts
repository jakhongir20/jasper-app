import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "./category.service";
import { CreateCategoryPayload, UpdateCategoryPayload } from "./model.types";

export const useCreateCategory = (options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateCategoryPayload) => CategoryService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["tableData"] });
            options?.onSuccess?.();
        },
        onError: options?.onError,
    });
};

export const useUpdateCategory = (options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateCategoryPayload) => CategoryService.update(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["tableData"] });
            options?.onSuccess?.();
        },
        onError: options?.onError,
    });
};

export const useDeleteCategory = (options?: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (categoryId: number) => CategoryService.delete(categoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["tableData"] });
            options?.onSuccess?.();
        },
        onError: options?.onError,
    });
};
