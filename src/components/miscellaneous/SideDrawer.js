import { Box } from '@chakra-ui/react';
import React from 'react'
import { useState } from 'react';
import { Tooltip } from "@chakra-ui/tooltip";
import { Button } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { Menu } from '@chakra-ui/react';
import { MenuButton } from '@chakra-ui/react';
import { MenuList } from '@chakra-ui/react';
import { MenuItem } from '@chakra-ui/react';
import { MenuDivider } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar } from '@chakra-ui/react';
import { ChatState } from '../../context/ChatProvider';
import { useHistory } from "react-router-dom";
import { useDisclosure } from '@chakra-ui/react';
import Loading from '../Loading';
import ProfileModel from './ProfileModel';
import UserListItem from '../UserAvatar/UserListItem';
import Notification from './Notification';

// import { Effect } from "react-notification-badge";
import { Spinner } from '@chakra-ui/react';
import {
    Drawer,
    DrawerBody,
    // DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    // DrawerCloseButton,
    Input,
    useToast
} from '@chakra-ui/react'
// import NotificationBadge from "react-notification-badge";
// import {Badge} from '@mui/material'
import { getSender } from '../config/ChatLogics';





export default function SideDrawer() {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { user, setSelectedChat, chats, setChats,notification,setNotification } = ChatState();
    const toast = useToast();
    const history = useHistory();
    const logoutHandler = () => {
        localStorage.removeItem("authToken");
        history.push("/");
    };

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please Enter something in search',
                description: "Warning",
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: "top-left"
            })
            return
        }
        try {
            setLoading(true);
            // console.log(user.token)
            const data = await fetch(`http://localhost:5100/api/userData?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            })
            setLoading(false);
            const json = await data.json()
            console.log(json)
            setSearchResult(json);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const response = await fetch("http://localhost:5100/api/chat", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ userId: userId })
            })
            const json = await response.json();
            //   console.log(json)
            if (!chats.find((c) => c._id === json._id)) setChats([json, ...chats]);
            setSelectedChat(json);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: 'Error fetching the chat',
                description: "Warning",
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: "top-left"
            })
            setLoadingChat(false)
            onClose();
        }
    }

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <React.Fragment>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant='ghost' onClick={onOpen}>
                        {/* to include the i tag we need to import cdn link font awesome in
                         the public/index.html Search font awesome cdn and copy the link of version 
                        5.13.3 */}
                        <i className="fas fa-search"></i>
                        <Text display={{ base: "none", md: "flex" }} px={4}>
                            {/* base none means when the screen is small the text will not shown */}
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="3xl" fontFamily="Work sans">
                    Just Chat 
                </Text>
                <div style={{display:'flex'}}>
                    <Menu>
                        <MenuButton p={1}>
                                <Notification counts={notification.length}></Notification>
                        </MenuButton>
                        {/* notifications */}
                        <MenuList pl={3}>
                            {!notification.length && "No New messages"}
                            {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
                            {/* Avatar os for profile picture */}
                            <Avatar
                                size="sm"
                                cursor="pointer"
                                name={user.name}
                                src={user.pic}
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>
                                Go</Button>
                        </Box>
                        {loading ? <Loading /> : (searchResult?.map((user) => (  //user means from esponse array each item
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => accessChat(user._id)}
                            />
                        )))}
                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </React.Fragment>
    )
}
