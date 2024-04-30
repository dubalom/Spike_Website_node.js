const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs'); // To read the JSON file
const maxPlans = 10; // Maximum number of practice plans allowed

// Assuming you have already initialized and configured express-openid-connect middleware.
// Make sure you have something like the following in your app setup:
// const { auth } = require('express-openid-connect');
// app.use(auth({...options}));

// Static files setup
router.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'Dummy_Database' directory
router.use('/Dummy_Database', express.static(path.join(__dirname, '..', '..', 'Dummy_Database')));

router.get('/', (req, res) => {
  // Check if the user is authenticated
  const isAuthenticated = req.oidc.isAuthenticated();

  if (isAuthenticated) {
    // Check if user object exists before accessing its properties
    const userName = req.oidc.user ? req.oidc.user.name : 'Unknown User';
    console.log('User is authenticated:', userName);
    res.render('home', {
      title: 'Home',
      isAuthenticated: true,
      userName: userName
    });
  } else {
    console.log('User is not authenticated');
    res.render('home', {
      title: 'Home',
      isAuthenticated: false,
      userName: null
    });
  }
});

// Path: Auth0/views/home.ejs

// New route for drill_library page
// Route for accessing drill library
router.get('/drill_library/:planNumber?', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();
  const planNumber = req.params.planNumber ? parseInt(req.params.planNumber) : null; // Access the plan number from request parameters if provided

  // Read the drills data from the JSON file
  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_drills.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading drill data");
      return;
    }

    const drills = JSON.parse(data);
    res.render("drill_library", {
      title: 'Drill Library',
      isAuthenticated,
      userName: req.oidc.user ? req.oidc.user.name : 'Unknown User',
      drills,
      planNumber
    }); // Pass the drills to the EJS template
  });
});

// import { expandDrill } from '../public/js/expand_drill.js'; // Assuming 'expand_drill.js' is in the same directory

// Path: Auth0/views/drill_library.ejs

// New route for practice_plan page
router.get('/practice_plans', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();

  // Read the practice plan data from the JSON file
  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_practice_plans.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading practice plan data");
      return;
    }

    const practicePlans = JSON.parse(data).practice_plans;
    if (isAuthenticated) {
      // Check if user object exists before accessing its properties
      const userName = req.oidc.user ? req.oidc.user.name : 'Unknown User';
      console.log('User is authenticated:', userName);
      res.render('practice_plans', {
        title: 'Practice Plans',
        isAuthenticated: true,
        userName: userName,
        practicePlans: practicePlans,
        numOfPlans: practicePlans.length
      });
    } else {
      res.redirect('/login/');
    }
  });
});

// Path: Auth0/views/practice_plans.ejs

// Route for handling deletion
router.post('/delete-plan', (req, res) => {
  const selectedPlan = req.body.selectedPlan;
  const intSelectedPlan = parseInt(selectedPlan); // Access the plan number from request body

  // Read the JSON file
  fs.readFile('../Dummy_Database/dummy_practice_plans.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Console log found file
    console.log('File Was Found:');

    // Parse JSON data
    let practicePlans = JSON.parse(data).practice_plans;

    // Find and remove the selected plan from the practice_plans array
    let planFound = false;
    for (let i = 0; i < practicePlans.length; i++) {
      // Check if the plan number matches the selected plan
      console.log("Plan Number:", practicePlans[i].plan_number + " Of type: " + typeof practicePlans[i].plan_number);
      if (parseInt(practicePlans[i].plan_number) == intSelectedPlan) {
        // Found the object with planNumber equal to selectedPlan
        console.log("Found:", practicePlans[i]);
        // Remove the selected plan from the array
        practicePlans.splice(i, 1);
        planFound = true;
        break; // Exit the loop since we found what we were looking for
      }
    }

    console.log('Selected Plan:', intSelectedPlan + " Of type: " + typeof intSelectedPlan);
    console.log("Plan Found:", planFound ? "Yes" : "No");


    if (planFound) {
      // Write updated data back to the file
      fs.writeFile('../Dummy_Database/dummy_practice_plans.json', JSON.stringify({
        practice_plans: practicePlans
      }), 'utf8', err => {
        if (err) {
          console.error('Error writing JSON file:', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        console.log('Practice plan deleted successfully.');
        res.sendStatus(200); // Respond with success status
      });
    } else {
      // If plan not found, send response accordingly
      console.log('Practice plan not found.');
      res.status(404).send('Practice plan not found.');
    }
  });
});


// Route for create_drill page
router.get('/create_drill', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();

  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_drills.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading practice plan data");
    }

    const drills = JSON.parse(data);
    const newDrillID = drills.length + 1;
    console.log('New Drill ID:', newDrillID);

    if (isAuthenticated) {
      res.render("create_drill", {
        title: 'Create Drill',
        isAuthenticated,
        userName: req.oidc.user ? req.oidc.user.name : 'Unknown User',
        newDrillID
      });
    } else {
      res.redirect('/login/');
    }
  });
});


// Path: Auth0/views/create_drill.ejs

// Route for create_plan page
router.get('/create_plan', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();

  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_practice_plans.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading practice plan data");
      return;
    }

    const practicePlans = JSON.parse(data).practice_plans;
    const usedPlans = practicePlans.length;

    if (isAuthenticated) {
      res.render("create_plan", {
        title: 'Create Plan',
        isAuthenticated,
        userName: req.oidc.user ? req.oidc.user.name : 'Unknown User',
        usedPlans,
        newPlanNumber: usedPlans + 100000 + 1 // Generate a new plan number
      });
    } else {
      res.redirect('/login/');
    }
  });
});

// Path: Auth0/views/create_plan.ejs

// Route to handle saving new practice plan
router.post('/save_plan', (req, res) => {
  // Read the existing practice plans data from the JSON file
  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_practice_plans.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading practice plan data");
      return;
    }

    const existingPlans = JSON.parse(data).practice_plans;
    const usedPlans = existingPlans.length;

    // Check if max number of plans has been reached
    if (usedPlans >= maxPlans) {
      console.error('Maximum number of practice plans reached.');
      res.redirect('/practice_plans');
      return;
    }

    // Find the first available unused ID
    const startID = 100001;
    const endID = 100010;
    let unusedID = null;
    for (let i = startID; i <= endID; i++) {
      // Check if the current ID is used
      let isUsed = existingPlans.some(plan => plan.plan_number === i);
      if (!isUsed) {
        unusedID = i; // Set the first unused ID
        break;
      }
    }

    const date = new Date().toISOString().slice(0, 10);
    console.log('New Plan Date:', date);

    const newEmptyPlan = {
      plan_number: unusedID, // Generate a new plan number
      date_created: date,
      drills: []
    }

    // Append the new empty plan to the practice plans array
    existingPlans.push(newEmptyPlan);

    // Write the updated practice plans data back to the JSON file
    fs.writeFile(path.join(__dirname, "../../Dummy_Database/dummy_practice_plans.json"), JSON.stringify({
      practice_plans: existingPlans
    }), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error saving practice plan data");
        return;
      }

      // Respond with a success message
      res.render('plan_saved', {
        title: 'Plan Created Confirmation',
        isAuthenticated: req.oidc.isAuthenticated(),
        newPlan: newEmptyPlan
      });
    });
  });
});


// New route to drill page
router.get('/drill_view/:drillId', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();
  const drillId = req.params.drillId; // Access the drillId from request parameters
  console.log('Drill ID:', drillId);
  var drill = {};

  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_drills.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading drill data");
      return;
    }

    const drills = JSON.parse(data); // data is undefined here, so you need to move this line inside the callback

    // THE CODE BELOW CAUSES AN ERROR
    // Find the drill with the matching drillId
    // const drill = drills.find(drill => drill.drillId === drillId);

    // if (!drill) {
    //   res.status(404).send("Drill not found");
    //   return;
    // }
    // THE CODE ABOVE CAUSES AN ERROR

    // // Using a loop
    for (let i = 0; i < drills.length; i++) {
      if (parseInt(drills[i].drillId) === parseInt(drillId)) {
        // Found the object with drillId equal to 1
        console.log("Found:", drills[i]);

        drill = drills[i];
        // Do whatever you need with the found object
        break; // Exit the loop since we found what we were looking for
      } else {
        console.log("Not found");
      }
    }

    res.render("drill_view", {
      title: 'Drill View',
      isAuthenticated,
      userName: req.oidc.user ? req.oidc.user.name : 'Unknown User',
      drillId, // Pass the drillId to the template
      drill
      // Add other drill details as needed
    });
  });
});


// Path: Auth0/views/drill_view.ejs


// Route to the share plan page
router.get('/share_plan/:planNumber', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();
  const plan_number = req.params.planNumber; // Access the plan number from request parameters

  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_practice_plans.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading practice plan data");
      return;
    }

    const practicePlans = JSON.parse(data).practice_plans;

    for (let i = 0; i < practicePlans.length; i++) {
      if (parseInt(practicePlans[i].plan_number) == parseInt(plan_number)) {
        // Found the object with planNumber equal to 1
        console.log("Found:", practicePlans[i]);

        plan = practicePlans[i];
        // Do whatever you need with the found object
        break; // Exit the loop since we found what we were looking for
      } else {
        console.log("Not found");
        console.log("Plan Number:", practicePlans[i].plan_number + " Of type: " + typeof practicePlans[i].plan_number);
        console.log("Plan Number:", plan_number + " Of type: " + typeof plan_number);
      }
    }

    if (isAuthenticated) {
      res.render("share_plan", {
        title: 'Share Plan',
        isAuthenticated,
        userName: req.oidc.user ? req.oidc.user.name : 'Unknown User',
        plan
      });
    } else {
      res.redirect('/login/');
    }
  });
});

// Path: Auth0/views/share_plan.ejs

// Endpoint to handle POST requests to update the practice plan
router.post('/update_practice_plans', async (req, res) => {
  console.log('You have reached the update practice plan endpoint.');

  try {
    // Extract drillId and planNumber from the request body
    const {
      drillId,
      planNumber
    } = req.body;

    // Parse the drillId and planNumber as integers
    const drillIdInt = parseInt(drillId);
    const planNumberInt = parseInt(planNumber);

    // Log the drillId and planNumber
    console.log('DrillId:' + drillId + ' of type ' + typeof drillId + ' seen from index.js');
    console.log('PlanNumber:' + planNumber + ' of type ' + typeof planNumber + ' seen from index.js');

    // Read the dummy_drills.json file to find the drill with the given drillId
    fs.readFile(path.join(__dirname, '../../Dummy_Database/dummy_drills.json'), 'utf8', (err, drillsData) => {
      if (err) {
        console.error('Error reading drill data:', err);
        res.status(500).send('Error reading drill data');
        return;
      }

      console.log('Drill Library Found:');

      let drills = JSON.parse(drillsData);

      // Console log the drills
      // console.log(drills);

      // Search for the drill with the given drillId
      let selectedDrill = null;
      for (let i = 0; i < drills.length; i++) {
        if (parseInt(drills[i].drillId) === drillIdInt) {
          selectedDrill = drills[i];
          console.log('Drill Found: ' + selectedDrill);
          break;
        }
      }

      if (!selectedDrill) {
        console.error('Drill not found');
        res.status(404).send('Drill not found');
        return;
      }

      // Read the dummy_practice_plans.json file to find the practice plan with the given planNumber
      fs.readFile(path.join(__dirname, '../../Dummy_Database/dummy_practice_plans.json'), 'utf8', (err, plansData) => {
        if (err) {
          console.error('Error reading practice plan data:', err);
          res.status(500).send('Error reading practice plan data');
          return;
        }

        console.log('Practice Plan Found:');

        const plans = JSON.parse(plansData).practice_plans;
        const selectedPlan = plans.find(plan => plan.plan_number == planNumberInt);
        console.log('Selected Plan Found: ' + selectedPlan);

        if (!selectedPlan) {
          console.error('Practice plan not found');
          res.status(404).send('Practice plan not found');
          return;
        }

        if (selectedPlan.drills.length >= 20) {
          console.error('Maximum drills limit reached for this practice plan.');
          // Redirect the user to the edit plan page with the planNumber
          res.redirect(301, '/practice_plans');
          return;
        }

        // Append the selected drill to the practice plan and update the practice plans file
        selectedPlan.drills.push(selectedDrill);
        fs.writeFile(path.join(__dirname, '../../Dummy_Database/dummy_practice_plans.json'), JSON.stringify({
          practice_plans: plans
        }), (err) => {
          if (err) {
            console.error('Error updating practice plan:', err);
            res.status(500).send('Error updating practice plan');
            return;
          }
          console.log('Updated Plans: ' + plans);
          console.log('Practice plan updated successfully.');
          res.redirect(301, '/practice_plans');
        });
      });
    });
  } catch (error) {
    console.error('Error updating practice plan:', error);
    res.redirect('/practice_plans');
  }
});

// Route to the edit plan page
router.get('/edit_plan/:planNumber', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();
  const planNumber = parseInt(req.params.planNumber);

  // Read the practice plan data from the JSON file
  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_practice_plans.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading practice plan data");
      return;
    }

    const practicePlans = JSON.parse(data).practice_plans;
    const foundPlan = practicePlans.find(plan => parseInt(plan.plan_number) === planNumber);

    if (foundPlan) {
      res.render("edit_plan", {
        title: 'Edit Plan',
        isAuthenticated,
        userName: req.oidc.user ? req.oidc.user.name : 'Unknown User',
        plan_number: planNumber,
        plan: foundPlan
      });
    } else {
      console.log("Plan not found");
      res.status(404).send("Plan not found");
    }
  });
});

// Path: Auth0/views/edit_plan.ejs

// Route to delete a drill from a practice plan
router.post('/delete-drill', (req, res) => {
  const planNumber = parseInt(req.body.planNumber);
  const drillId = parseInt(req.body.drillId);

  fs.readFile(path.join(__dirname, '../../Dummy_Database/dummy_practice_plans.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    let practicePlans = JSON.parse(data).practice_plans;
    let planFound = practicePlans.find(plan => plan.plan_number === planNumber);

    if (planFound) {
      const drillIndex = planFound.drills.findIndex(d => d.drillId === drillId);
      if (drillIndex > -1) {
        planFound.drills.splice(drillIndex, 1); // Remove the drill from the array
        fs.writeFile(path.join(__dirname, '../../Dummy_Database/dummy_practice_plans.json'), JSON.stringify({
          practice_plans: practicePlans
        }, null, 2), 'utf8', err => {
          if (err) {
            console.error('Error writing JSON file:', err);
            res.status(500).send('Internal Server Error');
            return;
          }
          res.redirect('/edit_plan/' + planNumber); // Redirect back to the plan edit page
        });
      } else {
        res.status(404).send('Drill not found');
      }
    } else {
      res.status(404).send('Plan not found');
    }
  });
});

// P

// Route to the view plan page
router.get('/view_plan/:planNumber', (req, res, next) => {
  // Call the next middleware function if the route matches /view_plan/:planNumber/:drillId
  if (req.params.drillId) {
    return next();
  }

  const isAuthenticated = req.oidc.isAuthenticated();
  const planNumber = parseInt(req.params.planNumber);
  const drillId = null;

  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_practice_plans.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading practice plan data");
      return;
    }

    const practicePlans = JSON.parse(data).practice_plans;
    const foundPlan = practicePlans.find(plan => parseInt(plan.plan_number) === planNumber);

    if (foundPlan) {
      res.render("view_plan", {
        title: 'View Plan',
        isAuthenticated,
        userName: req.oidc.user ? req.oidc.user.name : 'Unknown User',
        plan_number: planNumber,
        plan: foundPlan,
        drillId
      });
    } else {
      console.log("Plan not found");
      res.status(404).send("Plan not found");
    }
  });
});


// Path: Auth0/views/drill_library.ejs

// Route to handle saving drill data
router.post('/save-drill', (req, res) => {
  const newDrillData = req.body; // This includes all form data, including the hidden 'link' field

  // Read the existing drills data
  fs.readFile(path.join(__dirname, "../../Dummy_Database/dummy_drills.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading drill data");
      return;
    }

    const existingDrills = JSON.parse(data);

    // Append the new drill data to the array
    existingDrills.push(newDrillData);

    // Write the updated data back to the JSON file
    fs.writeFile(path.join(__dirname, "../../Dummy_Database/dummy_drills.json"), JSON.stringify(existingDrills, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error saving drill data");
        return;
      }

      // Redirect to a confirmation page or render a success message
      res.render('drill_saved', { // Ensure you have a 'drill_saved.ejs' to handle this
        title: 'Drill Created Confirmation',
        isAuthenticated: req.oidc.isAuthenticated(),
        drillData: newDrillData
      });
    });
  });
});


// Route to drill saved page
router.get('/drill_saved', (req, res) => {
  const isAuthenticated = req.oidc.isAuthenticated();

  if (isAuthenticated) {
    res.render("drill_saved", {
      title: 'Drill Saved',
      isAuthenticated,
      userName: req.oidc.user ? req.oidc.user.name : 'Unknown User'
    });
  } else {
    res.redirect('/login/');
  }
});

// Path: Auth0/views/saved_drills.ejs

module.exports = router;