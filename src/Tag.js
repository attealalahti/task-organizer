import React from "react";
import EditableContent from "./EditableContent";

// Tag that filters out tasks that do not have it when checking its checkbox
class Tag extends React.Component {
    state = { editing: false };
    render() {
        return (
            <div className="Tag">
                <form className="Check">
                    <input
                        type="checkbox"
                        onChange={(event) =>
                            this.props.onCheckBoxChange(event, this.props.tag.id)
                        }
                        checked={this.props.checked}
                    />
                </form>
                <EditableContent
                    editing={this.state.editing}
                    stopEditing={() => this.setState({ editing: false })}
                    class="EditTag"
                    content={this.props.tag.name}
                    id={this.props.tag.id}
                    objectToEdit={this.props.tag}
                    onEdit={this.props.onEdit}
                />
                <div className="Buttons">
                    <button
                        className="TagEdit"
                        onClick={() => this.setState({ editing: true })}
                    >
                        Edit
                    </button>
                    <button
                        className="TagDelete"
                        onClick={() => this.props.onDelete(this.props.tag.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    }
}
export default Tag;
