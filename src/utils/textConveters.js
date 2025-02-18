export const makeCamelCase = (word) => {
    const separated = word.split(" ");
    const camelcase = separated.map((word, index) => {
        if (index === 0) {
            return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    return camelcase.join("");
};

export const removeCamelCase = (word) => {
    const modifiedWord = word.replace(/([A-Z])/g, " $1").toLowerCase();
    const capitalized = modifiedWord.split(" ").map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalized.join(" ")
};
