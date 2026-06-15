function ChatPanel({ messages, newMessage, setNewMessage, sendMessage, username, setShowChat }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '340px',
      height: '460px',
      background: '#181818',
      border: '1px solid #2f2f2f',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.65)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 998,
      overflow: 'hidden'
    }}>

      {/* Header */}
      <div style={{
        padding: '14px 18px',
        background: '#202020',
        borderBottom: '1px solid #303030',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <span style={{ color: '#f5f5f5', fontSize: '15px', fontWeight: '600' }}>
          💬 Room Chat
        </span>
        <button
          onClick={() => setShowChat(false)}
          style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '18px' }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div
        id="chat-messages"
        style={{
          flex: 1, overflowY: 'auto', padding: '16px',
          display: 'flex', flexDirection: 'column', gap: '14px',
          background: '#181818'
        }}
      >
        {messages.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: '#666', fontSize: '13px', lineHeight: '1.8' }}>
            No messages yet 👋<br />Start the conversation
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.name === username
            return (
              <div key={index} style={{
                display: 'flex', flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start', gap: '5px'
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  flexDirection: isMe ? 'row-reverse' : 'row'
                }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: msg.color }}>
                    {isMe ? 'You' : msg.name}
                  </span>
                  <span style={{ fontSize: '10px', color: '#777' }}>{msg.time}</span>
                </div>
                <div style={{
                  background: isMe ? '#2563EB' : '#242424',
                  color: '#f3f4f6', padding: '10px 14px',
                  borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  fontSize: '13.5px', maxWidth: '240px',
                  wordBreak: 'break-word', lineHeight: '1.6',
                  border: isMe ? 'none' : '1px solid #333',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.25)'
                }}>
                  {msg.text}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '12px', borderTop: '1px solid #2f2f2f',
        display: 'flex', gap: '10px', background: '#202020'
      }}>
        <input
          type="text"
          placeholder="Message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={{
            flex: 1, padding: '10px 14px',
            background: '#121212', border: '1px solid #333',
            borderRadius: '10px', color: '#f5f5f5',
            fontSize: '13px', outline: 'none'
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '10px 14px', background: '#2563EB',
            color: 'white', border: 'none', borderRadius: '10px',
            cursor: 'pointer', fontSize: '14px', fontWeight: '600'
          }}
        >
          ➤
        </button>
      </div>

    </div>
  )
}

export default ChatPanel