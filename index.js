const express = require('express')
const morgan = require('morgan')  //CHECK?? in documentation var is used instead of const
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/Person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :personOutput')) // from method to response-time, it is equilivant to 'tiny'


morgan.token('personOutput', function(req, res) { //customize log out for :personOutput for 'morgan'
    const person = {
        name: req.body.name,
        number: req.body.number
    }
    return JSON.stringify(person)
})


const errorHandler = (error, request, response, next) => { //Custom error handler
    console.log(error.message)

    if (error.name === 'CastError') { //CastError is caused by an invalid object given as a parameter
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({error: error.message})
    }

    next(error)
}


//
// Summary: GET - fetch all persons
app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            console.log("phonebook:")
            persons.forEach(person => console.log(`${person.name} ${person.number}`))
            response.json(persons)
        })
        .catch(error => next(error))
})


//
// Summary: GET - display number of items in persons & time request was made
app.get('/api/info', (request, response, next) => {
    const CurrentDateTime = new Date()
    
    Person.find({})
        .then(persons => {
            response.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${CurrentDateTime}</p>`)
        })
        .catch(error => next(error))
})


//
// Summary: GET - fetch individual person
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
        response.json(person)
        })
        .catch(error => next(error))
})


//
// Summary: DELETE - delete a single person
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(deletedPerson => {
            console.log(deletedPerson)
            response.status(204).end() //Status Code 204 = "No Content"
        })
        .catch(error => next(error))
})


//
// Summary: POST - create a new person
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person ({ // create new person object from request body
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => { // save the person to the database
        response.json(savedPerson)
    })
    .catch(error => next(error))
})


//
//Summary: PUT - updates a person
app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id, 
        {name, number}, 
        {new: true, runValidators: true, context: 'query'})
            .then(updatedPerson => {
                response.json(updatedPerson)
            })
            .catch(error => next(error))
})


app.use(errorHandler) //errorHandler middleware must be placed after http request handlers


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})