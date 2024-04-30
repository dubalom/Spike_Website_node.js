// addDrillToPlan.js
document.addEventListener('DOMContentLoaded', function() {
   const addDrillButton = document.getElementById('add-activity-btn');
   const planNumberInput = document.getElementById('planNumber');
   const drillIdInput = document.getElementById('drillId');

   addDrillButton.addEventListener('click', function(event) {
       event.preventDefault(); // Prevent default link behavior

       const planNumber = planNumberInput.value; // Get planNumber from hidden input
       const drillId = drillIdInput.value; // Get drillId from hidden input

       if (!drillId || !planNumber) {
           console.error('Missing drillId or planNumber');
           return;
       }

       const data = {
           planNumber: planNumber,
           drillId: drillId
       };

       fetch('/add-drill-to-plan', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify(data)
       })
       .then(response => {
           if (response.ok) {
               response.text().then(msg => {
                   console.log(msg); // Log the success message
                   window.location.href = `/view_plan/${planNumber}/${drillId}`;
               });
           } else {
               response.text().then(msg => {
                   console.error('Failed to add drill to practice plan:', msg);
               });
           }
       })
       .catch(error => {
           console.error('Network error:', error);
       });
   });
});
