
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class PostsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            errors: []
        };

    }
    componentDidMount() {
        axios.post('http://localhost:4242/post/list/:id')
            .then(response => {
                this.setState({ members: response.data });
                console.log(response.data);
            }).catch(errors => {
                //J'attrape les erreurs
            });
    }
    postList() {
        return this.state.posts.map(function (currentMember, i) {
            return <PostsList member={currentMember} key={i} />;
        })
    }
    render() {
        return (
            <div>
                <h3>My Blog</h3>
                {this.state.errors.map((item) =>
                    <h4>{item}</h4>
                )}
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Content</th>
                            <th>Author</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.posts.map((item) =>
                            <tr>
                                <td> {item.title}</td>
                                <td> {item.content}</td>
                                <td> {item.author}</td>
                                <td> {item.date}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}