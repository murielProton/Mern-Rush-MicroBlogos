import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from "react-router-dom";
//import { Redirect } from "react-router";


export default class CreatePost extends Component {

    constructor(props) {
        super(props);

        this.onChangePostTitle = this.onChangePostTitle.bind(this);
        this.onChangePostContent = this.onChangePostContent.bind(this);
        this.onChangePostContent = this.onChangePostAuthor.bind(this);
        this.onSubmit = this.onSubmit.bind(this);



        this.state = {
            post_title: '',
            post_content: '',
            post_author:'',
            errors: []
        }
    }

    onChangePostTitle(e) {
        this.setState({
            post_title: e.target.value
        });
    }
    onChangePostContent(e) {
        this.setState({
            post_content: e.target.value
        });
    }
    onChangePostAuthor(e) {
        this.setState({
            post_author: e.target.value
        });
    }
    onSubmit(e) {
        e.preventDefault();
        console.log("Form submitted:");
        let author= localStorage.getItem('login');
        console.log(`Post Title: ${this.state.post_title}`);
        console.log(`Post Content: ${this.state.post_content}`);
        console.log(`Post Author: ${this.state.post_author}`);
        var postToCreate = {
            title: this.state.post_title,
            content: this.post_content,
            author:author
        };
        axios.post('http://127.0.0.1:4242/post/create', postToCreate)
            .then(res => {
                if (res.data.member === 'post added successfully') {
                    
                    console.log(author);
                    
                    this.setState({
                        post_title: '',
                        post_content: '',
                        post_author: '',
                        redirect: true
                    });

                } else {
                    this.setState({
                        errors: res.data.errors
                    });
                    console.log(res.data.errors);
                }
            }).catch(errors => {
                //c'est comme cela que j'attrappe mes erreurs

            });
    }
    render() {
        if (this.state.redirect) {
            //TODO redirect to post details
            return <Redirect to='/post/:id' />;
        }
        return (
            <div style={{ marginTop: 10 }}>
                <h3>Create a Post</h3>
                
                    <h4>ici devraient s'afficher mes erreurs</h4>
                
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Title : </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.post_title}
                            onChange={this.onChangePostTitle}
                        />
                    </div>
                    <div className="form-group">
                        <label>Content: </label>
                        <textarea
                            type="text"
                            className="form-control"
                            value={this.state.post_content}
                            onChange={this.onChangePostContent}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Post" className="btn btn-light" />
                    </div>
                </form>
            </div>
        )
    }
}
// pour avoir un endroit où taper le content facilement et carré remplacer <input> par <textarea>