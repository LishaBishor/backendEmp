const express=require('express');
const jwt=require('jsonwebtoken')
const router=express.Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}));
const empModel=require('../Model/empModel');
//...post.../login api
router.post('/login',async(req,res)=>{
    let username=req.body.username;
    let password=req.body.password;
    const user= await empModel.findOne({username:username});
    if(!user){
       res.json({message:"User not found"}) ;
    }
    try {
        if(user.password==password){
            jwt.sign({email:username,id:user._id},"sky",{expiresIn:'1d'},
            (error,token)=>{
                if (error) {
                    res.json({message:"Token not generated"})
                } else {
                    res.json({message:"Login suceesfully",token:token,data:user})
                }
            })
           
        }
        else{
            res.json({message:'Login failed'})
        }
    } catch (error) {
        console.log(error)
    }
})
//...get.../viewemp
router.get('/viewemp/:token', async(req,res)=>{
    const data= await empModel.find();
    try{
        jwt.verify(req.params.token,"sky",(error,decoded)=>{
            if(decoded && decoded.email){

                res.json(data)
            }
            else{
                res.json({message:"Unauthorised user"},decoded,decoded.email)
            }
        })
       
    }catch(error){
        res.status(400).json("cannot get, Error:"+ error);
    }
})
//...post..signupEmp api
router.post('/registerEmp',async(req,res)=>{
    try {
        const emp=req.body;
        newEmp=new empModel(emp);
        jwt.verify(req.body.token,"sky",(error,decoded)=>{
            if (decoded && decoded.email) {
                newEmp.save();
        res.json({message:"Registered Successfully"})  
            } else {
                res.json({message:"Unauthorised user"})
            }
        })
       
    } catch (error) {
        res.json({message:'Unable to add'});
        
    }
})
//delete...to delete an employyee
router.delete('/deleteEmp/:id/:token',(req,res)=>{
    
    try{
        let id=req.params.id;
        let token=req.params.token;
        const deleteddata=req.body;
       
        jwt.verify(token,"sky",(error,decoded)=>{
            if (decoded && decoded.email) {
                console.log(deleteddata)
           let deldata= empModel.findByIdAndDelete(id).exec();
        res.json({message:'deleted emp details sucessfully'})
            } else {
                res.json({message:"Unauthorised user",token})
            }
        })
        
    }catch(error){
        res.json({message:"cannot deleted "+error})
    }
})

//..to update.../updateEmp.
router.put('/updateEmp/:id/:token',(req,res)=>{
    try {
       let id=req.params.id;
       let token=req.params.token;
      updateddata=req.body
      jwt.verify(token,"sky",(error,decoded)=>{
        if (decoded && decoded.email) {
             empModel.findByIdAndUpdate(id,updateddata).exec()
            console.log('updated')
            res.json({message:"updated"})  
        } else {
            res.json({message:"unauthorised user"})
        }
      })
     
       } catch (error) {
        res.json("Unable to Update "+error); 
   }
})

module.exports=router;