/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, toast, print, output,} from 'nc-lightapp-front';
import * as CONSTANTS from '../../cons/constant';
import {loadMultiLang} from "../../../../../tmpub/pub/util/index";
import { linkVoucherApp} from '../../../../../tmpub/pub/util/LinkUtil'; //凭证
let {base_url, app_code, nodekey, formId} = CONSTANTS;
export default function (props, key) {
    switch (key) {
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
            let pk=link_Data.rows[0].values['pk_fixeddatewithdraw'].value;
            interlistLink.call(this,this.props,pk);
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
      url: '/nccloud/ifac/fixeddatewithdraw/checkdemandintlistaction.do',  
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