import React, { Component } from 'react';
import axios from 'axios';
import { withAlert } from 'react-alert';

const Killer = props => (
  <tr>
    <td className='w-75'>{props.killer.name}</td>
    <td>
      <div className="btn btn-danger" type='submit' onClick={() => props.alert.show('Do you want to delete ' + props.killer.name + ' ?', {
        title: 'Delete race ?',
        actions: [
          {
            copy: "Yes",
            onClick: () => props.deleteKiller(props.killer._id)
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

class AddKiller extends Component {
  constructor(props) {
    super(props);
    this.alert = this.props.alert;
    this.deleteKiller = this.deleteKiller.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      newName: '',
      killers: []
    };
  }

  componentDidMount() {
    axios.get('http://192.168.1.69:5000/killers/')
      .then(response => { this.setState({ killers: response.data }) })
      .catch(error => { console.log(error); })
  }

  deleteKiller(id) {
    axios.delete('http://192.168.1.69:5000/killers/' + id)
      .then(res => console.log(res.data));
    this.setState({
      killers: this.state.killers.filter(el => el._id !== id)
    })
    this.alert.show("Killer deleted", {
      actions: [
        {
          copy: "OK",
          onClick: () => alert.close
        }
      ]
    });
  }

  onChangeName(e) {
    this.setState({
      newName: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const killers = this.state.killers;
    if (killers.some(k => k.name.toLowerCase() === this.state.newName.toLowerCase())) {
      this.alert.show("Killer already exists!", {
        actions: [
          {
            copy: "OK",
            onClick: () => alert.close
          }
        ]
      });
    }
    else {
      const newKiller = {
        name: this.state.newName,
      };
      console.log(newKiller);
      axios.post('http://192.168.1.69:5000/killers/add', newKiller)
        .then(res => console.log(res.data));
      this.alert.show("Killer added succsessfully!", {
        actions: [
          {
            copy: "OK",
            onClick: () => alert.close
          }
        ]
      });
      this.setState({
        newName: '',
        killers: killers
      });
    }
  }

  killerList() {
    return this.state.killers.map((currentKiller,index) => {
      return <Killer key={index} killer={currentKiller} deleteKiller={this.deleteKiller} alert={this.alert} />;
    })
  }

  render() {
    return (
      <div>
        <h3>Add new killer</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Enter race: </label>
            <input type="text" className="form-control" required={true}
              value={this.state.newName} onChange={this.onChangeName} />
          </div>
          <div className="form-group">
            <input type="submit" value="Add killer" className="btn btn-primary" />
          </div>
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>Race</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.killerList()}
            </tbody>
          </table>
        </form>
      </div>
    )
  }
}

export default withAlert()(AddKiller)