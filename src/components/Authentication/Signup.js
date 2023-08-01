import React from 'react'
import { useState } from 'react'
// import { useHistory } from 'react-router-dom'
import { Button, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { FormControl,FormLabel } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'



export default function Signup() {
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [confirmpassword,setconfirmpassword]=useState('');
  const [pic,setPic]=useState('');
  const [show,setShow]=useState(false);
  const [confirm,setconfirm]=useState(false);
  const [loading,setLoading]=useState(false);
  const toast = useToast();
  // const history=useHistory();


  // console.log(name);
  const showHandler=()=>{
    setShow(!show);
  }
  const confirmHandler=()=>{
    setconfirm(!confirm);
  }

      //for pic upload cloudinary
 const postDetails=(pic)=>{
  setLoading(true)
  if(pic===undefined){
    toast({
      title: 'please select an image',
      description: "Warning",
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
    return;
  }
  if(pic.type==='image/jpeg' || pic.type==='image/png'){
        const data=new FormData();
        data.append('file',pic);
        data.append('upload_preset','chat_me')
        data.append('cloud_name','daa32dbfj')
        fetch('https://api.cloudinary.com/v1_1/daa32dbfj/image/upload',{ //last image/upload is addded by us with the API base URL
          method:'post',
          body:data
        }).then(res=>res.json()).then(data=>{
          setPic(data.url.toString());
          console.log(data.url.toString())
          setLoading(false);
        }).catch(err=>{
          console.log(err);
          setLoading(false);
        })
  }
else{
  toast({
    title: 'please select an image',
    description: "Warning",
    status: 'error',
    duration: 5000,
    isClosable: true,
  })
}}





const submitHandler=async ()=>{
    setLoading(true);
    if(!name || !email || !password || !confirmpassword){
      toast({
        title: 'please fill all the fields',
        description: "Warning",
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setLoading(false);
      return;
    }
    if(password!==confirmpassword){
      toast({
        title: 'passwords Do not match',
        description: "Warning",
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setLoading(false);
      return;
    }
    try{
    const response = await fetch("http://localhost:5100/api/createuser", {
      method: 'POST',
        headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email,password,pic })
    });
    const json = await response.json();

    if(json.success==='length'){
      toast({
        title: 'Name and Password length should be minimum 5 characters',
        description: "error",
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setLoading(false);
      return  
    }

    if(json.success==='Already Exists'){
    toast({
        title: 'You are alredy registered please login to continue',
        description: "success",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      setLoading(false);
      return  
    }
    if (json.success) {
      toast({
        title: 'Registration Successfull please login to continue',
        description: "success",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      setLoading(false);
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
      <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder='Enter your Name'
        onChange={(e)=>{setName(e.target.value)}}//no need to set the value prop input will manage this
        />
      </FormControl>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder='Enter your Email'
        onChange={(e)=>{setEmail(e.target.value)}}//no need to set the value prop input will manage this
        />
      </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>password</FormLabel>
        <InputGroup>
          <Input type={show?'text':'password'}
          placeholder='Enter your password'
          onChange={(e)=>{setPassword(e.target.value)}}/>
        <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='5m' onClick={showHandler}>
              {show?"Hide":"Show"}
          </Button>
        </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='confirm password' isRequired>
        <FormLabel>confirm password</FormLabel>
        <InputGroup>
          <Input type={confirm?'text':'password'}
          placeholder='confirm password'
          onChange={(e)=>{setconfirmpassword(e.target.value)}}/>
        <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='5m' onClick={confirmHandler}>
              {confirm?"Hide":"Show"}
          </Button>
        </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='pic'>
        <FormLabel>Upload your Picture</FormLabel>
        <Input type='file'
        p={1.5}
        accept='image/*'
        onChange={(e)=>postDetails(e.target.files[0])}
        />
      </FormControl>
    <Button
     colorScheme='blue'
     width='100%'
     style={{marginTop:15}}
     onClick={submitHandler}
     isLoading={loading}
    >Signup</Button>

    </VStack>
  )
}
