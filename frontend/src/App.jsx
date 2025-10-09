import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import gitHubLogo from './assets/github-logo-svgrepo-com.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(1)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://github.com/mayazhang1241/gt-cal?tab=readme-ov-file" target="_blank">
          <img src={gitHubLogo} className="logo github" alt="Github logo" />
        </a>
        <p>
          ^__________________________________
        </p>
        <p>
          clicking on it sends you to our GitHub Page.
        </p>
      </div>
      <h1>GTCalendar</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count * 2)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more!!!
      </p>
    </>
  )
}

export default App
