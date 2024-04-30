// const deletePracticePlan = require('./practice_plan_popup.js');

// Popup Overlay Window #2
// Populate the select dropdown with practice plans
function populatePracticePlans(practicePlans) {
    var select = document.getElementById('plan-select');
    select.innerHTML = '';
    practicePlans.forEach(function (plan) {
        var option = document.createElement('option');
        option.value = plan.plan_number;
        option.textContent = 'Practice Plan ' + plan.plan_number;
        select.appendChild(option);
    });
}

// Update the preview section with plan details based on the selected plan
// Update the preview section with plan details based on the selected plan
function updatePlanPreview(selectedPlan) {
    var previewDiv = document.getElementById('plan-preview');
    if (!selectedPlan) {
        previewDiv.innerHTML = '';
        return;
    }

    // Find the selected plan details
    var selectedPlanDetails = practicePlansFromJSON.find(function (plan) {
        return plan.plan_number == selectedPlan;
    });

    // Generate HTML for practice plan and drills
    var previewHTML = `
        <h3>Practice Plan ${selectedPlanDetails.plan_number - 100000}</h3>
        <p>Date Created: ${selectedPlanDetails.date_created}</p>
        <hr>
    `;

    selectedPlanDetails.drills.forEach(function(drill) {
        previewHTML += `
            <section class="practice-plan-container">
                <div class="practice-line-container">
                    <div class="practice-line">
                        <div class="column">
                            <div class="label">Time:</div>
                            <div class="value">9:00 AM</div>
                        </div>
                        <div class="column">
                            <div class="label">Activity:</div>
                            <div class="value">${drill.name}</div>
                        </div>
                        <div class="column">
                            <div class="label">Duration:</div>
                            <div class="value">${drill.time} mins</div>
                            <button id="edit-drill-duration" class="item-edit" style="display: none;">Edit</button>
                        </div>
                        <div class="column">
                            <div class="label">Scoring:</div>
                            <div class="value">${drill.scoring}</div>
                            <button id="edit-drill-scoring" class="item-edit" style="display: none;">Edit</button>
                        </div>
                        <div class="column">
                            <div class="label">Behaviors:</div>
                            <div class="value">${drill.behaviors}</div>
                            <button id="edit-drill-behaviors" class="item-edit" style="display: none;">Edit</button>
                        </div>
                    </div>
                    <div class="edit-icon">
                        <button id="edit-drill" style="display: none;">Edit Drill</button>
                    </div>
                </div>
            </section>
        `;
    });

    // Update previewDiv with generated HTML
    previewDiv.innerHTML = previewHTML;
}


// Event listener for when a practice plan is selected
document.getElementById('plan-select').addEventListener('change', function () {
    var selectedPlan = this.value;
    updatePlanPreview(selectedPlan);
});

// Event listeners for popup behavior and delete functionality (unchanged)
document.getElementById('delete-button').addEventListener('click', function () {
    document.getElementById('overlay').style.display = 'block';
});

document.getElementById('cancel-delete').addEventListener('click', function () {
    document.getElementById('overlay').style.display = 'none';
});

document.getElementById('confirm-delete').addEventListener('click', function () {
    document.getElementById('confirm-overlay').style.display = 'block';
});

document.getElementById('confirm-yes').addEventListener('click', function () {
    var selectedPlan = document.getElementById('plan-select').value;
    
    // Send AJAX request to backend
    fetch('/delete-plan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedPlan: selectedPlan }),
    })
    .then(response => {
        if (response.ok) {
            // Deletion successful, handle UI update if needed
            console.log('Practice plan deleted successfully.');
            window.location.reload();
        } else {
            // Handle deletion failure
            console.error('Failed to delete practice plan.');
        }
    })
    .catch(error => {
        // Handle network errors
        console.error('Error deleting practice plan:', error);
    });
    console.log('Deleting practice plan: ' + selectedPlan);
    document.getElementById('overlay').style.display = 'none';
});

document.getElementById('confirm-cancel').addEventListener('click', function () {
    document.getElementById('confirm-overlay').style.display = 'none';
});



// Fetch the JSON data
fetch('../../../Dummy_Database/dummy_practice_plans.json')
    .then(response => response.json())
    .then(data => {
        // Extract practice plans from the JSON data
        const practicePlans = data.practice_plans;
        
        // Call the function to populate the select dropdown
        populatePracticePlans(practicePlans);
        
        // Assign practicePlans to a variable accessible in the scope
        practicePlansFromJSON = practicePlans;
        
        // Logging the extracted practice plans
        console.log(practicePlansFromJSON);
    })
    .catch(error => {
        // Handle any errors that occur during the fetch
        console.error('Error fetching JSON data:', error);
    });

