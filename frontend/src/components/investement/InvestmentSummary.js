import { useEffect, useState } from "react";

export default function InvestmentSummary(props) {
  const { user } = props;
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    fetch("/api/investments/reports/total-assets/" + user.id)
      .then((res) => res.json())
      .then((data) => setSummary(data));
  }, [user]);

  const footerComponent = () => {
    const rows = summary.map((row, idx) => {
      return (
        <TableCell align="center">
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
}
