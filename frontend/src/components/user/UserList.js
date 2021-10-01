import React from "react";
import {Container, DialogContentText, DialogTitle, IconButton, TextField,} from "@material-ui/core";
import UserListItem from "./UserListItem";
import {yellow} from "@material-ui/core/colors";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import "./UserList.css";
import AlertDialogSlide from "../dialog/ConfirmationDialog";
import ListHeader from "../utils/ListHeader";
import {ShowDialog} from "../utils/Dialogs";
import {delete_users, get_users} from "../utils/apis";

export default class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            filteredUsers: [],
            dialog: "",
            selectedUser: null,
        };
    }

    componentDidMount = () => {
        this.fetchData();
    };

    fetchData = () => {
        get_users((data) => {
            this.setState({users: data, filteredUsers: data});
        })
    };

    onChange = (event) => {
        this.setState({
            filteredUsers: this.state.users.filter((p) =>
                p.name.startsWith(event.target.value)
            ),
        });
    };

    deleteUser = () => {
        const {selectedUser} = this.state;
        delete_users(selectedUser, (res) => {
            this.fetchData();
        })
    };
    onClose = (status) => {
        this.setState({
            dialog: "",
            selectedUser: null,
        });

            this.fetchData();

    };

    showDialog = () => {
        const {selectedUser, dialog} = this.state;
        if (dialog === "DELETE_USER") {
            return (
                <AlertDialogSlide
                    data={selectedUser}
                    openDialog={true}
                    headerComponent={
                        <DialogTitle id="alert-dialog-slide-title">
                            {"حذف کاربر"}
                        </DialogTitle>
                    }
                    bodyComponent={
                        <DialogContentText id="alert-dialog-slide-description">
                            آیا مطمغن هستین که میخواید کاربر {selectedUser.name} را حذف کنید؟
                        </DialogContentText>
                    }
                    onAccept={this.deleteUser}
                    onClose={this.onClose}
                />
            );
        } else
            return ShowDialog({user: selectedUser, dialog: dialog}, this.onClose);
    };

    dialogHandler = (dialog, user) => {
        this.setState({dialog: dialog, selectedUser: user});
    };

    render() {
        const {filteredUsers} = this.state;
        const userItems = filteredUsers.map((user) => {
            return (
                <UserListItem
                    key={user.id}
                    user={user}
                    dialogHandler={this.dialogHandler}
                />
            );
        });
        return (
            <Container>
                <ListHeader
                    titleArea={"کاربران"}
                    searchArea={
                        <TextField
                            fullWidth
                            inputProps={{min: 0, style: {textAlign: "center"}}}
                            id="standard-basic"
                            variant="standard"
                            placeholder="جستجو"
                            onChange={(event) => this.onChange(event)}
                        />
                    }
                    buttonAria={
                        <IconButton onClick={() => this.dialogHandler("USER_FORM", null)}>
                            <PersonAddIcon style={{color: yellow[500], fontSize: 40}}/>
                        </IconButton>
                    }
                />

                {userItems}
                {this.showDialog()}
            </Container>
        );
    }
}
