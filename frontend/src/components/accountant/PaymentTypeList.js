import {
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { green, grey } from "@material-ui/core/colors";
import React from "react";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import ReceiptIcon from "@material-ui/icons/Receipt";

export default class PaymentTypeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentTypes: [],
    };
  }

  componentDidMount = () => {
    fetch("/api/paymentTypes")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({
          paymentTypes: data,
        });
      })
      .catch((e) => console.log(e));
  };
  render() {
    const { paymentTypes } = this.state;

    const rows = paymentTypes.map((row) => {
      return (
        <TableRow key={row.id}>
          <TableCell component="th" scope="row" align="center">
            {row.id}
          </TableCell>
          <TableCell align="center">{row.name}</TableCell>
          <TableCell align="center">
            <IconButton>
              <ReceiptIcon color="primary"/>
            </IconButton>
            <IconButton>
              <EditIcon style={{color: green[300]}}/>
            </IconButton>
            <IconButton>
              <DeleteForeverIcon color="secondary"/>
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });

    return (
      <div
        style={{
          marginTop: "20px",
          margin: "10px auto ",
          width: "60%",
          flex: "row",
        }}
      >
        <Grid
          className="header"
          container
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={11}>
            <Typography
              variant="h6"
              dir="rtl"
              style={{ color: grey[300], fontSize: 30 }}
            >
              دسته بندی
            </Typography>
          </Grid>

          <Grid item xs justify="alignContent">
            <Button
              variant="outlined"
              fullWidth
              style={{ backgroundColor: "white" }}
            >
              جــدیــد
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: "orange" }}>
              <TableRow>
                <TableCell align="center">ردیف</TableCell>
                <TableCell align="center" style={{ width: "70%" }}>
                  عنوان
                </TableCell>
                <TableCell align="center">اکشن</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}
