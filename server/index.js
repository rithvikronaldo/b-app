const express = require('express')
const app = express();
const cors = require('cors')
const port = process.env.PORT || 3000;

// middlewear 
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!')
})

// mongodb confiq here
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://new-user-77:XLhIaDWmNs2wce8k@cluster0.z4hd7ku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// This block of code is responsible for connecting to MongoDB using the MongoClient from the 'mongodb' package.

async function run() {
    try {
        // Connect the client to the MongoDB server
        await client.connect();

        // Get the collection named "Books" from the "BookInventory" database
        const bookCollections = client.db("BookInventory").collection("Books");

        // This endpoint handles POST requests to '/upload-book'
        app.post("/upload-book", async (req, res) => {
            // Extract the data from the request body
            const data = req.body;
            // Insert the data into the 'Books' collection
            const result = await bookCollections.insertOne(data);
            // Send the result back as the response
            res.send(result);
        });

        // This endpoint handles GET requests to '/all-books'
        // It retrieves all books or books filtered by category if a category is specified in the query parameter
        app.get("/all-books", async (req, res) => {
            let query = {};
            if (req.query?.category) {
                query = { category: req.query.category };
            }
            // Find books in the 'Books' collection based on the query and convert them to an array
            const result = await bookCollections.find(query).toArray();
            // Send the result back as the response
            res.send(result);
        });

        app.get("/books/:category", async (req, res) => {
            const category = req.params.category;
            // Define the query to find books by category
            const query = { category: category };
            // Find books in the 'Books' collection based on the category and convert them to an array
            const result = await bookCollections.find(query).toArray();
            // Send the result back as the response
            res.send(result);
        });

        // This endpoint handles PATCH requests to '/book/:id'
        // It updates a book with the specified ID
        app.patch("/book/:id", async (req, res) => {
            const id = req.params.id;
            // Extract the updated book data from the request body
            const updateBookData = req.body;
            // Define the filter to find the book by ID
            const filter = { _id: new ObjectId(id) };
            // Define the update operation
            const updatedDoc = {
                $set: {
                    ...updateBookData
                }
            };
            const options = { upsert: true };
            // Update the book in the 'Books' collection
            const result = await bookCollections.updateOne(filter, updatedDoc, options);
            // Send the result back as the response
            res.send(result);
        });

        // This endpoint handles DELETE requests to '/book/:id'
        // It deletes a book with the specified ID
        app.delete("/book/:id", async (req, res) => {
            const id = req.params.id;
            // Define the filter to find the book by ID
            const filter = { _id: new ObjectId(id) };
            // Delete the book from the 'Books' collection
            const result = await bookCollections.deleteOne(filter);
            // Send the result back as the response
            res.send(result);
        });

        // This endpoint handles GET requests to '/book/:id'
        // It retrieves a single book with the specified ID
        app.get("/book/:id", async (req, res) => {
            const id = req.params.id;
            // Define the filter to find the book by ID
            const filter = { _id: new ObjectId(id) };
            // Find the book in the 'Books' collection
            const result = await bookCollections.findOne(filter);
            // Send the result back as the response
            res.send(result);
        });

        // Ping the MongoDB deployment to confirm the connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // The client will not close immediately; it will be kept open for handling requests
    }
}

// Call the run function to start the server and connect to MongoDB
run().catch(console.dir);

// Start the Express server and listen for incoming requests on the specified port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
