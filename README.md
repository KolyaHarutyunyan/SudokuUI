This project renders an interactive Sudoku grid UI for solving puzzles.

-   [Features](#features)
    -   [Current](#current)
    -   [Planned](#planned)
    -   [Removed](#removed)
-   [Installation and Use](#installation-and-use)
-   [Development Notes](#development-notes)
    -   [API Integration](#api-integration)
    -   [Linting](#linting)
    -   [Styling](#styling)
        -   [CSS Modules](#css-modules)
        -   [Sass](#sass)
    -   [Testing](#testing)
-   [Acknowledgements](#acknowledgements)

## Features

### Current

-   'Entry' and 'Solve' modes with behind-the-scenes solution storage
    -   Connects to `sudoku-api` for sudoku and solution generation
-   Pencil-marking notation (little numbers in cells)
    -   Central and Corner pencil marks supported
    -   Clear all pencil marks via a button
-   Input Validation
    -   For Obvious Mistakes (same number in a row / column / 3x3 block)
    -   For All Mistakes (using the puzzle's solution.)
-   Generate puzzles of different difficulty levels from API
-   Accessibility
    -   Input into Sudoku Grid using only a keyboard

### Planned

-   Toast notifications for API error handling.
-   Should invoke API call to try and solve a captured puzzle once clicked into Solve mode
    -   If failed to find a unique solution, show an alert message.
-   Add a "Save" button that will save the current state of the board in local storage / cookie / somehow so it will persist for the user.
    -   Mostly just practice with data persistence. Writeup the pros & cons of local storage / cookie somewhere.
-   Accessibility improvements
    -   Fix disabled `eslint` rules
    -   Maybe a Skip Link to get to the Sidebar config settings
    -   Keyboard shortcuts
        -   Modal to view full list
            -   Tabtrapping in the Modal
    -   See Frontend Masters [course](https://frontendmasters.com/courses/web-accessibility/)
-   Ability to color code cells?
-   Ability to highlight multiple cells and input values / pencil marks in them all at once
    -   This isn't useful for traditional sudoku, but is an interesting challenge nonetheless.
    -   Would need to check for the `CTRL` key in `handleKeyDown` and if found, "highlight" the cell. Probably need to track currently highlighted cells in redux. Highlighted cells can have special styling too.
-   Consistent UI styling
-   Interactive tutorial, like what they have on `https://coolors.co`
-   Deploy somewhere :)

### Removed

-   Easily input numbers by moving your mouse inside of each cell
    -   The numbers 1 through 9 will appear as you move your mouse from the upper left to the lower right of a cell
    -   Logic is in `HoverGrid` component, implementation removed in favor of new pencil marking features.

## Installation and Use

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), so getting up and running is the standard:

`npm install`

`npm start`

## Development Notes

### API Integration

Currently (in development) the UI setups a CRA proxy to `localhost:4000`, where the `sudoku-api` is expected to be running, listening for requests. This means that while the UI runs on `localhost:3000`, API requests will appear to be coming from `localhost:4000` thanks to CRA. This avoids some CORS issues - more info [here](https://facebook.github.io/create-react-app/docs/proxying-api-requests-in-development).

### Linting

We use the `airbnb` [eslint configuration](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) as our baseline linting setup, with some minor rule modifications (see the `package.json` file). We also use the [standard stylelint-config](https://github.com/stylelint/stylelint-config-standard) for linting our CSS. Our eslint + stylelint + prettier setup is run as a precommit hook [using](https://medium.com/@bartwijnants/using-prettier-and-husky-to-make-your-commits-save-2960f55cd351) `husky` and `lint-staged`.

### Styling

#### CSS Modules

We make use of Create React App's [built-in support](https://facebook.github.io/create-react-app/docs/adding-a-css-modules-stylesheet) (as of v2) for CSS Modules which scopes styles to avoid `className` collisions. This requires importing and using our stylesheets like so:

```js
import styles from "styleSheetName.module.css"

// ...
render() {
    return <div className={styles.foo}></div>
}
```

as opposed to:

```js
import "styleSheetName.css"

// ...
render() {
    return <div className="foo"></div>
}
```

#### Sass

**TODO** :)

### Testing

We use `react-testing-library` to test the app since RTL [encourages](https://github.com/testing-library/react-testing-library#the-problem) good quality, maintainable tests that don't focus on implementation details.

The standard `npm test` will run the app's test suite. To get a coverage report, you can run `npm test -- --coverage` or use the coverage script via `npm run coverage` (defined in the `package.json` file).

## Acknowledgements

The UI and features for this app take inspiration from [Duncan's SuDoku Solver](http://www.littlegogs.com/) and Cracking the Cryptic's solver.
