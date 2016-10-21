
function add_project() {

  chrome.storage.sync.get({
    projects: []
    //likesColor: true
  }, function(items) {
      projectArray = items.projects;
      newPrj = new Object();
      newPrj.name = document.getElementById('newProject').value;
      newPrj.id = generateId();
      newPrj.localDev = "ex. localdev.example.com";
      newPrj.dev = "ex. dev.example.com";
      newPrj.stage = "ex. stage.example.com";
      newPrj.prod = "ex. prod.example.com";
      console.log(newPrj);

      projectArray.push(newPrj);
      console.log(projectArray);

      chrome.storage.sync.set({
        projects: projectArray
      }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Project Added.';
        setTimeout(function() {
          status.textContent = '';
        }, 750);
      });

      load_projects();
   });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function load_projects() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    projects: []
    //likesColor: true
  }, function(items) {
    console.log(items);
    var selProjects = document.getElementById('projects');
    //remove all options from Projects List
    while (selProjects.options.length) {
       selProjects.remove(0);
   }

   //populate projects list with projects
        var projects = items.projects;

    for(var i = 0; i < projects.length; i++) {
      var opt = projects[i];
      var el = document.createElement("option");
      el.textContent = opt.name;
      el.value = opt.id;
      selProjects.appendChild(el);
    }

    toggleContext();

  });
}


function toggleContext() {
  var selProject = document.getElementById("projects").value;
  console.log(selProject);


  //if at this point we have no projects, hide the context options
  if(!selProject) {
    document.getElementById("context-wrap").style.display = 'none';
  }
  else { //otherwise show context options for selected project
    document.getElementById("context-wrap").style.display = 'block';
    load_contexts();
  }

}

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
});
}

function load_contexts() {
  chrome.storage.sync.get({
    projects: []
    //likesColor: true
  }, function(items) {
    console.log(items);
    var selProject = document.getElementById("projects").value;

    var projects = items.projects;
    var bFound = false;
    for(var i = 0; i < projects.length; i++) {
        var prj = projects[i];
        console.log(prj);
        if(prj.id == selProject) {
            bFound = true;
            document.getElementById('localDev').value = prj.localDev;
            document.getElementById('dev').value = prj.dev;
            document.getElementById('stage').value = prj.stage;
            document.getElementById('prod').value = prj.prod;
        }

    }

    if(!bFound) {
      document.getElementById('localDev').value = "not found";
      document.getElementById('dev').value = "not found";
      document.getElementById('stage').value = "not found";
      document.getElementById('prod').value = "not found";
    }
  });
}

function reset() {
  chrome.storage.sync.set({
    projects: []
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Projects Cleared.';
    load_projects();
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}


function save_contexts() {
  chrome.storage.sync.get({
    projects: []
    //likesColor: true
  }, function(items) {

    var selProject = document.getElementById("projects").value;

    var projects = items.projects;
    var bFound = false;
    for(var i = 0; i < projects.length; i++) {
        var prj = projects[i];
        console.log(prj);
        if(prj.id == selProject) {
            bFound = true;
            prj.localDev = document.getElementById('localDev').value;
            prj.dev = document.getElementById('dev').value;
            prj.stage = document.getElementById('stage').value;
            prj.prod = document.getElementById('prod').value;
        }

    }

    console.log(projects);
    chrome.storage.sync.set({
      projects: projects
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Contexts saved.';
      load_projects();
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  });

}

document.addEventListener('DOMContentLoaded', load_projects);
document.getElementById('addProject').addEventListener('click',
    add_project);

document.getElementById('save').addEventListener('click',
    save_contexts);


    document.getElementById('reset').addEventListener('click',
        reset);


document.getElementById('projects').addEventListener('change', load_contexts);
