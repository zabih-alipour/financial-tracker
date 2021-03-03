import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Dialog, Slide, TextField, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  search: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    // marginBottom: "1px",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PaymentTypePopup(props) {
  const classes = useStyles();
  const { openDialog, types, onSelected } = props;
  const [open, setOpen] = React.useState(openDialog);
  const [filteredTypes, setFilteredTypes] = React.useState(types);

  const handleClose = () => {
    setOpen(false);
  };
  const onChange = (event) => {
    const val = event.target.value;
    if (val)
      setFilteredTypes(
        filteredTypes.filter((p) => p.name.startsWith(event.target.value))
      );
    else setFilteredTypes(types);
  };

  const onSelectedItem = (type) => {
    handleClose()
    onSelected(type)
  };

  return (
    <Dialog open={open} TransitionComponent={Transition} onClose={handleClose}>
      <TextField
        className={classes.search}
        autoFocus
        onChange={(event) => onChange(event)}
        variant="outlined"
        // margin={"dense"}
        color="secondary"
        placeholder="جستجو"
        inputProps={{ min: 0, style: { textAlign: "center" } }}
        fullWidth
      />
      <List component="nav" className={classes.root} aria-label="contacts">
        {filteredTypes.map((row) => (
          <ListItem
            button
            alignItems="center"
            divider
            onClick={() => onSelectedItem(row)}
          >
            <ListItemText>
              <Typography align="center">{row.name}</Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
