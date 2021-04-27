import { Box, Container } from "@material-ui/core";
import React from "react";
import PaymentReportDetail from "./PaymentReportDetail";
import PaymentListPopup from "./PaymentListPopup";
import UserListPanel from "../user/UserListPanel";

export default class AccountReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      selectedRow: { user: null, type: null },
      selectedUser: { id: 1 },
    };
  }

  onDetailClick = (selectedRow) => {
    this.setState({
      selectedRow: selectedRow,
      openDialog: true,
    });
  };

  onClose = () => {
    this.setState({
      selectedRow: { user: null, type: null },
      openDialog: false,
    });
  };

  handleDialog = () => {
    const { openDialog, selectedRow } = this.state;

    if (openDialog) {
      return (
        <PaymentListPopup
          openDialog={true}
          user={selectedRow.user}
          type={selectedRow.type}
          onClose={this.onClose}
        />
      );
    }
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
              onDetailClick={this.onDetailClick}
            />
          </Box>
          {/* <Box width="20%" display="inline-block">
            <AssetSummary/>
          </Box> */}
        </Box>
        {this.handleDialog()}
      </Box>
    );
  }
}
