import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = { newTaskField: "" };
    }
    handleSubmit = (event) => {
        event.preventDefault();
        // Don't do anything if the input only has white space
        if (this.state.newTaskField.replace(/\s/g, "").length) {
            // Create new task and clear the input field
            this.props.onTaskCreate(this.state.newTaskField, this.props.list);
            document.getElementById(`newTaskInput${this.props.list.id}`).value = "";
            this.setState({ newTaskField: "" });
        }
    };
    handleChange = (event) => {
        this.setState({ newTaskField: event.target.value });
    };
    getIfVisible = () => {
        // If some tags are selected but none of the selected tag ids match with
        // any of tag ids in any of the tasks on this list
        if (
            this.props.selectedTags.length !== 0 &&
            !this.props.selectedTags.find((selectedTagId) =>
                this.props.tasks.find((task) =>
                    task.tagIds.find((tagId) => tagId === selectedTagId)
                )
            )
        ) {
            return { display: "none" };
        }
    };
    render() {
        return (
            <div style={this.getIfVisible()}>
                <div className="List">
                    <h2>{this.props.list.title}</h2>
                    <Droppable droppableId={this.props.list.id}>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {this.props.tasks.map((task, index) => (
                                    <Task
                                        key={task.id}
                                        task={task}
                                        allTags={this.props.allTags}
                                        index={index}
                                        onDelete={this.props.onTaskDelete}
                                        updateTagIds={this.props.updateTagIds}
                                        selectedTags={this.props.selectedTags}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <form
                        className="NewTask"
                        onSubmit={this.handleSubmit}
                        style={this.props.getIfNewTaskFieldVisible()}
                    >
                        <input
                            type="text"
                            id={`newTaskInput${this.props.list.id}`}
                            placeholder="New task..."
                            autoComplete="off"
                            className="Text"
                            onChange={this.handleChange}
                        />
                        <input type="submit" value="Add" className="Submit" />
                    </form>
                </div>
            </div>
        );
    }
}
export default List;
