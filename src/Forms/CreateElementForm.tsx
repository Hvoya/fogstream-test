import * as React from "react";

import { Button, Divider, Paper, TextField, withStyles } from "@material-ui/core";
import { Classes } from "jss";
import { BackDrop } from "./BackDrop";
import "./Forms.css";

interface ICreateElementFormProps {
  createElement: (name: string, assigned: string, time: number) => void;
  toggle: () => void;
  classes: Classes;
}
const styles = () => ({
  textField: {
    display: "block",
    margin: "0 auto 15px"
  }
});
interface ICreateElementFormState {
  name: string;
  assigned: string;
  hours: number;
  minutes: number;
}

class CreateElementForm extends React.Component<ICreateElementFormProps, ICreateElementFormState> {
  public constructor(props: ICreateElementFormProps) {
    super(props);

    this.state = {
      assigned: "",
      hours: 0,
      minutes: 0,
      name: ""
    };
  }
  public render() {
    const { toggle, classes } = this.props;
    const { assigned, hours, minutes, name } = this.state;
    return (
      <BackDrop toggle={toggle}>
        <Paper className="form__wrapper">
          <form className="create-element-form" onClick={event => event.stopPropagation()}>
            <h2>New Element</h2>
            <Divider />
            <TextField onChange={this.nameChangeHandler} type="text" id="name" placeholder="Input New Element Name" />
            <br />
            <TextField
              className={classes.textField}
              onChange={this.assignmentChangeHandler}
              type="text"
              id="assiged"
              placeholder="Input New Assignment"
            />
            <div className="time-input">
              <label htmlFor="hours">Hours</label>
              <TextField
                id="hours"
                className={classes.textField}
                value={this.state.hours}
                onChange={this.hoursChangeHandler}
                type="number"
                placeholder="Input Hours"
              />
              <label htmlFor="minutes">Minutes</label>
              <TextField
                className={classes.textField}
                id="minutes"
                value={this.state.minutes}
                onChange={this.minutesChangeHandler}
                type="number"
                placeholder="Input Minutes"
              />
            </div>
          </form>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              this.createElement(name, assigned, minutes, hours);
            }}
          >
            Create
          </Button>
        </Paper>
      </BackDrop>
    );
  }
  private createElement = (name: string, assigned: string, minutes: number, hours: number) => {
    if (name !== "" && assigned !== "") {
      const time = hours * 60 + minutes;
      this.props.createElement(name, assigned, time);
    }
  };
  private nameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      name: event.target.value
    });
  };
  private assignmentChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      assigned: event.target.value
    });
  };
  private minutesChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(event.target.value);
    if (minutes > 59 || minutes < 0) {
      this.setState({
        minutes: 59
      });
    } else if (minutes !== 0) {
      this.setState({
        minutes
      });
    }
  };
  private hoursChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hours = parseInt(event.target.value);
    if (hours > 23 || hours < 0) {
      this.setState({
        hours: 0
      });
    } else if (hours !== 0) {
      this.setState({
        hours
      });
    }
  };
}
export default withStyles(styles)(CreateElementForm);
