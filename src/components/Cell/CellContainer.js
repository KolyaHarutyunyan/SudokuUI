import { connect } from "react-redux";
import { Cell } from "./Cell";
import {
    addCellValue,
    selectHasError,
    selectHasObviousError,
    selectIsOriginalCell,
    updateCellValue
} from "../../ducks/sudoku";
import { toggleEntryMethod } from "../../ducks/config";

// mapStateToProps has root state as first argument, we destructure it
function mapStateToProps(
    {
        config: {
            isInSolveMode,
            isUsingPencilMarks,
            shouldShowAllErrors,
            shouldShowPencilMarks,
            shouldShowObviousErrors
        },
        sudoku
    },
    ownProps
) {
    const cellIndex = ownProps.index;
    const hasError = selectHasError(sudoku, cellIndex);
    const hasObviousError = selectHasObviousError(sudoku, cellIndex);
    const isOriginalCell = selectIsOriginalCell(sudoku, cellIndex);

    return {
        isFixed: isInSolveMode && isOriginalCell,
        isInSolveMode,
        isUsingPencilMarks,
        shouldHighlightError:
            (hasError && shouldShowAllErrors) || (hasObviousError && shouldShowObviousErrors),
        shouldShowPencilMarks
    };
}

const mapDispatchToProps = {
    addCellValue,
    toggleEntryMethod,
    updateCellValue
};

const ConnectedCell = connect(
    mapStateToProps,
    mapDispatchToProps,
    null
)(Cell);

export default ConnectedCell;
