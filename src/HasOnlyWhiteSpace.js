// Checks if a string only has white space (spaces, tabs etc.)
function HasOnlyWhiteSpace(text) {
    // Replaces all white space in the text with nothing
    // If the length is 0 after removing white space, the text only had white space.
    return text.replace(/\s/g, "").length === 0;
}

export default HasOnlyWhiteSpace;
