/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
银行领用卡片页
 created by：zhoulyu 
 update: 2019-10-12
*/
import { createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseCard from "../../../public/components/BaseCard";
import { initForm } from "../../../public/container/page";
import { API_URL, app_code, billtype, CARD, COMMON, DATA_SOURCE, disableReason, fullAggClassName, LIST, modulecode, nodekey,tableName } from "../cons/constant.js";
import { afterEvent, afterTableEvent, bodyButtonClick, bodySelectedAllEvent, bodySelectedEvent, buttonVisible, initTemplate, initTemplate1, initTemplate2 } from "./events";

function cardDidMount() {
  let status = this.props.getUrlParam("status");
  initForm.call(this, status);
}

//保存前校验
function saveBefore(saveAction) {
  if (!this.props.cardTable.checkTabRequired(CARD.tab_code)) {
    return;
  }
  saveAction();
}

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json: {},
      inlt: null
    };
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
    //表头禁用字段
         const headDisabledItems = [
            //币种为人民币时禁用组织本币汇率
            {
                key: "olcrate",
                rules: () => {
                    let olcrate = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "olcrate"
                    );
                    return olcrate && Number(olcrate.value) === 1;
                }
            },
            {
                key: "glcrate",
                rules: () => {
                    let glcrate = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "glcrate"
                    );
                    return glcrate && Number(glcrate.value) === 1;
                }
            },
            {
                key: "gllcrate",
                rules: () => {
                    let gllcrate = this.props.form.getFormItemsValue(
                        CARD.form_id,
                        "gllcrate"
                    );
                    return gllcrate && Number(gllcrate.value) === 1;
                }
            }
        ];
    return (
      <BaseCard
        json={this.state.json}
        inlt={this.state.inlt}
        constant={{
          modulecode: modulecode, //商业汇票模块编码
          pageId: CARD.page_id, //卡片页面的应用编码，用以跳转页面传参
          listPageCode: LIST.page_id, //列表页面的应用编码
          formId: CARD.form_id, //卡片表头区域编码
          primaryId: CARD.primary_id, //当前单据的元数据主键字段名称
          billNo: CARD.billno, //单据编号字段名称
          dataSource: DATA_SOURCE, //缓存key
          tabCode: CARD.tab_code, //卡片子表列表区域code编码
          tabOrder: CARD.tab_order, //tab排序
          tabId: CARD.tab_id, //tab主键
          nodekey, //打印用
          API_URL, //接口地址
          billtype, //单据类型，联查审批详情需要
          fields: COMMON.fields, //字段名
          tableTypeObj: {
            registerbill: "cardTable"
          },
          cafalg: "false",
          fullAggClassName: fullAggClassName, //联查预算
          disableReason: disableReason, //作废区域编码
          tableName, 
          headDisabledItems //表头禁用字段
        }}
        _initTemplate={this.getInitTemplate.call(this)}
        _buttonVisible={buttonVisible}
        _afterEvent={afterEvent}
        _afterTableEvent={afterTableEvent}
        _bodyButtonClick={bodyButtonClick}
        _bodySelectedEvent={bodySelectedEvent}
        _bodySelectedAllEvent={bodySelectedAllEvent}
        pageTitle={
          this.props.MutiInit.getIntl("36180BR") &&
          this.props.MutiInit.getIntl("36180BR").get("36180BR-000003")
        } //页面标题/* 国际化处理： 银行领用*/
        headBtnArea={CARD.head_btn_code} //表头按钮区域
        shoulderBtnArea={CARD.shoulder_btn_code} //表体tab区域肩部区域按钮code
        cardDidMount={cardDidMount} //componentDidMount
        linkItems={["approveDetail", "ntb"]} //联查显示的组件
        tabTableParams={{
          //这个参数会覆盖BaseCard里的参数
          hideAdd: false, //隐藏侧拉增行按钮
          hideDel: false, //隐藏侧拉删行按钮
          showCheck: true
        }}
        saveBefore={saveBefore} //保存前校验
        {...this.props}
      />
    );
  }
}

Card = createPage({
  billinfo: {
    tabs: true, //tab多子表
    billtype: "extcard",
    pagecode: CARD.page_id,
    headcode: CARD.form_id,
    bodycode: CARD.tab_order
  },
  orderOfHotKey: [CARD.form_id, CARD.tab_code], //定义页面渲染完成后自动聚焦的区域
  mutiLangCode: app_code
})(Card);
export default Card;
// ReactDOM.render(<Card />, document.querySelector('#app'));

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/