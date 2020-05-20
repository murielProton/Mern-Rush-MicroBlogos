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
            post_key_word: '',
            post_content: '',
            post_author: '',
            post_date: '',
            post_recipient: '',
            errors: [],
            redirect: false,

        }
        console.log("Error Post Create Component search 2");
    }

    onChangePostKeyWord(e) {
        this.setState({
            post_key_word: e.target.value
        });
        console.log("Error Post Create Component search 3");
    }
    onChangePostContent(e) {
        this.setState({
            post_content: e.target.value

        });
        console.log("Error Post Create Component search 3");
    }
    onChangePostAuthor(e) {
        this.setState({
            post_author: e.target.value
        });
        console.log("Error Post Create Component search 4");
    }
    onChangePostDate(e) {
        this.setState({
            post_date: e.target.value
        });
        console.log("Error Post Create Component search 5");
    }
    onChangePostRecipient(e) {
        this.setState({
            post_recipient: e.target.value
        });
        console.log("Error Post Create Component search 6");
    }
    onSubmit(e) {
        e.preventDefault();
        console.log("Error Post Create Component search 7");
        console.log("Form submitted:");
        let author = localStorage.getItem('login');
        let recipient = this.state.post_recipient;
        let date = new Date();
        console.log("date : "+date.toLocaleString());
        console.log(`Post Content: ${this.state.post_content}`);

        var postToCreate = {
            key_word: "#" + this.state.post_key_word,
            content: this.state.post_content,
            author: "@" + author,
            date: date.toLocaleString(),
            recipient: "@" + recipient
        };

        console.log("Error Post Create Component search 8");
        console.log(postToCreate);
        axios.post('http://127.0.0.1:4242/post/create', postToCreate)
            .then(res => {
                if (res.data.post === 'post added successfully') {
                    console.log("Error Post Create Component search 9");
                    //console.log(author);
                    this.setState({
                        post_key_word: '',
                        post_content: '',
                        post_author: '',
                        post_date: '',
                        post_recipient:'',
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
    //const isLoggedIn = props.isLoggedIn;
    //let urlMyBlog = "/my-blog/" + isLoggedIn;
    render() {
        if (this.state.redirect) {
            console.log("Error Post Create Component search 11");
            //TODO remplacer ID par Login ex clotilde
            return <Redirect to = "/my-blog/ID"/>
            //return <Redirect to={urlMyBlog} />;
        }
        console.log("Error Post Create Component search 12");
        return (
            <div style={{ marginTop: 10 }}>
                <h3>Create a Post</h3>
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