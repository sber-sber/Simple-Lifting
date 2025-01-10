import React from "react";
import ExerciseList from "../components/ExerciseList";
import { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import { useNavigate } from 'react-router-dom';


function HomePage({ setExerciseToEdit }) {
    const [exercises, setExercises] = useState([]);
    const navigate = useNavigate();

    const onDelete = async _id => {
        const response = await fetch(`/exercises/${_id}`, {method: 'DELETE'}) 
        if(response.status === 204) { 
            setExercises(exercises.filter(e => e._id !== _id));          
        } else{
            console.error(`Failed to delete exercise with _id = ${_id}, status code = ${response.status}`); // Todo update this
        }
    };
    
    const onEdit = exercise => {
        setExerciseToEdit(exercise)
        navigate("/edit-exercise");
    }

    const loadExercises = async () => {
        const response = await fetch('/exercises');
        const data = await response.json();
        setExercises(data);
    }

    useEffect(() => {
        loadExercises();
    }, []);

    return (
        <>
        <h2>List of Exercises</h2>
        <ExerciseList exercises={exercises} onDelete={onDelete} onEdit={onEdit}></ExerciseList>
        <Link to="/create-exercise">Create Exercise</Link>
        </>
    );
}

export default HomePage;