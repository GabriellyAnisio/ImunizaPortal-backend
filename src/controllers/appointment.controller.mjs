//import { z } from 'zod';
import prismaClient from '../utils/prismaClient.mjs';

class AppointmentController {

    async store(request, response) {
        const { name, birthDate, date, timeSlot } = request.body;
        
        try {
            const existingAppointments = await prismaClient.appointment.count({
              where: { date: new Date(date), timeSlot }
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
                date: new Date(date),
                timeSlot,
                patientId: patient.id
              }
            });
        
            response.send(newAppointment);
        } catch (error) {
            response.status(500).json({ error: error.message });
          }
    }
}

export default AppointmentController;