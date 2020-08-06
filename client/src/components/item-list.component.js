import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { withAlert } from 'react-alert';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';

const Filter = React.forwardRef((props, ref) => (
  <div className="my-2 py-3">
    <Button onClick={() => props.toggleFilter()} ref={ref} aria-expanded={props.isOpen}>Filter</Button>
    <Collapse in={props.isOpen} ref={ref}>
      <div className="my-2">
        <div className="form-row ">
          <div className="col">
            <label>Item name: </label>
            <input name="name" type="text" className="form-control" onChange={props.handleFilterInput}></input>
          </div>
          <div className="col">
            <label>Item Type: </label><br />
            {['Any', 'Materia', 'Gear'].map((itemtype, index) => {
              return (<div key={index} className="form-check form-check-inline">
                <input type="radio" id={"radio" + itemtype} name="type" className="form-check-input"
                  value={itemtype} onChange={props.handleFilterInput} defaultChecked={!index} />
                <label className="form-check-label" htmlFor={"radio" + itemtype}>{itemtype}</label>
              </div>)
            })}
          </div>
        </div>
        <div className="form-row py-2">
          <div className="col">
            <label>Killer race: </label>
            <select name="killer" className="form-control"
              onChange={props.handleFilterInput} defaultValue='Any'>
              <option value='Any'>Any</option>
              {props.killers.map(function (killer, index) {
                return <option key={index} value={killer}>{killer}</option>;
              })} </select>
          </div>
          <div className="col">
            <label>Boost Amount (in %): </label>
            <input name='boostamount' type="number" className="form-control" defaultValue={0} onChange={props.handleFilterInput} />
          </div>
        </div>
        <div className="form-row">
          <div className="col">
            <label>Stat value (% for materia): </label>
            <input name="statvalue" type="number" className="form-control" defaultValue={0} onChange={props.handleFilterInput} />
          </div>
          <div className="col">
          <label>Main Stat Type: </label><br />
            {['Any', 'None', 'ATK', 'DEF', 'MAG', 'SPR'].map((stattype, index) => {
              return (<div key={index} className="form-check form-check-inline">
                <input type="radio" id="radioStatNone" name="mainstat" className="form-check-input"
                  value={stattype} onChange={props.handleFilterInput}
                  defaultChecked={!index} />
                <label className="form-check-label" htmlFor={"radioStat" + stattype}>{stattype}</label>
              </div>)
            })}
          </div>
        </div>
        <Button className="my-2" onClick={() => props.clearFilter()}>Clear</Button>
      </div>
    </Collapse>
  </div>
));

const Item = props => (
  <tr>
    <td>{props.item.itemname}</td>
    <td>{props.item.itemtype}</td>
    <td>{props.item.killer}</td>
    <td>{props.item.boostamount}</td>
    <td>{props.item.mainstattype}</td>
    {(props.item.mainstattype !== "None") ?
      (<td>{props.item.statvalue}</td>) : (<td>-</td>)}
    <td>
      <Link to={"/edit/" + props.item._id}><button type="button" className="btn btn-primary">edit</button></Link>&nbsp;&nbsp;&nbsp;
      <div className="btn btn-danger" type='submit' onClick={() => props.alert.show('Do you want to delete ' + props.item.itemname + ' ?', {
        title: 'Delete item ?',
        actions: [
          {
            copy: "Yes",
            onClick: () => props.deleteItem(props.item._id)
          },
          {
            copy: "No",
            onClick: () => alert.close
          }
        ]
      })}>delete</div>
    </td>
  </tr>
)

class ItemList extends Component {

  constructor(props) {
    super(props);
    this.alert = this.props.alert;
    this.deleteItem = this.deleteItem.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.compareBy = this.compareBy.bind(this);

    this.toggleFilter = this.toggleFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.handleFilterInput = this.handleFilterInput.bind(this);
    this.searchItems = this.searchItems.bind(this);

    this.state = {
      oldKey: '',
      ascend: 1,
      items: [],
      filter: {
        isOpen: false,
        isFiltering: false,
        name: '',
        type: 'Any',
        killer: '',
        boostamount: 0,
        mainstat: 'Any',
        statvalue: 0,
        filteredItems: []
      }
    };
  }

  handleFilterInput(e) {
    const target = e.target;
    const field = target.name;
    const value = target.value;

    const filter = this.state.filter;
    console.log(filter);
    filter[field] = value;
    filter['isFiltering'] = true;
    this.setState({ filter: { ...filter } });
    this.searchItems();
  }

  searchItems() {
    const filter = this.state.filter;
    this.setState({
      filter: {
        ...filter,
        filteredItems: this.state.items.filter(el => (
          (filter.name !== '' ? (el.itemname.toString().toLowerCase().indexOf(filter.name.toLowerCase()) !== -1) : true) &&
          ((filter.type !== '' && filter.type !== 'Any') ? (el.itemtype === filter.type) : true) &&
          ((filter.killer !== '' && filter.killer !== 'Any') ? (el.killer === filter.killer) : true) &&
          ((filter.boostamount !== '' && parseInt(filter.boostamount) !== 0) ? (el.boostamount === parseInt(filter.boostamount)) : true) &&
          ((filter.mainstat !== '' && filter.mainstat !== 'Any') ? (el.mainstattype === filter.mainstat) : true) &&
          ((filter.statvalue !== '' && parseInt(filter.statvalue) !== 0) ? (el.statvalue === parseInt(filter.statvalue)) : true)
        ))
      }
    });
  }

  componentDidMount() {
    axios.get('http://192.168.1.69:5000/items/')
      .then(response => { this.setState({ items: response.data }) })
      .catch(error => { console.log(error); });
  }

  compareBy(key, asc) {
    return function (a, b) {
      if (a[key] < b[key]) return -1 * asc;
      if (a[key] > b[key]) return 1 * asc;
      return 0;
    };
  }

  sortBy(key) {
    let arrayCopy = this.state.items;
    var asc = (key === this.state.oldKey) ? this.state.ascend * -1 : this.state.ascend;
    arrayCopy.sort(this.compareBy(key, asc));
    this.setState({
      oldKey: key,
      ascend: asc,
      items: arrayCopy
    });
  }

  deleteItem(id) {
    axios.delete('http://192.168.1.69:5000/items/' + id)
      .then(res => console.log(res.data));
    this.setState({
      items: this.state.items.filter(el => el._id !== id)
    });
  }

  toggleFilter() {
    const filter = this.state.filter;
    this.setState({
      filter: {
        ...filter,
        isOpen: !filter.isOpen
      }
    });
  }

  clearFilter() {
    this.setState({
      filter: {
        isOpen: false,
        isFiltering: false,
        name: '',
        type: 'Any',
        killer: '',
        boostamount: 0,
        mainstat: 'Any',
        statvalue: 0,
        filteredItems: []
      }
    });
  }

  render() {
    return (
      <div>
        <h3>Item inventory</h3>
        <Filter killers={[...new Set(this.state.items.map(item => item.killer))]} isOpen={this.state.filter.isOpen}
          toggleFilter={this.toggleFilter} clearFilter={this.clearFilter} handleFilterInput={this.handleFilterInput}></Filter>
        <div className="form-group">
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th><div onClick={() => this.sortBy('itemname')}>Item name</div></th>
                <th><div onClick={() => this.sortBy('itemtype')}>Type</div></th>
                <th><div onClick={() => this.sortBy('killer')}>Killer</div></th>
                <th><div onClick={() => this.sortBy('boostamount')}>Boost amount</div></th>
                <th><div onClick={() => this.sortBy('mainstattype')}>Main stat</div></th>
                <th><div onClick={() => this.sortBy('statvalue')}>Value</div></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{this.state.filter.isFiltering ?
              this.state.filter.filteredItems.map(currentitem => { return <Item item={currentitem} deleteItem={this.deleteItem} key={currentitem._id} alert={this.alert} />; }) :
              this.state.items.map(currentitem => { return <Item item={currentitem} deleteItem={this.deleteItem} key={currentitem._id} alert={this.alert} />; })
            }</tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default withAlert()(ItemList)