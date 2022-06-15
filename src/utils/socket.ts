let io

export default {
  init: httpServer => {
    io = require('socket.io')(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false
    })
    return io
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io is not initialized')
    }
    return io
  },
}