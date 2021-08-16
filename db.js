var mongoose = require('mongoose');
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true,
useUnifiedTopology: true,
useCreateIndex: true,
useFindAndModify: false 
}).then(() => {
    console.log("Connected with MongoDB!");
  }).catch((error) => {
    console.log("Error: Cannot Connect to MongoDB!!!");
});

var TaskSchema = new mongoose.Schema({
    name:{
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    done: {
      type: Boolean,
      default: false
    }
}, { collection: 'tasks', timestamps: true }
);

module.exports = { Mongoose: mongoose, TaskSchema : TaskSchema }