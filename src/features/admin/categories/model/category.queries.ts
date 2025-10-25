import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "./category.service";

export const useCategoriesList = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => CategoryService.getAll({ offset: 0, limit: 100 }),
    });
};

export const useCategoryDetail = (categoryId: number) => {
    return useQuery({
        queryKey: ["categories", categoryId],
        queryFn: () => CategoryService.getById(categoryId),
        enabled: !!categoryId,
    });
};
