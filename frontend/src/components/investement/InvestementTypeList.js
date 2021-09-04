import {
  Box,
  Button,
  Container,
  IconButton,
  Link,
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
import { blue, green } from "@material-ui/core/colors";
import ListHeader from "../utils/ListHeader";
import ReceiptIcon from "@material-ui/icons/Receipt";
import { update_market_statics } from "../utils/apis";
import { Pagination } from "@material-ui/lab";
import { investment_types_search } from "../utils/apis";
import { INVESTMENT_TYPE_USER_DETAIL_KEY, ShowDialog } from "../utils/Dialogs";
import PostAddIcon from "@material-ui/icons/PostAdd";
import ListPagination from "../utils/ListPagination";
import InvestmentTypeAutoComplete from "./InvestmentTypeAutoComplete";

export default class InvestementTypeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagedData: {},
    };
  }

  componentDidMount = () => {
    this.doSearch();
  };

  doSearch = (searchCriteria = null) => {
    investment_types_search(searchCriteria, (data) => {
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
      this.doSearch();
    }
  };

  showDialog = () => {
    const { dialog, selectedType } = this.state;
    return ShowDialog(
      { type: selectedType, user: null, dialog: dialog },
      this.onClose
    );
  };
  onPageChanged = (event, page) => {
    this.doSearch(this.getCriteria(page));
  };
  getCriteria = (page) => {
    const { pagedData } = this.state;
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

  onChange = (event) => {
    const { name, value } = event.target;
    let searchCriteria = null;
    if (value !== null && value !== "") {
      searchCriteria = {
        searchArias: [
          {
            key: "id",
            value: value.id,
          },
        ],
      };
    }
    this.doSearch(searchCriteria); 
  };

  render() {
    const { pagedData } = this.state;
    const {
      content = [],
      totalPages = 0,
      number = 0,
      totalElements = 0,
      empty = true,
    } = pagedData;

    const rows = content.map((type, idx) => {
      return (
        <TableRow key={idx}>
          <TableCell align="center">{idx + 1}</TableCell>
          <TableCell align="center">
            <Link button onClick={() => this.dialogHandler(INVESTMENT_TYPE_USER_DETAIL_KEY, type)}>
              {type.name}
            </Link>
          </TableCell>
          <TableCell align="center">{type.code}</TableCell>
          <TableCell align="center">{type.latestPrice}</TableCell>
          <TableCell align="center">{"20%"}</TableCell>
          <TableCell align="center">
            <IconButton
              onClick={() => this.dialogHandler("INVESTMENT_FORM", type)}
            >
              <PostAddIcon style={{ color: green[500] }} />
            </IconButton>
            <IconButton
              onClick={() =>
                this.dialogHandler("INVESTMENT_SPECIFIC_DETAIL", type)
              }
            >
              <ReceiptIcon style={{ color: blue[500] }} />
            </IconButton>
            <IconButton
              onClick={() => this.dialogHandler("INVESTMENT_TYPE_FORM", type)}
            >
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
          searchArea={
            <InvestmentTypeAutoComplete
              fullWidth={true}
              fieldName="investmentType"
              onChange={this.onChange}
            />
          }
          buttonAria={
            <Box>
              <Box ml={1 / 2} display="inline-block">
                <Button
                  onClick={() => update_market_statics(this.doSearch)}
                  variant="outlined"
                  style={{ backgroundColor: "white" }}
                >
                  بروزرسانی
                </Button>
              </Box>
              <Box display="inline-block">
                <Button
                  onClick={() =>
                    this.dialogHandler("INVESTMENT_TYPE_FORM", null)
                  }
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
              <ListPagination
                number={number}
                totalPages={totalPages}
                empty={empty}
                totalElements={totalElements}
                onPageChanged={this.onPageChanged}
              />
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
