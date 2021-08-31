const router=require("express").Router();
const Post=require("../models/Post");
const User=require("../models/User");
//createpost

router.post("/",async (req,res)=>{
    const newPost = new Post(req.body);
    try{
        const savedPost= await newPost.save();
        res.status(200).json("Post Created and Saved Successfully");
    }
    catch(err){
        res.status(500).json(err);
    }

});


//update
router.put("/:id", async (req,res)=>{
    try{
        const post= await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post.updateOne({$set:req.body});
            res.status(200).json("Post Updated Successfull");
        }
        else{
            res.status(403).json("You can only update your post");
        }
        
    } catch(err){
        res.status(500).json(err);
    }

});


router.delete("/:id", async (req,res)=>{
    try{
        const post= await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post.deleteOne();
            res.status(200).json("Post has been deleted");
        }
        else{
            res.status(403).json("You can only delete only your post");
        }
        
    } catch(err){
        res.status(500).json(err);
    }

});


//like dislike

router.put("/:id/like", async (req,res)=>{
    try{
        const post= await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId))
        {
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("Successfully Liked the Post")
        }
        
    
        else{
           await post.updateOne({$pull:{likes:req.body.userId}});
           res.status(200).json("Successfully Disliked Post");
        }
        
    } catch(err){
        res.status(500).json(err);
    }

});

//get post
//get timeline posts

router.get("/timeline" , async (req,res)=>{
    try
    {
        const currentUser= await  User.findById(req.body.userId);
        const userPosts = await Post.find({userId:currentUser._id});
        const friendPosts= await Promise.all(
            currentUser.following.map((friendId)=>{
                Post.find({userId: friendId});
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts));


    }
    catch(err)
    {
        res.status(500).json(err);
    }

});


module.exports=router;