import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {
  Route.post('register', 'v1/AuthController.register')
  Route.post('login', 'v1/AuthController.login')
  Route.post('login-mobile', 'v1/AuthController.loginMobile')
  Route.post('token', 'v1/AuthController.loginWithApp')
  Route.post('login/code', 'v1/AuthController.loginWithOneTimeCode')
  Route.post('logout', 'v1/AuthController.logout').middleware('auth')
  Route.post('role', 'v1/RolesController.create')
}).prefix('/api/v1/auth')

