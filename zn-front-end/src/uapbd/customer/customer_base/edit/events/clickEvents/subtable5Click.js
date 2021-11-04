//5joAyM6RNaC1SjsLZORgA7pPwZN5dHIcHHtiMSmy3MHIgoe+2yl/QMk4SUUvvEoO
import {ajax, base, toast, print, output} from 'nc-lightapp-front';
import CustAddress from '../../../custAddress/index';
import confirmUtils from '../../../../../public/pubComponent/confirmUtil/confirmUtil';

const ajaxurl = {
    'subgridaction': '/nccloud/uapbd/custsubinfo/subGridAction.do',
    'subgridDel': '/nccloud/uapbd/custsubinfo/deletesublistinfo.do',
    'subFormDel': '/nccloud/uapbd/custsubinfo/deletesubcardinfo.do'
};
/**
 *客户销售信息模态框和肩部按钮事件
 * @param record
 * @param index
 * @param props
 * @param key
 */
export default function (areaFlag, props, id) {
    let reqParam;
    let checkedRocord;
    let editStatusBtns = ['subG5ModalSave', 'subG5ModalCancel'];
    let browseStatusBtns = ['subGrid5Edit', 'subGrid5Del', 'subGrid5Addr', 'subGrid5Ref', 'subGrid5Print'];
    let alldata;
    let pks = [];
    let formItemArr = props.form.getFormItemsValue(props.config.formId, ['pk_customer']);
    if (areaFlag === 'shoulder') {
        alldata = props.cardTable.getAllData(props.config.subGrid5);
        checkedRocord = props.cardTable.getCheckedRows(props.config.subGrid5);
    } else {
        alldata =props.form.getAllFormValue('custsalecustomerinfo');
        reqParam = props.form.getAllFormValue(props.config.custsaleForm);
    }
    switch (id) {
        case 'subGrid5Edit':
           this.setState({subGridStatus:false},()=>{
               let meta = props.meta.getMeta();
               let formitemvalues = props.form.getFormItemsValue(props.config.custsaleForm, ['pk_org', 'pk_group']);
               //销售信息专管业务员参照
               let resppersonitem = meta['custsalecard_1']['items'].find(item => item['attrcode'] === 'respperson');
               if (!!resppersonitem) {
                   resppersonitem.queryCondition = () => {
                       return {
                           busifuncode: 'sa',
                           pk_org: formitemvalues[0].value
                       }
                   }
               }
               //销售信息专管部门参照
               let respdeptitem =
                   meta['custsalecard_1']['items'].find(item => item['attrcode'] === 'respdept');
               if (!!respdeptitem) {
                   respdeptitem.queryCondition = () => {
                       return {
                           pk_org: formitemvalues[0].value,
                           pk_group: formitemvalues[1].value,
                           TreeRefActionExt: 'nccloud.web.uapbd.supplier.suprefcondition.action.RespDeptNCTreeRefSqlBuilder',
                       }
                   }
               }
               //销售信息客户销售分类参照
               let saleclassitem = meta['custsalecard_1']['items'].find(item => item['attrcode'] === 'pk_custsaleclass');
               if (!!saleclassitem) {
                   saleclassitem.queryCondition = () => {
                       return {
                           pk_org: formitemvalues[0].value
                       }
                   }
               }
               //交易类型参照
               let ordertypedefaultitems =
                   meta['custsalecard_1']['items'].find(item => item['attrcode'] === 'ordertypedefault');
               if (!!ordertypedefaultitems) {
                   ordertypedefaultitems.queryCondition = () => {
                       return {
                           GridRefActionExt: 'nccloud.web.uapbd.customer.baseinfo.extendRef.TransactionTypeExtendsRef',
                       }
                   }
               }
               //付款客户，开票客户，收货客户 添加参照过滤条件
               meta['custsalecard_1']['items'].map((obj) => {
                   if (obj.attrcode === 'billingcust' || obj.attrcode === 'issuecust' || obj.attrcode === 'pk_paycust') {
                       obj.queryCondition = () => {
                           return {
                               pk_org: formitemvalues[0].value,
                           }
                       }
                   }
               })
               //收款协议参照
               let incomeGridItem =
                   meta['custsalecard_1']['items'].find(item => item['attrcode'] === 'paytermdefault');
               if (!!incomeGridItem) {
                   incomeGridItem.queryCondition = () => {
                       return {
                           pk_org: formitemvalues[0].value,
                       }
                   }
               }
               props.form.setFormStatus(props.config.custsaleForm, 'edit');
               props.button.setButtonVisible(browseStatusBtns, false);
               props.button.setButtonVisible(editStatusBtns, true);
               props.meta.setMeta(meta, () => {
               });
           });
            break;
        case 'subGrid5Del':
            //删除
            let reqData;
            let url;
            if (areaFlag === 'shoulder') {
                //肩部按钮删除

                let checkedarr = [];
                if(checkedRocord.length!==0){
                    checkedRocord.map((r)=>{
                        checkedarr.push(r.data);
                    });
                }
                reqData = {
                    pageid: props.config.pagecode,
                    model: {
                        areacode: props.config.subGrid5,
                        rows: checkedarr
                    }
                }
                url = ajaxurl.subgridDel;
            } else {
                //模态框按钮删除
                reqParam = props.form.getAllFormValue(props.config.custsaleForm);
                reqParam.areacode = props.config.custsaleForm;
                reqData = {
                    pageid: props.config.custsaleForm,
                    model: reqParam
                }
                url = ajaxurl.subFormDel;
            }
            confirmUtils.call(this,{
                title: this.state.json['10140CUST-000034'], /* 国际化处理： 确认删除*/
                content: this.state.json['10140CUST-000041'], /* 国际化处理： 确认删除所选数据？*/
                beSureBtnClick: () => {
                    ajax({
                        url: url,
                        data: reqData,
                        success: (res) => {
                            let {success, data} = res;
                            if (success) {
                                if (data) {
                                    if (data.hasOwnProperty('message') && data.message) {
                                        toast({'color': 'danger', 'content': data.message});
                                    } else {
                                        toast({'color': 'success', 'content': this.state.json['10140CUST-000046']});
                                        /* 国际化处理： 操作成功！*/
                                        props.modal.close('custSaleModal');
                                        this.loadSubGridData(
                                            'shoulder',
                                            props.config.subGrid5,
                                            props.config.custsaleForm,
                                            props.config.pagecode,
                                            'querySubFormOrGrid',
                                            editStatusBtns,
                                            browseStatusBtns,
                                            formItemArr[0].value
                                        );
                                    }
                                }
                            }
                        }
                    });
                }
            });
            break;
        case 'subGrid5Ref':
            //刷新
            this.loadSubGridData(
                areaFlag,
                props.config.subGrid5,
                props.config.custsaleForm,
                props.config.pagecode,
                'querySubFormOrGrid',
                editStatusBtns,
                browseStatusBtns,
                areaFlag === 'shoulder' ? formItemArr[0].value : reqParam['rows'][0]['values']['pk_custsale'].value, () => {
                    toast({
                        color: 'success',
                        title: this.state.json['10140CUST-000066']/* 国际化处理： 刷新成功！*/
                    });
                }
            );
            break;
        case 'subGrid5Addr':
            //地址簿
            props.modal.show('custAddress', {
                noFooter: true,
                title: this.state.json['10140CUST-000080'], /* 国际化处理： 客户收货地址*/
                size: 'lg',
                content: <CustAddress {...props} {...{
                    currentOrg: this.state.currentOrg,
                    currentCustPk: formItemArr[0].value,
                    json: this.state.json,
                    pk_saleorg:reqParam['rows'][0]['values']['pk_org'].value,
                    actionName:'subGrid5Addr'
                }}/>,
                userControl: true,
                closeModalEve: () => {
                    props.editTable.getStatus('custAddress') !== 'browse' && confirmUtils.call(this,{
                        title: this.state.json['10140CUST-000081'], /* 国际化处理： 确认关闭*/
                        content: this.state.json['10140CUST-000082'], /* 国际化处理： 是否确认关闭？*/
                        beSureBtnClick: () => {
                            props.editTable.setStatus('custAddress', 'browse');
                        }
                    });

                }
            });
            //地址簿
            break;
        case 'subGrid5Print':
        case 'subGrid5P':
            //打印
            areaFlag === 'shoulder' && alldata.rows.forEach((item, index) => {
                pks.push(item.values['pk_custsale']['value']);
            });
            areaFlag === 'modal' && alldata.rows.forEach((item, index) => {
                pks.push(item.values['pk_custsale']['value']);
            });
            pks.length >0 && print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                '/nccloud/uapbd/custsubinfo/salePrint.do',
                {
                    funcode: '10140CUB',      //功能节点编码，即模板编码
                    nodekey: areaFlag === 'shoulder' ? 'salelist' : 'salecard',
                    oids: areaFlag === 'shoulder' ? pks : [reqParam.rows[0].values.pk_custsale.value],
                    appcode: '10140CUB'
                }
            );
            break;
        case 'subGrid5O':
            //输出
            areaFlag === 'shoulder' && alldata.rows.forEach((item, index) => {
                pks.push(item.values['pk_custsale']['value']);
            });
            areaFlag === 'modal' && alldata.rows.forEach((item, index) => {
                pks.push(item.values['pk_custsale']['value']);
            });
            pks.length >0 && output({
                url: '/nccloud/uapbd/custsubinfo/salePrint.do',
                data: {
                    funcode: '10140CUB',
                    nodekey: areaFlag === 'shoulder' ? 'salelist' : 'salecard',
                    outputType: 'output',
                    oids: areaFlag === 'shoulder' ? pks : [reqParam.rows[0].values.pk_custsale.value]
                }
            });
            break;
        case 'subGrid5R':
            //预览
            break;
        case 'subG5ModalSave':
            this.SubModalSave(
                props.config.subGrid5,
                'custSaleModal',
                props.config.custsaleForm,
                editStatusBtns,
                browseStatusBtns
            );
            break;
        case 'subG5ModalCancel':
            confirmUtils.call(this,{
                title: this.state.json['10140CUST-000038'], /* 国际化处理： 确认取消*/
                content: this.state.json['10140CUST-000065'], /* 国际化处理： 是否确认取消？*/
                beSureBtnClick: () => {
                    this.setState({subGridStatus:true},()=>{
                        props.form.setFormStatus(props.config.custsaleForm, 'browse');
                        props.button.setButtonVisible(browseStatusBtns, true);
                        props.button.setButtonVisible(editStatusBtns, false);
                    });
                }

            });
            break;
        default:
            break;
    }
}

//5joAyM6RNaC1SjsLZORgA7pPwZN5dHIcHHtiMSmy3MHIgoe+2yl/QMk4SUUvvEoO