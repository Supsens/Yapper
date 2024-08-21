import sharp from "sharp"
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReciverSocketId,io } from "../sockets/socket.js";
export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;
        if (!image) {
            return res.status(400).json({
                message: "Image Required",
            })
        }
        //image upload
        const optimisedimageandbuffer = await sharp(image.buffer).resize({ width: 800, height: 800, fit: "inside" }).toFormat('jpeg', { quality: 80 }).toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimisedimageandbuffer.toString('base64')}`
        const cloudRes = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudRes.secure_url,
            author: authorId
        });
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }
        await post.populate({ path: 'author', select: '-password' });
        return res.status(201).json({
            message: "New Post Added",
            post,
            success: true,
        })
    } catch (error) {
        return console.log("Error in addnewpost error:", error)
    }
}


export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ created: -1 }).populate({ path: 'author', select: '-password' }).populate({
            path: 'comments', sort: { created: -1 }, populate: {
                path: 'author',
                select: '-password'
            }
        });
        return res.status(200).json({
            posts,
            success: true,
        })

    } catch (error) {
        return console.log("Error in getAllPost error:", error)
    }
}



export const getuserpost = async (req, res) => {
    try {
        const authorId = req.id
        const posts = await Post.find({ author: authorId }).sort({ created: -1 }).populate({ path: 'author', select: '-password' }).populate({
            path: 'comments', sort: { created: -1 }, populate: {
                path: 'author',
                select: '-password'
            }
        })

        return req.status(200).json({
            posts,
            success: true,
        })

    } catch (error) {
        return console.log("Error in getuserpost error:", error)
    }
}


export const likePost = async (req, res) => {
    try {
        const postId  = req.params.id;
        const userId = req.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        // Like the post
        await post.updateOne({ $addToSet: { likes: userId } });
        await post.save();
        const user=await User.findById(userId).select('username profilePicture');
        const postOwnerId=post.author.toString();
        if(postOwnerId!==user)
        {
            const notification={
                type:'like',
                userId,
                userDetails:user,
                postId,
                message:'Your Post was liked'
            }
            const postOwnerSocketid=getReciverSocketId(postOwnerId);
            io.to(postOwnerSocketid).emit('notification',notification)
        }
        res.status(200).json({
            success: true,
            message: "Post liked",
            likes: post.likes.length + 1, // Incrementing the likes count
            post
        });



    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};



export const unlikePost = async (req, res) => {
    try {
        const  postId = req.params.id;
        const userId = req.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Unlike the post
        await post.updateOne({ $pull: { likes: userId } });
        await post.save();

        res.status(200).json({
            success: true,
            message: "Post unliked",
            likes: post.likes.length - 1, // Decrementing the likes count
            post
        });

        const user=await User.findById(userId).select('username profilePicture');
        const postOwnerId=post.author.toString();
        if(postOwnerId!==user)
        {
            const notification={
                type:'dislike',
                userId,
                userDetails:user,
                postId,
                message:'Your Post was disliked'
            }
            const postOwnerSocketid=getReciverSocketId(postOwnerId);
            io.to(postOwnerSocketid).emit('notification',notification)
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

export const addcomment = async (req, res) => {

    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.id;

        if (!text) {
            return res.status(404).json({
                success: false,
                message: "Empty comment not Possible"
            });

        }
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        const comment = await Comment.create({
            text,
            author: userId,
            post: postId
        });
        await comment.populate({ path: 'author', select: '-password' })

        post.comments.push(comment._id);

        await post.save();

        return res.status(201).json({
            message: 'comment Added',
            comment,
            success: true
        })
    } catch (error) {


        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }

}



export const getCommentsofPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId }).populate('author', 'username', ' profilePicture');

        if (!comments) {
            return res.status(404).json({
                message:
                    'no comments found', success: false
            })
        }
        return res.status(200).json({
            success: true,
            comments
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}



export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        if (post.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorised"
            });
        }

        await Post.findByIdAndDelete(postId);

        let user = await User.findById(userId);

        user.posts = user.posts.filter(id => id.toString() !== postId)

        await user.save();
        
        await Comment.deleteMany({ post: postId });


        return res.status(200).json({
            success: true,
            message: "Post deletd"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}



export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id
        const userId = req.id
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({
            success: false,
            message: "post not found"
        })

        const user = await User.findById(userId)
        if (user.bookmarks.includes(post._id)) {
            //remove from bookmark
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save()
            return res.status(200).json({
                success: true,
                message: "post removed from bookmark"
            })
        }
        else {
            //add to bookmark

            await user.updateOne({ $push: { bookmarks: post._id } });
            await user.save()
            return res.status(200).json({
                success: true,
                message: "post added from bookmark"
            })

        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}