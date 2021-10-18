/* 
  押汇合同列表页
*/
import React, { Component } from "react";
import { createPage } from "nc-lightapp-front";
import { initTemplate, state4headBtns, state4innerBtns } from "./events";
import {
  LIST,
  CARD,
  MODULE_ID,
  PUB_MULTILANG,
  DATA_SOURCE,
  TABLE_CACHE,
  SEARCH_CACHE,
  TABS_CACHE,
  TABKEY_CACHE,
  nodekey,
  API_URL,
  billtype,
  LinkConfig,
  mutliLangKey,
  PullBillConfig,
} from "../cons/constant";

import BaseList from "../../../public/components/BaseList";
import { sceneInfo } from "../../../public/container/utils";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      multiLang: {}, // 多语文件 Object
      inlt: null, // 可用来进行占位符的一些操作 Object
    };
  }

  componentWillMount() {
    this.props.MultiInit.getMultiLang({
      moduleId: mutliLangKey,
      domainName: MODULE_ID,
      callback: this.multiLangCallback,
    });
  }

  /**
   * 多语加载成功回调函数
   * @param {*}multiLang 多语文件
   * @param {*}status 请求状态
   * @param {*}inlt 占位符
   */

  multiLangCallback = (multiLang, status, inlt) => {
    if (status) {
      this.setState({ multiLang, inlt });
    } else {
      console.log(
        this.state.multiLang["361703DBC-000004"]
      ); /* 国际化处理： 未加载到本页面多语资源 */
    }
  };

  render() {
    let { multiLang } = this.state;
    let pageTitle = multiLang["361703DBC-000000"]; /* 国际化处理： 押汇合同 */
    let tabs = [
      {
        key: "nocommit",
        num: "(0)",
        status: "-1,0",
        content: multiLang["361703DBC-000001"] /* 国际化处理： 待提交*/,
      },
      {
        key: "approving",
        num: "(0)",
        status: "2,3",
        content: multiLang["361703DBC-000002"] /* 国际化处理： 审批中*/,
      },
      {
        key: "all",
        num: "",
        status: "5",
        content: multiLang["361703DBC-000005"] /* 国际化处理： 全部*/,
      },
    ]; //tab页签
    // 单据场景信息获取 (页面 ID 、是否联查场景以及页面模板)
    let { initTemplateFun, pageId, currentScene } = 
    sceneInfo.call(this, { 
      page_id: LIST.page_id, 
      page_id_link: LIST.page_id_link, 
      initTemplate 
    });
    return (
      <BaseList
        BillConfig={{
          pageId: pageId,
          cardPageCode: CARD.page_id, // 卡片页面编码
          pageTitle: pageTitle, //节点标题
          moduleId: MODULE_ID, // 所属模块
          pub_multilang: PUB_MULTILANG, // 模块公共多语key
          mutliLangKey: mutliLangKey, // 本模块多语key
          billNo: LIST.billNo, //单据编号
          API_URL: API_URL, //接口地址
          nodekey: nodekey, //打印输出编码
          primaryId: LIST.primary_id,
          billtype, //单据类型，联查审批详情需要
          initTemplate: initTemplate,
          dataSource: DATA_SOURCE, // 应用节点缓存唯一标识
          tableCache: TABLE_CACHE, // 表格数据缓存key
          searchCache: SEARCH_CACHE, //查询区缓存
          tabsCache: TABS_CACHE, // 页签集合缓存参数
          tabKeyCache: TABKEY_CACHE, // 激活页签缓存参数
        }}
        BtnConfig={{
          btnArea: LIST.head_btn_code, //表头按钮区域
          btnsRule: state4headBtns, // 表头按钮可用规则
        }}
        SearchConfig={{
          show: currentScene ? false :true, // 是否显示查询区
          searchId: LIST.search_id,
          oid: LIST.search_oid, //查询模板的oid，用于查询查询方案
        }}
        PullBillConfig={PullBillConfig} // 拉单配置
        TabsConfig={{
          show: true, // 是否显示页签
          activeKey: "nocommit", // 默认激活的页签 Key
          info: tabs, // 页签描述
        }}
        TableConfig={{
          tableId: LIST.table_id,
          showOpr: true, // 是否添加列表操作列
          btnArea: "list_inner", // 表格操作列中按钮区域
          btnsRule: state4innerBtns, // 表格操作列中按钮可用规则
        }}
        LinkConfig={LinkConfig} // 联查配置
        {...this.props}
      />
    );
  }
}

List = createPage({})(List);
export default List;
