import * as React from "react";

import { Button, Divider, Paper, TextField } from "@material-ui/core";
import { BackDrop } from "./BackDrop";
import "./Forms.css";

interface ICreateStageFormProps {
  createStage: (name: string) => void;
  toggle: () => void;
}
interface ICreateStageFormState {
  name: string;
}

export class CreateStageForm extends React.Component<ICreateStageFormProps, ICreateStageFormState> {
  public constructor(props: ICreateStageFormProps) {
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
            <TextField onChange={this.ChangeHandler} type="text" id="name" placeholder="Input New Stage Name" />
          </form>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              this.createStage(this.state.name);
            }}
          >
            Create Stage
          </Button>
        </Paper>
      </BackDrop>
    );
  }
  private createStage = (name: string) => {
    if (name !== "") {
      this.props.createStage(name);
    }
  };
  private ChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      name: event.target.value
    });
  };
}
