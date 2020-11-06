import model from '../../../../database/model.js';

export default async (req, res) => {
  const {
    query: { _id },
  } = req;

  if (req.method === 'PUT') {
    const { bannerFireBaseUrl, bannerFilename } = req.body;
    model
      .putAboutBanner(bannerFireBaseUrl, bannerFilename, _id)
      .then(() => res.status(200).send('updated to DB'))
      .catch(err => res.status(400).send(err));
  }
}