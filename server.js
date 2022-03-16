const express = require('express');
const path = require('path');
const axios = require('axios');
const morgan = require('morgan');

const app = express();

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message) => console.log(message.trim()),
    },
  }
);

app.use(morganMiddleware);

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');

async function getRandomJoke() {
  const response = await axios.get('https://icanhazdadjoke.com', {
    headers: {
      Accept: 'application/json',
      'User-Agent':
        'Random Dad Jokes (https://github.com/betterstack-community/random-dad-jokes)',
    },
  });

  return response.data;
}

app.get('/', async (req, res, next) => {
  try {
    const response = await getRandomJoke();

    res.render('home', {
      title: 'Random Dad Jokes',
      dadJoke: response,
    });
  } catch (err) {
    next(err);
  }
});

app.get('/joke', async (req, res, next) => {
  console.log('Request handled by process:', process.env.NODE_APP_INSTANCE);

  if (process.env.NODE_APP_INSTANCE === 0) {
    console.log('Executing some operation on process 0 only...');
  }

  try {
    const response = await getRandomJoke();
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.get('/crashme', (req, res) => {
  res.send('Crashing server!');
  process.exit(1);
});

app.get('/graceful-shutdown', (req, res) => {
  res.send('Graceful shutdown!');
  cleanupAndExit();
});

app.use(function (err, req, res, next) {
  console.error(err);
  res.set('Content-Type', 'text/html');
  res.status(500).send('<h1>Internal Server Error</h1>');
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`dadjokes server started on port: ${server.address().port}`);
  // simulate a ready application after 1 second
  setTimeout(function () {
    process.send('ready');
  }, 1000);
});

function cleanupAndExit() {
  server.close(() => {
    console.log('dadjokes server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', cleanupAndExit);
process.on('SIGINT', cleanupAndExit);
