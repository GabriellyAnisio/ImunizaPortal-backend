import AppointmentController from '../controllers/appointment.controller.mjs';
import { Router } from 'express';

const routes = Router();

const appointmentController = new AppointmentController();

routes.post('/api/appointment', (request, response) => appointmentController.store(request, response));
routes.get('/api/appointment', (request, response) => appointmentController.index(request, response));
routes.get('/api/appointment/:id', (request, response) => appointmentController.getOne(request, response));
routes.put('/api/appointment/:id', (request, response) => appointmentController.update(request, response));
routes.delete('/api/appointment/:id', (request, response) => appointmentController.destroy(request, response));

export default routes;