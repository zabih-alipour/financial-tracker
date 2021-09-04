import { Box, Paper, Link } from "@material-ui/core";
import { blue, green, grey, teal } from "@material-ui/core/colors";
import { useEffect, useState } from "react";
import AmountDecorate from "../utils/AmountDecorate";
import { asset_summary } from "../utils/apis";
import { INVESTMENT_TYPE_USER_DETAIL_KEY, ShowDialog } from "../utils/Dialogs";

export default function AssetSummary(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (data.length === 0) {
      asset_summary((res) => {
        console.log("AssetSummary: " + res);
        setData(res);
      });
    }
  }, [data]);

  const renderPanels = () => {
    if (data.length > 0) {
      return data.map((row, idx) => {
        return (
          <Box key={idx} p={2} borderBottom={1}>
            <Box color={blue[400]}>{row.label}</Box>
            <Box color={green[400]} textAlign="left">
              <AmountDecorate align={"left"} amount={row.amount} />
            </Box>
          </Box>
        );
      });
    } else {
      return (
        <Box p={2} borderBottom={1}>
          <Box color={teal[400]}>دیتایی برای نمایش وجود ندارد</Box>
        </Box>
      );
    }
  };

  return (
    <Box border={1} borderRadius={5} component={Paper}>
      <Box
        fontSize={15}
        borderBottom={1}
        bgcolor={grey[300]}
        textAlign="center"
        width={"lg"}
        p={2}
      >
        خلاصه کل سرمایه
      </Box>
      <Box>{renderPanels}</Box>
    </Box>
  );
}
