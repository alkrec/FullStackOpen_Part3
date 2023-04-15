const express = require('express')
const app = express()

app.use(express.json())

let persons = [
        { 
          "id": 1,
          "name": "Arto Hellas", 
          "number": "040-123456"
        },
        { 
          "id": 2,
          "name": "Ada Lovelace", 
          "number": "39-44-5323523"
        },
        { 
          "id": 3,
          "name": "Dan Abramov", 
          "number": "12-43-234345"
        },
        { 
          "id": 4,
          "name": "Mary Poppendieck", 
          "number": "39-23-6423122"
        }
    ]


// Summary: GET - fetch all persons
app.get('/api/persons', (request, response) => {
    response.json(persons);
})


// Summary: GET - display number of items in persons & time request was made
app.get('/api/info', (request, response) => {
    const CurrentDateTime = new Date()

    response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${CurrentDateTime}</p>`)
})


// Summary: GET - fetch individual person
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const person = persons.find(person => person.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(404).end() //Status Code 404 = "Not Found"
    }
    console.log(id);
})


// Summary: DELETE - delete a single person
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    persons = persons.filter(person => person.id !== id)
    response.status(204).end() //Status Code 204 = "No Content"
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})