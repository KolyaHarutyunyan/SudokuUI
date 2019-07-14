import { ofType } from "redux-observable";
import { catchError, map, mergeMap, pluck } from "rxjs/operators";
import { of } from "rxjs";
import { ajax } from "rxjs/ajax";

/*
 * action types
 */

export const GET_SUDOKU = "GET_SUDOKU";
export const GET_SUDOKU_SUCCESS = "GET_SUDOKU_SUCCESS";
export const GET_SUDOKU_FAILURE = "GET_SUDOKU_FAILURE";

/* User enters a number into a cell for the first time, in Capture mode */
export const ADD_CELL_VALUE = "ADD_CELL_VALUE";

/* User enters a number into a cell in Solve mode */
export const UPDATE_CELL_VALUE = "UPDATE_CELL_VALUE";
export const UPDATE_CELL_PENCIL_MARK = "UPDATE_CELL_PENCIL_MARK";

export const CLEAR_ALL_CELL_VALUES = "CLEAR_ALL_CELL_VALUES";
export const CLEAR_ALL_PENCIL_MARKS = "CLEAR_ALL_PENCIL_MARKS";
export const RESET_TO_ORIGINAL_CELLS = "RESET_TO_ORIGINAL_CELLS";

/* todo */
export const GET_SOLUTION = "GET_SOLUTION";
export const GET_SOLUTION_SUCCESS = "GET_SOLUTION_SUCCESS";
export const GET_SOLUTION_FAILURE = "GET_SOLUTION_FAILURE";

/*
 * action creators
 */

export function addCellValue(index, value) {
    return { type: ADD_CELL_VALUE, index, value };
}

export function clearAllCellValues() {
    return { type: CLEAR_ALL_CELL_VALUES };
}

export function clearAllPencilMarks() {
    return { type: CLEAR_ALL_PENCIL_MARKS };
}

export function getSudoku() {
    return { type: GET_SUDOKU };
}

export function getSolution(unsolvedSudoku) {
    return { type: GET_SOLUTION, sudoku: unsolvedSudoku };
}

export function getSolutionSuccess(solution) {
    return { type: GET_SOLUTION_SUCCESS, solution };
}

export function getSolutionFailure(error) {
    return { type: GET_SOLUTION_FAILURE, error };
}

export function getSudokuSuccess(newSudoku) {
    return { type: GET_SUDOKU_SUCCESS, sudoku: newSudoku };
}

export function getSudokuFailure(error) {
    return { type: GET_SUDOKU_FAILURE, error };
}

export function resetToOriginalCells() {
    return { type: RESET_TO_ORIGINAL_CELLS };
}

export function updateCellValue(index, value) {
    return { type: UPDATE_CELL_VALUE, index, value };
}

export function updateCellPencilMark(index, pencilMark) {
    return { type: UPDATE_CELL_PENCIL_MARK, index, pencilMark };
}

function getDefaultCellObject() {
    return {
        hasError: false,
        hasObviousError: false,
        isOriginalValue: false,
        pencilMarks: [],
        value: ""
    };
}

const initialState = {
    /* The initial sudoku puzzle configuration */
    sudoku: Array(81).fill(""),

    /* The solution to the initial sudoku puzzle */
    solution: Array(81).fill(""),

    /* The current state of the board */
    cells: Array(81).fill(getDefaultCellObject())
};

/*
 * Reducer Utils
 */
// Returns true if there is an error with the new cell value
function checkForErrorByIndex(state, index, newValue) {
    return state.solution[index] !== newValue;
}

function getValuesInSameRowByIndex(cells, index) {
    const row = Math.floor(index / 9);
    const solutionValuesInRow = cells.slice(row * 9, row * 9 + 9);
    return solutionValuesInRow;
}

function getValuesInSameColumnByIndex(cells, index) {
    const column = index % 9;
    const solutionValuesInColumn = [
        cells[column],
        cells[column + 9],
        cells[column + 18],
        cells[column + 27],
        cells[column + 36],
        cells[column + 45],
        cells[column + 54],
        cells[column + 63],
        cells[column + 72]
    ];
    return solutionValuesInColumn;
}

// TODO: Obviously a better algorithm exists for this...
function getValuesInSameBlockByIndex(cells, index) {
    const row = Math.floor(index / 9);
    const column = index % 9;

    let rowIndicesToGet = [];
    if (row === 0 || row === 1 || row === 2) {
        rowIndicesToGet = [0, 1, 2];
    } else if (row === 3 || row === 4 || row === 5) {
        rowIndicesToGet = [3, 4, 5];
    } else {
        // if (row === 6 || row === 7 || row === 8) {
        rowIndicesToGet = [6, 7, 8];
    }

    let columnIndicesToGet = [];
    if (column === 0 || column === 1 || column === 2) {
        columnIndicesToGet = [0, 1, 2];
    } else if (column === 3 || column === 4 || column === 5) {
        columnIndicesToGet = [3, 4, 5];
    } else {
        // if (column === 6 || column === 7 || column === 8) {
        columnIndicesToGet = [6, 7, 8];
    }

    const values = [];
    rowIndicesToGet.forEach(rowIndex => {
        columnIndicesToGet.forEach(columnIndex => {
            values.push(cells[rowIndex * 9 + columnIndex]);
        });
    });

    return values;
}

function checkForObviousErrorByIndex(state, index, newValue) {
    const obviousCells = [
        ...getValuesInSameBlockByIndex(state.cells, index),
        ...getValuesInSameColumnByIndex(state.cells, index),
        ...getValuesInSameRowByIndex(state.cells, index)
    ];

    return !!obviousCells.find(cell => cell.value === newValue && newValue !== "");
}

/**
 * Generates and returns a copy of an array with a newItem at a specified index.
 * (No mutation / side effects!)
 *
 * @param array - array to which we wish to add the newItem
 * @param index - index of the array at which we wish to add the newItem
 * @param newItem - the new value to add to the array
 * @returns arr - new array with newItem at index
 */
function safelyUpdateArrayByIndex(array, index, newItem) {
    return [...array.slice(0, index), newItem, ...array.slice(index + 1)];
}

/*
 * reducer
 */
export function sudoku(state = initialState, action) {
    switch (action.type) {
        case GET_SUDOKU_SUCCESS: {
            const { sudoku: newSudoku } = action;
            const newCells = Array(81)
                .fill(getDefaultCellObject())
                .map((cell, index) => ({
                    ...cell,
                    value: newSudoku[index]
                }));
            return {
                ...state,
                sudoku,
                cells: newCells
            };
        }
        case GET_SOLUTION_SUCCESS: {
            const { solution } = action;
            return {
                ...state,
                solution
            };
        }
        case ADD_CELL_VALUE: {
            const { index, value: newValue } = action;

            const cellToUpdate = state.cells[index];

            const newCell = {
                ...cellToUpdate,
                value: newValue,
                hasObviousError: false,
                hasError: false,
                isOriginalValue: true
            };

            const newCells = safelyUpdateArrayByIndex(state.cells, index, newCell);

            return {
                ...state,
                cells: newCells
            };
        }
        case CLEAR_ALL_CELL_VALUES: {
            const newCells = Array(81).fill(getDefaultCellObject());

            return {
                ...state,
                cells: newCells
            };
        }
        case CLEAR_ALL_PENCIL_MARKS: {
            const newCells = state.cells.map(cell => ({
                ...cell,
                pencilMarks: []
            }));

            return {
                ...state,
                cells: newCells
            };
        }
        case RESET_TO_ORIGINAL_CELLS: {
            const newCells = state.cells.map(cell => {
                if (!cell.isOriginalValue) {
                    return {
                        ...cell,
                        value: "",
                        hasObviousError: false,
                        hasError: false
                    };
                }
                return cell;
            });

            return {
                ...state,
                cells: newCells
            };
        }
        case UPDATE_CELL_VALUE: {
            const { index, value: newValue } = action;

            const cellToUpdate = state.cells[index];
            const shouldClearCellValue = cellToUpdate.value === newValue;

            const hasObviousError = checkForObviousErrorByIndex(state, index, newValue);
            const hasError = checkForErrorByIndex(state, index, newValue);

            // TODO: Probably should have a separate DELETE_CELL or something
            const newCell = {
                ...cellToUpdate,
                value: shouldClearCellValue ? "" : newValue,
                hasObviousError: shouldClearCellValue ? false : hasObviousError,
                hasError: shouldClearCellValue ? false : hasError
            };

            const newCells = safelyUpdateArrayByIndex(state.cells, index, newCell);

            return {
                ...state,
                cells: newCells
            };
        }
        case UPDATE_CELL_PENCIL_MARK: {
            const { index, pencilMark: pencilMarkToUpdate } = action;

            const cellToUpdate = state.cells[index];

            // If the cellToUpdate contains the pencilMarkToUpdate, remove the pencilMarkToUpdate.
            // Otherwise, add it to the cellToUpdate's pencilMarks.
            const updatedPencilMarks = cellToUpdate.pencilMarks.includes(pencilMarkToUpdate)
                ? cellToUpdate.pencilMarks.filter(pencilMark => pencilMark !== pencilMarkToUpdate)
                : [...cellToUpdate.pencilMarks, pencilMarkToUpdate];

            const newCell = {
                ...cellToUpdate,
                pencilMarks: updatedPencilMarks
            };

            const newCells = safelyUpdateArrayByIndex(state.cells, index, newCell);

            return {
                ...state,
                cells: newCells
            };
        }
        default: {
            return state;
        }
    }
}

/*
 * selectors
 */

export function selectHasError(state, index) {
    return state.cells[index].value !== state.solution[index];
}

export function selectHasObviousError(state, index) {
    return state.cells[index].hasObviousError;
}

export function selectIsOriginalCell(state, index) {
    return state.cells[index].value === state.sudoku[index];
}

export function selectPencilMarks(state, index) {
    return state.cells[index].pencilMarks;
}

/**
 * Listen for GET_SUDOKU action. When found, perform
 * an ajax request to get a sudoku.
 *
 * TODO: Implement difficulty functionality
 */
export const getSudokuEpic = action$ =>
    action$.pipe(
        ofType(GET_SUDOKU),
        // eslint-disable-next-line no-unused-vars
        mergeMap(action =>
            // TODO: How does magic work? It recognizes this is not an absolute path automagically?
            ajax.getJSON("/sudoku?difficulty=easy").pipe(
                // use mergeMap to dispatch multiple actions.
                // (otherwise, could just use map and return the action itself, i.e.
                // map(response => getSudokuSuccess(response)))
                mergeMap(response => of(getSudokuSuccess(response), getSolution(response))),
                catchError(error => {
                    // eslint-disable-next-line no-console
                    console.log("Failed to GET sudoku, error: ", error);
                    return of(getSudokuFailure(error));
                })
            )
        )
    );

/**
 * Listen for GET_SOLUTION action. When found, perform
 * an ajax request to get the solution to the sudoku.
 *
 */
export const getSolutionEpic = action$ =>
    action$.pipe(
        ofType(GET_SOLUTION),
        // eslint-disable-next-line no-unused-vars
        mergeMap(action =>
            // TODO: How does magic work? It recognizes this is not an absolute path automagically?
            ajax({
                url: "/sudoku",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    unsolvedSudoku: action.sudoku
                }
            }).pipe(
                pluck("response"),
                map(response => getSolutionSuccess(response)),
                catchError(error => {
                    // eslint-disable-next-line no-console
                    console.log("Failed to POST sudoku to get solution, error: ", error);
                    return of(getSolutionFailure(error));
                })
            )
        )
    );
