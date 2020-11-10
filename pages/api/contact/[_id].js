import model from '../../../database/model.js';

export default async (req, res) => {
  const {
    query: { _id },
  } = req;

  if (req.method === 'PUT') {
    const { name, email, phone, instagram } = req.body;
    model
      .putContact(name, email, phone, instagram, _id)
      .then(() => res.status(200).send('updated to DB'))
      .catch(err => res.status(400).send(err));
  }

  if (req.method === 'DELETE') {
    model
      .deleteContact(_id)
      .then(() => res.status(200).send('deleted from DB'))
      .catch(err => res.status(400).send(err));
  }
}