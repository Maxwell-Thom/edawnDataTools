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
  setDataSourceColumnsCaspio
} from "./../actions/index"

class DataSourceDropdown extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: false
      }
      this.handleChange = this.handleChange.bind(this)
    }

    handleChange = (e, { value }) => {
      if (value) {
        this.props.requestDataSourceColumns(this.props.caspioAuthToken, this.props.dataSourceType, value)
        this.props.setDataSource(value)
        this.props.setDataSourceType(this.props.dataSourceType)
        this.setState({ loading: true})
      }

      this.props.setDataSourceUUID(null)
      this.props.setDataSourceDomain(null)
      this.props.setDataSourceLastName(null)
      this.props.setDataSourceFirstName(null)
      this.props.setDataSourceColumnsCaspio([])
    }

    componentDidUpdate() {
      if (this.props.selectedDataSourceColumns.length > 0 && this.state.loading === true) {
        this.setState({ loading: false})
      }
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
          loading={ this.state.loading }
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
    selectedDataSourceColumns: state.selectedDataSourceColumns,
  }), {
    requestDataSourceColumns,
    setDataSourceUUID,
    setDataSourceDomain,
    setDataSourceLastName,
    setDataSourceFirstName,
    setDataSource,
    setDataSourceType,
    setDataSourceColumnsCaspio
  }
)(DataSourceDropdown)
