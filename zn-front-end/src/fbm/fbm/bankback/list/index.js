/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import { createPage } from "nc-lightapp-front";
import React, { Component } from "react";
import BaseList from "../../../public/components/BaseList";
import { CARD } from "../../bankback/cons/constant";
import { API_URL, app_code, billtype, DATA_SOURCE, disableReason, fullAggClassName, LIST, modelname, modulecode, nodekey, searchCache,tableName } from "../cons/constant";
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

  /**查询区渲染完成回调函数 */
  myRenderCompleteEvent = function() {
    let muti = this.props.MutiInit.getIntl("36180BR");
    let money = muti && muti.get("36180BR-000010"); /* 国际化处理： 票据金额*/
    let start = muti && muti.get("36180BR-000011"); /* 国际化处理： 开始*/
    let end = muti && muti.get("36180BR-000012"); /* 国际化处理： 结束*/
    this.props.search.setTemlateByField(
      this.searchId,
      "glgx.pk_register.money",
      "defaultPlaceholder",
      { start: money + start, end: money + end }
    );
    this.renderCompleteEvent();
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
            this.props.MutiInit.getIntl("36180BR") &&
            this.props.MutiInit.getIntl("36180BR").get("36180BR-000006")
        } /* 国际化处理： 待提交*/,
        {
          key: "2,3",
          name: "numTJ",
          title:
            this.props.MutiInit.getIntl("36180BR") &&
            this.props.MutiInit.getIntl("36180BR").get("36180BR-000007")
        } /* 国际化处理： 审批中*/,
        {
          key: "all",
          title:
            this.props.MutiInit.getIntl("36180BR") &&
            this.props.MutiInit.getIntl("36180BR").get("36180BR-000008")
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
          modulecode: modulecode, //商业汇票模块编码
          cardPageCode: CARD.page_id, //卡片页面的应用编码，用以跳转页面传参
          searchId: LIST.search_id, //列表查询区域编码，用以获取查询条件
          tableId: LIST.table_id, //列表表格区域编码，用以获取多选选中数据
          pageId: LIST.page_id, //列表页面的应用编码
          nodekey: nodekey, //打印输出编码
          dataSource: DATA_SOURCE, //设置页面使用的页面缓存key
          searchCache, //设置列表页面中查询区缓存
          // oid: LIST.search_oid, //查询区的数据库中的主键
          primaryId: LIST.primary_id, //当前单据的元数据主键字段名称
          billNo: LIST.billno, //单据编号字段名称
          modelname, //商业汇票模块名称
          billstatus: LIST.billstatus, //单据状态字段名称
          API_URL: API_URL, //接口地址
          disabledBtn: LIST.disabled_btn, //默认禁用按钮
          disabledBtnOne: LIST.disabled_btn_one, //列表只有一条数据的条件，按钮才可用
          billtype, //单据类型，联查审批详情需要
          fullAggClassName: fullAggClassName, //联查预算全类名
          disableReason: disableReason, //作废区域编码
          tableName
        }}
        _renderCompleteEvent={this.myRenderCompleteEvent} //查询区渲染完成回调函数
        _initTemplate={this.getInitTemplate.call(this)} //初始化模板
        pageTitle={
          this.props.MutiInit.getIntl("36180BR") &&
          this.props.MutiInit.getIntl("36180BR").get("36180BR-000003")
        } //页面标题
        headBtnArea={LIST.head_btn_code} //列表肩部按钮区域编码
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