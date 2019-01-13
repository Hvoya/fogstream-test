import * as React from "react";

import { Button, Divider, Paper, TextField } from "@material-ui/core";
import { BackDrop } from "./BackDrop";
import "./Forms.css";

interface ICreateStepFormProps {
  createStep: (name: string) => void;
  toggle: () => void;
}
interface ICreateStepFormState {
  name: string;
}

export class CreateStepForm extends React.Component<ICreateStepFormProps, ICreateStepFormState> {
  public constructor(props: ICreateStepFormProps) {
    super(props);

    this.state = {
      name: ""
    };
  }
  public render() {
    const { toggle } = this.props;
    return (
      <BackDrop toggle={toggle}>
        <Paper className="form__wrapper">
          <form onClick={event => event.stopPropagation()}>
            <h2>New Stage</h2>
            <Divider />
            <TextField
              className="input"
              onChange={this.ChangeHandler}
              type="text"
              id="name"
              placeholder="Input New Stage Name"
            />
          </form>
          <Button
            onClick={() => {
              this.createStep(this.state.name);
            }}
            variant="contained"
            color="primary"
          >
            Create Step
          </Button>
        </Paper>
      </BackDrop>
    );
  }
  private createStep = (name: string) => {
    if (name !== "") {
      this.props.createStep(name);
    }
  };
  private ChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      name: event.target.value
    });
  };
}
