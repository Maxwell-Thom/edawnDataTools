import React from 'react'
import ReactDOM from 'react-dom'
import Constants from './Constants'
import * as Caspio from './Caspio'
import { Dropdown, Divider, Grid, Segment } from 'semantic-ui-react'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = { caspioAccessToken: null,
                    currentPage: 1,
                    caspioViews: [],
                    caspioTables: [],
                    dataSource: null,
                  }
  }

  componentDidMount() {
    Caspio.authenticate()
      .then(function(result) {
        const caspioAccessToken = result
        this.setState({caspioAccessToken})

        Caspio.requestDataSources(this.state.caspioAccessToken, Constants.dataSourceEnum.views)
          .then(function(dataSources) {
            const caspioViews = dataSources
            this.setState({caspioViews: this.state.caspioViews.concat(caspioViews)})
          }.bind(this))

        Caspio.requestDataSources(this.state.caspioAccessToken, Constants.dataSourceEnum.tables)
          .then(function(dataSources) {
            const caspioTables = dataSources
            this.setState({caspioTables: this.state.caspioTables.concat(caspioTables)})
          }.bind(this))
      }.bind(this))
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
  }

  render() {
    return (
      <Segment placeholder>
        <Segment placeholder>
          <Grid columns={2} relaxed='very' stackable>
            <Grid.Column>
              <Tables
                handleChange = {this.handleDataSourceChange}
                tables={this.state.caspioTables}
              />
            </Grid.Column>

            <Grid.Column verticalAlign='middle'>
              <Views
                handleChange = {this.handleDataSourceChange}
                views = {this.state.caspioViews}
              />
            </Grid.Column>
          </Grid>
          <Divider vertical>or</Divider>
        </Segment>
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

ReactDOM.render( <App />, document.querySelector('#root') )
