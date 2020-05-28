
import React, { Component } from 'react';
import axios from 'axios';
import { DisplayKeyword, LinkModifyPost, Link_DELETE_Post } from '../Functions.src.js';


export default class PostsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            errors: [],

        };
        this.delete = this.delete.bind(this)
    }
    componentDidMount() {
        // Fournit par path="/my-blog/:id"
        let login = this.props.match.params.id
        let url = 'http://localhost:4242/post/my-blog/' + login;
        axios.get(url)
            .then(response => {
                console.log(response.data);
                this.setState({ posts: response.data });
                console.log(response.data);
            }).catch(errors => {
                //J'attrape les erreurs
            });
    }
    delete(e) {
        let idPost= e.target.id;
        let urlDELETE = 'http://localhost:4242/post/post/DELETE/' + idPost;
        axios.get(urlDELETE)
            .then(console.log('Deleted'))
            .catch(err => console.log(err));
        this.componentDidMount();
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
                            <tr >
                                <td> {item.content}</td>
                                <td> {item.date}</td>
                                <td>
                                    {item.key_words.map(keyword =>
                                        <DisplayKeyword keyword={keyword} />)}
                                </td>
                                <td>
                                    <LinkModifyPost id={item._id} />
                                </td>
                                <td>
                                    <button onClick={this.delete} className="btn bg-light" id={item._id} >DELETE</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}
