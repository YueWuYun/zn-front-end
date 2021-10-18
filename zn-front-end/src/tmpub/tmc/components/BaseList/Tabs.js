/*hnNbYrcoaRPClaZieifdgKgwke2g+WCLznPcuBW55ns=*/
import React, { PureComponent } from "react";
import { base } from "nc-lightapp-front";
const { NCTabs } = base;
const { NCTabPane } = NCTabs;

export default class Tabs extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: props.defaultKey
        };
    }

    handleTabChange = key => {
        this.setState({ activeTab: key }, () => {
            this.props.onTabChange(key);
        });
    };

    renderTabsItem = (allKey, tabs) => {
        return (
            tabs &&
            tabs.map(item => {
                let num =
                    allKey != item.key ? " (" + (item.num || 0) + ")" : "";
                let tabText =
                    allKey != item.key ? item.title + num : item.title;
                return <NCTabPane key={item.key} tab={tabText} />;
            })
        );
    };

    renderTabs = ({ allKey, items }) => (
        <div
            className="tab-definInfo-area"
        >
            <NCTabs
                activeKey={this.state.activeTab}
                onChange={this.handleTabChange}
            >
                {this.renderTabsItem(allKey, items)}
            </NCTabs>
        </div>
    );

    render() {
        return this.renderTabs(this.props);
    }
}

/*hnNbYrcoaRPClaZieifdgKgwke2g+WCLznPcuBW55ns=*/