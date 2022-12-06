# Quick Setup

In order to run the frontend, you need [NodeJS](https://nodejs.org/).
After installing you can just run 
`npm install` and `npm run start` to run the frontend.

# Configuration
src/AppSettings.js
----
- apiUrl: base path of the Backend
- scaleFactor: internal factor for scaling down welding objects & models. Just for visualization as the original values were too large and caused visual artifacts (due to floating point precision)


# Libraries
We used the following libraries for the frontend:

- React                   
    - as the core framework
- THREE.js                
    - for visualization of welding objects and torches
- bootstrap              
    - as a styling framework
- chart.js                
    - for visualization of the evaluation charts
- xml2js                 
    - for parsing the welding xmls
- flexlayout-react       
    - for creating the flexible tab layout
