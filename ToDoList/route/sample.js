const express = require('express')
const router = express.Router()
const { getBlogs } = require('../mongodb')
const { deleteBlogs } = require('../mongodb')
const { putBlogs } = require('../mongodb')
const { postBlogs } = require('../mongodb')
const { getLoginUser } = require('../mongodb')
const { createUser } = require('../mongodb')
const { checkEmailUnique } = require('../mongodb')




router.get('/login/:email', async (req, res) => {
    try {
        const { email } = req.params;
        console.log(email)
        const user = await getLoginUser(email);
        console.log(user)
        if (user) {
            res.json({ message: 'Login successful', user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error logging in', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/checkEmailUnique/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const isUnique = await checkEmailUnique(email);
        res.json({ isUnique });
    } catch (error) {
        console.error('Error while checking email uniqueness:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post("/postUser", async (req, res) => {
    try{
        const {name, email , password}= req.body
        const user= await createUser(name, email, password)

        res.status(200).json({message:'User created sucessfully', user})
    }
    catch(error){
        console.error('Error when creating user',error)
        res.status(500).json({message:'Internal server error'})
    }
})

router.get("/getBlogs",async (req,res)=>{
    try{
        const blogs = await getBlogs();
        res.json(blogs);
    }
    catch(error){
        console.error("Error getting blogs",error);
        res.status(500).json({error:'Internal server error'});
    }
})

router.post('/postBlogs',async (req,res)=>{
    try{
        const {name,age,email}=req.body;
        const blogs=await postBlogs(name,age,email);

        res.status(200).json({message:'Blog created succesfully',blogs})
    }
    catch(error){
        console.error('Error when create blog:',error)
        res.status(500).json({message: 'Internal server error'});
    }
})

router.put('/putBlogs/:name', async (req,res)=>{
    try{
        const {name}=req.params;
        const {age,email}=req.body;
        const updatedBlog = await putBlogs(name,age,email);
        if(!updatedBlog)
            return res.status(404).json({error: 'Blog is not found'});
        res.status(200).json({message: "Blog is updated successfully", blogs:updatedBlog})
    }
    catch(error){
        console.error('Error during updating blogs:',error);
        res.status(500).json({error: 'An error occured when updating blog'})
    }
})
  
router.delete('/deleteBlogs/:name', async (req,res)=>{
    try{
        const {name}= req.params;
        const deletedBlog= await deleteBlogs(name);
        if(!deletedBlog)
            return res.status(404).json({error:'Blog is not found during delete'});
        res.status(200).json({message:'Blog is deleted successfully'});
    }
    catch(error){
        console.error('Error deleting blog',error)
        res.status(500).json({error:'An error during deleting student'})
    }
})


module.exports = router;