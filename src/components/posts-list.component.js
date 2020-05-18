/* Route /member/list*/
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/*const Member = props =>(
    <tr>
        <td>{props.members.member__id}</td>
        <td>{props.members.member_login}</td>
        <td>{props.members.member_email}</td>
        <td>{props.members.member_password}</td>
        <td>{props.members.member_admin}</td>
        <td>
            <Link to={"/edit/"+props.member._id}>Edit</Link>
        </td>
    </tr>
);*/

export default class PostList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            /*errors: []*/
        };

    }
    componentDidMount() {
        axios.get('http://localhost:4242/post/list/:id')
            .then(response => {
                /*if (this.memberList().length > 0) {*/
                    this.setState({ members: response.data });
                    console.log(response.data);
                /*} else {
                    this.setState({
                        errors: response.data.errors
                    });
                    console.log(response.data.errors);
                }*/
            }).catch(errors => {
                //J'attrape les erreurs
            });
    }
    memberList() {
        return this.state.members.map(function (currentMember, i) {
            return <MemberList member={currentMember} key={i} />;
        })
    }
    render() {
        <div>
        return (
            <div>
                <h3>Posts List</h3>
                <h4>Ici devraient s'afficher mes erreurs, mais j'ai un pb de catch et apparemment de child component tree?? what is it ?</h4>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Content</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.members.map((item) =>
                            <tr>
                                <td> {item.login}</td>
                                <td> {item.email}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )</div>
    }
}