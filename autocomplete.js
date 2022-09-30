const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
    root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">
            </div>
        </div>
    </div>
`;

    // Select our input
    const input = root.querySelector('input');
    // Select div.dropdown
    const dropdown = root.querySelector('.dropdown');
    // Select div.resutls
    const resultsWrapper = root.querySelector('.results');

    // Input event (w/ debounce helper function)
    const onInput = async event => {
        const items = await fetchData(event.target.value);
        if (!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }
        // Adding a class is-active(from bulma) next to the class dropdown
        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active');
        for (let item of items) {
            const option = document.createElement('a');
            // If Poster property is N/A return empty string, if not return the image source
            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item);
            // Adding a click event when we click on the option inside our dropdown
            option.addEventListener('click', () => {
                // Closing the dropdown
                dropdown.classList.remove('is-active');
                // Updating the text inside the input
                input.value = inputValue(item);
                // Defining another helper function to make things more clear to read
                onOptionSelect(item);
            });
            resultsWrapper.appendChild(option);
        };
    };

    input.addEventListener('input', debounce(onInput, 500));

    document.addEventListener('click', (event) => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active');
        }
    });
};