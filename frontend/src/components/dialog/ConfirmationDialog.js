import * as React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmationDialog(props) {
  const { data, openDialog, onAccept, onReject, headerComponent, bodyComponent} = props;
  const [open, setOpen] = React.useState(openDialog);

  const handleClose = () => {
    setOpen(false);
    onReject()
  };

  const accept = () => {
    handleClose();
    onAccept(data);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      {headerComponent}
      <DialogContent>
        {bodyComponent}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>انصراف</Button>
        <Button onClick={accept}>تایید</Button>
      </DialogActions>
    </Dialog>
  );
}
