# Yelp's Recipes
Yelp's Recipes is a chrome extension that brings recipes videos into Yelp's restaurant pages. This code was made for The BroadbandTV Challenge for VanHackathon 2016.

## Chrome extension
The extension is published in the Chrome Web Store: https://chrome.google.com/webstore/detail/abjdcoidhgdehgniokknekpdooekpkbe

# Source code
## Development stack
- Gulp
- Bower
- SASS
- Browserify

## Libs
- jQuery
- Mustache.js

## Get the code up and running
First, you'll have to install the dependencies: `npm`, `gulp` and `bower`. Once
it's all installed, the process is really simple:

- Inside the repository, run `npm install` to install all packages.json dependencies
- Once installed, run `bower install` to bring all third-part libs on bower.json
- Then, just run `gulp` to compile all code inside `src` and put on `dist` folder.

## Methodology
I've been using (and adapting) BEM (http://bem.info) as front-end methodology, distributing modules inside src/static/css/modules and src/static/scripts/modules

## Code organization
| Path                                        | Description                                 |
|---------------------------------------------|---------------------------------------------|
| src/                                        | The source code
| src/static/css                              | SASS files. All files must be imported by files on the root of that folder
| src/static/css/modules                      | Styles of BEM modules
| src/static/images                           | Images. All the content is copied as is to the `dist` folder
| src/static/scripts                          | Javascripts files compiled with browserify. Only the files on the root are compiled and copied to `dist` folder
| src/static/scripts/controllers              | Files responsible to interface API to the destination page
| src/static/scripts/modules                  | Scripts of BEM modules
| src/static/vendor/**                        | Libs installed with Bower. Except 'downloaded' folder that is reserved for libs that was donwload without bower.
| src/static/views                            | Javascripts files exporting HTML templates to be rendered with mustache.js

### Controllers
All controllers are initialized by main.js. The main.js file will look up for a .condition() and .init() functions inside the controller.

The .condition() will tell the main.js if the controller has the right page, state, or whatever other condition to be initialized. Once condition is true, then the init() function is called.

If .condition() don't exists, main.js automatically assume that the condition to execute is true.

### Vendor folder
All the libs used in vendor must be declared inside vendor.json file. In this file will be declared the file it should create on `dist` and what files should be bundled to this file. Ex.:

```json
{
	"vendor.js": [
		"jquery/dist/jquery.min.js",
		"mustache.js/mustache.min.js"
	]
}
```