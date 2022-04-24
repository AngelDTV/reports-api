import Ws from 'App/Services/Ws'
import fetch from 'node-fetch';
Ws.boot()
/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', (socket) => {
  console.log('New connection from', socket.handshake.address)
  socket.emit('news', { message: "login-request", userEmail: "aaa@gmail.com"})

  socket.on('news', (data) => {
    console.log(data)
  })

  socket.on('login-attempt', async (data) => {
    if (data.message === "login-accepted"){
      console.log(data.userEmail)
      const response = await Auth(data.userEmail)
      console.log(response?.token)
      socket.emit('login-client', { message: "login-accepted", token: response?.token })
    }
  })

  socket.on('my other event', (data) => {
    console.log(data)
  })
})

type AuthResponse = {
  token: string;
};

async function Auth(email) {
  try {
    // 👇️ const response: Response
    const response = await fetch('http://127.0.0.1:3333/api/v1/auth/token', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    // 👇️ const result: CreateUserResponse
    const result = (await response.json()) as AuthResponse

    console.log('result is: ', JSON.stringify(result, null, 4));

    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.log('error message: ', error.message);
      return null;
    } else {
      console.log('unexpected error: ', error);
      return null;
    }
  }
}



