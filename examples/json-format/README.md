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
