/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
 基准利率设置-组织列表页
 created by：liyaoh 2018-08-13
*/
import React, { Component } from 'react';
import { createPage, ajax, base, toast, high } from 'nc-lightapp-front';
import List from '../../interestrate/list';

class InterestrateList extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.appcode = '36010IRCO';
		this.pageId = '36010IRCO_list';
		this.tableId = 'table'; //initTemplate里用到
		this.searchId = 'search'; //initTemplate里用到
		this.pageType = 'org'; //todo 有时间重构
		this.props.pageType = 'org';
	}
	render() {
		return (
			<List
				pageTitle="36010IRCO-000000"
				moduleId="36010IRCO"
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