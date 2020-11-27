import React, { useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';

function ProductImage(props) {

    const [Images, setImages] = useState([])

    useEffect(() => {
        if(props.detail.images && props.detail.images.length > 0) {
            let images = []

            props.detail.images.map(image => {
                images.push({
                    original: `https://stark-reaches-48410.herokuapp.com/${image}`,
                    thumbnail: `https://stark-reaches-48410.herokuapp.com/${image}`
                })
            })

            setImages(images)
        }
    }, [props.detail])

    return (
        <div>
            <ImageGallery items={Images} />
        </div>
    );
}

export default ProductImage;