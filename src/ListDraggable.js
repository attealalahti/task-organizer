import React from "react";
import { Draggable } from "react-beautiful-dnd";
import EditableContent from "./EditableContent";

class ListDraggable extends React.Component {
    state = { editing: false };
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
                        <button onClick={() => this.setState({ editing: true })}>
                            Rename
                        </button>
                        <EditableContent
                            editing={this.state.editing}
                            stopEditing={() => this.setState({ editing: false })}
                            class="EditTask"
                            content={this.props.list.title}
                            id={this.props.list.id}
                            objectToEdit={this.props.list}
                            onEdit={this.props.onEdit}
                        />
                        <button
                            className="Delete"
                            onClick={() => this.props.onDelete(this.props.list)}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </Draggable>
        );
    }
}

export default ListDraggable;
