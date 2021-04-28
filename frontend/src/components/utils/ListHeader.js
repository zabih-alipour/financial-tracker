import { Box } from "@material-ui/core";
import { lightBlue } from "@material-ui/core/colors";

export default function ListHeader(props) {
  const { titleArea, searchArea, buttonAria, headerStyle } = props;
  return (
    <Box
      display="flex"
      mt="10px"
      mb="5px"
      borderRadius="4px"
      bgcolor={lightBlue[300]}
      boxShadow={10}
    >
      <Box
        width="20%"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        pr="5px"
      >
        <Box
          textAlign="center"
          fontWeight="fontWeightBold"
          fontSize="h6.fontSize"
          fontFamily="Monospace"
          letterSpacing={1}
          lineHeight={3}
          color="white"
        >
          {titleArea}
        </Box>
      </Box>
      <Box
        width="60%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {searchArea}
      </Box>
      <Box
        width="20%"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        pl="5px"
      >
        {buttonAria}
      </Box>
    </Box>
  );
}
