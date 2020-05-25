
import React, { Component } from 'react';
import axios from 'axios';
import {DisplayKeyword} from '../Functions.src.js';


export default class PostsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            errors: []
        };

    }
    componentDidMount() {
        // Fournit par path="/my-blog/:id"
        console.log(this.props.match.params.id);
        let login = this.props.match.params.id
        let url = 'http://localhost:4242/member/update/' + login;
        console.log(login);
        axios.get(url)
            .then(response => {
                console.log(response.data);
                this.setState({ posts: response.data });
                console.log(response.data);
            }).catch(errors => {
                //J'attrape les erreurs
            });
    }
    render() {
        return (
            <div>
                <h3>Mon Blog par {this.props.match.params.id}</h3>
                {this.state.errors.map((item) =>
                    <h4>{item}</h4>
                )}
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Content</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.posts.map((item) =>
                            <tr>
                                <td> {item.content}</td>
                                <td> {item.date}</td>
                                <td>
                                {item.key_words.map(keyword =>
                                    <DisplayKeyword keyword={keyword} />)}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}
