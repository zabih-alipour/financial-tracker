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
  Link,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ReceiptIcon from "@material-ui/icons/Receipt";
import { green, grey, indigo } from "@material-ui/core/colors";
import AmountDecorate from "../utils/AmountDecorate";
import { PAYMENT_LIST_POPUP_KEY, PAYMENT_TYPE_USER_DETAIL_KEY } from "../utils/Dialogs";

export default function PaymentReportDetail(props) {
  const { handelDialog } = props;
  const [user, setUser] = useState(props.user);
  const [data, setData] = useState({});

  useEffect(() => {
    if (user) {
      fetch("/api/payments/reports/" + user.id)
        .then((response) => response.json())
        .then((res) => {
          setData(res);
        });
    }
  }, [user]);

  const paymentLines = () => {
    if (data.details) {
      return data.details.map((p, idx) => {
        const row = { user: data.user, type: p.type };
        return (
          <TableRow key={idx}>
            <TableCell align="center">
              <Link
                button
                onClick={() =>
                  handelDialog(PAYMENT_TYPE_USER_DETAIL_KEY, row)
                }
              >
                {p.type.name}
              </Link>
            </TableCell>
            <TableCell align="center">
              <AmountDecorate amount={p.amount} />
            </TableCell>
            <TableCell align="center">
              <IconButton onClick={() => handelDialog(PAYMENT_LIST_POPUP_KEY, row)}>
                <ReceiptIcon style={{ color: green[500] }} />
              </IconButton>
            </TableCell>
          </TableRow>
        );
      });
    }
  };

  return (
    <Card style={{ margin: "10px" }}>
      <CardContent>
        <Typography variant="h4" style={{ height: "50px" }} gutterBottom>
          {data.user ? data.user.name : "Not Defined"}
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
          <TableBody>{paymentLines()}</TableBody>
          <TableFooter>
            <TableRow style={{ backgroundColor: grey[100] }}>
              <TableCell align="center">
                <Typography align="center">مجموع</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography align="center" component={"div"}>
                  <AmountDecorate amount={data.sum} />
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
