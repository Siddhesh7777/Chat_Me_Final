import React from 'react'
import Loading from '../Loading';

export default function IsLoading({chats}) {
  return (
    <>
        {chats.length===0?<></>:<Loading></Loading>}
    </>
  )
}
