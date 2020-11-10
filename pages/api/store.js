import model from '../../database/model.js';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { images, title, description, width, height, price, category, quantity } = req.body;
    model
      .postStore(images, title, description, width, height, price, category, quantity)
      .then(() => res.status(201).send('posted to DB'))
      .catch(err => res.status(400).send(err));
  }

  if (req.method === 'GET') {
    model
      .getStore()
      .then(data => res.status(200).send(data))
      .catch(err => res.status(404).send(err));
  }
}