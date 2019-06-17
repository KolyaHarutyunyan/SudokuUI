import { connect } from "react-redux";
import { SudokuGrid } from "./SudokuGrid";

// mapStateToProps has root state as argument, we destructure it
function mapStateToProps({ sudoku }) {
    const { cells } = sudoku;
    return {
        cells
    };
}

const mapDispatchToProps = {};

const ConnectedSudokuGrid = connect(
    mapStateToProps,
    mapDispatchToProps,
    null
)(SudokuGrid);

export default ConnectedSudokuGrid;
