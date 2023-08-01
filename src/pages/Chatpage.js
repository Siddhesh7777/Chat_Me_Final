import { Box } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider"
import SideDrawer from "../components/miscellaneous/SideDrawer";
import ChatBox from "../components/miscellaneous/ChatBox";
import MyChats from "../components/miscellaneous/MyChats";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";


export default function Chatpage() {
  const {user,setUser}=ChatState();//Actually chatstate contains the userstate
  const history = useHistory();
  const [fetchAgain,setFetchAgain]=useState(false);//for rerendering of chats when you leave a group

  // console.log('chatpage');
  useEffect(() => {
            const authtoken = JSON.parse(localStorage.getItem('authToken'));
             // console.log('chatprovider');
            // console.log(authtoken);   
            setUser(authtoken);
            if (!authtoken) {
                history.push("/")
            }
            
        }, [history])
  

  return (
    <div style={{width:'100%'}}>
      {user&&<SideDrawer/>}
      <Box 
      display='flex'
      justifyContent='space-between'

      w='100%'
      h='91.5vh'
      p='10px'
      >
        {user&&<MyChats fetchAgain={fetchAgain}/>}
        {user&&<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}
