import React from "react";

class TagReference extends React.Component {
    render() {
        return (
            <div className="TagReference">
                {this.props.tag.name}
                <button
                    className="DeleteTagReference"
                    onClick={() => this.props.onDelete(this.props.id)}
                >
                    <i className="fa fa-times"></i>
                </button>
            </div>
        );
    }
}

export default TagReference;
