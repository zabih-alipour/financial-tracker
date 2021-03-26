import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import { blue } from "@material-ui/core/colors";
import InvestmentTypeForm from "./InvestmentTypeForm";
import ListHeader from "../utils/ListHeader";
import InvestmentSpecificDetail from "./InvestmentSpecificDetail";
import ReceiptIcon from "@material-ui/icons/Receipt";
import { update_market_statics } from "../utils/apis";
import { Pagination } from "@material-ui/lab";

export default class InvestementTypeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagedData: {},
    };
  }

  componentDidMount = () => {
    this.fetchData();
  };

  fetchData = (searchCriteria = null) => {
    fetch("/api/investment_types/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(searchCriteria),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          pagedData: data,
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
    } else if (dialog === "INVESTMENT_DETAIL") {
      return (
        <InvestmentSpecificDetail
          openDialog={true}
          user={null}
          type={selectedType}
          onClose={this.onClose}
        />
      );
    }
  };
  onPageChanged = (event, page) => {
    this.fetchData(this.getCriteria(page));
  };
  getCriteria = (page) => {
    const { pagedData, } = this.state;
    const { size = 0 } = pagedData;

    const searchCriteria = {
      searchArias: [],
      pagination: {
        pageSize: size,
        pageNumber: page - 1,
      },
      sort: {
        field: "latestPrice",
        order: "DESC",
      },
    };
    return searchCriteria;
  };
  render() {
    const { pagedData } = this.state;
    const {
      content = [],
      totalPages = 0,
      number = 0,
      empty = true,
    } = pagedData;

    const rows = content.map((type, idx) => {
      return (
        <TableRow key={idx}>
          <TableCell align="center">{idx + 1}</TableCell>
          <TableCell align="center">{type.name}</TableCell>
          <TableCell align="center">{type.code}</TableCell>
          <TableCell align="center">{type.latestPrice}</TableCell>
          <TableCell align="center">{"20%"}</TableCell>
          <TableCell align="center">
            <IconButton
              onClick={() => this.dialogHandler("INVESTMENT_DETAIL", type)}
            >
              <ReceiptIcon style={{ color: blue[500] }} />
            </IconButton>
            <IconButton onClick={() => this.dialogHandler("TYPE_FORM", type)}>
              <EditIcon color="primary" />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
    return (
      <Container>
        <ListHeader
          titleArea={"سبد سرمایه"}
          searchArea={<div></div>}
          buttonAria={
            <Box>
              <Box ml={1 / 2} display="inline-block">
                <Button
                  onClick={() => update_market_statics(this.fetchData)}
                  variant="outlined"
                  style={{ backgroundColor: "white" }}
                >
                  بروزرسانی
                </Button>
              </Box>
              <Box display="inline-block">
                <Button
                  onClick={() => this.dialogHandler("TYPE_FORM", null)}
                  variant="outlined"
                  style={{ backgroundColor: "white" }}
                >
                  جــدیــد
                </Button>
              </Box>
            </Box>
          }
        />

        <TableContainer component={Paper}>
          <Table>
            <caption>
              <Box>
                <Box mt={0.5} justifyContent="center">
                  <Pagination
                    boundaryCount={2}
                    page={number + 1}
                    count={totalPages}
                    disabled={empty}
                    color="primary"
                    onChange={this.onPageChanged}
                  />
                </Box>
              </Box>
            </caption>
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
