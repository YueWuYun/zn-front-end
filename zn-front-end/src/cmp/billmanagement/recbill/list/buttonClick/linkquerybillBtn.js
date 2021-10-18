/*NkiV9juwi3cve6/X1iRkvvGrpa+rP8NgIM/GVaC2uFiprjGCXJw3j1iu5HMrcy5L*/
import { toast } from 'nc-lightapp-front';
/**
 * [收款]-联查单据按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const linkquerybillBtn = function () {
    let linkquerybillData = this.props.table.getCheckedRows(this.tableId);
    //数据校验
    if (linkquerybillData.length != 1) {
        toast({
            color: 'warning',
            content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000082')/* 国际化处理： 请选择单条数据，联查单据!*/
        });
        return;
    }
    //处理选择数据
    let showbilltrackpk;
    let billtrack_billtype;
    let  pk_srcbilltypecode;
    linkquerybillData.forEach((val) => {

        if (val.data.values.pk_recbill && val.data.values.pk_recbill.value) {
            showbilltrackpk = val.data.values.pk_recbill.value;
            pk_srcbilltypecode=val.data.values.up_billtype.value;
        }
        if (val.data.values.bill_type && val.data.values.bill_type.value) {
            billtrack_billtype = val.data.values.bill_type.value;
        }


    });


    if (pk_srcbilltypecode && pk_srcbilltypecode == '36S3') {
        toast({
          color: 'warning',
          content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000131') });/* 国际化处理： 操作失败，无数据!*/
        return;
      };

    if (showbilltrackpk) {
        this.setState({
            showbilltrack: true,//显示联查单据
            showbilltracktype: billtrack_billtype,//单据类型
            showbilltrackpk: showbilltrackpk//单据pk
        });
    }
}

/*NkiV9juwi3cve6/X1iRkvvGrpa+rP8NgIM/GVaC2uFiprjGCXJw3j1iu5HMrcy5L*/