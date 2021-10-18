/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { createPage, ajax, base, toast ,cacheTools} from 'nc-lightapp-front';
import {Templatedata} from "../../config/Templatedata";
export default function buttonClick(props, id) {
    let self = this;
    let selectedData = props.table.getCheckedRows(this.tableId);
    let pks = [];
    let tss = [];
    if (!selectedData || selectedData.length == 0) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000020') });/* 国际化处理： 请选择数据*/
        return;
    }
    //处理选择数据
    selectedData.forEach((val) => {
        //此处可校验，挑选满足条件的进行操作
        pks.push(val.data.values.pk_settlement.value);//主键数组
        tss.push(val.data.values.ts.value); 
    });
    let data = {
        'pks': pks,
        'tss': tss
    };
    switch (id) {
        //小应用按钮
        case 'signBtn':
            //签字
            ajax({
                url: Templatedata.settlesign,
                data: data,
                success: (res) => {
                    let {success,data} = res;
                    if (success) {
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000000') });/* 国际化处理： 签字成功*/
                        //props.table.deleteTableRowsByIndex(table_id, index);
                    }
                }
            });
        break;
    }


}


/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/