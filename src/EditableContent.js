import React from "react";

class EditableContent extends React.Component {
    editingText = this.props.content;
    componentDidUpdate() {
        if (this.props.editing) {
            this.editingText = this.props.content;
            const element = document.getElementById(this.props.class + this.props.id);
            element.value = this.props.content;
            element.focus();
            element.addEventListener("blur", (event) => {
                this.props.stopEditing();
                this.editingText = this.props.content;
            });
        }
    }
    handleSubmit = async (event) => {
        event.preventDefault();
        // Don't do anything if the input only has white space
        if (this.editingText.replace(/\s/g, "").length) {
            this.props.stopEditing();
            this.props.onEdit(this.props.objectToEdit, this.editingText);
        }
    };
    handleChange = (event) => {
        this.editingText = event.target.value;
    };
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
