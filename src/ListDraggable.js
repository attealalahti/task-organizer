import React from "react";
import { Draggable } from "react-beautiful-dnd";

class ListDraggable extends React.Component {
    render() {
        return (
            <Draggable draggableId={this.props.list.id} index={this.props.index}>
                {(provided) => (
                    <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        style={{ ...provided.draggableProps.style }}
                        className="ListDraggable"
                    >
                        <button className="Hide">Hide</button>
                        <button>Rename</button>
                        <span> {this.props.list.title}</span>
                        <button className="Delete">Delete</button>
                    </div>
                )}
            </Draggable>
        );
    }
}

export default ListDraggable;
