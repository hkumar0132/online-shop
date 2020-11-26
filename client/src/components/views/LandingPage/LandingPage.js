import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Icon, Card, Row, Col, Button } from 'antd';
import ImageSlider from '../../Utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import { continents, price } from '../LandingPage/Sections/Datas';
import SearchFeature from './Sections/SearchFeature';

const { Meta } = Card;

function LandingPage() {

    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0);
    const [Limit, setLimit] = useState(8);
    const [PostSize, setPostSize] = useState();
    const [SearchTerms, setSearchTerms] = useState('');
    const [Filters, setFilters] = useState({
       continents: [],
       price: [] 
    });

    const getProducts = (variables) => {

        Axios.post('/api/product/getProducts', variables)
        .then(response => {
            if (response.data.success) {
                if (variables.loadMore) {
                    setProducts([...Products, ...response.data.products])
                } 
                else {
                    setProducts(response.data.products)
                }
                setPostSize(response.data.postSize)
            } 
            else {
                alert('Failed to fectch product datas')
            }
        })
    }

    useEffect(() => {
        const variables = {
            skip: Skip,
            limit: Limit
        }

        getProducts(variables);

    }, []);

    const onLoadMore = () => {
        let skip = Skip + Limit;
        setSkip(skip);
        
        const variables = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }

        getProducts(variables);
    }

    const renderCards = Products.map((product, index) => {
        return <Col lg={6} md={8} xs={24}>
            <Card
                hoverable={true}
                key={product._id}
                cover={<a href={`/product/${product._id}`} > <ImageSlider images={product.images} /></a>}
            >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })

    const showFilteredResults = (filters) => {

        const variables = {
            skip: 0,
            limit: Limit,
            filters: filters
        }

        getProducts(variables);
        setSkip(0);
    }

    const handlePrice = (value) => {
        const data = price;
        let array = [];

        for(let key in data) {

            if(data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }

        return array;
    }

    const handleFilters = (filters, category) => {
        console.log(filters);
        const newFilters = { ...Filters }
        newFilters[category] = filters;

        if(category === 'price') {
            let priceValues = handlePrice(filters);
            newFilters[category] = priceValues;
        }

        showFilteredResults(newFilters);
        setFilters(newFilters);
    }

    const updateSearchTerms = (newSearchTerm) => {

        const variables = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerms(newSearchTerm)

        getProducts(variables)
    }

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>  Let's Travel Anywhere  <Icon type="rocket" />  </h2>
            </div>

            {/* Filter */}

            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                    <CheckBox 
                        continents={continents}
                        handleFilters={filters => handleFilters(filters, "continents")}
                    />
                </Col>
                <Col lg={12} xs={24}>
                    <RadioBox 
                        price={price}
                        handleFilters={filters => handleFilters(filters, "price")}
                    />
                </Col>
            </Row>

            {/* Search */}

            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>
                <SearchFeature refreshFunction={updateSearchTerms}
                />
            </div>

            {Products.length === 0 ?
                <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>Nothing yet...</h2>
                </div> :
                <div>
                    <Row gutter={[16, 16]}>
                        {renderCards}
                    </Row>
                </div>
            }
            <br /><br />

            {PostSize === Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={onLoadMore}>Load More</Button>
                </div>
            }
        </div>
    )
}

export default LandingPage;
