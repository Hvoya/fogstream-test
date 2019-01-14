import * as React from "react";
import {
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DragSourceConnector,
  DragSourceMonitor,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor
} from "react-dnd";
const nanoid = require("nanoid");
import { Button, Paper, Theme, withStyles } from "@material-ui/core";

import { Classes } from "jss";
import { CreateStepForm } from "src/Forms/CreateStepForm";
import { IStage, IStep } from "src/interfacex";
import Step from "../Step/Step";
import "./Stage.css";

const styles = (theme: Theme) => ({
  button: {
    width: "82px"
  },
  createStepButton: {
    display: "block",
    margin: "20px auto 0"
  }
});

interface IStageProps {
  id: string;
  name: string;
  time?: number;
  index: number;
  steps?: IStep[];
  moveStage: (dragIndex: number, hoverIndex: number) => void;
  classes?: Classes;
}
interface IStageState {
  time: number;
  steps: IStep[];
  toggeled: boolean;
  newStepFormToggled: boolean;
}
interface IStageSourceCollectedProps {
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
}
interface IStageTargetCollectedProps {
  connectDropTarget: ConnectDropTarget;
}

class Stage extends React.Component<
  IStageProps & IStageSourceCollectedProps & IStageTargetCollectedProps,
  IStageState
> {
  public constructor(props: any) {
    super(props);

    if (this.props.steps) {
      this.state = {
        newStepFormToggled: true,
        steps: this.props.steps,
        time: this.props.time ? this.props.time : 0,
        toggeled: true
      };
    }
  }

  public render() {
    const { name, id, isDragging, connectDragSource, connectDropTarget } = this.props;
    const { steps, time } = this.state;
    const opacity = isDragging ? 0 : 1;

    const hours = Math.floor(time / 60);
    const minutes = time % 60;

    return connectDragSource(
      connectDropTarget(
        <div style={{ opacity }} className="stage">
          <Paper className="stage__wrapper">
            <div className="stage__head">
              <div className="step__head-info">
                <div className="stage__name">{name}</div>
                <div className="stage__time">{`${hours === 0 ? "00" : hours}:${minutes === 0 ? "00" : minutes}`}</div>
              </div>
              <Button
                className={this.props.classes!.button}
                variant="outlined"
                color="primary"
                onClick={() => this.setState((prevState: IStageState) => ({ toggeled: !prevState.toggeled }))}
              >
                {this.state.toggeled ? "Open" : "Close"}
              </Button>
            </div>
            {!this.state.toggeled ? (
              <div className="stage__content">
                {steps
                  ? steps.map((step, i) => (
                      <Step
                        timeHandleChange={this.timeHandleChange}
                        stageId={id}
                        moveStep={this.moveStep}
                        key={step.id}
                        id={step.id}
                        index={i}
                        name={step.name}
                      />
                    ))
                  : null}
                {!this.state.newStepFormToggled ? (
                  <CreateStepForm
                    createStep={this.createStep}
                    toggle={() => this.setState({ newStepFormToggled: true })}
                  />
                ) : null}
                <Button
                  className={this.props.classes!.createStepButton}
                  onClick={() => this.setState({ newStepFormToggled: false })}
                  variant="outlined"
                  color="primary"
                >
                  Create Step
                </Button>
              </div>
            ) : null}
          </Paper>
        </div>
      )
    );
  }
  private timeHandleChange = (time: number, stageIndex: number) => {
    this.setState((prevState: IStageState) => {
      const newTime = prevState.time + time;

      const jsonData = localStorage.getItem("constructor");
      let newData;
      if (jsonData) {
        newData = JSON.parse(jsonData);
        newData.stages[stageIndex].time = newTime;
        localStorage.setItem("constructor", JSON.stringify(newData));
      }

      return { time: newTime };
    });
  };
  private createStep = (name: string) => {
    const newSteps = [...this.state.steps];
    const id = nanoid(8);
    newSteps.push({ name, id, elements: [] });

    const jsonData = localStorage.getItem("constructor");
    let newData;
    if (jsonData) {
      newData = JSON.parse(jsonData);
      const index = newData.stages.findIndex((stage: IStage) => stage.id === this.props.id);
      newData.stages[index].steps.push({ name, id, elements: [] });
      localStorage.setItem("constructor", JSON.stringify(newData));
    }

    this.setState({ steps: newSteps });
  };
  private moveStep = (dragIndex: number, hoverIndex: number) => {
    const { steps } = this.state;
    const dragStep = steps[dragIndex];

    const newData = [...steps];
    newData.splice(dragIndex, 1);
    newData.splice(hoverIndex, 0, dragStep);

    const jsonData = localStorage.getItem("constructor");
    let newConstructorData;
    if (jsonData) {
      newConstructorData = JSON.parse(jsonData);
      const index = newConstructorData.stages.findIndex((stage: IStage) => stage.id === this.props.id);
      newConstructorData.stages[index].steps = newData;
      localStorage.setItem("constructor", JSON.stringify(newConstructorData));
    }

    this.setState({ steps: newData });
  };
}
const cardSource = {
  beginDrag(props: IStageProps) {
    return {
      id: props.id,
      index: props.index
    };
  }
};
const stageTarget = {
  hover(props: IStageProps, monitor: DropTargetMonitor, component: Stage | null) {
    if (!component) {
      return null;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }
    props.moveStage(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
    return;
  }
};
export default DropTarget<IStageProps, IStageTargetCollectedProps>(
  "stage",
  stageTarget,
  (connect: DropTargetConnector) => ({
    connectDropTarget: connect.dropTarget()
  })
)(
  DragSource<IStageProps, IStageSourceCollectedProps>(
    "stage",
    cardSource,
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    })
  )(withStyles(styles)(Stage))
);
