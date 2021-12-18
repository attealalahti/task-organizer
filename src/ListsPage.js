import axios from "axios";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ItemCreator from "./ItemCreator";
import ListDraggable from "./ListDraggable";

// The "Manage lists" page
class ListsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            lists: [],
            listOrder: [],
            nextId: NaN,
        };
    }
    async componentDidMount() {
        // Set which page is open so hamburger menu knows which page name to show at the top
        this.props.setOpenPage("lists");
        // Try to get data from the database
        try {
            let lists = (await axios.get("http://localhost:3010/lists")).data;
            let listOrder = (await axios.get("http://localhost:3010/listOrder")).data;
            let autoIncrement = (await axios.get("http://localhost:3010/autoIncrement"))
                .data;
            this.setState({
                loading: false,
                lists: lists,
                listOrder: listOrder.order,
                nextId: autoIncrement.next,
            });
        } catch (error) {
            // Set state to show error message
            this.setState({ loading: false, error: true });
        }
    }
    // Creates a new list and adds it to the relevant arrays when one is submitted
    handleNewListSubmit = async (newListTitle) => {
        const newList = {
            id: this.state.nextId.toString(),
            title: newListTitle,
            taskIds: [],
            hidden: false,
        };
        const newListOrder = [...this.state.listOrder, newList.id];
        const newLists = [...this.state.lists, newList];
        this.setState({
            nextId: this.state.nextId + 1,
            lists: newLists,
            listOrder: newListOrder,
        });
        await axios.post("http://localhost:3010/lists", newList);
        await axios.patch("http://localhost:3010/listOrder", { order: newListOrder });
        await axios.patch("http://localhost:3010/autoIncrement", {
            next: this.state.nextId,
        });
    };
    // Happens when a draggable list has been dropped
    onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        // Return early if list didn't change place
        if (!destination) {
            return;
        }
        if (destination.index === source.index) {
            return;
        }
        // Remove the list from its previous index in the array and add it back to its current position
        const newListOrder = Array.from(this.state.listOrder);
        newListOrder.splice(source.index, 1);
        newListOrder.splice(destination.index, 0, draggableId);
        this.setState({ listOrder: newListOrder });
        await axios.patch("http://localhost:3010/listOrder", { order: newListOrder });
    };
    // Deletes a list when a delete button is clicked
    // The delete button calls this function with a list to delete
    deleteList = async (list) => {
        // Create a copy of the list order without the deleted list's id
        // No need to delete the list itself from the state
        const newListOrder = this.state.listOrder.filter((listId) => listId !== list.id);
        this.setState({ listOrder: newListOrder });
        // Delete task from the database and update list order
        await axios.patch("http://localhost:3010/listOrder", { order: newListOrder });
        await axios.delete(`http://localhost:3010/lists/${list.id}`);
        // Delete all tasks on the deleted list
        for (let taskId of list.taskIds) {
            await axios.delete(`http://localhost:3010/tasks/${taskId}`);
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
                    <ItemCreator
                        onSubmit={this.handleNewListSubmit}
                        id="newListInput"
                        placeholder="New list..."
                    />
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="lists">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="ListDraggableContainer"
                                >
                                    {this.state.listOrder.map((listId, index) => (
                                        <ListDraggable
                                            key={listId}
                                            index={index}
                                            list={this.state.lists.find(
                                                (list) => list.id === listId
                                            )}
                                            onDelete={this.deleteList}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            );
        }
    }
}

export default ListsPage;
