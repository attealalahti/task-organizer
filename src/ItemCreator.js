import React from "react";
import HasOnlyWhiteSpace from "./HasOnlyWhiteSpace";

// A form with a text input and a submit button that sends input text to parent component
class ItemCreator extends React.Component {
    // Variable that stores the current string in the text input
    inputText = "";
    render() {
        return (
            <div className="CreateItem">
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        // Don't do anything if the input only has white space
                        if (!HasOnlyWhiteSpace(this.inputText)) {
                            // Clear the text input
                            document.getElementById(this.props.id).value = "";
                            // Send input text to parent and reset it
                            this.props.onSubmit(this.inputText);
                            this.inputText = "";
                        }
                    }}
                >
                    <input
                        className="TextInput"
                        placeholder={this.props.placeholder}
                        autoComplete="off"
                        id={this.props.id}
                        // Updates variable to the current text in the text input
                        onChange={(event) => (this.inputText = event.target.value)}
                    />
                    <input type="submit" value="Add" />
                </form>
            </div>
        );
    }
}

export default ItemCreator;
