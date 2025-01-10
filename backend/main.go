package main

import (
	"context"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/option"
)

var firestoreClient *firestore.Client
var exercisesCollection *firestore.CollectionRef

func main() {
	// Load env-variables
	// Get PORT env. variable
	// port := os.Getenv("PORT")
	port := "8080"

	serviceAccountKey := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS") // This should already be set

	// Check if GOOGLE_APPLICATION_CREDENTIALS is set
	if serviceAccountKey == "" {
		log.Fatal("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.")
	}

	// Debugging why that's a Firestone client initialization error
	// log.Println("PORT:", os.Getenv("PORT"))

	// Initialize Firebase
	// The SDK automatically uses the GOOGLE_APPLICATION_CREDENTIALS variable for authentication
	opt := option.WithCredentialsFile(serviceAccountKey) // This is optional if you have set the environment variable
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("Error initializing Firebase app: %v\n", err)
	}

	// Initialize Firestore client
	firestoreClient, err = app.Firestore(context.Background())
	if err != nil {
		log.Fatalf("Error initializing Firestore client: %v\n", err)
	}
	defer firestoreClient.Close() // Ensure we close the Firestore client when we're done

	// Initialize exercises collection reference
	exercisesCollection = firestoreClient.Collection("exercises")

	// Initialize Gin router
	router := gin.Default()

	// Define routes
	router.POST("/exercises", createExercise)
	router.GET("/exercises", getAllExercises)
	router.GET("/exercises/:id", getExerciseById)
	router.PUT("/exercises/:id", updateExercise)
	router.DELETE("/exercises/:id", deleteExercise)

	// Start server
	router.Run(":" + port)
}

// Create a new exercise
func createExercise(c *gin.Context) {
	var exercise struct {
		Name   string `json:"name"`
		Reps   int    `json:"reps"`
		Weight int    `json:"weight"`
		Unit   string `json:"unit"`
		Date   string `json:"date"`
	}

	if err := c.BindJSON(&exercise); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	// Validate the input
	if !isValidName(exercise.Name) || !isValidDate(exercise.Date) || !isValidReps(exercise.Reps) || !isValidWeight(exercise.Weight) || !isValidUnit(exercise.Unit) {
		c.JSON(400, gin.H{"error": "Invalid input data"})
		return
	}

	// Add the exercise document to Firestore
	_, _, err := exercisesCollection.Add(context.Background(), map[string]interface{}{
		"name":   exercise.Name,
		"reps":   exercise.Reps,
		"weight": exercise.Weight,
		"unit":   exercise.Unit,
		"date":   exercise.Date,
	})
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to create exercise"})
		return
	}

	c.JSON(201, gin.H{"message": "Exercise created successfully"})
}

// Get exercise by ID
func getExerciseById(c *gin.Context) {
	id := c.Param("id")

	// Get the document from Firestore
	doc, err := exercisesCollection.Doc(id).Get(context.Background())
	if err != nil {
		c.JSON(404, gin.H{"error": "Exercise not found"})
		return
	}

	var exercise map[string]interface{}
	err = doc.DataTo(&exercise)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to decode exercise"})
		return
	}

	c.JSON(200, exercise)
}

// Get all exercises
func getAllExercises(c *gin.Context) {
	iter := exercisesCollection.Documents(context.Background())
	defer iter.Stop()

	var exercises []map[string]interface{}
	for {
		doc, err := iter.Next()
		if err != nil {
			break
		}

		var exercise map[string]interface{}
		err = doc.DataTo(&exercise)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to decode exercise"})
			return
		}
		exercises = append(exercises, exercise)
	}

	c.JSON(200, exercises)
}

// Update exercise by ID
func updateExercise(c *gin.Context) {
	id := c.Param("id")

	var exercise struct {
		Name   string `json:"name"`
		Reps   int    `json:"reps"`
		Weight int    `json:"weight"`
		Unit   string `json:"unit"`
		Date   string `json:"date"`
	}

	if err := c.BindJSON(&exercise); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	// Validate the input
	if !isValidName(exercise.Name) || !isValidDate(exercise.Date) || !isValidReps(exercise.Reps) || !isValidWeight(exercise.Weight) || !isValidUnit(exercise.Unit) {
		c.JSON(400, gin.H{"error": "Invalid input data"})
		return
	}

	// Update the document in Firestore
	_, err := exercisesCollection.Doc(id).Set(context.Background(), map[string]interface{}{
		"name":   exercise.Name,
		"reps":   exercise.Reps,
		"weight": exercise.Weight,
		"unit":   exercise.Unit,
		"date":   exercise.Date,
	})
	if err != nil {
		c.JSON(404, gin.H{"error": "Exercise not found"})
		return
	}

	c.JSON(200, gin.H{"message": "Exercise updated successfully"})
}

// Delete exercise by ID
func deleteExercise(c *gin.Context) {
	id := c.Param("id")

	// Delete the document from Firestore
	_, err := exercisesCollection.Doc(id).Delete(context.Background())
	if err != nil {
		c.JSON(404, gin.H{"error": "Exercise not found"})
		return
	}

	c.JSON(204, gin.H{"message": "Exercise deleted successfully"})
}

// Validation functions
func isValidName(name string) bool {
	return len(name) > 0
}

func isValidDate(date string) bool {
	// Simple validation for MM-DD-YY format
	if len(date) != 8 {
		return false
	}
	return true
}

func isValidReps(reps int) bool {
	return reps > 0
}

func isValidWeight(weight int) bool {
	return weight > 0
}

func isValidUnit(unit string) bool {
	return unit == "kgs" || unit == "lbs"
}
