
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class PostList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            errors: []
        };
    }
    componentDidMount() {
        axios.get('http://localhost:4242/post/list')
            .then(response => {
                this.setState({ posts: response.data });
                console.log(response.data);
            }).catch(errors => {
                console.log(errors);
            });
    }
    postList() {
        return this.state.posts.map(function (currentPost, i) {
            console.log(currentPost)
            return <PostList post={currentPost} key={i} />;
        })
    }
    render() {
        return (
            <div>
                <h3>Les glatits des Aigles</h3>
                {this.state.errors.map((item) =>
                    <h4>{item}</h4>
                )}
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Author</th>
                            <th>Date</th>
                            <th>Content</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.posts.map((item) =>
                            <tr key={item.__ID}>
                                <td>{item.author}</td>
                                <td> {item.date}</td>
                                <td> {item.content}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}