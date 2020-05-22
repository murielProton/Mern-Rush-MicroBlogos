
import React, { Component } from 'react';
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
        axios.get('http://localhost:4242/post/search-by-key-words')
            .then(response => {
                this.setState({ posts: response.data });
                console.log(response.data);
            }).catch(errors => {
                console.log(errors);
            });
    }
    postList() {
        return this.state.posts.map(function (currentKey_word, i) {
            console.log(currentKey_word)
            return <PostList post={currentKey_word} key={i} />;
        })
    }
    render() {
        return (
            <div>
                <h3>List of Posts with the same #key_words</h3>
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