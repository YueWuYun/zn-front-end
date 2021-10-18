/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { ajax, base, toast, cacheTools, print, promptBox } from 'nc-lightapp-front';
import { jsoncode, requesturl } from '../../util/const.js';
import { linkApp } from '../../../../../tmpub/pub/util/LinkUtil.js';
import { cardCache } from "nc-lightapp-front";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index.js";
import { go2Card, cardOperator } from '../../../../pub/utils/SFButtonUtil';
// ca
import Sign from '../../../../../tmpub/pub/util/ca/index.js';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
//import { json } from 'graphlib';
let { addCache, getCurrentLastId, getNextId, deleteCacheById, getCacheById, updateCache } = cardCache;
export default function (props, id) {
  const pk_deliveryapply_h = props.form.getFormItemsValue(this.formId, 'pk_deliveryapply_h') && props.form.getFormItemsValue(this.formId, 'pk_deliveryapply_h').value;
  const billnoe = props.form.getFormItemsValue(this.formId, 'vbillno') && props.form.getFormItemsValue(this.formId, 'vbillno').value;
  const billstatus = props.form.getFormItemsValue(this.formId, 'billstatus') && props.form.getFormItemsValue(this.formId, 'billstatus').value;
  const pk_accid = props.form.getFormItemsValue(this.formId, 'pk_accid') && props.form.getFormItemsValue(this.formId, 'pk_accid').value;
  //获取表体行所有数据
  let checkAllCardDate = this.props.cardTable.getAllRows(jsoncode.ctablecode, false);
  const pk_org = props.form.getFormItemsValue(this.formId, 'pk_org') &&
    props.form.getFormItemsValue(this.formId, 'pk_org').value;
  //map中存放主键与单据状态
  const pkMap = {};
  switch (id) {

    case 'addBtn':
      //这是为了让点浏览态后，再点新增，再点取消时，没有单据号
      //新增的时候将单据号制空
      this.setState({
        billno: ''
      });
      props.pushTo("/card", {
        pagecode: jsoncode.cpageid,
        status: "add",
      });
      // 清空表单form所有数据
      props.form.EmptyAllFormValue(this.formId);
      //清空table所有数据
      props.cardTable.setTableData(this.tableId, { rows: [] });
      //组织多版本
      orgVersionView(props, jsoncode.formcode);
      this.toggleShow()
      //增加除pk_org 设置所有字段都不可编辑相关逻辑（这是为了应对点击浏览后，再点新增，字段编辑性失效）
      props.initMetaByPkorg();
      break;
    //这个按钮是主要按钮，显示的是红色，目前给业务直接点取消的时候，显示新增按钮用
    case 'Add':
      //这是为了让点浏览态后，再点新增，再点取消时，没有单据号
      //新增的时候将单据号制空
      this.setState({
        billno: ''
      });
      props.pushTo("/card", {
        pagecode: jsoncode.cpageid,
        status: "add",
      });
      // 清空表单form所有数据
      props.form.EmptyAllFormValue(this.formId);
      //清空table所有数据
      props.cardTable.setTableData(this.tableId, { rows: [] });
      //组织多版本
      orgVersionView(props, jsoncode.formcode);
      this.toggleShow()
      //增加除pk_org 设置所有字段都不可编辑相关逻辑（这是为了应对点击浏览后，再点新增，字段编辑性失效）
      props.initMetaByPkorg();
      break;
    case 'editBtn':
      props.pushTo("/card", {
        pagecode: jsoncode.cpageid,
        status: "edit",
      });
      this.getCardData();
      //点卡片态修改按钮会使pk_org可编辑，目前先这么解决
      props.form.setFormItemsDisabled(jsoncode.formcode, { 'pk_org': true });
      break;
    //复制
    case 'copyBtn':
      props.pushTo("/card", {
        pagecode: jsoncode.cpageid,
        status: 'copy',
        id: props.getUrlParam('id')
      });
      //复制时，在新增，点取消，不能有单据号，需要在这处理一下
      this.setState({ billno: '' });
      this.componentDidMount();
      break;
    case 'deleteBtn':
      this.props.modal.show('delmodal');
      break
    // //提交 已弃用
    // case 'commitBtn':
    //   ajax({
    //     url: requesturl.commit,
    //     data: {
    //       pks: [pk_deliveryapply_h],
    //     },
    //     success: (res) => {
    //       let { success, data } = res;
    //       if (success) {
    //         toast({ color: 'success', content: '提交成功' });
    //         this.getCardData();
    //       }
    //     }
    //   });
    //   break;
    // //收回 已弃用
    // case 'Uncommit':
    //   ajax({
    //     url: requesturl.uncommit,
    //     data: {
    //       pks: [pk_deliveryapply_h],
    //     },
    //     success: (res) => {
    //       let { success, data } = res;
    //       if (success) {
    //         toast({ color: 'success', content: '收回成功' });
    //         this.getCardData();
    //       }
    //     }

    //   });
    //   break;
    // 提交 
    case 'commitBtn':
      cardOperator(props, jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], 'pk_deliveryapply_h', requesturl.batchcommit, loadMultiLang(props, '36320DA-000010'), jsoncode.dataSource, commitAssign.bind(this));/* 国际化处理： 提交*/
      break;
    // 收回
    case 'Uncommit':
      cardOperator(props, jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], 'pk_deliveryapply_h', requesturl.batchuncommit, loadMultiLang(props, '36320DA-000011'), jsoncode.dataSource, this.toggleShow.bind(this));/* 国际化处理： 收回*/
      break;
    case 'back':
      props.pushTo("/list")
      break
    case 'cancelBtn':
      // if ((props.getUrlParam('status') === 'edit') || (props.getUrlParam('status') === 'add') || (props.getUrlParam('status') === 'copy')) {
      //   // 表单返回上一次的值
      //   props.form.cancel(this.formId)
      //   // 表格返回上一次的值
      //   //props.cardTable.cancelEdit(this.tableId)
      //   props.pushTo('/list', {
      //     pagecode: jsoncode.cpageid,
      //     status: 'browse',
      //     id: props.getUrlParam('id')
      //   });
      //   this.toggleShow()
      // }
      //考虑复制进入编辑状态后地址栏没有主键信息，故，在复制操作的时候将主键存储在局部变量id中
      promptBox({
        title: loadMultiLang(props, '36320DA-000012'),/* 国际化处理： 取消*/
        color: "warning",
        content: loadMultiLang(props, '36320DA-000013'),/* 国际化处理： 确定要取消吗？*/
        beSureBtnClick: cancelConfirm.bind(this, props)
      })
      // this.toggleShow();
      break;
    //保存
    case 'saveBtn':

      this.saveBill();
      //组织多版本
      orgVersionView(props, jsoncode.formcode);
      break;
    //保存新增
    case 'saveaddBtn':
      this.setState({ addAndSave: true })
      //组织多版本
      orgVersionView(props, jsoncode.formcode);
      this.saveBill();
      // let CardData = props.createMasterChildData(jsoncode.cpageid, this.formId, this.tableId);
      // let url = requesturl.insert; //新增保存			let url = requesturl.insert; //新增保存
      // if (this.props.getUrlParam('status') === 'edit') {
      //   url = requesturl.update; //修改保存
      // }
      // ajax({
      //   url: url,
      //   data: CardData,
      //   success: (res) => {
      //     let pk_deliveryapply_b = null;
      //     if (res.success) {
      //       if (res.data) {
      //         toast({ color: 'success', content: '保存新增成功' });
      //       }
      //     }
      //     // 清空表单form所有数据
      //     props.form.EmptyAllFormValue(this.formId);
      //     //清空table所有数据
      //     props.cardTable.setTableData(this.tableId, { rows: [] });
      //     props.pushTo("/card", {
      //       pagecode: jsoncode.cpageid,
      //       status: 'add'
      //     })
      //     //设置组织可以编辑
      //     props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });
      //     //组织多版本
      //     orgVersionView(props, jsoncode.formcode);
      //     this.toggleShow();
      //   }
      // });
      break;
    //保存提交
    case 'savecommitBtn':
      save.call(this, props, () => {

        cardOperator(props, jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], 'pk_deliveryapply_h', requesturl.batchcommit, loadMultiLang(props, '36320DA-000010'), jsoncode.dataSource, commitAssign.bind(this));/* 国际化处理： 提交*/
      });
      //调用脚本方式，但是无法支持提交指派场景，故废弃，用前端分别调用保存，提交方法。
      // ajax({
      //   url: requesturl.savecommit,
      //   data: props.createMasterChildData(jsoncode.cpageid, this.formId, this.tableId),
      //   success: (res) => {
      //     if (res.success) {
      //       if (res.data) {
      //         toast({ color: 'success', content: '保存提交成功' });
      //       }
      //       props.pushTo("/card", {
      //         pagecode: jsoncode.cpageid,
      //         status: 'browse'
      //         // billstaus: res.data[this.formId].rows[0].values.billstatus.value,
      //         // id: res.data[this.formId].rows[0].values.pk_deliveryapply_b.value
      //       });
      //     }
      //     //组织多版本
      //     orgVersionView(props, jsoncode.formcode);
      //     this.toggleShow();
      //   }
      // });

      break;
    //打印
    case 'Print':
      print(
        'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        ///nccloud/sf/deliveryapply/deliveryapplyprint.do',
        requesturl.print,
        {
          // billtype: '36K3',  //单据类型
          // funcode: '36320DA', //功能节点编码，即模板编码
          // nodekey: 'NCCLOUD',     //模板节点标识
          // printTemplateID: '1001Z61000000002DUA4', //模板id
          appcode: '36320DA',
          oids: [pk_deliveryapply_h]   // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
        }
      );
      break;
    //输出    
    case 'Out':
      if (!this.props.form.getFormItemsValue(this.formId, 'pk_deliveryapply_h').value) {
        toast({ color: 'warning', content: loadMultiLang(props, '36320DA-000014') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      this.refs.printOutput.open();
      this.setState(
        {
          outputData: {
            // funcode: printParameter.funcode, //功能节点编码，即模板编码
            // nodekey: printParameter.nodekey, //模板节点标识
            // printTemplateID: printParameter.printTemplateID, //模板id
            oids: [this.props.form.getFormItemsValue(this.formId, 'pk_deliveryapply_h').value],
            outputType: 'output'
          }//打印输出使
        },
        () => {
          this.refs.printOutput.open();
        }
      );
      break;
    //附件管理
    case 'Enclosure':
      this.setState({
        billId: pk_deliveryapply_h, //单据id
        billno: billnoe, // 单据编号
        showUploader: !this.state.showUploader,
        target: null
      })
      break;
    //联查：计划预算
    case 'Linkplan':
      let queryntbplanData = props.createMasterChildData(jsoncode.cpageid, jsoncode.formcode, jsoncode.ctablecode);
      ajax({
        url: requesturl.linkplanforcard,
        data: queryntbplanData,
        success: (res) => {
          if (res.success) {
            if (res.data && res.data.hint) {
              toast({ color: 'warning', content: res.data.hint });
              return;
            } else {
              this.setState({
                show: true,
                sourceData: res.data
              });
            }
          }
        }
      });
      break;
    //联查：付款账户
    case 'Fkzh':
      // this.setState({
      //   accModalShow: false
      // });
      //toast({ color: 'success', content: '该单据没有付款账户，请确认！' });
      //当前选择的表体数据
      let ReceiveAccountCheckeddata = props.cardTable.getCheckedRows(jsoncode.ctablecode);
      let bankaccbalance_rarr = [];
      let restpk_org_r, pk_bankacc_p;
      if (this.props.form.getFormItemsValue(this.formId, 'pk_org')
        && this.props.form.getFormItemsValue(this.formId, 'pk_org').value) {
        restpk_org_r = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
      }
      if (checkAllCardDate.length > 1) {
        if (ReceiveAccountCheckeddata.length != 1) {
          // toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000028') });/* 国际化处理： 请选择一条表体数据操作！*/
          toast({ color: 'warning', content: loadMultiLang(props, '36320DA-000015') });/* 国际化处理： 请选择一条表体数据操作！*/
          return;
        } else {
          //处理选择数据
          ReceiveAccountCheckeddata.forEach((val) => {
            if (val.data.values.pk_bankacc_p
              && val.data.values.pk_bankacc_p.value) {
              pk_bankacc_p = val.data.values.pk_bankacc_p.value;
            }
            let bankaccbalance_rdata = {
              // 财务组织
              pk_org: restpk_org_r,
              // 银行账户id
              pk_account: pk_bankacc_p,
            };
            bankaccbalance_rarr.push(bankaccbalance_rdata);
          });
        }
      } else {//当只有一行表体数据时
        if (checkAllCardDate[0].values.pk_bankacc_p
          && checkAllCardDate[0].values.pk_bankacc_p.value) {
          pk_bankacc_p = checkAllCardDate[0].values.pk_bankacc_p.value;
        }
        let bankaccbalance_rdata = {
          // 财务组织
          pk_org: restpk_org_r,
          // 银行账户id
          pk_account: pk_bankacc_p,
        };
        bankaccbalance_rarr.push(bankaccbalance_rdata);
      }
      this.setState({
        showOriginalData: bankaccbalance_rarr,
        showOriginal: true,
      });
      break;
    //联查 内部账户余额
    case 'InsideAccount':
      //this.setState({ accModalShow: true, currentpk: pk_accid })
      let accountbalance_busitype = this.props.form.getFormItemsValue(this.formId, 'busitype');
      if (accountbalance_busitype && accountbalance_busitype.value && accountbalance_busitype.value != 2) {
        toast({ color: 'warning', content: loadMultiLang(props, '36320DA-000016') });/* 国际化处理： 非中心上收的单据不能联查内部账户余额!*/
        return;
      }
      let InsideAccountCheckeddata = props.cardTable.getCheckedRows(jsoncode.ctablecode);
      if (InsideAccountCheckeddata && InsideAccountCheckeddata.length != 1) {
        toast({ color: 'warning', content: loadMultiLang(props, '36320DA-000017') });/* 国际化处理： 请选择1条子表数据*/
        return;
      }
      let pkAccount = InsideAccountCheckeddata[0].data.values.pk_accid.value;
      this.setState({ accModalShow: true, currentpk: pkAccount })
      break;
    //联查 回单
    case 'ReturnBill':
      let urlExtParam = {};
      urlExtParam = {
        status: 'browse',
        srcbillid: [pk_deliveryapply_h],
        linkquerytype: 'LinkQuery_Apply_B',//4
      };
      linkApp(props, '36K9', urlExtParam);
      break;
    //联查 审批详情
    case 'Spxq':
      if (pk_deliveryapply_h) {
        this.setState({
          showApprove: true,
          approveBilltype: '36K3',//单据类型
          approveBillId: pk_deliveryapply_h//单据pk
        });
      }
      break;
    //委托办理
    case 'Entrust':
      cardOperator(props, jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], 'pk_deliveryapply_h', requesturl.batchsubmit, loadMultiLang(props, '36320DA-000019'), jsoncode.dataSource, this.toggleShow.bind(this));/* 国际化处理： 委托办理*/
      break;
    //取消委托
    case 'Unentrust':
      cardOperator(props, jsoncode.cpageid, jsoncode.formcode, [jsoncode.ctablecode], 'pk_deliveryapply_h', requesturl.batchunsubmit, loadMultiLang(props, '36320DA-000020'), jsoncode.dataSource, this.toggleShow.bind(this));/* 国际化处理： 取消委托办理*/
      break;
    //刷新
    case 'Refresh':
      this.getCardData(true);
      break;
  }
}
/**
 * 提交指派
 * @param {*} props 
 * @param {*} data 
 */
const commitAssign = function (props, data) {
  let { workflow } = data;
  //有指派信息，则指派，没有则重绘界面
  if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
    this.setState({ assignData: data, assignShow: data });
  } else {
    props.setUrlParam({
      status: 'browse'
    });
    this.getCardData();
  }
}
/**
 * 保存提交
 * @param {*} props  页面内置对象
 */
const save = async function (props, callback) {
  //缓存
  let { addCache, updateCache } = cardCache;
  if (this.props.getUrlParam('copyFlag') === 'copy') {
    this.props.form.setFormItemsValue(this.formId, { crevecontid: null });
    this.props.form.setFormItemsValue(this.formId, { ts: null });
  }
  //过滤表格空行
  this.props.cardTable.filterEmptyRows(this.tableId);
  let flag = this.props.form.isCheckNow(this.formId)
  if (flag) {
    let cardData = this.props.createMasterChildData(jsoncode.cpageid, this.formId, this.tableId);
    let url = requesturl.insert; //新增保存
    if (this.props.getUrlParam('status') === 'edit') {
      url = requesturl.update; //修改保存
    }
    let result = await Sign({
      isSign: true,
      isKey: true,
      data: cardData,
      isSave: true,
      encryptVOClassName: 'nccloud.web.sf.delivery.deliveryapply.vo.DeliveryApplyEncryptVO4NCC'
    });
    if (result.isStop) {
      return;
    }
    cardData = result.data;
    console.log(cardData, 'sign after cardData');
    ajax({
      url: url,
      data: cardData,
      success: (res) => {
        let pk_deliveryapply_h = null;
        if (res.success) {
          if (res.data) {
            if (res.data.head && res.data.head[this.formId]) {
              this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
              pk_deliveryapply_h = res.data.head[this.formId].rows[0].values.pk_deliveryapply_h.value;
            }
            if (res.data.body && res.data.body[this.tableId]) {
              this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
            }
          }
          if (pk_deliveryapply_h) {
            if (url === requesturl.insert) {
              //在列表点新增或在卡片上点新增按钮后，新增保存时，保存成功后，需要调用addCache方法，将数据存储到缓存中
              addCache(pk_deliveryapply_h, res.data, this.formId, jsoncode.dataSource);
              callback(props, res.data);
            }
            if (url === requesturl.update) {
              //卡片修改保存时，保存成功后，需要调用updateCache方法，将数据更新到缓存中
              updateCache('pk_deliveryapply_h', pk_deliveryapply_h, res.data, this.formId, jsoncode.dataSource);
              callback(props, res.data);
            }
          }

        }
      }
    });
  }
}

/**
 * 取消确认
 * @param {*} props 
 * @param {*} pk
 */
const cancelConfirm = function (props) {
  if (props.getUrlParam('status') === 'edit') {
    // 表单返回上一次的值
    props.form.cancel(this.formId)
    // 表格返回上一次的值
    props.pushTo("/card", {
      status: 'browse',
      id: props.getUrlParam('id'),
    });
    this.setState({ showNCbackBtn: true });
    this.getCardData();
  }
  //保存中的取消操作
  else if (props.getUrlParam('status') === 'add') {
    let id = props.getUrlParam('id');
    if (!id) {
      id = this.state.billId;
    }
    props.pushTo("/card", {
      id: id,
      status: 'browse',
    });
    this.setState({ showNCbackBtn: true });
    this.getCardData();
  }
  //复制中的取消操作
  else if (props.getUrlParam('status') === 'copy') {
    let id = props.getUrlParam('id');
    if (!id) {
      id = this.state.billId;
    }
    props.pushTo("/card", {
      id: id,
      status: 'browse',
    });
    this.toggleShow();
  }
}

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/