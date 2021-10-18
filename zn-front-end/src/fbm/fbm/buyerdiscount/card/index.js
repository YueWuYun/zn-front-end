/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 应付票据贴现卡片页
 created by：xiezhp 2019-11-5
 update: 
*/
import { base, createPage, high } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseCard from "../../../public/components/BaseCard";
import { initForm } from "../../../public/container/page";
import {
  API_URL,
  app_code,
  billtype,
  CARD,
  DATA_SOURCE,
  DISABLE_BTN_PARAM,
  module_id,
  nodekey,
  LIST,
  fullAggClassName,
  tableName
} from "../cons/constant.js";
import {
  afterEvent,
  buttonVisible,
  initTemplate,
  initTemplate1,
  initTemplate2
} from "./events";

//componentDidMount
function cardDidMount() {
  let status = this.props.getUrlParam("status");
  initForm.call(this, status);
}

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json: {},
      inlt: null
    };
  }

  componentDidMount() {
    let callback = (json, status, inlt) => {
      // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
      if (status) {
        this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
      }
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
    const headDisabledItems = [
    {
      //币种为人民币时禁用组织本币汇率
      key: "olcrate",
      rules: () => {
          let olcrate = this.props.form.getFormItemsValue(
              CARD.form_id,
              "olcrate"
          );
          return olcrate && olcrate.value === "1.00";
      }
  },
  {
      //币种为人民币时禁用组织本币汇率
      key: "glcrate",
      rules: () => {
          let glcrate = this.props.form.getFormItemsValue(
              CARD.form_id,
              "glcrate"
          );
          return glcrate && glcrate.value === "1.00";
      }
  },
  {
      //币种为人民币时禁用组织本币汇率
      key: "gllcrate",
      rules: () => {
          let gllcrate = this.props.form.getFormItemsValue(
              CARD.form_id,
              "gllcrate"
          );
          return gllcrate && gllcrate.value === "1.00";
      }
  }
];
    return (
      <BaseCard
        constant={{
          appcode: app_code,
          pageId: CARD.page_id,
          listPageCode: LIST.page_id,
          moduleId: module_id,
          formId: CARD.form_id,
          primaryId: CARD.primary_id, //主键ID
          billNo: CARD.billno, //单据编号
          dataSource: DATA_SOURCE, //缓存key
          modulecode: "3618",
          nodekey: nodekey, //打印用
          pk_inbalaacc:"pk_inbalaacc",
          API_URL, //接口地址
          billtype, //单据类型，联查审批详情需要
          disabledBtnsParam: DISABLE_BTN_PARAM, //根据选中数据判断对应按钮禁用状态
          cafalg: false,
          fullAggClassName: fullAggClassName,
          headDisabledItems, //表头禁用字段
          tableName
        }}
        _initTemplate={this.getInitTemplate.call(this)}
        _buttonVisible={buttonVisible}
        _afterEvent={afterEvent}
        pageTitle={
          this.props.MutiInit.getIntl("36180PDT") &&
          this.props.MutiInit.getIntl("36180PDT").get("36180PDT-000002")
        } //页面标题/* 国际化处理： 应付票据贴现*/
        headBtnArea={CARD.head_btn_code} //表头按钮区域
        formParams={{
          expandArr: []
        }} //表头form参数
        linkItems={["approveDetail","ntb",]} //联查显示的组件
        cardDidMount={cardDidMount}
        {...this.props}
      />
    );
  }
}

Card = createPage({
  billinfo: {
    billtype: "card",
    pagecode: CARD.page_id,
    headcode: CARD.form_id
  },
  mutiLangCode: "36180PDT"
})(Card);
export default Card;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/