import { STUDENT_DATA_ACTION } from '../Constants';

export const getStudent = (studentData) => {
    console.log("You selected student data: ", studentData);
    return {type: STUDENT_DATA_ACTION, studentObjectPayload: studentData}
};
