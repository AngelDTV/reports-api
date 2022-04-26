import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  //=====Grupo de rutas que requieren un rol de administrador o supervisor=====//
  Route.group(() => {
    Route.post('create', 'v1/ReportsController.create') // Crea un reporte

    //======Grupo de rutas que piden un token de acceso========
    Route.group(() => {
      Route.put('update/:id', 'v1/ReportsController.update') // Actualiza un reporte
      Route.delete('delete/:id', 'v1/ReportsController.delete') // Elimina un reporte
    }).middleware('token')
    //======Fin del grupo de rutas que piden un token de acceso========

    Route.get('index/:id?', 'v1/ReportsController.index') // Trae todos los reportes o un reporte en especifico
    Route.get('show/:id', 'v1/ReportsController.getUserReports') // Trae todos los reportes de un usuario
  }).prefix('admin-supervisor').middleware('role')
  //=====Fin del grupo de rutas que requieren un rol de administrador o supervisor=====//

  Route.group(() => {
    Route.get('appointments', 'v1/ReportsController.getAppointments') // Trae todos los citas de todos los usuarios (admin)
  }).prefix('admin').middleware('role')

  Route.get('appointments', 'v1/ReportsController.getUserAppointments') // Trae todos los citas del usuario colaborador

  Route.get('index/:id?', 'v1/ReportsController.UserReports') // Trae los reportes del usuario logueado o un reporte especifico de ese usuario (no admin)

  Route.post('appeal/:id', 'v1/ReportsController.appealReport').middleware('token') // Hace una apelacion a un reporte

}).prefix('/api/v1/reports').middleware('auth')


