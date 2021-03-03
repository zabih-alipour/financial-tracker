import {
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import { grey } from "@material-ui/core/colors";
import InvestmentTypeForm from "./InvestmentTypeForm";
export default class InvestementTypeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      types: [],
    };
  }

  componentDidMount = () => {
    this.fetchData();
  };

  fetchData = () => {
    fetch("/api/investment_types")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          types: data,
        });
      });
  };

  dialogHandler = (dialog, type) => {
    this.setState({ dialog: dialog, selectedType: type });
  };

  onClose = (status) => {
    this.setState({
      dialog: "",
      selectedType: null,
    });
    if (status === "SUCCESSFUL") {
      this.fetchData();
    }
  };

  showDialog = () => {
    const { dialog, selectedType } = this.state;
    if (dialog === "TYPE_FORM") {
      return (
        <InvestmentTypeForm
          openDialog={true}
          type={selectedType}
          onClose={this.onClose}
        />
      );
    }
  };
  render() {
    const { types } = this.state;

    const rows = types.map((type, idx) => {
      return (
        <TableRow key={idx}>
          <TableCell align="center">{idx + 1}</TableCell>
          <TableCell align="center">{type.name}</TableCell>
          <TableCell align="center">{type.code}</TableCell>
          <TableCell align="center">{type.latestPrice}</TableCell>
          <TableCell align="center">{"20%"}</TableCell>
          <TableCell align="center">
            <IconButton onClick={() => this.dialogHandler("TYPE_FORM", type)}>
              <EditIcon color="promary"/>
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
    return (
      <Container>
        <Grid className="header" container alignItems="center">
          <Grid item xs={11}>
            <Typography
              variant="h6"
              dir="rtl"
              style={{ color: grey[300], fontSize: 30 }}
            >
              سبد سرمایه
            </Typography>
          </Grid>

          <Grid item xs>
            <Button
              onClick={() => this.dialogHandler("TYPE_FORM", null)}
              variant="outlined"
              fullWidth
              style={{ backgroundColor: "white" }}
            >
              جــدیــد
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: "orange" }}>
              <TableRow>
                <TableCell align="center">ردیف</TableCell>
                <TableCell align="center">عنوان</TableCell>
                <TableCell align="center">کد</TableCell>
                <TableCell align="center">آخرین قیمت</TableCell>
                <TableCell align="center">تغییرات در ۲۴ ساعت</TableCell>
                <TableCell align="center">عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{rows}</TableBody>
          </Table>
        </TableContainer>
        {this.showDialog()}
      </Container>
    );
  }
}
