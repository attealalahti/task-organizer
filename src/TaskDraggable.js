import React from "react";
import { Draggable } from "react-beautiful-dnd";
import axios from "axios";
import TagReference from "./TagReference";
import EditableContent from "./EditableContent";

class TaskDraggable extends React.Component {
    state = { editing: false };
    handleTagSelectChange = async (event) => {
        if (
            event.target.value !== "default" &&
            !this.props.task.tagIds.find((id) => id === event.target.value)
        ) {
            const newTagIds = Array.from(this.props.task.tagIds);
            newTagIds.push(event.target.value);
            event.target.value = "default";
            await this.props.updateTagIds(this.props.task.id, newTagIds);
            await axios.patch(`http://localhost:3010/tasks/${this.props.task.id}`, {
                tagIds: newTagIds,
            });
        } else {
            event.target.value = "default";
        }
    };
    deleteTag = async (tagId) => {
        const newTagIds = this.props.task.tagIds.filter((id) => id !== tagId);
        await this.props.updateTagIds(this.props.task.id, newTagIds);
        await axios.patch(`http://localhost:3010/tasks/${this.props.task.id}`, {
            tagIds: newTagIds,
        });
    };
    getIfVisible = () => {
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
