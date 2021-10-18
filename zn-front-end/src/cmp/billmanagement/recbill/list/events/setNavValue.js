/*Q1Hvf+wdWDLNjqEGe10EE2YUqiD7uIamapJAi/4MbIXjl20HFtkpxpsPWwGxyxGw*/
import { cardCache } from 'nc-lightapp-front';
let { setDefData } = cardCache;
/**
 * [收款结算]-设置列表页签数值[适用于查询shceme数据]
 * @param {*} data 自己封装返回值
 */
export const setNavValue = function (data) {

    if (data && data.length > 0 && data.grid) {
        //新增按钮中传参,选择第一条数据，适用于卡片取消跳转数据
        //返回allpk的第一条pk
        let add_values = data[0].grid[this.tableId].rows;
        let add_pk = '';
        let add_status = '';
        if (add_values && add_values.length > 0) {
            add_status = add_values[0].values.bill_status.value;
            add_pk = add_values[0].values.pk_recbill.value;
        }
        this.setState({
            add_pk: add_pk,
            add_status: add_status
        });
        //页签赋值
        let tabs00 = '(0)';    //全部
        let tabs01 = '(0)';   //审批通过
        let tabs02 = '(0)'; //审批中
        let tabs09 = '(0)';     // 未确认
        let tabs10 = '(0)';  //保存
        let tabs11 = '(0)';  //待审批
        data.forEach((val) => {
            tabs01 = '(' + val.status_1 + ')';
            tabs02 = '(' + val.status_2 + ')';
            tabs09 = '(' + val.status_9 + ')';
            tabs10 = '(' + val.status_010 + ')';
            tabs11 = '(' + val.status_01 + ')';
            tabs00 = '(' + val.total + ')';
        });
        //页签赋值
        this.setState({
            tabs00: tabs00,
            tabs01: tabs01,
            tabs02: tabs02,
            tabs09: tabs09,
            tabs10: tabs10,
            tabs11: tabs11
        });
        //缓存页签数据
        setDefData(this.key, this.dataSource, this.state);
    } else {
        //页签赋值
        this.setState({
            tabs00: '(0)',
            tabs01: '(0)',
            tabs02: '(0)',
            tabs09: '(0)',
            tabs10: '(0)',
            tabs11: '(0)'
        });
    }
}

/*Q1Hvf+wdWDLNjqEGe10EE2YUqiD7uIamapJAi/4MbIXjl20HFtkpxpsPWwGxyxGw*/