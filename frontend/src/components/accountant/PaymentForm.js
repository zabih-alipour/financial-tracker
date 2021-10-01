import {
    AppBar,
    Button,
    Container,
    Dialog,
    IconButton,
    Slide,
    TextField,
    Toolbar,
    Typography,
} from "@material-ui/core";
import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import "./PaymentForm.css";
import PaymentTypeAutoComplete from "./PaymentTypeAutoComplete";
import UserAutoComplete from "../user/UserAutoComplete";
import SaveIcon from "@material-ui/icons/Save";
import {save_payment} from "../utils/apis";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class PaymentForm extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.payment)
        this.state = {
            open: props.openDialog,
            onClose: props.onClose,
            payment:
                props.payment != null
                    ? props.payment
                    : {
                        id: null,
                        paymentType: null,
                        user: null,
                        amount: 0,
                        shamsiDate: "",
                        description: "",
                    },
        };
        console.log('#########: ' + this.state.payment)
    }

    persistPayment = () => {
        const {payment} = this.state;
        save_payment(payment, (res) => {
            this.handleClose("SUCCESS");
        });
    };

    handleClose = (status = "NO_ACTION") => {
        this.setState({open: false});
        this.state.onClose(status);
    };

    onChange = (event) => {
        this.setState((state) => ({
            payment: {
                ...state.payment,
                [event.target.name]: event.target.value,
            },
        }));
    };

    render() {
        const {open, payment} = this.state;
        const title = payment.id == null ? " تعریف پرداخت جدید" : " ویرایش پرداخت";
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
                    <UserAutoComplete
                        user={payment.user}
                        onChange={this.onChange}
                        fieldName="user"
                    />

                    <PaymentTypeAutoComplete
                        type={payment.paymentType}
                        onChange={this.onChange}
                        fieldName="paymentType"
                    />

                    <TextField
                        fullWidth
                        inputProps={{min: 0, style: {textAlign: "center"}}}
                        id="tf_date"
                        variant="standard"
                        placeholder="تاریخ"
                        name="shamsiDate"
                        margin="dense"
                        value={payment.shamsiDate}
                        onChange={(event) => this.onChange(event)}
                    />

                    <TextField
                        fullWidth
                        inputProps={{min: 0, style: {textAlign: "center"}}}
                        id="tf_amount"
                        margin="dense"
                        name="amount"
                        variant="standard"
                        placeholder="مبلغ"
                        type="number"
                        value={payment.amount}
                        onChange={(event) => this.onChange(event)}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        margin="dense"
                        inputProps={{min: 0, style: {textAlign: "center"}}}
                        id="tf_desc"
                        name="description"
                        variant="outlined"
                        placeholder="توضیحات"
                        value={payment.description}
                        onChange={(event) => this.onChange(event)}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        autoFocus
                        color="primary"
                        size="large"
                        margin="dense"
                        onClick={this.persistPayment}
                        startIcon={<SaveIcon style={{marginLeft: "10px"}}/>}
                        style={{marginTop: "30px"}}
                    >
                        ذخــیره
                    </Button>
                </Container>
            </Dialog>
        );
    }
}
