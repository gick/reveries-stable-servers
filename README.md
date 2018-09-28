# Repository out of date and archived
Please use https://github.com/gick/reveries-authoring

# ReVeRIES Server installation and configuration
## Installation instructions
You will need at least node v5, and mongodb 3.2.5 Installing node for mac or windows : https://nodejs.org/en/download/current/ Installing mongodb for mac, windows or linux : https://www.mongodb.com/download-center#community

Node comes with NPM (Node Package Manager), usefull to install dependencies or node applications


When you installed these, clone this repository :

`$ git clone https://github.com/gick/reveries-server`


##Configuration instructions
From web server root directory, edit /app/config/config.js, the variable webDirectory should have a string value indicating the path to reveries-project client application (see https://github.com/gick/reveries-project for install instruction).

From the game server root directory, install dependencies with npm : 

`$ npm install`

Then launch the web server, for instance : 

`$ node server.js`

You can access the website from : <http://localhost:8000>


### Create a first account
If this is your first install, you will need an account to start working. Please use the Login/Sign-up item in the left menu to sign up.



