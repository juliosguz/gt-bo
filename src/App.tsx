import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold">Vite + React</h1>
      <div className="flex flex-col items-center gap-4">
        <button className="btn btn-primary" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p className="text-sm opacity-60">
          Edit <code className="kbd kbd-sm">src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  )
}

export default App
