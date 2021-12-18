import React from "react";
import { Draggable } from "react-beautiful-dnd";
import TagReference from "./TagReference";
import EditableContent from "./EditableContent";

class TaskDraggable extends React.Component {
    state = { editing: false };
    // Handles selecting a tag from the Add tag list
    handleTagSelectChange = async (event) => {
        // If chosen option wasn't "Add tag" and this task doesn't already have the chosen tag
        if (
            event.target.value !== "default" &&
            !this.props.task.tagIds.find((id) => id === event.target.value)
        ) {
            // Create new tag ids array with selected tag added
            const newTagIds = [...this.props.task.tagIds, event.target.value];
            // Reset selector element
            event.target.value = "default";
            // Send new tag ids array to parent for updating tasks
            await this.props.updateTagIds(this.props.task.id, newTagIds);
        } else {
            // Reset selector element
            event.target.value = "default";
        }
    };
    // Called by TagReference when its X button is clicked
    deleteTag = async (tagId) => {
        // Create new tag ids array without the deleted tag
        const newTagIds = this.props.task.tagIds.filter((id) => id !== tagId);
        // Send new tag ids array to parent for updating tasks
        await this.props.updateTagIds(this.props.task.id, newTagIds);
    };
    getIfVisible = () => {
        // If some tags are selected but none of the tag ids on this task match with
        // any of the selected tag ids
        // OR
        // search field has text but this task does not include that text as a substring in its content
        if (
            (this.props.selectedTags.length !== 0 &&
                !this.props.selectedTags.find((selectedTagId) =>
                    this.props.task.tagIds.find((myTagId) => myTagId === selectedTagId)
                )) ||
            (this.props.searchText !== "" &&
                !this.props.task.content
                    .toLowerCase()
                    .includes(this.props.searchText.toLowerCase()))
        ) {
            // Return display style that hides the element
            return "none";
        }
    };
    render() {
        return (
            <Draggable draggableId={this.props.task.id} index={this.props.index}>
                {(provided) => (
                    <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="Task"
                        style={{
                            ...provided.draggableProps.style,
                            display: this.getIfVisible(),
                        }}
                    >
                        <div className="GridContainer">
                            <div>
                                <button
                                    className="Edit"
                                    onClick={() => this.setState({ editing: true })}
                                >
                                    Edit
                                </button>
                            </div>
                            <EditableContent
                                editing={this.state.editing}
                                stopEditing={() => this.setState({ editing: false })}
                                class="EditTask"
                                content={this.props.task.content}
                                id={this.props.task.id}
                                objectToEdit={this.props.task}
                                onEdit={this.props.onEdit}
                            />
                            <div>
                                <button
                                    className="Delete"
                                    onClick={() =>
                                        this.props.onDelete(this.props.task.id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className="TagArea">
                            <form>
                                <select
                                    className="AddTag"
                                    onChange={this.handleTagSelectChange}
                                >
                                    <option value="default">Add tag</option>
                                    {this.props.allTags.map((tag) => {
                                        return (
                                            <option key={tag.id} value={tag.id}>
                                                {tag.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </form>
                            <div className="TaskTags">
                                {this.props.task.tagIds.map((id) => {
                                    // Find each tag based on it id
                                    const tag = this.props.allTags.find(
                                        (currentTag) => currentTag.id === id
                                    );
                                    return (
                                        <TagReference
                                            key={id}
                                            id={id}
                                            tag={tag}
                                            taskId={this.props.id}
                                            onDelete={this.deleteTag}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </Draggable>
        );
    }
}
export default TaskDraggable;
