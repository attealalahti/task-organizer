import React from "react";

class TagReference extends React.Component {
    render() {
        return (
            <div className="TagReference">
                {this.props.tag.name}
                <button onClick={() => this.props.onDelete(this.props.id)}>X</button>
            </div>
        );
    }
}

export default TagReference;
