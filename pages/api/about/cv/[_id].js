import model from '../../../../database/model.js';

export default async (req, res) => {
  const {
    query: { _id },
  } = req;

  if (req.method === 'PUT') {
    const { cvFireBaseUrl, cvFilename } = req.body;
    model
      .putAboutCV(cvFireBaseUrl, cvFilename, _id)
      .then(() => res.status(200).send('updated to DB'))
      .catch(err => res.status(400).send(err));
  }
}