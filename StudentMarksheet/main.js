import './node_modules/bootstrap/dist/css/bootstrap.css';
import './Resources/Styles/styles.css';

import React from 'react';
import ReactDom from "react-dom";
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory, browserHistory } from 'react-router';
import createHistory from 'history/lib/createHashHistory';
import { syncHistoryWithStore } from 'react-router-redux'
import * as reduxThunk from 'redux-thunk';
import { loadState, saveState } from './localStorage';
import allReducers from './CommonReducers/CombineReducer';

// components
import App from './Components/App/Component/App';
import StudentList from './Components/Student/Component/StudentList';
import StudentDetails from './Components/Student/Component/StudentDetails';
//config
import { Configurations } from './Utils/config';

//creating a store
const persistedState = loadState();
const createStoreWithMiddleware = applyMiddleware(reduxThunk.default)(createStore);
const store = createStoreWithMiddleware(allReducers, persistedState);

const history = syncHistoryWithStore(createHistory(), store)
store.subscribe(() => {
    saveState(store.getState());
});

ReactDom.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path={Configurations.StudentListPath} component={App}>
                <IndexRoute component={StudentList} />
            </Route>
            <Route path={Configurations.StudentDetailsPath} component={App}>
                <IndexRoute component={StudentDetails} />
            </Route>
        </Router>
    </Provider>
    , document.getElementById('root'));
