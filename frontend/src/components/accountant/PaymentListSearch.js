import { Box, Button, Container, Paper, TextField } from "@material-ui/core";
import { blue, grey } from "@material-ui/core/colors";
import { Search } from "@material-ui/icons";
import React, { useState } from "react";
import UserAutoComplete from "../user/UserAutoComplete";
import PaymentTypeAutoComplete from "./PaymentTypeAutoComplete";

export default function PaymentListSearch(props) {
  const [criteria, setCriteria] = useState({});
  const { doSearch, pageable } = props;

  const onChange = (event) => {
    const { name, value } = event.target;

    if (value === null || value === "") {
      delete criteria[name];
    } else
      setCriteria({
        ...criteria,
        [name]: value,
      });
  };

  const searchByCriteria = () => {
    const search = [];

    for (const key in criteria) {
      const value = criteria[key];
      search.push({
        key: key,
        value: value.id ? value.id : value,
      });
    }

    const searchCriteria = {
      searchArias: search,
    };

    doSearch(searchCriteria);
  };

  return (
    <Container component={Paper} style={{ padding: "10px", marginTop: "10px" }}>
      <Box
        fontSize={16}
        mb={3}
        textAlign="center"
        bgcolor={blue[300]}
        padding={2}
        borderRadius={5}
      >
        پنل جستــجو
      </Box>
      <UserAutoComplete
        onChange={onChange}
        fieldName="user"
        user={criteria.user}
      />
      <PaymentTypeAutoComplete
        onChange={onChange}
        fieldName="paymentType"
        type={criteria.paymentType}
      />
      <TextField
        fullWidth
        inputProps={{ min: 0, style: { textAlign: "center" } }}
        id="tf_date"
        variant="standard"
        placeholder="تاریخ"
        name="shamsiDate"
        margin="dense"
        value={criteria.shamsiDate}
        onChange={(event) => onChange(event)}
      />
      <TextField
        fullWidth
        inputProps={{ min: 0, style: { textAlign: "center" } }}
        id="tf_amount"
        margin="dense"
        name="amount"
        variant="standard"
        placeholder="مبلغ"
        value={criteria.amount}
        onChange={(event) => onChange(event)}
      />
      <Button
        fullWidth
        margin="dense"
        color="secondary"
        variant="outlined"
        size="medium"
        autoFocus
        className="saveButton"
        onClick={() => searchByCriteria()}
        style={{ marginTop: "30px" }}
      >
        جستــجو
      </Button>
    </Container>
  );
}
