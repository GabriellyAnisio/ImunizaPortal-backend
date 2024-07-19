const request = require('supertest');
const express = require('express');

const AppointmentController = require('../controllers/appointment.controller.mjs');

const app = express();
app.use(express.json());

const appointmentController = new AppointmentController();

app.post('/api/appointment', (req, res) => appointmentController.store(req, res));
app.get('/api/appointments', (req, res) => appointmentController.index(req, res));
app.get('/api/appointment/:id', (req, res) => appointmentController.getOne(req, res));
app.put('/api/appointment/:id', (req, res) => appointmentController.update(req, res));
app.delete('/api/appointment/:id', (req, res) => appointmentController.destroy(req, res));

describe('Appointment Controller', () => {
  let testAppointmentId;

  it('should return an error when the timetable is already full', async () => {
    await request(app)
      .post('/api/appointment')
      .send({
        name: 'John Doe 1',
        birthDate: '1990-01-01',
        dateTime: '2024-07-23T10:00:00.000Z'
      });
  
    await request(app)
      .post('/api/appointment')
      .send({
        name: 'John Doe 2',
        birthDate: '1990-01-01',
        dateTime: '2024-07-23T10:00:00.000Z'
      });
  
    const response = await request(app)
      .post('/api/appointment')
      .send({
        name: 'John Doe 3',
        birthDate: '1990-01-01',
        dateTime: '2024-07-23T10:00:00.000Z'
      });
  
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Timetable is already full.');
  });

  
  it('should return an error when the day is already full', async () => {
    for (let i = 0; i < 20; i++) {
      const res = await request(app)
        .post('/api/appointment')
        .send({
          name: `Marylin Smith ${i}`,
          birthDate: '1990-01-01',
          dateTime: `2024-07-16T${i < 10 ? '0' + i : i}:00:00.000Z` 
        });
      console.log(`Response ${i}:`, res.status, res.body);
    }
    const response = await request(app)
      .post('/api/appointment')
      .send({
        name: 'John Doe 2',
        birthDate: '1990-01-01',
        dateTime: '2024-07-16T20:00:00.000Z'
      });
  
    console.log('Final response:', response.status, response.body);
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'The day is already full.');
  });
  
    
  it('should create a new appointment', async () => {
    const response = await request(app)
      .post('/api/appointment')
      .send({
        name: 'John Doe',
        birthDate: '1990-01-01',
        dateTime: '2024-07-15T10:00:00.000Z'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    testAppointmentId = response.body.id;
  });

  it('should list appointments', async () => {
    const response = await request(app)
      .get('/api/appointments');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('items');
    expect(Array.isArray(response.body.items)).toBe(true);
  });

  it('should get a single appointment', async () => {
    const response = await request(app)
      .get(`/api/appointment/${testAppointmentId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', testAppointmentId);
  });

  it('should update an appointment', async () => {
    const response = await request(app)
      .put(`/api/appointment/${testAppointmentId}`)
      .send({
        status: 'completed',
        dateTime: '2024-12-16T09:00:00.000Z'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'completed');
  });

  it('should return an error when the timetable is already full when updating', async () => {
    await request(app)
      .post('/api/appointment')
      .send({
        name: 'Margaret 1',
        birthDate: '1990-01-01',
        dateTime: '2024-01-16T10:00:00.000Z'
      });
  
    await request(app)
      .post('/api/appointment')
      .send({
        name: 'Margaret 2',
        birthDate: '1990-01-01',
        dateTime: '2024-01-16T10:00:00.000Z'
      });
  
    const responseCreate = await request(app)
      .post('/api/appointment')
      .send({
        name: 'Margaret 3',
        birthDate: '1990-01-01',
        dateTime: '2024-01-16T11:00:00.000Z'
      });
  
    const appointmentId = responseCreate.body.id;
  
    const responseUpdate = await request(app)
      .put(`/api/appointment/${appointmentId}`)
      .send({
        dateTime: '2024-01-16T10:00:00.000Z'
      });
  
    expect(responseUpdate.status).toBe(400);
    expect(responseUpdate.body).toHaveProperty('message', 'Timetable is already full');
  });
  
  it('should return an error when the day is already full when updating', async () => {
    const responseCreate = await request(app)
      .post('/api/appointment')
      .send({
        name: 'Lucas Santos',
        birthDate: '1990-01-01',
        dateTime: '2024-01-16T20:00:00.000Z'
      });
  
    const appointmentId = responseCreate.body.id;
  
    const responseUpdate = await request(app)
      .put(`/api/appointment/${appointmentId}`)
      .send({
        dateTime: '2024-07-16T15:00:00.000Z'
      });
  
    expect(responseUpdate.status).toBe(400);
    expect(responseUpdate.body).toHaveProperty('message', 'The day is already full.');
  });
  

  it('should delete an appointment', async () => {
    const response = await request(app)
      .delete(`/api/appointment/${testAppointmentId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success.');
  });
  
  it('should return an error when the appointment is not found', async () => {
    const response = await request(app)
      .get('/api/appointment/non-existing-id');
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Appointment not found.');
  });

  it('should return an error when trying to update a non-existing appointment', async () => {
    const response = await request(app)
      .put('/api/appointment/non-existing-id')
      .send({
        status: 'completed',
        dateTime: '2024-07-16T09:00:00.000Z'
      });
  
    expect(response.status).toBe(404); 
  });

  it('should return an error when trying to delete a non-existing appointment', async () => {
    const response = await request(app)
      .delete('/api/appointment/non-existing-id');
  
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Appointment not found.');
  });
  
  
});
