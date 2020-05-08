import React from 'react';

import './DotSpinner.css';

const DotSpinner = () => {
    return (
        <div className="spinner">
            <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>

    );
};

export default DotSpinner;