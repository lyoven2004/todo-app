"use client"

import { Trash2 } from "lucide-react"
import { useId, useState } from "react"

import {
    TTaskFormMode,
    TTaskFormValues,
    TTaskItemDto,
} from "@/app/tasks/_config/task.schema"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { createTask, deleteTask, updateTask } from "@/axios/task-api"
import { TASK_FORM_CONFIG } from "@/constants/task"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TaskForm } from "./task-form"
import { handleMutationError } from "@/utils/get-error-message"
import { TCategoryDto } from "@/app/categories/_config/category.schema"
import { deleteCategory } from "@/axios/category-api"
import { useCategories, useCategoryActions } from "@/app/categories/_hooks/category.hook"

type TTaskFormModalProps = {
    mode: TTaskFormMode
    open: boolean
    onOpenChange: (open: boolean) => void
    task: TTaskItemDto
    categories: TCategoryDto[]
    onAddCategory?: (name: string) => void
}

export function TaskFormModal({
    mode,
    open,
    onOpenChange,
    task,
}: TTaskFormModalProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const { categories, isLoading } = useCategories()

    const { title, description } = TASK_FORM_CONFIG[mode]

    const handleClose = () => onOpenChange(false)

    const queryClient = useQueryClient()

    const createTaskMutation = useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
            onOpenChange(false)
        },
        onError: handleMutationError
    })

    const updateTaskMutation = useMutation({
        mutationFn: ({
            taskId,
            data,
        }: {
            taskId: string
            data: Parameters<typeof updateTask>[1]
        }) => updateTask(taskId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
            onOpenChange(false)
        },
        onError: handleMutationError
    })

    const deleteTaskMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", task.status] })
            onOpenChange(false)
        },
        onError: handleMutationError
    })

    const handleDelete = () => {
        setShowDeleteConfirm(false)
        deleteTaskMutation.mutate(task.id)
    }

    const handleSubmit = (values: TTaskFormValues) => {
        const payload = {
            ...values,
            description: values.description || null,
            expiredAt: values.expiredAt || null,
            categoryId: values.categoryId || null,
        }

        if (mode === "create") {
            createTaskMutation.mutate(payload)
            return
        }

        updateTaskMutation.mutate({
            taskId: task.id,
            data: payload,
        })
    }

    const {
        createCategory,
        deleteCategory,
        isDeleting,
    } = useCategoryActions()

    const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)

    const handleAddCategory = (name: string) => {
        createCategory({ name })
    }

    const handleDeleteCategory = () => {
        if (!deleteCategoryId) return
        deleteCategory(deleteCategoryId)
        setDeleteCategoryId(null)
    }

    const isSubmitting =
        createTaskMutation.isPending || updateTaskMutation.isPending

    const submitLabel =
        mode === "create"
            ? createTaskMutation.isPending
                ? "Creating..."
                : "Create"
            : updateTaskMutation.isPending
                ? "Saving changes..."
                : "Save Changes"

    const formId = useId()

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[560px]">
                    <DialogHeader className="border-b border-border/50 bg-muted/30 px-6 pt-6 pb-4">
                        <DialogTitle className="text-xl font-semibold tracking-tight">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-sm text-muted-foreground">
                            {description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="px-6 py-6">
                        <TaskForm
                            defaultValues={task}
                            categories={categories}
                            onSubmit={handleSubmit}
                            onCancel={handleClose}
                            onAddCategory={handleAddCategory}
                            onDeleteCategory={handleDeleteCategory}
                            formId={formId}
                            hideFooter
                        />
                    </div>

                    <DialogFooter className="flex-row justify-end border-t border-border/50 bg-muted/30 px-6 py-4 flex items-center h-full mx-0">
                        <div>
                            {mode === "edit" && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    <Trash2 className="size-4" />
                                    Delete
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="px-4"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                form={formId}
                                disabled={isSubmitting}
                                className="px-5"
                            >
                                {submitLabel}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {mode === 'edit' && (
                <AlertDialog
                    open={showDeleteConfirm}
                    onOpenChange={setShowDeleteConfirm}
                >
                    <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg font-semibold">
                                Delete task
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground">
                                Are you sure you want to delete &quot;{task.title}&quot;? This
                                action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter className="gap-2">
                            <AlertDialogCancel className="rounded-lg">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="rounded-lg bg-red-600 hover:bg-red-700"
                                disabled={deleteTaskMutation.isPending}
                            >
                                {deleteTaskMutation.isPending ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            <AlertDialog
                open={!!deleteCategoryId}
                onOpenChange={(open) => {
                    if (!open) setDeleteCategoryId(null)
                }}
            />
        </>
    )
}



