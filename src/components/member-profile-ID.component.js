import React, { Component } from "react";
import axios from 'axios';
// attention si redirect importation est imperative
export default class UpdateMember extends Component {

    constructor(props) {
        super(props);
        this.state = {
            member_id: '',
            member_login: '',
            member_email: '',
            member_password: '',
            member_new_password: '',
            member_new_password_confirmation: '',
            member_admin: false,
            redirect: false,
            errors: []
        }
    }
    componentDidMount() {
        let login = this.props.match.params.id;
        this.setState({
            member_login: login
        });
        // get member => info via GET méthode
        let url = 'http://127.0.0.1:4242/member/update/' + login;
        axios.get(url)
            .then(response => {
                console.log("process get");
                console.log(response.data.member);
                let member = response.data.member;
                console.log(member);
                console.log(member.email);
                this.setState({
                    member_id: member._id,
                    member_login: member.login,
                    member_email: member.email,
                    member_password: response.data.password,
                    member_admin: member.admin,
                    redirect: false
                });
            }).catch(errors => {
                //c'est comme cela que j'attrappe mes erreurs
                console.log(this.state.login);
            });
    }

    render() {
        if (this.state.member_admin) {
            var areYouAdmin = "true";
        } else {
            areYouAdmin = "false";
        }
        return (
            <div style={{ marginTop: 10 }}>
                <h3>This is your current profile,  {this.props.match.params.id}</h3>
                {this.state.errors.map((item) =>
                    <h4>{item}</h4>
                )}
                <div>
                    Your Login : {this.state.member_login}
                </div>
                <div>
                    Your Email: {this.state.member_email}
                </div>
                <div>
                    Admin : {areYouAdmin}
                </div>
            </div >
        )
    }
}