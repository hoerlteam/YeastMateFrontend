import React from 'react';
import { observable } from 'mobx';

const Store = require('electron-store');

const PreprocessingSettings = React.lazy(() => import('./views/settings/PreprocessingSettingsForm'));
const DetectionSettings = React.lazy(() => import('./views/settings/DetectionSettingsForm'));
const ExportSettings = React.lazy(() => import('./views/settings/ExportSettingsForm'));
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const StartNewJob = React.lazy(() => import('./views/newjob/NewJob'));
const Annotate = React.lazy(() => import('./views/annotate/Annotate'));

const store = new Store();

var sidebarShow = observable(new Map())
var presetSelection = observable(new Map())
var annotationPath = observable(new Map())
var preprocessingPresetList = observable(new Map())
var detectPresetList = observable(new Map())
var exportPresetList = observable(new Map())

sidebarShow.set('show', 'responsive')

preprocessingPresetList.set("1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed", {
  name: "Default",
  alignment: false,
  inputFileFormat: '.nd2',
  videoSplit: false,
  channels: [
    {"Camera":1,"Channel":1,"DIC":"True","Delete":"Keep"},
    {"Camera":2,"Channel":2,"DIC":"True","Delete":"Delete"},
    {"Camera":1,"Channel":3,"DIC":"False","Delete":"Keep"},
    {"Camera":2,"Channel":4,"DIC":"False","Delete":"Keep"}
  ],
  dimensions: [
    {"Dimension":"FOV","index":0,"status":"Existing"},
    {"Dimension":"Time","index":1,"status":"Existing"},
    {"Dimension":"Z-Stack","index":2,"status":"Existing"},
    {"Dimension":"Channels","index":3,"status":"Existing"},
    {"Dimension":"Height","index":4,"status":"Existing"},
    {"Dimension":"Width","index":5,"status":"Existing"}
  ] 
})

detectPresetList.set("a809ff23-4235-484f-86f2-e5d87da8333d", {
    name: "Default",
    graychannel: 0,
    zstack: false,
    video: false,
    pixelSize: 110,
    frameSelection: "all",
    ip: "127.0.0.1:5000"
 })

exportPresetList.set("1ed8c0c5-a4d9-4e63-a43b-b3bdaddd970f", {
  name: "Default",
  crop: false,
  classes: [
    {"Class ID":1,"Tag":"single_cell","Crop":"False", "Mask": "False"},
    {"Class ID":2,"Tag":"mother","Crop":"False", "Mask": "False"},
    {"Class ID":3,"Tag":"daughter","Crop":"False", "Mask": "False"},
    {"Class ID":4,"Tag":"mating","Crop":"True", "Mask": "True"},
  ],
  video: false,
  videoSplit: false,
  scoreThreshold: 0.5,
  boxExpansion: false,
  boxsize: 200
})

if (typeof store.get('preprocessing') !== 'undefined') {
  for (let [key, value] of Object.entries(store.get('preprocessing'))) {
    if (key !== "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed") {
      preprocessingPresetList.set(key, value)
    }
  }
}

if (typeof store.get('detection') !== 'undefined') {
  for (let [key, value] of Object.entries(store.get('detection'))) {
    if (key !== "a809ff23-4235-484f-86f2-e5d87da8333d") {
      detectPresetList.set(key, value)
    }
  }
}

if (typeof store.get('export') !== 'undefined') {
  for (let [key, value] of Object.entries(store.get('export'))) {
    if (key !== "1ed8c0c5-a4d9-4e63-a43b-b3bdaddd970f") {
      exportPresetList.set(key, value)
    }
  }
}

if (typeof store.get('selection') !== 'undefined') {
  for (let [key, value] of Object.entries(store.get('selection'))) {
    presetSelection.set(key, value)
  }
}
else {
  presetSelection.set('path', "")
  presetSelection.set('includeTag', "")
  presetSelection.set('excludeTag', "")
  presetSelection.set('preprocessing', null)
  presetSelection.set('detection', "a809ff23-4235-484f-86f2-e5d87da8333d")
  presetSelection.set('export', null)
}

if (typeof store.get('annotationPath') !== 'undefined') {
  for (let [key, value] of Object.entries(store.get('selection'))) {
    annotationPath.set(key, value)
  }
}
else {
  annotationPath.set('path', "")
}

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/job', name: 'New Job', component: StartNewJob, data: { selection: presetSelection, preprocessing: preprocessingPresetList, detection: detectPresetList, export: exportPresetList} },
  { path: '/annotate', name: 'Annotate your data', component: Annotate, data: annotationPath },
  { path: '/preprocessing', name: 'Preprocessing Settings', component: PreprocessingSettings, data: preprocessingPresetList },
  { path: '/detection', name: 'Detection Settings', component: DetectionSettings, data: detectPresetList },
  { path: '/export', name: 'Export Settings', component: ExportSettings, data: exportPresetList },
];

const prop =  {routes: routes, store: store, sidebarShow: sidebarShow, lists: { selection: presetSelection, annotationPath: annotationPath, preprocessing: preprocessingPresetList, detection: detectPresetList, export: exportPresetList }}

export default prop;
