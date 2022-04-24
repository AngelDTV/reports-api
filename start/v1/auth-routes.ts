import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {
  Route.post('register', 'v1/AuthController.register') // Registra un usuario
  Route.post('login', 'v1/AuthController.login') // Login general
  Route.post('login-mobile', 'v1/AuthController.loginMobile') // Login de la app movil
  Route.post('token', 'v1/AuthController.loginWithApp') // Login con socket.io
  Route.post('login/code', 'v1/AuthController.loginWithOneTimeCode') // Login con codigo de verificacion

  Route.group(() => {
    Route.post('logout', 'v1/AuthController.logout')
    Route.post('role', 'v1/RolesController.create') // Crea un rol
  }).middleware('auth')

  Route.post('send-code', 'v1/AuthController.sendCode') // Test para enviar correo
}).prefix('/api/v1/auth')

