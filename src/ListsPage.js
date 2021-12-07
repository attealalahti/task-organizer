import axios from "axios";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ListDraggable from "./ListDraggable";

class ListsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, lists: [] };
    }
    async componentDidMount() {
        let lists = (await axios.get("http://localhost:3010/lists")).data;
        this.setState({ loading: false, lists: lists });
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
                                    {this.state.lists.map((list, index) => (
                                        <ListDraggable
                                            key={list.id}
                                            index={index}
                                            list={list}
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
