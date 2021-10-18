import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { createPage, base, ajax, toast } from "nc-lightapp-front";
import "./index.less";
export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rtListArr: this.props.rtListArr,
      currIndex: -1
    };
  }

  componentWillReceiveProps(newProps){
    if(newProps.itemIndex !== this.props.itemIndex) {
      this.setState({currIndex: newProps.itemIndex});
    }
    if(this.props.rtListArr && newProps.rtListArr.length !== this.props.rtListArr.length) {
      this.setState({rtListArr: newProps.rtListArr})
    }
  }

  // shouldComponentUpdate(newProps) {
  //   if(newProps.rtListArr.length === this.props.rtListArr.length) return false;
  //   return true;
  // }

  generateItem = () => {
    const { rtListArr } = this.props;
    return (
      <ul fieldid="ul-list">
        {rtListArr.map((item, index) => (
          <li 
            fieldid="li-list"
            className={[index === this.state.currIndex ? "active-item" : "", "list-item"].join(" ")}
            key={index.toString()} 
            onClick={this.handleItemClick.bind(this, item, index)}>
            <p>{item.refname}</p>
          </li>
        ))}
      </ul>
    );
  };

  handleItemClick(item, currIndex) {
    this.setState({currIndex});
    if(this.props.onItemClick && typeof this.props.onItemClick === 'function') {
      this.props.onItemClick(item, currIndex)
    }
  }

  render() {
    return <div>{this.generateItem()}</div>;
  }
}
