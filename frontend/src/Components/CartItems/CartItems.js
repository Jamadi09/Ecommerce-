import React, { useContext, useState } from 'react'
import './CartItems.css'
import remove_icon from '../Assets/cart_cross_icon.png'
import { ShopContext } from '../../Context/ShopContext'
import { usePaystackPayment } from 'react-paystack';
const CartItems = () => {
  const product = useContext(ShopContext)
  const [quantity, setQuantity] = useState(1);




  // const increment = () => {
  //   {
  //     all_product.map((e) => {
  //       if (product[e.all_product])
  //         setQuantity(quantity + 1);

  //     })
  //   }
  // }

  // const decrement = () => {
  //   {
  //     all_product.map((e) => {
  //       if (product[e.all_product] <= 1) {
  //         setQuantity(1);

  //       }
  //       if (product[e.all_product] > 1) {
  //         setQuantity(quantity - 1);

  //       }
  //     })
  //   }
  // }
  const { getTotalCartAmount, all_product, cartItems, removeFromCart,decrement, increment } = useContext(ShopContext)

  const handleSuccess = (reference) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference);
  };

  // you can call this function anything
  const handleClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
  alert('closed transaction')
  }


    
  const config = {
    reference: (new Date()).getTime().toString(),
    email: "user@example.com",
    amount: getTotalCartAmount() * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: 'pk_test_7d5f9ac66b24bc1c76e59d050ea3697f032726a8',
  };

  const initializePayment = usePaystackPayment(config);


  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return <div>
            <div className='cartitems-format cartitems-format-main' >
              <img src={e.image} alt="" className='carticon-product-icon' />
              <p>{e.name}</p>
              <p>${e.new_price}</p>
              <div>
                <button onClick={() => increment(e.id)}>+</button>
                <button onClick={() => decrement(e.id)}>-</button>
              </div>
              <p>${e.new_price * cartItems[e.id]}</p>
              <img className='cartitems-remove-icon' src={remove_icon} onClick={() => { removeFromCart(e.id) }} alt="" />
            </div>
            <hr />
          </div>
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className='cartitems-total'>
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>
          <button  onClick={() => initializePayment(handleSuccess, handleClose)}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promocode, enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder='Promocode' />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItems