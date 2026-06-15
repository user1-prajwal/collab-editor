import { SESSION_COLOR } from '../constants'

function UsersDropdown({ users, username, userList, showUsers, setShowUsers }) {
  return (
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
              borderRadius: '50%', background: SESSION_COLOR, flexShrink: 0
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
  )
}

export default UsersDropdown