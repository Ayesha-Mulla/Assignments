import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {  Table, Row, Col } from 'react-bootstrap';

import Strings from '../../../Resources/Strings/Strings';

class List extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * render each column provided by parent component
     */
    renderColumns = () => {
        return (
            <tr>
                {
                    this.props.columns.map((columnsVal, index) => {

                        return (
                            <th key={index}>
                                <Row className="no_margin_left_right">
                                    <Col sm={12} className="noPadding">
                                        {columnsVal}
                                    </Col>
                                </Row>
                            </th>
                        )
                    })

                }
            </tr>
        );
    }

    /**
     * by iteration each colum add data into it
     */
    addEachData = (column, listItem) => {
        let tdData;
        if (column == "First Name") {
            tdData = <div className="listData contentWidth">
                <a
                    key={column.key + "_" + listItem.firstName}
                    onClick={() => this.itemClick(listItem)}
                >
                    {listItem.firstName}
                </a>
            </div>;
        }
        else if (column == "Last Name") {
            tdData = <div className="listData contentWidth">
                <a
                    key={column.key + "_" + listItem.lastName}
                    onClick={() => this.itemClick(listItem)}
                >
                    {listItem.lastName}
                </a>
            </div>;
        }
        else if (column == "Percentage") {
            let perc = Math.round(((listItem.marks.english + listItem.marks.hindi + listItem.marks.mathematics) / 300) * 100);

            tdData = <div
                className="listData contentWidth"
                key={column.key + "_" + perc}>
                {perc}
            </div>;
        }
        else if (column == "Total") {
            let total = (listItem.marks.english + listItem.marks.hindi + listItem.marks.mathematics);

            tdData = <div
                className="listData contentWidth"
                key={column.key}>
                {total}
            </div>;
        }
        else if (column == "English") {

            tdData = <div
                className="listData contentWidth"
                key={column.key + "_" + listItem.marks.english}>
                {(listItem.marks.english)}
            </div>;
        }
        else if (column == "Hindi") {
            tdData = <div
                className="listData contentWidth"
                key={column.key + "_" + listItem.marks.hindi}>
                {listItem.marks.hindi}
            </div>;
        }
        else if (column == "Mathematics") {

            tdData = <div
                className="listData contentWidth"
                key={column.key + "_" + listItem.marks.mathematics}>
                {listItem.marks.mathematics}
            </div>;
        }

        return tdData;
    };

    /**
     * Create rows in table
     * to-do: THIS create row can be more genric based on data we paas to compnent
     */
    createRows = (listItem, rowNumber) => {
        //get columns
        let columns = this.props.columns;
        //Get row
        var rowData = [];

        for (var index = 0; index < columns.length; index++) {
            rowData[index] = <td key={columns[index]} className="centerAlign"  >{this.addEachData(columns[index], listItem)}</td>;
        }
        return rowData;
    };

    /**render list - colum + cell data */
    renderList = (list) => {
        return list.map((data, index) => (
            <tr key={index} >{this.createRows(data, index)}</tr>));
    };

    /**
     * render table
     */
    render() {
        const { itemClick } = this.props;
        this.itemClick = itemClick;

        var list = [];
        if (this.props.data) {
            list = this.props.data;
        }
        return (
            <Col xs={12} className="noPadding ListTable">
                <Table responsive striped hover >
                    <tHead>
                        {this.renderColumns()}
                    </tHead>
                    <tBody>
                        {this.renderList(list)}
                    </tBody>
                </Table>
            </Col>
        );
    }
}

export default List;
