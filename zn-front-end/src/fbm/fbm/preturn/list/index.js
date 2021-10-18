/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
应付票据退票——列表页
*/
import { createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseList from "../../../public/components/BaseList";
import { CARD } from "../../preturn/cons/constant";
import { API_URL, app_code, billtype, DATA_SOURCE, fullAggClassName, LIST, modelname, modulecode, nodekey, searchCache,tableName } from "../cons/constant";
import { buttonDisable, initTemplate, initTemplate1 } from "./events";

class List extends Component {
  constructor(props) {
    super(props);
    this.API_URL = API_URL;
    this.state = {
      json: {},
      inlt: null
    };
  }

  /**查询区渲染完成回调函数 */
  myRenderCompleteEvent = function() {
    let muti = this.props.MutiInit.getIntl("36180PRR");
    let money = muti && muti.get("36180PRR-000010"); /* 国际化处理： 票据金额*/
    let start = muti && muti.get("36180PRR-000011"); /* 国际化处理： 开始*/
    let end = muti && muti.get("36180PRR-000012"); /* 国际化处理： 结束*/
    this.props.search.setTemlateByField(
      this.searchId,
      "money",
      "defaultPlaceholder",
      { start: money + start, end: money + end }
    );
    this.renderCompleteEvent();
  };

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

  // 设置选中数据按钮的可点击性
  myselectedEvent = function(props, moduleId, record, index, status) {
    buttonDisable.call(this);
  };

  render() {
    const tabs = {
      defaultKey: "-1",
      allKey: "all",
      items: [
        {
          key: "-1",
          name: "numZY",
          title:
            this.props.MutiInit.getIntl("36180PRR") &&
            this.props.MutiInit.getIntl("36180PRR").get("36180PRR-000006")
        } /* 国际化处理： 待提交*/,
        {
          key: "2,3",
          name: "numTJ",
          title:
            this.props.MutiInit.getIntl("36180PRR") &&
            this.props.MutiInit.getIntl("36180PRR").get("36180PRR-000007")
        } /* 国际化处理： 审批中*/,
        {
          key: "all",
          title:
            this.props.MutiInit.getIntl("36180PRR") &&
            this.props.MutiInit.getIntl("36180PRR").get("36180PRR-000008")
        } /* 国际化处理： 全部*/
      ],
      tabChangeServal: this.tabChangeServal.bind(this)
    };
    const pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo"); //预算反联查
    return (
      <BaseList
        json={this.state.json}
        inlt={this.state.inlt}
        constant={{
          modulecode: modulecode,
          cardPageCode: CARD.page_id,
          searchId: LIST.search_id,
          tableId: LIST.table_id,
          pageId: LIST.page_id,
          cardpageId: CARD.page_id,
          nodekey: nodekey, //打印输出编码
          dataSource: DATA_SOURCE, //缓存key
          searchCache, //查询区缓存
          // oid: LIST.search_oid, //查询区oid
          primaryId: LIST.primary_id,
          billNo: LIST.billno, //单据编号
          modelname, //模块名称
          billstatus: LIST.billstatus, //单据状态
          API_URL: API_URL, //接口地址
          disabledBtn: LIST.disabled_btn, //默认禁用按钮
          disabledBtnOne: LIST.disabled_btn_one, //列表只有一条数据的条件，按钮才可用
          billtype, //单据类型，联查审批详情需要
          fullAggClassName: fullAggClassName, //联查预算
          tableName
        }}
        _renderCompleteEvent={this.myRenderCompleteEvent}
        _initTemplate={this.getInitTemplate.call(this)}
        pageTitle={
          this.props.MutiInit.getIntl("36180PRR") &&
          this.props.MutiInit.getIntl("36180PRR").get("36180PRR-000003")
        } //页面标题/* 国际化处理： 应付票据退票*/
        headBtnArea={LIST.head_btn_code} //表头按钮区域
        _selectedEvent={this.myselectedEvent}
        showSearch={!pk_ntbparadimvo}
        listTabs={!pk_ntbparadimvo ? tabs : undefined} //反联查不显示tab页签
        linkItems={["approveDetail", "ntb"]} //联查显示的组件
        initImport={false}
        {...this.props}
      />
    );
  }
}

List = createPage({
  mutiLangCode: app_code
})(List);
export default List;
// ReactDOM.render(<List />, document.querySelector('#app'));

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/