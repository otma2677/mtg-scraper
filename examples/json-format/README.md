## Install Node
You first need to install Node.js to run the code.
You can look at how to do it [here](https://nodejs.org/en/download/)

## Run the script
You need to have the two files (index.js/package.json) altogether in the same folder.
In that particular, open the command line and use `npm install` which will
install mtg-scraper2 locally.

Then from there, you can use the script `npm start` which will call index.js 
and run the script.

## Example with JSON
This is an example that allows you to scrape/parse MTGO data and saves everything
in the JSON format at the root of the computer/server within the following structure;
- /{homedir}/data
  - /results
    - /modern
    - /legacy
    - /pioneer
    - /pauper
    - /vintage
    - /standard
  - /settings
  - /errors

You could break down things in multiple files easily.

## Dependencies
There is no npm dependencies outside of the 'mtg-scraper2' module.
