import React from 'react';
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';

export default class MappingDetails extends React.Component {
  constructor(props) {
    super(props);
    this._onResize = this._onResize.bind(this);
    this._onEdit = this._onEdit.bind(this);
    this._toggleIsPlainText = this._toggleIsPlainText.bind(this);
    this._onTextAreaChanged = this._onTextAreaChanged.bind(this);
    this.state = {
      height: this._getMaxHeight(),
      isPlainText: false
    };
  }

  _getMaxHeight() {
    // 60% of window height, minus buffer to account for header/footer
    return window.innerHeight * 0.6 - 100;
  }

  _onResize() {
    const height = this._getMaxHeight();
    this.setState({ height });
  }

  componentDidMount() {
    window.addEventListener('resize', this._onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  }

  _onEdit(root) {
    this.props.onEdit(root.updated_src);
  }

  _toggleIsPlainText() {
    const { isPlainText } = this.state;
    this.setState({
      isPlainText: !isPlainText
    });
  }

  _onTextAreaChanged(e) {
    this.props.onEdit(JSON.parse(e.target.value));
  }

  render() {
    const { height, isPlainText } = this.state;
    const bodyStyle = { height };
    const textareaStyle = { height: height - 60 };
    const isPlainTextClass = isPlainText ? 'on' : 'off';
    const src = this.props.src || {};

    return <div className="box-body mapping-details" style={bodyStyle}>
      <section>
        <div className="switch">
          Show as plain text
          <a className="secondary-content" onClick={this._toggleIsPlainText}>
            <i className={'fa fa-toggle-' + isPlainTextClass} />
          </a>
        </div>
      </section>
      <section>
        {
          isPlainText ?
            <textarea
              style={textareaStyle}
              onChange={this._onTextAreaChanged}
              defaultValue={JSON.stringify(src, null, 4)}
            /> :
            <ReactJson
              enableClipboard={false}
              src={src}
              onEdit={this._onEdit}
              onAdd={this._onEdit}
              onDelete={this._onEdit}
              name={null}
            />
        }
      </section>
    </div>;
  }
}

MappingDetails.propTypes = {
  src: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired
};
