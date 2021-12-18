import React from "react";
import HasOnlyWhiteSpace from "./HasOnlyWhiteSpace";

// A component that can be switched between a span and a text input
// Sends submitted text from the text input to the parent component that can then update this component's content props
class EditableContent extends React.Component {
    // Variable that stores the current string in the text input
    editingText = this.props.content;
    componentDidUpdate() {
        // If editing mode is triggered,
        if (this.props.editing) {
            this.editingText = this.props.content;
            // get the text input element
            const textInput = document.getElementById(this.props.class + this.props.id);
            // and set its current text to the content of this component
            textInput.value = this.props.content;
            // Focus the text input
            textInput.focus();
            // When text input loses focus, exit editing mode
            textInput.addEventListener("blur", (event) => {
                this.props.stopEditing();
                this.editingText = this.props.content;
            });
        }
    }
    // Exits editing mode and sends the submitted text from the text input to parent component
    handleSubmit = async (event) => {
        event.preventDefault();
        // Don't do anything if the input only has white space
        if (!HasOnlyWhiteSpace(this.editingText)) {
            this.props.stopEditing();
            this.props.onEdit(this.props.objectToEdit, this.editingText);
        }
    };
    // Updates variable to the current text in the text input
    handleChange = (event) => {
        this.editingText = event.target.value;
    };
    // If in editing mode, show a text input, if not, show a span
    render() {
        if (this.props.editing) {
            return (
                <form onSubmit={this.handleSubmit}>
                    <input
                        className={this.props.class}
                        id={this.props.class + this.props.id}
                        onChange={this.handleChange}
                        autoComplete="off"
                    />
                </form>
            );
        } else {
            return <span>{this.props.content}</span>;
        }
    }
}

export default EditableContent;
