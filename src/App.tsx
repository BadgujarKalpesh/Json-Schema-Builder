import { SchemaBuilder } from '@/components/SchemaBuilder'
import ThemeToggleButton from "./components/ThemeToggleButton";


function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="flex justify-end">
        <ThemeToggleButton />
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-white">
          JSON Schema Builder
      </h1>
      <SchemaBuilder />
    </div>
  )
}

export default App