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

  it('should create a new appointment', async () => {
    const response = await request(app)
      .post('/api/appointment')
      .send({
        name: 'John Doe',
        birthDate: '1990-01-01',
        dateTime: '2024-07-16T10:00:00.000Z'
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
        dateTime: '2024-07-16T09:00:00.000Z'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'completed');
  });

  it('should delete an appointment', async () => {
    const response = await request(app)
      .delete(`/api/appointment/${testAppointmentId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Success.');
  });
});
