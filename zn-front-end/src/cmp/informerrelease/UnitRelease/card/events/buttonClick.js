/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, cacheTools, print, output } from 'nc-lightapp-front';
let { NCMessage } = base;
import { tableId, table_orgs, pagecode, formId_org, formId_01, formId_02 ,nodekey} from '../constants';
import { queryBills } from './queryBills';

export default function (props, id) {
    let pks = [];
    let ptintpks = [];
    let data;
    switch (id) {
        /**
         *  【list_head】【向下级发布】
         */
        case 'Subpublish':

            let tempselectedData = props.table.getCheckedRows(tableId);
            if (tempselectedData.length == 0) {                
                toast({ color: 'warning', title: props.MutiInit.getIntl("36070AIPSC") && props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000012')/*'请选择数据！'*/ });
                return;
            }
            else {
                props.form.setFormStatus(formId_org, "edit");
                props.form.EmptyAllFormValue(formId_org);
                props.table.setAllTableData(table_orgs, { rows: [] });
                this.open_publish();
            }
            break;
        /**
         * 【弹窗】【向下级发布】【确认】
         */
        case 'commitpublish':
            let orgs = props.form.getFormItemsValue(formId_org, 'pk_org').value;
            let pk_releaseinformer = props.form.getFormItemsValue(formId_01, 'pk').value;
            if (!orgs) {                
                toast({ color: 'warning', title: props.MutiInit.getIntl("36070AIPSC") && props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000013')/*'请选择下级单位！'*/ });
                return;
            }
            let pk_orgs = orgs.split(",");
            const tempselectedData1 = props.table.getCheckedRows(tableId);
            if (tempselectedData1.length == 0) {
                if (pk_releaseinformer) {
                    pks.push(pk_releaseinformer);
                } else {                    
                    toast({ color: 'warning', title: props.MutiInit.getIntl("36070AIPSC") && props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000014')/*'请选择数据！'*/ });
                    return;
                }
            } else {
                tempselectedData1.forEach((vale) => {
                    let pk;
                    pk = vale.data.values.pk_informerrelease.value;
                    pks.push(pk);
                });

            }
            data = {
                pks: pks,
                pk_orgs
            };
            let that = this;
            ajax({
                url: '/nccloud/cmp/release/publish.do',
                data,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        //刷新
                        that.close_publish();
                        that.getdata();
                        toast({ content: props.MutiInit.getIntl("36070AIPSC") && props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000015')/*"发布成功"*/, color: 'success' });
                    }
                }
            });
            break;
        /**
         * 【弹窗】认领
         */
        case 'confirmgenerate':
            data = getGenerateData(props);
            let flag = props.form.getFormItemsValue(formId_01, 'index').value;
            let ly_money = props.form.getFormItemsValue(formId_02, 'ly_money').value;
            if (ly_money <= 0) {                
                toast({ color: 'warning', title: props.MutiInit.getIntl("36070AIPSC") && props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000016')/*'认领金额必须是正数！'*/ });
                return;
            }
            let url;
            if (flag == 'claim') {
                url = '/nccloud/cmp/release/claim.do';
            } else if (flag == 'reclaim') {
                url = '/nccloud/cmp/release/reclaim.do';
            }
            ajax({
                url: url,
                data,
                success: (res) => {
                    //刷新
                    this.getdata();
                    if (res.data) {
                        toast({ color: 'warning', title: res.data });
                    } else {
                        toast({ content: props.MutiInit.getIntl("36070AIPSC") && props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000017')/*"认领成功"*/, color: 'success' });
                    }
                    this.close_capital_01();
                }
            });
            break;
        /**
         * 【弹窗】【向下级发布】【关闭】
         */
        case 'close_publish':
            this.close_publish();
            break;
        /**
         *  【弹窗】【认领】【关闭】
         */
        case 'close_capital_01':
            this.close_capital_01();
            break;
        /**
         * 联查单据
         */
        case 'querybills':
            queryBills(props);
            break;
        /**
        * 【card-head】取消认领
        */
        case 'Cancelclaim':
            debugger;
            let cancelclaimData = props.table.getCheckedRows(tableId);
            if (cancelclaimData.length == 0) {                
                toast({ color: 'warning', title: props.MutiInit.getIntl("36070AIPSC") && props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000018')/*'请选择数据！'*/ });
                return; 
            } else {
                cancelclaimData.forEach((vale) => {
                    let pk;
                    pk = vale.data.values.pk_informerrelease.value;
                    pks.push(pk);
                });
            }
            ajax({
                url: '/nccloud/cmp/informer/cardunclaim.do',
                data: {
                    pks: pks,
                    pageid: null
                },
                success: (res) => {
                    if (res.data.errormessage&&res.data.failNum>0) {
                        this.getdata();
                        toast({ color: 'warning', title: res.data.errormessage});
                    } else {
                        this.getdata()
                        toast({ content: props.MutiInit.getIntl("36070AIPSC") && props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000019')/*"取消认领成功"*/, color: 'success' });
                    }
                }
            });
            break;
        /**
        * 打印
        */
        case 'Print':
            let printdata = props.table.getAllTableData(tableId).rows;
            printdata.forEach((vale) => {
                let pk;
                pk = vale.values.pk_informerrelease.value;
                ptintpks.push(pk);
            });
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                '/nccloud/cmp/pub/print.do',
                {
                    appcode: '36070AIPSC',
                    oids: ptintpks,
                    nodekey:nodekey,
                    userjson: 'nccloud.pub.cmp.informer.print.datasource.ReleasePrintDataSource'
                }
            ); 
            break;
        case 'printout':
            let outdata = props.table.getAllTableData(tableId).rows;
            outdata.forEach((vale) => {
                let pk;
                pk = vale.values.pk_informerrelease.value;
                ptintpks.push(pk);
            });
            output({
                url: '/nccloud/cmp/pub/print.do',
                data: {
                    appcode: '36070AIPSC',
                    oids: ptintpks,
                    outputType: 'output',
                    nodekey:nodekey,
                    userjson: 'nccloud.pub.cmp.informer.print.datasource.ReleasePrintDataSource'
                }
            });
            break;
        //刷新
        case 'refresh':
            this.getdata();
            break;
    }

}

/**
 * 得到认领补录数据
 * @param {*} props 
 */
function getGenerateData(props) {
    let pks = [];
    let temppk = props.form.getFormItemsValue(formId_01, 'pk').value;
    let recordinfo = props.form.getAllFormValue(formId_02);
    let iapass = props.form.isCheckNow(formId_02);
    //let geneData = props.table.getCheckedRows(tableId);
    if (!iapass) {
        return;
    }
    if (temppk) {
        let pk;
        pk = temppk;
        pks.push(pk);
    }
    let type;
    let geneinfo = {
        type: null,
        pks: pks,
    };
    let data = {
        geneinfo: geneinfo,
        recordinfo: recordinfo
    };
    data.pageid = '36070AIP_L01';
    return data;
}


/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/