import React, { Component } from 'react';
import axios from 'axios';
import { withAlert } from 'react-alert';

class AddItem extends Component {
  constructor(props) {
    super(props);
    this.alert = this.props.alert;
    this.onChangeItemname = this.onChangeItemname.bind(this);
    this.onChangeItemtype = this.onChangeItemtype.bind(this);
    this.onChangeKiller = this.onChangeKiller.bind(this);
    this.onChangeBoostamount = this.onChangeBoostamount.bind(this);
    this.onChangeMainstattype = this.onChangeMainstattype.bind(this);
    this.onChangeStatvalue = this.onChangeStatvalue.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      itemname: '',
      itemtype: 'Materia',
      killer: '',
      boostamount: 0,
      mainstattype: 'None',
      statvalue: 0,
      killers: []
    }
  }

  componentDidMount() {
    axios.get('http://192.168.1.69:5000/killers/')
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            killers: response.data.map(killer => killer.name),
            killer: response.data[0].name
          })
        }
      })
  }

  onChangeItemname(e) { this.setState({ itemname: e.target.value }); }
  onChangeItemtype(e) { this.setState({ itemtype: e.target.value }); }
  onChangeKiller(e) { this.setState({ killer: e.target.value }); }
  onChangeBoostamount(e) { this.setState({ boostamount: (e.target.value !== '' ) ? e.target.value : 0}); }
  onChangeMainstattype(e) { this.setState({ mainstattype: e.target.value }); }
  onChangeStatvalue(e) { this.setState({ statvalue: (e.target.value !== '' ) ? e.target.value : 0}); }

  onSubmit(e) {
    e.preventDefault();

    const newItem = {
      itemname: this.state.itemname,
      itemtype: this.state.itemtype,
      killer: this.state.killer,
      boostamount: this.state.boostamount,
      mainstattype: this.state.mainstattype,
      statvalue: this.state.statvalue
    };

    console.log(newItem);

    axios.post('http://192.168.1.69:5000/items/add', newItem)
      .then(res => console.log(res.data));
    this.alert.show("Item added successfully!", {
      actions: [
        {
          copy: "OK",
          onClick: () => alert.close
        }
      ]
    });
  }

  render() {
    return (
      <div>
        <h3>Add New Item</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Item Name: </label>
            <input type="text" className="form-control" required={true}
              value={this.state.itemname} onChange={this.onChangeItemname} />
          </div>
          <div className="form-group">
            <label>Item Type: </label><br />
            {['Materia', 'Gear'].map((itemtype, index) => {
              return (
                <div key={index} className="form-check form-check-inline">
                  <input type="radio" id={"radio" + itemtype} name="itemtype" className="form-check-input"
                    value={itemtype} onChange={this.onChangeItemtype} defaultChecked={!index} />
                  <label className="form-check-label" htmlFor={"radio" + itemtype}>{itemtype}</label>
                </div>)
            })}
          </div>
          <div className="form-group">
            <label>Killer race: </label>
            <select required={true} className="form-control" value={this.state.killer}
              onChange={this.onChangeKiller}>
              {this.state.killers.map(function (killer, index) {
                return <option key={index} value={killer}>{killer}</option>;
              })} </select>
          </div>
          <div className="form-group">
            <label>Boost Amount (in %): </label>
            <input type="number" className="form-control" required={true}
              value={this.state.boostamount !== '' ? parseInt(this.state.boostamount) : 0} onChange={this.onChangeBoostamount} />
          </div>
          <div className="form-group">
            <label>Main Stat Type: </label><br />
            {['None', 'ATK', 'DEF', 'MAG', 'SPR'].map((stattype, index) => {
              return (<div key={index} className="form-check form-check-inline">
                <input type="radio" id="radioStatNone" name="stattype" className="form-check-input"
                  value={stattype} onChange={this.onChangeMainstattype}
                  defaultChecked={!index} />
                <label className="form-check-label" htmlFor={"radioStat" + stattype}>{stattype}</label>
              </div>)
            })}
          </div>
          <div hidden={this.state.mainstattype === 'None'} className="form-group">
            <label>Stat value (% for materia): </label>
            <input type="number" className="form-control"
              value={this.state.statvalue !== '' ? parseInt(this.state.statvalue) : 0}
              onChange={this.onChangeStatvalue} />
          </div>
          <input type="submit" value="Add new item" className="btn btn-primary" />
        </form>
      </div>
    )
  }
}
export default withAlert()(AddItem)