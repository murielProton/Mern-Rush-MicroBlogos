import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";

export default class PostUpdate extends Component {
    constructor(props) {
        super(props);
        this.onChangePostKeyWord = this.onChangePostKeyWord.bind(this);
        this.onChangePostContent = this.onChangePostContent.bind(this);
        this.onChangePostAuthor = this.onChangePostAuthor.bind(this);
        this.onChangePostDate = this.onChangePostDate.bind(this);
        this.onChangePostRecipient = this.onChangePostRecipient.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            id: '',
            post_key_words: '',
            post_content: '',
            post_author: '',
            post_date: '',
            post_recipients: '',
            errors: [],
            redirect: false,
        }
    }
    componentDidMount() {
        let id = this.props.match.params.id;
        this.setState({
            id: id,
            redirect: false
        });
        // TODO get post => info via GET méthode
        let url = 'http://127.0.0.1:4242/post/update/' + id;
        axios.get(url)
        .then(response => {
            let post = response.data.post;
            console.log("post response data " +response.data);
            this.setState({
                post__id: post._id,
                post_key_words: post.post_key_words,
                post_content: post.content,
                post_author: post.author,
                post_date: post.date,
                post_recipients: post.recipient,
            });

        }).catch(errors => {
            //c'est comme cela que j'attrappe mes erreurs
            console.log(this.state.login);
        });
           
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
        var postToUpdate = {
            key_words: "#" + this.state.post_key_word,
            content: this.state.post_content,
            author: "@" + author,
            date: date.toLocaleString(),
            recipients: "@" + recipient
        };
        let id = this.state.id;
        let url = 'http://127.0.0.1:4242/post/update/' + id;
        axios.post(url, postToUpdate)
            .then(res => {
                if (res.data.post === 'post updated successfully') {
                    //console.log(author);
                    this.setState({
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
        if (this.state.redirect == true) {
            var redirectLogin = localStorage.getItem('login');
            return <Redirect to={`/my-blog/${redirectLogin}`} />;
        }
        return (
            <div style={{ marginTop: 10 }}>
                <h3>update your post</h3>
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
                        <input type="submit" value="Update" className="btn btn-light" />
                    </div>
                </form>
            </div>
        )
    }  
}