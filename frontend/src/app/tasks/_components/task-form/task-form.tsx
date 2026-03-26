"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar, Check, ChevronDown, Plus } from "lucide-react"
import { useForm } from "react-hook-form"

import {
  TTaskCategoryDto,
  TTaskFormValues,
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

type TTaskFormProps = {
  defaultValues?: Partial<TTaskFormValues>
  categories: TTaskCategoryDto[]
  onSubmit: (values: TTaskFormValues) => void
  onCancel?: () => void
  onAddCategory?: (name: string) => void
  submitLabel?: string
  hideFooter?: boolean
}

function StatusValue({ status }: { status: TTaskFormValues["status"] }) {
  const Icon = STATUS_ICONS[status]
  const option = TASK_STATUS_OPTIONS.find((item) => item.value === status)

  return (
    <span className="flex items-center gap-2">
      <Icon className="size-4" />
      <span>{option?.label ?? status}</span>
    </span>
  )
}

function PriorityValue({
  priority,
}: {
  priority: TTaskFormValues["priority"]
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
  onCancel,
  onAddCategory,
  hideFooter = false,
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
      dueDate: defaultValues?.dueDate ?? "",
      category: defaultValues?.category ?? "",
    },
  })

  const selectedCategoryId = form.watch("category")
  const selectedDate = form.watch("dueDate")

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
        id="task-form"
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
                name="category"
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
                                <span
                                  className={cn(
                                    "size-2.5 rounded-full",
                                    selectedCategory.color?.split(" ")[0]
                                  )}
                                />
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
                              <button
                                type="button"
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                                onClick={handleCreateCategory}
                              >
                                <Plus className="size-4 text-muted-foreground" />
                                <span>Create &quot;{newCategoryName}&quot;</span>
                              </button>
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
                                  className="flex items-center justify-between"
                                >
                                  <span className="flex items-center gap-2">
                                    <span
                                      className={cn(
                                        "size-2.5 rounded-full",
                                        category.color?.split(" ")[0]
                                      )}
                                    />
                                    {category.name}
                                  </span>

                                  {field.value === category.id && (
                                    <Check className="size-4 text-primary" />
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
                        <SelectTrigger className="h-10 bg-background hover:bg-muted/50">
                          <SelectValue>
                            <PriorityValue priority={field.value} />
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {PRIORITY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <span className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "size-2 rounded-full",
                                  option.dotClassName
                                )}
                              />
                              <span>{option.label}</span>
                            </span>
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
                name="dueDate"
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
                          selected={
                            selectedDate ? new Date(selectedDate) : undefined
                          }
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
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 bg-background hover:bg-muted/50">
                          <SelectValue>
                            <StatusValue status={field.value} />
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {TASK_STATUS_OPTIONS.map((option) => {
                          const Icon = STATUS_ICONS[option.value]
                          const config = STATUS_UI_CONFIG[option.value]

                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <span className="flex items-center gap-2">
                                <Icon className={cn("size-4", config.iconClassName)} />
                                <span>{option.label}</span>
                              </span>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {!hideFooter && (
          <div className="flex items-center justify-end gap-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}