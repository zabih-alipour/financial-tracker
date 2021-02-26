import {
  Card,
  CardContent,
  Divider,
  Table,
  TableHead,
  Typography,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TableFooter,
} from "@material-ui/core";
import React from "react";
import ReceiptIcon from "@material-ui/icons/Receipt";
import { green, grey, indigo } from "@material-ui/core/colors";

export default class PaymentReportDetail extends React.Component {
  constructor(props) {
    super(props);
    this.onDetailClick = props.onDetailClick;
    this.state = {
      data: props.data,
    };
  }

  render() {
    const { data } = this.state;
    const rows = data.details.map((p) => {
      const row = { user: data.user, type: p.type };
      return (
        <TableRow>
          <TableCell align="center">{p.type.name}</TableCell>
          <TableCell align="center">
            {p.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </TableCell>
          <TableCell align="center">
            <IconButton onClick={() => this.onDetailClick(row)}>
              <ReceiptIcon style={{ color: green[500] }} />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
    return (
      <Card style={{ margin: "10px" }}>
        <CardContent>
          <Typography variant="h4" style={{ height: "50px" }} gutterBottom>
            {data.user.name}
          </Typography>
          <Divider />

          <Table>
            <TableHead style={{ backgroundColor: indigo[100] }}>
              <TableRow>
                <TableCell align="center">عنوان</TableCell>
                <TableCell align="center">مبلغ</TableCell>
                <TableCell align="center">جزییات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
            <TableFooter>
              <TableRow style={{ backgroundColor: grey[100] }}>
                <TableCell align="center">
                  <Typography align="center">مجموع</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography align="center">
                    {data.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Typography>
                </TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    );
  }
}
