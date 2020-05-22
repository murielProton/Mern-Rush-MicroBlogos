
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
        let url = 'http://localhost:4242/post/my-received-list/'+this.props.match.params.id;
        axios.get(url)
            .then(response => {
                console.log(response.data);
                this.setState({ posts: response.data });
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
                <h3>Ma boite de Reception{this.props.match.params.id}</h3>
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