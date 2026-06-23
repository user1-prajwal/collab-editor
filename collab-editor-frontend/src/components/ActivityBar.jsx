import { useState } from 'react'

const LANGUAGE_ICONS = {
  // javascript: { icon: 'JS', color: '#F7DF1E', bg: '#1a1a00' },
  python: { icon: 'PY', color: '#3776AB', bg: '#00101a' },
  c: { icon: 'C', color: '#A8B9CC', bg: '#0a0a0a' },
  cpp: { icon: 'C++', color: '#00599C', bg: '#00081a' },
  java: { icon: 'JV', color: '#ED8B00', bg: '#1a0f00' },
  typescript: { icon: 'TS', color: '#3178C6', bg: '#00081a' },
  csharp: { icon: 'C#', color: '#9B4F9B', bg: '#0f000f' },
  fsharp: { icon: 'F#', color: '#378BBA', bg: '#00080f' },
  php: { icon: 'PHP', color: '#777BB4', bg: '#0a0a12' },
  ruby: { icon: 'RB', color: '#CC342D', bg: '#1a0000' },
  haskell: { icon: 'HS', color: '#5D4F85', bg: '#0a0810' },
  go: { icon: 'GO', color: '#00ADD8', bg: '#001a1f' },
  rust: { icon: 'RS', color: '#CE422B', bg: '#1a0800' },
  plaintext: { icon: 'TXT', color: '#888888', bg: '#0a0a0a' },
}

function ActivityBar({ activePanel, setActivePanel, activeLanguage, onLanguageChange, users}) {
  return (
    <div style={{
      width: '48px',
      background: '#1e1e1e',
      borderRight: '1px solid #333',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '8px',
      gap: '4px',
      flexShrink: 0,
      zIndex: 10
    }}>

      {/* Files Icon */}
      <ActivityIcon
        title="Files"
        active={activePanel === 'files'}
        onClick={() => setActivePanel(prev => prev === 'files' ? null : 'files')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
          <polyline points="13 2 13 9 20 9"/>
        </svg>
      </ActivityIcon>

      {/* Users Icon */}
      <ActivityIcon
        title={`${users} online`}
        active={activePanel === 'users'}
        onClick={() => setActivePanel(prev => prev === 'users' ? null : 'users')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        {users > 0 && (
          <div style={{
            position: 'absolute',
            top: '4px', right: '4px',
            width: '14px', height: '14px',
            background: '#4CAF50',
            borderRadius: '50%',
            fontSize: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 'bold'
          }}>
            {users > 9 ? '9+' : users}
          </div>
        )}
      </ActivityIcon>

      {/* Divider */}
      <div style={{ width: '32px', height: '1px', background: '#333', margin: '4px 0' }} />

      {/* Language Icons */}
      {Object.entries(LANGUAGE_ICONS).map(([lang, info]) => (
        <ActivityIcon
          key={lang}
          title={lang}
          active={activeLanguage === lang}
          onClick={() => onLanguageChange(lang)}
        >
          <span style={{
            fontSize: '9px',
            fontWeight: 'bold',
            color: activeLanguage === lang ? info.color : '#666',
            fontFamily: 'monospace',
            lineHeight: 1
          }}>
            {info.icon}
          </span>
        </ActivityIcon>
      ))}

    </div>
  )
}

function ActivityIcon({ children, active, onClick, title }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={title}
        style={{
          width: '36px', height: '36px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: active ? '#2d2d2d' : hovered ? '#252525' : 'transparent',
          border: 'none',
          borderLeft: active ? '2px solid #4CAF50' : '2px solid transparent',
          borderRadius: '4px',
          color: active ? 'white' : '#666',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.15s'
        }}
      >
        {children}
      </button>

      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute',
          left: '44px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#1f1f1f',
          border: '1px solid #444',
          borderRadius: '6px',
          padding: '4px 10px',
          color: 'white',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          pointerEvents: 'none'
        }}>
          {title}
        </div>
      )}
    </div>
  )
}

export default ActivityBar