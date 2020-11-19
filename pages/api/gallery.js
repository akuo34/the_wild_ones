import model from '../../database/model.js';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { title, description, fireBaseUrl, date, filename, index, smallFireBaseUrl, smallFilename } = req.body;
    model
      .postGallery(title, description, fireBaseUrl, date, filename, index, smallFireBaseUrl, smallFilename)
      .then(() => res.status(201).send('posted to DB'))
      .catch(err => res.status(400).send(err));
  }

  if (req.method === 'GET') {
    model
    .getGallery()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(404).send(err));
  }
}