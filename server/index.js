
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8088;

// Schema
const schemaData = new mongoose.Schema({
    name: String,
    email: String,
    mobile: Number
}, {
    timestamps: true
});

const userModel = mongoose.model("user", schemaData);

// Read Data
app.get("/", async (req, res) => {
    try {
        const data = await userModel.find({});
        res.json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching data" });
    }
});

// Create Data
app.post("/create", async (req, res) => {
    try {
        const data = new userModel(req.body);
        await data.save();
        res.json({ success: true, message: "Data saved successfully", newData: data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error saving data" });
    }
});

// Update Data
app.put("/update/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = await userModel.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, message: "Data updated successfully", data: updatedData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating data" });
    }
});

// Delete Data
app.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deletedData = await userModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Data deleted successfully", data: deletedData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting data" });
    }
});

// Connect to MongoDB and Start Server
mongoose.connect("mongodb://127.0.0.1:27017/curdoperation")
    .then(() => {
        console.log("Connected to DB");
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch((err) => console.log("Error connecting to DB:", err));
