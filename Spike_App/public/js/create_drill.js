const { link } = require("../../routes");

function saveFormData() {

    const drillId = parseInt(document.getElementById('drill-id').value);

    // Populate the drillData object
    drillData = {
        drillId: drillId,   // for some reason, drillId is returning a string, ie. "17" instead of a number, ie. 17
        name: document.getElementById('drill-name').value,
        category: document.getElementById('drill-category').value,
        level: document.getElementById('drill-level').value,
        numberOfPlayers: document.getElementById('numberOfPlayers').value,
        time: document.getElementById('duration').value,
        focus: document.getElementById('focus').value,
        description: document.getElementById('description').value,
        scoring: document.getElementById('scoring').value,
        behaviors: document.getElementById('behaviors').value,
        notesVariations: document.getElementById('variations').value,
        keywords: document.getElementById('keywords').value,
        stepByStep: document.getElementById('stepByStep').value
    };

    console.log(drillData);

    // Check if drillData is empty
    if (Object.keys(drillData).length === 0 && drillData.constructor === Object) {
        console.log('No data to save.');
        return; // Exit the function if drillData is empty
    }

    // Send the drillData to the server
    fetch('/save-drill', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(drillData)
    })
    .then(response => {
        if (response.ok) {
            console.log('Drill data saved successfully');
        } else {
            console.error('Failed to save drill data:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Network error:', error);
    });
}
