/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
 基准利率设置-全局列表页
 created by：liyaoh 2018-08-25
*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high } from 'nc-lightapp-front';
import List from '../../interestrate/list';
import { initTemplate } from '../../interestrate/list/events';

class InterestrateList extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.appcode = '36010IRC';
		this.pageId = '36010IRC_list';
		this.tableId = 'table'; //initTemplate里用到
		this.searchId = 'search'; //initTemplate里用到
		this.pageType = 'global'; //todo 有时间重构
		this.props.pageType = 'global';
	}
	render() {
		return (
			<List
				pageTitle="36010IRC-000000"
				moduleId="36010IRC"
				{...this.props}
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

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/