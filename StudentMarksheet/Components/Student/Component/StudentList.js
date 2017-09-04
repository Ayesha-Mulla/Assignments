import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { Checkbox, FormGroup, Row, FormControl } from 'react-bootstrap';

//data
import json from '../../../result.json';

//action
import { getStudent } from '../Action/GetStudent';

//other component
import List from '../../List/Component/List';

//config
import { Configurations } from '../../../Utils/config';

//strings costants
import Strings from '../../../Resources/Strings/Strings';


class StudentList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            studList: []
        }
        this.selectedCheckboxes = [1, 2, 3, 4];
    }

    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired
        };
    }



    /**load data on page load */
    componentWillMount() {
        this.getStudentList("");
    }


    /*
    * gets list of students with serached value first/last name
    */
    getStudentList = (searchValue) => {

        var searchValue = searchValue;// ReactDOM.findDOMNode(this.refs.refSearch).value;

        let checkboxIndex = this.selectedCheckboxes;
        let LocalList = [];

        json.results.map(function (listItem, index) {
            let percentage = Math.round(((listItem.marks.english + listItem.marks.hindi + listItem.marks.mathematics) / 300) * 100);
            if (searchValue != "") {
                if ((listItem.firstName.toUpperCase()).includes(searchValue.toUpperCase()) || (listItem.lastName.toUpperCase()).includes(searchValue.toUpperCase())) {
                    if (checkboxIndex.length > 0) {
                        for (let j = 0; j < checkboxIndex.length; j++) {
                            switch (checkboxIndex[j]) {
                                case 1: if (percentage > 75) {
                                    LocalList.push(listItem);
                                }
                                    break;
                                case 2: if (percentage < 75 && percentage >= 65) {
                                    LocalList.push(listItem);
                                }
                                    break;
                                case 3: if (percentage < 65 && percentage >= 35) {
                                    LocalList.push(listItem);
                                }
                                    break;

                                case 4: if (percentage < 35) {
                                    LocalList.push(listItem);
                                }
                                    break;
                            }
                        }
                    }
                    else {
                        LocalList.push(listItem);
                    }
                }
            }
            else {
                if (checkboxIndex.length > 0) {
                    for (let j = 0; j < checkboxIndex.length; j++) {
                        switch (checkboxIndex[j]) {
                            case 1: if (percentage > 75) {
                                LocalList.push(listItem);
                            }
                                break;
                            case 2: if (percentage < 75 && percentage >= 65) {
                                LocalList.push(listItem);
                            }
                                break;
                            case 3: if (percentage < 65 && percentage >= 35) {
                                LocalList.push(listItem);
                            }
                                break;

                            case 4: if (percentage < 35) {
                                LocalList.push(listItem);
                            }
                                break;
                        }
                    }
                }
            }
        });
        this.setState({
            studList: LocalList
        });
    };

    /**
     * search button handle click
     */
    btnHandleClick = () => {
        var searchValue = ReactDOM.findDOMNode(this.refs.refSearch).value;
        this.getStudentList(searchValue);
    }

    /**
     * check box toggle event
     * remove from checkbox array if uncheck/add if checked
     */
    toggleCheckbox = (evt) => {
        if (this.selectedCheckboxes.includes(parseInt(evt.target.value))) {
            this.selectedCheckboxes.splice(this.selectedCheckboxes.indexOf(parseInt(evt.target.value)), 1);
        } else {
            this.selectedCheckboxes.push(parseInt(evt.target.value));
        }

        var searchValue = ReactDOM.findDOMNode(this.refs.refSearch).value;
        this.getStudentList(searchValue);
    }


    /**
     * handle click event of each list item
     */

    handleItemClick = (dataitem) => {
        //fill up the details of clecked student and dispatch method
        this.props.getStudent(dataitem);
        //go to details page
        this.context.router.push(Configurations.StudentDetailsPath);
    }


    /**
     * render List of student
     * List compenent is custom component
     */
    renderTable = () => {
        let list = this.state.studList;
        var columns = ["First Name", "Last Name", "Percentage"]
        if (list.length > 0) {
            //return ( this.renderResultRows(list) );
            return (
                <List
                    columns={columns}
                    data={list}
                    itemClick={this.handleItemClick}
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

    renderResultRows = (data) => {
        return data.map((song) => {  // anon func maintains scope!
            // Pass in a function to our onClick, and make it anon
            // to maintain scope.  The function body can be anything
            // which will be executed on click only.  Our song value
            // is maintained via a closure so it works.
            return (
                <tr onClick={() => this.handleItemClick(song)}>
                    <td data-title="firstName" onClick={() => this.handleItemClick(song, false)}>{song.firstName}</td>
                    <td data-title="lastName">{song.lastName}</td>
                    {/*<td data-title="Year">{song.S_YEAR}</td>*/}
                </tr>
            );
        });  // no need to bind with anon function
    }

    // student list page UI
    render() {
        return (
            <div id="studentList">
                <label className="lblHeaderTitle" >{Strings.StudentList}</label>
                <Row className="no_margin_left_right">
                    <div id="error_msg" className="errorMessage" ></div>
                </Row>
                <Row>
                    <div className="col-sm-9">
                        <FormGroup controlId="formValidationError1">
                            <FormControl name="searchStud" placeholder={Strings.SearchStudent} className="form-control" type="text" ref="refSearch" />
                        </FormGroup>
                    </div>
                    <div className="col-sm-3">
                        <input value={Strings.Serach} onClick={this.btnHandleClick} className="btn btn-primary btnSearch" type="submit" />

                    </div>
                </Row>
                <Row>
                    <FormGroup>
                        <div className="col-sm-12">
                            <div className="col-sm-6">
                                <Checkbox onChange={this.toggleCheckbox} value="1" defaultChecked>
                                    {Strings.Distinction}
                                </Checkbox>
                            </div>
                            <div className="col-sm-6">
                                <Checkbox onChange={this.toggleCheckbox} value="2" defaultChecked>
                                    {Strings.FirstClass}
                                </Checkbox>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="col-sm-6">
                                <Checkbox onChange={this.toggleCheckbox} value="3" defaultChecked>
                                    {Strings.SecondClass}
                                </Checkbox>
                            </div>
                            <div className="col-sm-6">
                                <Checkbox onChange={this.toggleCheckbox} value="4" defaultChecked>
                                    {Strings.Failed}
                                </Checkbox>
                            </div>
                        </div>
                    </FormGroup>
                </Row>
                <br />
                <div>
                    {this.renderTable()}
                </div>

            </div>
        );
    }
}


function mapStateToProps(state) {
    return {

    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        getStudent: getStudent
    }, dispatch);
}


export default connect(mapStateToProps, matchDispatchToProps)(StudentList);