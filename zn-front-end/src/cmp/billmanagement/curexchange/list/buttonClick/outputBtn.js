/*rSKTc/zKJuyljJMHSO2UEkStpAfzADPVgvCtYYs88dD402QaaFDnIbSBUaOXpr6o*/
import { createPage, ajax, base, high, toast, cardCache,output } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";

/**
 * [外币兑换]-输出按钮
 * @param {*} props  
 */
export const outputBtn = function () {
    let outputBtnData = this.props.table.getCheckedRows(this.tableId);
    if (outputBtnData.length == 0) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000069')   // 提示内容,非必输/* 国际化处理： 请选择数据，进行打印输出!*/
        })
        return;
    }
    let pks = [];
    outputBtnData.forEach((item) => {
        pks.push(item.data.values.pk_cruexchange.value);
    });
    output({
        url: '/nccloud/cmp/curexchange/curexchangeprint.do',
        data: {
            nodekey: Templatedata.printlist_nodekey,
            appcode: this.props.getSearchParam('c'),
            oids:pks,
            outputType: 'output'
        }
    });
}

/*rSKTc/zKJuyljJMHSO2UEkStpAfzADPVgvCtYYs88dD402QaaFDnIbSBUaOXpr6o*/