//import { z } from 'zod';
import prismaClient from '../utils/prismaClient.mjs';

class AppointmentController {

    async store(request, response) {
        const { name, birthDate, dateTime } = request.body;
        
        try {
            const existingAppointments = await prismaClient.appointment.count({
              where: { 
                dateTime: new Date(dateTime), 
              }
            });
        
            if (existingAppointments >= 2) {
              return response.status(400).json({ message: 'Timetable is already full' });
            }

            const patient = await prismaClient.patient.create({
              data: {
                  name: name,
                  birthDate: new Date(birthDate)
                }
            });
        
            const newAppointment = await prismaClient.appointment.create({
              data: {
                dateTime: new Date(dateTime),
                patientId: patient.id
              }
            });
        
            response.send(newAppointment);
        } catch (error) {
            response.status(500).json({ error: error.message });
          }
    }

    async index(request, response) {

      let { page = 1, pageSize = 20 } = request.query;

      page = parseInt(page);
      pageSize = parseInt(pageSize);

      try {
        const [appointmentsCount, appointments] = await Promise.all([
          prismaClient.appointment.count(),
          prismaClient.appointment.findMany({ 
            take: pageSize, 
            include: { patient: true}, 
            orderBy: { dateTime: 'asc'}})
        ]);
    
        response.send({
          page,
          pageSize,
          totalCount: appointmentsCount,
          items: appointments,
        });
        
      } catch (error) {
        response.status(500).json({ error: error.message });
      }
    }
    
    async getOne(request, response) {
      const { id } = request.params;
  
      const appointment = await prismaClient.appointment.findUnique({ where: { id } });
  
      if (!appointment) {
        throw new AppError('Appointment not found', 404);
      }
  
      response.send(appointment);
    }

}

export default AppointmentController;
