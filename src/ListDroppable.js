import React from "react";
import { Droppable } from "react-beautiful-dnd";
import HasOnlyWhiteSpace from "./HasOnlyWhiteSpace";
import TaskDraggable from "./TaskDraggable";

// A list of draggable tasks
class ListDroppable extends React.Component {
    // Variable that stores the current string in the text input
    newTaskText = "";
    // Handle submit event of the New Task text input
    handleSubmit = (event) => {
        event.preventDefault();
        // Don't do anything if the input only has white space
        if (!HasOnlyWhiteSpace(this.newTaskText)) {
            // Send text from the input to parent component for it to create a new task
            this.props.onTaskCreate(this.newTaskText, this.props.list);
            // Clear the text input
            document.getElementById(`newTaskInput${this.props.list.id}`).value = "";
            // Reset variable
            this.newTaskText = "";
        }
    };
    // Updates variable to the current text in the text input
    handleChange = (event) => {
        this.newTaskText = event.target.value;
    };
    getIfVisible = () => {
        // If some tags are selected but none of the selected tag ids match with
        // any of tag ids in any of the tasks on this list
        // OR
        // search field has text but none of the tasks on this list
        // include that text as a substring in their content
        // OR
        // the list has been hidden on the manage lists page.
        if (
            (this.props.selectedTags.length !== 0 &&
                !this.props.selectedTags.find((selectedTagId) =>
                    this.props.tasks.find((task) =>
                        task.tagIds.find((tagId) => tagId === selectedTagId)
                    )
                )) ||
            (this.props.searchText !== "" &&
                !this.props.tasks.find((task) =>
                    task.content
                        .toLowerCase()
                        .includes(this.props.searchText.toLowerCase())
                )) ||
            this.props.list.hidden
        ) {
            // Return style object that hides the element
            return { display: "none" };
        }
    };
    render() {
        return (
            <div style={this.getIfVisible()}>
                <div className="List">
                    <div className="Header">
                        <button
                            onClick={() => this.props.onSortByLastEdit(this.props.list)}
                        >
                            Sort by last edit
                        </button>
                        <h2>{this.props.list.title}</h2>
                    </div>
                    <Droppable droppableId={this.props.list.id}>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {this.props.tasks.map((task, index) => (
                                    <TaskDraggable
                                        key={task.id}
                                        task={task}
                                        allTags={this.props.allTags}
                                        index={index}
                                        onDelete={this.props.onTaskDelete}
                                        updateTagIds={this.props.updateTagIds}
                                        selectedTags={this.props.selectedTags}
                                        searchText={this.props.searchText}
                                        onEdit={this.props.onTaskEdit}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <form
                        className="NewTaskForm"
                        onSubmit={this.handleSubmit}
                        style={this.props.getIfNewTaskFieldVisible()}
                    >
                        <input
                            type="text"
                            id={`newTaskInput${this.props.list.id}`}
                            placeholder="New task..."
                            autoComplete="off"
                            className="NewTaskInput"
                            onChange={this.handleChange}
                        />
                        <input type="submit" value="Add" className="NewTaskSubmit" />
                    </form>
                </div>
            </div>
        );
    }
}
export default ListDroppable;
