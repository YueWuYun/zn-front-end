/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
 基准利率设置-全局卡片页
 created by：liyaoh 2018-08-25
*/
import { createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import Card from "../../nbfo/acccard";
class InterestrateCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.appcode = "36010NBFO";
    }
    render() {
        return (
            <Card
                moduleId="36010NBFO"
                pageType="global"
                {...this.props}
                {...this}
            />
        );
    }
}

InterestrateCard = createPage({
    billinfo: {
        pagecode: "36010NBFO_bankacc_card",
        headcode: "head"
    }
})(InterestrateCard);
export default InterestrateCard;
// ReactDOM.render(<InterestrateCard />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/