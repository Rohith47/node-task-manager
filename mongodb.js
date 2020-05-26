// CRUD Operations
const {MongoClient, ObjectID} = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

// const id = new ObjectID();
// console.log(id);
// console.log(id.getTimestamp());


MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if (error) {
        return console.error('Unable to connect to Database !!!');
    }
    const db = client.db(databaseName);
    
    // db.collection('users').updateOne({_id: new ObjectID('5e6174f9d594f32898406db0')},
    //  {
    //      $inc: {
    //          age: 1
    //      }
    //  }).then((user) => {
    //     console.log(user);
    //  }).catch((error) => {
    //     console.log(error);
    //  });

    db.collection('users').deleteOne({
        age: 88
    }
    ).then((task) => {
        console.log(task.deletedCount);
    }).catch((error) => {
        console.log(error);
        
    })
});