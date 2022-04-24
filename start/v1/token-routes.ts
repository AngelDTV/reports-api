import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('create', 'TokensController.create')
}).prefix('/api/v1/tokens')

