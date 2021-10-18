/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/
import { base, toast } from 'nc-lightapp-front';
import { tableId, pagecode } from '../constants';
let { NCMessage } = base;
/**
 * 刷新
 * @param {*} props 
 * @param {*} res 后台返回结果
 * @param {*} indexMap Map:key为pk，balue为index
 * @param {*} content 提示语
 * @param {*} source 操作来源
 */
export function refresh(props, res, indexMap, opername, source, index) {
    //表头操作
    let content;
    if (source == 'head') { 
        if (res.data != null) {
            let total = res.data.total;
            let successNum = res.data.successNum; 
            let failNum = res.data.failNum;
            let hint = props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000071')/* 条*/;
            let hint1= props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000070')/* 共*/;
            let hint2 = props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000072')/*'成功'*/;
            let hint3 = props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000073')/*'失败'*/;
            content = hint1 + opername + total +hint +','+hint2+successNum + hint+','+hint3 + failNum + hint;
            if (res.data.result && res.data.result.table) {
                res.data.result.table.rows.forEach((val) => {
                    let updateDataArr = [{
                        index: indexMap.get(val.values.pk_informer.value),
                        data: { values: val.values }
                    }];
                    props.table.updateDataByIndexs(tableId, updateDataArr);
                });
            }
            if (res.data.errormessage) {
                if (total == failNum) {
                    toast({
                        duration: 'infinity',
                        color: 'danger',
                        title: opername + props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000074')/*' 全部失败!'*/,
                        content: content,
                        groupOperation: true,
                        TextArr: [props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000075')/*'展开'*/, props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000076')/*'收起'*/, props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000077')/*'关闭'*/],
                        groupOperationMsg: res.data.errormessage.split("\n")
                    });
                } else {
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
                toast({
                    duration: 5,
                    color: 'success',
                    title: opername +  props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000079')/*' 全部成功!'*/,
                    content: content,
                    groupOperation: total == 1 ? false : true
                });
            }
        }
    }
    //表内操作
    if (source == 'inner') {
        if (res.data != null && typeof res.data.errormessage == 'string') {
            toast({ content: res.data.errormessage, color: 'warning' });
        } else {
            let updateDataArr = [{
                index: index,
                data: { values: res.data.result.table.rows[0].values }
            }];
            props.table.updateDataByIndexs(tableId, updateDataArr);
            toast({ content: opername +  props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AISC-000072')/*' 成功!'*/, color: 'success' });
        }
    }

}




/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/