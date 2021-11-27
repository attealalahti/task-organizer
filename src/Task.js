import React from "react";
import { Draggable } from "react-beautiful-dnd";
import axios from "axios";
import TagReference from "./TagReference";

class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            content: this.props.task.content,
        };
        this.editingText = this.state.content;
    }
    startEdit = () => {
        this.setState({ editing: true });
    };
    componentDidUpdate() {
        if (this.state.editing) {
            const element = document.getElementById(`taskEdit${this.props.task.id}`);
            element.value = this.state.content;
            element.focus();
            element.addEventListener("blur", (event) => {
                this.setState({ editing: false });
            });
        }
    }
    getContentElement() {
        if (this.state.editing) {
            return (
                <form className="EditTask" onSubmit={this.handleEditSubmit}>
                    <input
                        id={`taskEdit${this.props.task.id}`}
                        onChange={this.handleEditChange}
                        autoComplete="off"
                    />
                </form>
            );
        } else {
            return <span>{this.state.content}</span>;
        }
    }
    handleEditSubmit = async (event) => {
        event.preventDefault();
        // Don't do anything if the input only has white space
        if (this.editingText.replace(/\s/g, "").length) {
            // Set the content of the non-editing mode element and exit editing mode
            this.setState({ content: this.editingText, editing: false });
            await axios.patch(`http://localhost:3010/tasks/${this.props.task.id}`, {
                content: this.editingText,
            });
        }
    };
    handleEditChange = (event) => {
        this.editingText = event.target.value;
    };
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
    render() {
        return (
            <Draggable draggableId={this.props.task.id} index={this.props.index}>
                {(provided) => (
                    <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="Task"
                        style={{ ...provided.draggableProps.style }}
                    >
                        <div id={this.props.task.id + "grid"} className="GridContainer">
                            <div>
                                <button className="Edit" onClick={this.startEdit}>
                                    Edit
                                </button>
                            </div>
                            {this.getContentElement()}
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
                        <div>
                            <form>
                                <select
                                    className="AddTag"
                                    onChange={this.handleTagSelectChange}
                                >
                                    <option value="default">Add Tag</option>
                                    {this.props.allTags.map((tag) => {
                                        return (
                                            <option key={tag.id} value={tag.id}>
                                                {tag.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </form>
                            <div className="TagArea">
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
export default Task;
