import model from '../../../database/model.js';

export default async (req, res) => {
  const {
    query: { _id },
  } = req;

  if (req.method === 'PUT') {
    const { title, description, index } = req.body;
    model
      .putGallery(title, description, _id, index)
      .then(() => res.status(200).send('updated to DB'))
      .catch(err => res.status(400).send(err));
  }

  if (req.method === 'DELETE') {
    model
      .deleteGallery(_id)
      .then(() => res.status(200).send('deleted from DB'))
      .catch(err => res.status(400).send(err));
  }
}