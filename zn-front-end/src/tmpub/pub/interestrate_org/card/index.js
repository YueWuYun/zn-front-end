/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
 基准利率设置-组织卡片页
 created by：liyaoh 2018-08-13
*/
import React, { Component } from 'react';
import { createPage } from 'nc-lightapp-front';
import Card from '../../interestrate/card';
class InterestrateCard extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.appcode = '36010IRCO';
		this.pageId = '36010IRCO_card';
		this.props.pageType = 'org';
	}
	render() {
		return <Card pageType="org" pageTitle="36010IRCO-000000" moduleId="36010IRCO" {...this.props} />;
	}
}

InterestrateCard = createPage({
	billinfo: {
		billtype: 'extcard',
		pagecode: '36010IRCO_card',
		headcode: 'head',
		bodycode: [ 'rationrate', 'overduerate', 'advancerate' ]
	}
	// initTemplate: initTemplate
})(InterestrateCard);
export default InterestrateCard;
// ReactDOM.render(<InterestrateCard />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/