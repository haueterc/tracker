import React, { Component } from 'react';
import axios from 'axios';
import SearchIcon from 'react-icons/lib/md/search';
import './SearchInput.css';

class Search extends Component {
    constructor() {
        super();

        this.state={
            handle: '',
            platforms: []
        }
        
        this.updateHandle = this.updateHandle.bind(this);
        this.queryHandlesTable = this.queryHandlesTable.bind(this);
    }

    updateHandle( handle ) {
        this.setState({ handle })
    }
    
    queryHandlesTable( key ) {
        function getHandle( handle ) {
            axios.get(`http://localhost:3005/api/search/${ handle }`)
            .then( results => {
                this.setState({ platforms: results.data });
                console.log(this.state.platforms)
            })
        }
        if (key === 'Enter') {
            getHandle(this.state.handle);
        }
    }

    render() {
        const { handle } = this.state;

        return (
            <section className="Search__parent">
                <section className="Search__content">
                    <input
                        autoFocus="false"
                        type="text"
                        placeholder="@handle"
                        value={ handle }
                        onChange={(e) => this.updateHandle(e.target.value)}
                        onKeyUp={(e) => this.queryHandlesTable(e.key)} />
                        <SearchIcon id="Search__icon" />
                </section>
                    <a href={process.env.REACT_APP_LOGIN}>
                        <button>Sign in</button>
                    </a>
            </section>
        )
    }
}

export default SearchInput;