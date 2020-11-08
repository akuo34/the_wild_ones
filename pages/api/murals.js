import model from '../../database/model.js';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { title, description, fireBaseUrl, date, filename, index } = req.body;
    model
      .postMural(title, description, fireBaseUrl, date, filename, index)
      .then(() => res.status(201).send('posted to DB'))
      .catch(err => res.status(400).send(err));
  }

  if (req.method === 'GET') {
    model
      .getMural()
      .then(data => res.status(200).send(data))
      .catch(err => res.status(404).send(err));
  }
}