/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, base, toast, print, output,cardCache,promptBox } from 'nc-lightapp-front';
import * as CONSTANTS from '../../cons/constant';
import { linkApp } from '../../../../../tmpub/pub/util/LinkUtil';
import { elecSignCardPrint } from "../../../../../tmpub/pub/util/index";
import { getCurrentLastId,deleteCacheData, getNextId, } from '../../../../../tmpub/pub/util/cache';
import initTemplate from './initTemplate';
import {  loadMultiLang } from "../../../../../tmpub/pub/util/index";
import { cardOperator } from '../../../../pub/utils/IFACButtonUtil';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; //凭证
import { requesturl } from '../../cons/requesturl.js';
import { buttonVisible } from './buttonVisible';
import { pageInfoClick} from "../events";
import { listMultiOperator, listSingleOperator } from '../../../../pub/utils/IFACButtonUtil';
let { updateCache } = cardCache;
let { dataSource, pageCodeCard,base_url, appcode, tableId,srcBusiType, searchId,app_code, Print_URL, nodekey, formId, linkkbilltype, pkname, Elecsign_Print_URL, formal_nodekey, supply_nodekey, vbillno } = CONSTANTS;
let bodyCodeArr = {};
export default function (props, key) {
    let saveObj = {};
    let formData={};
    let valformData = {}
    let validateData={}
    let saveformData={}
   
    switch (key) {
        case 'Refresh':
          this.qryData(true);
          break;
        //头部新增
        case 'Add':
          let pk = props.getUrlParam('id');
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
          props.form.setFormItemsDisabled(formId, { 'pk_org': true });
          props.form.setFormItemsDisabled(formId, { 'billmaker': true });
          props.form.setFormItemsDisabled(formId, { 'operatedate': true });
          props.form.setFormItemsDisabled(formId, { 'tallyor': true });
          props.form.setFormItemsDisabled(formId, { 'tallydate': true });
          props.form.setFormItemsDisabled(formId, { 'creator': true });
          props.form.setFormItemsDisabled(formId, { 'creationtime': true });
          props.form.setFormItemsDisabled(formId, { 'modifier': true });
          props.form.setFormItemsDisabled(formId, { 'modifiedtime': true });
          let editData = this.props.form.getAllFormValue(formId);
          props.pushTo('/card', {
            status: 'edit',
            id:editData.rows[0].values['pk_fixeddatewithdraw'].value,
          });
          this.qryData();
          // break;
          // editBill.call(this,props,editData); 
          // }
          
          break;
        //删除
        case 'Delete':
            let delData = this.props.form.getAllFormValue(formId);
            promptBox({
              color: "warning",
              title: loadMultiLang(props, '36140NDSR-000015'),/* 国际化处理： 删除*/
              content: loadMultiLang(props, '36140NDSR-000013'),/* 国际化处理： 确认要删除吗?*/
              beSureBtnClick:  delBill.bind(this,props,delData)
          });
            break;
        //头部 复制
        case 'Copy':
          props.form.setFormItemsDisabled(formId, { 'pk_org': true });
          props.form.setFormItemsDisabled(formId, { 'billmaker': true });
          props.form.setFormItemsDisabled(formId, { 'operatedate': true });
          props.form.setFormItemsDisabled(formId, { 'tallyor': true });
          props.form.setFormItemsDisabled(formId, { 'tallydate': true });
          props.form.setFormItemsDisabled(formId, { 'creator': true });
          props.form.setFormItemsDisabled(formId, { 'creationtime': true });
          props.form.setFormItemsDisabled(formId, { 'modifier': true });
          props.form.setFormItemsDisabled(formId, { 'modifiedtime': true });
            let copyData = this.props.form.getAllFormValue(formId);
            copyBill.call(this,props,copyData);
            break;
        case 'Tally':// 记账
            tallyConfirm.call(this, props);
            break;
         case 'UnTally':// 取消记账
            UnTallyConfirm.call(this, props);
            break;
        //取消
        case 'Cancel':
              promptBox({
                color: "warning",
                title:this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000029'),/* 国际化处理： 取消*/
                content: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000028'),/* 国际化处理： 确定要取消吗?*/
                beSureBtnClick: cancel.bind(this, props)//点击确定按钮事件
            });
            break;
        //头部保存
        case 'Save':
          this.isSaveAdd = false;
          saveObj[formId] = 'form';
          valformData = this.props.form.getAllFormValue(formId);
          saveformData = this.props.createMasterChildData(pageCodeCard, formId);
          validateData = {
              pageid: pageCodeCard,
              model: {
                  areacode: formId,
                  rows: valformData.rows,
                  areaType: 'form'
              }
          }
            //formData.head.head.rows[0].values.totalamount{value:totalamount};
            props.validateToSave(validateData, this.saveBill.bind(this,false,saveformData), saveObj, '');
            break;
        //保存新增
        case 'SaveAdd':
          this.isSaveAdd = true;
          saveObj[formId] = 'form';
          valformData = this.props.form.getAllFormValue(formId);
          saveformData = this.props.createMasterChildData(pageCodeCard, formId);
          validateData = {
              pageid: pageCodeCard,
              model: {
                  areacode: formId,
                  rows: valformData.rows,
                  areaType: 'form'
              }
          }
            props.validateToSave(validateData, this.saveBill.bind(this, false,saveformData), saveObj, '');
            break;
        case 'File':
          fileMgr.call(this, props);
          break;
          // 联查存单
        case 'Depositreceipt':
          let linkData = this.props.form.getAllFormValue(formId);
          let depositcode =linkData.rows[0].values['pk_depositreceipt'].value;
          if(!depositcode){
            toast({
              color: 'warning',
              content: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000012') //{/* 国际化处理： 未查询出符合条件的数据！*/}
            });
          } else {
            this.props.openTo('/ifac/factimedepositmanage/depositreceipt/main/index.html#/card/index.html', 
            {
              srcFunCode:'36140RFD',
              appcode: '36140FDLB',
              pagecode: '36140FDLB_C01',
              status: 'browse',
              islinkquery: true,
              id:depositcode,
              scene: "linksce"
            });
          }
          break;
        case 'queryVoucher':// 联查凭证
            let voucherData = this.props.form.getAllFormValue(formId);
            let pk_fixeddatewithdraw=voucherData.rows[0].values['pk_fixeddatewithdraw'].value;
            let billnov=voucherData.rows[0].values['vbillcode'].value;
            let pk_groupv=voucherData.rows[0].values['pk_group'].value;
            let pk_orgv=voucherData.rows[0].values['pk_org'].value;
            let billtype='36E2';
            linkVoucherApp(
              this.props,
              pk_fixeddatewithdraw,
              pk_groupv,
              pk_orgv,
              billtype,
              billnov,
            );
            break;
        case 'Interestlist':// 联查单位内部利息清单,待利息清单完成之后，做适配
            // let link_Data = this.props.form.getAllFormValue(formId);
            // let  pk_fixeddatewithdraw1=link_Data.rows[0].values['pk_fixeddatewithdraw'].value;
            // let  pk_org=link_Data.rows[0].values['pk_org'].value;
            // interlistLink.call(this,props,pk_fixeddatewithdraw1,pk_org);
            let link_Data = this.props.form.getAllFormValue(formId);
            let  pk_depositreceipt=link_Data.rows[0].values['pk_depositreceipt'].value;
            interlistLink.call(this,props,pk_depositreceipt);
            break;
        case 'Print':
            let printData = this.props.form.getAllFormValue(formId);
            let pks = [];
            pks.push(printData.rows[0].values['pk_fixeddatewithdraw'].value);
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                base_url + 'FDWDWPrintaction.do',
                {
                    appcode: app_code,
                    nodekey: nodekey,//模板节点标识
                    oids: pks
                }
              );
              break;
          // 输出
          case 'Output':
              let outputData = this.props.form.getAllFormValue(formId);
              let outputpks = [];
              outputpks.push(outputData.rows[0].values['pk_fixeddatewithdraw'].value);
              output({
                  url: base_url+'FDWDWPrintaction.do',
                  data: {
                      nodekey: nodekey,
                      appcode: app_code,
                      oids: outputpks,
                      outputType: 'output'
                  }
              });
              break;
          //头部 退回
          case 'Back':
            this.setState({ showModal: true });
            break;
    }
}
/* 联查利息清单
* @param {*} props 
* @param {*} pk 
* @param {*} pk_org 
*/
const interlistLink = function(props,pk){
  let linkpath;
  ajax({
      url: requesturl.checklist, 
      data: {
          "pks": [pk],
      },
      success: (res) => {
          if(res.data=='0'){
              toast({
                  color: 'warning',
                  content: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000012'), //{/* 国际化处理： 未查询出符合条件的数据！*/}
              });
          }else if(res.data=='1'){
              linkpath = '/ifac/facbankinterestdeal/bankcenterinterestbill/main/#/card'
              props.openTo(linkpath, {
                  appcode: '36140FDIB',
                  pagecode: '36140FDIB_L01',
                  islinkquery: true,
                  pks:pk,
                  type:'intercard'
              });
          }else{
            linkpath = '/ifac/facbankinterestdeal/bankcenterinterestbill/main/#/list'
              props.openTo(linkpath, {
                  appcode: '36140FDIB',
                  pagecode: '36140FDIB_L01',
                  islinkquery: true,
                  pks:pk,
                  type:'interlist'
              });
          }
      }
  })  
}
//取消按钮
const cancel = function (props) {
    let status = props.getUrlParam("status");
    if (status == 'edit') {
      props.setUrlParam({
        status: 'browse',
        id: props.getUrlParam('id')
      });
      // this.pageChange(props.getUrlParam('id'));
      this.qryData();
      // 因为表体采用setTableData设置的值，所以回退不会起效，重新查询
    } else if (status == 'add' || status == 'copy') {
      let nextId = getCurrentLastId(dataSource);
      if (nextId) {
        props.setUrlParam({
          status: 'browse',
          id: nextId,
          isCopy: false
        }); 
        this.qryData();
        //因为上一条可能是新增加入缓存的数据，缓存中只存储表头数据，所以需要重新查询
        // this.pageChange(nextId);
      } else {
        props.form.EmptyAllFormValue(formId);
        props.pushTo('/card', {
          status: 'browse',
        });
        props.form.EmptyAllFormValue(formId);
        props.initMetaByPkorg();
        props.form.setFormItemsDisabled(formId,{"pk_org":true});
        this.toggleShow();
      }
    } else {
      window.history.back();
    }
    this.toggleShow();
  }

/**
 * 删除数据
 */
const delBill = function (props,record) {
  let pkMapTs = {};
  let pk = record.rows[0].values['pk_fixeddatewithdraw'].value;
  let ts = record.rows[0].values['ts'].value;
  let extParam={btncode:"Delete",pageCode:"36140NDSR_C01"};
  pkMapTs[pk] = ts;
  ajax({
      url: '/nccloud/ifac/bankfixeddatewithdraw/FDWDWDeleteaction.do', 
      data: {
          pkMapTs,
          pageCode: pageCodeCard,
          extParam
      },
      success: (res) => { 
          if (res.success) {
              toast({ color: 'success', content: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000063') });/* 国际化处理： 删除成功*/
              let nextId = getNextId(this.props, pk, dataSource);
              deleteCacheData(this.props, pkname, pk, dataSource);
              pageInfoClick.call(this, this.props, nextId);
          }
      }
  });
}
/**
 * 复制数据
 */
const copyBill = function (props,record) {
  let pk =record.rows[0].values['pk_fixeddatewithdraw'].value;
  let billstate = props.form.getFormItemsValue(formId, 'billstate');
  ajax({
    url: base_url + 'FDWDWCopyAction.do',
    data: {
        pk,
        pageCode: pageCodeCard
    },
    success: (res) => {
          if (res.data.head) {
            props.form.setFormStatus(formId,'add');
            props.form.EmptyAllFormValue(formId);
            // props.form.setFormItemsValue(formId, { 'pk_org': { value: res.data.head.head.rows[0].values.pk_org.value ,display: res.data.head.head.rows[0].values.pk_org.display }});
            // props.form.setFormItemsValue(formId, { 'billstate': { value: res.data.head.head.rows[0].values.billstate.value ,display: res.data.head.head.rows[0].values.billstate.display }});
            // props.form.setFormItemsValue(formId, { 'withdrawdate': { value: res.data.head.head.rows[0].values.withdrawdate.value ,display: res.data.head.head.rows[0].values.withdrawdate.display }});
  
            props.form.setAllFormValue({ [formId]: res.data.head[formId] });

            props.form.setFormItemsDisabled(formId, { 'pk_org': true});
            props.form.setFormItemsDisabled(formId, { 'pk_depositorg':false,'pk_depositreceipt':false,'pk_settleacc':false,'withdrawdate':false,'withdrawamount':false,'remark':false});

          }
          if(billstate.value=="1"){
            props.form.setFormItemsValue(formId, { 'depostbalmnt': null });
            props.form.setFormItemsValue(formId, { 'pk_depositreceipt': null });
            props.form.setFormItemsValue(formId, { 'depositdate': null });
            props.form.setFormItemsValue(formId, { 'enddate': null });
            props.form.setFormItemsValue(formId, { 'redeposittype': null });
            props.form.setFormItemsValue(formId, { 'pk_depositbank': null });
            props.form.setFormItemsValue(formId, { 'pk_depositacc': null });
            props.form.setFormItemsValue(formId, { 'pk_depositacc.name': null });
            props.form.setFormItemsValue(formId, { 'pk_currtype': null });
            props.form.setFormItemsValue(formId, { 'pk_depostrate': null });
            props.form.setFormItemsValue(formId, { 'pk_aiacrate': null });
            props.form.setFormItemsValue(formId, { 'pk_settleacc': null });
            props.form.setFormItemsValue(formId, { 'pk_settleacc.name': null });
            props.form.setFormItemsValue(formId, { 'depositinterval': null });
            props.form.setFormItemsValue(formId, { 'intervalunit': null });
            props.form.setFormItemsValue(formId, { 'pk_varieties': null });
          }
          this.props.setUrlParam({
            status: 'add'
          });
          buttonVisible.call(this, this.props);
        }
        
})
    this.setState({pageinfo:false});
}
/**
 * 附件管理
 * @param {*} props 页面内置对象
 */
const fileMgr = function (props) {

  let selectDatas = this.props.form.getAllFormValue(formId);
  let billID = selectDatas.rows[0].values['pk_fixeddatewithdraw'].value;
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
  let ts = props.form.getFormItemsValue(formId,'ts').value;
  let extParam={btncode:"Tally",pageCode:"36140NDSR_C01"};
	pkMapTs[pk] = ts;
	  ajax({
		  url: base_url + 'FDWDWTallyAction.do',
		  data: {
			  pkMapTs,
        pageCode: pageCodeCard,
        extParam
		  },
		  success: (res) => {
			  	let pk_deposit  = null;
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg,  //参数一：返回的公式对象
						{                //参数二：界面使用的表格类型
						card_table_id:"cardTable"
						}
					);
				}
				if (res.success) {
					toast({ color: 'success', content:this.props.MutiInit.getIntl('36140NDSR').get('36140NDSR-000049') });
					if (res.data) {
						if (res.data.head && res.data.head[this.formId]) {
							props.form.setAllFormValue({ [that.formId]: res.data.head[that.formId] });
							pk_deposit  = res.data.head[that.formId].rows[0].values.pk_deposit.value;
						}
						if (res.data.body && res.data.body[that.tableId]) {
							props.cardTable.setTableData(that.tableId, res.data.body[that.tableId]);
						}
						updateCache(pkname,pk_deposit,res.data,that.formId,dataSource,res.data.head[formId].rows[0].values);
          }
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
const UnTallyConfirm = function (props) {
	let that = this;
	let pkMapTs = {};
	let pk = props.form.getFormItemsValue(formId,pkname).value;
  let ts = props.form.getFormItemsValue(formId,'ts').value;
  let extParam={btncode:"UnTally",pageCode:"36140NDSR_C01"};
	pkMapTs[pk] = ts;
	  ajax({
		  url: base_url + 'FDWDWUnTallyAction.do',
		  data: {
			  pkMapTs,
        pageCode: pageCodeCard,
        extParam
		  },
		  success: (res) => {
				let pk_deposit  = null;
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg,  //参数一：返回的公式对象
					{                //参数二：界面使用的表格类型
					card_table_id:"cardTable"
					}
				);
				}
				if (res.success) {
					toast({ color: 'success', content:this.props.MutiInit.getIntl('36140NDSR').get('36140NDSR-000064')});/* 国际化处理： 取消记账成功*/
					if (res.data) {
						if (res.data.head && res.data.head[this.formId]) {
							props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] }); 
							pk_deposit  = res.data.head[this.formId].rows[0].values.pk_deposit.value;
						}
						if (res.data.body && res.data.body[this.tableId]) {
							props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						}
						updateCache(pkname,pk_deposit,res.data,this.formId,dataSource,res.data.head[formId].rows[0].values);
          }
          buttonVisible(this.props);
          this.qryData();
				}
			}
    });
  };
/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/