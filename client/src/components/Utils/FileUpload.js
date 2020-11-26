import { Icon } from 'antd';
import Axios from 'axios';
import React, { useState } from 'react';
import Dropzone from 'react-dropzone';

function FileUpload(props) {

    const [Images, setImages] = useState([]);
    
    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/formdata'}
        }

        formData.append("file", files[0]);
        Axios.post('/api/product/uploadImage', formData, config)
            .then(response => {
                if(response.data.success) {
                    setImages([...Images, response.data.image]);
                    props.refreshFunction([...Images, response.data.image]);
                }
                else {
                    alert('Failed to add to the server')
                }
            })
    }

    const onDelete = (image) => {
        const currentIndex = Images.indexOf(image);
        
        let newImages = [...Images];
        newImages.splice(currentIndex, 1);

        setImages(newImages);
        props.refreshFunction(newImages);
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}> 
            <Dropzone
                onDrop={onDrop}
                multiple={false}
                maxSize={100000000}
            >
                {({getRootProps, getInputProps}) => (
                    <div style={{ 
                            width: '300px', height: '240px', border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        {...getRootProps()}
                    > 
                        <input {...getInputProps()} />
                        <Icon type="plus" style={{ fontSize: '3rem' }}></Icon>
                    </div>    
                )}
            </Dropzone>

            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll'}}>
                {Images.map((image, index) => (
                    <div onClick={() => onDelete(image)}>
                        <img style={{ minWidth: '300px', width: '300px', height: '240px' }} src={`http://localhost:5000/${image}`} alt={`productImg-${index}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FileUpload;