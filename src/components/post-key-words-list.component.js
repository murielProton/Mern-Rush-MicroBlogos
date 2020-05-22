import React, { Component } from 'react';
import axios from 'axios';

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
                if(response.data.status ==="KO"){
                    console.log("errer on vide");
                    this.setState({ key_words: [] });
                }else {
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
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Mot Clef</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.key_words.map((item) =>
                            <tr key={item}>
                                <td>{item}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}