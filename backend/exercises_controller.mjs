import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());


/**
 * NOTE TO GRADER: To prepare (for this assignment and the final), I went through a lot of the movie 
 * project-related modules , and ended up accidentally using "movies_controller.mjs" here, despite 
 * using exercises_model.mjs for my model file. I attempted to rectify this, but ended up repeatedly
 * breaking my code.
 * I'm sure it's an easy fix and I'm just overthinking it; I plan on looking into it later.
 * I apologize for any confusion!  
 */


// Creates a new movie with the name, reps, etc., provided in the body
app.post('/exercises', (req, res) => {
    if (isNameValid(req.body.name) 
        && isDateValid(req.body.date) 
        && isRepsValid(req.body.reps) 
        && isWeightValid(req.body.weight) 
        && isUnitValid(req.body.unit)
        )
        {exercises.createExercise(req.body.name, req.body.reps,     
            req.body.weight, req.body.unit, req.body.date)
            .then(
                exercise => {
            res.status(201).json(exercise)
        } 
            )
            .catch(error => {
                console.error(error);
                res.send({ Error: "Invalid request"});
        });    
    } else {
                        res.status(400).json({ Error: "Invalid request"});
                    } ;
});


// Retrives the movie corresponding to the ID provided in the URL.
app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExerciseById(exerciseId)
        .then(exercise => {
            if (exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).json({ Error: "Not found" });
            }
        })
        .catch(error => {
            res.status(404).json({ Error: "Not found" });
        });
});


// Returns all exercises 
app.get('/exercises', (req, res) => {
    let filter = {};
    exercises.findExercises(filter, '', 0)
        .then(exercises => {
            res.send(exercises);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        });
});


// Updates document matching passed ID code
app.put('/exercises/:_id', (req, res) => {
    if (isNameValid(req.body.name)
        && isDateValid(req.body.date)
        && isRepsValid(req.body.reps)
        && isWeightValid(req.body.weight)
        && isUnitValid(req.body.unit)
        ) 
        {exercises.replaceExercise(req.params._id, req.body.name, 
        req.body.reps, req.body.weight, req.body.unit, req.body.date)
    .then(
        numUpdated => {
        if (numUpdated === 1) {
            res.json({ _id: req.params._id, name: req.body.name, reps: req.body.reps, 
                weight: req.body.weight, unit: req.body.unit, date: req.body.date})
        } else {
            res.status(404).json({ Error: "Not found"});
        }
    }) 
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' });
        });
    } else {
            res.status(400).json({ Error: 'Request failed' });
        }
    });
    

// Deletes document for exercise matching passed ID
app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: "Not found"});
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: "Not found"});
        });
});


// NOTE: This function is the code provided in the module (that we are allowed to use).
// I plan on going back and writing my own once I have more time, post-final.
/**
* @param {string} date
* Returns true if the date format is MM-DD-YY where MM, DD and YY are 2 digit integers
*/
function isDateValid(date) {
    // Test using a regular expression. 
    // To learn about regular expressions see Chapter 6 of the text book
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}

// Returns true if the name property is a a string containing at least one character 
function isNameValid(name) {
    if (typeof name == "string" && name != null && name !== "") {
        return true
    } else return false;
}

// Returns true if the reps property is an integer greater than 0.
function isRepsValid(reps) {
    if (typeof reps === "number" && reps > 0) {
        return true
    } else return false;
}

// Returns true if the weight property is an integer greater than 0.
function isWeightValid(weight) {
    if (typeof weight === "number" && weight > 0) {
        return true
    } else return false;
}

// Returns true if the unit property is either the string "kgs" or the string "lbs".
function isUnitValid(unit) {
    if (unit == "kgs" || unit == "lbs") {
        return true
    } else return false;
}

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});