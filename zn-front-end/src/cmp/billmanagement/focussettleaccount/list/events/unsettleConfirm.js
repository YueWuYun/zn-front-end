/*sG3rnjk7cVOgs02d7GEja7RUt8upOSPnISS5JVR9PXvZREsq1tZH/z39Oxzi2gKq*/
import { createPage, ajax, base, high, toast, cardCache, deepClone } from 'nc-lightapp-front';
import { BatchToast } from '../MessageUtil/BatchToast';
/**
 * [集中结账]-取消结账
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const unsettleConfirm = function () {
    let unSettleAccountData = this.props.table.getCheckedRows(this.tableId);
    if (unSettleAccountData.length == 0) {
        toast({
            color: 'warning', content: this.props.MutiInit.getIntl("36070FSA") &&
                this.props.MutiInit.getIntl("36070FSA").get('36070FSA-000001')
        });/* 国际化处理： 请选择数据，进行取消结账处理!*/
        return;
    }

    //请求参数
    let un_findAccMonth = null;//会计期间年月
    let un_findPkorg = null;//所选组织
    let un_AccYear = null;//会计年
    let un_AccMonth = null;//会计月
    let un_findAccMonthEnd = null;//会计期间开始时间
    let un_findAccMonthFirst = null;//会计期间结束时间
    let un_findAccMonthArea = null;//会计期间
    let un_findMonthAreastype = null;//期间状态
    let un_sel_flag = true;//选择即为true
    let un_stype_flag = null;//期间状态标识
    let un_findPkorgname = null;//组织名称
    let un_findPkorgcode = null;//组织编码
    let orgs = [];//请求数据中的财务组织集合
    let un_settleVo = [];//请求数据
    for (let val of unSettleAccountData) {

        un_findAccMonth = val.data.values.findAccMonth.value;
        un_findPkorg = val.data.values.pk_org.value;
        un_findPkorgname = val.data.values.pk_orgname.value;
        un_findPkorgcode = val.data.values.pk_orgcode.value;
        un_AccYear = val.data.values.AccYear.value;
        un_AccMonth = val.data.values.AccMonth.value;
        un_findAccMonthFirst = val.data.values.findAccMonthFirst.value;
        un_findAccMonthEnd = val.data.values.findAccMonthEnd.value;
        un_findAccMonthArea = val.data.values.findAccMonthArea.value;
        un_findMonthAreastype = val.data.values.findMonthAreastype.value;
        un_stype_flag = val.data.values.stype_flag.value;


        // sel_flag = true;//选中行数
        //自定义请求数据vo
        let un_t_data = {
            'findAccMonth': un_findAccMonth,
            'pk_org': un_findPkorg,
            'pk_orgname': un_findPkorgname,
            'pk_orgcode': un_findPkorgcode,
            'pageid': this.pageId,
            'AccYear': un_AccYear,
            'AccMonth': un_AccMonth,
            'findAccMonthFirst': un_findAccMonthFirst,
            'findAccMonthEnd': un_findAccMonthEnd,
            'findAccMonthArea': un_findAccMonthArea,
            'findMonthAreastype': un_findMonthAreastype,
            'sel_flag': true,
            'stype_flag': un_stype_flag
        };
        un_settleVo.push(un_t_data);
        orgs.push(un_findPkorg);

    };

    ajax({
        url: '/nccloud/cmp/focussettleaccount/oncancelreckoning.do',
        data: {
            'settlevo': un_settleVo,
            'orgs': orgs
        },
        success: (res) => {
            let { success, data } = res;
            if (success) {
                let values = data[this.tableId].rows;
                let cMessagArr = [];//提示信息
                //结果统计数
                let successIndex = 0;//成功条数
                let failIndex = 0;//失败条数
                if (values && values.length > 0) {

                    values.forEach((val) => {

                        let eRMessageArr = [];
                        let unerrorMsgArr = val.values.errorMessageArr.value;//多条语句
                        let orgname = val.values.pk_orgname.value;//组织名称
                        let orgcode = val.values.pk_orgcode.value;//结账业务单元code
                        if (unerrorMsgArr && unerrorMsgArr.length > 0) {

                            eRMessageArr.push('【' + orgname + ' ' + orgcode + '】' + (this.props.MutiInit.getIntl("36070FSA") &&
                                this.props.MutiInit.getIntl("36070FSA").get('36070FSA-000023')));//国际化处理：'操作失败,原因>>'

                            if (Array.isArray(unerrorMsgArr)) {
                                //数组
                                unerrorMsgArr.forEach((val) => {
                                    eRMessageArr.push('~' + val);
                                });
                            } else {
                                //字符串
                                eRMessageArr.push('~' + unerrorMsgArr);
                            }

                        }
                        else {
                            eRMessageArr.push('【' + orgname + ' ' + orgcode + '】' + (this.props.MutiInit.getIntl("36070FSA") &&
                                this.props.MutiInit.getIntl("36070FSA").get('36070FSA-000038')));//国际化处理：操作成功！
                            successIndex = successIndex + 1;//成功条数
                        }

                        if (eRMessageArr.length > 0) {
                            eRMessageArr.forEach((val) => {
                                cMessagArr.push(val);
                            });
                        }
                    });
                }
                failIndex = values.length - successIndex;//失败条数
                BatchToast.call(this, (this.props.MutiInit.getIntl("36070FSA") &&
                    this.props.MutiInit.getIntl("36070FSA").get('36070FSA-000027')),
                    values.length, successIndex, failIndex, cMessagArr, null);//国际化处理：取消结账
            }
        }
    });

}

/*sG3rnjk7cVOgs02d7GEja7RUt8upOSPnISS5JVR9PXvZREsq1tZH/z39Oxzi2gKq*/