const http = require('http')
const express = require('express')
const { WebSocketServer } = require('ws')

const app = express()
const server = http.createServer(app)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.get('/', (req, res) => {
  res.send('Collab Editor Backend is running! ✅')
})

const rooms = new Map()
const roomCode = new Map()
const roomUsers = new Map()

function broadcastUserCount(roomId) {
  const roomClients = rooms.get(roomId)
  if (!roomClients) return
  const count = roomClients.size
  roomClients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: 'users', count }))
    }
  })
}

function broadcastUserList(roomId) {
  const roomClients = rooms.get(roomId)
  const users = roomUsers.get(roomId)
  if (!roomClients || !users) return
  const userList = Array.from(users.values())
  roomClients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: 'userlist', users: userList }))
    }
  })
}

const wss = new WebSocketServer({ server })

wss.on('connection', (ws, req) => {
  const roomId = req.url?.split('/').pop() || 'default'
  console.log(`Someone joined room: ${roomId} 🟢`)

  if (!rooms.has(roomId)) rooms.set(roomId, new Set())
  if (!roomUsers.has(roomId)) roomUsers.set(roomId, new Map())
  rooms.get(roomId).add(ws)

  if (roomCode.has(roomId)) {
    ws.send(JSON.stringify({ type: 'init', code: roomCode.get(roomId) }))
  }

  broadcastUserCount(roomId)

  ws.on('message', async (message) => {
    const text = message.toString()
    const data = JSON.parse(text)

    if (data.type === 'code') {
      roomCode.set(roomId, data.code)
    }

    if (data.type === 'join') {
      roomUsers.get(roomId)?.set(ws, {
        name: data.name,
        color: data.color
      })
      broadcastUserList(roomId)
    }

    // broadcast to everyone else in room
    const roomClients = rooms.get(roomId)
    roomClients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(text)
      }
    })
  })

  ws.on('close', () => {
    console.log(`Someone left room: ${roomId} 🔴`)
    rooms.get(roomId)?.delete(ws)
    roomUsers.get(roomId)?.delete(ws)
    broadcastUserCount(roomId)
    broadcastUserList(roomId)
  })
})

const PORT = 4000
server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})