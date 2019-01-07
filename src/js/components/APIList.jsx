import React, {Component} from 'react';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import { List, Checkbox, Icon, Segment, Header, Grid, Input } from 'semantic-ui-react'
import { connect } from "react-redux";
import {
  setEmailAPIs
} from "./../actions/index"

const mapStateToProps = state => {
  return {
    emailAPIs: state.emailAPIs
  };
}

function disableSelect(event) {
    event.preventDefault();
}

function startDrag(event) {
    window.addEventListener('mouseup', onDragEnd);
    window.addEventListener('selectstart', disableSelect);
    // ... my other code
}

function onDragEnd() {
    window.removeEventListener('mouseup', onDragEnd);
    window.removeEventListener('selectstart', disableSelect);
}

const DragHandle = SortableHandle(() =>
  <Segment compact onMouseDown={startDrag}>
    <Icon name="align justify" />
  </Segment>
);

const SortableItem = SortableElement(({value, onClick, onChange}, props) =>
  <List.Item>
    <Grid>
      <Grid.Row centered columns={3} >
      <Grid.Column>
        <DragHandle />
      </Grid.Column>
      <Grid.Column>
        <Header>{Object.keys(value)[0]}</Header>
        <Checkbox
          toggle
          name={Object.keys(value)[0]}
          checked={value[Object.keys(value)[0]]}
          onClick={onClick}/>
      </Grid.Column>
      <Grid.Column>
        <Input
          label="Tolerance"
          name={Object.keys(value)[0]}
          fluid
          placeholder='90'
          onChange={onChange}
        />
      </Grid.Column>
      </Grid.Row>
    </Grid>
  </List.Item>
)

const SortableList = SortableContainer(({items, onClick, onChange}, props) => {
  return (
    <List celled>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} onClick={onClick} onChange={onChange}/>
      ))}
    </List>
  );
});

class APIList extends Component {
  state = {
    items: this.props.emailAPIs,
  };

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
    this.props.setEmailAPIs(this.state.items)
  };

  onClick = (e, { checked, name }) => {
    if (e.dispatchConfig.phasedRegistrationNames.bubbled === "onMouseUp") {
      this.setState(function(prevState, props){
        var items = prevState.items
        var item = items.filter(item => name === Object.keys(item)[0])[0]
        item[name] = checked
        items[name] = item
        return {items: items}
      });
      this.props.setEmailAPIs(this.state.items)
    }
  };

  onChange = (e, {value, name}) => {
    let intValue = parseInt(value, 10)
    if (Number.isInteger(intValue)) {
      this.setState(function(prevState, props){
        var items = prevState.items
        var item = items.filter(item => name === Object.keys(item)[0])[0]
        item["tolerance"] = intValue
        items[name] = item
        return {items: items}
      });
      this.props.setEmailAPIs(this.state.items)
    }
  };

  render() {
    return (
      <SortableList
        items={this.state.items}
        onSortEnd={this.onSortEnd}
        useDragHandle={true}
        onClick={this.onClick}
        onChange= {this.onChange}
      />
    )
  }
}

export default connect(
  mapStateToProps,{
    setEmailAPIs
  }
)(APIList);
