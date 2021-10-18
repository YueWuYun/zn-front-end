/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, base, toast, print, output } from 'nc-lightapp-front';
import { app_code } from '../../cons/constant.js';
import { requesturl } from '../../cons/requesturl.js';
export default function (props, id) {
  let that = this;
  switch (id) {
    //联查回单
    case 'LinkReceipt':
      let account_no = props.form.getFormItemsValue('head', 'account_no').value;
      let pk_banktype = props.form.getFormItemsValue('head', 'pk_banktype').value;
      if (pk_banktype != '0001Z01000000000036R') {
        toast({ color: "warning", content: that.state.json['36340AIAC-000052'] })/* 国际化处理： 银行账户不存在回单*/
        break;
      }

      if (account_no === null || account_no == '' || account_no === undefined) {
        toast({ color: "warning", content: that.state.json['36340AIAC-000008'] })/* 国际化处理： 暂无数据*/
        break;
      }

      let pk_applybill333 = props.form.getFormItemsValue('head', 'pk_applybill').value;

      let linkreceipt={
        otherInfo : {'account_no' : account_no}
      }
      
      ajax({
          url: requesturl.linkreceiptaction, 
          data: linkreceipt,
          success: (res) => {
              if(res.data){
                  props.openTo('/tam/tam/openreceipt/main/#/linkq', {
                    appcode: '36050OAN',
                    pagecode: '36050OAN_linkq',
                    status: 'browse',
                    islinkquery: true,
                    id:res.data
                });
              }else{
                 
              }
          }

      });

      break;
    //联查银行账户
    case 'lsswapper':
      let isswapper_account_no = props.form.getFormItemsValue('head', 'account_no').value;
      let busistatusbank = props.form.getFormItemsValue('head', 'busistatus').value;
      if (isswapper_account_no === null || isswapper_account_no == '' || isswapper_account_no === undefined) {
        toast({ color: "warning", content: that.state.json['36340AIAC-000008'] })/* 国际化处理： 暂无数据*/
        break;
      }

      let linkdata = {
        otherInfo: { 'account_no': isswapper_account_no }
      }

      ajax({
        url: requesturl.linkbankacc,
        data: linkdata,
        success: (res) => {
          if (res.data) {
            props.openTo('/uapbd/sminfo/bankAccount_grp/router/#/card', { //集团账户
              // /nccloud/resources/uapbd/sminfo/bankAccount_grp/router/#/card
              appcode: '10140BACCG',
              pagecode: '10140BACCG_baseInfo_card',
              status: 'browse',
              cid: isswapper_account_no,
              reqfrom: 'tam'
              // src: '0001Z61000000001PJBL_LinkVouchar'
            });
          } else {
            props.openTo('/uapbd/sminfo/bankAccount_forg/router/#/card', { //财务组织
              // /nccloud/resources/uapbd/sminfo/bankAccount_grp/router/#/card
              appcode: '10140BACCO',
              pagecode: '10140BACCO_baseInfo_card',
              status: 'browse',
              cid: isswapper_account_no,
              reqfrom: 'tam'
              // src: '0001Z61000000001PJBL_LinkVouchar'
            });
          }
        }
      });
      break;

    //联查审批详情
    case 'approvedetail':
      this.setState(
        {
          billid: props.form.getFormItemsValue('head', 'pk_applybill').value,//单据pk
          billtype: props.form.getFormItemsValue('head', 'vbilltype').value,
        },
        () => {
          this.setState({
            showAppr: true
          });
        }
      );
      break;

    case 'approveBtn': // 审批
      let datas = {
        billID: this.props.form.getFormItemsValue(this.formId, 'crevecontid').value,
        vtranTypeCode: this.props.form.getFormItemsValue(this.formId, 'vtrantypecode').value
      }
      ajax({
        url: '/nccloud/cplatform/approve/queryhistory.do',
        data: datas,
        success: (res) => {
          if (res.data) {
            this.setState(
              {
                ApproveDetails: res.data
              },
              () => {
                props.modal.show('approve')
              }
            )
          }
        }
      })
      break
    case 'cancelApproveBtn': // 取消审批
      this.approve('UNAPPROVE')
      break
    case 'Cancel':
      if ((props.getUrlParam('status') === 'edit')) {
        // 表单返回上一次的值
        props.form.cancel(this.formId)
        props.linkTo('/tam/openaccount/accountapply/card/index.html', {
          status: 'browse',
          id: props.getUrlParam('id')
        });
        this.refresh()
      }
      //保存中的取消操作
      if (props.getUrlParam('status') === 'add') {
        props.linkTo('/tam/openaccount/accountapply/list/index.html');
      }
      if (props.getUrlParam('status') === 'copy') {
        props.linkTo('/tam/openaccount/accountapply/list/index.html');
      }
      break;
    case 'Refresh':
      this.refresh();
      break;
    case 'Print':
      print(
        'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        requesturl.print,
        {
          //billtype:bill_type,  //单据类型
          //funcode:fun_code, //功能节点编码，即模板编码
          appcode: app_code,
          // nodekey:node_key,     //模板节点标识
          nodekey: null,
          //printTemplateID:printTemplate_ID, //模板id
          oids: [props.form.getFormItemsValue(that.formId, 'pk_applybill').value]
        }
      );
      break;
    //输出
    case 'Output':
      that.refs.printOutput.open();
      that.setState(
        {
          outputData: {
            appcode: app_code,
            //funcode: fun_code, //功能节点编码，即模板编码
            nodekey: null, //模板节点标识
            //printTemplateID: printTemplate_ID, //模板id
            outputType: 'output',
            oids: [props.form.getFormItemsValue(formId, 'pk_applybill').value]
          }
        },
        () => {
          that.refs.printOutput.open();
        }
      );
      break;

    case 'File':
      let pk_applybill = props.form.getFormItemsValue(this.formId, 'pk_applybill').value;
      let vbillno = props.form.getFormItemsValue(this.formId, 'vbillno').value;
      this.setState({
        showUploader: !this.state.showUploader,
        billID: pk_applybill,
        billNO: vbillno,
        target: null,
      });
      break;
    default:
      break
  }
}

/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/