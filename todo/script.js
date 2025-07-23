const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


await mongoose.connect('');
const schema =  mongoose.Schema;
const ObjectId = schema.ObjectId;

const User = new schema({
    username: String,
    email: {type: String, unique: true},
    password: String
});

const Todo = new schema({
    userId = ObjectId,
    title = String,
    Done = Boolean
});

const UserModel = mongoose.model('user', User);
const TodoModel = mongoose.model('todo', Todo);

const JWT_SECRET = 'lolipop987654321';
function auth(req, res, next) {
  const token = req.header.authorization;
  const decoded = jwt.verify(token, JWT_SECRET);

  if (decoded) {
    req.userid = decoded.id;
    next();
  }else{
    res.status(401).send('Unauthorized');
  }
}

const app = express();
app.use(express.json());

app.post('/signup', async function(req, res){
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  await UserModel.create({
  email: email,
  password: password,
  name: name
});

  res.json({
    message: 'You are signed up!'
  })
  
}) 

app.post('/signin', async function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const response = await UserModel.findOne({
    email: email,
    password: password
  })

  if (response) {
    const token = jwt.sign({
      id: response._id.toString()
    }, JWT_SECRET)

    res.json({
      token: token
    })
  } else {
    res.json({
      message: 'Invalid credentials'
    })
  }
})

app.post('/todo', auth, async function(req, res){
  const userId = req.userId;
  const title = req.body.title;
  const done = req.body.done;

  await TodoModel.create({
    userId,
    title,
    done
  });

  res.json({
    message: 'Todo created'
  })
})

app.get('/todos', auth, async function(req, res){
  const userId = req.userId;

  const todos = await TodoModel.find({
    userId
  })

  res.json({
    todos: todos
  })
})

app.listen(3000);
