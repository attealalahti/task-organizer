import axios from "axios";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ItemCreator from "./ItemCreator";
import ListDraggable from "./ListDraggable";

class ListsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, lists: [], listOrder: [], nextId: NaN };
    }
    async componentDidMount() {
        let lists = (await axios.get("http://localhost:3010/lists")).data;
        let listOrder = (await axios.get("http://localhost:3010/listOrder")).data;
        let autoIncrement = (await axios.get("http://localhost:3010/autoIncrement")).data;
        this.setState({
            loading: false,
            lists: lists,
            listOrder: listOrder.order,
            nextId: autoIncrement.next,
        });
    }
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
    onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        // Return early if didn't change place
        if (!destination) {
            return;
        }
        if (destination.index === source.index) {
            return;
        }
        const newListOrder = Array.from(this.state.listOrder);
        newListOrder.splice(source.index, 1);
        newListOrder.splice(destination.index, 0, draggableId);
        this.setState({ listOrder: newListOrder });
        await axios.patch("http://localhost:3010/listOrder", { order: newListOrder });
    };
    deleteList = async (list) => {
        const newListOrder = this.state.listOrder.filter((listId) => listId !== list.id);
        this.setState({ listOrder: newListOrder });
        await axios.patch("http://localhost:3010/listOrder", { order: newListOrder });
        await axios.delete(`http://localhost:3010/lists/${list.id}`);
        for (let taskId of list.taskIds) {
            await axios.delete(`http://localhost:3010/tasks/${taskId}`);
        }
    };
    render() {
        if (this.state.loading) {
            return <div>Loading...</div>;
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
