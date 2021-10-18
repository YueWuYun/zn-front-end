/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
//单表卡片
import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  createPage,
  ajax,
  base,
  high,
  cardCache,
  getMultiLang,
  toast,
  createPageIcon
} from "nc-lightapp-front";
import {
  buttonClick,
  initTemplate,
  afterEvent,
  initButton,
  pageInfoClick
} from "./events";
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
import "../util/index.less";
import {
  app_id,
  module_id,
  base_url,
  button_limit,
  oid,
  appcode,
  list_page_id,
  list_search_id,
  list_table_id,
  card_page_id,
  card_from_id,
  card_fromtail_id,
  dataSource,
  confirmModal
} from "./../cons/constant.js";

//引入附件组件
const { NCUploader, PrintOutput } = high;
let {
  NCAnchor,
  NCScrollLink,
  NCScrollElement,
  NCAffix,
  NCDatePicker,
  NCModal,
  NCDiv
} = base;
//返回button
const { NCBackBtn, NCPopconfirm, NCIcon, NCMessage, NCFormControl } = base;
let {
  getNextId,
  getCurrentLastId,
  deleteCacheById,
  getCacheById,
  updateCache,
  addCache
} = cardCache;
const format = "YYYY-MM-DD";

class Card extends Component {
  constructor(props) {
    super(props);
    this.formId = card_from_id;
    this.moduleId = module_id;
    this.tableId = list_table_id;
    this.pageId = card_page_id;
    this.backAccidcode = null;
    this.state = {
      //多语
      json: {},
      // 本地语言en-US
      currentLocale: "zh-CN",
      // 账号
      accidcode: "",
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
      //返回箭头
      showNCbackBtn: false,

      // 确认模态框使用
      showModal_confirm: false,
      content: null,

      // 取个性化中心设置的组织
      curr_pk_org: null,
      curr_orgname: null,
      curr_pk_org_v: null,
      curr_orgname_v: null
    };
    // initTemplate.call(this, props);
  }
  componentDidMount = () => {
    this.initForm(this.props);
    this.toggleShow();
  };

  componentWillMount() {
    let callback = json => {
      this.setState({ json });
      initTemplate.call(this, this.props);
    };
    getMultiLang({ moduleId: appcode, domainName: "tmpub", callback });
    // 关闭浏览器
    window.onbeforeunload = () => {
      let status = this.props.form.getFormStatus(this.formId);
      if (status != "browse") {
        /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
        return (
          this.props.MutiInit.getIntl("36010IACC") &&
          this.props.MutiInit.getIntl("36010IACC").get("36010IACC--000045")
        );
      }
    };
  }

  //加载数据刷新数据
  refresh = () => {
    this.initForm(this.props);
    this.toggleShow();
  };

  // 刷新页面，重新从后台查询
  refreshHtml = () => {
    let islink = this.props.getUrlParam("islink");
    let pk;
    if (islink) {
      pk = this.props.getUrlParam("pk_accid");
    } else {
      pk = this.props.getUrlParam("id");
    }
    if (pk) {
      let data = {
        pk: pk,
        pageid: this.pageId
      };
      ajax({
        url: "/nccloud/tmpub/tmbd/accidquerycard.do",
        data: data,
        success: res => {
          //data要看返回的id，而不是后台设置的id
          //获取后台返回data
          if (res && res.data) {
            this.props.form.setAllFormValue({
              [card_from_id]: res.data[card_from_id]
            });
            this.backAccidcode =
              res.data[this.formId].rows[0].values.accidcode.value;
            initButton(this.props);
            this.toggleShow();
            /*
             * idname: 数据主键的命名
             * id：数据主键的值
             * headAreacode: 卡片表头的区域编码
             * dataSource: 缓存数据命名空间
             */
            updateCache(
              "pk_accid",
              this.props.getUrlParam("id"),
              card_from_id,
              dataSource,
              res.data[this.formId].rows[0].values
            );
          } else {
            // props.form.setAllFormValue({ [card_from_id]: {rows:[]} });
            /* 国际化处理： 该单据不存在！*/
            toast({
              color: "warning",
              content:
                this.props.MutiInit.getIntl("36010IACC") &&
                this.props.MutiInit.getIntl("36010IACC").get(
                  "36010IACC--000050"
                )
            });
          }
        }
      });
    }
  };

  //初始化form
  initForm = props => {
    let islink = props.getUrlParam("islink");
    if (islink) {
      //后台grid只接受pageid。
      let data = {
        pk: props.getUrlParam("pk_accid"),
        pageid: this.pageId
      };
      ajax({
        url: "/nccloud/tmpub/tmbd/accidquerycard.do",
        data: data,
        success: res => {
          //data要看返回的id，而不是后台设置的id
          //获取后台返回data
          if (res && res.data) {
            props.form.setAllFormValue({
              [card_from_id]: res.data[card_from_id]
            });
            this.backAccidcode =
              res.data[this.formId].rows[0].values.accidcode.value;
            initButton(props);
            addCache(
              res.data[this.formId].rows[0].values.pk_accid.value,
              res.data,
              card_from_id,
              dataSource,
              res.data[this.formId].rows[0].values
            );
            this.toggleShow();
          } else {
            /* 国际化处理： 未联查到对应的内部账户档案!*/
            toast({
              color: "warning",
              content:
                this.props.MutiInit.getIntl("36010IACC") &&
                this.props.MutiInit.getIntl("36010IACC").get(
                  "36010IACC--000052"
                )
            });
          }
        }
      });
    } else {
      let status = props.getUrlParam("status");
      if (status === "add") {
        props.form.EmptyAllFormValue(this.formId);
        this.backAccidcode = null;
        this.props.form.setFormItemsValue(card_from_id, {
          pk_org: {
            value: this.state.curr_pk_org,
            display: this.state.curr_orgname
          },
          pk_org_v: {
            value: this.state.curr_pk_org_v,
            display: this.state.curr_orgname_v
          }
        });
        if (this.state.curr_pk_org) {
          let pk_org = {
            value: this.state.curr_pk_org,
            display: this.state.curr_orgname
          };
          afterEvent.call(
            this,
            this.props,
            card_from_id,
            "pk_org",
            pk_org,
            null,
            null,
            true
          );
          this.props.resMetaAfterPkorgEdit();
          // this.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
        }
        //单据有主组织，新增时,将其他字段设置为不可编辑.
        this.props.initMetaByPkorg();
        let interfaceJump = this.props.getUrlParam("interfaceJump");
        if (interfaceJump === "card") {
          //设置组织可以编辑
          this.props.form.setFormItemsDisabled(this.formId, { pk_org: false });
        }
        //设置状态
        this.props.BillHeadInfo.setBillHeadInfoVisible({
          // 控制显示返回按钮: true为显示,false为隐藏
          showBackBtn: false,
          // 控制显示单据号：true为显示,false为隐藏
          showBillCode: false,
          // 单据号
          billCode: null
        });
      }
      //查询单据详情[编辑卡片]
      else if (status === "edit") {
        //后台grid只接受pageid。
        let data = {
          pk: props.getUrlParam("id"),
          pageid: this.pageId,
          status : 'copy'
        };
        ajax({
          url: "/nccloud/tmpub/tmbd/accidquerycard.do",
          data: data,
          success: res => {
            //获取后台返回data
            if (res && res.data) {
              props.form.setAllFormValue({
                [card_from_id]: res.data[this.formId]
              });
              /*
               * idname: 数据主键的命名
               * id：数据主键的值
               * headAreacode: 卡片表头的区域编码
               * dataSource: 缓存数据命名空间
               */
              updateCache(
                "pk_accid",
                props.getUrlParam("id"),
                card_from_id,
                dataSource,
                res.data[this.formId].rows[0].values
              );
              // props.resMetaAfterPkorgEdit();
              props.form.setFormItemsDisabled(card_from_id, { pk_org: true });
              this.backAccidcode =
                res.data[this.formId].rows[0].values.accidcode.value;
              // 编辑性
              if (
                res.data[card_from_id] &&
                res.data[card_from_id].rows &&
                res.data[card_from_id].rows[0] &&
                res.data[card_from_id].rows[0].values
              ) {
                if (res.data[card_from_id].rows[0].values.pk_org) {
                  // 防止变更后编辑项被修改，重置一下新增的编辑项。
                  let editFiled = {
                    acctype: false,
                    accidcode: false,
                    accidname: false,
                    pk_ownerorg: false,
                    accopendate: false,
                    pk_currtype: false,
                    arapprop: false,
                    accstartupdate: false,
                    yearbeginymny: false,
                    incomeymny: false,
                    outymny: false,
                    istrade: false
                  };
                  props.form.setFormItemsDisabled(card_from_id, editFiled);
                }
                let acctype = res.data[card_from_id].rows[0].values.acctype;
                if (acctype && acctype.value != 1 && acctype.value != 0) {
                  props.form.setFormItemsDisabled(card_from_id, {
                    overdraftmny: true,
                    istrade: true
                  });
                }
              }
              this.toggleShow();
            } else {
              /* 国际化处理： 该单据不存在！*/
              toast({color: "warning",content:this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get( "36010IACC--000050" )});
              // props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
            }
          }
        });
      }
      //复制单据详情[复制]
      else if (status === "copy") {
        //后台grid只接受pageid。
        let data = {
          pk: props.getUrlParam("id"),
          pageid: this.pageId,
          status : 'copy'
        };
        ajax({
          url: "/nccloud/tmpub/tmbd/accidcopy.do",
          data: data,
          success: res => {
            //获取后台返回data
            //获取后台返回data
            if (res && res.data) {
              props.form.setAllFormValue({
                [card_from_id]: res.data[card_from_id]
              });
              props.form.setFormItemsDisabled(card_from_id, { pk_org: true });
              initButton(props);
              // 编辑性
              if (
                res.data[card_from_id] &&
                res.data[card_from_id].rows &&
                res.data[card_from_id].rows[0] &&
                res.data[card_from_id].rows[0].values
              ) {
                if (res.data[card_from_id].rows[0].values.pk_org) {
                  // 防止变更后编辑项被修改，重置一下新增的编辑项。
                  let editFiled = {
                    acctype: false,
                    accidcode: false,
                    accidname: false,
                    pk_ownerorg: false,
                    accopendate: false,
                    pk_currtype: false,
                    arapprop: false,
                    accstartupdate: false,
                    yearbeginymny: false,
                    incomeymny: false,
                    outymny: false,
                    istrade: false
                  };
                  props.form.setFormItemsDisabled(card_from_id, editFiled);
                }
                let acctype = res.data[card_from_id].rows[0].values.acctype;
                if (acctype && acctype.value != 1 && acctype.value != 0) {
                  props.form.setFormItemsDisabled(card_from_id, {
                    overdraftmny: true,
                    istrade: true
                  });
                }
                //设置状态
                // this.props.BillHeadInfo.setBillHeadInfoVisible({
                // 	// 控制显示返回按钮: true为显示,false为隐藏
                // 	showBackBtn: false,
                // 	// 控制显示单据号：true为显示,false为隐藏
                // 	showBillCode: false,
                // 	// 单据号
                // 	billCode: null,
                // });
                this.toggleShow();
              }
            } else {
              /* 国际化处理： 该单据不存在！*/
              toast({color: "warning",content:this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get( "36010IACC--000050" )});
              // props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
            }
          }
        });
      }
      //查询单据详情[浏览卡片]
      else if (status === "browse") {
        if (props.getUrlParam("id")) {
          let cancelcardData = getCacheById(
            props.getUrlParam("id"),
            dataSource
          );
          if (cancelcardData) {
            if (cancelcardData.pageid === card_page_id) {
              this.props.form.setAllFormValue({
                [card_from_id]: cancelcardData[card_from_id]
              });
              this.backAccidcode =
                cancelcardData[card_from_id].rows[0].values.accidcode.value;
            } else {
              this.props.form.setAllFormValue({
                [card_from_id]: cancelcardData[list_table_id]
              });
              this.backAccidcode =
                cancelcardData[list_table_id].rows[0].values.accidcode.value;
            }
            this.toggleShow();
          } else {
            //后台grid只接受pageid。
            let data = {
              pk: props.getUrlParam("id"),
              pageid: this.pageId
            };
            ajax({
              url: "/nccloud/tmpub/tmbd/accidquerycard.do",
              data: data,
              success: res => {
                //data要看返回的id，而不是后台设置的id
                //获取后台返回data
                if (res && res.data) {
                  props.form.setAllFormValue({
                    [card_from_id]: res.data[card_from_id]
                  });
                  this.backAccidcode =
                    res.data[this.formId].rows[0].values.accidcode.value;
                  initButton(props);
                  this.toggleShow();
                  /*
                   * idname: 数据主键的命名
                   * id：数据主键的值
                   * headAreacode: 卡片表头的区域编码
                   * dataSource: 缓存数据命名空间
                   */
                  updateCache(
                    "pk_accid",
                    props.getUrlParam("id"),
                    card_from_id,
                    dataSource,
                    res.data[this.formId].rows[0].values
                  );
                } else {
                  // props.form.setAllFormValue({ [card_from_id]: {rows:[]} });
                  /* 国际化处理： 该单据不存在！*/
                  toast({
                    color: "warning",
                    content:
                      this.props.MutiInit.getIntl("36010IACC") &&
                      this.props.MutiInit.getIntl("36010IACC").get(
                        "36010IACC--000050"
                      )
                  });
                }
              }
            });
          }
        }
      }
      //查询单据详情[变更]
      else if (status === "change") {
        //后台grid只接受pageid。
        let data = {
          pk: props.getUrlParam("id"),
          pageid: this.pageId
        };
        ajax({
          url: "/nccloud/tmpub/tmbd/accidchange.do",
          data: data,
          success: res => {
            //获取后台返回data
            if (res && res.data) {
              props.form.setAllFormValue({
                [this.formId]: res.data[this.formId]
              });
              // initButton(props);
              // 编辑性
              if (
                res.data[this.formId] &&
                res.data[this.formId].rows &&
                res.data[this.formId].rows[0] &&
                res.data[this.formId].rows[0].values
              ) {
                this.backAccidcode =
                  res.data[this.formId].rows[0].values.accidcode.value;
                this.toggleShow();
                /*
                 * idname: 数据主键的命名
                 * id：数据主键的值
                 * headAreacode: 卡片表头的区域编码
                 * dataSource: 缓存数据命名空间
                 */
                updateCache(
                  "pk_accid",
                  props.getUrlParam("id"),
                  card_from_id,
                  dataSource,
                  res.data[this.formId].rows[0].values
                );

                props.form.setFormItemsDisabled(this.formId, { pk_org: true });
                props.form.setFormItemsDisabled(this.formId, {
                  pk_ownerorg: true
                });
                // 条件 2 账户类型 0=活期，1=协定，2=定期，3=通知，4=贷款，7=票据，
                let acctype = res.data[this.formId].rows[0].values.acctype;
                // 条件 2-1 账户类型为 协定、活期 收支属性、是否默认、透支 可编辑 ；
                //  其中 协定的"协定金额"也可编辑
                if (acctype && acctype.value == 0) {
                  // 取消掉可以编辑控制，wyd默认为不可编辑 OVERDRAFTTYPE
                  // 增加活期协定账户的互转
                  let editFiled = {
                    arapprop: false,
                    isaccounting: false,
                    istrade: false,
                    overdraftmny: false,
                    acctype: false
                  };
                  props.form.setFormItemsDisabled(card_from_id, editFiled);
                } else if (acctype && acctype.value == 1) {
                  let editFiled = {
                    arapprop: false,
                    isaccounting: false,
                    istrade: false,
                    overdraftmny: false,
                    acctype: false
                  };
                  props.form.setFormItemsDisabled(card_from_id, editFiled);
                } else {
                  let editFiled = {
                    arapprop: true,
                    isaccounting: true,
                    overdraftmny: true,
                    overdrafttype: true
                  };
                  props.form.setFormItemsDisabled(card_from_id, editFiled);
                  // 同时 清空 收支属性
                  props.form.setFormItemsValue(card_from_id, {
                    arapprop: { value: null }
                  });
                }
                if (acctype && acctype.value != 1 && acctype.value != 0) {
                  props.form.setFormItemsDisabled(card_from_id, {
                    istrade: true
                  });
                }
              }
            } else {
              /* 国际化处理： 该单据不存在！*/
              toast({color: "warning",content:this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get( "36010IACC--000050" )});
              // props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
            }
          }
        });
      }
    }
  };

  //切换页面状态
  toggleShow = () => {
    let status = this.props.getUrlParam("status");
    let flag = status === "browse" ? false : true;
    //设置看片翻页的显隐性
    this.props.cardPagination.setCardPaginationVisible(
      "cardPaginationBtn",
      !flag
    );
    this.props.form.setFormStatus(this.formId, status);
    initButton(this.props);
    orgVersionView(this.props, card_from_id);
    if (status === "browse") {
      this.props.form.setFormItemsVisible(card_from_id, {
        pk_org: false
        // 'pk_org_v': true,
      });
    } else if (status === "edit") {
      this.props.form.setFormItemsDisabled(card_from_id, { pk_org: true });
    }

    let showBackBtnFlag = true;
    let showBillCodeFlag = true;
    if (status === "add") {
      showBackBtnFlag = false;
      showBillCodeFlag = false;
    }
    //查询单据详情[编辑卡片]
    else if (status === "edit") {
      showBackBtnFlag = false;
      showBillCodeFlag = true;
    }
    //复制单据详情[复制]
    else if (status === "copy") {
      showBackBtnFlag = false;
      showBillCodeFlag = false;
    }
    //查询单据详情[浏览卡片]
    else if (status === "browse") {
      showBackBtnFlag = true;
      showBillCodeFlag = true;
    }
    //查询单据详情[变更]
    else if (status === "change") {
      showBackBtnFlag = false;
      showBillCodeFlag = true;
    }
    if (this.props.getUrlParam("islink")) {
      showBackBtnFlag = true;
      showBillCodeFlag = true;
    }
    //设置状态
    this.props.BillHeadInfo.setBillHeadInfoVisible({
      // 控制显示返回按钮: true为显示,false为隐藏
      showBackBtn: showBackBtnFlag,
      // 控制显示单据号：true为显示,false为隐藏
      showBillCode: showBillCodeFlag,
      // 单据号
      billCode: this.backAccidcode
    });
  };

  getButtonNames = codeId => {
    if (codeId === "confirm" || codeId === "change" || codeId === "enable") {
      return "main-button";
    } else {
      return "secondary - button";
    }
  };

  // 切换主组织确认按钮
  changeOrgConfirm = data => {
    //恢复之前的值，设置edit状态
    this.props.form.cancel(this.formId);
    this.props.form.setFormStatus(this.formId, "edit");
    ajax({
      url: "/nccloud/tmpub/tmbd/accidafterevent.do",
      data: data,
      success: res => {
        let { success, data } = res;
        if (success) {
          this.props.form.EmptyAllFormValue(this.formId);
          if (data) {
            this.props.form.setAllFormValue({
              [card_from_id]: data[card_from_id]
            });
            if (data[card_from_id].rows[0].values.pk_bankdoc.display == " ") {
              this.props.form.setFormItemsValue(card_from_id, {
                pk_bankdoc: {
                  value: null,
                  display: null
                }
              });
            }
            // 组织可编辑
            this.props.form.setFormItemsDisabled(this.formId, {
              pk_org: false
            });
          }
        }
      }
    });
  };

  // 切换主组织取消按钮
  changeOrgCancel = cardData => {
    if (cardData) {
      this.props.form.setAllFormValue({ [card_from_id]: cardData });
    }
  };

  // 编辑保存是取消按钮确认框
  saveCancelConfirm = () => {
    this.props.form.EmptyAllFormValue(card_from_id);
    let status = this.props.getUrlParam("status");
    let id = this.props.getUrlParam("id");
    if (id) {
      this.props.setUrlParam({
        status: "browse",
        id: id
      });
      this.props.form.EmptyAllFormValue(card_from_id);
    } else {
      let currentLastId = getCurrentLastId(dataSource);
      //注意：查询下条数据时，也同样需要先判断有没有缓存数据，没有缓存数据时，再发查询请求。
      this.props.setUrlParam({
        status: "browse",
        id: currentLastId ? currentLastId : ""
      });
    }
    this.refresh();
  };

  // 冻结日期
  frozenModelContent() {
    return (
      <div className="addModal" fieldid="frozendate">
        <span className="modal-label">
          {/* 国际化处理： 冻结日期*/}
          {this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get("36010IACC--000015")}
        </span>
        <NCDatePicker
          fieldid="frozendate"
          format={format}
          placeholder={
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000015"
            ) /* 国际化处理： 冻结日期*/
          }
          value={this.state.frozendate}
          // onChange={this.changeFrozenDate}
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
      <div className="addModal" fieldid="unfrozendate">
        <span className="modal-label">
          {/* 国际化处理： 解冻日期*/}
          {this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get("36010IACC--000016")}
        </span>
        <NCDatePicker
          fieldid="unfrozendate"
          format={format}
          placeholder={
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000016"
            ) /* 国际化处理： 解冻日期*/
          }
          value={this.state.defrozendate}
          // onChange={this.changeDefrozenDate}
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

  // 返回箭头按钮
  ncBackBtnClick = () => {
    //先跳转列表
    this.props.pushTo("/list", {
      pagecode: list_page_id
    });
  };

  closeConfirmModal() {
    this.setState({ showModal_confirm: false });
  }

  render() {
    let {
      cardTable,
      form,
      button,
      modal,
      ncmodal,
      cardPagination
    } = this.props;
    let buttons = this.props.button.getButtons();
    let multiLang = this.props.MutiInit.getIntl(this.moduleId);
    let { createForm } = form;
    let { createCardTable } = cardTable;
    let { createCardPagination } = cardPagination;
    let { createButton, createButtonApp } = button;
    let createNCModal = ncmodal.createModal;
    let { createModal } = modal;
    const { frozendate, defrozendate, frozentype, frozenje } = this.state;
    let { showUploader, billID, billNO } = this.state;
    const { createBillHeadInfo } = this.props.BillHeadInfo;
    return (
      <div className="nc-bill-card">
        <NCAffix>
          <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
            <div className="header-title-search-area">
              {createBillHeadInfo({
                // 国际化处理： 内部账户档案
                title:
                  this.props.MutiInit.getIntl("36010IACC") &&
                  this.props.MutiInit.getIntl("36010IACC").get(
                    "36010IACC--000043"
                  ),
                //单据号
                billCode: this.backAccidcode,
                //返回按钮的点击事件
                backBtnClick: () => {
                  this.ncBackBtnClick();
                }
              })}
            </div>
            <div className="header-button-area">
              {/* 按钮适配 第三步:在页面的 dom 结构中创建按钮组，传入显示的区域，绑定按钮事件*/}
              {this.props.button.createButtonApp({
                area: "accid_card_header",
                buttonLimit: 5,
                // onButtonClick: (props, key) => buttonClick.call(this, this.props, key),
                onButtonClick: buttonClick.bind(this),
                popContainer: document.querySelector(".header-button-area")
              })}
            </div>
            <div
              className="header-cardPagination-area"
              style={{ float: "right" }}
            >
              {createCardPagination({
                handlePageInfoChange: pageInfoClick.bind(this),
                dataSource: dataSource
              })}
            </div>
          </NCDiv>
        </NCAffix>
        <NCScrollElement name="forminfo">
          <div className="nc-bill-form-area">
            {createForm(this.formId, {
              // 分组展开
              expandArr: [
                this.formId,
                "36010IACC_C01_frozen",
                "36010IACC_C01_defrozen",
                "36010IACC_C01_closeacc"
              ],
              onAfterEvent: afterEvent.bind(this)
            })}
          </div>
        </NCScrollElement>

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

        {createModal("changeorg", {
          title:
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000019"
            ) /* 国际化处理： 确认修改*/,
          content:
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000020"
            ) /* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/,
          // beSureBtnClick: this.changeOrgConfirm
          hasCloseBtn: false,
          //  模态框大小 sm/lg/xlg,
          size: "sm",
          className: "junior"
        })}

        {createModal("saveCancelModel", {
          title:
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000046"
            ) /* 国际化处理：取消确认*/,
          content:
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000047"
            ) /* 国际化处理：是否确任要取消?*/,
          beSureBtnClick: this.saveCancelConfirm,
          //  模态框大小 sm/lg/xlg,
          size: "sm",
          className: "junior"
        })}

        {/* 删除模态框 */}
        {createModal("deletemodel", {
          title:
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000021"
            ) /* 国际化处理： 删除*/,
          content:
            this.props.MutiInit.getIntl("36010IACC") &&
            this.props.MutiInit.getIntl("36010IACC").get(
              "36010IACC--000022"
            ) /* 国际化处理： 确认是否删除？*/,
          //点击确定按钮事件
          // beSureBtnClick: this.delConfirm()
          hasCloseBtn: false,
          //  模态框大小 sm/lg/xlg,
          size: "sm",
          className: "junior"
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
          className: "senior"
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
              onButtonClick: buttonClick.bind(this)
            })}
          </NCModal.Footer>
        </NCModal>
      </div>
    );
  }
}

Card = createPage({
  billinfo: {
    billtype: "form",
    pagecode: card_page_id,
    headcode: card_from_id
  },

  // initTemplate: initTemplate,
  mutiLangCode: appcode
})(Card);

// ReactDOM.render(<Card />, document.querySelector('#app'));
export default Card;

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/