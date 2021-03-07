import { Container, TextField, IconButton } from "@material-ui/core";
import React from "react";
import ListHeader from "../utils/ListHeader";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { yellow } from "@material-ui/core/colors";

class Home extends React.Component {
  render() {
    return (
      <Container>
        <ListHeader
          titleArea={"کاربران"}
          searchArea={
            <TextField
              fullWidth
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              id="standard-basic"
              variant="standard"
              placeholder="جستجو"
              // onChange={(event) => this.onChange(event)}
            />
          }
          buttonAria={
            <IconButton >
              <PersonAddIcon style={{ color: yellow[500], fontSize: 40 }} />
            </IconButton>
          }
        />
      </Container>
    );
  }
}

export default Home;
