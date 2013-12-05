# Avy

Avy is algorithm visualization framework and visualization hosting website.

## Directory structure of this repository

client: Website client-side application (AngularJS)
 - css: CSS style sheets
 - img: images
 - js: JavaScript source files
 - partials: HTML (AngularJS) templates
 - vendor: 3rd party libraries
 - index.html: template for the website index

server: AppEngine server application
 - api: API for the website (www.algoviz.net)
 - anif: visualization and module hosting (anif.algoviz.net)
 - common: common functions
 - model: data structures for storing in the database
 - server.go: main server file

anif: Animation framework
 - framework: basic framework files (libraries and api.html for iframe file access API)
 - tools: algorithm event capturing tools in various programming languages
 - modules: visualization modules
 - examples: full visualization examples with code and input files
 - index.html: template for visualization index

## Visualization/Module development

Directories:
 - anif/modules
 - anif/examples

You can find information about visualization development on the website: http://www.algoviz.net/help/

Make push requests only if you're changing an existing visualization or module in this repository. If you're creating your own modules and/or visualizations create your own repository and let me know if you want me to link to it here.

## Website development

Directories:
 - client
 - server

### Running development server

 - Download Google App Engine SDK for Go: https://developers.google.com/appengine/downloads#Google_App_Engine_SDK_for_Go
 - Install the SDK: extract and add to the system variable PATH (https://developers.google.com/appengine/docs/go/gettingstarted/devenvironment)
 - Clone this repository
 - Move to the avy (root) directory and run "goapp serve" (https://developers.google.com/appengine/docs/go/tools/devserver)
 - Add "avy", "www.avy" and "anif.avy" to your hosts file (/etc/hosts on Linux)
 - Open your browser and navigate to http://avy:8080
 - (you can find AppEngine admin console at http://avy:8000)

### Pushing changes to production

To push changes to algoviz.net you need my permission fist, but you can also create your own AppEngine project and push there.

To get started with AppEngine go here: https://cloud.google.com/products/app-engine/

Once you have an AppEngine project, you can push the code using "goapp deploy" or "appcfg.py --oauth2 update ." if you prefer using OAuth/password-less authentication (I certainly do). Before you do the push, you need to change the configuration in the "server/server.go" file (domain name and port number).
You can get more information here: https://developers.google.com/appengine/docs/go/tools/uploadinganapp