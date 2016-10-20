// Saves options to chrome.storage.sync.
function save_options() {
  var color = document.getElementById('color').value;
  var likesColor = document.getElementById('like').checked;
  chrome.storage.sync.set({
    favoriteColor: color,
    likesColor: likesColor
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function add_project() {

  var newProject = document.getElementById('newProject').value;

  var selProjects = document.getElementById('projects');
  var el = document.createElement("option");
  el.textContent = newProject;
  el.value = newProject;
  selProjects.appendChild(el);

  var projectArray= new Array();

for (i = 0; i < selProjects.options.length; i++) {
  projectObject = new Object();
  projectObject.name = selProjects.options[i].value;
   projectArray[i] = projectObject;

}
  console.log(projectArray);

  chrome.storage.sync.set({
    projects: projectArray
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    projects: []
    //likesColor: true
  }, function(items) {
    console.log(items);
    var selProjects = document.getElementById('projects');
    var projects = items.projects;

    for(var i = 0; i < projects.length; i++) {
      var opt = projects[i];
      var el = document.createElement("option");
      el.textContent = opt.name;
      el.value = opt.name;
      selProjects.appendChild(el);
    }
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('addProject').addEventListener('click',
    add_project);

document.getElementById('save').addEventListener('click',
    save_options);
