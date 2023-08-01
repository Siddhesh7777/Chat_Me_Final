//user reqests for all the users with some search you have to return all the users with that search except the user request for it

const User=require('../models/userModel')
///api?search=Ram  ->queries
const AllUsers=async(req,res)=>{
  const keyword=req.query.search?
  // console.log(keyword)
  {$or:[
    {name:{$regex:req.query.search,$options:"i"}},//options i means case insensitive
    {email:{$regex:req.query.search,$options:"i"}}
  ]}:{};

  const users=await User.find(keyword).find({_id:{$ne: req.user._id}}); //when a user requests for search all users return list pf all users except that particular user
 return res.send(users)
}

module.exports=AllUsers
