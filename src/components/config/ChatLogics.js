export const getSender = (loggedUser, users) => {
  if(!users||!loggedUser) return;
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

export const getSenderFull = (loggedUser, users) => {
  if(!users||!loggedUser) return;
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };



//isNotSameSender function is for determine if the messages are from other end means other than from you or not , if yes then a the end of his 
// consequitive chat you have to display here the avatar   here this function not determineing whether the leatest message send from other usrs
// end or not for then also you have to shoe the avatar and there we have isLastMessage 
 
export const isNotSameSender=(messages,m,i,loggeduserId)=>{
  return (
    i<messages.length-1 && 
    (messages[i+1].sender._id !== m.sender._id||
    messages[i+1].sender._id===undefined)&&
    messages[i].sender._id!==loggeduserId
  )
}



export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};


//this isSameSenderMargin actually returns margin when the chat is from other user means other than the logged user on that case for every
// except last sended consequitive message the return value is 33 and for the last consequitive message the return value is 0 and for the 
// logged user the returned value is auto
export const isSameSenderMargin = (messages, m, i, userId) => {

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};


export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
