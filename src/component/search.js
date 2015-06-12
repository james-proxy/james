import React from 'react';

const {func, object} = React.PropTypes;

export default class Search extends React.Component {

  _handleOnChange(event) {
    const {setFilter} = this.props;
    const value = event.target.value;
    setFilter(value);
  }

  render() {
    return <div className="search">
      <input type="text" placeholder="Search" onChange={this._handleOnChange.bind(this)} />
    </div>
  }
}
