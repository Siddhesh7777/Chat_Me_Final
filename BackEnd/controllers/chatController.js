const Chat=require('../models/chatModel');
const User=require('../models/userModel')

//when a user want to access all chats that do does with another particular users
const accessChat=async (req,res)=>{
const {userId}=req.body;//? whose chat the user want to retrieve that needs to be send

if(!userId){
    console.log("UserId param not sent with teh req")
    return res.sendStatus(400);
}
// console.log(req.user._id)
// console.log(req.body.userId)
 var isChat=await Chat.find({
    isGroupChat:false,
    $and:[
        {users:{$elemMatch:{$eq:req.user._id}}},
        {users:{$elemMatch:{$eq:req.body.userId}}},   
    ],
 })
.populate("users","-password")// by populate method the users field is replaced by user details
.populate('latestMessage')

isChat = await User.populate(isChat, {
  path: "latestMessage.sender",
  select: "name pic email",
});
// console.log(isChat);

if(isChat.length>0){
    res.send(isChat[0]);
}else{
    var chatData={
        chatName:"sender",
        isGroupChat:false,
        users:[req.user._id,userId]
    }
    try{
        const createdChat=await Chat.create(chatData);
        // console.log(createdChat);
        const Fullchat=await Chat.findOne({_id:createdChat._id}).populate(
            "users","-possword"
        )
            // console.log(Fullchat);
      return  res.send(Fullchat)
    }catch(error){
        throw new Error(error.message);
    }
}
}


//when the user wants to fetch all chats which actually he does or involves
const fetchChat=async(req,res)=>{
    try{
        // const chat_data=await
         Chat.find({users:{$elemMatch:{$eq:req.user._id}}}).populate("users","-password").populate("groupAdmin","-password")
        .populate("latestMessage").sort({updatedAt:-1}).then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
          res.status(200).send(results);
        });
        // console.log(chat_data)
        // return res.send(chat_data);
    }catch(error){
        res.status(400);
        throw new Error(error.message);
    }
}

//when a user wants to create a group he has to provide the name of the group and also an array of users who are the members of the group
const createGroupChat=async(req,res)=>{
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
      }
    //   console.log(req.body.users)
      var users = JSON.parse(req.body.users);
    //   console.log(users)

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(fullGroupChat);
} catch (error) {
  res.status(400);
  throw new Error(error.message);
}}

//when the user wants to rename the group
const renameGroup=async(req,res)=>{
    const { chatId, chatName } = req.body;
    // var chatId=JSON.parse(req.body.chatId)
    // var chatName=JSON.parse(req.body.chatName)
    // console.log(req.body)

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
}



const addToGroup=async(req,res)=>{
    const { chatId, userId } = req.body;

    // check if the requester is admin
  
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
}


const removeFormGroup=async(req,res)=>{
    const { chatId, userId } = req.body;

    // check if the requester is admin
  
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
}



module.exports={accessChat,fetchChat,createGroupChat,renameGroup,addToGroup,removeFormGroup};