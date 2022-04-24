import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('create', 'ReportsController.create')
    Route.put('update/:id', 'ReportsController.update')
    Route.delete('delete/:id', 'ReportsController.delete')
  }).prefix('admin')
  Route.get('index', 'ReportsController.index')
  Route.post('appeal/:id', 'ReportsController.appealReport')
  Route.get('show/:id', 'ReportsController.show')
}).prefix('/api/v1/reports').middleware('auth')


