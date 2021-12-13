import React from "react";

class InfoPage extends React.Component {
    componentDidMount() {
        this.props.setOpenPage("info");
    }
    render() {
        return <div>Info goes here.</div>;
    }
}

export default InfoPage;
