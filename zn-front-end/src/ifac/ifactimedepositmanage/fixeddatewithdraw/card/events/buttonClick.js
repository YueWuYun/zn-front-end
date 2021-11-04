/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, print, output,promptBox } from 'nc-lightapp-front';
import * as CONSTANTS from '../../cons/constant';
import {loadMultiLang,saveCommit} from "../../../../../tmpub/pub/util/index";
import { getCurrentLastId,deleteCacheData,addCacheData, updateCacheData, getNextId, } from '../../../../../tmpub/pub/util/cache';
import initTemplate from './initTemplate';
import { cardOperator } from '../../../../pub/utils/IFACButtonUtil';
import { linkVoucherApp} from '../../../../../tmpub/pub/util/LinkUtil'; //凭证
import { requesturl } from '../../cons/requesturl.js';
import { pageInfoClick} from "../events";
import {mysaveCommit} from "./method";
let { FixedWithDrawConst, pageCodeCard,base_url, app_code, nodekey, formId, pkname} = CONSTANTS;
let bodyCodeArr = {};
export default function (props, key) {
    let extParam;
    let saveObj = {};
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
          let editData = this.props.form.getAllFormValue(formId);
          props.pushTo('/card', {
            status: 'edit',
            id:editData.rows[0].values['pk_fixeddatewithdraw'].value,
          });
          this.qryData();
          break;
        //删除
        case 'Delete':
            let delData = this.props.form.getAllFormValue(formId);
            promptBox({
              color: "warning",
              title: loadMultiLang(props, '36340FDW-000015'),/* 国际化处理： 删除*/
              content: loadMultiLang(props, '36340FDW-000013'),/* 国际化处理： 确认要删除吗?*/
              beSureBtnClick: delBill.bind(this,props,delData)
            });
            break;
        //头部 复制
        case 'Copy':
            let copyData = this.props.form.getAllFormValue(formId);
            copyBill.call(this,props,copyData);
            break;
        //取消
        case 'Cancel':
            promptBox({
              color: "warning",
              title: loadMultiLang(this.props, '36340FDW-000021'), // 弹框表头信息/* 国际化处理： 确认取消*/
              content: loadMultiLang(this.props, '36340FDW-000020'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否确认要取消？*/
              beSureBtnClick: cancel.bind(this, props) //点击确定按钮事件
              })
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
            // 公式验证
            this.props.validateToSave(validateData, this.saveBill.bind(this, false, saveformData),saveObj, '');
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
            // 公式验证
            this.props.validateToSave(validateData, this.saveBill.bind(this, false, saveformData),saveObj, '');
            break;
        //保存提交 
        case 'SaveCommit':
            mysaveCommit.call(this, props);
            break;
        //头部 提交
        case 'Commit': 
            extParam={btncode:"Commit",pagecode:"36340FDW_C01"};
            cardOperator(props, pageCodeCard, formId, bodyCodeArr, 'pk_fixeddatewithdraw', base_url + 'FDWDWCommitAction.do', loadMultiLang(props, '36340FDW-000011')/* 国际化处理： 提交成功！*/,FixedWithDrawConst.dataSource, commitAssign.bind(this), true,extParam);
            break;
        //头部 收回
        case 'UnCommit':
            extParam={btncode:"UnCommit",pagecode:"36340FDW_C01"};
            cardOperator(props, pageCodeCard, formId, bodyCodeArr, 'pk_fixeddatewithdraw', base_url + 'FDWDWUnCommitAction.do', loadMultiLang(props, '36340FDW-000017')/* 国际化处理： 收回成功！*/ , FixedWithDrawConst.dataSource, this.toggleShow.bind(this),null,extParam);
            break;
        case 'File':
          fileMgr.call(this, props);
          break; 
        // 联查审批意见
        case 'AppRoveIdea':
          let approveData = this.props.form.getAllFormValue(formId);
          let apprpk =approveData.rows[0].values['pk_fixeddatewithdraw'].value;
          this.setState({ 
              showApproveDetail: true,
              billID: apprpk
          });
          break;
        // 联查支取申请
        case 'linkApplyBill':
            let linkapply_Data = this.props.form.getAllFormValue(formId);
            let pk_srcbill =linkapply_Data.rows[0].values['pk_srcbill'].value;
            if(!pk_srcbill){
                toast({
                  color: 'warning',
                  content: loadMultiLang(this.props, '36340FDW-000034')
                });
                return;
            }else {
              this.props.openTo('/ifac/ifacmemberbusdeal/fixeddatewithdrawapply/main/index.html#/card', 
              {
                srcFunCode:'36340FDWA',
                appcode: '36340FDWA',
                pagecode: '36340FDWA_C01',
                status: 'browse',
                islinkquery: true,
                id:pk_srcbill,
                scene: "linksce"
              });
            }
            break;
        // 联查存单
        case 'LinkDepositBill':
          let linkData = this.props.form.getAllFormValue(formId);
          let depositcode =linkData.rows[0].values['pk_depositreceipt'].value;
          if(!depositcode){
            toast({
              color: 'warning',
              content: loadMultiLang(this.props, '36340FDW-000012') //{/* 国际化处理： 未查询出符合条件的数据！*/}
            });
          } else {
            this.props.openTo('/ifac/ifactimedepositmange/depositreceipt/main/index.html#/card', 
            {
              srcFunCode:'36340RFD',
              appcode: '36340FDLB',
              pagecode: '36340FDLB_C01',
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
            let voucherflag=voucherData.rows[0].values['voucherflag'].value;
            let billtype='36L2';
            if(!voucherflag){
              toast({color:"warning",content:loadMultiLang(this.props, '36340FDW-000039')}) 
              return;
            }
            linkVoucherApp.call(this,props,pk_fixeddatewithdraw,pk_groupv,pk_orgv,billtype,billnov);
            break;
        case 'queryIntList':// 联查单位内部利息清单,待利息清单完成之后，做适配
            let link_Data = this.props.form.getAllFormValue(formId);
            let pk_fixeddatewithdraw_1=link_Data.rows[0].values[pkname].value;
            interlistLink.call(this,this.props,pk_fixeddatewithdraw_1);
            break;
        case 'Printbtn':
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
          
          //头部 生成下拨单
        case 'toAllocate':
          let formdata = this.props.form.getAllFormValue(formId);
          let sourceid = formdata.rows[0].values['pk_fixeddatewithdraw'].value;//来源主键'
          
          if(!sourceid){
            toast({
              color: 'warning',
              content:loadMultiLang(this.props, '36340FDW-000012') //{/* 国际化处理： 未查询出符合条件的数据！*/}
            });
            return;
          } 
          ajax({
            url: `/nccloud/ifac/fixeddatewithdraw/FDWToAllocateCheck.do`,
            data: {
                "pks": [sourceid],
             },
            success: (res) => {
                if (res.success) {
                this.props.openTo('/sf/allocation/allocate/main/index.html#/card', 
                    {
                        srcFunCode:'36320FA',
                        appcode: '36320FA',
                        pagecode: '36320FA_C01',                   
                        status: 'add',
                        sourceid:sourceid
                    });
                  }
                }
            });
        break;
        // 联查下拨单
        case 'LinkAllocate':
          let linkData2 = this.props.form.getAllFormValue(formId);
          let pk_fixeddatewithdraw_2 = linkData2.rows[0].values['pk_fixeddatewithdraw'].value;//来源主键'
          if(!pk_fixeddatewithdraw_2){
            toast({
              color: 'warning',
              content: loadMultiLang(this.props, '36340FDW-000012') //{/* 国际化处理： 未查询出符合条件的数据！*/}
            });
          } 
          ajax({
            url: `/nccloud/ifac/fixeddatewithdraw/LinkAllocateAction.do`,
            data: {
                "pk": pk_fixeddatewithdraw_2,
                },
            success: (res) => {
                if (res.success) {
                  if(res.data!=null){
                    this.props.openTo('/sf/allocation/allocate/main/index.html#/card', 
                        {
                        srcFunCode:'36320FA',
                        appcode: '36320FA',
                        pagecode: '36320FA_C01',       
                        status: 'browse',
                        islinkquery: true,
                        id:res.data,
                        scene: "linksce"
                        });
                    }                  
                  }else{
                    toast({
                      color: 'warning',
                      content: loadMultiLang(this.props, '36340FDW-000012') //{/* 国际化处理： 未查询出符合条件的数据！*/}
                    });
                  }
            }
        });
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
          if(res.data){
              linkpath = '/ifac/ifacinterestdeal/centerinterestbill/main/#/card'
              props.openTo(linkpath, {
                  appcode: '36340FDIB',
                  pagecode: '36340FDIB_C01',
                  islinkquery: true,
                  status:'browse',
                  id:res.data,
              });
          }else{
              toast({
                  color: 'warning',
                  content: loadMultiLang(this.props, '36340FDW-000012'), //{/* 国际化处理： 未查询出符合条件的数据！*/}
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
      let nextId = getCurrentLastId(FixedWithDrawConst.dataSource);
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
  }
/**
 * 删除数据
 */
const delBill = function (props,record) {
  let pkMapTs = {};
  let pk = record.rows[0].values['pk_fixeddatewithdraw'].value;
  let ts = record.rows[0].values['ts'].value;
  pkMapTs[pk] = ts;
  ajax({
      url: base_url+'FDWDWDeleteaction.do',
      data: {
          pkMapTs,
          pageCode: pageCodeCard
      },
      success: (res) => { 
          if (res.success) {
              toast({ color: 'success', content: loadMultiLang(this.props, '36340FDW-000015') + loadMultiLang(this.props, '36340FDW-000022')});/* 国际化处理： 删除成功*/
              let nextId = getNextId(this.props, pk, FixedWithDrawConst.dataSource);
              deleteCacheData(this.props, pkname, pk, FixedWithDrawConst.dataSource);
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
  ajax({
    url: base_url + 'FDWDWCopyAction.do',
    data: {
        pk,
        pageCode: pageCodeCard
    },
    success: (res) => {
        if(res.data.head.userjson){
          let userjson = JSON.parse(res.data.head.userjson);
          let {retExtParam} =userjson;
          //设置组织本币列编辑性
          // processHeadOlcRateEditable(props, retExtParam);
          if (retExtParam.hasOwnProperty('bodyOlcRateEditable')) {
            //设置列得编辑性，flag=true是不可编辑，false是可编辑
            let flag = retExtParam['bodyOlcRateEditable'] == 'Y' ? false : true;
            props.form.setFormItemsDisabled(formId, {   olcrate: flag });
          }
          if (retExtParam.hasOwnProperty('bodyGlcRateEditable')) {
            //设置列得编辑性，flag=true是不可编辑，false是可编辑
            let flag = retExtParam['bodyGlcRateEditable'] == 'Y' ? false : true;
            props.form.setFormItemsDisabled(formId, {   glcrate: flag });
          }
          if (retExtParam.hasOwnProperty('bodyGllcRateEditable')) {
            //设置列得编辑性，flag=true是不可编辑，false是可编辑
            let flag = retExtParam['bodyGllcRateEditable'] == 'Y' ? false : true;
            props.form.setFormItemsDisabled(formId, {   gllcrate: flag });
          }
        }
        if (res.data.head) {
          this.props.form.setFormStatus(formId,'add');
          this.props.form.EmptyAllFormValue(formId);
          this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
          this.props.form.setFormItemsDisabled(formId, { 'pk_org': true});
          this.props.form.setFormItemsDisabled(formId, { 'pk_depositorg':false,'pk_depositreceipt':false,'pk_settleacc':false,'withdrawdate':false,'withdrawamount':false,'remark':false});
        }
        this.props.setUrlParam({
          status: 'copy'
        });
        this.toggleShow();

      }
})
}
/**
 * 提交指派
 * @param {*} props 
 * @param {*} data 
 */
const commitAssign = function (props, data) {
  if (!data) {
      return;
  }
  if (Array.isArray(data)) {
      data = data[0];
  }
  let { workflow } = data;
  //有指派信息，则指派，没有则重绘界面
  if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
      this.setState({ assignData: data, assignShow: data });
  } else {
      this.toggleShow()
  }
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
/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/