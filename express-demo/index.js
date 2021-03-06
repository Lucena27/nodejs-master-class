const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./logger.js');
const express = require('express');
const auth = require('./auth');

const app = express();

app.use(express.json()); // Midleware pro express usar json na pipeline
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

//Configuration

console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    console.log("Morgan enabled...");
}

app.use(logger);

app.use(auth);

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
]

//Rotas

//Página Inicial
app.get('/', (req, res) => {
    res.send('Konnichiwa, Shin sekai ! ! !');
});

//Lista de todos courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

//Lista um course específico
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('404 Course Not Found');
    res.send(course);
});

//Adiciona um course
app.post('/api/courses', (req, res) => {
    const {error} = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
})

//Modifica um course
app.put('/api/courses/:id', (req, res) => {  
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('404 Course Not Found');

    const {error} = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    
    course.name = req.body.name;
    res.send(course);
})

//Deleta um course
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('404 Course Not Found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
})

//Função validadora
function validateCourse(course){
    const schema = {
        "name": Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000

app.listen(3000, () => console.log(`I can hear you on ${port} :)`));

