import {AppBar, Button, Container, Dialog, IconButton, Slide, TextField, Toolbar, Typography,} from "@material-ui/core";
import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import "./UserForm.css";
import {save_user} from '../utils/apis'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class UserForm extends React.Component {
    constructor(props) {
        super(props);
        this.onClose = props.onClose;
        this.state = {
            open: props.openDialog,
            user: props.user != null ? props.user : {id: null, name: ""},
        };
    }

    persistUser = () => {
        const {user} = this.state;
        save_user(user, () => this.handleClose())
    };

    handleClose = (status = "NO_ACTION") => {
        this.setState({open: false});
        this.onClose(status);
    };

    onChange = (event) => {
        this.setState((state) => ({
            user: {
                ...state.user,
                name: event.target.value,
            },
        }));
    };

    render() {
        const {open, user} = this.state;
        const title = user.id == null ? " تعریف کاربر جدید" : " ویرایش کاربر";
        return (
            <Dialog
                // fullScreen
                open={open}
                TransitionComponent={Transition}
                onClose={this.handleClose}
            >
                <AppBar className="appBar">
                    <Toolbar>
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={this.handleClose}
                            aria-label="close"
                        >
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h6" className={"title"} component="div">
                            {title}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Container style={{padding: "20px"}}>
                    <TextField
                        fullWidth
                        inputProps={{min: 0, style: {textAlign: "center"}}}
                        id="standard-basic"
                        variant="standard"
                        placeholder="نام کاربر"
                        value={user.name}
                        onChange={(event) => this.onChange(event)}
                    />
                    <Button
                        fullWidth
                        autoFocus
                        className="saveButton"
                        onClick={this.persistUser}
                        style={{marginTop: "30px"}}
                    >
                        ذخــیره
                    </Button>
                </Container>
            </Dialog>
        );
    }
}
