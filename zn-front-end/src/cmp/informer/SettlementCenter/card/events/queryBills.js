/*CA6HHPCstSLce6wciVhFe2Li9rlyYPbjEykXhtNCwHh+kIBNM/lqyU2ponLzGijs*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { tableId, pagecode } from '../constants';
let { NCMessage } = base;
/**
 * 联查单据
 * @param {*} props 
 */
export function queryBills(that, props) {
    let queryData = props.table.getCheckedRows(tableId);
    if (queryData.length == 0) {
        toast({ content: that.props.MutiInit.getIntl("36070AISC") && that.props.MutiInit.getIntl("36070AISC").get('36070AISC-000000'), color: 'warning' });/* 国际化处理： 请选择数据！*/
        return;
    } else {
        let pk;
        let type;
        let generateflag;
        let pkForAllocate;
        if (queryData.length > 1) {
            toast({ content: that.props.MutiInit.getIntl("36070AISC") && that.props.MutiInit.getIntl("36070AISC").get('36070AISC-000013'), color: 'warning' });/* 国际化处理： 联查时，请选择一条数据！*/
            return;
        }
        queryData.forEach((val) => {
            pk = val.data.values.pk_lower.value;
            type = val.data.values.lowerbilltype.value;
            generateflag = val.data.values.generateflag.value;
            pkForAllocate = val.data.values.pk_informer.value;
        });
        if (!(generateflag == 'hasgenerate')) {
            toast({ content: that.props.MutiInit.getIntl("36070AISC") && that.props.MutiInit.getIntl("36070AISC").get('36070AISC-000014'), color: 'warning' });/* 国际化处理： 只有状态为已生成时，才可以联查单据！*/
            return;
        }
        if (type == '36J5' || type == '36J7') {
            toast({ content: that.props.MutiInit.getIntl("36070AISC") && that.props.MutiInit.getIntl("36070AISC").get('36070AISC-000015'), color: 'warning' });/* 国际化处理： 委托收付款单，不支持联查单据！*/
            return;
        }
        //根据单据类型，获取联查单据小应用
        let data = {
            pk: pk,
            billtype: type
        }
        ajax({
            url: '/nccloud/cmp/informer/linkbill.do',
            data,
            success: (res) => {
                if (res.data) {
                    //资金下拨
                    if (type == '36K2') {
                        props.openTo(null, {
                            scene: 'linksce',
                            appcode: res.data.appCode,
                            pagecode: res.data.linkPageCode,
                            status: 'browse',
                            src: 'informer',
                            linkquerytype: '1',
                            srcbilltype: '36S3',
                            srcbillid: pkForAllocate,
                        });
                    }
                    //收款单、付款单
                    else if (type == 'F2' || type == 'F3') {
                        if (res.data) {
                            props.openTo(null, {
                                scene: 'linksce',
                                appcode: res.data.appCode,
                                pagecode: res.data.linkPageCode,
                                status: 'browse',
                                src: 'informer',
                                id: pk
                            });
                        }
                    } else {
                        props.openTo(null, {
                            scene: 'linksce',
                            appcode: res.data.appCode,
                            pagecode: res.data.linkPageCode,
                            status: 'browse',
                            src: 'informer',
                            srcbilltype: '36S3',
                            id: pk
                        });
                    }
                }
            }
        });
    };
}

/*CA6HHPCstSLce6wciVhFe2Li9rlyYPbjEykXhtNCwHh+kIBNM/lqyU2ponLzGijs*/