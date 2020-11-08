import model from '../../../database/model.js';

export default async (req, res) => {
  const {
    query: { _id },
  } = req;

  if (req.method === 'PUT') {
    const { title, resource, location, startDate, endDate, startTime, endTime, allDay } = req.body;
    model
      .putEvent(title, resource, location, startDate, endDate, startTime, endTime, allDay, _id)
      .then(() => res.status(200).send('updated to DB'))
      .catch(err => res.status(400).send(err));
  }

  if (req.method === 'DELETE') {
    model
      .deleteEvent(_id)
      .then(() => res.status(200).send('deleted from DB'))
      .catch(err => res.status(400).send(err));
  }
}