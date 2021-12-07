import axios from "axios";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
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
            listOrder: listOrder,
            nextId: autoIncrement.next,
        });
    }
    onDragEnd = async (result) => {
        console.log(result);
    };
    render() {
        if (this.state.loading) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="lists">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {this.state.listOrder.map((listId, index) => (
                                        <ListDraggable
                                            key={listId}
                                            index={index}
                                            list={this.state.lists.find(
                                                (list) => list.id === listId
                                            )}
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
