const express = require('express')
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

const cors = require('cors')
app.use(cors())

app.use(express.json())

//MongoDB Database
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@firstmongodb.yjij5fj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const dbConnect = () => {
    const allTasks = client.db('doRoutine').collection('tasks')
    //Post Task to the mongodb
    app.post('/tasks', async(req, res) => {
        const task = req.body;
        const result = await allTasks.insertOne(task)
        res.send(result)
    })
    //Get All Tasks added by a specific user
    app.get('/mytasks', async(req, res) => {
        //Get the User Email from the query
        const email = req.query.email;
        //Set the Query
        const query = {
            authorEmail: email
        }
        //Find the data from the collection
        const mytasks = await allTasks.find(query).toArray()
        res.send(mytasks)
    })
    //Get a single task
    app.get('/singletask/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const singleTask = await allTasks.find(query).toArray()
        res.send(singleTask)
    })
    //Get all Completed Task for a Specific User
    app.get('/completedtasks', async(req, res)=>{
        //Get the User Email from the query
        const email = req.query.email;
        //Set the Query
        const query = {
            authorEmail: email,
            status: 'Completed'
        }
         //Find the data from the collection
         const completedTasks = await allTasks.find(query).toArray()
         res.send(completedTasks)
    })
    //Update a Specific Task
    app.put('/updatetask/:id', async(req, res)=> {
        const id = req.params.id
        const update = req.body;
        const options = {upsert: true}
        const filter = {_id: ObjectId(id)}
        const updatedTask = {$set:update}
        const result = await allTasks.updateOne(filter,updatedTask, options)
        res.send(result)
        console.log(result);

    })
    //Delete a specific task
    app.delete('/deletetask/:id', async(req, res)=> {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await allTasks.deleteOne(query)
        res.send(result)
    })

}
dbConnect()

//Default Route
app.get('/', (req, res) => {
    res.send('DoRoutine Server is Running....')
})
//Add a Listener to the app
app.listen(port, () => {
    console.log('Server Running on Port:', port);
})