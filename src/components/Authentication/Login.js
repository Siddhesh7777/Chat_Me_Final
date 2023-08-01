import React from 'react'
import { useState } from 'react'
import { Button, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { FormControl,FormLabel } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'


export default function Login() {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [show,setShow]=useState(false);
    const [loading,setLoading]=useState(false);
    const toast = useToast();
    const history=useHistory();

    // console.log(name);
    
    const showHandler=()=>{
      setShow(!show);
    }
   
   const submitHandler=async()=>{
      setLoading(true)
      if(!email||!password){
          toast({
            title: 'please fill all the fields',
            description: "Warning",
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
          setLoading(false);
          return; }
          try{
            const response = await fetch("http://localhost:5100/api/loginuser", {
              method: 'POST',
                headers: {
                 'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email,password })
            });
            const json = await response.json();
            if (!json.success) {
              toast({
                title: 'Entered details not matched',
                description: "Failed to login",
                status: 'error',
                duration: 5000,
                isClosable: true,
              })
              setLoading(false);
              return;
            }
            if (json.success) {
              toast({
                title: 'Welcome to Chat Me',
                description: "success",
                status: 'success',
                duration: 5000,
                isClosable: true,
              })
              await localStorage.setItem("authToken", JSON.stringify(json));
              // console.log(localStorage.getItem("authToken"))
              setLoading(false);
              history.push('/chats')
            }
          }
            catch(err){
              toast({
                title: 'Error occured',
                description: err.description,
                status: 'error',
                duration: 5000,
                isClosable: true,
              })
              setLoading(false);
            }
   }
  
    return (
      <VStack spacing='5px'>
        <FormControl id='email' isRequired>
          <FormLabel>Email</FormLabel>
          <Input placeholder='Enter your Email'
          value={email}
          onChange={(e)=>{setEmail(e.target.value)}}//no need to set the value prop input will manage this
          />
        </FormControl>
        <FormControl id='password' isRequired>
          <FormLabel>password</FormLabel>
          <InputGroup>
            <Input type={show?'text':'password'}
            value={password}
            placeholder='Enter your password'
            onChange={(e)=>{setPassword(e.target.value)}}/>
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='5m' onClick={showHandler}>
                {show?"Hide":"Show"}
            </Button>
          </InputRightElement>
          </InputGroup>
        </FormControl>
      <Button
       colorScheme='blue'
       width='100%'
       style={{marginTop:15}}
       onClick={submitHandler}
       isLoading={loading}
      >Login</Button>
      <Button
       varient='solid'
       colorScheme='red'
       width='100%'
       onClick={()=>{
        setEmail('guest@example.com')
        setPassword("123456")
       }}
      >Get Guest User Credentials</Button>
  
      </VStack>
    )
  }

