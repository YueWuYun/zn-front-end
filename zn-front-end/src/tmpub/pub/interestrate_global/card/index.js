/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
 基准利率设置-全局卡片页
 created by：liyaoh 2018-08-25
*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage } from 'nc-lightapp-front';
import Card from '../../interestrate/card';
class InterestrateCard extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.appcode = '36010IRC';
		this.pageId = '36010IRC_card';
		this.props.pageType = 'global';
	}
	render() {
		return <Card pageType="global" pageTitle="36010IRC-000000" moduleId="36010IRC" {...this.props} />;
	}
}

InterestrateCard = createPage({
	billinfo: {
		billtype: 'extcard',
		pagecode: '36010IRC_card',
		headcode: 'head',
		bodycode: [ 'rationrate', 'overduerate', 'advancerate' ]
	}
	// initTemplate: initTemplate
})(InterestrateCard);
export default InterestrateCard;
// ReactDOM.render(<InterestrateCard />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/