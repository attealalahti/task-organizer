import axios from "axios";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import EditableContent from "./EditableContent";

// List that can be dragged and dropped on the manage lists page.
class ListDraggable extends React.Component {
    state = {
        editing: false,
        title: this.props.list.title,
        hidden: this.props.list.hidden,
    };
    // Toggles whether list is hidden or not
    toggleHide = async () => {
        const newHidden = !this.state.hidden;
        this.setState({ hidden: newHidden });
        await axios.patch(`http://localhost:3010/lists/${this.props.list.id}`, {
            hidden: newHidden,
        });
    };
    // Called by the EditableContent component to update the list's title when it is edited
    editList = async (list, newTitle) => {
        this.setState({ title: newTitle });
        await axios.patch(`http://localhost:3010/lists/${list.id}`, { title: newTitle });
    };
    // Returns a color that is used to style the list's background
    getBackgroundColor(hidden) {
        if (hidden) {
            // Gray if hidden
            return "rgb(30, 30, 30)";
        } else {
            // Black if not hidden
            return "black";
        }
    }
    // Returns text for the button that toggles hiding
    // If list is already hidden, button says "Unhide"
    getHideButtonText(hidden) {
        if (hidden) {
            return "Unhide";
        } else {
            return "Hide";
        }
    }
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
                            backgroundColor: this.getBackgroundColor(this.state.hidden),
                        }}
                        className="ListDraggable"
                    >
                        <button className="Hide" onClick={this.toggleHide}>
                            {this.getHideButtonText(this.state.hidden)}
                        </button>
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
