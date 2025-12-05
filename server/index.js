import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import jwt from 'jsonwebtoken'
dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());

// DB connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err))

// Schemas
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio", default: null }

})
const UserModel = mongoose.model("User", UserSchema)

const PortfolioSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    bio: String,
    jobTitle: String,
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }]
})

const PortfolioModel = mongoose.model("Portfolio", PortfolioSchema)

const ProjectSchema = new mongoose.Schema({
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" },
    title: String,
    description: String,
    techStack: [String]
})

const ProjectModel = mongoose.model("Project", ProjectSchema)

// Middleware
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "")
    if (!token) return res.status(401).json("No token provided")

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json("Invalid token")
        req.user = decoded
        next()
    })
}

// Register
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (await UserModel.findOne({ email }))
            return res.status(400).json("User already exists")

        const user = await UserModel.create({ name, email, password })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.status(201).json({ user, token })
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Error registering user")
    }
})

// Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email })

        if (!user) return res.status(400).json("User not found")
        if (password !== user.password) return res.status(400).json("Invalid password")

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.status(200).json({ user, token })
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Error logging in")
    }
})

// Create Portfolio
// Create Portfolio
app.post("/createPortfolio", verifyToken, async (req, res) => {
    try {
        // Check if portfolio already exists
        const existing = await PortfolioModel.findOne({ user: req.user.id });
        if (existing) return res.status(400).json("Portfolio already exists");

        const { bio, jobTitle } = req.body;

        const portfolio = await PortfolioModel.create({
            user: req.user.id,
            bio,
            jobTitle
        });

        // link to user
        await UserModel.findByIdAndUpdate(req.user.id, { portfolio: portfolio._id });

        res.status(200).json(portfolio);
    } catch (err) {
        console.log(err.message);
        res.status(500).json("Error creating portfolio");
    }
});



// Get Portfolio
app.get("/getPortfolio/:id", verifyToken, async (req, res) => {
    try {
        const portfolio = await PortfolioModel.findById(req.params.id).populate("projects")
        res.status(200).json(portfolio)
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Error fetching portfolio")
    }
})


// Update Portfolio
app.put("/updatePortfolio/:id", verifyToken, async (req, res) => {
    try {
        const portfolio = await PortfolioModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json(portfolio)
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Error updating portfolio")
    }
})


// Delete Portfolio
// Delete Portfolio
app.delete("/deletePortfolio/:id", verifyToken, async (req, res) => {
    try {
        await PortfolioModel.findByIdAndDelete(req.params.id);

        // Remove reference from user
        await UserModel.findByIdAndUpdate(req.user.id, { portfolio: null });

        res.status(200).json("Portfolio deleted successfully");
    } catch (err) {
        console.log(err.message);
        res.status(500).json("Error deleting portfolio");
    }
});

// Server
app.listen(5004, () =>
    console.log("Server running → http://localhost:5004")
)
