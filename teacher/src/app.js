const express = require('express');
const path = require('path');
const teacher = require('./connect');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const staticPath = path.join(__dirname, '../public');
app.use(express.static(staticPath));

app.get('/', (req, res) => {
  res.render('login');
});

app.post('/home', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const foundTeacher = await teacher.findOne({ id: username, password, position: 'faculty' });

    if (foundTeacher) {
      const applications = await teacher.find({ permission: 'waiting' });
      res.render('teacher', { applications });
    } else {
      console.log('Invalid User');
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

app.post('/permission', async (req, res, next) => {
  try {
    const { permit, cardIndex, cardid } = req.body;

    await teacher.findOneAndUpdate(
      { id: cardid },
      { $set: { permission: permit } },
      { upsert: false }
    );

    const applications = await teacher.find({ permission: 'waiting' });
    res.render('teacher', { applications });
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
