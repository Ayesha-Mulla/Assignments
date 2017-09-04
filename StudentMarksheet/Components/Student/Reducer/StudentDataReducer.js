import { STUDENT_DATA_ACTION } from '../Constants';


const INTIAL_STATE = {
   
};

export default function (state = INTIAL_STATE, action) {
    switch (action.type) {

        case STUDENT_DATA_ACTION:
            return action.studentObjectPayload;
            break;

        default:
            return state;
    }
}
