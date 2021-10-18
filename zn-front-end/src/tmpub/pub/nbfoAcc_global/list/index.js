/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
 基准利率设置-全局列表页
 created by：liyaoh 2018-08-25
*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high } from 'nc-lightapp-front';
import List from '../../nbfo/acclist';

class InterestrateList extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.appcode = '36010NBFO';
		this.tableId = 'table'; //initTemplate里用到
		this.searchId = 'search'; //initTemplate里用到
	}
	render() {
		return (
			<List
				moduleId="36010NBFO"
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