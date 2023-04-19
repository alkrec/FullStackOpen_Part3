const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://aouz:${password}@cluster0.wfrekay.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)


if(process.argv.length === 3) {
    Person.find({}).then(persons => {
        console.log("phonebook:")
        persons.forEach(person => console.log(`${person.name} ${person.number}`))
        mongoose.connection.close()
    })
}

if(process.argv.length === 5) {
    const inputtedName = process.argv[3]
    const inputtedNumber = process.argv[4]

    const person = new Person({
        name: inputtedName,
        number: inputtedNumber
    })
    
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}
