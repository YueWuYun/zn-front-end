/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseCard from "../../../public/components/BaseCard";
import { initForm } from "../../../public/container/page";
import { API_URL, app_code, billtype, CARD, disableReason, DISABLE_BTN_PARAM, impawnbackAreaCode, module_id, nodekey, TRAN_CARD_PAGE_INFO } from "../cons/constant.js";
import { REF21_CONST } from "../ref21/const";
import { afterEvent, buttonVisible, initTemplate, initTemplate1, initTemplate2 } from "./events";
//componentDidMount
function cardDidMount() {
  let status = this.props.getUrlParam("status");
  initForm.call(this, status);
}

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //根据场景加载相应initTemplate
  getInitTemplate = () => {
    let scene = this.props.getUrlParam("scene");
    if (scene === "linksce") {
      //联查场景
      return initTemplate1;
    } else if (scene === "approvesce") {
      //审批详情场景
      return initTemplate2;
    } else {
      return initTemplate;
    }
  };

  render() {
    return (
      <BaseCard
        constant={{
          appcode: app_code,
          pageId: TRAN_CARD_PAGE_INFO.PAGE_CODE,
          moduleId: module_id,
          formId: TRAN_CARD_PAGE_INFO.HEAD_CODE,
          searchId: REF21_CONST.searchId,
          baseinfo: CARD.baseinfo,
          transferListId: TRAN_CARD_PAGE_INFO.LEFT_CODE, //转单列表id
          primaryId: CARD.primary_id, //主键ID
          billNo: CARD.billno, //单据编号
          dataSource: REF21_CONST.Ref21DataSource, //缓存key
          nodekey, //打印用
          API_URL, //接口地址
          transferQueryUrl: API_URL.impawnpooltranstocard, //转单卡片接口地址
          billtype, //单据类型，联查审批详情需要
          disabledBtnsParam: DISABLE_BTN_PARAM, //根据选中数据判断对应按钮禁用状态
          //headDisabledItems,						//表头禁用字段
          encryptVOClassName:
            "nccloud.itf.pfbm.impawnpool.ImpawnpoolEncryptVO4NCC",
          cafalg: "false",
          transferCard: true, //是否是转单卡片页面
          TRAN_LIST_PAGE_URL: "/ref21",
          disableReason: disableReason,
          modulecode: "3620",
          impawnbackAreaCode: impawnbackAreaCode,
          impawnbackdate: "impawnbackdate",
          impawnbackpersonid: "impawnbackpersonid"
        }}
        _initTemplate={this.getInitTemplate.call(this)}
        _buttonVisible={buttonVisible}
        _afterEvent={afterEvent}
        pageTitle={
          this.props.MutiInit.getIntl("36200BI") &&
          this.props.MutiInit.getIntl("36200BI").get("36200BI-000002")
        } //节点标题
        headBtnArea={CARD.head_btn_code} //表头按钮区域
        formParams={{
          expandArr: [CARD.ebank, CARD.withdrawstatus]
        }} //表头form参数
        linkItems={["approveDetail"]} //联查显示的组件
        cardDidMount={cardDidMount} //componentDidMount
        {...this.props}
      />
    );
  }
}

Card = createPage({
  billinfo: {
    billtype: "card",
    pagecode: TRAN_CARD_PAGE_INFO.PAGE_CODE,
    headcode: TRAN_CARD_PAGE_INFO.HEAD_CODE
  },
  mutiLangCode: module_id
})(Card);
export default Card;
// ReactDOM.render(<Card />, document.querySelector('#app'));

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/