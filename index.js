const express = require('express')
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

const cors = require('cors')
app.use(cors())

app.use(express.json())

//MongoDB Database
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@firstmongodb.yjij5fj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const dbConnect = () => {
    const allTasks = client.db('doRoutine').collection('tasks')

    app.post('/tasks', async(req, res) => {
        const task = req.body;
        const result = await allTasks.insertOne(task)
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