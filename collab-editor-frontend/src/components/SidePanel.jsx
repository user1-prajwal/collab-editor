function SidePanel({ activePanel, files, activeFileId, setActiveFileId, showNewFile, setShowNewFile, newFileName, setNewFileName, createNewFile, username, userList, SESSION_COLOR }) {
  if (!activePanel) return null

  return (
    <div style={{
      width: '220px',
      background: '#252526',
      borderRight: '1px solid #333',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden'
    }}>

      {/* Panel Header */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid #333',
        fontSize: '11px',
        fontWeight: 'bold',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        {activePanel === 'files' ? 'Explorer' : 'Users Online'}
      </div>

      {/* Files Panel */}
      {activePanel === 'files' && (
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          {/* New File Button */}
          <div style={{
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #2a2a2a'
          }}>
            <span style={{ color: '#888', fontSize: '11px' }}>FILES</span>
            <button
              type="button"
              onClick={() => setShowNewFile(prev => !prev)}
              style={{
                background: 'transparent', border: 'none',
                color: '#888', cursor: 'pointer',
                fontSize: '18px', lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '20px', height: '20px',
                borderRadius: '3px'
              }}
              title="New file"
            >
              +
            </button>
          </div>

          {/* New File Input */}
          {showNewFile && (
            <div style={{ padding: '6px 10px', borderBottom: '1px solid #2a2a2a' }}>
              <input
                type="text"
                placeholder="filename.py"
                autoFocus
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') createNewFile()
                  if (e.key === 'Escape') setShowNewFile(false)
                }}
                style={{
                  width: '100%', padding: '4px 8px',
                  background: '#1e1e1e', border: '1px solid #4CAF50',
                  borderRadius: '4px', color: 'white',
                  fontSize: '12px', outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* File List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => setActiveFileId(file.id)}
                style={{
                  padding: '6px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: file.id === activeFileId ? '#37373d' : 'transparent',
                  borderLeft: file.id === activeFileId ? '2px solid #4CAF50' : '2px solid transparent',
                  color: file.id === activeFileId ? 'white' : '#ccc',
                  fontSize: '13px',
                }}
              >
                <span style={{ fontSize: '14px' }}>📄</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {file.name}
                </span>
              </div>
            ))}
          </div>

        </div>
      )}


    </div>
  )
}

export default SidePanel