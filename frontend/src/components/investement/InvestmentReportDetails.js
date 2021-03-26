import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { blue, green, grey, indigo } from "@material-ui/core/colors";
import ReceiptIcon from "@material-ui/icons/Receipt";
import PostAddIcon from "@material-ui/icons/PostAdd";
import { useEffect, useState } from "react";
import AmountDecorate from "../utils/AmountDecorate";

export default function InvestmentReportDetail(props) {
  const { data, onActionClick } = props;
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    const user = data.user;
    fetch("/api/investments/reports/total-assets/" + user.id)
      .then((res) => res.json())
      .then((data) => setSummary(data));
  }, [data]);

  const footerComponent = () => {
    const rows = summary.map((row, idx) => {
      return (
        <TableCell align="center" key={idx}>
          <Box p={1 / 2} fontSize={13} style={{ color: indigo[500] }}>
            <Box padding={2} borderBottom={1}>
              سرمایه به {row.investmentType.name}
            </Box>
            <Box padding={2}>
              <AmountDecorate amount={row.amount} />
            </Box>
          </Box>
        </TableCell>
      );
    });
    return (
      <TableFooter>
        <TableRow style={{ backgroundColor: grey[100] }}>
          {rows}
          <TableCell align="center"></TableCell>
        </TableRow>
      </TableFooter>
    );
  };
  const rows = () => {
    const details = data.coins.map((p, idx) => {
      return (
        <TableRow key={idx}
          title={
            "آخرین قیمت " +
            p.investmentType.name +
            ": " +
            p.investmentType.latestPrice
          }
        >
          <TableCell align="center">{p.investmentType.name}</TableCell>

          <TableCell align="center">
            <AmountDecorate amount={p.amount} />
          </TableCell>
          <TableCell align="center">
            <Box>
              <IconButton
                onClick={() =>
                  onActionClick(data.user, p.investmentType, "INVESTMENT_FORM")
                }
              >
                <PostAddIcon style={{ color: green[500] }} />
              </IconButton>
              <IconButton
                onClick={() =>
                  onActionClick(data.user, p.investmentType, "INVESTMENT_SPECIFIC_DETAIL")
                }
              >
                <ReceiptIcon style={{ color: blue[500] }} />
              </IconButton>
            </Box>
          </TableCell>
        </TableRow>
      );
    });
    return details;
  };
  return (
    <Card style={{ margin: "10px" }} variant="outlined">
      <CardHeader
        title={data.user.name}
        action={
          <Box>
            <Box>
              <IconButton
                onClick={() =>
                  onActionClick(data.user, null, "INVESTMENT_FORM")
                }
              >
                <PostAddIcon style={{ color: green[500] }} />
              </IconButton>
              <IconButton
                onClick={() =>
                  onActionClick(data.user, null, "INVESTMENT_SPECIFIC_DETAIL")
                }
                title="جزییات"
              >
                <ReceiptIcon style={{ color: blue[500] }} />
              </IconButton>
            </Box>
          </Box>
        }
      />
      <CardContent>
        <Table>
          <TableHead style={{ backgroundColor: indigo[100] }}>
            <TableRow>
              <TableCell align="center">عنوان</TableCell>
              <TableCell align="center">مقدار</TableCell>
              <TableCell align="center">جزییات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{rows()}</TableBody>
          {footerComponent()}
        </Table>
      </CardContent>
    </Card>
  );
}
