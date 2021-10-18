/*Hm9gUKDDwtNjV7Mk8onAzsLWQH/l1DmcaFGbXclJ8OkE5QDZUmL3ka2qQ7SuEIgS*/
import { ajax, base, toast, print, cardCache, output, promptBox } from 'nc-lightapp-front';
import { base_url, card_page_id, card_from_id, card_table_id, billtype, print_nodekey, funcode, print_templateid, viewmod_deal, sourceModel, list_page_url, card_page_url, dataSource, pkName, card_table_pk } from '../../cons/constant';
import { initTemplate } from './initTemplate';
import { linkApp, linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { SCENE, LINKTYPE, URL_PARAM } from "../../../../../tmpub/pub/cons/constant";
import { versionControl, setCardShouderBtnUseful, handlePastData, repaintView } from "../../util/spepayUtil";
//引入公共api
import { AddLine, InsertLine, BatchDelLine, DelLine, Open, CopyLine, BatchCopy, cardOperator, linkSucessPro,showTBBMsg } from '../../../../pub/utils/FTSButtonUtil';
import { afterEvent, pageInfoClick } from "./index";
import { setPropCache, saveMultiLangRes, loadMultiLang ,createSimpleBillData ,elecSignCardPrint,setRate2NewRow} from "../../../../../tmpub/pub/util/index";
//返回index页面时需要传入的id即主键值，当前页面或者是上一页面的pk
var id;
//表体区域编码映射表体主键字段
const bodyCodeMapBodyPKName = {};
bodyCodeMapBodyPKName[card_table_id] = card_table_pk;
export const buttonClick = function (props, key, text, record, index) {
  let status = props.getUrlParam("status");
  let billdata = createSimpleBillData(props,card_page_id, card_from_id, card_table_id);
  let saveObj = {};
  saveObj[card_table_id] = 'cardTable';
  switch (key) {
    //展开（浏览态）
    case 'opendown':
    //收起
    case 'closedown':
        props.cardTable.toggleRowView(card_table_id, record);
        break;
    //展开（编辑态）
    case 'openright':
        props.cardTable.openModel(card_table_id, 'edit', record, index);
        break;
    //头部 刷新
    case 'Refresh':
      doRefresh.call(this, props);
      break;
    //头部 修改
    case 'Edit':
      this.editData(this.props.form.getFormItemsValue(card_from_id, 'ts').value);
      break;
    //头部 取消
    case 'Cancel':
      promptBox({
        color: "warning",
        title: loadMultiLang(this.props, '1880000025-000002'),/* 国际化处理： 取消*/
        content: loadMultiLang(this.props, '1880000025-000004'),/* 国际化处理： 确定要取消吗？*/
        beSureBtnClick: cancelConfirm.bind(this, props)
      });
      break;
    //头部 删除
    case 'Delete':
      promptBox({
        color: "warning",
        title: loadMultiLang(this.props, '1880000025-000005'),/* 国际化处理： 删除*/
        content: loadMultiLang(this.props, '1880000025-000006'),/* 国际化处理： 确定要删除所选数据吗？*/
        beSureBtnClick: delConfirm.bind(this, props)
      });
      break;
    //头部 新增
    case 'Add':
      add.call(this, props);
      break;
    //头部 保存
    case 'Save':
      props.validateToSave(billdata, save.bind(this, props), saveObj, '');
      break;
    //头部 保存新增
    case 'SaveInsert':
      props.validateToSave(billdata, saveAdd.bind(this, props), saveObj, '');
      break;
    //头部 保存提交
    case 'SaveCommit':
      props.validateToSave(billdata, saveCommitNew.bind(this, props), saveObj, '');
      break;
    //提交
    case 'Commit':
      cardOperator(props, card_page_id, card_from_id, bodyCodeMapBodyPKName, pkName, base_url + 
        'spepaycommit.do', loadMultiLang(this.props, '1880000025-000007'), dataSource, 
        commitAssign.bind(this),true,{ 'btncode': 'Commit', 'pagecode': card_page_id });/* 国际化处理： 提交成功！*/
      break;
    //收回
    case 'UnCommit':
      cardOperator(props, card_page_id, card_from_id, bodyCodeMapBodyPKName, pkName, base_url + 'spepayuncommit.do', loadMultiLang(this.props, '1880000025-000008'), dataSource, this.toggleShow.bind(this));/* 国际化处理： 收回成功！*/
      break;
    //复制
    case 'Copy':
      id = props.getUrlParam('id');
      props.pushTo("/card", {
        pagecode:card_page_id,
        status: 'add',
        id,
        isCopy: true,
        from: 'card'
      });
      initTemplate.call(this, props);
      this.qryData();
      break;
    //头部 制证
    case 'Voucher':
      cardOperator(props, card_page_id, card_from_id, bodyCodeMapBodyPKName, pkName, base_url + 
        'spepayvoucher.do', loadMultiLang(this.props, '1880000025-000009'), dataSource, 
        this.toggleShow.bind(this),null,{ 'btncode': 'Voucher', 'pagecode': card_page_id });/* 国际化处理： 制证成功！*/
      break;
    //头部 取消制证
    case 'CancelVoucher':
      cardOperator(props, card_page_id, card_from_id, bodyCodeMapBodyPKName, pkName, base_url + 
        'spepaycancelvoucher.do', loadMultiLang(this.props, '1880000025-000010'), dataSource, 
        this.toggleShow.bind(this),null,{ 'btncode': 'CancelVoucher', 'pagecode': card_page_id });/* 国际化处理： 取消制证成功！*/
      break;
    //头部 经办
    case 'Decide':
      let decideurl = base_url + 'spepaydecide.do';
      let ts = props.form.getFormItemsValue(card_from_id, 'ts').value;
			let pkMapTs = {};
			pkMapTs[props.getUrlParam('id')] = ts;
      let decidedata={ pkMapTs, pageCode: card_page_id ,isRet: true};
      ajax({
          url:decideurl,
          data: decidedata,
          success: (res) => {
              if (res.data) {
                props.setUrlParam({
                  status: viewmod_deal,
                  from: 'card',
                  id: props.getUrlParam('id'),
                  pagecode:card_page_id,
                  ts: props.form.getFormItemsValue(card_from_id, 'ts').value
                });
                setTimeout(()=>{
                  this.qryData();
                  this.toggleShow();
                },0);
              }
          }
      });
      // props.pushTo("/card", {
      //   pagecode:card_page_id,
      //   status: viewmod_deal,
      //   from: 'card',
      //   id: props.getUrlParam('id'),
      //   ts: props.form.getFormItemsValue(card_from_id, 'ts').value
      // });
      // this.qryData();
      // this.toggleShow();
      break;
    //头部 退回
    case 'Back':
      this.setState({ showBackModal: true });
      break;
    //头部 附件
    case 'AttachManage':
      this.setState({
        showUploader: !this.state.showUploader
      });
      break;
    //头部 打印
    case 'Print':
      let pk_print = this.props.form.getFormItemsValue(card_from_id, 'pk_spepay_h').value;
      print(
        'pdf',
        base_url + 'spepayprint.do',
        {
          billtype: billtype, //单据类型
          funcode: funcode, //功能节点编码，即模板编码
          nodekey: print_nodekey, //模板节点标识
          oids: [pk_print]//单据主键
        }
      );
      break;
    //头部 输出
    case 'PrintOut':
      let pk_printout = this.props.form.getFormItemsValue(card_from_id, 'pk_spepay_h').value;
      output({
        url: base_url + 'spepayprint.do',
        data: {
          nodekey:'NCCLOUD',
          appcode:funcode,
          oids: [pk_printout],
          outputType: 'output'
        }
      });
      break;
    //头部 联查审批意见
    case 'ViewApprove':
      approveView.call(this, props);
      break;
    //头部 联查来源单据
    case 'SourceBill':
      qrySourceBill.call(this, props);
      break;
    //头部 联查下游单据
    case 'SendBill':
      qrySendBill.call(this, props);
      break;
    //头部 联查账户余额
    case 'AccountBalance':
      qryAccountBalance.call(this, props);
      break;
    //头部 联查凭证
    case 'QueryVoucher':
      linkQueryVoucher.call(this, props);
      break;
    //头部 联查预算
    case 'NtbPlan':
      linkQryNtb.call(this, props);
      break;
    //联查 回单
    case 'UnionReturnBill':
      doReceipt.call(this, props);
      break;
    //肩部 增行
    case 'AddLine':
      let pk_org = this.props.form.getFormItemsValue(card_from_id, 'pk_org').value;
      let orgDisplay = this.props.form.getFormItemsValue(card_from_id, 'pk_org').display;
      if (!pk_org && !orgDisplay) {
        toast({
          color: 'warning',
          content: loadMultiLang(this.props, '1880000025-000011')/* 国际化处理： 请先填写资金组织！*/
        });
        return;
      }
      //给汇率赋值
      let values = {
        ['pk_spepay_h']: props.form.getFormItemsValue(card_from_id, 'pk_spepay_h'),
        ['pk_org']: props.form.getFormItemsValue(card_from_id, 'pk_org'),
        ['pk_group']: props.form.getFormItemsValue(card_from_id, 'pk_group'),
      };
      setRate2NewRow({
        olcRates: 'olcrate',
        glcRates: 'glcrate',
        gllcRates: 'gllcrate',
        datasource: dataSource,
        row: values
      });
      let rowSize = props.cardTable.getNumberOfRows(card_table_id);
      this.props.cardTable.addRow(card_table_id, rowSize, values);
      let rownum = this.props.cardTable.getNumberOfRows(card_table_id);
      //表头赋值给表体
      let dataArr = [
        'pk_org',
        'pk_group',
        'pk_currtype'
      ];
      let dataform = this.props.form.getFormItemsValue(card_from_id, dataArr);
      dataArr.forEach((val) => {
        let key = val;
        if (props.form.getFormItemsValue(card_from_id, key)) {
          let value = props.form.getFormItemsValue(card_from_id, key).value;
          let dly = props.form.getFormItemsValue(card_from_id, key).display;
          if (value) {
            props.cardTable.setValByKeyAndIndex(card_table_id, rownum - 1, key, {
              value: value,
              display: dly
            });
          }
        }
      });
      break;
    //肩部 删行
    case 'DelLine':
      let lineNumDel = props.cardTable.getNumberOfRows(card_table_id, true);
      if (lineNumDel == null || lineNumDel == 0) {
        toast({
          'color': 'warning',
          'content': loadMultiLang(this.props, '1880000025-000012')/* 国际化处理： 表体无数据，不可删除*/
        });
        return false;
      }
      BatchDelLine(props, card_table_id);
      //删行后走原币金额的编辑后事件重算表头的金额信息
      afterEvent(props, card_from_id, 'amount');
      //删行后处理卡片表体肩部按钮控制
      setCardShouderBtnUseful(props);
      break;
    //肩部 复制
    case 'CopyLine':
      let lineNum = props.cardTable.getNumberOfRows(card_table_id, true);
      if (lineNum == null || lineNum == 0) {
        toast({
          'color': 'warning',
          'content': loadMultiLang(this.props, '1880000025-000013')/* 国际化处理： 表体无数据，不可复制*/
        });
        return false;
      }
      let selectCopy = props.cardTable.getCheckedRows(card_table_id);
      if (selectCopy == null || selectCopy.length == 0) {
        toast({
          'color': 'warning',
          'content': loadMultiLang(this.props, '1880000025-000014')/* 国际化处理： 未选中要复制的行*/
        });
        return false;
      }
      this.setState({ isRowCopy: true }, () => { this.toggleShow() });
      break;
    //肩部 粘贴至末行
    case 'PastLastLine':
      let selectPast = props.cardTable.getCheckedRows(card_table_id);
      if (selectPast == null || selectPast.length == 0) {
        toast({
          'color': 'warning',
          'content': loadMultiLang(this.props, '1880000025-000014')/* 国际化处理： 未选中要复制的行*/
        });
        return false;
      }
      //粘贴末行的位置index
      let copyindex = props.cardTable.getNumberOfRows(card_table_id, false);
      //处理复制粘贴
      handlePastData(props, card_table_id, copyindex);
      //粘贴行后走原币金额的编辑后事件重算表头的金额信息
      afterEvent(props, card_from_id, 'amount');
      this.setState({ isRowCopy: false }, () => { this.toggleShow() });
      break;
    //肩部 取消
    case 'CancelLine':
      this.setState({ isRowCopy: false }, () => { this.toggleShow() });
      break;
    //行 展开
    case 'Open':
      if (status == 'browse') {
        props.cardTable.toggleRowView(card_table_id, record)
        this.setState({ isOpen: false });
      } else {
        Open(props, card_table_id, index, record, 'edit');
      }
      break;
    //行 收起
    case 'Close':
      props.cardTable.toggleRowView(card_table_id, record)
      this.setState({ isOpen: true });
      break;
    //行 复制
    case 'CopyThisLine':
      let recordCopy = JSON.parse(JSON.stringify(record));
      recordCopy.selected = false;
      recordCopy.values.pk_spepay_b = {
        value: null,
        display: null
      };
      props.cardTable.insertRowsAfterIndex(card_table_id, recordCopy, index);
      //复制行后走原币金额的编辑后事件重算表头的金额信息
      afterEvent(props, card_from_id, 'amount');
      this.toggleShow();
      break;
    //行 插行
    case 'InsertLine':
      InsertLine(props, card_table_id, index);
      //表头赋值给表体
      let dataArrInsert = [
        'pk_org',
        'pk_group',
        'pk_currtype'
      ];
      dataArrInsert.forEach((val) => {
        let key = val;
        if (props.form.getFormItemsValue(card_from_id, key)) {
          let value = props.form.getFormItemsValue(card_from_id, key).value;
          let dly = props.form.getFormItemsValue(card_from_id, key).display;
          if (value) {
            props.cardTable.setValByKeyAndIndex(card_table_id, index + 1, key, {
              value: value,
              display: dly
            });
          }
        }
      });
      break;
    //行 删行
    case 'DeleteLine':
      DelLine(props, card_table_id, index);
      //删行后走原币金额的编辑后事件重算表头的金额信息
      afterEvent(props, card_from_id, 'amount');
      break;
    //行 粘贴至此
    case 'CopyAtThisLine':
      let selectRows = props.cardTable.getCheckedRows(card_table_id);
      if (selectRows == null || selectRows.length == 0) {
        toast({
          'color': 'warning',
          'content': loadMultiLang(this.props, '1880000025-000014')/* 国际化处理： 未选中要复制的行*/
        });
        return false;
      }
      if (index != 0 && !index) {
        index = props.cardTable.getNumberOfRows(card_table_id, false);
      }
      //调用组件使用粘贴
      handlePastData(props, card_table_id, index);
      //粘贴至此后走原币金额的编辑后事件重算表头的金额信息
      afterEvent(props, card_from_id, 'amount');
      this.setState({ isRowCopy: false }, () => { this.toggleShow() });
      break;
      //正式打印
    case 'elecsignformalPrint':
      elecSignCardPrint(props, {
        url: base_url+'elecsignprint.do',
        offical:true,
        appCode: funcode,
        nodeKey: 'OFFICAL',
        headCode: card_from_id,
        field_id: 'pk_spepay_h',
        field_billno: 'vbillno',
        validateFunc: () => {
            let billstatus = props.form.getFormItemsValue(card_from_id, 'billstatus').value;
            if ('3' != billstatus) {
                return loadMultiLang(props, '1880000025-000053')/** 单据状态非转账成功！ */;
            }
            return null;
        }
      });
    break;
    //补充打印
    case 'elecsigninformalPrint':
      elecSignCardPrint(props, {
        url: base_url+'elecsignprint.do',
        offical:false,
        appCode: funcode,
        nodeKey: 'INOFFICAL',
        headCode: card_from_id,
        field_id: 'pk_spepay_h',
        field_billno: 'vbillno',
        validateFunc: () => {
            let billstatus = props.form.getFormItemsValue(card_from_id, 'billstatus').value;
            if ('3' != billstatus) {
                return loadMultiLang(props, '1880000025-000053')/** 单据状态非转账成功！ */;
            }
            return null;
        }
      });
    break;
    default:
      break;
  }
}


/**
 * 新增
 * @param {*} props  页面内置对象
 */
const add = function (props) {
  id = props.getUrlParam('id');
  props.pushTo("/card", {
    pagecode:card_page_id,
    status: 'add',
    from: 'card'
  });
  initTemplate.call(this, props);
  this.setState({
    billID: '',
    billNO: ''
  });
  props.form.EmptyAllFormValue(card_from_id);
  props.cardTable.setTableData(card_table_id, { rows: [] });
  setCardShouderBtnUseful(props);
  versionControl(props);
  this.toggleShow();
}


/**
 * 保存（新增<add>，修改<edit>，复制<add>，经办<deal>）
 * @param {*} props 页面内置对象
 */
const save = function (props, callback) {
  let rows = props.cardTable.getNumberOfRows(card_table_id)
  if(rows <= 0){
    toast({ color: 'warning', content: loadMultiLang(props, '1880000025-000050')});/* 国际化处理：单据表体行不能为空！*/
    return;
  }

  let status = props.getUrlParam('status');
  if (status != 'add' && status != 'edit' && status != viewmod_deal) {
    return;
  }
  //开启表单校验
  let flagForm = props.form.isCheckNow(card_from_id);
  //开启表体校验
  let flagTable = props.cardTable.checkTableRequired(card_table_id);
  if (!flagForm || !flagTable) {
    return;
  }
  let url = base_url;
  //修改以及经办时保存
  if (status == 'edit' || status == viewmod_deal) {
    url = url + 'spepayupdatesave.do';
  }
  //新增保存
  else {
    url = url + 'spepaycardInsertSave.do';
  }
  //获取主子表单据数据
  let billdata = createSimpleBillData(props,card_page_id, card_from_id, card_table_id);
  let data = { data: JSON.stringify(billdata), pageCode: card_page_id };
  const that = this;
  if (flagForm && flagTable) {
    ajax({
      url: url,
      data,
      success: (res) => {
        let { success, data } = res;
        if (success) {
          let { head, body } = data;
          let pk = head[card_from_id].rows[0].values.pk_spepay_h.value;
          if (head) {
            that.props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
            //预算提示
            showTBBMsg(head, card_from_id);
          }
          if (body) {
            //that.props.cardTable.setTableData(card_table_id, body[card_table_id]);
            //按照差异化来更新表体数据，api会返回完整的表体数据
            body = props.cardTable.updateDataByRowId(card_table_id, body[card_table_id]);
            if (body) {
              res.data.body = body;
            }
          }
          that.setState({
            billID: pk,
            billNO: head[card_from_id].rows[0].values.vbillno.value
          });
          props.setUrlParam({
            status: 'browse',
            id: pk
          });
          //begin tm tangleic 20181116 解决保存后列表多一条数据的问题
          //增加缓存或更新缓存
          // if (status == 'edit') {
          //   cardCache.updateCache(pkName, pk, res.data, card_from_id, dataSource);
          // } else {
          //   cardCache.addCache(pk, res.data, card_from_id, dataSource);
          // }
          if (status == 'add') {
            cardCache.addCache(pk, res.data, card_from_id, dataSource);
          } else {
            cardCache.updateCache(pkName, pk, res.data, card_from_id, dataSource);
          }
          //end tangleic
          //暂行方案，增加回调,方便保存提交逻辑 
          setTimeout(()=>{
            if (callback && (typeof callback == 'function')) {
              callback(props, data);
            }
          //begin tm tangleic 20181108 保存操作如果没有回调则进行提示
            else {
              toast({ color: 'success', content: loadMultiLang(props, '1880000025-000049')/* 国际化处理： 保存成功*/ });
            }},0);
          //end tangleic 
          repaintView(that, props);
        }
      }
    });
  }
}

/**
 * 保存提交（新）
 * @param {*} props 
 */
const saveCommitNew = function (props) {
  let rows = props.cardTable.getNumberOfRows(card_table_id)
  if(rows <= 0){
    toast({ color: 'warning', content: loadMultiLang(props, '1880000025-000050')});/* 国际化处理：单据表体行不能为空！*/
    return;
  }
  save.call(this, props, () => {
    cardOperator(props, card_page_id, card_from_id, bodyCodeMapBodyPKName, pkName, base_url + 
      'spepaycommit.do', loadMultiLang(this.props, '1880000025-000007'), dataSource,
       commitAssign.bind(this),true,{ 'btncode': 'SaveCommit', 'pagecode': card_page_id });/* 国际化处理： 提交成功！*/
  })
}

/**
 * 保存新增（新增<add>,复制<add>）
 * @param {*} props 
 */
const saveAdd = function (props) {
  let rows = props.cardTable.getNumberOfRows(card_table_id)
  if(rows <= 0){
    toast({ color: 'warning', content: loadMultiLang(props, '1880000025-000050') });/* 国际化处理：单据表体行不能为空！*/
    return;
  }

  //状态
  let status = props.getUrlParam('status');
  if (status != 'add') {
    return;
  }
  //开启表单校验
  let flagForm = props.form.isCheckNow(card_from_id);
  //开启表体校验
  let flagTable = props.cardTable.checkTableRequired(card_table_id);
  if (!flagForm || !flagTable) {
    return;
  }
  //保存新增后资金组织的值为保存前资金组织的值
  let pk_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
  //获取主子表单据数据
  let billdata = createSimpleBillData(props,card_page_id, card_from_id, card_table_id);
  let data = { data: JSON.stringify(billdata), pageCode: card_page_id };
  const that = this;
  //必输项校验通过后执行aiax，保存成功后跳转到新增页面，然后走资金组织的编辑后事件
  if (flagForm && flagTable) {
    ajax({
      url: base_url + 'spepaycardInsertSave.do',
      data: data,
      success: (res) => {
        let { success, data } = res;
        if (success) {
          let { head, body } = data;
          let pk = head[card_from_id].rows[0].values.pk_spepay_h.value;         
          //在缓存中增加该数据
          cardCache.addCache(pk, data, card_from_id, dataSource);
          //清空表头以及表体的数据
          props.form.EmptyAllFormValue(card_from_id);
          props.cardTable.setTableData(card_table_id, { rows: [] });
          //给资金组织赋值为保存前的资金组织的值
          props.form.setFormItemsValue(card_from_id, { 'pk_org': { value: pk_org.value, display: pk_org.display } });
          props.pushTo("/card", {
            pagecode:card_page_id,
            isCopy:false,
            status: 'add',
            from: 'card'
          });
           //预算提示
           showTBBMsg(head, card_from_id);
          //多版本控制
          versionControl(props);
          props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false});
          that.toggleShow();
          //触发资金组织的编辑后事件
          afterEvent(props, card_from_id, 'saveadd', pk_org);
          // 新增保存后需要弹出保存成功的弹框--wangyyx
          toast({ color: 'success', content: loadMultiLang(this.props,'1880000025-000049') });/* 国际化处理： 保存成功！*/
          return;
        }
      }
    });
  }
}

/**
 * 保存提交
 * @param {*} props 
 */
const saveCommit = function (props, callback) {
  let status = props.getUrlParam('status');
  if (status != 'add' && status != 'edit') {
    return;
  }
  //开启表单校验
  let flagForm = props.form.isCheckNow(card_from_id);
  //开启表体校验
  let flagTable = props.cardTable.checkTableRequired(card_table_id);
  if (!flagForm || !flagTable) {
    return;
  }
  let url = base_url;
  //修改以及经办时保存提交
  if (status == 'edit' || status == viewmod_deal) {
    url = url + 'spepayupdatesavecommit.do';
  }
  //保存提交
  else {
    url = url + 'spepaysavecommit.do';
  }
  let billdata = createSimpleBillData(props,card_page_id, card_from_id, card_table_id);
  let pageCode = card_page_id;
  let data = { data: JSON.stringify(billdata), pageCode };
  const that = this;
  if (flagForm && flagTable) {
    ajax({
      url: url,
      data,
      success: (res) => {
        let { success, data } = res;
        if (success) {
          let { head, body } = data;
          if (head || body) {
            if (head) {
              that.props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
              let pk = head[card_from_id].rows[0].values.pk_spepay_h.value;
              //增加缓存或更新缓存
              if (status == 'edit') {
                cardCache.updateCache(pkName, pk, res.data, card_from_id, dataSource);
              } else {
                cardCache.addCache(pk, res.data, card_from_id, dataSource);
              }
              that.setState({
                billID: pk,
                billNO: head[card_from_id].rows[0].values.vbillno.value
              });
              props.pushTo("/card", {
                pagecode:card_page_id,
                status: 'browse',
                id: pk
              });
            }
            if (body) {
              that.props.cardTable.setTableData(card_table_id, body[card_table_id]);
            }
            versionControl(props);
            that.toggleShow();
          }
          //暂行方案，增加回调,方便保存提交逻辑 
          if (callback && (typeof callback == 'function')) {
            callback(props, data);
          }
        }
      }
    });
  }
}

/**
 * 联查审批意见
 */
const approveView = function (props) {
  let billID = this.props.form.getFormItemsValue(card_from_id, 'pk_spepay_h').value;
  this.setState({
    approveshow: !this.state.approveshow,
    billID
  });
}

/**
 * 联查来源单据
 */
const qrySourceBill = function (props) {
  //来源模块
  let bill_recmodul = this.props.form.getFormItemsValue(card_from_id, 'recmodul').value;
  //来源单据类型
  let srccmpbilltype = this.props.form.getFormItemsValue(card_from_id, 'srccmpbilltype').value;
  //来源单据id
  let pk_srccmpbill = this.props.form.getFormItemsValue(card_from_id, 'pk_srccmpbill').value;
  if (bill_recmodul == sourceModel.ModuleCode_FTS) {
    toast({ color: 'warning', content: loadMultiLang(this.props, '1880000025-000015') });/* 国际化处理： 中心填写的单据，没有来源*/
    return;
  }
  let sbExtParam = {
    status: 'browse',
    LinkBillType: billtype,
    id: pk_srccmpbill
  };
  linkApp(props, srccmpbilltype, sbExtParam);
}

/**
 * 联查下游单据
 */
const qrySendBill = function (props) {
  if (!this.props.form.getFormItemsValue(card_from_id, 'pk_spepay_h').value) {
    toast({ color: 'warning', content: loadMultiLang(this.props, '1880000025-000016') });/* 国际化处理： 操作失败，无数据!*/
    return;
  }
  let pk = this.props.form.getFormItemsValue(card_from_id, 'pk_spepay_h').value;
  ajax({
    url: base_url + 'spepaylinkqrysendbill.do',
    data: { pk },
    success: (res) => {
      let { data } = res;
      if (!data) {
        return;
      }
      let { url, pks, appCode, linkPageCode } =data[0];
      let urlExtParam = {
        status: 'browse',
        scene: SCENE.LINK,
        appcode: appCode,
        pagecode: linkPageCode,
        srcbilltype: billtype,
        [URL_PARAM.PK_SRC]: pk
      };
      props.openTo(null, urlExtParam);
      // linkSucessPro(props, res, urlExtParam);
    }
  });
}

/**
 * 联查账户余额
 */
const qryAccountBalance = function (props) {
  const selectDatas = props.cardTable.getCheckedRows(card_table_id); //获取当前选中行数据
  //判断是否有选中行
  if (selectDatas == null || selectDatas.length == 0 || selectDatas.length > 1) {
    toast({ color: 'warning', content: loadMultiLang(this.props, '1880000025-000017') });/* 国际化处理： 请选中表体中的一行数据！*/
    return;
  }
  let pkInnerAccount = selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values['pk_accid'] && selectDatas[0].data.values['pk_accid'].value;
  this.setState({
    showAccModal: !this.state.showAccModal,
    pkInnAccount: pkInnerAccount
  });
}

/**
 * 联查凭证
 */
const linkQueryVoucher = function (props) {
  let pk = this.props.form.getFormItemsValue(card_from_id, 'pk_spepay_h').value;
  let pk_group = this.props.form.getFormItemsValue(card_from_id, 'pk_group').value;
  let pk_org = this.props.form.getFormItemsValue(card_from_id, 'pk_org').value;
  let pk_billtype = this.props.form.getFormItemsValue(card_from_id, 'pk_billtype').value;
  let vbillno = this.props.form.getFormItemsValue(card_from_id, 'vbillno').value;
  linkVoucherApp(props, pk, pk_group,pk_org,pk_billtype,vbillno);
}

/**
 * 联查预算
 */
const linkQryNtb = function (props) {
  if (!this.props.form.getFormItemsValue(card_from_id, 'pk_spepay_h').value) {
    toast({ color: 'warning', content: loadMultiLang(this.props, '1880000025-000016') });/* 国际化处理： 操作失败，无数据!*/
    return;
  }
  let pk = this.props.form.getFormItemsValue(card_from_id, 'pk_spepay_h').value;
  ajax({
    url: base_url + 'spepaylinkqryntb.do',
    data: { pk },
    success: (res) => {
      let { data } = res;
      this.setState({
        showNtbDetail: true,
        ntbdata: data
      })
    }
  });
}
/**
 * 联查 回单
 */
const doReceipt = function(props){
  let billstatus= props.form.getFormItemsValue(card_from_id,'billstatus');
  if(billstatus&&billstatus.value!=3) {
    toast({ color: 'warning', content: loadMultiLang(this.props, '1880000025-000054') });/* 国际化处理： 请选择转账成功的单据进行操作!*/
    return;
  }
  let pk = this.props.form.getFormItemsValue(card_from_id, 'pk_spepay_h').value;
  ajax({
    url: base_url + 'queryReceipt.do',
    data: {pk},
    success: (res) => {
      let {data ,success}=res;
      if(success) {
        if(data&&data>1) {
          props.openTo(null, {
            appcode: '36300STPRF',
            pagecode: '36300STPRF_L01',
            pk_src: pk,
            status: 'browse',
            scene:'pk_src'
          })
        }else if(data=1) {
          props.openTo(null, {
            appcode: '36300STPRF',
            pagecode: '36300STPRF_C01',
            pk_src: pk,
            status: 'browse',
            scene:'pk_src'
          })
        }else {
          toast({ color: 'warning', content: loadMultiLang(this.props, '1880000025-000055') });/* 国际化处理： 该单据没有生成对应的回单!*/
          return;
        }
      }
    }
  });

  // let id=props.form.getFormItemsValue(card_from_id,'pk_spepay_h').value;
  // props.openTo(null, {
  //   appcode: '36300STPRF',
  //   pagecode: '36300STPRF_C01',
  //   pk_src: id,
  //   status: 'browse',
  //   scene:'pk_src'
  // })
 
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
    this.toggleShow.call(this);
  }
}

/**
 * 删除确认
 * @param {*} props 
 */
const delConfirm = function (props) {
  let pkMapTs = {};
  let pk = props.form.getFormItemsValue(card_from_id, 'pk_spepay_h').value;
  let ts = props.form.getFormItemsValue(card_from_id, 'ts').value;
  pkMapTs[pk] = ts;
  let data = { pkMapTs, pageCode: card_page_id };
  ajax({
    url: base_url + 'spepaydelete.do',
    data: data,
    success: () => {
      //删除缓存
      cardCache.deleteCacheById(pkName, pk, dataSource);
      //let currID = { id: props.getUrlParam('id'), status: 3 };
      //let nextID = props.cardPagination.getNextCardPaginationId(currID);
      //根据当前pk获取下一个pk
      let nextId = cardCache.getNextId(pk, dataSource);
      //如果有下一条数据则加载下一条数据，否则返回列表界面
      if (nextId) {
        //props.cardPagination.setCardPaginationId(currID);
        //触发上下页切换
        //pageInfoClick(props, nextID);
        pageInfoClick.call(this, this.props, nextId);
      } else {
        //加载空数据到界面
        //清除表头的数据
        props.form.EmptyAllFormValue(card_from_id);
        //删除表体行
        props.cardTable.setTableData(card_table_id, { rows: [] });
        this.setState({
          billID: '',
          billNO: ''
        });
        props.setUrlParam({
          status: 'browse',
          isCancel: 'cancel'
        });
        this.toggleShow();
      }
      toast({ color: 'success', content: loadMultiLang(this.props, '1880000025-000018') });/* 国际化处理： 删除成功*/
    }
  });
};

/**
 * 取消确认
 * @param {} props 
 */
const cancelConfirm = function (props) {
  let currentId = props.getUrlParam('id');
  if (!currentId) {
    //若当前id不存在，则获取当前列表最后一条数据的id
    currentId = cardCache.getCurrentLastId(dataSource);
  }
  //若currentId有值的话则返回到currentId的浏览态页面
  if (currentId) {
    props.pushTo('/card', {
      pagecode:card_page_id,
      status: 'browse',
      id: currentId
    });
  } else {
    props.pushTo("/card", {
      pagecode:card_page_id,
      status: 'browse',
      isCancel: 'cancel'
    });
    // //将表单值取消到上次保存状态并切换到浏览态
    // this.props.form.cancel(card_from_id);
    // //将表格数据恢复到编辑前的值
    // this.props.cardTable.resetTableData(card_table_id);
    //this.toggleShow();
  }
  //versionControl(props);
  this.qryData();
  this.toggleShow();
}


/**
 * 卡片退回
 * @param {*} props 
 */
export const cardReBack = function (props, reason) {
  if (!reason) {
    toast({ 'color': 'warning', 'content': loadMultiLang(this.props, '1880000025-000019') });/* 国际化处理： 退回原因不能为空！*/
    return;
  }
  let extParam = { reason };
  cardOperator(props, card_page_id, card_from_id, bodyCodeMapBodyPKName, 'pk_spepay_h', base_url + 'spepayback.do', loadMultiLang(this.props, '1880000025-000020'), dataSource, pageChange.bind(this), false, extParam);/* 国际化处理： 退回成功！*/
  //关闭退回弹框
  this.setState({ showBackModal: false });
}

/**
 * 无当前页数据，查询上一条或下一条
 */
export const pageChange = function () {
  let pk = this.props.form.getFormItemsValue(card_from_id, 'pk_spepay_h').value;
  //删除缓存
  cardCache.deleteCacheById(pkName, pk, dataSource);
  let nextID = cardCache.getNextId(pk, dataSource);
  //如果有下一条数据则加载下一条数据，否则返回列表界面
  if (nextID) {
    //触发上下页切换
    pageInfoClick.call(this, this.props, nextID);
  } else {
    this.props.pushTo("/card", {
      pagecode:card_page_id,
      status: 'browse',
      isCancel: 'cancel'
    });
    this.qryData();
    versionControl(this.props);
    this.toggleShow();
  }

}

/**
 * 刷新
 * @param {*} props 
 */
const doRefresh = function (props) {
  let data = { pk: props.getUrlParam('id'), pageCode: card_page_id };
  ajax({
    url: "/nccloud/fts/specialtransfer/spepaycardquery.do",
    data: data,
    success: (res) => {
      if (res.data) {
        if (res.data.head) {
          props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
        }
        if (res.data.body) {
          props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
        }
        let billID = res.data.head[card_from_id].rows[0].values.pk_spepay_h.value;
        let billNO = res.data.head[card_from_id].rows[0].values.vbillno.value;
        this.setState({
          billID,
          billNO
        });
        //更新缓存
        cardCache.updateCache(pkName, billID, res.data, card_from_id, dataSource);
        //多版本控制
        versionControl(props);
        this.toggleShow();
        //经办时，设置字段的编辑性
        if (status == viewmod_deal) {
          let editItemArr = {
            'pk_org': true,
            'pk_currtype': true,
            'isreversebustype': true,
          };
          this.props.form.setFormItemsDisabled(card_from_id, editItemArr);
          //设置表体中某些列不可编辑,true为不可编辑，默认true
          this.props.cardTable.setColEditableByKey(card_table_id, ['pk_getfinanceorg', 'pk_accid', 'amount', 'olcrate']);
        }
        //复制时资金组织不可编辑，其余字段可编辑
        if (status == 'add' && isCopy) {
          this.props.resMetaAfterPkorgEdit();
          this.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': true });
        }
      } else {
        this.props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
        this.props.cardTable.setTableData(card_table_id, { rows: [] });
      }
    }
  });
}

/**
 * 编辑展开删行按钮处理
 */
export const modelDelLineProcess = function (props, moduleId) {
  //删行后走原币金额的编辑后事件重算表头的金额信息
  afterEvent(props, card_from_id, 'amount');
}
/*Hm9gUKDDwtNjV7Mk8onAzsLWQH/l1DmcaFGbXclJ8OkE5QDZUmL3ka2qQ7SuEIgS*/