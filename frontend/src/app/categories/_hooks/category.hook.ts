import { useQuery } from "@tanstack/react-query"
import { getCategoryList } from "@/axios/category-api"
import { TGetCategoryListRequestDto } from "@/app/categories/_config/category.schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCategory, deleteCategory } from "@/axios/category-api"

export function useCategories(params?: TGetCategoryListRequestDto) {
    const query = useQuery({
        queryKey: ["categories", params],
        queryFn: () => getCategoryList(params),
    })

    return {
        ...query,
        categories: query.data?.data ?? [],
    }
}

export function useCategoryActions() {
    const queryClient = useQueryClient()

    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
        },
    })

    return {
        createCategory: createMutation.mutate,
        deleteCategory: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isDeleting: deleteMutation.isPending,
    }
}