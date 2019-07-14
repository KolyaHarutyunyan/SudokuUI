import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { ARROW_KEYS } from "../../constants/constants";
import HoverGrid from "../HoverGrid/HoverGrid";
import styles from "./Cell.module.css";

// TODO: Accessibility concerns with onClicks on divs, etc.
export class Cell extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleMouseClick = this.handleMouseClick.bind(this);
    }

    handleKeyDown(event) {
        const {
            index,
            isFixed,
            isUsingPencilMarks,
            toggleEntryMethod,
            updateCellValue,
            updateCellPencilMark
        } = this.props;
        const validDigitInputs = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        const userInput = event.key;
        const userHasPressedAnArrowKey = Object.keys(ARROW_KEYS).includes(event.keyCode.toString());
        const userHasPressedADigit = validDigitInputs.includes(userInput);

        if (userInput === "Delete" && !isFixed) {
            updateCellValue(index, "");
        } else if (userHasPressedADigit && !isUsingPencilMarks) {
            updateCellValue(index, userInput);
        } else if (userHasPressedADigit && isUsingPencilMarks) {
            updateCellPencilMark(index, userInput);
        }
        // TODO: Probably should have a more elegant implementation of keyboard shortcuts
        // at the very least, maybe this should be listening above Cell? SudokuGrid level?
        else if (userInput === "q") {
            toggleEntryMethod();
        } else if (userHasPressedAnArrowKey) {
            // querySelectorAll will return matching element nodes in document order,
            // so we can just use the index of the resulting list. We need not verify
            // the sudokuindex value (https://bit.ly/2Js4qMV)
            const arrowKey = ARROW_KEYS[event.keyCode];
            const { indexAdjustment } = arrowKey;
            const cells = document.querySelectorAll("[sudokuindex]");
            const cellToWhichToFocus = cells[index + indexAdjustment];

            if (
                !arrowKey.specialCaseColumnNumber ||
                index % 9 !== arrowKey.specialCaseColumnNumber
            ) {
                // eslint-disable-next-line no-unused-expressions
                cellToWhichToFocus && cellToWhichToFocus.focus();
            }
        }
    }

    handleMouseClick(number) {
        const {
            addCellValue,
            index,
            isInSolveMode,
            isUsingPencilMarks,
            updateCellPencilMark,
            updateCellValue
        } = this.props;

        if (isUsingPencilMarks) {
            updateCellPencilMark(index, number);
        } else if (isInSolveMode) {
            updateCellValue(index, number);
        } else {
            addCellValue(index, number);
        }
    }

    render() {
        const {
            index,
            isFixed,
            isInSolveMode,
            isUsingPencilMarks,
            pencilMarks,
            shouldHighlightError,
            shouldShowPencilMarks,
            value
        } = this.props;

        const shouldShowBigNumberOnHover = !isUsingPencilMarks;
        const cellHasValue = value !== "";

        const cellStyles = clsx(styles.cell, {
            [styles.error]: shouldHighlightError,
            [styles.new]: !isFixed && isInSolveMode
        });

        return (
            // Users should be able to tab to each cell and input its value from the keyboard
            /* eslint-disable jsx-a11y/no-static-element-interactions */
            /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
            <div
                className={cellStyles}
                onKeyDown={this.handleKeyDown}
                tabIndex="0"
                sudokuindex={index}
            >
                {cellHasValue ? (
                    <div className={styles.valueWrapper}>{value}</div>
                ) : (
                    <HoverGrid
                        handleClick={clickedCellValue => this.handleMouseClick(clickedCellValue)}
                        pencilMarks={shouldShowPencilMarks ? pencilMarks : []}
                        shouldShowBigNumberOnHover={shouldShowBigNumberOnHover}
                        shouldShowPencilMarks={shouldShowPencilMarks}
                    />
                )}
            </div>
        );
    }
}

Cell.defaultProps = {
    isFixed: false, // false if cell value can be deleted
    isInSolveMode: false,
    isUsingPencilMarks: true,
    pencilMarks: [],
    shouldHighlightError: false,
    shouldShowPencilMarks: true,
    value: null
};

Cell.propTypes = {
    addCellValue: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isFixed: PropTypes.bool,
    isInSolveMode: PropTypes.bool,
    isUsingPencilMarks: PropTypes.bool,
    pencilMarks: PropTypes.arrayOf(PropTypes.string),
    shouldHighlightError: PropTypes.bool,
    shouldShowPencilMarks: PropTypes.bool,
    toggleEntryMethod: PropTypes.func.isRequired,
    updateCellValue: PropTypes.func.isRequired,
    updateCellPencilMark: PropTypes.func.isRequired,
    value: PropTypes.string
};
