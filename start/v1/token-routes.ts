import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('create', 'v1/TokensController.create') // Crea un token
}).prefix('/api/v1/tokens/admin').middleware(['auth', 'role'])

