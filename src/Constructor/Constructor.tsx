import * as React from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
const nanoid = require("nanoid");
import { Fab, withStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { Classes } from "jss";
import { CreateStageForm } from "src/Forms/CreateStageForm";
import { IData } from "src/interfacex";
import Stage from "../Stage/Stage";
import "./Constructor.css";

const styles = () => ({
  fab: {
    display: "block",
    margin: "0 auto"
  }
});
interface IConstructorProps {
  classes: Classes;
}
interface IConstructorState {
  data: IData;
  newStageFormToggled: boolean;
}

class Constructor extends React.Component<IConstructorProps, IConstructorState> {
  public constructor(props: any) {
    super(props);

    const jsonData = localStorage.getItem("constructor");
    if (jsonData) {
      this.state = { data: JSON.parse(jsonData), newStageFormToggled: true };
    } else {
      this.state = {
        data: {
          stages: []
        },
        newStageFormToggled: true
      };
      const data = {
        stages: []
      };
      localStorage.setItem("constructor", JSON.stringify(data));
    }
  }
  public render() {
    const { data, newStageFormToggled } = this.state;
    return (
      <div className="constructor">
        {data.stages.map((stage, i) => (
          <Stage
            time={stage.time}
            steps={stage.steps}
            key={stage.id}
            name={stage.name}
            id={stage.id}
            index={i}
            moveStage={this.moveStage}
          />
        ))}
        {!newStageFormToggled ? (
          <CreateStageForm createStage={this.createStage} toggle={() => this.setState({ newStageFormToggled: true })} />
        ) : null}
        <Fab
          className={this.props.classes.fab}
          onClick={() => this.setState({ newStageFormToggled: false })}
          color="primary"
          aria-label="Add"
        >
          <AddIcon />
        </Fab>
      </div>
    );
  }
  private moveStage = (dragIndex: number, hoverIndex: number) => {
    const { data } = this.state;
    const dragStage = data.stages[dragIndex];

    const newData = Object.assign({}, data);
    newData.stages.splice(dragIndex, 1);
    newData.stages.splice(hoverIndex, 0, dragStage);

    localStorage.setItem("constructor", JSON.stringify(newData));

    this.setState({ data: newData });
  };
  private createStage = (name: string) => {
    const newStages = [...this.state.data.stages];
    newStages.push({ name, id: nanoid(8), steps: [] });

    const newData = {
      stages: newStages
    };
    localStorage.setItem("constructor", JSON.stringify(newData));

    this.setState({
      data: {
        stages: newStages
      }
    });
  };
}

export default DragDropContext(HTML5Backend)(withStyles(styles)(Constructor));
