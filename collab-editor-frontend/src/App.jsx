


import { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import * as Y from 'yjs'

const LANGUAGES = ['javascript', 'python', 'cpp', 'java', 'typescript']

// Generate a random color for each user
function randomColor() {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']
  return colors[Math.floor(Math.random() * colors.length)]
}

// Get room ID from URL, default to 'room1'
function getRoomId() {
  const path = window.location.pathname.replace('/', '')
  return path || 'room1'
}

function App() {
  const [language, setLanguage] = useState('javascript')
  const [output, setOutput] = useState('')
  const [code, setCode] = useState('// Start coding here...')
  const [connected, setConnected] = useState(false)
  const [users, setUsers] = useState(1)

  const ydocRef = useRef(null)
  const wsRef = useRef(null)
  const ytextRef = useRef(null)
  const isRemoteChange = useRef(false)

  useEffect(() => {
    const roomId = getRoomId()
    const ydoc = new Y.Doc()
    const ytext = ydoc.getText('code')
    ydocRef.current = ydoc
    ytextRef.current = ytext

    // Connect to backend
    const ws = new WebSocket(`ws://localhost:4000/${roomId}`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('Connected to server! 🟢')
      setConnected(true)
    }

    ws.onclose = () => {
      console.log('Disconnected 🔴')
      setConnected(false)
    }

    // When we receive an update from another user
    ws.onmessage = async (event) => {
      // const data = JSON.parse(event.data)
        const text = event.data instanceof Blob ? await event.data.text() : event.data
        const data = JSON.parse(text)

      if (data.type === 'code'|| data.type === 'init') {
        isRemoteChange.current = true
        setCode(data.code)
        isRemoteChange.current = false
      }

      if (data.type === 'users') {
        setUsers(data.count)
      }
    }

    return () => {
      ws.close()
    }
  }, [])

  // When local user types, send to server
  function handleCodeChange(value) {
    if (isRemoteChange.current) return
    setCode(value)

    if (wsRef.current?.readyState === 1) {
      wsRef.current.send(JSON.stringify({
        type: 'code',
        code: value
      }))
    }
  }

  function runCode() {
    if (language !== 'javascript') {
      setOutput('⚠️ Browser can only run JavaScript for now!')
      return
    }
    try {
      let result = ''
      const originalLog = console.log
      console.log = (...args) => { result += args.join(' ') + '\n' }
      new Function(code)()
      console.log = originalLog
      setOutput(result || '✅ Ran successfully (no output)')
    } catch (error) {
      setOutput('❌ Error: ' + error.message)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#1e1e1e' }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 20px',
        background: '#2d2d2d',
        borderBottom: '1px solid #444'
      }}>
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
          ⚡ Collab Editor
        </span>

        {/* Connection status */}
        <span style={{
          width: '8px', height: '8px',
          borderRadius: '50%',
          background: connected ? '#4CAF50' : '#f44336',
          display: 'inline-block'
        }} />
        <span style={{ color: '#888', fontSize: '12px' }}>
          {connected ? `Connected — ${users} user(s) online` : 'Disconnected'}
        </span>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            marginLeft: '20px',
            padding: '5px 10px',
            background: '#3a3a3a',
            color: 'white',
            border: '1px solid #555',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>

        <button
          onClick={runCode}
          style={{
            marginLeft: 'auto',
            padding: '6px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          ▶ Run
        </button>
      </div>

      {/* Editor + Output */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        <div style={{ flex: 1 }}>
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
          />
        </div>

        <div style={{
          width: '35%',
          background: '#1a1a1a',
          borderLeft: '1px solid #444',
          padding: '15px',
          overflowY: 'auto'
        }}>
          <p style={{ color: '#888', margin: '0 0 10px', fontSize: '13px' }}>OUTPUT</p>
          <pre style={{ color: '#00ff88', margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap' }}>
            {output || 'Click ▶ Run to see output...'}
          </pre>
        </div>

      </div>
    </div>
  )
}

export default App