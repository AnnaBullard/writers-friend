const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const entitiesRouter = require('./entities.js');
const scenesRouter = require('./scenes.js');
const storyRouter = require('./story.js');
const pseudonymsRouter = require('./pseudonyms.js');

// GET /api/restore-user
const { restoreUser } = require('../../utils/auth.js');
router.get('/restore-user', restoreUser, (req, res) => {
  return res.json(req.user);
});

router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/entities', entitiesRouter);

router.use('/scenes', scenesRouter);

router.use('/story', storyRouter);

router.use('/pseudonyms', pseudonymsRouter);

module.exports = router;
