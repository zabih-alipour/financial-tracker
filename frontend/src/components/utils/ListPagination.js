import { Box } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { Pagination } from "@material-ui/lab";

export default function ListPagination(props) {
  const {
    number = 0,
    totalPages = 0,
    empty = true,
    totalElements = 0,
    onPageChanged = 0,
  } = props;

  return (
    <Box display="flex">
      <Box display="flex" width="80%" mt={0.5} justifyContent="right">
        <Pagination
          boundaryCount={2}
          page={number + 1}
          count={totalPages}
          disabled={empty}
          color="primary"
          onChange={onPageChanged}
        />
      </Box>
      <Box
        display="flex"
        width="20%"
        mt={0.5}
        justifyContent="center"
        // color={blue[500]}
      >
        تعداد رکورد:
        <em style={{ marginRight: "10px", color: red[500] }}>
          {totalElements}
        </em>
      </Box>
    </Box>
  );
}
