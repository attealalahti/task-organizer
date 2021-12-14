import React from "react";

class InfoPage extends React.Component {
    componentDidMount() {
        this.props.setOpenPage("info");
    }
    render() {
        return (
            <div>
                <h1>Info</h1>
                <h2>Atte Ala-Lahti</h2>
                <p>
                    Used a Font Awesome icon for the hamburger menu button. All other
                    assets are my own creations.
                </p>
                <div className="Columns">
                    <div>
                        <h2>MANAGE TASKS</h2>
                        <div className="Paragraphs">
                            <p>
                                Drag and drop (press and hold on mobile) tasks to change
                                their order or move them to a different list.
                            </p>
                            <p>
                                Add a new task to a list by typing in the "New task..."
                                input box on a list and pressing "Add" or enter. When all
                                tasks aren't shown (because of tags or searching), new
                                tasks cannot be created.
                            </p>
                            <p>
                                Create new tags by typing the new tag name in the "New
                                tag..." input box and pressing "Add" or enter.
                            </p>
                            <p>
                                By checking checkboxes on tags you can choose to only show
                                tasks that have those tags. Checking "All" will show all
                                tasks (and uncheck other tags).
                            </p>
                            <p>
                                Add a tag to a task by pressing "Add tag". Remove tags
                                from a task by pressing the "X" button on them.
                            </p>
                            <p>Delete a task or a tag by pressing its "Delete" button.</p>
                            <p>
                                Edit task descriptions and tag names by pressing "Edit".
                                Save your changes by pressing enter.
                            </p>
                            <p>
                                Press the "Sort by last edit" button to sort tasks on a
                                particular list according to the last time their
                                descriptions were edited. Latest edited task comes first.
                            </p>
                        </div>
                    </div>
                    <div>
                        <h2>MANAGE LISTS</h2>
                        <div className="Paragraphs">
                            <p>
                                Drag and drop (press and hold on mobile) lists to change
                                their order. This also affects the order on the task
                                management page.
                            </p>
                            <p>
                                Create new lists by typing the new list name in the "New
                                list..." input box and pressing "Add" or enter.
                            </p>
                            <p>
                                Rename lists by pressing "Rename". Save your changes by
                                pressing enter.
                            </p>
                            <p>Delete a list by pressing "Delete".</p>
                            <p>
                                Hide lists from being shown on the task management page by
                                pressing "Hide". Choose to show them again by pressing
                                "Unhide".
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default InfoPage;
