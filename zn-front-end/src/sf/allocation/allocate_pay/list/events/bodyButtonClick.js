/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/
import { createPage, ajax, base, toast,cardCache } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import { dataSource,app_id, base_url, PAYMODEL_COMBINEPAY,list_page_id, list_search_id, list_table_id, button_limit,SHOWMODEL_LIULAN,SHOWMODEL_BULU } from '../../cons/constant.js';
import { go2Card, listMultiOperator, listSingleOperator } from '../../../../pub/utils/SFButtonUtil';
import Sign from '../../../../../tmpub/pub/util/ca/index.js';
import { Z_DEFAULT_STRATEGY } from 'zlib';


export default async function bodyButtonClick(props, key, text, record, index) {   
    let isNetpay = false 
    switch (key) {      

        //表体 支付(校验)
        case 'pay_inner':
            doPay_inner.call(this, props,record,index);
            break;
        
        //支付确认
        case 'payinnerconfirm':        
            
            let payconfirm_pk =  record.pk_allocate_h.value;
            let payconfirm_ts = record.ts.value;
            let pkMapTs_doPayInnerConfirm = {}
            // let ismendinfofull = record.ismendinfofull.value;

            if (payconfirm_pk && payconfirm_ts) {
                pkMapTs_doPayInnerConfirm[payconfirm_pk] = payconfirm_ts;
            }
            let payBtnConfirmresult = await Sign({
                isSign: true,
                isKey: false,
                data: null,
                encryptVOClassName: null,
                primaryId:[record.pk_allocate_h.value]
            });
            if (payBtnConfirmresult.isStop) {
                return;
            }
        
            let data_payconfirm = {
                "pkMapTs":pkMapTs_doPayInnerConfirm,
                "operator":1,
                "pageid": list_page_id,
                "isCardOpt": false,
                'sign_strSrc':payBtnConfirmresult.data && payBtnConfirmresult.data.text,
                'signature':payBtnConfirmresult.data && payBtnConfirmresult.data.signText,
                'sing_sn':payBtnConfirmresult.data && payBtnConfirmresult.data.userjson,
                'pagecode' : list_page_id,
                'btncode' : "payinnerconfirm"
            };
            ajax({
                url: '/nccloud/sf/allocation/allocatepay.do',
                data: data_payconfirm,
                success: (res) => {
                    if (res.success) {
                        if(data.errorMsg){
                            toast({ color: 'warning', content: data.errorMsg });
                        }
                        if(res.data.successMsg){
                            toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000017') });/* 国际化处理： 支付成功*/
                        }
                        if (res.data.grid) {
                            props.table.updateDataByIndexs(list_table_id, [{index: index, data: { values: data.grid[list_table_id].rows[0].values }}]);
                        }
                    }
                }
            });
            break;

        //合并支付（网银补录）
        case 'mergepay_inner':
            doNetpayBL.call(this,props,record,true,index)
            break;

        //合并支付(校验)
        case "mergepay_inner_check":
            doMergepayInner.call(this,props,record,true,index)
            break

        //合并支付确认
        case "mergepayConfirm":            
            let pk_allocate_mergepayconfirm = record.pk_allocate_h.value;
            let ts_mergepayconfirm = record.ts.value;

            let mergepayconfirmresult = await Sign({
                isSign: true,
                isKey: false,
                data: null,
                encryptVOClassName: null,
                primaryId:[pk_allocate_mergepayconfirm]
            });
            if (mergepayconfirmresult.isStop) {
                return;
            }        

            let data_mergepayconfirm = {
                "pk": pk_allocate_mergepayconfirm,
                "ts": ts_mergepayconfirm,
                "pageid": list_page_id,
                'isCardOpt': false,
                "operator": 1,
                'sign_strSrc':mergepayconfirmresult.data && mergepayconfirmresult.data.text,
                'signature':mergepayconfirmresult.data && mergepayconfirmresult.data.signText,
                'sing_sn':mergepayconfirmresult.data && mergepayconfirmresult.data.userjson,
            };
        
            ajax({
                url: '/nccloud/sf/allocation/allocatemergepay.do',
                data: data_mergepayconfirm,
                success: (res) => {
                    if (res.success) {
                        if(res.data){
                            toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDAPay") && this.props.MutiInit.getIntl("36320FDAPay").get('36320FDAPay--000013') });/* 国际化处理： 支付成功*/
                        }                        
                    }
                    if (res.data.grid) {
                        props.table.updateDataByIndexs(list_table_id, [{index: index, data: { values: data.grid[list_table_id].rows[0].values }}]);
                    }
                }
            });
            break

        //取消支付
        case 'paycancel_inner':
            doPayCancel.call(this,props,record,index)
            break;      

        //网银补录
        case 'netpayBL':
            doNetpayBL.call(this,props,record,false,index)
            break;
        
        //网银浏览
        case 'netpayLL':
            doNetpayLL.call(this,props,record)
            break;

        //审批详情
        case 'approveDetail':
            doApproveDetail.call(this,props,record)
            break;

        //制证
        case 'accreditation_inner':
            doAccreditation.call(this,props,record,index)
            break;

        //取消制证
        case 'accreditationCancel_inner':
            doAccreditationCancel.call(this,props,record,index)
            break;

            // 支付状态
        case "paystatus":
            doPayStatus.call(this,props);      
            break;

        default:
            break;
    }
}


/**
 * 表体合并支付(校验后)
 * @param {*} props 
 * @param {*} record 
 */
const doMergepayInner = async function(props,record,isNetpay,index){
    let pk_allocate_mergepay = record.pk_allocate_h.value;
    let ts_mergepay = record.ts.value;

    let mergepayresult = await Sign({
        isSign: true,
        isKey: isNetpay,
        data: null,
        encryptVOClassName: null,
        primaryId:[pk_allocate_mergepay]
    });
    if (mergepayresult.isStop) {
        return;
    }


    let data_mergepay = {
        "pk": pk_allocate_mergepay,
        "ts": ts_mergepay,
        "pageid": list_page_id,
        'isCardOpt': false,
        'sign_strSrc':mergepayresult.data && mergepayresult.data.text,
        'signature':mergepayresult.data && mergepayresult.data.signText,
        'sing_sn':mergepayresult.data && mergepayresult.data.userjson,
    };

    ajax({
        url: '/nccloud/sf/allocation/allocatemergepay.do',
        data: data_mergepay,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if(data.errorMsg){
                    toast({ color: 'warning', content: data.errorMsg });
                }
                else if(data.interactMsg){
                    props.modal.show('payModel',{
                        title: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000018'),/* 国际化处理： 支付*/
                        content: data.interactMsg,
                        //点击确定按钮事件
                        beSureBtnClick: bodyButtonClick.bind(this, props ,'mergepayConfirm'),
                    });
                }               
                else if(data.successMsg){
                    toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000017') });/* 国际化处理： 支付成功*/
                }
                if (res.data.grid) {
                    props.table.updateDataByIndexs(list_table_id, [{index: index, data: { values: data.grid[list_table_id].rows[0].values }}]);
                }             
            }
        }
    });

}


/**
 * 表体行支付（校验后）
 * @param  props 
 */
const doPay_inner = async function(props,record,index){
    let pk_allocate_pay =  record.pk_allocate_h.value;        
      
      let ts_pay = record.ts.value;
      let pkMapTs_doPay_inner = {}
      let ismendinfofull = record.ismendinfofull.value;

      if (pk_allocate_pay && ts_pay) {
        pkMapTs_doPay_inner[pk_allocate_pay] = ts_pay;
      }
      
      
	let needCa = cardCache.getDefData('ismendinfofull', dataSource);
    if(needCa){
        ismendinfofull = true
    }

      let payresult = await Sign({
        isSign: true,
        isKey: ismendinfofull,
        data: null,
        encryptVOClassName: null,
        primaryId:[pk_allocate_pay]
      });
      if (payresult.isStop) {
        return;
      }    

      let data_pay = {
          "pkMapTs":pkMapTs_doPay_inner,
          "pageid": list_page_id,
          'isCardOpt': false,   
          'sign_strSrc':payresult.data && payresult.data.text,
          'signature':payresult.data && payresult.data.signText,
          'sing_sn':payresult.data && payresult.data.userjson,
          'pagecode' : list_page_id,
          'btncode' : "pay_inner"
      };
    
      ajax({
          url: '/nccloud/sf/allocation/allocatepay.do',
          data: data_pay,
          success: (res) => {
              let { success, data } = res;
              if (success) {
                if(data.errorMsg){
                    toast({ color: 'warning', content: data.errorMsg });
                }
                else if(data.interactMsg){
                    props.modal.show('payModel',{
                        title: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000018'),/* 国际化处理： 支付*/
                        content: data.interactMsg,
                        //点击确定按钮事件
                        beSureBtnClick: buttonClick.bind(this, props ,'payinnerconfirm'),
                      });
                }
                else if(data.successMsg){
                    toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000017') });/* 国际化处理： 支付成功*/
                }
                if (res.data.grid) {
                    props.table.updateDataByIndexs(list_table_id, [{index: index, data: { values: data.grid[list_table_id].rows[0].values }}]);
                }                      
              }
          }
      });
}


/**
 * 取消支付
 * @param {*} props 
 * @param {*} record 
 */
const doPayCancel = function(props,record,index){
//添加选中数据的映射集合
let pkMapTs_paycancel = {};
let pk_allocate_paycancel = record.pk_allocate_h.value;
let ts_paycancel = record.ts.value;
pkMapTs_paycancel[pk_allocate_paycancel] = ts_paycancel;

ajax({
    url: "/nccloud/sf/allocation/allocateunpay.do",
    data: { 
        pkMapTs:pkMapTs_paycancel,
        pageid: list_page_id,
        isCardOpt: false,
        pagecode : list_page_id,
        btncode : "paycancel_inner"
    },
    success: (res) => {      
        let { success, data } = res;
        if (success) {
            if(data.successMsg){
                toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000020') });/* 国际化处理： 取消支付成功*/
            }else if(data.errorMsg){
                toast({ color: 'warning', content: data.errorMsg });
            }   
            if (res.data.grid) {
                props.table.updateDataByIndexs(list_table_id, [{index: index, data: { values: data.grid[list_table_id].rows[0].values }}]);
            }                
        }
    }
    });
}


/**
 * 网银补录
 * @param {*} props 
 * @param {*} record 
 */
const doNetpayBL = function(props,record,isMergepayBulubody,index){
          
    let pk_allocate_e_bank = record.pk_allocate_h.value;
    let ts_e_bank = record.ts.value;
    let data_e_bank;


    //合并支付的时候 网银补录要合并
    if(isMergepayBulubody){
        data_e_bank = {
            "pk": pk_allocate_e_bank,
            "ts": ts_e_bank,
            "pageid": list_page_id,
            "ismergepay":true
        };
        this.ismergepay=true;
        this.setState({
            modelType:PAYMODEL_COMBINEPAY
        })
    }else{
        data_e_bank = {
            "pk": pk_allocate_e_bank,
            "ts": ts_e_bank,
            "pageid": list_page_id,
            "ismergepay":false
        };
        this.ismergepay=false;
        this.setState({
            modelType: SHOWMODEL_BULU,
        })
    }


    ajax({
        url: '/nccloud/sf/allocation/allocatenetbankrewrite.do',
        data: data_e_bank,
        success: (res) => {
            if (res && res.data) {
            this.setState(
                {
                fromBodyOrHead:false,
                index:index,
                record:record,
                isMergepayBulubody:isMergepayBulubody,
                billId:pk_allocate_e_bank,
                billts:ts_e_bank,
                onLineData: res.data || [],
                }, () => {
                this.setState({ showBuLu: true });
                });
            }
        }
    });           
}

/**
 * 网银浏览
 * @param {*} props 
 * @param {*} record 
 */
const doNetpayLL = function(props,record){
    let pk_allocate_e_bank_browse = record.pk_allocate_h.value;
    let ts_e_bank_browse = record.ts.value;
    let data_e_bank_browse = {
        "pk": pk_allocate_e_bank_browse,
        "ts": ts_e_bank_browse,
        "pageid": list_page_id
    };
    ajax({
        url: '/nccloud/sf/allocation/allocatenetbankbrowse.do',
        data: data_e_bank_browse,
        success: (res) => {
            if (res && res.data) {            
            this.setState(
                {
                billId:pk_allocate_e_bank_browse,
                billts:ts_e_bank_browse,
                onLineData: res.data || [],
                modelType: SHOWMODEL_LIULAN
                }, () => {
                this.setState({ showBuLu: true });
                });
            }
        }
    });           
}

/**
 * 审批详情
 * @param {*} props 
 * @param {*} record 
 */
const doApproveDetail = function(props,record){
    let billid = record.pk_allocate_h.value
    let billtype = record.pk_billtype.value    
      this.setState({          
          show: !this.state.show,
          billid:billid,
          billtype:billtype,
      });
}

/**
 * 制证
 * @param {*} props 
 * @param {*} record 
 */
const doAccreditation = function(props,record,index){
    listSingleOperator(props, list_page_id, list_table_id, base_url + 'make.do', record,'pk_allocate_h',index,this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000050'), dataSource
    ,true,{btncode: 'accreditation_inner', pagecode: list_page_id });/* 国际化处理： 制证成功！*/
}

/**
 * 取消制证
 * @param {*} props 
 * @param {*} record 
 */
const doAccreditationCancel = function(props,record,index){
    listSingleOperator(props, list_page_id, list_table_id, base_url + 'unmake.do', record,'pk_allocate_h',index,this.props.MutiInit.getIntl("36320FA_PAY") && this.props.MutiInit.getIntl("36320FA_PAY").get('36320FA_PAY-000051'), dataSource
    ,true,{btncode: 'accreditationCancel_inner', pagecode: list_page_id });/* 国际化处理： 取消制证成功！*/
}

/**
 * 支付状态
 * @param  props 
 */
const doPayStatus = function(props){
    let paystatus_pk = record.pk_allocate_h.value;
    // let paystatus_selectrows = props.cardTable.getAllRows(card_table_id)
    let paystaus_ts = record.ts.value;
    let paystatus_pkbs = []
    
    paystatus_selectrows.forEach((val) => {
      //子表主键数组
      paystatus_pkbs.push(val.values.pk_allocate_b.value);
    });
  
    // cardOperator(props, card_page_id, card_from_id,[card_table_id] ,'pk_allocate_h', base_url + 'allocatequerypaystatus.do', '获取支付状态成功！', dataSource ,this.toggleShow.bind(this));
  
    let paystatus_data = {
      pk:paystatus_pk && paystatus_pk.value,
      ts:paystaus_ts && paystaus_ts.value,
      pageid:card_page_id,
      isCardOpt:true,
    //   pkbs:paystatus_pkbs
    }
  
    ajax({
      url: '/nccloud/sf/allocation/allocatequerypaystatus.do',
      data: paystatus_data,
      success: (res) => {
        if (res.success) {
          if(res.data){
            toast({ color: 'success', content:'获取支付状态成功'})
              
          }
          // doRefresh.call(this,props)
        }
      }
    });
  }
/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/