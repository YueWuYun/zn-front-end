/*K43jBnKthySF+/7yUO7udo8Yz5Msh1XhDVvXjLzabdR0dORmxq8Yqv6AOhyWR9jw*/
import { cardCache } from 'nc-lightapp-front';
let { setDefData } = cardCache;
/**
 * [收款结算]-直接设置页签的值
 * @param {*} data 自己封装返回值
 */
export const setOnlyNavValue = function (data) {

    if (data && data.grid) {
        //新增按钮中传参,选择第一条数据，适用于卡片取消跳转数据
        //返回allpk的第一条pk
        let add_values = data.grid[this.tableId].rows;
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
        let tabs00 = '0';    //全部
        let tabs01 = '0';   //审批通过
        let tabs02 = data.approving == null ? '0' : '' + data.approving + ''; //审批中
        let tabs09 = '0';     // 未确认
        let tabs10 = data.needCommit == null ? '0' : '' + data.needCommit + '';  //保存/待提交
        let tabs11 = '0';  //待审批
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
    } else if (data) {
        //页签赋值
        let tabs00 = '0';    //全部
        let tabs01 = '0';   //审批通过
        let tabs02 = data.approving == null ? '0' : '' + data.approving + ''; //审批中
        let tabs09 = '0';     // 未确认
        let tabs10 = data.needCommit == null ? '0' : '' + data.needCommit + '';  //保存/待提交
        let tabs11 = '0';  //待审批
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
            tabs00: '0',
            tabs01: '0',
            tabs02: '0',
            tabs09: '0',
            tabs10: '0',
            tabs11: '0'
        });
    }
}

/*K43jBnKthySF+/7yUO7udo8Yz5Msh1XhDVvXjLzabdR0dORmxq8Yqv6AOhyWR9jw*/