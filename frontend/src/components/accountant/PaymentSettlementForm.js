import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  IconButton,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import { cyan } from "@material-ui/core/colors";
import { settlement_payment } from "../utils/apis";
import AmountDecorate from "../utils/AmountDecorate";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PaymentSettlementForm(props) {
  const { payment, onClose } = props;
  const [open, setOpen] = useState(props.openDialog);
  const [settlementDto, setSettlementDto] = useState({
    id: payment.id,
    amount: payment.amount + payment.settlementAmount,
  });

  const handleClose = (status = "NO_ACTION") => {
    setOpen(false);
    onClose(status);
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    var data = {
      ...settlementDto,
      [name]: value,
    };

    setSettlementDto(data);
  };

  const persist = () => {
    settlement_payment(settlementDto, (res) => handleClose("SUCCESS"));
  };

  return (
    <Dialog
      // fullScreen
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
    >
      <AppBar className="appBar">
        <Toolbar>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={"title"} component="div">
            تسویه پرداخت
          </Typography>
        </Toolbar>
      </AppBar>
      <Container style={{ padding: "20px" }}>
        <Box>
          <Box
            fontSize={14}
            color={cyan[500]}
            mb={3}
            border={1}
            p={2}
            borderRadius={5}
          >
            <Box display="flex" mb={2}>
              <Box width="50%">
                {"کاربر: "} {payment.user.name}
              </Box>
              <Box width="50%">
                {"نوع: "}
                {payment.paymentType.name}
              </Box>
            </Box>
            <Box display="flex" mb={2}>
              <Box width="50%">
                {"کل مبلغ: "}
                <AmountDecorate display="inline-block" amount={payment.amount} />
              </Box>
              <Box width="50%">
                {"مبلغ تسویه شده: "}
                <AmountDecorate display="inline-block" amount={payment.settlementAmount} />
              </Box>
            </Box>
            <Box display="flex" textAlign="center">
              {"تاریخ: "} {payment.shamsiDate}{" "}
            </Box>
          </Box>
          <Box>
            <TextField
              fullWidth
              label="مبلغ"
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              id="tf_amount"
              margin="dense"
              name="amount"
              variant="standard"
              placeholder="مبلغ"
              value={settlementDto.amount}
              onChange={(event) => onChange(event)}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              margin="dense"
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              id="tf_desc"
              name="description"
              variant="outlined"
              placeholder="توضیحات"
              value={settlementDto.description}
              onChange={(event) => onChange(event)}
            />
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          autoFocus
          color="primary"
          size="large"
          margin="dense"
          onClick={persist}
          startIcon={<SaveIcon style={{ marginLeft: "10px" }} />}
          style={{ marginTop: "30px" }}
        >
          ذخــیره
        </Button>
      </Container>
    </Dialog>
  );
}
