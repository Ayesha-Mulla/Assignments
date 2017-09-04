import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { Row } from 'react-bootstrap';

//config
import { Configurations } from '../../../Utils/config';


//other component
import List from '../../List/Component/List';
//string constant
import Strings from '../../../Resources/Strings/Strings';



class StudentDetails extends React.Component {

    constructor(props) {
        super(props);
    }

    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }

    /**render student details list */
    renderTable = () => {
        var columns = ["English", "Hindi", "Mathematics", "Total", "Percentage"]
        let list = [];
        list.push(this.props.studentData)
        if (list.length > 0) {
            return (
                <List
                    columns={columns}
                    data={list}
                >
                </List>
            );
        }
        else {
            return (
                <div>
                    <List
                        columns={columns}
                    />
                    <div className="noRecordsAvailable">{Strings.NoRecordsToDisplay}</div>
                </div>
            );
        }
    }

    /**go back to student first list page */
    goBack = () => {
        this.context.router.push(Configurations.StudentListPath);
    }

    // student details list page UI
    render() {
        return (
            <div id="studentDetailsList">
                <Row>
                    <a className="handCursor" onClick={this.goBack}>Click here to go back</a>
                </Row>
                <br></br>
                <Row>
                    {Strings.Name} {this.props.studentData.firstName + " " + this.props.studentData.lastName}
                </Row>
                <br></br>

                {this.renderTable()}

            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        studentData: state.studentData
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}


export default connect(mapStateToProps, matchDispatchToProps)(StudentDetails);