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

function generateId() {
  const id = Math.floor(Math.random() * 10000);
  return id;
}

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons);    
    })
});

app.get('/api/persons/:id', (request, response) => {
  const requestId = Number(request.params.id);
  const person = persons.filter(person => person.id === requestId);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const requestId = Number(request.params.id);
  persons = persons.filter(person => person.id !== requestId);
  
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) return response.status(400).json({ error: 'name must be included.' });
  if (!body.number) return response.status(400).json({ error: 'number must be included.' });
  // if (persons.find(person => person.name === body.name)) return response.status(400).json({ error: 'name must be unique.' });

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
    .catch((error) => {
      console.log(error);
    });
});

app.get('/info', (request, response) => {
  const date = new Date();
  const numberOfPersons = persons.length;

  response.send(`<p>Phonebook has info for ${numberOfPersons} people</p><p>${date}</p>`);
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});