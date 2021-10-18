/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, print, output, cardCache,promptBox } from 'nc-lightapp-front';
import * as CONSTANTS from '../../cons/constant';
import { getCurrentLastId, deleteCacheData, getNextId, } from '../../../../../tmpub/pub/util/cache';
import initTemplate from './initTemplate';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; //凭证
import { pageInfoClick } from "../events";
import { buttonVisible } from './buttonVisible';//xuech bug修改 银行定期存入回单-记账和取消记账后请自动刷新按钮
import { processHeadOlcRateEditable } from '../../cons/constant';//20200402
let { dataSource, pageCodeCard, base_url, app_code, nodekey, formId, pkname } = CONSTANTS;
let { updateCache } = cardCache;
export default function (props, key) {
  let saveObj = {};
  let formData = {};
  switch (key) {
    case 'Refresh':
      this.qryData(true);
      break;
    //头部新增
    case 'Add':
      // let pk = props.getUrlParam('id');
      props.pushTo('/card', {
        status: 'add',
        from: 'card'
      });
      initTemplate.call(this, props);
      this.billID = '';
      props.form.EmptyAllFormValue(formId);
      this.toggleShow();
      break;
    //修改
    case 'Edit':
      let editData = this.props.form.getAllFormValue(formId);
      editBill.call(this, props, editData);
      break;
    //删除
    case 'Delete':
      let delData = this.props.form.getAllFormValue(formId);
      promptBox({
          color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
          title: this.props.MutiInit.getIntl("36140FDSR") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000015'),
          content: this.props.MutiInit.getIntl("36140FDSR") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000039'),/* 国际化处理： 是否确认删除？*/
          beSureBtnClick: delBill.bind(this, props, delData)
      })
      break;
    //头部 复制
    case 'Copy':
      let copyData = this.props.form.getAllFormValue(formId);
      copyBill.call(this, props, copyData);
      break;
    case 'Tally':// 记账
      tallyConfirm.call(this, props);
      break;

    case 'Untally':// 取消记账
      unTallyConfirm.call(this, props);
      break;
    //取消
    case 'Cancel':
    	promptBox({
            color: "warning",
            title: this.state.json['36140FDSR-000029'],/* 国际化处理： 取消*/
            content: this.state.json['36140FDSR-000028'],/* 国际化处理： 确定要取消吗?*/
            beSureBtnClick: cancel.bind(this, props)//点击确定按钮事件
        });
      break;
    //头部保存
    case 'Save':
      this.isSaveAdd = false;
      //formData = this.props.createMasterChildData(pageCodeCard, formId, null);
      //props.validateToSave(formData, this.saveBill.bind(this, formData), saveObj, '');
      formData = this.props.createExtCardData(pageCodeCard, formId);
      let saveData = this.props.form.getAllFormValue(formId);
      let validateData = {
            pageid: pageCodeCard,
            model: {
                areacode: formId,
                rows: saveData.rows,
                areaType: 'form'
            }
      }
      saveObj[formId] = 'form';
      props.validateToSave(validateData, this.saveBill.bind(this, formData), saveObj, '');
    break;
    //保存新增
    case 'SaveAdd':
      this.isSaveAdd = true;
      //formData = this.props.createMasterChildData(pageCodeCard, formId);
      //props.validateToSave(formData, this.saveBill.bind(this, formData), saveObj, '');
      formData = this.props.createExtCardData(pageCodeCard, formId);
      let saveDataAdd = this.props.form.getAllFormValue(formId);
      let validateDataAdd = {
            pageid: pageCodeCard,
            model: {
                areacode: formId,
                rows: saveDataAdd.rows,
                areaType: 'form'
            }
      }
      saveObj[formId] = 'form';
      props.validateToSave(validateDataAdd, this.saveBill.bind(this, formData), saveObj, '');
    break;
    case 'File':
      fileMgr.call(this, props);
      break;
    case 'queryVoucher':// 联查凭证
      let voucherData = this.props.form.getAllFormValue(formId);
      let pk_deposit = voucherData.rows[0].values['pk_deposit'].value;
      let billnov = voucherData.rows[0].values['vbillcode'].value;
      let pk_groupv = voucherData.rows[0].values['pk_group'].value;
      let pk_orgv = voucherData.rows[0].values['pk_org'].value;
      let billtype = '36E1';
      linkVoucherApp(
        this.props,
        pk_deposit,
        pk_groupv,
        pk_orgv,
        billtype,
        billnov,
      );
      break;
    case 'balanceAccount':
      let settleacc_arr = [];
      let pk_org_settleacc, pk_settleacc;
      if (this.props.form.getFormItemsValue(formId, 'pk_org')
        && this.props.form.getFormItemsValue(formId, 'pk_org').value) {
        pk_org_settleacc = this.props.form.getFormItemsValue(formId, 'pk_org').value;
      }
      if (this.props.form.getFormItemsValue(formId, 'pk_settleacc')
        && this.props.form.getFormItemsValue(formId, 'pk_settleacc').value) {
        pk_settleacc = this.props.form.getFormItemsValue(formId, 'pk_settleacc').value;
      }
      let recInside_rdata = {
        // 资金组织
        pk_org: pk_org_settleacc,
        // 结算账户
        pk_account: pk_settleacc,
      };
      settleacc_arr.push(recInside_rdata);
      this.setState({
        showOriginalData: settleacc_arr,
        showOriginal: true,
      });
      break;
    case 'Print':
      let printData = this.props.form.getAllFormValue(formId);
      let pks = [];
      pks.push(printData.rows[0].values[pkname].value);
      print(
        'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        base_url + 'FDSRPrintaction.do',
        {
          appcode: app_code,
          nodekey: null,//模板节点标识
          oids: pks
        }
      );
      break;
    // 输出
    case 'Output':
      let outputData = this.props.form.getAllFormValue(formId);
      let outputpks = [];
      outputpks.push(outputData.rows[0].values[pkname].value);
      output({
        url: base_url + 'FDSRPrintaction.do',
        data: {
          nodekey: null,
          appcode: app_code,
          oids: outputpks,
          outputType: 'output'
        }
      });
      break;
  }
}
//取消按钮
const cancel = function (props) {
  let isSaveAdd = this.isSaveAdd;
  let status = props.getUrlParam("status");
  if (status == 'edit') {
    props.setUrlParam({
      status: 'browse',
      id: props.getUrlParam('id')
    });
    this.qryData();
    // 因为表体采用setTableData设置的值，所以回退不会起效，重新查询
  } else if (status == 'add' || status == 'copy') {
    let nextId = getCurrentLastId(dataSource);
    
    if (nextId || isSaveAdd) {
      props.setUrlParam({
        status: 'browse',
        id: nextId,
        isCopy: false
      });
      this.qryData();
      //因为上一条可能是新增加入缓存的数据，缓存中只存储表头数据，所以需要重新查询
    } else {
      props.form.EmptyAllFormValue(formId);
      props.pushTo('/card', {
        status: 'browse',
      });
      props.form.EmptyAllFormValue(formId);
      props.initMetaByPkorg();
      props.form.setFormItemsDisabled(formId, { "pk_org": true });
      this.toggleShow();
    }
  } else {
    window.history.back();
  }
}
/**
 * 修改加载数据
 */
const editBill = function (props, record) {
  let pkMapTs = {};
  let pk = record.rows[0].values[pkname].value;
  let ts = record.rows[0].values['ts'].value;
  pkMapTs[pk] = ts;
  ajax({
    url: base_url + 'FDSREditaction.do',
    data: {
      pk,
      pkMapTs,
      pageCode: pageCodeCard
    },
    success: (res) => {
      if (res) {
        this.props.setUrlParam({
          status: 'edit'
        });
        this.toggleShow();
      }
    }
  });
}
/**
 * 删除数据
 */
const delBill = function (props, record) {
  let pkMapTs = {};
  let pk = record.rows[0].values[[pkname]].value;
  let ts = record.rows[0].values['ts'].value;
  pkMapTs[pk] = ts;
  ajax({
    url: base_url + 'FDSRDeleteaction.do',
    data: {
      pkMapTs,
      pageCode: pageCodeCard
    },
    success: (res) => {
      if (res.success) {
        toast({ color: 'success', content: this.props.MutiInit.getIntl("36140FDSR") && this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000015') + this.props.MutiInit.getIntl("36140FDSR").get('36140FDSR-000036') });/* 国际化处理： 删除成功*/
        let nextId = getNextId(props,pk, dataSource);
        deleteCacheData(props,pkname, pk, dataSource);
        this.props.setUrlParam({
          status: 'browse',
          id: nextId ? nextId:'',
        });
        pageInfoClick.call(this, props, nextId);
      }
    }
  });
}
/**
 * 复制数据
 */
const copyBill = function (props, record) {
  let pk = record.rows[0].values[pkname].value;
  ajax({
    url: base_url + 'FDSRCopyaction.do',
    data: {
      pk,
      pageCode: pageCodeCard
    },
    success: (res) => {
      if (res.data.head) {
        this.props.setUrlParam({
          status: 'add',
          isCopy: 'copy'
        });
        // this.toggleShow();
        // this.props.form.setFormStatus(formId, 'add');
        this.props.form.EmptyAllFormValue(formId);
        this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
        this.props.form.setFormItemsDisabled(formId, { 'pk_org': true });
        this.props.form.setFormItemsDisabled(formId, { 'pk_depositbank': false, 'depositcode': false, 'pk_currtype': false, 'businessvariety': false, 'depositamount': false, 'depositdate': false, 'redeposittype': false, 'pk_settleacc': false, 'pk_depositacc': false, 'remark': false });
        if(res.data.userjson){//20200402
            let userjson = JSON.parse(res.data.userjson);
            let {retExtParam} =userjson;
            //设置组织本币列编辑性
            processHeadOlcRateEditable(props, retExtParam);
            this.props.setUrlParam({
                userjson: userjson
              });
          }
        this.toggleShow();
      }
    }
  })
}
/**
 * 附件管理
 * @param {*} props 页面内置对象
 */
const fileMgr = function (props) {

  let selectDatas = this.props.form.getAllFormValue(formId);
  let billID = selectDatas.rows[0].values[pkname].value;
  let billNO = selectDatas.rows[0].values['vbillcode'].value;
  this.setState({
    showUploader: !this.state.showUploader,
    billID,
    billNO
  });
}

/**
 * 记账
 * @param {*} props 
 */
const tallyConfirm = function (props) {
  let that = this;
  let pkMapTs = {};
  let pk = props.form.getFormItemsValue(formId, pkname).value;
  let ts = props.form.getFormItemsValue(formId, 'ts').value;
  pkMapTs[pk] = ts;
  ajax({
    url: base_url + 'FDSRTallyaction.do',
    data: {
      pkMapTs,
      pageCode: pageCodeCard,
	  extParam: { btncode: 'Tally', pagecode: pageCodeCard }//20200115xuechh云原生适配
    },
    success: (res) => {
      let pk_deposit = null;
      if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
        props.dealFormulamsg(
          res.formulamsg,  //参数一：返回的公式对象
          {                //参数二：界面使用的表格类型
            card_table_id: "cardTable"
          }
        );
      }
      if (res.success) {
        toast({ color: 'success', content: that.state.json['36140FDSR-000049'] });
        if (res.data) {
          if (res.data.head && res.data.head[formId]) {
            props.form.setAllFormValue({ [formId]: res.data.head[formId] });
            pk_deposit = res.data.head[formId].rows[0].values.pk_deposit.value;
          }
          if (res.data.body && res.data.body[that.tableId]) {
            props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);
          }
          updateCache(pkname, pk_deposit, res.data, formId, dataSource, res.data.head[formId].rows[0].values);
        }
        //xuech bug修改 银行定期存入回单-记账和取消记账后请自动刷新按钮
       
        buttonVisible(this.props);
        this.qryData();
      }
    }
  });
};


/**
* 取消记账
* @param {*} props 
*/
const unTallyConfirm = function (props) {
  let that = this;
  let pkMapTs = {};
  let pk = props.form.getFormItemsValue(formId, pkname).value;
  let ts = props.form.getFormItemsValue(formId, 'ts').value;
  pkMapTs[pk] = ts;
  ajax({
    url: base_url + 'FDSRUntallyaction.do',
    data: {
      pkMapTs,
      pageCode: pageCodeCard,
	  extParam: { btncode: 'Untally', pagecode: pageCodeCard }//20200115xuechh云原生适配
    },
    success: (res) => {
      let pk_deposit = null;
      if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
        props.dealFormulamsg(
          res.formulamsg,  //参数一：返回的公式对象
          {                //参数二：界面使用的表格类型
            card_table_id: "cardTable"
          }
        );
      }
      if (res.success) {
        toast({ color: 'success', content: this.state.json['36140FDSR-000064'] });/* 国际化处理： 取消记账成功*/
        if (res.data) {
          if (res.data.head && res.data.head[formId]) {
            props.form.setAllFormValue({ [formId]: res.data.head[formId] });
            pk_deposit = res.data.head[formId].rows[0].values.pk_deposit.value;
          }
          if (res.data.body && res.data.body[this.tableId]) {
            props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
          }
          updateCache(pkname, pk_deposit, res.data, formId, dataSource, res.data.head[formId].rows[0].values);
        }
		//xuech bug修改 银行定期存入回单-记账和取消记账后请自动刷新按钮
        buttonVisible(this.props);
        this.qryData();
      }
    }
  });
};
/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/