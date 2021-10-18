/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
 基准利率设置-全局列表页
 created by：liyaoh 2018-08-25
*/
import { createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import List from "../../nbfo/list";

class InterestrateList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.appcode = "36010NBFO";
        this.pageId = "36010NBFO_list";
        this.tableId = "table"; //initTemplate里用到
        this.searchId = "search"; //initTemplate里用到
        this.pageType = "global"; //todo 有时间重构
        this.props.pageType = "global";
	}
	
    render() {
        return (
            <List
                // pageType="group"
                pageTitle="36010NBFO-000044"
				moduleId="36010NBFO"
				// setPKORG
                {...this.props}
                {...this}
            />
        );
    }
}

InterestrateList = createPage({
    // initTemplate: initTemplate
})(InterestrateList);
export default InterestrateList;
// ReactDOM.render(<InterestrateList />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/