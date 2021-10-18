/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
 基准利率设置-集团卡片页
 created by：liyaoh 2018-08-24
*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage } from 'nc-lightapp-front';
import Card from '../../interestrate/card';
class InterestrateCard extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.appcode = '36010IRCG';
		this.pageId = '36010IRCG_card';
		this.props.pageType = 'group';
	}
	render() {
		return <Card pageType="group" pageTitle="36010IRCG-000000" moduleId="36010IRCG" {...this.props} />;
	}
}

InterestrateCard = createPage({
	billinfo: {
		billtype: 'extcard',
		pagecode: '36010IRCG_card',
		headcode: 'head',
		bodycode: [ 'rationrate', 'overduerate', 'advancerate' ]
	}
	// initTemplate: initTemplate
})(InterestrateCard);
export default InterestrateCard;
// ReactDOM.render(<InterestrateCard />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/