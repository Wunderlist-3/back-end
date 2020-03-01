const router = require('express').Router();

router.get('/', (req, res)=>{
    res.status(200).json({message:'welcome to the userrouter'})
})

module.exports=router;