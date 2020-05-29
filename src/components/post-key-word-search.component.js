
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
        let keyword = this.props.match.params.id
        let url = 'http://localhost:4242/post/search-by-key-words/' + keyword;
        axios.get(url)
            .then(response => {
                if(response.data.status ==="KO"){
                    this.setState({ posts: [] });
                }else {
                    this.setState({ posts: response.data });
                }
            }).catch(errors => {
                console.log(errors);
            });
    }
    render() {
        return (
            <div>
                <h3>List of Posts with the #key_word : {this.props.match.params.id}</h3>
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