import model from '../../database/model.js';

export default async (req, res) => {
  if (req.method === 'GET') {
    model
    .getAbout()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(404).send(err));
  }

  if (req.method === 'POST') {
    const { portraitFireBaseUrl, bio, portraitFilename, bannerFireBaseUrl, bannerFilename, cvFireBaseUrl, cvFilename } = req.body;
    model
      .postAbout(portraitFireBaseUrl, bio, portraitFilename, bannerFireBaseUrl, bannerFilename, cvFireBaseUrl, cvFilename)
      .then(() => res.status(201).send('posted to DB'))
      .catch(err => res.status(400).send(err));
  }
}