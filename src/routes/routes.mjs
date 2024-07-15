import AppointmentController from '../controllers/appointment.controller.mjs';
import { Router } from 'express';

const routes = Router();

const appointmentController = new AppointmentController();

routes.post('/api/appointment', (request, response) => appointmentController.store(request, response));

export default routes;