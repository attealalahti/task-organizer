import React from "react";
import axios from "axios";

class Tag extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editing: false };
        this.editingText = this.props.name;
    }
    startEdit = () => {
        this.setState({ editing: true });
    };
    componentDidUpdate() {
        if (this.state.editing) {
            const element = document.getElementById(`tagEdit${this.props.id}`);
            element.value = this.props.name;
            element.focus();
            element.addEventListener("blur", (event) => {
                this.setState({ editing: false });
            });
        }
    }
    getContentElement() {
        if (this.state.editing) {
            return (
                <form className="EditTag" onSubmit={this.handleSubmit}>
                    <input
                        id={`tagEdit${this.props.id}`}
                        onChange={this.handleChange}
                        autoComplete="off"
                    />
                </form>
            );
        } else {
            return <span>{this.props.name}</span>;
        }
    }
    handleSubmit = async (event) => {
        event.preventDefault();
        // Don't do anything if the input only has white space
        if (this.editingText.replace(/\s/g, "").length) {
            // Set the content of the non-editing mode element and exit editing mode
            this.setState({ editing: false });
            this.props.onEdit(this.props.id, this.editingText);
            await axios.patch(`http://localhost:3010/tags/${this.props.id}`, {
                name: this.editingText,
            });
        }
    };
    handleChange = (event) => {
        this.editingText = event.target.value;
    };
    render() {
        return (
            <div className="Tag">
                <form className="Check">
                    <input type="checkbox" />
                </form>
                {this.getContentElement()}
                <div className="Buttons">
                    <button className="TagEdit" onClick={this.startEdit}>
                        Edit
                    </button>
                    <button
                        className="TagDelete"
                        onClick={() => this.props.onDelete(this.props.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    }
}
export default Tag;
