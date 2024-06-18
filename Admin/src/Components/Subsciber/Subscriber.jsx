import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

function Subscriber() {

    const [subscribers, setsubscribers] = useState([])

   useEffect(() =>{
    fetch("http://localhost:4000/subscribe",{
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