import { connect } from "react-redux";
import { SidebarSettings } from "./SidebarSettings";
import {
    toggleEntryMethod,
    toggleShowAllErrors,
    toggleShowObviousErrors
} from "../../ducks/config";
import { checkValidSolution } from "../../ducks/sudoku";

function mapStateToProps({ config: { isInSolveMode, isUsingPencilMarks } }) {
    return {
        isInSolveMode,
        isUsingPencilMarks
    };
}

const mapDispatchToProps = {
    checkValidSolution,

    toggleEntryMethod,
    toggleShowAllErrors,
    toggleShowObviousErrors
};

const ConnectedSidebarSettings = connect(
    mapStateToProps,
    mapDispatchToProps,
    null
)(SidebarSettings);

export default ConnectedSidebarSettings;