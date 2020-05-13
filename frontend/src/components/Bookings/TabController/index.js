import React from 'react';

import './TabController.css';

const TabController = props => {
    return (
        <div className='tab-control'>
            <button
                className={props.activeTab==='list' ? 'active' : ''}
                onClick={props.onChange.bind(this, 'list')}
            >
                List View
            </button>
            <button
                className={props.activeTab==='chart' ? 'active' : ''}
                onClick={props.onChange.bind(this, 'chart')}
            >
                Chart View
            </button>
        </div>
    );
};
export default TabController;