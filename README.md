# am_i_rich
App for checking where you stand in income for your area.

## Description
User puts in their state, county, and income, then guessed what percentile they fall in.
The app pulls data from the [http://api.census.gov/data/2014/acs1/profile.html](US Census American Community Survey API) to display a D3 graph of the income distribution with markers for their percentile and their guess.

## Todos
- Control bar above chart
  - Toggle 2013/2014
  - Toggle markers, add toggleable mean and median markers
- Split area shading at user income
- Let people share screenshot of their chart
- Save user guesses in db
