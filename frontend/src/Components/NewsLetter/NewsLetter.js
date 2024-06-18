import React, { useState } from 'react'
import './NewsLetter.css'
const NewsLetter = () => {

  const [email, setemail] = useState("")
   async function handleSubscribe(){
    if(email == ""){
      alert("email cannot be empty")
    }else{
      await fetch("http://localhost:4000/subscribe", {
        method: "POST",
        headers:{
          Accept:'application/form-data',
          'Content-Type':'application/json',
        },
        body: JSON.stringify({email: email})
      })
      .then((res) => {
        alert("successfully added")
        window.location.reload()
      })
      .catch((err) => alert("email already exists"))
    }
  }

  return (
    <div className='newsletter'>
     <h1>Get Exclusive Offers On Your Email</h1>
     <p>Subscribe to our newsletter and stay updated</p>
     <div>
        <input onChange={(e) => setemail(e.target.value)} type="email" placeholder='Enter your email id' />
        <button onClick={handleSubscribe}>Subscribe</button>
     </div>
    </div>
  )
}

export default NewsLetter