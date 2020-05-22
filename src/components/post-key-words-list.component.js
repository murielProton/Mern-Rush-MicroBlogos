import React, { Component } from 'react';
import axios from 'axios';
import {DisplayKeyword} from '../Functions.src.js';

export default class KeyWordsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key_words: [],
            errors: []
        };
    }
    componentDidMount() {
        axios.get('http://localhost:4242/post/key-words-list')
            .then(response => {
                if (response.data.status === "KO") {
                    this.setState({ key_words: [] });
                } else {
                    this.setState({ key_words: response.data.keywords });
                }
            }).catch(errors => {
                console.log(errors);
            });
    }
    render() {
        return (
            <div>
                <h3>List des Mots Clefs</h3>
                {this.state.errors.map((item) =>
                    <h4>{item}</h4>
                )}
                <div className="table table-striped" style={{ marginTop: 20 }} >
                    {this.state.key_words.map((item) =>
                            <DisplayKeyword keyword={item}/>
                    )}
                </div>
            </div>
        )
    }
}