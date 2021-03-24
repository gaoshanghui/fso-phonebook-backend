const mongoose = require('mongoose');

// To-do: password
const url = `mongodb+srv://gaoshanghui:2S4BHtbe2iLOzmYg@cluster0.jb7tk.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString();
    delete returnObject._id;
    delete returnObject.__v;
  }
})

const Person = mongoose.model('Person', personSchema);

module.exports = Person;