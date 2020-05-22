import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from "react-router-dom";
//import { Redirect } from "react-router";


export default class CreatePost extends Component {

    constructor(props) {
        super(props);
        this.onChangePostKeyWord = this.onChangePostKeyWord.bind(this);
        this.onChangePostContent = this.onChangePostContent.bind(this);
        this.onChangePostAuthor = this.onChangePostAuthor.bind(this);
        this.onChangePostDate = this.onChangePostDate.bind(this);
        this.onChangePostRecipient = this.onChangePostRecipient.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            post_key_words: '',
            post_content: '',
            post_author: '',
            post_date: '',
            post_recipients: '',
            errors: [],
            redirect: false,
        }
    }
    onChangePostKeyWord(e) {
        this.setState({
            post_key_words: e.target.value
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
    onChangePostDate(e) {
        this.setState({
            post_date: e.target.value
        });
    }
    onChangePostRecipient(e) {
        this.setState({
            post_recipients: e.target.value
        });
    }
    onSubmit(e, findWordsStartingWithArobass) {
        e.preventDefault();
        console.log("Form submitted:");
        let author = localStorage.getItem('login');
        let recipient = this.state.post_recipient;
        let date = new Date();
        console.log(`Post Content: ${this.state.post_content}`);
        var postToCreate = {
            key_words: "#" + this.state.post_key_word,
            content: this.state.post_content,
            author: "@" + author,
            date: date.toLocaleString(),
            recipients: "@" + recipient
        };
        console.log("Error Post Create Component search 8");
        console.log(postToCreate);
        axios.post('http://127.0.0.1:4242/post/create', postToCreate)
            .then(res => {
                if (res.data.post === 'post added successfully') {
                    console.log("Error Post Create Component search 9");
                    //console.log(author);
                    this.setState({
                        post_key_words: '',
                        post_content: '',
                        post_author: '',
                        post_date: '',
                        post_recipients: '',
                        redirect: true
                    });

                } else {
                    console.log("Error Post Create Component search 10");
                    this.setState({
                        errors: res.data.errors
                    });
                    console.log(res.data.errors);
                }
            }).catch(errors => {
                console.log(errors);
                //c'est comme cela que j'attrappe mes erreurs

            });
    }
    render() {
        if (this.state.redirect) {
            return <Redirect to="/post/list" />
        }
        return (
            <div style={{ marginTop: 10 }}>
                <h3>Glatir</h3>
                {this.state.errors.map((item) =>
                    <h4>{item}</h4>
                )}
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Content: </label>
                        <textarea type="text"
                            className="form-control"
                            value={this.state.post_content}
                            onChange={this.onChangePostContent}
                        ></textarea>
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

