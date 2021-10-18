/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
/* 
 应付票据贴现列表页
 created by：xiezhp 2019-11-5
 update: 
*/
import { createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseList from "../../../public/components/BaseList";
// import { initList } from "../../../public/container/page";
import {
  API_URL,
  app_code,
  billtype,
  CARD,
  DATA_SOURCE,
  LIST,
  modelname,
  module_id,
  nodekey,
  searchCache,
  fullAggClassName,
  tableName
} from "../cons/constant";
import { initTemplate, initTemplate1 } from "./events";
import { buttonVisiable } from "./events/buttonVisiable";
class List extends Component {
  constructor(props) {
    super(props);
    this.API_URL = API_URL;
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
    let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo");
    if (pk_ntbparadimvo || (scene === "linksce" || scene === "fip")) {
      return initTemplate1;
    } else {
      //预算反联查单据
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
    buttonVisiable.call(this, this.props);
    return serval;
  };
  // 设置选中数据按钮的可点击性
  myselectedEvent = function (props, moduleId, record, index, status) {
    buttonVisiable.call(this, this.props);
  };
  // 缓存回写回调函数
  componentInitFinished = function () {
    // initList.call(this);
    buttonVisiable.call(this, this.props);
  };
  /**查询区渲染完成回调函数 */
  myRenderCompleteEvent = function () {
    let muti = this.props.MutiInit.getIntl(module_id); //this.moduleId
    let discountinterest = muti && muti.get("36180PDT-000008"); /* 国际化处理： 贴现利息*/
    let ddiscountdate = muti && muti.get("36180PDT-000011"); /* 国际化处理： 贴现日期*/
    let start = muti && muti.get("36180PDT-000009"); /* 国际化处理： 由*/
    let end = muti && muti.get("36180PDT-000010"); /* 国际化处理： 至*/
    this.props.search.setTemlateByField(
      this.searchId,
      "discountinterest",
      "defaultPlaceholder",
      { start: discountinterest + start, end: discountinterest + end }
    );
    this.props.search.setTemlateByField(
      this.searchId,
      "ddiscountdate",
      "defaultPlaceholder",
      { start: ddiscountdate + start, end: ddiscountdate + end }
    );
    this.renderCompleteEvent();
  };
  render() {
    let muti = this.props.MutiInit.getIntl(module_id); //this.moduleId
    const tabs = {
      defaultKey: "-1",
      allKey: "all",
      items: [
        {
          key: "-1",
          name: "numZY",
          title:
            muti && muti.get("36180PDT-000005")
        } /* 国际化处理： 待提交*/,
        {
          key: "2,3",
          name: "numTJ",
          title:
            muti && muti.get("36180PDT-000006")
        } /* 国际化处理： 审批中*/,
        {
          key: "all",
          title:
            muti && muti.get("36180PDT-000007")
        } /* 国际化处理： 全部*/
      ],
      tabChangeServal: this.tabChangeServal.bind(this)
    };

    const pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo"); //预算反联查
    return (
      <BaseList
        constant={{
          appcode: app_code,
          moduleId: module_id,
          searchId: LIST.search_id,
          cardPageCode: CARD.page_id,
          tableId: LIST.table_id,
          pageId: LIST.page_id,
          apCode: LIST.app_code,
          nodekey: nodekey, //打印输出编码
          dataSource: DATA_SOURCE, //缓存key
          searchCache, //查询区缓存
          // oid: LIST.search_oid, //查询区oid
          primaryId: LIST.primary_id,
          pk_inbalaacc: "pk_inbalaacc",
          billNo: LIST.billno, //单据编号
          billstatus: LIST.billstatus, //单据编号
          API_URL: API_URL, //接口地址
          disabledBtn: LIST.disabled_btn, //默认禁用按钮
          billtype, //单据类型，联查审批详情需要
          modelname, //模块名称
          cardpageId: CARD.page_id,
          modulecode: "3618",
          fullAggClassName: fullAggClassName,
          tableName
        }}
        _initTemplate={this.getInitTemplate.call(this)}
        _selectedEvent={this.myselectedEvent}
        _renderCompleteEvent={this.myRenderCompleteEvent}
        _componentInitFinished={this.componentInitFinished}
        pageTitle={
          this.props.MutiInit.getIntl("36180PDT") &&
          this.props.MutiInit.getIntl("36180PDT").get("36180PDT-000002")
        } //页面标题/* 国际化处理： 应付票据贴现*/
        headBtnArea={LIST.head_btn_code} //表头按钮区域
        showSearch={!pk_ntbparadimvo}
        listTabs={!pk_ntbparadimvo ? tabs : undefined}      //反联查不显示tab页签
        initImport={false} //导入导出
        linkItems={["approveDetail", "ntb",]} //联查显示的组件
        {...this.props}
      />
    );
  }
}

List = createPage({
  mutiLangCode: "36180PDT"
})(List);
export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/