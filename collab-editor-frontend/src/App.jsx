import { useEffect, useRef, useState } from 'react'
import { Routes, Route, useParams, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'

const LANGUAGES = ['javascript', 'python', 'cpp', 'java', 'typescript']
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#DDA0DD']
const MY_COLOR = COLORS[Math.floor(Math.random() * COLORS.length)]

// ─── LANDING PAGE ───────────────────────────────────────────────
function Landing() {
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function createRoom() {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase()
    navigate(`/room/${roomId}`)
  }

  function joinRoom() {
    if (!joinCode.trim()) { setError('Please enter a room code!'); return }
    navigate(`/room/${joinCode.trim().toUpperCase()}`)
  }

  return (
    <div style={{
      height: '100vh', background: '#1e1e1e',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '40px',
        width: '100%', maxWidth: '480px', padding: '0 20px'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'white', fontSize: '42px', margin: '0 0 8px' }}>
            ⚡ Collab Editor
          </h1>
          <p style={{ color: '#888', fontSize: '16px', margin: 0 }}>
            Real-time collaborative code editor
          </p>
        </div>

        {/* Create Room */}
        <div style={{
          background: '#2d2d2d', border: '1px solid #444',
          borderRadius: '12px', padding: '30px',
          width: '100%', boxSizing: 'border-box'
        }}>
          <h2 style={{ color: 'white', margin: '0 0 8px', fontSize: '18px' }}>
            🚀 Start a new room
          </h2>
          <p style={{ color: '#888', margin: '0 0 20px', fontSize: '13px' }}>
            Create a room and share the code with friends
          </p>
          <button onClick={createRoom} style={{
            width: '100%', padding: '12px',
            background: '#4CAF50', color: 'white',
            border: 'none', borderRadius: '8px',
            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
          }}>
            Create New Room
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
          <div style={{ flex: 1, height: '1px', background: '#444' }} />
          <span style={{ color: '#666', fontSize: '14px' }}>or join existing</span>
          <div style={{ flex: 1, height: '1px', background: '#444' }} />
        </div>

        {/* Join Room */}
        <div style={{
          background: '#2d2d2d', border: '1px solid #444',
          borderRadius: '12px', padding: '30px',
          width: '100%', boxSizing: 'border-box'
        }}>
          <h2 style={{ color: 'white', margin: '0 0 8px', fontSize: '18px' }}>
            🔗 Join a room
          </h2>
          <p style={{ color: '#888', margin: '0 0 20px', fontSize: '13px' }}>
            Enter the room code shared by your friend
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Room code e.g. ABC123"
              value={joinCode}
              maxLength={6}
              onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
              style={{
                flex: 1, padding: '10px 14px',
                background: '#1e1e1e', border: '1px solid #555',
                borderRadius: '8px', color: 'white',
                fontSize: '15px', outline: 'none',
                letterSpacing: '2px', fontWeight: 'bold'
              }}
            />
            <button onClick={joinRoom} style={{
              padding: '10px 20px', background: '#2563EB',
              color: 'white', border: 'none',
              borderRadius: '8px', fontSize: '15px',
              fontWeight: 'bold', cursor: 'pointer'
            }}>
              Join →
            </button>
          </div>
          {error && <p style={{ color: '#f87171', margin: '8px 0 0', fontSize: '13px' }}>{error}</p>}
        </div>

      </div>
    </div>
  )
}

// ─── EDITOR PAGE ─────────────────────────────────────────────────
function EditorPage() {
  const { roomId } = useParams()

  const [username, setUsername] = useState('')
  const [nameEntered, setNameEntered] = useState(false)
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('// Start coding here...')
  const [output, setOutput] = useState('')
  const [connected, setConnected] = useState(false)
  const [users, setUsers] = useState(0)
  const [cursors, setCursors] = useState({})
  const [userList, setUserList] = useState([])
  const [showUsers, setShowUsers] = useState(false)

  const wsRef = useRef(null)
  const isRemoteChange = useRef(false)
  const editorRef = useRef(null)
  const decorationsRef = useRef([])

  function sendJoin(name) {
    if (wsRef.current?.readyState === 1) {
      wsRef.current.send(JSON.stringify({
        type: 'join',
        name: name,
        color: MY_COLOR
      }))
    }
  }

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:4000/${roomId}`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('Connected! 🟢')
      setConnected(true)
    }

    ws.onclose = () => {
      console.log('Disconnected 🔴')
      setConnected(false)
    }

    ws.onmessage = async (event) => {
      const text = event.data instanceof Blob ? await event.data.text() : event.data
      const data = JSON.parse(text)

      if (data.type === 'code' || data.type === 'init') {
        isRemoteChange.current = true
        setCode(data.code)
        isRemoteChange.current = false
      }
      if (data.type === 'users') setUsers(data.count)
      if (data.type === 'userlist') setUserList(data.users)
      if (data.type === 'cursor') {
        setCursors((prev) => ({
          ...prev,
          [data.name]: { name: data.name, color: data.color, line: data.line, column: data.column }
        }))
      }
    }

    const handleClickOutside = () => setShowUsers(false)
    document.addEventListener('click', handleClickOutside)

    return () => {
      ws.close()
      document.removeEventListener('click', handleClickOutside)
    }
  }, [roomId])

  // Draw remote cursors
  useEffect(() => {
    if (!editorRef.current) return
    const newDecorations = Object.values(cursors).map((cursor) => ({
      range: {
        startLineNumber: cursor.line, startColumn: cursor.column,
        endLineNumber: cursor.line, endColumn: cursor.column + 1
      },
      options: {
        beforeContentClassName: 'remote-cursor',
        hoverMessage: { value: `👤 ${cursor.name}` }
      }
    }))
    decorationsRef.current = editorRef.current.deltaDecorations(
      decorationsRef.current, newDecorations
    )
  }, [cursors])

  function handleCodeChange(value) {
    if (isRemoteChange.current) return
    setCode(value)
    if (wsRef.current?.readyState === 1) {
      wsRef.current.send(JSON.stringify({ type: 'code', code: value }))
    }
  }

  function handleCursorChange(e) {
    if (wsRef.current?.readyState === 1) {
      wsRef.current.send(JSON.stringify({
        type: 'cursor', name: username, color: MY_COLOR,
        line: e.position.lineNumber, column: e.position.column
      }))
    }
  }

  function handleEditorMount(editor) {
    editorRef.current = editor
    editor.onDidChangeCursorPosition(handleCursorChange)
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

      {/* Username Popup */}
      {!nameEntered && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#2d2d2d', padding: '40px', borderRadius: '12px',
            border: '1px solid #444', display: 'flex',
            flexDirection: 'column', gap: '16px', minWidth: '320px'
          }}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '22px' }}>
              ⚡ Welcome to Collab Editor
            </h2>
            <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>
              Room: <span style={{ color: '#4CAF50', fontWeight: 'bold', letterSpacing: '2px' }}>{roomId}</span>
            </p>
            <input
              type="text"
              placeholder="Enter your name..."
              maxLength={20}
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && username.trim()) {
                  setNameEntered(true)
                  sendJoin(username.trim())
                }
              }}
              style={{
                padding: '10px 14px', background: '#1e1e1e',
                border: '1px solid #555', borderRadius: '6px',
                color: 'white', fontSize: '15px', outline: 'none'
              }}
            />
            <button
              onClick={() => {
                if (username.trim()) {
                  setNameEntered(true)
                  sendJoin(username.trim())
                }
              }}
              style={{
                padding: '10px', background: '#4CAF50',
                color: 'white', border: 'none', borderRadius: '6px',
                fontSize: '15px', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              Join Room →
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 20px', background: '#2d2d2d',
        borderBottom: '1px solid #444', flexWrap: 'wrap'
      }}>

        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
          ⚡ Collab Editor
        </span>

        {/* Room Code */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#1e1e1e', border: '1px solid #555',
          borderRadius: '6px', padding: '4px 12px'
        }}>
          <span style={{ color: '#888', fontSize: '12px' }}>Room:</span>
          <span style={{ color: '#4CAF50', fontSize: '13px', fontWeight: 'bold', letterSpacing: '2px' }}>
            {roomId}
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(roomId)
              alert('Room code copied! 🎉')
            }}
            style={{
              background: 'transparent', border: 'none',
              color: '#888', cursor: 'pointer', fontSize: '14px', padding: '0 4px'
            }}
            title="Copy room code"
          >
            📋
          </button>
        </div>

        {/* Connection dot */}
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: connected ? '#4CAF50' : '#f44336',
          display: 'inline-block'
        }} />

        {/* Users Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowUsers(prev => !prev) }}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 12px', background: '#3a3a3a',
              border: '1px solid #555', borderRadius: '6px',
              color: 'white', cursor: 'pointer', fontSize: '13px'
            }}
          >
            👥 {users} online ▾
          </button>

          {showUsers && (
            <div style={{
              position: 'absolute', top: '36px', left: 0,
              background: '#2d2d2d', border: '1px solid #444',
              borderRadius: '8px', minWidth: '180px',
              zIndex: 999, overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
            }}>
              {/* You */}
              <div style={{
                padding: '10px 14px', display: 'flex',
                alignItems: 'center', gap: '8px',
                borderBottom: '1px solid #444'
              }}>
                <span style={{
                  width: '10px', height: '10px',
                  borderRadius: '50%', background: MY_COLOR, flexShrink: 0
                }} />
                <span style={{ color: 'white', fontSize: '13px' }}>{username}</span>
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#4CAF50', fontWeight: 'bold' }}>you</span>
              </div>

              {/* Others */}
              {userList.filter(u => u.name !== username).length === 0 ? (
                <div style={{ padding: '10px 14px', color: '#666', fontSize: '12px' }}>
                  No one else yet...
                </div>
              ) : (
                userList.filter(u => u.name !== username).map((user) => (
                  <div key={user.name} style={{
                    padding: '10px 14px', display: 'flex',
                    alignItems: 'center', gap: '8px',
                    borderBottom: '1px solid #333'
                  }}>
                    <span style={{
                      width: '10px', height: '10px',
                      borderRadius: '50%', background: user.color, flexShrink: 0
                    }} />
                    <span style={{ color: 'white', fontSize: '13px' }}>{user.name}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            marginLeft: '10px', padding: '5px 10px',
            background: '#3a3a3a', color: 'white',
            border: '1px solid #555', borderRadius: '5px', cursor: 'pointer'
          }}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>

        {/* Run Button */}
        <button
          onClick={runCode}
          style={{
            marginLeft: 'auto', padding: '6px 20px',
            background: '#4CAF50', color: 'white',
            border: 'none', borderRadius: '5px',
            cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'
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
            onMount={handleEditorMount}
            theme="vs-dark"
          />
        </div>

        <div style={{
          width: '35%', background: '#1a1a1a',
          borderLeft: '1px solid #444',
          padding: '15px', overflowY: 'auto'
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

// ─── APP ROUTER ──────────────────────────────────────────────────
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/room/:roomId" element={<EditorPage />} />
    </Routes>
  )
}

export default App