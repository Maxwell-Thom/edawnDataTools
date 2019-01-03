import React from "react";
import { connect } from "react-redux";
import { Table, Checkbox, Accordion, Icon } from 'semantic-ui-react'
import { addLead } from "./../actions/index"

const LeadTableRow = (({lead, index, failed}) =>
  <Table.Row positive={failed} negative={failed}>
    <Table.Cell collapsing>
      <Checkbox slider />
    </Table.Cell>
    <Table.Cell>{lead.firstName}</Table.Cell>
    <Table.Cell>{lead.lastName}</Table.Cell>
    <Table.Cell>{lead.uuid}</Table.Cell>
    <Table.Cell>{lead.domain}</Table.Cell>
    <Table.Cell>{lead.email}</Table.Cell>
    <Table.Cell>{lead.source}</Table.Cell>
  </Table.Row>
)

class LeadsTable extends React.Component {
  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    return (
      <Accordion>
        <Accordion.Title active={this.state.activeIndex === 0} index={0} onClick={this.handleClick}>
          <Icon name='dropdown' />
          Leads
        </Accordion.Title>
        <Accordion.Content active={this.state.activeIndex === 0}>
        <Table celled compact definition>
          <Table.Header fullWidth>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>First Name</Table.HeaderCell>
              <Table.HeaderCell>Last Name</Table.HeaderCell>
              <Table.HeaderCell>UUID</Table.HeaderCell>
              <Table.HeaderCell>Domain</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Source</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.leads.map((lead, index) => (
              <LeadTableRow
                key={`item-${index}`}
                lead={lead} index={index}
                failed={lead.email ? false:true}
              />
            ))}
          </Table.Body>
        </Table>
      </Accordion.Content>
      </Accordion>
    )
  }
}

export default connect(
  (state) => ({
    leads: state.leads,
  }), {
    addLead
  }
)(LeadsTable)
