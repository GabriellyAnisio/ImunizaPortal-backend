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
        return response.status(404).json({ message: 'Appointment not found.' });
      }
  
      response.send(appointment);
    }

    async update(request, response) {
      const { status, dateTime } = request.body;
      const { id } = request.params;
      const date = new Date(dateTime);
      const dateOnly = new Date(date.toDateString()); 
  
      try {
        const dataToUpdate = {};
  
        if (status) {
          dataToUpdate.status = status;
        }
  
        if (dateTime) {
            const existingAppointments = await prismaClient.appointment.count({
            where: {
              dateTime: dateTime
            }
          });
  
          if (existingAppointments >= 2) {
            return response.status(400).json({ message: 'Timetable is already full' });
          }

          const existingAppointmentsOnDay = await prismaClient.appointment.count({
            where: {
              dateTime: {
                gte: dateOnly,
                lt: new Date(dateOnly.getTime() + 24 * 60 * 60 * 1000)
              }
            }
          });
    
          if (existingAppointmentsOnDay >= 2) {
            return response.status(400).json({ message: 'The day is already full.' });
          }  
  
          dataToUpdate.dateTime = dateTime;
        }
  
        const updatedAppointment = await prismaClient.appointment.update({
          where: { id },
          data: dataToUpdate
        });
  
        response.send(updatedAppointment);
      } catch (error) {
        response.status(500).json({ error: error.message });
      }
    }
  
    async destroy(request, response) {
      const { id } = request.params;
  
      try {
        const appointment = await prismaClient.appointment.findUnique({
          where: { id },
          include: { patient: true }
        });
  
        if (!appointment) {
          return response.status(404).json({ message: 'Appointment not found.' });
        }
  
        await prismaClient.appointment.delete({
          where: { id }
        });
  
        await prismaClient.patient.delete({
            where: { id: appointment.patientId }
        });
  
        response.json({ message: 'Success.' });
      } catch (error) {
        response.status(500).json({ error: error.message });
      }
    }
}

export default AppointmentController;
