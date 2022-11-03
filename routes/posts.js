const express = require("express"),
    router = express.Router(),
    Post = require("../models/Post");

// * Get all posts
router.get("/", async (req, res) => {
    try {
        // get all posts
        const posts = await Post.find();

        res.json(posts);
    } catch (error) {
        res.json({message: error})
    } 
});

// * Get all posts
router.get('/:id', async (req, res) => {
    const postId = req.params.id;
    
    try {
        const post = await Post.findById(postId);
        
        // if post with given id does not exist
        if (post === null) {
            return res.json({message: `Post with id: ${postId} not found`});
        }
        // if post is found
        res.json(post);
        
    } catch (error) {
        res.json({message: error});
    }
})

// * creating a Post object - Using promises when saving the MongoDB instance
/**
 router.post("/new", (req, res) => {
     const data = req.body;
     const post = new Post({...data});
 
     post
         .save()
         .then(data => {
             res.send(data);
         })
         .catch(error => {
             res.send(error);
         })
 });
 */

// * creating a Post object - Using try catch when saving the MongoDB instance
router.post('/new', async(req, res) => {
    // get request body
    const data = req.body;

    // create Post instance from request body data
    const post = new Post({...data});

    try {
        // save Post instance to MongoDB server
        const savedPostInstance = await post.save();
        // return 
        res.json(savedPostInstance);
    } catch (error) {
        res.json({message: error});
    }
})

// update a single post
router.patch('/:id', async (req, res) => {
    try {
        const updatedPost = await Post.updateOne(
            {_id: req.params.id},
            {$set: {...req.body}}
        );
        return res.json(updatedPost);
    } catch (error) {   
        res.json({message: error});
    }
})

// delete a post
router.delete('/:id', async (req, res) => {
    try {
        const deletedPost = await Post.remove(
            {_id: req.params.id},
        )
        res.json(deletedPost);
    } catch (error) {
        res.json({message: error});
    }
})

module.exports = router;
