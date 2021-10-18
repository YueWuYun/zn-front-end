/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
 基准利率设置-全局卡片页
 created by：liyaoh 2018-08-25
*/
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { createPage } from "nc-lightapp-front";
import Card from "../../nbfo/card";
class InterestrateCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.appcode = "36010NBFO";
    this.pageId = "36010NBFO_card";
    this.props.pageType = "global";
  }
  render() {
    return (
      <Card
        pageType="global"
        pageTitle="36010NBFO-000044"
        moduleId="36010NBFO"
        {...this.props}
        {...this}
      />
    );
  }
}

InterestrateCard = createPage({
  billinfo: {
    billtype: "extcard",
    pagecode: "36010NBFO_card",
    headcode: "head",
    bodycode: ["bankaccount"],
  },
})(InterestrateCard);
export default InterestrateCard;
// ReactDOM.render(<InterestrateCard />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/