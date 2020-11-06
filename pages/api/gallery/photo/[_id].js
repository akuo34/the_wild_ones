import model from '../../../../database/model.js';

export default async (req, res) => {
  const {
    query: { _id },
  } = req;

  if (req.method === 'PUT') {
    const { fireBaseUrl, filename } = req.body;
    model
      .putGalleryPhoto(fireBaseUrl, filename, _id)
      .then(() => res.status(200).send('updated to DB'))
      .catch(err => res.status(400).send(err));
  }
}