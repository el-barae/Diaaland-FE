"use Client";
import React from 'react'
import {signIn , signOut , useSession ,SessionProvider} from "next-auth/react"


const SigninButton = () => {
    const {data : session ,status} = useSession();
    if(session && session.user){
        return (
            <div className='flex gap-4 ml-auto'>
              <p>{session.user.name}</p>
              <button onClick={()=> signOut()}>Sign Out</button>
            </div>
          );
    }
    return (
        <button onClick={() => signIn()} className='ml-auto'>sign In</button>
        //console.log
    )
  
}

export default SigninButton
