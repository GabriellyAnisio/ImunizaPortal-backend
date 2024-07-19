import prismaClient from '../utils/prismaClient.mjs';

// ---- To run tests:
//const prismaClient = require('../utils/prismaClient.mjs');

class AppointmentController {
  async store(request, response) {
    const { name, birthDate, dateTime } = request.body;
    const date = new Date(dateTime);
    const dateOnly = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  
    try {
      const existingAppointmentsAtTime = await prismaClient.appointment.count({
        where: { 
          status: 'scheduled', 
          dateTime: date 
        }
      });
  
      console.log('existingAppointmentsAtTime:', existingAppointmentsAtTime);
  
      if (existingAppointmentsAtTime >= 2) {
        return response.status(400).json({ message: 'Timetable is already full.' });
      }
  
      const existingAppointmentsOnDay = await prismaClient.appointment.count({
        where: {
          status: 'scheduled',
          dateTime: {
            gte: dateOnly,
            lt: new Date(dateOnly.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      });
  
      console.log('existingAppointmentsOnDay:', existingAppointmentsOnDay);
  
      if (existingAppointmentsOnDay >= 20) {
        return response.status(400).json({ message: 'The day is already full.' });
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
          patientId: patient.id,
          status: 'scheduled'
        }
      });
  
      response.status(201).json(newAppointment);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }

  async index(request, response) {

    let { page = 1, pageSize = 30 } = request.query;

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
      const appointment = await prismaClient.appointment.findUnique({ where: { id } });

      if (!appointment) {
        return response.status(404).json({ message: 'Appointment not found.' });
      }

      const dataToUpdate = {};

      if (status) {
        dataToUpdate.status = status;
      }

      if (dateTime) {
        const existingAppointments = await prismaClient.appointment.count({
          where: {
            dateTime: dateTime,
            status: 'scheduled'
          }
        });

        if (existingAppointments >= 2) {
          return response.status(400).json({ message: 'Timetable is already full' });
        }

        const existingAppointmentsOnDay = await prismaClient.appointment.count({
          where: {
            dateTime: {
             // gte: dateOnly,
              lte: new Date("2024-07-16")
            },
            status: 'scheduled'
          }
        });

        if (existingAppointmentsOnDay >= 20) {
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

// ---- To run tests:
//module.exports = AppointmentController;
