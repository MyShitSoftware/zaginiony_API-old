module.exports = {
  async get_user_details({ session }) {
    return { success:true, result: session }
  },

  async management_server_list() {
    return { success: true, result: [
      { id: 1, name: 'Server 1', ip: '127.0.0.1', query_port: '25565', rcon_port: '7777', category: 1 },
      { id: 2, name: 'Server 2', ip: '127.0.0.1', query_port: '25565', rcon_port: '7777', category: 1 },
      { id: 3, name: 'Server 3', ip: '127.0.0.1', query_port: '25565', rcon_port: '7777', category: 2 },
     ]
    }
  }
}