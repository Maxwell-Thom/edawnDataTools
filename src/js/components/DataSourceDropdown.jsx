import React from "react";
import {
  connect
} from "react-redux";
import {
  requestDataSourceColumns
} from './../apis/Caspio'
import {
  Dropdown
} from 'semantic-ui-react'
import Constants from './../constants/Constants'
import {
  setDataSourceUUID,
  setDataSourceDomain,
  setDataSourceLastName,
  setDataSourceFirstName,
  setDataSource,
  setDataSourceType,
  setDataSourceTablesCaspio,
  setDataSourceViewsCaspio
} from "./../actions/index"

class DataSourceDropdown extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this)
    }

    handleChange = (e, {
      value
    }) => {
      if (value) {
        this.props.requestDataSourceColumns(this.props.caspioAuthToken, this.props.dataSourceType, value)
        this.props.setDataSource(value)
        this.props.setDataSourceType(this.props.dataSourceType)
      }

      this.props.setDataSourceUUID(null)
      this.props.setDataSourceDomain(null)
      this.props.setDataSourceLastName(null)
      this.props.setDataSourceFirstName(null)
      this.props.setDataSourceTablesCaspio([])
      this.props.setDataSourceViewsCaspio([])
    }

    render() {
        let data = []
        if (this.props.dataSourceType === Constants.dataSourceEnum.views) {
          data = this.props.caspioViews
        } else {
          data = this.props.caspioTables
        }

    return (
      <Dropdown
        clearable
        fluid
        search
        selection
        placeholder={ this.props.dataSourceType }
        onChange={ this.handleChange }
        options={
          data.map( data => (
            { key: data, text: data, value: data }
          ))
        }
      />
    )
  }
}

export default connect(
  (state) => ({
    caspioAuthToken: state.caspioAuthToken,
    caspioViews: state.caspioViews,
    caspioTables: state.caspioTables,
  }), {
    requestDataSourceColumns,
    setDataSourceUUID,
    setDataSourceDomain,
    setDataSourceLastName,
    setDataSourceFirstName,
    setDataSource,
    setDataSourceType,
    setDataSourceTablesCaspio,
    setDataSourceViewsCaspio
  }
)(DataSourceDropdown)
