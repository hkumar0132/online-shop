import { Button, Descriptions, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';

function ProductInfo(props) {

    const [Product, setProduct] = useState({});
    const [Quantity, setQuantity] = useState(1);
    const [ShowError, setShowError] = useState(false);

    useEffect(() => {
        setProduct(props.detail)
    }, [props.detail])

    const addToCartHandler = () => {
        props.addToCart(props.detail._id, Quantity)
    }

    function increase() {
        let value = Quantity+1
        if(value <= 10) {
            setShowError(false)
            setQuantity(value)
        }
        else {
            setShowError(true)
        }
    }

    function decrease() {
        let value = Quantity-1
        if(value >= 1) {
            setShowError(false)
            setQuantity(value)
        }
        else {
            setShowError(true)
        }
    }

    return (
        <div>
            <Descriptions title="Product Info">
                <Descriptions.Item label="Price"> {props.detail.price}</Descriptions.Item>
                <Descriptions.Item label="Sold">{props.detail.sold}</Descriptions.Item>
                <Descriptions.Item label="View"> {props.detail.views}</Descriptions.Item>
                <Descriptions.Item label="Description"> {props.detail.description}</Descriptions.Item>
            </Descriptions>

            <br />
            <br />
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button size="large" shape="round" type="danger"
                    style={{ marginRight: '1rem' }}
                    onClick={addToCartHandler}
                >
                    Add to Cart
                </Button>

                <div style={{ padding: '5px auto' }}>
                    <div onClick={increase} 
                        style={{ padding: '8px', display: 'inline-block', opacity: '0.9' }}>
                        <i class="fa fa-plus" style={{fontSize: '30px' }}/>
                    </div>
                    <div style={{ padding: '8px', display: 'inline-block' }}>
                        <h2>{Quantity}</h2>
                    </div>
                    <div onClick={decrease} 
                        style={{ padding: '8px', display: 'inline-block', opacity: '0.9' }}>
                        <i class="fa fa-minus" style={{fontSize: '30px' }}/>
                    </div>
                </div>
            </div>
                            
            {ShowError &&
                <h4 style={{color: 'red', marginLeft: '12rem'}}>*Quantity must be between 1 and 10(inclusive)</h4>
            }

        </div>
    )
}

export default ProductInfo;

