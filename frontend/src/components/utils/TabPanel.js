import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

export default function TabPanel(props) {
    const { value, index, component, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`wrapped-tabpanel-${index}`}
        aria-labelledby={`wrapped-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography component={'span'} variant={'body2'}>{component}</Typography>
          </Box>
        )}
      </div>
    );
  }