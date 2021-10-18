/*+4IVkrChYQbzvdNgD5JlWl/s3k7/qIMJcX9oDS9okPfvY4g9UmZROOQwm0gllshr*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { tableId, pagecode } from '../constants';
let { NCMessage } = base;
/**
 * 具体业务操作
 * @param {*} props 
 * @param {*} url 
 * @param {*} message 
 */
export function busiOperate(that, key, props, url, opername, source, innerdata) {
    if (source == 'head') {
        const selectedData = props.table.getCheckedRows(tableId);
        if (selectedData.length == 0) {
            toast({ content: that.props.MutiInit.getIntl("36070AISC") && that.props.MutiInit.getIntl("36070AISC").get('36070AISC-000000'), color: 'warning' });// 国际化处理： 请选择数据！
            return;
        } else {
            let pks = [];
            let ts;
            selectedData.forEach((val) => {
                let pk;
                pk = val.data.values.pk_informerrelease.value;
                pks.push(pk);
            });
            let oldlenght = pks.length;
            let data = {
                pks: pks
            };
            let total;
            let successNum;
            let failNum;
            let content;
            ajax({
                url: url,
                data,
                success: function (res) {
                    that.getdata();
                    if (res.data) {
                        total = res.data.total;
                        failNum = res.data.failNum; 
                        successNum = res.data.successNum;
                        let hint = props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000071')/* 条*/;
                        let hint1= props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000070')/* 共*/;
                        let hint2 = props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000072')/*'成功'*/;
                        let hint3 = props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000073')/*'失败'*/;
                        content = hint1 + opername + total +hint +','+hint2+successNum + hint+','+hint3 + failNum + hint;
                    }
                    if (res.data.errormessage) {
                        //全部失败
                        if (failNum == total) {
                            toast({
                                duration: 'infinity',
                                color: 'danger',
                                title: opername + props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000074')/*' 全部失败!'*/,
                                content: content,
                                groupOperation: true,
                                TextArr: [props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000075')/*'展开'*/, props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000076')/*'收起'*/, props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000077')/*'关闭'*/],
                                groupOperationMsg: res.data.errormessage.split("\n")
                            });
                        }
                        //部分失败
                        else {
                            toast({
                                duration: 'infinity',
                                color: 'warning',
                                title: opername + props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000078')/*' 部分失败!'*/,
                                content: content,
                                groupOperation: true,
                                TextArr: [props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000075')/*'展开'*/, props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000076')/*'收起'*/, props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000077')/*'关闭'*/],
                                groupOperationMsg: res.data.errormessage.split("\n")
                            });
                        }
                    } else {
                        let tabledata = props.table.getAllTableData(tableId);
                        if (key == 'Cancelpublish' && oldlenght == tabledata.rows.length) {
                            props.pushTo("/list", {
                                status: 'browse'
                            });
                        } else {
                            toast({
                                duration: 3,
                                color: 'success',
                                title: opername + props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000079')/*' 全部成功!'*/,
                                content: content,
                                groupOperation: true
                            });
                        }
                    }
                }
            });
        }
    }
    if (source == "inner") {
        ajax({
            url: url,
            data: innerdata,
            success: function (res) {
                if (res.data && res.data.errormessage == null) {
                    that.getdata();
                    toast({ color: 'success', content: props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000080')/*"操作成功！" */});
                } else {
                    toast({ content: res.data.errormessage, color: 'warning' });
                }
            }
        });
    }

}

/*+4IVkrChYQbzvdNgD5JlWl/s3k7/qIMJcX9oDS9okPfvY4g9UmZROOQwm0gllshr*/