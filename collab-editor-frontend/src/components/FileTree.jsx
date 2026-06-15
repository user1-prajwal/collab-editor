function FileTree({ files, activeFileId, setActiveFileId, showNewFile, setShowNewFile, newFileName, setNewFileName, createNewFile }) {
  return (
    <div style={{
      width: '200px',
      background: '#252526',
      borderRight: '1px solid #444',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0
    }}>

      {/* Header */}
      <div style={{
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #444'
      }}>
        <span style={{ color: '#888', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
          Files
        </span>
        <button
          onClick={() => setShowNewFile(prev => !prev)}
          style={{
            background: 'transparent', border: 'none',
            color: '#888', cursor: 'pointer',
            fontSize: '18px', lineHeight: 1, padding: 0
          }}
          title="New file"
        >
          +
        </button>
      </div>

      {/* New File Input */}
      {showNewFile && (
        <div style={{ padding: '8px' }}>
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
              padding: '7px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: file.id === activeFileId ? '#2d2d2d' : 'transparent',
              borderLeft: file.id === activeFileId ? '2px solid #4CAF50' : '2px solid transparent',
              color: file.id === activeFileId ? 'white' : '#888',
              fontSize: '13px',
            }}
          >
            <span>📄</span>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {file.name}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}

export default FileTree