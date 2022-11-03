const 
    express = require("express"),
    app = express(),
    path = require('path'),
    mongoose = require('mongoose'),
    requireAuth = require("./routes/middleware");
    PORT = 3000;

// ? to be able to use env vars from .env
require('dotenv/config');

// ? Enable JSON parsing
app.use(express.json());


// ? STATIC FILES
// app.use(express.static('public'));

// ? serving static files from absolute path, with virtual prefix
app.use('/static', express.static(path.join(__dirname, 'public')))

// ? MIDDLEWARE
// This works like include() in Django URLs
const postRoutes = require('./routes/posts');
app.use('/posts', requireAuth, postRoutes);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes)


app.get('/', (req, res) => {
    res.send("Home route on server");
})

// connect to mongo db
mongoose.connect(process.env.DB_CONNECTION_URI, () => {
    console.log("Connected to MongoDB successfully");
})

app.listen(PORT, () => {
    console.log(`Express server running on ${PORT}`);
})