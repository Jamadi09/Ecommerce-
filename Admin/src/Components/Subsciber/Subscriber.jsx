import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

function Subscriber() {

    const [subscribers, setsubscribers] = useState([])

   useEffect(() =>{
    fetch("https://ecommerce-backend-ldbc.onrender.com/subscribe",{
        method:"GET"
    })
    .then((res) =>res.json())
    .then((res) => setsubscribers(res) )
    .catch((err) => console.log(err))
   }, [])
    
  return (
    <div>
       
       {
        subscribers?.map((each) =>(
            <div key={each.id}>
                <h2>{each.email}</h2>
            </div>
        ))
       } 

    </div>
  )
}

export default Subscriber
