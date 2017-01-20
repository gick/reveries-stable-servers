#ReveRIES very brief introduction
ReveRIES is a project to design an authoring tools, aimed at non IT people, that allow to create botanic mobile learning game.
There is a client part that is a website user access from their smartphone, a client-server part to manage user, an authoring tool server part (you are here!) and an authoring tool client part.
From here you can install reveries-stable-servers and then create mobile learning game, or to be honest you will be able to do it smoothly in a few month.

# ReVeRIES Server installation and configuration
## Installation instructions
You will need at least node v5, and mongodb 3.2.5. I recommand using node v7.
*Installing node for mac or windows : https://nodejs.org/en/download/current/ 
*Installing mongodb for mac, windows or linux : https://www.mongodb.com/download-center#community

When you're done installing these, clone this repository and install node dependencies:

    $ git clone https://github.com/gick/reveries-stable-servers`
    $ cd reveries-stable-servers
    $ npm install --save

##Configuration instructions
From the web server root directory :

    $ nano /app/config/config.js 

Using nano editor, update the value of the variable webDirectory with the path of reveries-project client application (see https://github.com/gick/reveries-project for install instruction).


##Execution and ports
The web server is launched from the root directory with  

 ` $ node server.js`

By default, the server listen on port 8000. You are free to change this port (using regular 80 for instance)
You can access the website from : <http://localhost:8000>




