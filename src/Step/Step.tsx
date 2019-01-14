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
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { IData, IElement, IStage, IStep } from "src/interfacex";
import Element from "../Element/Element";
import CreateElementForm from "../Forms/CreateElementForm";
import "./Step.css";

interface IStepProps {
  timeHandleChange: (time: number, stageIndex: number) => void;
  stageId: string;
  name: string;
  id: string;
  index: number;
  moveStep: (dragIndex: number, hoverIndex: number) => void;
}

interface IStepState {
  time: number;
  elements: IElement[];
  newElementFormToggled: boolean;
}

interface IStepSourceCollectedProps {
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
}
interface IStepTargetCollectedProps {
  connectDropTarget: ConnectDropTarget;
}

class Step extends React.Component<IStepProps & IStepSourceCollectedProps & IStepTargetCollectedProps, IStepState> {
  public constructor(props: any) {
    super(props);

    const jsonData = localStorage.getItem("constructor");
    let data: IData;
    let elements: IElement[];
    let time;
    if (jsonData) {
      data = JSON.parse(jsonData);
    } else {
      data = { stages: [] };
    }
    const stageIndex = data.stages.findIndex((stage: IStage) => stage.id === this.props.stageId);
    const stepIndex = data.stages[stageIndex].steps.findIndex((step: IStep) => step.id === this.props.id);
    time = data.stages[stageIndex].steps[stepIndex] ? data.stages[stageIndex].steps[stepIndex].time : 0;
    elements = data.stages[stageIndex].steps[stepIndex] ? data.stages[stageIndex].steps[stepIndex].elements : [];
    if (time === undefined) {
      time = 0;
    }
    this.state = {
      elements,
      newElementFormToggled: true,
      time
    };
  }

  public render() {
    const { name, isDragging, connectDragSource, connectDropTarget } = this.props;
    const { elements, newElementFormToggled, time } = this.state;
    const opacity = isDragging ? 0 : 1;

    const hours = Math.floor(time / 60);
    const minutes = time % 60;

    return connectDragSource(
      connectDropTarget(
        <div style={{ opacity }} className="step">
          <div className="step__head">
            <div className="step__name">{name}</div>
            <div className="step__time">{`${hours === 0 ? "00" : hours}:${minutes === 0 ? "00" : minutes}`}</div>
          </div>
          <div className="step__content">
            {elements
              ? elements.map((element, i) => (
                  <Element
                    time={element.time}
                    index={i}
                    name={element.name}
                    id={element.id}
                    key={element.id}
                    assigned={element.assigned}
                    moveElement={this.moveElement}
                  />
                ))
              : null}
            {elements.length < 3 ? (
              <div className="element__wrapper">
                <Fab onClick={() => this.setState({ newElementFormToggled: false })}>
                  <AddIcon />
                </Fab>
              </div>
            ) : null}
            {!newElementFormToggled ? (
              <CreateElementForm
                createElement={this.createElement}
                toggle={() => {
                  this.setState({ newElementFormToggled: true });
                }}
              />
            ) : null}
          </div>
        </div>
      )
    );
  }
  private createElement = (name: string, assigned: string, time: number) => {
    const newElements = [...this.state.elements];
    newElements.push({ name, id: nanoid(8), assigned, time });

    const jsonData = localStorage.getItem("constructor");
    let newData: IData;
    if (jsonData) {
      newData = JSON.parse(jsonData);
      const stageIndex = newData.stages.findIndex((stage: IStage) => stage.id === this.props.stageId);
      const stepIndex = newData.stages[stageIndex].steps.findIndex((step: IStep) => step.id === this.props.id);
      console.log(newData.stages[stageIndex]);

      newData.stages[stageIndex].steps[stepIndex].elements = newElements; // не представляю, что ему тут может не нравиться, очень странно
      newData.stages[stageIndex].steps[stepIndex].time = this.state.time + time;

      this.props.timeHandleChange(time, stageIndex);

      localStorage.setItem("constructor", JSON.stringify(newData));
    }

    this.setState((prevState: IStepState) => {
      const newTime = prevState.time + time;
      return { time: newTime };
    });
    this.setState({ elements: newElements });
  };
  private moveElement = (dragIndex: number, hoverIndex: number) => {
    const { elements } = this.state;
    const dragStep = elements[dragIndex];

    const newData = [...elements];
    newData.splice(dragIndex, 1);
    newData.splice(hoverIndex, 0, dragStep);

    const jsonData = localStorage.getItem("constructor");
    let newConstructorData;
    if (jsonData) {
      newConstructorData = JSON.parse(jsonData);
      const stageIndex = newConstructorData.stages.findIndex((stage: IStage) => stage.id === this.props.stageId);
      const stepIndex = newConstructorData.stages[stageIndex].steps.findIndex(
        (step: IStep) => step.id === this.props.id
      );
      newConstructorData.stages[stageIndex].steps[stepIndex].elements = newData;

      localStorage.setItem("constructor", JSON.stringify(newConstructorData));
    }

    this.setState({ elements: newData });
  };
}
const cardSource = {
  beginDrag(props: IStepProps) {
    return {
      id: props.id,
      index: props.index
    };
  }
};
const stageTarget = {
  hover(props: IStepProps, monitor: DropTargetMonitor, component: Step | null) {
    if (!component) {
      return null;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }
    props.moveStep(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
    return;
  }
};
export default DropTarget<IStepProps, IStepTargetCollectedProps>(
  "step",
  stageTarget,
  (connect: DropTargetConnector) => ({
    connectDropTarget: connect.dropTarget()
  })
)(
  DragSource<IStepProps, IStepSourceCollectedProps>(
    "step",
    cardSource,
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    })
  )(Step)
);
