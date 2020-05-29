
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
        this.intervalID = setInterval(
            () => this.tick(),
            1000
        );
        this.getTweets();
    }
    getTweets(){
        axios.get('http://localhost:4242/post/list')
            .then(response => {
                this.setState({ posts: response.data });
                console.log(response.data);
            }).catch(errors => {
                console.log(errors);
            });
    }
    tick() {
        this.getTweets();
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    render() {
        return (
            <div>
                <h3>List of All the Posts :</h3>
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