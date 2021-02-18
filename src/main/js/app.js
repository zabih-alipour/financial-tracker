'use strict';

// tag::vars[]
const React = require('react'); // <1>
const ReactDOM = require('react-dom'); // <2>
// end::vars[]

// tag::app[]
class App extends React.Component { // <1>

    constructor(props) {
        super(props);
        this.state = {users: []};
    }

    componentDidMount() { // <2>
        fetch('/api/users')
            .then(res => res.json())
            .then(data => {
                this.setState({users: data});
            })
    }

    render() { // <3>
        return (
            <UserList users={this.state.users}/>
        )
    }
}

// end::app[]

// tag::employee-list[]
class UserList extends React.Component {
    render() {
        const users = this.props.users.map(user =>
            <Employee key={user.id} user={user}/>
        );
        return (
            <table>
                <tbody>
                <tr>
                    <th>First Name</th>
                </tr>
                {users}
                </tbody>
            </table>
        )
    }
}

// end::employee-list[]

// tag::employee[]
class Employee extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.user.name}</td>
            </tr>
        )
    }
}

// end::employee[]

// tag::render[]
ReactDOM.render(
    <App/>,
    document.getElementById('react')
)
// end::render[]