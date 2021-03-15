import {
  Card,
  CardContent,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { green, grey, indigo } from "@material-ui/core/colors";
import ReceiptIcon from "@material-ui/icons/Receipt";

export default function InvestmentReportDetail(props) {
  const { data } = props;
  const rows = () => {
    const details = data.coins.map((p) => {
      return (
        <TableRow>
          <TableCell align="center">{p.investmentType.name}</TableCell>
          <TableCell align="center">
            {p.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </TableCell>
          <TableCell align="center">
            <IconButton>
              <ReceiptIcon style={{ color: green[500] }} />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
    return details;
  };
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
          <TableBody>{rows()}</TableBody>
          {/* <TableFooter>
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
          </TableFooter> */}
        </Table>
      </CardContent>
    </Card>
  );
}
