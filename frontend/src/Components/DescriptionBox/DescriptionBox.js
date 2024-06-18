import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
     <div className='descriptionbox-navigator'>
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
     </div>
     <div className="descriptionbox-description">
        <p>An Ecommerce websiteis an online platform that falicitates buying and selling of
         products or services over the internet. It serves as a virtual market place where
         businesses and individuals can show case their products,interact with customers and conduct
         transactions without the need for a physical presences. E-commence website have gained 
         immense popularity due to their convenient accessiblity, and the global reach they offer.
        </p>
        <p>
            E-commerce websites typically display products or service along with detailed description, images,
            prices, and any available variations (e,g, sizes, colors). Each product usually has its own
            dedicated page with relevant information.
        </p>
     </div>
    </div>
  )
}

export default DescriptionBox