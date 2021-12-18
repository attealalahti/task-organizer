import React from "react";

// A visual representation of what tags a task has
class TagReference extends React.Component {
    render() {
        return (
            <div className="TagReference">
                {this.props.tag.name}
                <button
                    className="DeleteTagReference"
                    // Send the tag's id to parent task for deletion purposes
                    onClick={() => this.props.onDelete(this.props.id)}
                >
                    <i className="fa fa-times"></i>
                </button>
            </div>
        );
    }
}

export default TagReference;
