require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

morgan.token('custom', (req, res) => { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :custom'));


app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => response.json(persons));
});

app.get('/api/persons/:id', (request, response, next) => {
  const requestId = request.params.id;

  Person.findById(requestId)
    .then(result => response.json(result))
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  const requestId = request.params.id;

  Person.findByIdAndRemove(requestId)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name) return response.status(400).json({ error: 'name must be included.' });
  if (!body.number) return response.status(400).json({ error: 'number must be included.' });

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then((result) => {
      console.log(`added ${result.name} number ${result.number} to phonebook`);
      response.json(result);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
})

app.get('/info', (request, response, next) => {
  const date = new Date();
  // const numberOfPersons = persons.length;

  Person.find({})
    .then(result => {
      console.log(result);
      const numberOfPersons = result.length;
      response.send(`<p>Phonebook has info for ${numberOfPersons} people</p><p>${date}</p>`);
    })
    .catch(error => next(error));
});


// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint);

// Handler of requests with result to errors
const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});