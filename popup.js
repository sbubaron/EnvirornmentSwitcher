// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);

  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

function navTo(url) {
  // Put the image URL in Google search.


    chrome.tabs.update({
      url: url
    });

    window.close();


}

function navToLocal() {

  navTo(document.localDevURL);
}

function navToDev() {
  navTo(document.devURL);
}

function navToStage() {
  navTo(document.stageURL);
}

function navToProd() {
  navTo(document.prodURL);
}


function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function get_context_options(url, project, source) {


  if(source == 'localDev') {
      document.getElementById('local').style.display = 'none';

      document.localDevURL = url.replace(project.localDev, project.localDev)
      document.devURL = url.replace(project.localDev, project.dev)
      document.stageURL = url.replace(project.localDev, project.stage)
      document.prodURL = url.replace(project.localDev, project.prod)

  }
  else if(source == 'dev') {
      document.getElementById('dev').style.display = 'none';

      document.localDevURL = url.replace(project.dev, project.localDev)
      document.devURL = url.replace(project.dev, project.dev)
      document.stageURL = url.replace(project.dev, project.stage)
      document.prodURL = url.replace(project.dev, project.prod)

  }
  else if(source == 'stage') {
      document.getElementById('stage').style.display = 'none';
      document.localDevURL = url.replace(project.stage, project.localDev)
      document.devURL = url.replace(project.stage, project.dev)
      document.stageURL = url.replace(project.stage, project.stage)
      document.prodURL = url.replace(project.stage, project.prod)
  }
  else if(source == 'prod') {
      document.getElementById('prod').style.display = 'none';

      document.localDevURL = url.replace(project.prod, project.localDev)
      document.devURL = url.replace(project.prod, project.dev)
      document.stageURL = url.replace(project.prod, project.stage)
      document.prodURL = url.replace(project.prod, project.prod)
  }

}

function getOption(url, name, source, dest) {
  var opt = new Object();
  opt.name = name;
  opt.url = url.replace(source, dest);

  return opt;
}









document.addEventListener('DOMContentLoaded', function() {
  var projects = new Array();
  chrome.storage.sync.get({
    projects: []
    //likesColor: true
  }, function(items) {
    projects = items.projects;
    console.log(projects);
    var bFound = false;
    getCurrentTabUrl(function(url) {
      console.log(url);
      for(var i = 0; i < projects.length; i++) {

        prj = projects[i];
        console.log(prj);


        if(url.indexOf(prj.localDev) >= 0) {
          bFound = true;

          get_context_options(url, prj, 'localDev');

        }
        else if(url.indexOf(prj.dev) >= 0) {
          bFound = true;
          get_context_options(url, prj, 'dev');
        }
        else if(url.indexOf(prj.stage) >= 0) {
          bFound = true;
          get_context_options(url, prj, 'stage');
        }
        else if(url.indexOf(prj.prod) >= 0) {
          bFound = true;
          get_context_options(url, prj, 'prod');
        }

        if(bFound) {
          document.project = prj;
          i = projects.length;
        }
      }

      if(!bFound) {
        document.getElementById('contexts').style.display = 'none';
        renderStatus("URL not found in any projects");
      }
      else {
        document.getElementById('contexts').style.display = 'block';
      }


    });
  });

  document.getElementById('local').addEventListener('click', navToLocal);
  document.getElementById('dev').addEventListener('click', navToDev);
  document.getElementById('stage').addEventListener('click', navToStage);
  document.getElementById('prod').addEventListener('click', navToProd);


});
