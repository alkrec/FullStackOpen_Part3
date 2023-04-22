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
    }

    next(error)
}

// let persons = [
//         { 
//           "id": 1,
//           "name": "Arto Hellas", 
//           "number": "040-123456"
//         },
//         { 
//           "id": 2,
//           "name": "Ada Lovelace", 
//           "number": "39-44-5323523"
//         },
//         { 
//           "id": 3,
//           "name": "Dan Abramov", 
//           "number": "12-43-234345"
//         },
//         { 
//           "id": 4,
//           "name": "Mary Poppendieck", 
//           "number": "39-23-6423122"
//         }
//     ]


//
// Summary: GET - fetch all persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        console.log("phonebook:")
        persons.forEach(person => console.log(`${person.name} ${person.number}`))
        response.json(persons)
    })
})


//
// Summary: GET - display number of items in persons & time request was made
app.get('/api/info', (request, response) => {
    const CurrentDateTime = new Date()
    
    Person.find({})
        .then(persons => {
            response.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${CurrentDateTime}</p>`)
        })
})


//
// Summary: GET - fetch individual person
app.get('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // const person = persons.find(person => person.id === id)
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })

    // if(person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end() //Status Code 404 = "Not Found"
    // }
    // console.log(id);
})


//
// Summary: DELETE - delete a single person
app.delete('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)

    // persons = persons.filter(person => person.id !== id)
    
    Person.findByIdAndDelete(request.params.id)
        .then(deletedPerson => {
            console.log(deletedPerson)
            response.status(204).end() //Status Code 204 = "No Content"
        })
        .catch(error => next(error))
})


// //
// // Summary: Generate random Id
// const randomId = () => {
//     const randomNumber = Math.floor(Math.random() * 10000)
//     return randomNumber
// }

//
// Summary: POST - create a new person
app.post('/api/persons', (request, response) => {
    const body = request.body
    
    // if(!request.body.name || !request.body.number) { //Error handling for missing content
    //     return response.status(400).json(  // Status Code 400 = "Bad Request"
    //         {
    //             error: "name or number missing"
    //         }
    //     )
    // }

    // const names = persons.map(person => person.name)
    // if (names.includes(request.body.name)) { //Error handling for same name
    //     return response.status(400).json( // Status Code 400 = "Bad Request"
    //         {
    //             error: "name must be unique"
    //         }
    //     )
    // }
    
    // const person = { // create new person object from request body
    //     id: randomId(),
    //     name: body.name,
    //     number: body.number
    // }
    
    // persons = persons.concat(person) //add new person object to persons array

    // response.json(person) // send new person object as response body

    const person = new Person ({ // create new person object from request body
        // id: randomId(),
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => { // save the person to the database
        response.json(savedPerson)
    })
})

//Summary: PUT - updates a person
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
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