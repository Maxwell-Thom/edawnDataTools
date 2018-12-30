// src/js/components/App.jsx
import React from 'react'
import Constants from './../constants/Constants'
import DataSourceAccordion from './../components/DataSourceAccordion'
import ColumnDropdown from './../components/ColumnDropdown'
import * as Caspio from './../apis/Caspio'

import {
  Grid,
  Segment,
  Button,
  Progress,
  Label
} from 'semantic-ui-react'

import {
  connect
} from "react-redux";

import {
  authorize,
  requestDataSources
} from './../apis/Caspio'

import {
  setJobRunning
} from "./../actions/index";

import {
  getProspectEmail
} from './../apis/Prospect'

const mapStateToProps = state => {
  return {
    caspioAuthToken: state.caspioAuthToken,
    caspioViews: state.caspioViews,
    caspioTables: state.caspioTables,
    selectedDataSourceColumns: state.selectedDataSourceColumns,
    selectedDataSourceDomain: state.selectedDataSourceDomain,
    selectedDataSourceUUID: state.selectedDataSourceUUID,
    selectedDataSourceFirstName: state.selectedDataSourceFirstName,
    selectedDataSourceLastName: state.selectedDataSourceLastName,
    selectedDataSource: state.selectedDataSource,
    selectedDataSourceType: state.selectedDataSourceType,
    jobRunning: state.jobRunning
  };
}

class App extends React.Component {

    constructor() {
      super()
      this.state = {
        currentPage: 4,
        totalRecords: 0,
        completeRecords: 0,
        percent: 0
      }
      this.run = this.run.bind(this)
    }

    componentDidMount() {
      this.props.authorize()
    }

    componentDidUpdate() {
      if (this.props.caspioAuthToken !== null) {
        if (this.props.caspioTables.length === 0) {
          this.props.requestDataSources(this.props.caspioAuthToken, Constants.dataSourceEnum.tables)
        }
        if (this.props.caspioViews.length === 0) {
          this.props.requestDataSources(this.props.caspioAuthToken, Constants.dataSourceEnum.views)
        }
      }
    }

    async getEmails(records) {
      if (records.length > 0) {
        for (var i = 0; i < records.length; i++) {
          await getProspectEmail(
              records[i][this.props.selectedDataSourceDomain],
              records[i][this.props.selectedDataSourceFirstName],
              records[i][this.props.selectedDataSourceLastName]
            )
            .then(function(email) {
              this.setState({
                completeRecords: this.state.completeRecords+1
              })
              this.setState({
                percent: (this.state.completeRecords/this.state.totalRecords)*100
              })
            }.bind(this))
        }
      }
    }

    async getRecords(records) {
      await Caspio.requestData(
          this.props.caspioAuthToken,
          this.state.currentPage,
          Constants.caspioPageSize,
          this.props.selectedDataSourceType,
          this.props.selectedDataSource
        )
        .then(function(records) {
          this.setState({
            currentPage: this.state.currentPage + 1
          })
          this.setState({
            totalRecords: this.state.totalRecords + records.data.Result.length
          })
          console.log("currentPage: ", this.state.currentPage)
          this.getEmails(records.data.Result)

          if (records.data.Result.length === Constants.caspioPageSize) {
            return this.getRecords()
          } else {
            Caspio.requestData(this.props.caspioAuthToken, this.state.currentPage, Constants.caspioPageSize, this.props.selectedDataSourceType, this.props.selectedDataSource)
              .then(function(records) {
                this.setState({
                  currentPage: this.state.currentPage + 1
                })
                this.setState({
                  totalRecords: this.state.totalRecords + records.data.Result.length
                })
                console.log("currentPage: ", this.state.currentPage)
                this.getEmails(records.data.Result)
              }.bind(this))
          }
        }.bind(this))
    }

    run = () => {
      this.props.setJobRunning(true)
      this.getRecords()
    }

  render() {
    return (
      <Segment placeholder>
        <Grid centered divided='vertically' columns={2}>
          <Grid.Row centered columns={2} >
            <Grid.Column>
              <DataSourceAccordion />
            </Grid.Column>
          </Grid.Row>
          { this.props.selectedDataSourceColumns.length > 0 ? (
            <Grid.Row centered columns={4} >
              <Grid.Column>
                <Label>{Constants.DataSourceColumnEnum.firstName}</Label>
                <ColumnDropdown dataSourceColumn={Constants.DataSourceColumnEnum.firstName} />
              </Grid.Column>
              <Grid.Column>
                <Label>{Constants.DataSourceColumnEnum.lastName}</Label>
                <ColumnDropdown dataSourceColumn={Constants.DataSourceColumnEnum.lastName} />
              </Grid.Column>
              <Grid.Column>
                <Label>{Constants.DataSourceColumnEnum.UUID}</Label>
                <ColumnDropdown dataSourceColumn={Constants.DataSourceColumnEnum.UUID} />
              </Grid.Column>
              <Grid.Column>
                <Label>{Constants.DataSourceColumnEnum.domain}</Label>
                <ColumnDropdown dataSourceColumn={Constants.DataSourceColumnEnum.domain} />
              </Grid.Column>
            </Grid.Row>
          ):null}
          { (this.props.selectedDataSourceDomain &&
            this.props.selectedDataSourceUUID &&
            this.props.selectedDataSourceFirstName &&
            this.props.selectedDataSourceLastName ) ? (
              <Grid.Row centered columns={!this.props.jobRunning ? 5:1} >
                { !this.props.jobRunning ? (
                  <Grid.Column>
                    <Button onClick={this.run}>Run</Button>
                  </Grid.Column>
                ):(
                  <Grid.Column>
                    <Progress percent={this.state.percent} indicating />
                  </Grid.Column>
                )}
              </Grid.Row>
            ):null}
        </Grid>
      </Segment>
    )
  }
}

export default connect(
  mapStateToProps, {
    authorize,
    requestDataSources,
    setJobRunning
  }
)(App);

//export default connect(null, mapDispatchToProps)(App);
