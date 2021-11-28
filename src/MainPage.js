import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import List from "./List";
import Tag from "./Tag";
import axios from "axios";

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            tasks: [],
            lists: [],
            listOrder: [],
            tags: [],
            selectedTags: [],
            nextId: NaN,
        };
        this.newTagText = "";
    }
    componentDidMount() {
        this.getData();
    }
    async getData() {
        let tasks = (await axios.get("http://localhost:3010/tasks")).data;
        let lists = (await axios.get("http://localhost:3010/lists")).data;
        let listOrder = (await axios.get("http://localhost:3010/listOrder")).data;
        let tags = (await axios.get("http://localhost:3010/tags")).data;
        let autoIncrement = (await axios.get("http://localhost:3010/autoIncrement")).data;
        this.setState({
            loading: false,
            tasks: tasks,
            lists: lists,
            listOrder: listOrder,
            tags: tags,
            nextId: autoIncrement.next,
        });
    }
    createTask = async (content, list) => {
        const newTasks = Array.from(this.state.tasks);
        const newTask = {
            id: this.state.nextId.toString(),
            content: content,
            tagIds: [],
        };
        newTasks.push(newTask);
        const newTaskIds = Array.from(list.taskIds);
        newTaskIds.push(this.state.nextId.toString());
        this.updateList(list, newTaskIds);
        this.setState({ tasks: newTasks, nextId: this.state.nextId + 1 });
        await axios.post("http://localhost:3010/tasks", newTask);
        await axios.patch(`http://localhost:3010/lists/${list.id}`, {
            taskIds: newTaskIds,
        });
        await axios.patch("http://localhost:3010/autoIncrement", {
            next: this.state.nextId,
        });
    };
    deleteTask = async (taskId) => {
        // Do this with filter actually
        const list = this.getList(taskId);
        const newTaskIds = Array.from(list.taskIds);
        const index = newTaskIds.findIndex((id) => id === taskId);
        newTaskIds.splice(index, 1);
        this.updateList(list, newTaskIds);
        await axios.delete(`http://localhost:3010/tasks/${taskId}`);
        await axios.patch(`http://localhost:3010/lists/${list.id}`, {
            taskIds: newTaskIds,
        });
    };
    // Get list based on the id of a task in it
    getList(taskId) {
        for (let key in this.state.lists) {
            for (let id of this.state.lists[key].taskIds) {
                if (id === taskId) {
                    return this.state.lists[key];
                }
            }
        }
    }
    onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        // Return early if didn't change place
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
        const newSourceTaskIds = Array.from(sourceList.taskIds);
        if (source.droppableId === destination.droppableId) {
            newSourceTaskIds.splice(source.index, 1);
            newSourceTaskIds.splice(destination.index, 0, draggableId);
            this.updateList(sourceList, newSourceTaskIds);
        } else {
            const destinationList = this.state.lists.find(
                (list) => list.id === destination.droppableId
            );
            const newDestinationTaskIds = Array.from(destinationList.taskIds);
            // Remove task from it's previous index in the source list
            newSourceTaskIds.splice(source.index, 1);
            // Add the moved task to it's new index in the destination list
            newDestinationTaskIds.splice(destination.index, 0, draggableId);
            // Create new source and destination lists based on their previous versions
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
            // Splice new lists into their previous indexes into a copy of the lists array
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
        const newList = {
            ...oldList,
            taskIds: newTaskIds,
        };
        const updatedLists = Array.from(this.state.lists);
        const index = this.state.lists.findIndex((list) => list.id === oldList.id);
        updatedLists.splice(index, 1);
        updatedLists.splice(index, 0, newList);
        this.setState({ lists: updatedLists });
    }
    updateTag = (tagId, newName) => {
        const newTags = Array.from(this.state.tags);
        const index = newTags.findIndex((tag) => tag.id === tagId);
        newTags[index].name = newName;
        this.setState({ tags: newTags });
    };
    deleteTag = async (tagId) => {
        const newTags = this.state.tags.filter((tag) => tag.id !== tagId);
        const newTasks = [];
        const tasksToPatch = [];
        this.state.tasks.forEach((task) => {
            let index = task.tagIds.findIndex((id) => id === tagId);
            if (index !== -1) {
                let newTagIds = Array.from(task.tagIds);
                newTagIds.splice(index, 1);
                let newTask = { id: task.id, content: task.content, tagIds: newTagIds };
                newTasks.push(newTask);
                tasksToPatch.push(newTask);
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
        const newTasks = Array.from(this.state.tasks);
        const index = newTasks.findIndex((task) => task.id === taskId);
        newTasks[index].tagIds = newTagIds;
        this.setState({ tasks: newTasks });
        await axios.patch(`http://localhost:3010/tasks/${taskId}`, {
            tagIds: newTagIds,
        });
    };
    handleNewTagSubmit = async (event) => {
        event.preventDefault();
        // Don't do anything if the input only has white space
        if (this.newTagText.replace(/\s/g, "").length) {
            const newTag = { id: this.state.nextId.toString(), name: this.newTagText };
            const newTags = Array.from(this.state.tags);
            newTags.push(newTag);
            this.setState({ nextId: this.state.nextId + 1, tags: newTags });
            document.getElementById("newTagInput").value = "";
            await axios.post("http://localhost:3010/tags", newTag);
            await axios.patch("http://localhost:3010/autoIncrement", {
                next: this.state.nextId,
            });
        }
    };
    handleNewTagChange = (event) => {
        this.newTagText = event.target.value;
    };
    handleTagCheckChange = (event, tagId) => {
        let newSelectedTags;
        if (tagId === "all") {
            newSelectedTags = [];
        } else if (event.target.checked) {
            newSelectedTags = Array.from(this.state.selectedTags);
            newSelectedTags.push(tagId);
        } else {
            newSelectedTags = this.state.selectedTags.filter((id) => id !== tagId);
        }
        this.setState({ selectedTags: newSelectedTags });
    };
    isAllTagSelected() {
        if (this.state.selectedTags.length === 0) {
            return true;
        } else {
            return false;
        }
    }
    getIfNewTaskFieldVisible = () => {
        if (!this.isAllTagSelected()) {
            return { display: "none" };
        }
    };
    render() {
        if (this.state.loading) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <div className="CreateTag">
                        <form onSubmit={this.handleNewTagSubmit}>
                            <input
                                id="newTagInput"
                                placeholder="New tag..."
                                autoComplete="off"
                                onChange={this.handleNewTagChange}
                            />
                            <input type="submit" value="Add" />
                        </form>
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
                            let checked = false;
                            if (
                                this.state.selectedTags.find((tagId) => tagId === tag.id)
                            ) {
                                checked = true;
                            }
                            return (
                                <Tag
                                    key={tag.id}
                                    id={tag.id}
                                    name={tag.name}
                                    onEdit={this.updateTag}
                                    onDelete={this.deleteTag}
                                    onCheckBoxChange={this.handleTagCheckChange}
                                    checked={checked}
                                />
                            );
                        })}
                    </div>
                    <div className="ListContainer">
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            {this.state.listOrder.map((listId) => {
                                const list = this.state.lists.find(
                                    (list) => list.id === listId
                                );
                                const tasks = list.taskIds.map((taskId) =>
                                    this.state.tasks.find((task) => task.id === taskId)
                                );
                                return (
                                    <List
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

export default MainPage;
