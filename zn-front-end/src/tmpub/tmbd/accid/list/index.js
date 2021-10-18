/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import {
  ajax,
  base,
  cardCache,
  createPage,
  high,
  toast
} from "nc-lightapp-front";
import React, { Component } from "react";
import "../util/index.less";
import { BatchToast } from "../util/messageUtil";
import {
  appcode,
  cachesearchKey,
  card_page_id,
  confirmModal,
  dataSource,
  list_page_id,
  list_search_id,
  list_table_id,
  module_id
} from "./../cons/constant.js";
import {
  buttonClick,
  initTemplate,
  pageInfoClick,
  searchBtnClick,
  setButtonUsability,
  tableButtonClick,
  tableModelConfirm
} from "./events";

let {
  NCTabsControl,
  NCPopconfirm,
  NCIcon,
  NCMessage,
  NCDatePicker,
  NCModal,
  NCDiv
} = base;
let { setDefData, getDefData } = cardCache;
const format = "YYYY-MM-DD";
//引入附件组件
const { NCUploader, PrintOutput } = high;

class List extends Component {
  constructor(props) {
    super(props);
    this.moduleId = module_id;
    this.searchId = list_search_id;
    this.tableId = list_table_id;
    this.state = {
      // 冻结日期
      frozendate: null,
      // 解冻日期
      defrozendate: null,
      // 冻结类型
      frozentype: null,
      // 冻结金额
      frozenje: null,
      // 附件管理start
      //附件框是否显示
      showUploader: false,
      //单据主键
      billID: "",
      //单据编码
      billNO: "",
      // 附件管理end

      //输出用
      outputData: {
        funcode: "", //功能节点编码，即模板编码
        nodekey: "", //模板节点标识
        printTemplateID: "", //模板id
        oids: [],
        outputType: "output"
      },

      // 确认模态框使用
      showModal_confirm: false,
      content: null,
      record: null,
      index: null
    };
    initTemplate.call(this, props);
  }

  componentDidMount() {
    //this.getData();
    let islink = this.props.getUrlParam("islink");
    //联查1：内部账户联查
    if (islink) {
      //联查处理
      this.getLinkQueryData(this.props.getUrlParam("pk_accid"));
    }
    setButtonUsability.call(this, this.props);
  }

  // 联查处理
  getLinkQueryData = searchData => {
    let sendArr = {
      pks: searchData,
      pageId: this.pageId
    };
    ajax({
      url: "/nccloud/tmpub/tmbd/accidqueryallpk.do",
      data: sendArr,
      success: res => {
        let { success, data } = res;
        if (success) {
          if (data) {
            let rowlenght = data[this.tableId].rows;
            let src = this.props.getUrlParam("pk_accid");
            if (rowlenght.length == 1) {
              let record = rowlenght[0];
              //1条数据跳转到卡片页面
              this.props.pushTo("/card", {
                status: "browse",
                id: record.values.pk_accid.value,
                billno: record.values.accidcode.value,
                pagecode: card_page_id
              });
            } else {
              //多条数据跳转到列表页面
              this.props.table.setAllTableData(
                this.tableId,
                data[this.tableId]
              );
            }
          } else {
            this.props.table.setAllTableData(this.tableId, { rows: [] });
          }
        }
      }
    });
  };

  // 设置按钮样式
  getButtonNames = codeId => {
    if (codeId === "add") {
      return "main-button";
    } else {
      return "secondary - button";
    }
  };

  getData = serval => {
    //查询条件和页签合并
    let searchVal = this.props.search.getAllSearchData(this.searchId);
    let sendVal = searchVal.concat(serval);
    let pageInfo = this.props.table.getTablePageInfo(this.tableId);
    let queryInfo = this.props.search.getQueryInfo(list_search_id, false);
    let oid = queryInfo.oid;

    if (serval) {
      let data = {
        querycondition: sendVal,
        conditions: sendVal && sendVal.conditions,
        pageInfo: pageInfo,
        pagecode: list_page_id,
        //查询区编码
        queryAreaCode: list_search_id,
        //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改《根据功能节点区分》
        oid: oid,
        querytype: "tree"
      };
      ajax({
        url: "/nccloud/tmpub/tmbd/accidquery.do",
        data: data,
        success: res => {
          let { success, data } = res;
          if (success) {
            if (data) {
              this.props.table.setAllTableData(
                this.tableId,
                data[this.tableId]
              );
            } else {
              this.props.table.setAllTableData(this.tableId, { rows: [] });
            }
          }
          setButtonUsability.call(this, this.props);
        }
      });
    }
  };

  //页签筛选
  navChangeFun = (status, className, e) => {
    let serval;
    switch (status) {
      case "1":
        serval = [
          {
            field: "busistatus",
            value: {
              firstvalue: "1",
              secondvalue: null
            },
            oprtype: "=",
            display: null
          }
        ];
        this.getData(serval);
        break;
      case "5":
        break;
    }
  };

  //删除单据
  delConfirm = () => {
    const selectedData = this.props.table.getCheckedRows(this.tableId);
    if (selectedData.length == 0) {
      toast({
        color: "warning",
        content:
          this.props.MutiInit.getIntl("36010IACC") &&
          this.props.MutiInit.getIntl("36010IACC").get("36010IACC--000035")
      }); /* 国际化处理： 请选择数据*/
      return;
    }
    let that = this;
    let deletTableId = this.tableId;
    let indexArr = [];
    let dataArr = [];
    let tsArr = [];
    let delObj = {
      status: "3",
      values: {
        ts: {
          display:
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000039"
            ) /* 国际化处理： 时间戳*/
        },
        pk: {
          display:
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000040"
            ) /* 国际化处理： 主键*/
        }
      }
    };
    //处理选择数据
    selectedData.forEach(val => {
      delObj.rowId = val.data.rowId;
      //ts时间戳
      delObj.values.ts.value = val.data.values.ts.value;
      //主键数组
      dataArr.push(val.data.values.pk_accid.value);
      tsArr.push(val.data.values.ts.value);
    });
    //自定义请求数据
    let data = {
      pks: dataArr,
      tss: tsArr
    };
    ajax({
      url: "/nccloud/tmpub/tmbd/acciddel.do",
      data: data,
      success: function(res) {
        let { success, data } = res;
        if (success) {
          const selecteDelData = that.props.table.getCheckedRows(list_table_id);
          if (data && data.errormsg) {
            // toast({ color: 'warning', content: res.data.errormsg });
            if (res.data && res.data.successpks) {
              let successpks = res.data.successpks.split(",");
              for (let index = 0; index < selecteDelData.length; index++) {
                const pk_accid =
                  selecteDelData[index].data.values.pk_accid.value;
                if (successpks.indexOf(pk_accid) >= 0) {
                  // deleteCacheId(list_table_id, pk_accid);
                  that.props.table.deleteCacheId(list_table_id, pk_accid);
                  that.props.table.deleteTableRowsByIndex(
                    list_table_id,
                    selecteDelData[index].index
                  );
                }
              }
              let status = 2;
              if (successpks.length < 0) {
                status = 0;
              }
              let successIndexs = successpks.length;
              let failIndexs = selecteDelData.length - successpks.length;
              BatchToast(
                "DELETE",
                status,
                selecteDelData.length,
                successIndexs,
                failIndexs,
                res.data.errormsg.split("\n"),
                null,
                that
              );
            } else {
              BatchToast(
                "DELETE",
                0,
                selecteDelData.length,
                0,
                selecteDelData.length,
                res.data.errormsg.split("\n"),
                null,
                that
              );
            }
          } else {
            // toast({ color: 'success', content: this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000013') });/* 国际化处理： 删除成功*/
            if (res.data && res.data.successpks) {
              // const selecteDelData = that.props.table.getCheckedRows(list_table_id);
              let successpks = res.data.successpks.split(",");
              for (let index = 0; index < selecteDelData.length; index++) {
                const pk_accid =
                  selecteDelData[index].data.values.pk_accid.value;
                if (successpks.indexOf(pk_accid) >= 0) {
                  // deleteCacheId(list_table_id, pk_accid);
                  //删除缓存数据
                  that.props.table.deleteCacheId(list_table_id, pk_accid);
                  that.props.table.deleteTableRowsByIndex(
                    list_table_id,
                    selecteDelData[index].index
                  );
                }
              }
            }
            BatchToast(
              "DELETE",
              1,
              selecteDelData.length,
              selecteDelData.length,
              0,
              null,
              null,
              that
            );
          }
          // that.refresh();
        }
      }
    });
  };

  //刷新列表信息
  refresh = () => {
    //分页
    let refreshpageInfo = this.props.table.getTablePageInfo(list_table_id);
    //查询condition
    let refreshsearchVal = this.props.search.getAllSearchData(list_search_id);
    let queryInfo = this.props.search.getQueryInfo(list_search_id, false);
    let oid = queryInfo.oid;
    if (refreshsearchVal && refreshsearchVal.conditions) {
      setDefData(cachesearchKey, dataSource, refreshsearchVal);
      let data = {
        querycondition: refreshsearchVal,
        conditions: refreshsearchVal.conditions || refreshsearchVal,
        pageInfo: refreshpageInfo,
        pagecode: list_page_id,
        //查询区编码
        queryAreaCode: list_search_id,
        //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改《根据功能节点区分》
        oid: oid
      };
      ajax({
        url: "/nccloud/tmpub/tmbd/accidquery.do",
        data: data,
        success: res => {
          let { success, data } = res;
          if (success) {
            if (data) {
              this.props.table.setAllTableData(
                list_table_id,
                data[list_table_id]
              );
            } else {
              this.props.table.setAllTableData(list_table_id, { rows: [] });
            }
            setButtonUsability.call(this, this.props);
          }
        }
      });
    }
  };

  // 查询区渲染完成回调函数
  renderCompleteEvent = () => {
    let cachesearch = getDefData(cachesearchKey, dataSource);
    if (cachesearch && cachesearch.conditions) {
      for (let item of cachesearch.conditions) {
        if (item.field == "accopendate" || item.field == "accxhdate") {
          // 时间类型特殊处理
          let time = [];
          time.push(item.value.firstvalue);
          time.push(item.value.secondvalue);
          this.props.search.setSearchValByField(this.searchId, item.field, {
            display: item.display,
            value: time
          });
        } else {
          this.props.search.setSearchValByField(this.searchId, item.field, {
            display: item.display,
            value: item.value.firstvalue
          });
        }
      }
    }
  };

  // 冻结日期
  frozenModelContent() {
    return (
      <div className="addModal">
        <span className="modal-label">
          {/* 国际化处理： 冻结日期*/}
          {this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get("36010IACC--000015")}
        </span>
        <NCDatePicker
          format={format}
          placeholder={
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get("36010IACC--000015")
          } /* 国际化处理： 冻结日期*/
          value={this.state.frozendate}
          // onChange={this.changeFrozenDate}
          // onChange={val => setTimeout(() => this.changeFrozenDate(val), 0)}
          onChange={val => this.changeFrozenDate(val)}
        />
      </div>
    );
  }

  // 冻结日期改变事件
  changeFrozenDate = value => {
    if (value != this.state.frozendate) {
      this.setState({
        frozendate: value
      });
    }
  };

  // 解冻日期
  defrozenModelContent() {
    return (
      <div className="addModal">
        <span className="modal-label">
          {/* 国际化处理： 解冻日期*/}
          {this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get("36010IACC--000016")}
        </span>
        <NCDatePicker
          format={format}
          placeholder={
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000016"
            ) /* 国际化处理： 解冻日期*/
          }
          value={this.state.defrozendate}
          // onChange={this.changeDefrozenDate}
          // onChange={val => setTimeout(() => this.changeDefrozenDate(val), 0)}
          onChange={val => this.changeDefrozenDate(val)}
        />
      </div>
    );
  }

  // 解冻日期改变事件
  changeDefrozenDate = value => {
    if (value != this.state.defrozendate) {
      this.setState({
        defrozendate: value
      });
    }
  };

  // 附件的关闭点击
  onHideUploader = () => {
    this.setState({
      showUploader: false
    });
  };

  beforeUpload(billId, fullPath, file, fileList) {
    // 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
    //console.log(billId, fullPath, file, fileList);

    const isJPG = file.type === "image/jpeg";
    if (!isJPG) {
      // alert(this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000017'))/* 国际化处理： 只支持jpg格式图片*/
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      // alert(this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000018'))/* 国际化处理： 上传大小小于2M*/
    }
    return isJPG && isLt2M;
    // 备注： return false 不执行上传  return true 执行上传
  }

  closeConfirmModal() {
    this.setState({ showModal_confirm: false });
  }

  DoubleClick = (record, index, props, e) => {
    props.pushTo("/card", {
      status: "browse",
      id: record.pk_accid.value,
      pagecode: card_page_id
    });
  };

  render() {
    let {
      table,
      button,
      search,
      modal,
      ncmodal,
      form,
      BillHeadInfo
    } = this.props;
    let buttons = this.props.button.getButtons();
    let multiLang = this.props.MutiInit.getIntl(this.moduleId);
    let { createSimpleTable } = table;
    let { NCCreateSearch } = search;
    let { createButton, createButtonApp } = button;
    let { createForm } = form;
    const { createBillHeadInfo } = BillHeadInfo;
    let createNCModal = ncmodal.createModal;
    let { createModal } = modal;
    const { frozendate, defrozendate, frozentype, frozenje } = this.state;
    let { showUploader, billID, billNO } = this.state;

    return (
      <div className="nc-bill-list">
        <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
          <div className="header-title-search-area">
            {createBillHeadInfo({
              title:
                this.props.MutiInit.getIntl("36010IACC") &&
                this.props.MutiInit.getIntl("36010IACC").get(
                  "36010IACC--000043"
                ), //标题
              initShowBackBtn: false
            })}
          </div>
          <div className="header-button-area">
            {this.props.button.createButtonApp({
              area: "page_header",
              buttonLimit: 7,
              onButtonClick: buttonClick.bind(this),
              popContainer: document.querySelector(".header-button-area")
            })}
          </div>
        </NCDiv>
        {/* 查询区 */}
        <div className="nc-bill-search-area">
          {/* {NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 2
					})} */}
          {NCCreateSearch(this.searchId, {
            clickSearchBtn: searchBtnClick.bind(this),
            //默认显示几个查询条件
            defaultConditionsNum: 5,
            // 显示高级按钮
            showAdvBtn: true, // 添加高级查询区自定义页签 (fun), return Dom
            addAdvTabs: this.addAdvTabs,
            //                         oid: oid,
            // 查询区渲染完成回调函数
            renderCompleteEvent: this.renderCompleteEvent
          })}
        </div>
        <div className="tab-definInfo-area"></div>
        {/* <div style={{ height: '10px' }} /> */}
        {/*  表格区 */}
        <div className="nc-bill-table-area">
          {createSimpleTable(this.tableId, {
            handlePageInfoChange: pageInfoClick,
            tableModelConfirm: tableModelConfirm,
            showCheck: true,
            showIndex: true,

            onSelected: setButtonUsability.bind(this, this.props),
            onSelectedAll: setButtonUsability.bind(this, this.props),
            onRowDoubleClick: this.DoubleClick.bind(this),
            dataSource: dataSource,
            //给表格加pkname: 表格数据的主键名字(key)
            pkname: "pk_accid",
            componentInitFinished: () => {
              //缓存数据赋值成功的钩子函数
              //若初始化数据后需要对数据做修改，可以在这里处理
              // setButtonUsability.bind(this, this.props);
              setButtonUsability.call(this, this.props);
            }
          })}
        </div>

        {/** 附件 **/}
        <div className="nc-faith-demo-div2">
          {showUploader && (
            <NCUploader
              billId={billID}
              target={null}
              placement={"bottom"}
              billNo={billNO}
              onHide={this.onHideUploader}
              // beforeUpload={this.beforeUpload}
            />
          )}
        </div>

        {/* 输出 */}
        <div>
          <PrintOutput
            ref="printOutput"
            url="/nccloud/sf/delivery/deliveryprint.do"
            data={this.state.outputData}
            callback={this.onSubmit}
          />
        </div>

        {createNCModal("deleteModal", {
          title:
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000041"
            ) /* 国际化处理： 删除确认*/,
          content:
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000042"
            ) /* 国际化处理： 你确定要删除吗?*/,
          beSureBtnClick: this.delConfirm
        })}

        {/* 冻结模态框 */}
        {createModal("frozenModel", {
          title:
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000023"
            ) /* 国际化处理： 冻结*/,
          content: this.frozenModelContent(),
          //点击确定按钮事件
          // beSureBtnClick: beSureBtnClick.bind(this, this.props, 'firststartsettleConfirm')
          hasCloseBtn: false,
          className: "senior"
        })}
        {/* 解冻模态框 */}
        {createModal("defrozenModel", {
          title:
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000024"
            ) /* 国际化处理： 解冻*/,
          content: this.defrozenModelContent(),
          //点击确定按钮事件
          // beSureBtnClick: beSureBtnClick.bind(this, this.props, 'firststartsettleConfirm')
          hasCloseBtn: false,
          className: "senior",
          size: "lg"
        })}
        {/* 销户模态框 */}
        {createModal("destroyModel", {
          title:
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000010"
            ) /* 国际化处理： 销户确认提示*/,
          content:
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000011"
            ) /* 国际化处理： 此操作不可逆！您确认销户吗？*/,
          //点击确定按钮事件
          // beSureBtnClick: tableButtonClick.bind(this, this.props, 'startsettleConfirm',null)
          hasCloseBtn: false,
          className: "senior"
        })}

        {/* 确认按钮 弹框 */}
        {createModal("confirmmodel", {
          // 弹框表头信息
          title:
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000025"
            ) /* 国际化处理： 确认*/,
          // 点确定按钮后，是否自动关闭弹出框.true:手动关。false:自动关
          userControl: false,
          //  模态框大小 sm/lg/xlg
          size: "lg",
          //左侧按钮名称,默认关闭
          rightBtnName:
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000026"
            ) /* 国际化处理： 否*/,
          //右侧按钮名称， 默认确认
          leftBtnName:
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000027"
            ) /* 国际化处理： 是*/,
          hasCloseBtn: false,
          className: "senior"
        })}
        {/* 确认模态框 */}
        <NCModal
          show={this.state.showModal_confirm}
          onHide={this.closeConfirmModal}
          style={{ height: "420px", width: "520px" }}
        >
          {/* <NCModal.Header closeButton={false}>
						<NCModal.Title>{this.props.MutiInit.getIntl("36010SA") && this.props.MutiInit.getIntl("36010SA").get('36010SA-000004')}</NCModal.Title>国际化处理： 提示
					</NCModal.Header> */}
          <NCModal.Body>
            <div>
              {createForm("confirm", {
                // onAfterEvent: afterEvent.bind(this)
              })}
              {this.state.content}
            </div>
          </NCModal.Body>
          <NCModal.Footer>
            {createButtonApp({
              area: confirmModal,
              buttonLimit: 3,
              onButtonClick: tableButtonClick.bind(this)
              // onButtonClick: (props, key) => tableButtonClick.call(that, props, key, text, record, index)
            })}
          </NCModal.Footer>
        </NCModal>
      </div>
    );
  }
}

List = createPage({
  billinfo: {
    billtype: "grid",
    pagecode: list_page_id
  },
  mutiLangCode: appcode
})(List);

// ReactDOM.render(<List />, document.querySelector('#app'));
export default List;

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/