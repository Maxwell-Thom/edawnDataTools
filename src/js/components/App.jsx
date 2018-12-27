// src/js/components/App.jsx
import React from 'react'
import Constants from './../constants/Constants'
import { authorize, requestDataSources }  from './../apis/Caspio'
import * as Caspio from './../apis/Caspio'

import { Dropdown, Accordion, Menu, Grid, Segment} from 'semantic-ui-react'
import { connect } from "react-redux";

const mapStateToProps = state => {
  return { caspioAuthToken: state.caspioAuthToken,
          caspioViews: state.caspioViews,
          caspioTables: state.caspioViews
        };
}

class App extends React.Component {

  constructor() {
    super()
    this.state = { currentPage: 1,
                    dataSource: null,
                    dataSourceColumns: [],
                    dataSourceActiveIndex: 0
                  }
  }

  componentDidMount() {
    this.props.authorize()

      // .then(function(result) {
      //   const caspioAccessToken = result
      //   this.setState({caspioAccessToken})
      //
      //   Caspio.requestDataSources(this.state.caspioAccessToken, Constants.dataSourceEnum.views)
      //     .then(function(dataSources) {
      //       const caspioViews = dataSources
      //       this.setState({caspioViews: this.state.caspioViews.concat(caspioViews)})
      //     }.bind(this))
      //
      //   Caspio.requestDataSources(this.state.caspioAccessToken, Constants.dataSourceEnum.tables)
      //     .then(function(dataSources) {
      //       const caspioTables = dataSources
      //       this.setState({caspioTables: this.state.caspioTables.concat(caspioTables)})
      //     }.bind(this))
      // }.bind(this))
  }

  componentDidUpdate(){
    if (this.props.caspioAuthToken !== null) {
      if (this.props.caspioTables.length === 0) {
        this.props.requestDataSources(this.props.caspioAuthToken, Constants.dataSourceEnum.tables)
      }
      if (this.props.caspioViews.length === 0) {
        this.props.requestDataSources(this.props.caspioAuthToken, Constants.dataSourceEnum.views)
      }
    }
  }

  async getContacts(token) {
    await Caspio.requestData(token, this.state.currentPage, Constants.caspioPageSize, Constants.dataSourceEnum.views, "CBPeopleJobs_Surge")
    .then(function(contacts) {
      this.setState({currentPage: this.state.currentPage + 1})
      if (contacts.data.Result.length === Constants.caspioPageSize) {
        return this.getContacts(token)
      }
    }.bind(this))
  }

  handleDataSourceChange = (e, {value}) => {
    this.setState({dataSource: value.dataSource })
    Caspio.requestDataSourceColumns(this.state.caspioAccessToken, value.dataSourceType , value.dataSource)
      .then( dataSourceColumns => {
        this.setState({dataSourceColumns: dataSourceColumns})
        console.log(this.state.dataSourceColumns)
      })
  }

  handleAccordionDataSourceClick = (e, titleProps) => {
    const { index } = titleProps
    const { dataSourceActiveIndex } = this.state
    const newIndex = dataSourceActiveIndex === index ? -1 : index
    this.setState({ dataSourceActiveIndex: newIndex })
  }

  render() {
    return (
      <Segment placeholder>
        <Grid centered divided='vertically' columns={2}>
          <Grid.Row centered columns={2} >
            <Grid.Column>
              <Accordion as={Menu} vertical fluid>
                <Menu.Item>
                  <Accordion.Title
                    active={this.state.dataSourceActiveIndex === 0}
                    content='Tables'
                    index={0}
                    onClick={this.handleAccordionDataSourceClick}
                  />
                  <Accordion.Content
                    active={this.state.dataSourceActiveIndex === 0}
                    content= {
                      <Views
                        handleChange = {this.handleDataSourceChange}
                        views = {this.props.caspioViews}
                      />
                    }
                  />
                </Menu.Item>
                <Menu.Item>
                  <Accordion.Title
                    active={this.state.dataSourceActiveIndex === 1}
                    content='Views'
                    index={1}
                    onClick={this.handleAccordionDataSourceClick}
                  />
                  <Accordion.Content
                    active={this.state.dataSourceActiveIndex === 1}
                    content= {
                      <Tables
                        handleChange={this.handleDataSourceChange}
                        tables={this.props.caspioTables}
                      />
                    }
                  />
                </Menu.Item>
              </Accordion>
            </Grid.Column>
          </Grid.Row>
          {this.state.dataSourceColumns > 0 ? (
            <Grid.Row centered columns={4}>
              <Grid.Column>
                <Tables
                  handleChange={this.handleDataSourceChange}
                  tables={this.props.caspioTables}
                />
              </Grid.Column>
              <Grid.Column>
                <Tables
                  handleChange={this.handleDataSourceChange}
                  tables={this.props.caspioTables}
                />
              </Grid.Column>
              <Grid.Column>
                <Tables
                  handleChange={this.handleDataSourceChange}
                  tables={this.props.caspioTables}
                />
              </Grid.Column>
              <Grid.Column>
                <Tables
                  handleChange={this.handleDataSourceChange}
                  tables={this.props.caspioTables}
                />
              </Grid.Column>
            </Grid.Row>
          ): null}
        </Grid>
      </Segment>
    )
  }
}

const Tables = (props) => (
  <Dropdown
    clearable
    fluid
    search
    selection
    placeholder="Tables"
    onChange={props.handleChange}
    options={props.tables.map(table => (
        { key: table, text: table, value: {dataSource: table, dataSourceType: Constants.dataSourceEnum.tables} }
    ))}
  />
)

const Views = (props) => (
  <Dropdown
    clearable
    fluid
    search
    selection
    placeholder="Views"
    onChange={props.handleChange}
    options={props.views.map(view => (
        { key: view, text: view, value: {dataSource: view, dataSourceType: Constants.dataSourceEnum.views} }
    ))}
  />
)

export default connect(
  mapStateToProps,
  { authorize, requestDataSources }
)(App);

//export default connect(null, mapDispatchToProps)(App);
