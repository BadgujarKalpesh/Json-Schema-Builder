import React from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrashIcon, PlusIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"

interface SchemaFieldProps {
  fieldId: string
  nestLevel?: number
  onDelete: () => void
}

export function SchemaField({ fieldId, nestLevel = 0, onDelete }: SchemaFieldProps) {
  const { register, watch, setValue } = useFormContext()
  const type = watch(`${fieldId}.type`)
  const nestedFields = watch(`${fieldId}.nestedFields`) || []

  React.useEffect(() => {
    register(`${fieldId}.key`)
    register(`${fieldId}.type`)
    register(`${fieldId}.nestedFields`)
  }, [register, fieldId])

  const addNestedField = () => {
    const updatedFields = [
      ...nestedFields,
      { id: uuidv4(), key: `field${nestedFields.length + 1}`, type: "String", nestedFields: [] }
    ]
    setValue(`${fieldId}.nestedFields`, updatedFields)
  }

  return (
  <div
    className={cn(
      "mb-1 p-2 border-l-2",
      type === "Nested"
        ? "border-blue-200 bg-blue-50"
        : "border-gray-200 bg-white",
      nestLevel > 0 && "ml-4"
    )}
    style={{ fontSize: "0.92rem" }}
  >
    <div className="flex items-center gap-1">
      <Input
        {...register(`${fieldId}.key`)}
        placeholder="Field name"
        className="w-1/2 h-8 text-xs px-2 py-1"
      />
      <Select
        value={type}
        onValueChange={(value) => setValue(`${fieldId}.type`, value)}
      >
        <SelectTrigger className="w-1/5 h-8 text-xs px-2 py-1">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-100 border border-gray-200 text-xs">
          <SelectItem value="String">String</SelectItem>
          <SelectItem value="Number">Number</SelectItem>
          <SelectItem value="Nested">Nested</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={onDelete}
        title="Delete field"
      >
        <TrashIcon className="h-3.5 w-3.5" />
      </Button>
      {type === "Nested" && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={e => {
            e.preventDefault()
            addNestedField()
          }}
          title="Add nested field"
        >
          <PlusIcon className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
      {type === "Nested" && (
        <div className="mt-1">
          {nestedFields.map((field: any, index: number) => (
            <SchemaField
              key={field.id}
              fieldId={`${fieldId}.nestedFields[${index}]`}
              nestLevel={nestLevel + 1}
              onDelete={() => {
                const currentNestedFields = watch(`${fieldId}.nestedFields`) || []
                const updatedFields = currentNestedFields.filter((f: any) => f.id !== field.id)
                setValue(`${fieldId}.nestedFields`, updatedFields)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
  }