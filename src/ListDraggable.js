import axios from "axios";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import EditableContent from "./EditableContent";

class ListDraggable extends React.Component {
    state = { editing: false, title: this.props.list.title };
    editList = async (list, newTitle) => {
        this.setState({ title: newTitle });
        await axios.patch(`http://localhost:3010/lists/${list.id}`, { title: newTitle });
    };
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
                            class="EditList"
                            content={this.state.title}
                            id={this.props.list.id}
                            objectToEdit={this.props.list}
                            onEdit={this.editList}
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
