import {
  Box,
  Card,
  CardContent,
  CardHeader,
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
import { blue, green, grey, indigo } from "@material-ui/core/colors";
import ReceiptIcon from "@material-ui/icons/Receipt";
import AmountDecorate from "../utils/AmountDecorate";

export default function InvestmentReportDetail(props) {
  const { data, onActionClick } = props;
  const rows = () => {
    const details = data.coins.map((p) => {
      return (
        <TableRow>
          <TableCell align="center">{p.investmentType.name}</TableCell>
          <TableCell align="center">
            <AmountDecorate amount={p.amount} />
          </TableCell>
          <TableCell align="center">
            <IconButton
              onClick={() =>
                onActionClick({ user: data.user, type: p.investmentType })
              }
            >
              <ReceiptIcon style={{ color: blue[500] }} />
            </IconButton>
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
          <IconButton onClick={() => onActionClick({ user: data.user })}>
            <ReceiptIcon style={{ color: blue[500] }} />
          </IconButton>
        }
      />
      <CardContent>
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
