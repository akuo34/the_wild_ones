import model from '../../database/model.js';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { name, email, phone, instagram } = req.body;
    model
      .postContact(name, email, phone, instagram)
      .then(() => res.status(201).send('posted to DB'))
      .catch(err => res.status(400).send(err));
  }

  if (req.method === 'GET') {
    model
      .getContact()
      .then(data => res.status(200).send(data))
      .catch(err => res.status(404).send(err));
  }
} 