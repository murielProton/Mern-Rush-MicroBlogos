import React, { Component } from 'react';
import axios from 'axios';
//import DisplayKeyword from '../Functions.src.js';

function DisplayKeyword(props){
    const keyword = props.keyword;
  let urlkeyword = "/post/search-by-key-words/" + keyword;
  return    <button type="button" class="btn bg-light"><a href={urlkeyword} >#{keyword}</a></button>;
}

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
                console.log(response.data);
                if (response.data.status === "KO") {
                    console.log("errer on vide");
                    this.setState({ key_words: [] });
                } else {
                    console.log("on est bon");
                    this.setState({ key_words: response.data.keywords });
                }
                console.log(response.data);
            }).catch(errors => {
                console.log(errors);
            });
    }
    keyWordsList() {

        return this.state.key_words.map(function (curentKeyWord, i) {
            console.log(curentKeyWord)
            return <KeyWordsList post={curentKeyWord} key={i} />;
        })
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