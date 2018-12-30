import React from "react";
import {
  connect
} from "react-redux";
import Constants from './../constants/Constants'
import uuid from "uuid";
import {
  Dropdown
} from 'semantic-ui-react'
import {
  setDataSourceUUID,
  setDataSourceDomain,
  setDataSourceLastName,
  setDataSourceFirstName
} from "./../actions/index"

class ColumnDropdown extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this)
    }

    handleChange = (e, {
      value
    }) => {
      switch (this.props.dataSourceColumn) {
        case Constants.DataSourceColumnEnum.UUID:
          this.props.setDataSourceUUID(value ? value : null)
          break
        case Constants.DataSourceColumnEnum.domain:
          this.props.setDataSourceDomain(value ? value : null)
          break
        case Constants.DataSourceColumnEnum.lastName:
          this.props.setDataSourceLastName(value ? value : null)
          break
        case Constants.DataSourceColumnEnum.firstName:
          this.props.setDataSourceFirstName(value ? value : null)
          break
        default:
          return
      }
    }

  render() {
    return (
      <Dropdown
        fluid
        search
        selection
        placeholder={ this.props.dataSourceColumn }
        onChange={ this.handleChange }
        options={
          this.props.selectedDataSourceColumns.map( data => {
            return { key: uuid(), text: data, value: data }
          })
        }
      />
    )
  }
}

export default connect(
  (state) => ({
    selectedDataSourceColumns: state.selectedDataSourceColumns,
  }), {
    setDataSourceUUID,
    setDataSourceDomain,
    setDataSourceLastName,
    setDataSourceFirstName
  }
)(ColumnDropdown)
