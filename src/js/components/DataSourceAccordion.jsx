import React from "react";
import DataSourceDropdown from './../components/DataSourceDropdown'
import {
  Accordion,
  Menu,
  Label
} from 'semantic-ui-react'
import Constants from './../constants/Constants'

class DataSourceAccordion extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        dataSourceActiveIndex: 0
      }

      this.handleClick = this.handleClick.bind(this)
    }

    handleClick = (e, {
      index
    }) => {
      const {
        dataSourceActiveIndex
      } = this.state
      const newIndex = dataSourceActiveIndex === index ? -1 : index
      this.setState({
        dataSourceActiveIndex: newIndex
      })
    }
  render() {
    return (
      <Accordion as={Menu} vertical fluid>
      <Label>
        Select Data Source
      </Label>
        <Menu.Item>
          <Accordion.Title
            active={this.state.dataSourceActiveIndex === 0}
            content='Tables'
            index={0}
            onClick={this.handleClick}
          />
          <Accordion.Content
            active={this.state.dataSourceActiveIndex === 0}
            content= {
              <DataSourceDropdown
                dataSourceType={Constants.dataSourceEnum.tables}
              />
            }
          />
        </Menu.Item>
        <Menu.Item>
          <Accordion.Title
            active={this.state.dataSourceActiveIndex === 1}
            content='Views'
            index={1}
            onClick={this.handleClick}
          />
          <Accordion.Content
            active={this.state.dataSourceActiveIndex === 1}
            content= {
              <DataSourceDropdown
                dataSourceType={Constants.dataSourceEnum.views}
              />
            }
          />
        </Menu.Item>
      </Accordion>
    )
  }
}

export default DataSourceAccordion
