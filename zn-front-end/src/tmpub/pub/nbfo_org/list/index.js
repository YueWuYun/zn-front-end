/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
 基准利率设置-全局列表页
 created by：liyaoh 2018-08-25
*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high } from 'nc-lightapp-front';
import List from '../../nbfo/list';

class InterestrateList extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.appcode = '36010NBFOO';
		this.pageId = '36010NBFOO_list';
		this.tableId = 'table'; //initTemplate里用到
		this.searchId = 'search'; //initTemplate里用到
		this.pageType = 'org'; //todo 有时间重构
		this.props.pageType = 'org';
	}
	render() {
		return (
			<List
				pageTitle="36010NBFOO-000000"
				moduleId="36010NBFOO"
				{...this.props} 
				{...this}
			/>
		);
	}
}

InterestrateList = createPage(
	{
		// initTemplate: initTemplate
	}
)(InterestrateList);
export default InterestrateList;
// ReactDOM.render(<InterestrateList />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/