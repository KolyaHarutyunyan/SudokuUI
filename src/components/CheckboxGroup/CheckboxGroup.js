import React from "react";
import PropTypes from "prop-types";
import styles from "./CheckboxGroup.module.css";

export function CheckboxGroup({ checkboxes, title }) {
    return (
        <>
            <span>{title}</span>
            <div className={styles.checkboxGroupWrapper}>
                {checkboxes.map((checkbox) => {
                    const { id, handleSelection, label } = checkbox;
                    return (
                        <div key={id}>
                            <label htmlFor={id}>
                                <input type="checkbox" id={id} onChange={() => handleSelection()} />
                                {label}
                            </label>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

CheckboxGroup.defaultProps = {
    checkboxes: [],
    title: ""
};

CheckboxGroup.propTypes = {
    checkboxes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            handleSelection: PropTypes.func,
            label: PropTypes.string
        })
    ),
    title: PropTypes.string
};
