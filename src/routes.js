const express = require('express')
const multerConfig = require('./config/multer')
const upload = require('multer')(multerConfig)

const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')
const guestMiddleware = require('./app/middlewares/guest')

const UserController = require('./app/controllers/UserController')
const SessionController = require('./app/controllers/SessionController')
const DashboardController = require('./app/controllers/DashboardController')
const FileController = require('./app/controllers/FileController')
const AppointmentController = require('./app/controllers/AppointmentController')
const AvailableController = require('./app/controllers/AvailableController')
const ScheduleController = require('./app/controllers/ScheduleController')

routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success')
  res.locals.flashError = req.flash('error')

  return next()
})
// Rota de arquivos
routes.get('/files/:file', FileController.show)

// Rotas de Login
routes.get('/', guestMiddleware, SessionController.create)
routes.post('/signin', SessionController.store)

// Rotas de Registro
routes.get('/signup', guestMiddleware, UserController.create)
routes.post('/signup', upload.single('avatar'), UserController.store)

// Middleware de Autenticação
routes.use('/app', authMiddleware)

// Rotas principais da aplicação
routes.get('/app/logout', SessionController.destroy)
routes.get('/app/dashboard', DashboardController.index)

// Rotas de agendamento
routes.get('/app/appointments/new/:provider', AppointmentController.create)
routes.post('/app/appointments/new/:provider', AppointmentController.store)

routes.get('/app/available/:provider', AvailableController.index)

routes.get('/app/schedule/:provider', ScheduleController.index)
module.exports = routes
