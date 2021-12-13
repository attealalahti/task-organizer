import React from "react";

class ItemCreator extends React.Component {
    inputText = "";
    render() {
        return (
            <div className="CreateItem">
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        // Don't do anything if the input only has white space
                        if (this.inputText.replace(/\s/g, "").length) {
                            document.getElementById(this.props.id).value = "";
                            this.props.onSubmit(this.inputText);
                            this.inputText = "";
                        }
                    }}
                >
                    <input
                        className="TextInput"
                        placeholder={this.props.placeholder}
                        autoComplete="off"
                        onChange={(event) => (this.inputText = event.target.value)}
                        id={this.props.id}
                    />
                    <input type="submit" value="Add" />
                </form>
            </div>
        );
    }
}

export default ItemCreator;
