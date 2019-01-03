// src/js/components/App.jsx
import React from 'react'
import Constants from './../constants/Constants'
import DataSourceAccordion from './../components/DataSourceAccordion'
import ColumnDropdown from './../components/ColumnDropdown'
import APIList from './../components/APIList'
import LeadsTable from './../components/LeadsTable'
import * as Caspio from './../apis/Caspio'
import { connect } from "react-redux";
import { authorize, requestDataSources } from './../apis/Caspio'
import { addLead, setJobRunning } from "./../actions/index";
import { getProspectEmail } from './../apis/Prospect'
import { getHunterEmail } from './../apis/Hunter'
import Lead from './../prototypes/Lead'
import {
  Grid,
  Segment,
  Button,
  Progress,
  Label
} from 'semantic-ui-react'

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
    jobRunning: state.jobRunning,
    emailAPIs: state.emailAPIs,
    leads: state.leads
  };
}

class App extends React.Component {
    constructor() {
      super()
      this.state = {
        currentPage: 1,
        noApiSelectedFlag: false,
        totalRecords: 0,
        completedRecords: 0,
        percent: 0,
        jobRan: false,
        leads: []
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

    async getRecords(lastCall) {
        await Caspio.requestData(
          this.props.caspioAuthToken,
          this.state.currentPage,
          Constants.caspioPageSize,
          this.props.selectedDataSourceType,
          this.props.selectedDataSource
        )
        .then(function(records) {
          if (records.data.Result.length > 0) {
            this.setState({ totalRecords: this.state.totalRecords + records.data.Result.length})
            for (var i = 0; i < records.data.Result.length; i++) {
              let record = records.data.Result[i]
              let lead = new Lead(
                record[this.props.selectedDataSourceFirstName],
                record[this.props.selectedDataSourceLastName],
                record[this.props.selectedDataSourceUUID],
                record[this.props.selectedDataSourceDomain],
                null,
                null
              )

              this.setState({ leads: this.state.leads.concat(lead)})
            }
          }

          if (records.data.Result.length === Constants.caspioPageSize && !lastCall) {
            this.setState({ currentPage: this.state.currentPage + 1 })
            console.log("currentPage: ", this.state.currentPage)
            return this.getRecords(false)
          } else if (!lastCall) {
            this.setState({ currentPage: this.state.currentPage + 1 })
            console.log("currentPage: ", this.state.currentPage)
            return this.getRecords(true)
          } else {
            console.log(this.state.totalRecords)
            this.state.totalRecords > 0 ? this.processLeads(0) : this.props.setJobRunning(false)
          }
        }.bind(this))
    }

    filterRelevantApis() {
      let relevantApis = this.props.emailAPIs.filter(item => {
        return Object.values(item)[0]
      })
      return relevantApis === undefined ? []:relevantApis
    }

    calculateFinalApi() {
      let relevantApis = this.props.emailAPIs.filter(item => {
        return Object.values(item)[0]
      })
      return relevantApis.slice(-1)[0]
    }

    incrementProgress() {
      this.setState({ completedRecords: this.state.completedRecords + 1 })
      this.setState({percent: (this.state.completedRecords/this.state.totalRecords)*100})
      if (this.state.percent === 100) {
        this.cleanUpJob()
      }
    }

    cleanUpJob() {
      this.props.setJobRunning(false)
      this.setState({ currentPage: 1 })
      this.setState({ leads: [] })
      this.setState({ jobRan: true })
    }

    async processLeads(leadIndex) {
      await this.getEmail(this.state.leads[leadIndex], 0)
        .then(function() {
          if (leadIndex < this.state.totalRecords) {
            this.processLeads(leadIndex+1)
          }
        }.bind(this))
    }

    async getEmail(lead, apiIndex) {
      let relevantApis = this.filterRelevantApis()
      let api = relevantApis[apiIndex]
      if (apiIndex < relevantApis.length && lead) {
        switch (Object.keys(api)[0]) {
          case Constants.EmailApiEnum.prospect:
            if (api[Constants.EmailApiEnum.prospect]) {
              await getProspectEmail(
                lead.domain,
                lead.firstName,
                lead.lastName
              ).then(function(email) {
                  if (email) {
                    lead.email = email
                    lead.source = Object.keys(api)[0]
                    this.props.addLead(lead)
                    this.incrementProgress()
                  } else {
                    if (this.calculateFinalApi() === api) {
                      this.props.addLead(lead)
                      this.incrementProgress()
                    }
                    this.getEmail(lead, apiIndex+1)
                  }
              }.bind(this))
            } else {
              await this.getEmail(lead, apiIndex+1)
            }
            break
          case Constants.EmailApiEnum.hunter:
            if (api[Constants.EmailApiEnum.hunter]) {
              await getHunterEmail(
                lead.domain,
                lead.firstName,
                lead.lastName
              ).then(function(email) {
                  if (email) {
                    lead.email = email
                    lead.source = Object.keys(api)[0]
                    this.props.addLead(lead)
                    this.incrementProgress()
                  } else {
                    if (this.calculateFinalApi() === api) {
                      this.props.addLead(lead)
                      this.incrementProgress()
                    }
                    this.getEmail(lead, apiIndex+1)
                  }
              }.bind(this))
            } else {
              await this.getEmail(lead, apiIndex+1)
            }
            break
          default:
            break
        }
      }
    }

    run = () => {

      // let lead = new Lead(
      //   "testFirst",
      //   "testLast",
      //   "t213123b1j23huuid",
      //   "testDomain",
      //   "nullEmail",
      //   "nullSource"
      // )
      //
      // Caspio.postCaspioRow(
      //   this.props.caspioAuthToken,
      //   this.props.selectedDataSourceType,
      //   this.props.selectedDataSource,
      //   lead,
      //   this.props.selectedDataSourceFirstName,
      //   this.props.selectedDataSourceLastName,
      //   this.props.selectedDataSourceUUID,
      //   this.props.selectedDataSourceDomain,
      //   "organizations_uuid"
      // )
      this.setState({ noApiSelectedFlag: false })
      let relevantApis = this.filterRelevantApis()
      if (relevantApis.length > 0) {
        this.getRecords()
        this.props.setJobRunning(true)
      } else {
        this.setState({ noApiSelectedFlag: true })
      }
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
            <Grid.Row centered columns={5} >
              <Grid.Column>
                <Label>{Constants.DataSourceColumnEnum.firstName}</Label>
                <ColumnDropdown dataSourceColumn={Constants.DataSourceColumnEnum.firstName} />
              </Grid.Column>
              <Grid.Column>
                <Label>{Constants.DataSourceColumnEnum.lastName}</Label>
                <ColumnDropdown dataSourceColumn={Constants.DataSourceColumnEnum.lastName} />
              </Grid.Column>
              <Grid.Column>
                <Label>
                  {Constants.DataSourceColumnEnum.UUID}
                  <Label.Detail>(Must be unique)</Label.Detail>
                </Label>
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
            this.props.selectedDataSourceLastName &&
            !this.state.jobRan) ? (
              <Grid.Row centered columns={!this.props.jobRunning ? 5:3} >
                { !this.props.jobRunning ? (
                  <Grid.Column>
                    <Segment textAlign = "center">
                      <Label>
                        Select APIs
                        <Label.Detail>(drag handle to change order)</Label.Detail>
                      </Label>
                      <APIList/>
                      { this.state.noApiSelectedFlag ? (<Label color="red">Please select at least one api</Label>):null}
                    </Segment>
                    <Button onClick={this.run}>Run</Button>
                  </Grid.Column>
                ):(
                  <Grid.Column>
                    <Progress percent={this.state.percent} indicating />
                  </Grid.Column>
                )}
              </Grid.Row>
            ):null}
            { (this.props.leads.length > 0 && this.props.leads.length === this.state.totalRecords) ? (
              <Grid.Row centered columns={1} >
                <Grid.Column>
                   <LeadsTable />
                </Grid.Column>
              </Grid.Row>
            ):null}
        </Grid>
      </Segment>
    )
  }
}

export default connect(
  mapStateToProps, {
    addLead,
    authorize,
    requestDataSources,
    setJobRunning
  }
)(App);

//export default connect(null, mapDispatchToProps)(App);
