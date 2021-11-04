//DuDwTL8BKzi/6jRTH+SwWiJK+h9Z9wXgX06Zn6w3RIdoQ+SnBdj0cfZXtdNcXuZY
import React, { Component } from "react";
require("./nc_TabsControl.less");

class TabsControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: this.props.defaultKey
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            currentIndex: newProps.defaultKey
        });
    }
    tab_title_index(index) {
        return index === this.state.currentIndex
            ? "tab_title active"
            : "tab_title";
    }

    render() {
        return (
            <div className="lightapp-component-TabLi-add nc-theme-area-bgc">
                {React.Children.map(this.props.children, (element, index) => {
                    return (
                        <div
                            onClick={() => {
                                this.setState(
                                    { currentIndex: index },
                                    element.props.clickFun
                                );
                            }}
                            className={this.tab_title_index(index)}
                        >
                            <p>{element.props.children}</p>
                            <p />
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default TabsControl;

//DuDwTL8BKzi/6jRTH+SwWiJK+h9Z9wXgX06Zn6w3RIdoQ+SnBdj0cfZXtdNcXuZY