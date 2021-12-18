import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ListDroppable from "./ListDroppable";
import Tag from "./Tag";
import axios from "axios";
import ItemCreator from "./ItemCreator";

// The "Manage tasks" page
class TasksPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            tasks: [],
            lists: [],
            listOrder: [],
            tags: [],
            selectedTags: [],
            nextId: NaN,
            searchText: "",
            optionsStyle: {},
            optionButtonText: "See options",
        };
    }
    async componentDidMount() {
        // Set which page is open so hamburger menu knows which page name to show at the top
        this.props.setOpenPage("tasks");
        // Try to get data from the database
        try {
            let tasks = (await axios.get("http://localhost:3010/tasks")).data;
            let lists = (await axios.get("http://localhost:3010/lists")).data;
            let listOrder = (await axios.get("http://localhost:3010/listOrder")).data;
            let tags = (await axios.get("http://localhost:3010/tags")).data;
            let autoIncrement = (await axios.get("http://localhost:3010/autoIncrement"))
                .data;
            this.setState({
                loading: false,
                tasks: tasks,
                lists: lists,
                listOrder: listOrder.order,
                tags: tags,
                nextId: autoIncrement.next,
            });
        } catch (error) {
            // Set state to show error message
            this.setState({ loading: false, error: true });
        }
    }

    createTask = async (content, list) => {
        const newTask = {
            id: this.state.nextId.toString(),
            content: content,
            tagIds: [],
            lastEdit: Date.now(),
        };
        // Make a copy of the tasks array with the new task added
        const newTasks = [...this.state.tasks, newTask];
        // Add the id of the new task to its list's task id array
        const newTaskIds = [...list.taskIds, newTask.id];
        this.updateList(list, newTaskIds);

        // Update state with new task info and increment next id
        this.setState({ tasks: newTasks, nextId: this.state.nextId + 1 });
        await axios.post("http://localhost:3010/tasks", newTask);
        await axios.patch(`http://localhost:3010/lists/${list.id}`, {
            taskIds: newTaskIds,
        });
        await axios.patch("http://localhost:3010/autoIncrement", {
            next: this.state.nextId,
        });
    };
    // Deletes a task when a delete button is clicked
    // The delete button calls this function with a taskId to delete
    deleteTask = async (taskId) => {
        const list = this.getList(taskId);
        // Create a copy of the task's list without the task's id
        // No need to delete the task itself from the state
        const newTaskIds = list.taskIds.filter((id) => id !== taskId);
        this.updateList(list, newTaskIds);
        // Delete task from the database and update list with new task ids
        await axios.delete(`http://localhost:3010/tasks/${taskId}`);
        await axios.patch(`http://localhost:3010/lists/${list.id}`, {
            taskIds: newTaskIds,
        });
    };
    // Get list based on the id of a task in it
    getList(taskId) {
        for (let list of this.state.lists) {
            for (let id of list.taskIds) {
                if (id === taskId) {
                    return list;
                }
            }
        }
    }
    // Happens when a draggable task has been dropped
    onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        // Return early task if didn't change place
        if (!destination) {
            return;
        }
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }
        const sourceList = this.state.lists.find(
            (list) => list.id === source.droppableId
        );
        // Create copy of the task id array of the source list
        const newSourceTaskIds = Array.from(sourceList.taskIds);
        if (source.droppableId === destination.droppableId) {
            // If the task didn't move to a new list,
            // remove it's id from the array and add it back in the new position
            newSourceTaskIds.splice(source.index, 1);
            newSourceTaskIds.splice(destination.index, 0, draggableId);
            this.updateList(sourceList, newSourceTaskIds);
        } else {
            // If the task did move to a new list
            // Find the list it moved to
            const destinationList = this.state.lists.find(
                (list) => list.id === destination.droppableId
            );
            const newDestinationTaskIds = Array.from(destinationList.taskIds);
            // Remove task from it's previous index in the source list
            newSourceTaskIds.splice(source.index, 1);
            // Add the moved task to it's new index in the destination list
            newDestinationTaskIds.splice(destination.index, 0, draggableId);
            // Create updated source and destination lists based on their previous versions
            const newSourceList = {
                ...sourceList,
                taskIds: newSourceTaskIds,
            };
            const newDestinationList = {
                ...destinationList,
                taskIds: newDestinationTaskIds,
            };
            // Find the indexes of the lists in the lists array
            const sourceIndex = this.state.lists.findIndex(
                (list) => list.id === sourceList.id
            );
            const destinationIndex = this.state.lists.findIndex(
                (list) => list.id === destinationList.id
            );
            // Splice new lists at their correct indexes to a copy of the lists array
            const updatedLists = Array.from(this.state.lists);
            updatedLists.splice(sourceIndex, 1);
            updatedLists.splice(sourceIndex, 0, newSourceList);
            updatedLists.splice(destinationIndex, 1);
            updatedLists.splice(destinationIndex, 0, newDestinationList);
            this.setState({ lists: updatedLists });
            await axios.patch(`http://localhost:3010/lists/${destinationList.id}`, {
                taskIds: newDestinationTaskIds,
            });
        }
        await axios.patch(`http://localhost:3010/lists/${sourceList.id}`, {
            taskIds: newSourceTaskIds,
        });
    };
    updateList(oldList, newTaskIds) {
        // Create a new list with updated task ids.
        const newList = {
            ...oldList,
            taskIds: newTaskIds,
        };
        // Create copy of the lists array
        const updatedLists = Array.from(this.state.lists);
        // Find the index of the list we want to update in the lists array
        const index = this.state.lists.findIndex((list) => list.id === oldList.id);
        // Replace the list at the index with the updated list
        updatedLists.splice(index, 1);
        updatedLists.splice(index, 0, newList);
        this.setState({ lists: updatedLists });
    }
    updateTag = async (tag, newName) => {
        // Create copy of the tags array
        const newTags = Array.from(this.state.tags);
        // Find the index of the tag we want to update in the tags array
        const index = newTags.findIndex((listTag) => listTag.id === tag.id);
        // Set the new name for the tag at the index in the copied array
        newTags[index].name = newName;
        this.setState({ tags: newTags });
        await axios.patch(`http://localhost:3010/tags/${tag.id}`, {
            name: newName,
        });
    };
    // Delete a tag and remove the reference to it from all tasks that have it
    // A tag's delete button calls this function with the tag id.
    deleteTag = async (tagId) => {
        // Create copy of the tags array without the tag with the specified id
        const newTags = this.state.tags.filter((tag) => tag.id !== tagId);
        const newTasks = [];
        const tasksToPatch = [];
        this.state.tasks.forEach((task) => {
            // If task has the tag that will be deleted
            let index = task.tagIds.findIndex((id) => id === tagId);
            if (index !== -1) {
                // Create a copy of the tagIds array of the task without the id of the deleted tag
                let newTagIds = Array.from(task.tagIds);
                newTagIds.splice(index, 1);
                // Create a copy of the task with updated tag ids
                let newTask = { ...task, tagIds: newTagIds };
                // Push the new task to an array of tasks that will be patched in the database
                tasksToPatch.push(newTask);
                // Push the updated task or the old task to a new array of all tasks
                newTasks.push(newTask);
            } else {
                newTasks.push(task);
            }
        });
        this.setState({ tasks: newTasks, tags: newTags });
        for (let i = 0; i < tasksToPatch.length; i++) {
            await axios.patch(
                `http://localhost:3010/tasks/${tasksToPatch[i].id}`,
                tasksToPatch[i]
            );
        }
        await axios.delete(`http://localhost:3010/tags/${tagId}`);
    };
    updateTagIds = async (taskId, newTagIds) => {
        // Create copy of the tasks array
        const newTasks = Array.from(this.state.tasks);
        // Replace the tag ids of a specified task in the array
        const index = newTasks.findIndex((task) => task.id === taskId);
        newTasks[index].tagIds = newTagIds;
        this.setState({ tasks: newTasks });
        await axios.patch(`http://localhost:3010/tasks/${taskId}`, {
            tagIds: newTagIds,
        });
    };
    // Creates a new tag and adds it to the tags array when one is submitted
    handleNewTagSubmit = async (newTagText) => {
        const newTag = { id: this.state.nextId.toString(), name: newTagText };
        const newTags = [...this.state.tags, newTag];
        this.setState({ nextId: this.state.nextId + 1, tags: newTags });
        await axios.post("http://localhost:3010/tags", newTag);
        await axios.patch("http://localhost:3010/autoIncrement", {
            next: this.state.nextId,
        });
    };
    // Handles checking a tag checkbox
    handleTagCheckChange = (event, tagId) => {
        let newSelectedTags;
        if (tagId === "all") {
            // If checked tag was All, deselect all tags
            newSelectedTags = [];
        } else if (event.target.checked) {
            // If interacted with checkbox is now checked, add the tag to selected tags
            newSelectedTags = [...this.state.selectedTags, tagId];
        } else {
            // If interacted with checkbox is not checked, remove it from selected tags
            newSelectedTags = this.state.selectedTags.filter((id) => id !== tagId);
        }
        this.setState({ selectedTags: newSelectedTags });
    };

    // All tag is selected if no other tags are selected
    isAllTagSelected() {
        if (this.state.selectedTags.length === 0) {
            return true;
        } else {
            return false;
        }
    }
    // Returns a style object that hides the element if some tags are selected and/or the search bar has text
    // Used for hiding the new task input when all lists might not be visible
    getIfNewTaskFieldVisible = () => {
        if (!this.isAllTagSelected() || this.state.searchText !== "") {
            return { display: "none" };
        }
    };
    // Prevents default event when trying to submit a search.
    // The app filters out tasks not within search parameters automatically, no submitting necessary
    handleSearchSubmit(event) {
        event.preventDefault();
    }
    // Updates state with search bar text when it changes
    handleSearchChange = (event) => {
        this.setState({ searchText: event.target.value });
    };
    // Orders the task ids array of a list from largest lastEdit time to smallest lastEdit time
    sortListByLastEdit = async (list) => {
        const newTaskIds = Array.from(list.taskIds);
        newTaskIds.sort((a, b) => {
            // Find tasks with ids from task ids
            let taskA = this.state.tasks.find((task) => task.id === a);
            let taskB = this.state.tasks.find((task) => task.id === b);
            // Returns negative when taskA's lastEdit time was larger and sorts taskA ahead of taskB.
            return taskB.lastEdit - taskA.lastEdit;
        });
        this.updateList(list, newTaskIds);
        await axios.patch(`http://localhost:3010/lists/${list.id}`, {
            taskIds: newTaskIds,
        });
    };
    editTask = async (task, newContent) => {
        // Create new task based on the old one with new content and last edit time updated
        const newTask = { ...task, content: newContent, lastEdit: Date.now() };
        // Splice the new task at it's correct index to the tasks array
        const newTasks = Array.from(this.state.tasks);
        const index = newTasks.findIndex((t) => t.id === newTask.id);
        newTasks.splice(index, 1, newTask);
        this.setState({ tasks: newTasks });
        await axios.patch(`http://localhost:3010/tasks/${newTask.id}`, newTask);
    };
    toggleShowOptions = () => {
        // By default options have a style of display none
        // If options have a style to make them visible, remove it
        // If not, add the style
        // Also change button text appropriately
        if (this.state.optionsStyle.display === "block") {
            this.setState({ optionsStyle: {}, optionButtonText: "See options" });
        } else {
            this.setState({
                optionsStyle: { display: "block" },
                optionButtonText: "Hide options",
            });
        }
    };
    render() {
        if (this.state.loading) {
            return <p>Loading...</p>;
        } else if (this.state.error) {
            return (
                <p>
                    Error
                    <br />
                    Could not reach database.
                </p>
            );
        } else {
            return (
                <div>
                    <button className="OptionsButton" onClick={this.toggleShowOptions}>
                        {this.state.optionButtonText}
                    </button>
                    <div className="Options" style={this.state.optionsStyle}>
                        <div className="SearchAndNewTag">
                            <div className="Search">
                                <form onSubmit={this.handleSearchSubmit}>
                                    <input
                                        placeholder="Search tasks..."
                                        autoComplete="off"
                                        type="search"
                                        onChange={this.handleSearchChange}
                                    />
                                </form>
                            </div>
                            <ItemCreator
                                onSubmit={this.handleNewTagSubmit}
                                id="newTagInput"
                                placeholder="New tag..."
                            />
                        </div>
                        <div className="TagContainer">
                            <div className="Tag">
                                <form className="Check">
                                    <input
                                        type="checkbox"
                                        checked={this.isAllTagSelected()}
                                        onChange={(event) =>
                                            this.handleTagCheckChange(event, "all")
                                        }
                                    />
                                </form>
                                <span>All</span>
                            </div>
                            {this.state.tags.map((tag) => {
                                // Check the tag's checkbox if it has been selected
                                let checked = false;
                                if (
                                    this.state.selectedTags.find(
                                        (tagId) => tagId === tag.id
                                    )
                                ) {
                                    checked = true;
                                }
                                return (
                                    <Tag
                                        key={tag.id}
                                        tag={tag}
                                        onEdit={this.updateTag}
                                        onDelete={this.deleteTag}
                                        onCheckBoxChange={this.handleTagCheckChange}
                                        checked={checked}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className="ListContainer">
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            {this.state.listOrder.map((listId) => {
                                // Find the list object based on its id
                                const list = this.state.lists.find(
                                    (list) => list.id === listId
                                );
                                // Create an array of the list's task objects by finding each one from the tasks array based on it's id
                                const tasks = list.taskIds.map((taskId) =>
                                    this.state.tasks.find((task) => task.id === taskId)
                                );
                                return (
                                    <ListDroppable
                                        key={list.id}
                                        list={list}
                                        tasks={tasks}
                                        allTags={this.state.tags}
                                        onTaskDelete={this.deleteTask}
                                        onTaskCreate={this.createTask}
                                        updateTagIds={this.updateTagIds}
                                        getIfNewTaskFieldVisible={
                                            this.getIfNewTaskFieldVisible
                                        }
                                        selectedTags={this.state.selectedTags}
                                        searchText={this.state.searchText}
                                        onSortByLastEdit={this.sortListByLastEdit}
                                        onTaskEdit={this.editTask}
                                    />
                                );
                            })}
                        </DragDropContext>
                    </div>
                </div>
            );
        }
    }
}

export default TasksPage;
