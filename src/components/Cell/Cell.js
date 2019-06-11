import React from "react";
import "./Cell.css";
import HoverGrid from "../HoverGrid/HoverGrid";

class Cell extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleMouseClick = this.handleMouseClick.bind(this);
        this.updateCellValue = this.updateCellValue.bind(this);
        this.updatePencilMarks = this.updatePencilMarks.bind(this);

        const { value } = this.props;

        this.state = {
            pencilMarks: [],
            value: value || "" // the "big number" in the cell, if any
        };
    }

    updatePencilMarks(number) {
        const { pencilMarks } = this.state;
        const updatedPencilMarks = pencilMarks.includes(number)
            ? pencilMarks.filter(pencilMark => pencilMark !== number)
            : [...pencilMarks, number];

        this.setState({
            pencilMarks: updatedPencilMarks
        });
    }

    // Update the "big number" in the cell
    updateCellValue(number) {
        const { value: cellValue } = this.state;
        const newCellValue = cellValue === number ? null : number;

        this.setState({
            value: newCellValue
        });
    }

    handleMouseClick(number) {
        if (this.props.entryMethod === "pencilMarks") {
            this.updatePencilMarks(number);
        } else {
            this.updateCellValue(number);
        }
    }

    render() {
        const { entryMethod } = this.props;
        const { pencilMarks, value } = this.state;

        const shouldShowBigNumberOnHover = entryMethod === "numbers";

        if (value !== "") {
            return (
                // TODO: at some point we'll need to distinguish between fixed values (given from puzzle) and user-inputted values that can be deleted.
                <div className="cell">
                    <div className="valueWrapper">{value}</div>
                </div>
            );
        }

        return (
            <div className="cell">
                <HoverGrid
                    handleClick={value => this.handleMouseClick(value)}
                    pencilMarks={pencilMarks}
                    shouldShowBigNumberOnHover={shouldShowBigNumberOnHover}
                />
            </div>
        );
    }
}

export default Cell;
