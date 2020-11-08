import model from '../../database/model.js';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { images, title, resource, location, startDate, endDate, startTime, endTime, allDay } = req.body;
    model
      .postEvent(images, title, resource, location, startDate, endDate, startTime, endTime, allDay)
      .then(() => res.status(201).send('posted to DB'))
      .catch(err => res.status(400).send(err));
  }

  if (req.method === 'GET') {
    model
      .getEvent()
      .then(data => res.status(200).send(data))
      .catch(err => res.status(404).send(err));
  }
} 