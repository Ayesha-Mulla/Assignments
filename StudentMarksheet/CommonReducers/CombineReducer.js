import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import StudentDataReducer from '../Components/Student/Reducer/StudentDataReducer';

const allReducers = combineReducers({
    routing: routerReducer,
    studentData: StudentDataReducer,
});

export default allReducers;
