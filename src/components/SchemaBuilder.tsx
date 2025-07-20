import { useForm, FormProvider } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { SchemaField } from "@/components/SchemaField"
import React from "react"
import { v4 as uuidv4 } from "uuid"
import DownloadJsonButton from "./DownloadJsonButton";

interface SchemaFieldData {
  id: string
  key: string
  type: "String" | "Number" | "Nested"
  nestedFields?: SchemaFieldData[]
}

interface FormData {
  fields: SchemaFieldData[]
}

export function SchemaBuilder() {

  const methods = useForm<FormData>({
    defaultValues: {
      fields: [{ key: "field1", type: "String", nestedFields: [] }]
    }
  })
  const { watch, setValue } = methods
  const fields = watch("fields") || []


  const [, setRerender] = React.useState({})
  React.useEffect(() => {
    const subscription = methods.watch(() => {
      setRerender({})
    })
    return () => subscription.unsubscribe()
  }, [methods])

  const addField = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  setValue("fields", [
    ...fields,
    { id: uuidv4(), key: `field${fields.length + 1}`, type: "String", nestedFields: [] }
  ])
}

function syntaxHighlight(json: string) {
  if (!json) return ""
  return json
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
      let cls = "text-blue-700"
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "text-blue-700" 
        } else {
          cls = "text-green-700"
        }
      } else if (/true|false/.test(match)) {
        cls = "text-purple-700"
      } else if (/null/.test(match)) {
        cls = "text-gray-500"
      } else {
        cls = "text-orange-600" 
      }
      return `<span class="${cls}">${match}</span>`
    })
}

const generateJsonSchema = (fields: any[]): any => {
    const schema: any = {}
    fields.forEach(field => {
      if (!field || !field.key) return
      if (field.type === "String") {
        schema[field.key] = "string"
      } else if (field.type === "Number") {
        schema[field.key] = "number"
      } else if (field.type === "Nested") {
        schema[field.key] = generateJsonSchema(field.nestedFields || [])
      }
    })
    return schema
  }

  return (
  <div className="max-w-7xl mx-auto bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-2xl shadow-2xl flex gap-10 border border-gray-200">
    <div className="flex-1 bg-white rounded-xl shadow-md border border-gray-300 p-5">
      <FormProvider {...methods}>
        <form>
          {fields.map((field: any, index: number) => (
            <div
              key={field.id}
              className="mb-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SchemaField
                fieldId={`fields[${index}]`}
                onDelete={() => {
                  const currentFields = watch("fields") || []
                  const updatedFields = currentFields.filter((_: any, i: number) => i !== index)
                  setValue("fields", updatedFields)
                }}
              />
            </div>
          ))}
          <Button
            onClick={addField}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
          >
            Add Field
          </Button>
        </form>
      </FormProvider>
    </div>
    <div className="flex-1 bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 overflow-auto max-h-[600px]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-blue-700">JSON Preview</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-blue-700 hover:bg-blue-900 text-white px-3 py-1 rounded text-xs"
              onClick={() => {
                navigator.clipboard.writeText(
                  JSON.stringify(generateJsonSchema(fields), null, 2)
                )
              }}
            >
              Copy
            </Button>
            <DownloadJsonButton json={JSON.stringify(generateJsonSchema(fields), null, 2)} />
          </div>
        </div>
      <pre
        className="text-sm bg-white rounded-lg p-4 border border-gray-200 shadow-inner overflow-x-auto"
        style={{ fontFamily: "Fira Mono, monospace" }}
        dangerouslySetInnerHTML={{
          __html: syntaxHighlight(JSON.stringify(generateJsonSchema(fields), null, 2)),
        }}
      />
    </div>
  </div>
)
}