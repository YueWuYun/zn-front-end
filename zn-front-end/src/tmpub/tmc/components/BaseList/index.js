/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
 列表页组件
 created by：liyaoh 2018-12-07
*/
import { cardCache, high } from "nc-lightapp-front";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { list } from "../../container/index";
import {
  getListData,
  pageInfoClick,
  selectedAllEvent,
  selectedEvent
} from "./events";
import Header from "./Header";
import Tabs from "./Tabs";

const { NCUploader, PrintOutput, ApprovalTrans, ApproveDetail } = high;
let { setDefData, getDefData } = cardCache;

class BaseList extends Component {
  static defaultProps = {
    disableRowDoubleClick: false, //禁用表格行双击
    customState: {},
    showSearch: true //默认显示查询区
  };

  constructor(props) {
    super(props);
    for (let k in props.config) {
      this[k] = props.config[k];
    }
    this.state = {
      json: {},
      inlt: null,
      tabNum: {}, //tab页签显示数量
      activeTab: props.listTabs ? props.listTabs.defaultKey : "",
      showUploader: false, //是否显示附件上传
      billInfo: {}, //附件上传信息
      //输出用
      outputData: {
        funcode: "", //功能节点编码，即模板编码
        nodekey: "", //模板节点标识
        outputType: "output"
      },
      showApproveDetail: false, //是否显示审批详情
      compositedata: null, //指派信息
      compositedisplay: false, //是否显示指派
      curPk: "", //当前选中数据的pk
      ...props.customState
    };
    props.initTemplate.call(this, props);
  }

  componentWillMount() {
    let callback = (json, status, inlt) => {
      // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
      if (status) {
        this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
      }
    };
    this.props.MultiInit.getMultiLang({
      moduleId: "TMCPUB",
      domainName: "bond",
      callback
    });
  }

  componentDidMount() {
    this.setCacheTabNum();
  }

  //设置选中页签和页签数字到缓存中
  setCacheTabNum = () => {
    let tabGroupCache = getDefData("tabGroup", "tabCache");
    let activeTabCache = getDefData("activeTab", "tabCache");
    tabGroupCache && this.setState({ tabNum: tabGroupCache });
    activeTabCache && this.setState({ activeTab: activeTabCache });
  };

  //列表查询成功后的回调函数
  queryListCallback = res => {
    this.setTabNum(res);
  };

  //设置tab页签数量
  setTabNum = res => {
    if (!this.props.listTabs) return;
    //设置tab页签显示的数字
    let numsObj = {};
    const { groupName } = this.props.listTabs;
    if (res.data) {
      let resNums = groupName && res.data[groupName];
      this.props.listTabs.items.map(item => {
        if (item.name && resNums) {
          numsObj[item.name] = resNums[item.name];
        }
      });
      setDefData("tabGroup", "tabCache", numsObj); //页签数字放到缓存中
      this.setState({
        tabNum: numsObj
      });
    }
  };

  //页签筛选
  handleTabsChange = key => {
    this.props.listTabs.onTabChange(key, serval => {
      let searchCache = getDefData(
        this.searchCache.key,
        this.searchCache.dataSource
      );
      setDefData("activeTab", "tabCache", key);
      this.setState({ activeTab: key });
      searchCache && getListData.call(this, [serval]);
    });
  };

  //双击表格行跳转卡片页
  handleDoubleClick = (record, index, props) => {
    props.pushTo("/card", {
      status: "browse",
      id: record[this.primaryId].value,
      pagecode: this.pageId,
      scene: this.props.getUrlParam("scene")
    });
  };

  //提交即指派
  getAssginUsedr = value => {
    list.listCommit.call(this, {
      data: {
        pks: this.state.curPk,
        userObj: value
      },
      successAfter: () => {
        this.compositeTurnOff();
      }
    });
  };

  //取消提交即指派
  compositeTurnOff = () => {
    this.setState({
      compositedata: null,
      compositedisplay: false
    });
  };

  renderSearch = ({ search, searchConfig, searchBtnClick }) => {
    const { NCCreateSearch } = search;
    return (
      <div className="nc-bill-search-area">
        {NCCreateSearch(this.searchId, {
          clickSearchBtn: searchBtnClick.bind(this),
          showAdvBtn: true,
          ...searchConfig
        })}
      </div>
    );
  };

  renderTable = ({ table, tableConfig, ...props }) => {
    const { createSimpleTable } = table;
    let onRowDoubleClick;
    if (!props.disableRowDoubleClick) {
      onRowDoubleClick = tableConfig.onRowDoubleClick
        ? tableConfig.onRowDoubleClick.bind(this)
        : this.handleDoubleClick.bind(this);
    }
    return (
      <div className="nc-bill-table-area" style={{ overflow: "hidden" }}>
        {createSimpleTable(this.tableId, {
          handlePageInfoChange: pageInfoClick.bind(this),
          showCheck: true,
          dataSource: this.dataSource,
          pkname: this.primaryId,
          onSelected: this.props._selectedEvent
            ? this.props._selectedEvent.bind(this)
            : selectedEvent.bind(this),
          onSelectedAll: this.props._selectedEvent
            ? this.props._selectedEvent.bind(this)
            : selectedEvent.bind(this),
          onRowDoubleClick,
          onSelected: selectedEvent.bind(this),
          onSelectedAll: selectedAllEvent.bind(this),
          ...tableConfig
        })}
      </div>
    );
  };

  render() {
    const {
      table,
      button,
      search,
      pageTitle,
      buttonClick,
      headBtnArea,
      listTabs,
      showSearch,
      searchBtnClick,
      searchConfig = {},
      tableConfig = {},
      children,
      socket
    } = this.props;
    const {
      billInfo,
      outputData,
      showUploader,
      showApproveDetail,
      compositedata,
      compositedisplay
    } = this.state;
    const { createButtonApp } = button;
    let tabItems =
      listTabs &&
      listTabs.items.map(item => {
        if (item.name !== listTabs.allKey) {
          item.num = this.state.tabNum[item.name];
        }
        return item;
      });
    let commonRender = [
      <PrintOutput
        ref="printOutput"
        url={this.API_URL.print}
        data={outputData}
        callback={this.onSubmit}
      />
    ];
    //附件
    if (showUploader) {
      commonRender.push(
        <NCUploader
          placement={"bottom"}
          {...billInfo}
          onHide={() => {
            this.setState({
              showUploader: false
            });
          }}
        />
      );
    } else if (showApproveDetail) {
      //审批详情
      commonRender.push(
        <ApproveDetail
          show={showApproveDetail}
          billtype={this.billtype}
          billid={billInfo.billId}
          close={() => {
            this.setState({
              showApproveDetail: false
            });
          }}
        />
      );
    } else if (compositedisplay) {
      //提交即指派
      commonRender.push(
        <ApprovalTrans
          title={this.state.json["TMCPUB-000012"]} /* 国际化处理： 指派*/
          data={compositedata}
          display={compositedisplay}
          getResult={this.getAssginUsedr}
          cancel={this.compositeTurnOff}
        />
      );
    }
    return (
      <div className="nc-bill-list">
      {/* 适配 socket 开始 */}
			{socket.connectMesg({
             tableAreaCode: this.tableId,
             billpkname: this.primaryId,
             billtype: this.billtype
            // dataSource: this.dataSource
          })}
          {/* 适配 socket 结束 */}
        {/* 头部区域 包含页面标题和头部按钮 */}
        <Header title={pageTitle} BillHeadInfo={this.props.BillHeadInfo}>
          {createButtonApp({
            area: headBtnArea,
            onButtonClick: buttonClick.bind(this)
          })}
        </Header>

        {/* 查询区域 */}
        {showSearch &&
          this.renderSearch({
            search,
            searchConfig,
            searchBtnClick
          })}

        {//Tab页签区域
        listTabs && (
          <Tabs
            defaultKey={listTabs.defaultKey}
            allKey={listTabs.allKey}
            items={tabItems}
            onTabChange={this.handleTabsChange}
          />
        )}
        {/* 表格区域 */}
        {this.renderTable({ table, tableConfig, ...this.props })}

        {/* 通用组件渲染 */}
        {commonRender}

        {/* 自定义区域 根据父组件传进来的children渲染 */}
        {children && children(this)}
      </div>
    );
  }
}

BaseList.propTypes = {
  config: PropTypes.object.isRequired, //常量
  initTemplate: PropTypes.func.isRequired, //模板加载方法
  headBtnArea: PropTypes.string.isRequired, //头部按钮区域
  buttonClick: PropTypes.func.isRequired, //头部按钮点击事件
  searchBtnClick: PropTypes.func.isRequired, //查询按钮点击事件
  pageTitle: PropTypes.string.isRequired, //页面标题
  disableRowDoubleClick: PropTypes.bool, //是否禁用表格行双击事件
  showSearch: PropTypes.bool, //是否显示查询区
  listTabs: PropTypes.object, //tab页签参数
  searchConfig: PropTypes.object, //查询区参数
  tableConfig: PropTypes.object, //表格区参数
  didMount: PropTypes.func //componentDidMount
};
export default BaseList;

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/