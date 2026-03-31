"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Calendar, Check, ChevronDown, Plus, X } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import {
  TTaskFormValues,
  TTaskPriority,
  TTaskStatus,
  taskFormSchema,
} from "@/app/tasks/_config/task.schema"
import {
  PRIORITY_CONFIG,
  PRIORITY_OPTIONS,
  STATUS_ICONS,
  STATUS_UI_CONFIG,
  TASK_STATUS_OPTIONS,
} from "@/constants/task"

import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { TCategoryDto } from "@/app/categories/_config/category.schema"

type TTaskFormProps = {
  defaultValues?: Partial<TTaskFormValues>
  categories: TCategoryDto[]
  onSubmit: (values: TTaskFormValues) => void
  onCancel?: () => void
  onAddCategory?: (name: string) => void
  onDeleteCategory?: (categoryId: string) => void
  hideFooter?: boolean
  formId: string
}

function StatusValue({ status }
  : { status: TTaskStatus }) {
  const Icon = STATUS_ICONS[status]
  const config = STATUS_UI_CONFIG[status]

  return (
    <span className="flex w-full items-center gap-2">
      <Icon className={cn("size-4 shrink-0", config.iconClassName)} />
      <span>{status}</span>
    </span>
  )
}

function PriorityValue({
  priority,
}: {
  priority: TTaskPriority
}) {
  const option = PRIORITY_OPTIONS.find((item) => item.value === priority)
  const config = PRIORITY_CONFIG[priority]

  return (
    <span className="flex items-center gap-2">
      <span className={cn("size-2 rounded-full", config.barClassName)} />
      <span>{option?.label ?? priority}</span>
    </span>
  )
}

export function TaskForm({
  defaultValues,
  categories,
  onSubmit,
  onAddCategory,
  onDeleteCategory,
  formId,
}: TTaskFormProps) {
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false)
  const [datePopoverOpen, setDatePopoverOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")

  const form = useForm<TTaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      status: defaultValues?.status ?? "NOT_STARTED",
      priority: defaultValues?.priority ?? "MEDIUM",
      expiredAt: defaultValues?.expiredAt ?? "",
      categoryId: defaultValues?.categoryId ?? "",
    },
  })

  const selectedCategoryId = form.watch("categoryId")
  const selectedDate = form.watch("expiredAt")

  const selectedCategory = useMemo(
    () => categories.find((item) => item.id === selectedCategoryId),
    [categories, selectedCategoryId]
  )

  const handleCreateCategory = () => {
    const name = newCategoryName.trim()
    if (!name) return
    onAddCategory?.(name)
    setNewCategoryName("")
    setCategoryPopoverOpen(false)
  }

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="What needs to be done?"
                    className="h-11 text-base placeholder:text-muted-foreground/60"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add more details about this task..."
                    className="min-h-[100px] resize-none text-sm leading-relaxed placeholder:text-muted-foreground/60"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Details
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-4 rounded-xl border border-border/50 bg-muted/30 p-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-medium text-muted-foreground">
                      Category
                    </FormLabel>

                    <Popover
                      open={categoryPopoverOpen}
                      onOpenChange={setCategoryPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={categoryPopoverOpen}
                            className={cn(
                              "h-10 w-full justify-between bg-background font-normal hover:bg-muted/50",
                              !selectedCategory && "text-muted-foreground"
                            )}
                          >
                            {selectedCategory ? (
                              <span className="flex items-center gap-2">
                                <span className="truncate">
                                  {selectedCategory.name}
                                </span>
                              </span>
                            ) : (
                              <span>Select...</span>
                            )}
                            <ChevronDown className="size-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent className="w-[240px] p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder="Search or create..."
                            value={newCategoryName}
                            onValueChange={setNewCategoryName}
                          />
                          <CommandList>
                            <CommandEmpty>
                              <Button
                                type="button"
                                variant={'ghost'}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                                onClick={handleCreateCategory}
                              >
                                <Plus className="size-4 text-muted-foreground" />
                                <span>Create &quot;{newCategoryName}&quot;</span>
                              </Button>
                            </CommandEmpty>

                            <CommandGroup>
                              {categories.map((category) => (
                                <CommandItem
                                  key={category.id}
                                  value={category.name}
                                  onSelect={() => {
                                    field.onChange(category.id)
                                    setCategoryPopoverOpen(false)
                                  }}
                                  className="group flex items-center justify-between"
                                >
                                  <span
                                    onClick={() => {
                                      field.onChange(category.id)
                                      setCategoryPopoverOpen(false)
                                    }}
                                    className="flex-1 cursor-pointer"
                                  >
                                    {category.name}
                                  </span>

                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onDeleteCategory?.(category.id)
                                    }}
                                    className="justify-end ml-auto gap-2 opacity-0 group-hover:opacity-100 hover:bg-red-50 transition"
                                  >
                                    <X className="size-4 text-red-500 hover:text-red-600 " />
                                  </Button>

                                  {field.value === category.id && (
                                    <Check className="size-4 text-primary-foreground" />
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>

                            {newCategoryName && categories.length > 0 && (
                              <>
                                <CommandSeparator />
                                <CommandGroup>
                                  <CommandItem
                                    onSelect={handleCreateCategory}
                                    className="flex items-center gap-2"
                                  >
                                    <Plus className="size-4" />
                                    Create &quot;{newCategoryName}&quot;
                                  </CommandItem>
                                </CommandGroup>
                              </>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-medium text-muted-foreground">
                      Priority
                    </FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="!h-10 mb-0 w-full bg-background hover:bg-muted/50">
                          <SelectValue>
                            {field.value && <PriorityValue priority={field.value} />}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {PRIORITY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value} textValue={option.label}>
                            <PriorityValue priority={option.value} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiredAt"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-medium text-muted-foreground">
                      Due Date
                    </FormLabel>

                    <Popover
                      open={datePopoverOpen}
                      onOpenChange={setDatePopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-10 w-full justify-start bg-background font-normal hover:bg-muted/50",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 size-4 text-muted-foreground" />
                            {selectedDate ? (
                              format(new Date(selectedDate), "MMM d, yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate ? new Date(selectedDate) : undefined}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          onSelect={(date) => {
                            if (!date) return
                            field.onChange(format(date, "yyyy-MM-dd"))
                            setDatePopoverOpen(false)
                          }}
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-medium text-muted-foreground">
                      Status
                    </FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || "NOT_STARTED"}
                    >
                      <FormControl>
                        <SelectTrigger className="!h-10 mb-0 w-full bg-background hover:bg-muted/50">
                          <SelectValue className="mr-2 size-4 text-muted-foreground">
                            <StatusValue status={field.value || "NOT_STARTED"} />
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {TASK_STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value} textValue={option.label}>
                            <StatusValue status={option.value} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}