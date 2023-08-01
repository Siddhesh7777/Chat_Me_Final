import { createContext, useContext, useState } from "react";

// import { useHistory } from "react-router-dom";




const ChatContext = createContext();

const ChatProvider = (({ children }) => {//?
    const [user, setUser] = useState();
    const [selectedChat,setSelectedChat]=useState();
    const [chats,setChats]=useState([]);
    const [notification,setNotification]=useState([]);

    //value is accessible by all other components
    return <ChatContext.Provider value={{ user, setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification }}>
        {children}
    </ChatContext.Provider>
});


export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;