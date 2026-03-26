"use client"

import { useMemo, useState } from "react"
import { Trash2 } from "lucide-react"

import {
    TTaskCategoryDto,
    TTaskFormValues,
    TTaskItemDto,
} from "@/app/tasks/_config/task.schema"

import { Button } from "@/components/ui/button"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { TaskForm } from "./task-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createTask, deleteTask, updateTask } from "@/axios/task-api"

export type TTaskFormMode = "create" | "edit"

type TTaskFormModalProps = {
    mode: TTaskFormMode
    open: boolean
    onOpenChange: (open: boolean) => void
    task?: TTaskItemDto
    categories: TTaskCategoryDto[]
    onAddCategory?: (name: string) => void
}

export function TaskFormModal({
    mode,
    open,
    onOpenChange,
    task,
    categories,
    onAddCategory,
}: TTaskFormModalProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const defaultValues = useMemo<Partial<TTaskFormValues>>(() => {
        if (task) {
            return {
                title: task.title,
                description: task.description ?? "",
                status: task.status,
                priority: task.priority,
                dueDate: task.expiredAt ?? "",
                category: task.categoryId ?? "",
            }
        }

        return {
            title: "",
            description: "",
            status: "NOT_STARTED",
            priority: "MEDIUM",
            dueDate: "",
            category: "",
        }
    }, [mode, task])

    const title = mode === "create" ? "Create Task" : "Edit Task"
    const description =
        mode === "create"
            ? "Add a new task with all the important details."
            : "Update the details for this task."
    const submitLabel = mode === "create" ? "Create Task" : "Save Changes"

    const handleClose = () => onOpenChange(false)

    const queryClient = useQueryClient()
    const createTaskMutation = useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
            onOpenChange(false)
        },
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
    })

    const deleteTaskMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
            onOpenChange(false)
        },
    })

    const handleDelete = () => {
        if (!task) return
        setShowDeleteConfirm(false)
        deleteTaskMutation.mutate(task.id)
    }

    const handleSubmit = (values: TTaskFormValues) => {
        const payload = {
            title: values.title,
            description: values.description || null,
            status: values.status,
            priority: values.priority,
            expiredAt: values.dueDate || null,
            categoryId: values.category || null,
        }

        if (mode === "create") {
            createTaskMutation.mutate(payload)
            return
        }

        if (!task) return

        updateTaskMutation.mutate({
            taskId: task.id,
            data: payload,
        })
    }

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
                            defaultValues={defaultValues}
                            categories={categories}
                            onSubmit={handleSubmit}
                            onCancel={handleClose}
                            onAddCategory={onAddCategory}
                            submitLabel={submitLabel}
                            hideFooter
                        />
                    </div>

                    <DialogFooter className="flex-row justify-end border-t border-border/50 bg-muted/30 px-6 py-4 flex items-center h-full mx-0">
                            <div>
                                {mode === "edit" && task && (
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
                                    form="task-form"
                                    // disabled={isSubmitting}
                                    className="px-5"
                                >
                                    Submit
                                    {/* {isSubmitting ? "Saving..." : submitLabel} */}
                                </Button>
                            </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {task && (
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
                            // disabled={isDeleting}
                            >
                                Delete
                                {/* {isDeleting ? "Deleting..." : "Delete"} */}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    )
}



