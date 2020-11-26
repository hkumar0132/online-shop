import React, { useState } from 'react';
import { Input } from 'antd';

const { Search } = Input;

function SearchFeature(props) {

    const [SearchTerms, setSearchTerms] = useState('');

    const onChangeSearch = (event) => {
        setSearchTerms(event.target.value)
        props.refreshFunction(event.target.value)
    }

    return (
        <div>
            <Search
                value={SearchTerms}
                onChange={onChangeSearch}
                placeholder="Search By Typing..."
            />
        </div> 
    );
}

export default SearchFeature;