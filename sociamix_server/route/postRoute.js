const router = require("express").Router();
const Post = require("../model/Post");
const User = require("../model/User");

//GET
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET TIMELINE

router.get("/timeline/:id", async (req, res) => {
    try {
        //On recupère le profil de l'utilisateur
        const currentUser = await User.findById(req.params.id);
        // On récupère les posts
        const userPosts = await Post.find({ userId: currentUser._id });
        // On recupère les posts des follows
        const friendPosts = await Promise.all(
            currentUser.friends.map(friendId => {
                return Post.find({ userId: friendId });
            })
        )
        const timeline = userPosts.concat(...friendPosts);

        const updatedTimeline = [];

        for (var post of timeline) {
            var user = await User.findById(post.userId);
            post = post.toObject();
            post.profilePicture = user.profilePicture;
            post.firstName = user.firstName;
            post.name = user.name;
            post.isAdmin = user.isAdmin;
            updatedTimeline.push(post);
        }

        // trie les posts par date de création
        updatedTimeline.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // On renvoie un mélange des posts des amis + soi même
        res.status(200).json(updatedTimeline)
    } catch (error) {
        res.status(500).json(error);
    }
})

// CREATE

router.post("/", async (req, res) => {
    req.body.userId = req.id;
    const newPost = await new Post(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
})

//UPDATE

router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.id) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("The post has been updated");
        } else {
            res.status(403).json("You can only update your post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

//DELETE

router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.id || req.isAdmin === true) {
            await post.deleteOne();
            res.status(200).json("The post has been deleted");
        } else {
            res.status(403).json("You are not allowed to delete this post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

//LIKE & DISLIKE

router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.id)) {
            await post.updateOne({ $push: { likes: req.id } })
            res.status(200).json("SUCCESLIKED")
        } else {
            await post.updateOne({ $pull: { likes: req.id } })
            res.status(200).json("SUCCESDISLIKED")
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET ALL POSTS BY USER 
router.get("/profile/:id", async (req, res) => {
    try {
        const userCible = await User.findById(req.params.id);
        if (userCible.isPrivate && (userCible.friends.includes(req.id) || userCible._id == req.id)) {


            const posts = await Post.find({ userId: req.params.id })
            const updatedTimeline = [];

            for (var post of posts) {
                var user = await User.findById(post.userId);
                post = post.toObject();
                post.profilePicture = user.profilePicture;
                post.firstName = user.firstName;
                post.name = user.name;
                updatedTimeline.push(post);
            }

            // trie les posts par date de création
            updatedTimeline.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            res.status(200).json(updatedTimeline)
        }
        else if (userCible.isPrivate !== true) {
            const posts = await Post.find({ userId: req.params.id })
            const updatedTimeline = [];

            for (var post of posts) {
                var user = await User.findById(post.userId);
                post = post.toObject();
                post.profilePicture = user.profilePicture;
                post.firstName = user.firstName;
                post.name = user.name;
                updatedTimeline.push(post);
            }

            // trie les posts par date de création
            updatedTimeline.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            res.status(200).json(updatedTimeline)
        }
        else {
            res.status(403).json("This user is private")
        }


    } catch (error) {
        res.status(500).json(error);
    }
})


// GET LAST POST BY USER
router.get("/last/:id", async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.id })
        // prend le dernier post
        const lastPost = posts[posts.length - 1];
        var user = await User.findById(req.params.id);
        var lastPostObject = lastPost.toObject();
        lastPostObject.profilePicture = user.profilePicture;
        lastPostObject.firstName = user.firstName;
        lastPostObject.name = user.name;
        // le renvoie
        res.status(200).json(lastPostObject)
    } catch (error) {
        res.status(500).json(error);
    }
})



// ajouter un commentaire
router.put("/:id/comment", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        await post.updateOne({ $push: { comments: req.body } })
        res.status(200).json("The comment has been added");
    } catch (error) {
        res.status(500).json(error);
    }
})

// recupére les commentaires d'un post
router.get("/:id/comment", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post.comments);
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router; 