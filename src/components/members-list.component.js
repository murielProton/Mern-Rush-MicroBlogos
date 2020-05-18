/* Route /member/list*/
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class MemberList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            errors: []
        };
    }
    componentDidMount() {
        axios.get('http://localhost:4242/member/list')
            .then(response => {
                this.setState({members:response.data});
                console.log(response.data);
            
        })
        .catch(function(errors){
            console.log(errors);
        })
    }

    memberList() {
        
        return this.state.members.map(function (currentMember, i) {
            return <MemberList member={currentMember} key={i} />;
        })
    }
    render() {
        return (
            <div>
                <h3>Members List</h3>
                {this.state.errors.map((item) =>
                    <h4>{item}</h4>
                )}
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>login</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.members.map((item, index) =>
                            <tr key={item.login.toString()}>
                                <td> {item.login}</td>
                                <td> {item.email}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}