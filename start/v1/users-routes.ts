import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('show/:id?', 'v1/UsersController.index') // Trae todos los usuarios o un usuario en especifico
  Route.post('assign-role', 'v1/RolesController.assignRole') // Asigna un rol a un usuario
  Route.get('roles', 'v1/RolesController.getRoles') // Trae todos los roles
  Route.get('collaborators', 'v1/UsersController.getCollaborators') // Trae todos los colaboradores
}).prefix('/api/v1/users/admin-supervisor').middleware(['auth', 'role'])
