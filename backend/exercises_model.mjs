import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);


// Connect to to the database
const db = mongoose.connection;
// The open event is called when the database connection successfully opens
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});


// Defines the exercise schema (name, reps, weight, unit, date)
const exerciseSchema = mongoose.Schema({
    name: { type: String, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    unit: { type: String, required: true }, // Only "kgs" and "lbs" are allowed
    date: { type: String, required: true } // Specified as MM-DD-YY
});


// Compiles model from the schema
const Exercise = mongoose.model("Exercise", exerciseSchema);

const createExercise = async (name, reps, weight, unit, date) => {
    const exercise = new Exercise({
        name: name, reps: reps, weight: weight, unit: unit, date: date})
    return exercise.save();
}


// Finds and returns exercise matching passed ID#
const findExerciseById = async(_id) => {
    const query = Exercise.findById(_id);
        return query.exec();
}


// Returns all exercises
const findExercises = async(filter) => {
    const query = Exercise.find();
    return query.exec();
}


// Updates an exercise's data by replacing the document
const replaceExercise = async (_id, name, reps, weight, unit, date) => {
    const result = await Exercise.replaceOne({_id: _id}, {
         name: name, reps: reps, weight: weight, unit: unit, date: date });
    return result.modifiedCount;     
}


// Deletes document corresponding to passed ID#
const deleteById = async (exerciseId) => {
        const result = await Exercise.deleteMany( { "_id" : exerciseId } );
        return result.deletedCount;    
}


export{createExercise, findExerciseById, findExercises, replaceExercise, deleteById};
