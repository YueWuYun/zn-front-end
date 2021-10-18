/*
  付款登记列表页
*/
import React, {
  Component
} from "react";
import {
  createPage
} from "nc-lightapp-front";
import {
  initTemplate,
  state4headBtns,
  getPullBillListPageParams
} from "./events";
import {
  MODULE_ID,
  PUB_MULTILANG,
  DATA_SOURCE,
  PULL_DATA_SOURCE,
  PULL_ARR_DATA_CACHE,
  PULL_SUB_DATA_CACHE,
  PULL_SEARCH_CACHE,
  TABLE_CACHE,
  API_URL,
  mutliLangKey,
  PullBillConfig,
} from "../cons/constant";
import BasePullBillList from "../../../public/components/BasePullBillList";

class pullBillList extends Component {
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
   * @param {*} multiLang 多语文件
   * @param {*} status 请求状态
   * @param {*} inlt 占位符
   */

  multiLangCallback = (multiLang, status, inlt) => {
    if (status) {
      this.setState({
        multiLang,
        inlt,
      });
    } else {
      console.log(
        this.state.multiLang["361703DBC-000006"]
      ); /* 国际化处理： 未加载到本页面多语资源 */
    }
  };
 // 表头标题信息信息处理
 getPageTileInfo = () => {
  let {multiLang } = this.state;
  let name = this.props.getUrlParam("name");
  let dataSource = PULL_DATA_SOURCE;
  let pageTitle =
      multiLang["361703DBC-000007"]; /* 国际化处理： 押汇申请生成押汇合同 */
  if (name === "Arrival") {
    dataSource = PULL_ARR_DATA_CACHE;
    pageTitle =
      multiLang["361703DBC-000008"]; /* 国际化处理： 到单承付生成押汇合同 */
  } else if (name === "Submission") {
    dataSource = PULL_SUB_DATA_CACHE;
    pageTitle =
     multiLang["361703DBC-000009"]; /* 国际化处理： 交单登记生成押汇合同 */
  }
  return {
    dataSource,
    name,
    pageTitle,
  };
};
  render() {
    
    let {dataSource,name,pageTitle } = this.getPageTileInfo();
    let {
      pagecode,
      transferTablePk,
      head_btn_code,
      search_id,
      search_oid,
      transferTableId,
    } = getPullBillListPageParams.call(this, PullBillConfig);
    return ( <BasePullBillList BillConfig = {
        {
          pageId: pagecode, // 拉单列表页页面模板编码
          pageTitle: pageTitle, // 节点标题
          moduleId: MODULE_ID, // 所属模块
          pub_multilang: PUB_MULTILANG, // 模块公共多语key
          mutliLangKey: mutliLangKey, // 本模块多语key
          API_URL: API_URL, //接口地址
          primaryId: transferTablePk, // 拉单列表数据单据主键
          initTemplate: initTemplate,
          dataSource: dataSource, // 应用节点缓存唯一标识
          tableCache: TABLE_CACHE, // 表格数据缓存key
          searchCache: PULL_SEARCH_CACHE, // 查询区缓存
        }
      }
      PullBillConfig = {
        PullBillConfig
      } // 拉单配置
      BtnConfig = {
        {
          btnArea: head_btn_code, // 拉单列表页表头按钮区域编码
          btnsRule: state4headBtns, // 表头按钮可用规则
        }
      }
      SearchConfig = {
        {
          show: true, // 是否显示查询区
          searchId: search_id, // 拉单查询区编码
          oid: search_oid, // 拉单查询区oid
        }
      }
      TableConfig = {
        {
          tableId: transferTableId, // 拉单列表区域编码
        }
      } {
        ...this.props
      }
      />
    );
  }
}

pullBillList = createPage({})(pullBillList);
export default pullBillList;