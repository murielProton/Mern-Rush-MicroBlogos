/* Route /member/list*/
import React, { Component } from 'react';
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
        this.intervalID = setInterval(
            () => this.tick(),
            1000
        );
    }
    getMembers() {
        axios.get('http://localhost:4242/member/list')
            .then(response => {
                this.setState({ members: response.data });
                console.log(response.data);
            }).catch(function (errors) {
                console.log(errors);
            })
    }
    tick() {
        this.getMembers();
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    render() {
        return (
            <div>
                <h3>Members's List</h3>
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