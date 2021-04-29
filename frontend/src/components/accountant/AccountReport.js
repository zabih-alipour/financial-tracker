import { Box, Container } from "@material-ui/core";
import React from "react";
import PaymentReportDetail from "./PaymentReportDetail";
import PaymentListPopup from "./PaymentListPopup";
import UserListPanel from "../user/UserListPanel";
import { ShowDialog } from "../utils/Dialogs";

export default class AccountReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: null,
      selectedRow: { user: null, type: null },
      selectedUser: { id: 1 },
    };
  }

  onClose = () => {
    this.setState({
      selectedRow: { user: null, type: null },
      dialog: null,
    });
  };

  showDialog = () => {
    const { dialog, selectedRow } = this.state;

    return ShowDialog(
      { user: selectedRow.user, type: selectedRow.type, dialog: dialog },
      this.onClose
    );
  };

  handelDialog = (dialog, selectedRow) => {
    this.setState({
      selectedRow: selectedRow,
      dialog: dialog,
    });
  };

  onUserChange = (event) => {
    const user = event.target.value;
    this.setState({ selectedUser: user });
  };

  render() {
    const { selectedUser } = this.state;
    return (
      <Box>
        <Box p={1} display="flex" flexWrap="nowrap">
          <Box width="20%" display="inline-block" ml={2}>
            <UserListPanel showBalance={true} onClick={this.onUserChange} />
          </Box>
          <Box width="60%" display="inline-block" ml={2}>
            <PaymentReportDetail
              key={selectedUser.id}
              user={selectedUser}
              handelDialog={this.handelDialog}
            />
          </Box>
          {/* <Box width="20%" display="inline-block">
            <AssetSummary/>
          </Box> */}
        </Box>
        {this.showDialog()}
      </Box>
    );
  }
}
