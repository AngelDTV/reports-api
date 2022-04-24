import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('show/:id?', 'v1/UsersController.index')
  Route.post('assign-role', 'v1/RolesController.assignRole')
  Route.get('roles', 'v1/RolesController.getRoles')
}).prefix('/api/v1/users').middleware('auth')
