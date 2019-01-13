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

import { Fab, Paper } from "@material-ui/core";
import "./Element.css";

interface IElementProps {
  time: number;
  id: string;
  name: string;
  assigned: string;
  index: number;
  moveElement: (dragIndex: number, hoverIndex: number) => void;
}
interface IElementSourceCollectedProps {
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
}
interface IElementTargetCollectedProps {
  connectDropTarget: ConnectDropTarget;
}
interface IElementState {
  toggleTime: boolean;
}
class Element extends React.Component<
  IElementProps & IElementSourceCollectedProps & IElementTargetCollectedProps,
  IElementState
> {
  public constructor(props: any) {
    super(props);
    this.state = {
      toggleTime: true
    };
  }
  public render() {
    const { name, assigned, isDragging, connectDragSource, connectDropTarget, time } = this.props;
    const opacity = isDragging ? 0 : 1;

    const hours = Math.floor(time / 60);
    const minutes = time % 60;

    // ночь не спал, не в сидах довести валидацию везде до конца и вынести ее отдельной функцией

    return connectDragSource(
      connectDropTarget(
        <div className="element__wrapper">
          {!this.state.toggleTime ? (
            <div className="data-box">
              <Paper>
                <div className="element__time">{`${hours === 0 ? "00" : hours}:${minutes === 0 ? "00" : minutes}`}</div>
                <div className="element__name">{name}</div>
                <div className="element__assigned">{assigned}</div>
              </Paper>
            </div>
          ) : null}
          <Fab
            onClick={() => this.setState((prevState: IElementState) => ({ toggleTime: !prevState.toggleTime }))}
            style={{ opacity }}
            className="element"
          >
            To do
          </Fab>
        </div>
      )
    );
  }
}
const cardSource = {
  beginDrag(props: IElementProps) {
    return {
      id: props.id,
      index: props.index
    };
  }
};
const stageTarget = {
  hover(props: IElementProps, monitor: DropTargetMonitor, component: Element | null) {
    if (!component) {
      return null;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }
    props.moveElement(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
    return;
  }
};
export default DropTarget<IElementProps, IElementTargetCollectedProps>(
  "element",
  stageTarget,
  (connect: DropTargetConnector) => ({
    connectDropTarget: connect.dropTarget()
  })
)(
  DragSource<IElementProps, IElementSourceCollectedProps>(
    "element",
    cardSource,
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    })
  )(Element)
);
