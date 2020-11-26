import { Empty, Result } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
    getCartItems, 
    removeCartItem,
    onSuccessBuy
 } from '../../../_actions/user_actions';
import Paypal from '../../Utils/Paypal';
import UserCardBlock from './Sections/UserCardBlock';

function CartPage(props) {

    const dispatch = useDispatch()
    const [Total, setTotal] = useState(0)
    const [ShowSuccess, setShowSuccess] = useState(false)
    const [ShowFailure, setShowFailure] = useState(false)
    const [ShowError, setShowError] = useState(false)
    const [ShowTotal, setShowTotal] = useState(false)

    useEffect(() => {
        let cartItems = [];
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                })

                dispatch(getCartItems(cartItems, props.user.userData.cart))
            }
        }

    }, [props.user.userData])

    useEffect(() => {

        if(props.user.cartDetail) {
            if(props.user.cartDetail.length > 0) {
                calculateTotal(props.user.cartDetail)
            }
            else if(props.user.cartDetail.length === 0) {
                setShowTotal(false)
            }
        }

    }, [props.user.cartDetail])

    const calculateTotal = (cartDetail) => {
        let total = 0
        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity
        })

        setTotal(total)
        setShowTotal(true)
    }

    const removeFromCart = (productId) => {
        dispatch(removeCartItem(productId))
    }

    const transactionSuccess = (paymentData) => {
        dispatch(onSuccessBuy({
            cartDetail: props.user.cartDetail,
            paymentData: paymentData
        }))
            .then(response => {
                if (response.payload.success) {
                    setShowSuccess(true)
                    setShowTotal(false)
                }
            })
    }

    const transactionError = () => {
        setShowError(true)
    }

    const transactionCancelled = () => {
        setShowFailure(true)
    }

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h1>My Cart</h1>

            {!ShowSuccess && ShowError &&
                <Result
                    status="warning"
                    title="Error occured, try again!"
                />
            }
            
            {!ShowSuccess && ShowFailure &&
                <Result
                    status="error"
                    title="Purchase failed, try again!"
                />
            }

            <div>
                <UserCardBlock 
                    products={props.user.cartDetail}
                    removeItem={removeFromCart}
                />

                {ShowTotal?
                    <div style={{ marginTop: '3rem' }}>
                        <h2>Total amount: $ {Total}</h2>
                    </div>
                    :
                    ShowSuccess?
                        <Result 
                            status="success"
                            title="Successfully Purchased"
                        />
                            :
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                            <br />
                            <Empty description={false}>
                                <h2>No items in cart</h2>
                            </Empty>
                        </div>
                }

                {ShowTotal && 
                    <Paypal 
                        topPay={Total}
                        onSuccess={transactionSuccess}
                        transactionError={transactionError}
                        transactionCancelled={transactionCancelled}
                    /> 
                }

            </div>
        </div>
    )
};

export default CartPage;
