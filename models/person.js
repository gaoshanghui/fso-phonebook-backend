const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
  }
});

personSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString();
    delete returnObject._id;
    delete returnObject.__v;
  }
});

personSchema.plugin(uniqueValidator);

const Person = mongoose.model('Person', personSchema);

module.exports = Person;