<!-- loopback install guide -->

1. download loopback default package 
	$ slc loopback loopback-example-angular

2. download client bower lib 
	$ bower install angular angular-resource angular-ui-router bootstrap

3. create clinet dir	
	$ mkdir client/admin/css
	$ mkdir client/admin/js
	$ mkdir client/admin/views

	$ mkdir client/web/css
	$ mkdir client/web/js
	$ mkdir client/web/views

- more detail guide -
https://github.com/strongloop/loopback-example-angular



<!-- How to run server -->

1. run node.js production mode
    $ NODE_ENV="production" node .

2. run node.js test mode
  	$ node .




<!-- Project layout reference  -->

server - Node application scripts and configuration files.
client - Client JavaScript, HTML, and CSS files.
common - Files common to client and server. The /models sub-directory contains all model JSON and JavaScript files.

- more detail guide -
https://docs.strongloop.com/display/public/LB/Project+layout+reference




<!-- Environment-specific configuration  -->

- more detail guide - 
https://docs.strongloop.com/display/public/LB/config.json
https://docs.strongloop.com/display/public/LB/Environment-specific+configuration