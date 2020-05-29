
import React, { Component } from 'react';
import axios from 'axios';

export default class PostsListReceived extends Component {
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
        this.getMail();
    }
    getMail(){
        let url = 'http://localhost:4242/post/received-list/'+this.props.match.params.id;
        axios.get(url)
            .then(response => {
                if(response.data.status =="KO"){
                    this.setState({ posts: [] });
                } else {
                    this.setState({ posts: response.data });
                }
                console.log(response.data);
            }).catch(errors => {
                //J'attrape les erreurs
            });
    }
    tick() {
        this.getMail();
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    render() {
        return (
            <div>
                <h3>Your Personal Mail Box, {this.props.match.params.id}</h3>
                {this.state.errors.map((item) =>
                    <h4>{item}</h4>
                )}
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Content</th>
                            <th>Date</th>
                            <th>Author</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.posts.map((item) =>
                            <tr>
                                <td> {item.content}</td>
                                <td> {item.date}</td>
                                <td> {item.author}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}