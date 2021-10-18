/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 银行托管列表页
 created by：liangyen 2019-10-19
 update: 2019-11-08
*/
import { createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseList from "../../../public/components/BaseList";
import {
  API_URL,
  app_code,
  billtype,
  CARD,
  COMMON,
  DATA_SOURCE,
  disableReason,
  DISABLE_BTN_PARAM,
  fullAggClassName,
  LIST,
  modelname,
  module_id,
  nodekey,
  searchCache,
  tableName
} from "../cons/constant";
import { buttonDisable, initTemplate, initTemplate1 } from "./events";

let disabledBtnsParam = [...DISABLE_BTN_PARAM]; //复制数组，不然会共用卡片页disabledBtnsParam的引用
disabledBtnsParam.push({
  btnName: ["Delete", "Commit"],
  rules: current => current.vbillstatus && current.vbillstatus.value !== "-1" //待提交才可以删除
});
disabledBtnsParam.push({
  btnName: "Commit",
  rules: current => current.vbillstatus && current.vbillstatus.value !== "-1" //提交
});
disabledBtnsParam.push({
  btnName: ["Uncommit"],
  rules: current =>
    current.vbillstatus &&
    current.vbillstatus.value !== "3" &&
    current.vbillstatus.value !== "1"
});
disabledBtnsParam.push({
  btnName: [
    "SendInstruction",
    "CancelInstruction",
    "Invalid",
    "CancelInvalid",
    "MakeVoucher",
    "CancelVoucher"
  ],
  rules: current => current.vbillstatus && current.vbillstatus.value !== "1"
});
disabledBtnsParam.push({
  btnName: ["SendInstruction", "CancelInstruction", "Invalid", "CancelInvalid"],
  rules: current => current.onlinebankflag && !current.onlinebankflag.value
});



class List extends Component {
  constructor(props) {
    super(props);
    this.API_URL = API_URL;
    this.state = {
      json: {},
      inlt: null
    };
  }
  // 设置选中数据按钮的可点击性
  myselectedEvent = function(props, moduleId, record, index, status) {
    buttonDisable.call(this);
  };
  componentWillMount() {}

  //根据场景加载相应initTemplate
  getInitTemplate = () => {
    let scene = this.props.getUrlParam("scene");
    let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo");
    if (pk_ntbparadimvo || scene === "linksce" || scene === "fip") {
      //预算反联查单据
      return initTemplate1;
    } else {
      return initTemplate;
    }
  };
  //页签切换需要传的条件
  tabChangeServal = (status, callback) => {
    let serval = {
      field: "vbillstatus",
      value: {
        firstvalue: status != "all" ? status : "-1,0,1,2,3",
        secondvalue: null
      },
      oprtype: status != "all" ? "=" : "in"
    };
    callback(serval);
    return serval;
  };
  render() {
    const tabs = {
      defaultKey: "-1",
      allKey: "all",
      items: [
        {
          key: "-1",
          name: "DTJ",
          title:
            this.props.MutiInit.getIntl("36180BT") &&
            this.props.MutiInit.getIntl("36180BT").get("36180BT-000007")
        }, //* 国际化处理： 待提交*//* 国际化处理： this.props.MutiInit.getIntl("36180BT") && this.props.MutiInit.getIntl("36180BT").get('36180BT-000007')*/* 国际化处理： 国际化处理,待提交*/
        {
          key: "2,3",
          name: "SPZ",
          title:
            this.props.MutiInit.getIntl("36180BT") &&
            this.props.MutiInit.getIntl("36180BT").get("36180BT-000008")
        }, //* 国际化处理： 审批中*//* 国际化处理： this.props.MutiInit.getIntl("36180BT") && this.props.MutiInit.getIntl("36180BT").get('36180BT-000008')*/* 国际化处理： 国际化处理,审批中*/
        // {
        //     key: "4",
        //     name: "numZLCLZ",
        //     title:
        //         this.props.MutiInit.getIntl("36180BT") &&
        //         this.props.MutiInit.getIntl("36180BT").get(
        //             "36180BT-000010"
        //         )
        // } /* 国际化处理： 指令处理中*/,
        {
          key: "all",
          title:
            this.props.MutiInit.getIntl("36180BT") &&
            this.props.MutiInit.getIntl("36180BT").get("36180BT-000009")
        } //* 国际化处理： 全部*//* 国际化处理： this.props.MutiInit.getIntl("36180BT") && this.props.MutiInit.getIntl("36180BT").get('36180BT-000009')*/* 国际化处理： 国际化处理,全部*/
      ],
      tabChangeServal: this.tabChangeServal.bind(this)
    };
    const pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo"); //预算反联查
    return (
      <BaseList
        json={this.state.json}
        inlt={this.state.inlt}
        constant={{
          appcode: app_code,
          moduleId: module_id,
          searchId: LIST.search_id,
          tableId: LIST.table_id,
          pageId: LIST.page_id,
          cardPageCode: CARD.page_id,
          nodekey: nodekey, //打印输出编码
          dataSource: DATA_SOURCE, //缓存key
          searchCache, //查询区缓存
          // oid: LIST.search_oid, //查询区oid
          primaryId: LIST.primary_id,
          billNo: LIST.billno, //单据编号
          billstatus: LIST.billstatus, //单据编号
          API_URL: API_URL, //接口地址
          disabledBtn: LIST.disabled_btn, //默认禁用按钮
          disabledBtnOne: LIST.disabled_btn_one, //列表只有一条数据的条件，按钮才可用
          billtype, //单据类型，联查审批详情需要
          modelname, //模块名称
          disabledBtnsParam, //根据选中数据判断对应按钮禁用状态
          fields: COMMON.fields, //字段名
          fullAggClassName: fullAggClassName, //联查预算
          disableReason: disableReason,
          modulecode: "3618",
          tabStatus: LIST.tabStatus, //列表特殊页签规则
          paymentstatus: LIST.paymentstatus, // 特殊页签对应的条件
          tableName
        }}
        _initTemplate={this.getInitTemplate.call(this)}
        _selectedEvent={this.myselectedEvent}
        pageTitle={
          this.props.MutiInit.getIntl("36180BT") &&
          this.props.MutiInit.getIntl("36180BT").get("36180BT-000004")
        } //节点标题
        headBtnArea={LIST.head_btn_code} //表头按钮区域
        showSearch={!pk_ntbparadimvo}
        listTabs={!pk_ntbparadimvo ? tabs : undefined} //反联查不显示tab页签
        linkItems={["approveDetail", "bankBalance", "ntb"]} //联查显示的组件
        {...this.props}
      />
    );
  }
}
List = createPage({
  mutiLangCode: module_id
})(List);
export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/