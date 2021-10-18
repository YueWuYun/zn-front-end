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
export function busiOperate(that, key, props, url, opername) { 
    const selectedData = props.table.getCheckedRows(tableId);
    if (selectedData.length == 0) {
        toast({ content: props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000000'), color: 'warning' });/* 国际化处理： 请选择数据！*/
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
        ajax({
            url: url,
            data,
            success: function (res) {
                that.getdata();
                let total;
                let failNum;
                let successNum;
                let content;
                if(res.data){
                    total = res.data.total;
                    failNum = res.data.failNum; 
                    successNum = res.data.successNum;
                    content = props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000012') + opername + total + props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000013');
                    content = content+props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000014') + successNum + props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000013');                   
                }
                if (res.data.errormessage) {
                     //全部失败
                     if(failNum == total){
                        toast({
                            duration: 'infinity', 
                            color: 'danger', 
                            title: opername, 
                            content: content, 
                            groupOperation: true,
                            TextArr: [ props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000018'), props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000019'), props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000020') ],
                            groupOperationMsg: res.data.errormessage.split("\n") 
                        });
                    }
                    //部分失败
                    else{
                        toast({
                            duration: 'infinity', 
                            color: 'warning', 
                            title: opername +props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000021') , 
                            content: content, 
                            groupOperation: true, 
                            TextArr: [ props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000018'), props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000019'), props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000020') ],
                            groupOperationMsg: res.data.errormessage.split("\n") 
                        });
                    }
                } else {
                    let tabledata = props.table.getAllTableData(tableId);
                    if (key == 'unpublish' && oldlenght == tabledata.rows.length) {
                        props.pushTo("/list", {
                            status: 'browse'
                        });
                    } else {
                        toast({
                            duration: 3,
                            color: 'success', 
                            title: opername +props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000022'), 
                            content: content, 
                            groupOperation: true 
                        });
                    }
                }
            }
        });
    }
}

/*+4IVkrChYQbzvdNgD5JlWl/s3k7/qIMJcX9oDS9okPfvY4g9UmZROOQwm0gllshr*/