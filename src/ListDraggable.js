import React from "react";
import { Draggable } from "react-beautiful-dnd";

class ListDraggable extends React.Component {
    getIfVisible() {}
    render() {
        return (
            <Draggable draggableId={this.props.list.id} index={this.props.index}>
                {(provided) => (
                    <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        style={{
                            ...provided.draggableProps.style,
                            display: this.getIfVisible(),
                        }}
                    >
                        {this.props.list.title}
                    </div>
                )}
            </Draggable>
        );
    }
}

export default ListDraggable;
