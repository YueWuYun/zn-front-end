/*Q1Hvf+wdWDLNjqEGe10EE2YUqiD7uIamapJAi/4MbIXjl20HFtkpxpsPWwGxyxGw*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
//缓存
let { setDefData, getDefData, getCurrentLastId, getCacheById, updateCache, addCache, getNextId, deleteCacheById } = cardCache;

/**
 * [外币兑换]-设置列表页签数值[适用于查询shceme数据]
 * @param {*} data 自己封装返回值
 */
export const setNavValue = function (data) {

    if (data && data.length > 0) {
        //新增按钮中传参,选择第一条数据，适用于卡片取消跳转数据
        //返回allpk的第一条pk
        let add_values = data[0].grid[this.tableId].rows;
        let add_pk = '';
        let add_status = '';
        if (add_values && add_values.length > 0) {
            add_status = add_values[0].values.busistatus.value;
            add_pk = add_values[0].values.pk_cruexchange.value;
        }
        this.setState({
            add_pk: add_pk,
            add_status: add_status
        });
        //页签赋值
        let tabs01 = '(0)';//保存态/待提交
        let tabs02 = '(0)';//待审批
        let tabs03 = '(0)';//代办理
        let tabs04 = '(0)';//已完成/已完毕
        let tabs05 = '(0)';//全部
        let tabs06 = '(0)';//审批状态：审批中

        data.forEach((val) => {
            tabs01 = '(' + val.status_1 + ')';
            tabs02 = '(' + val.status_2 + ')';
            tabs03 = '(' + val.status_3 + ')';
            tabs04 = '(' + val.status_4 + ')';
            tabs06 = '(' + val.status_6 + ')';
            tabs05 = '(' + val.total + ')';
        });
        //页签赋值
        this.setState({
            tabs01: tabs01,
            tabs02: tabs02,
            tabs03: tabs03,
            tabs04: tabs04,
            tabs05: tabs05,
            tabs06: tabs06
        });
        //缓存页签数据
        setDefData(this.key, this.dataSource, this.state);
    } else {
        //页签赋值
        this.setState({
            tabs01: '(0)',
            tabs02: '(0)',
            tabs03: '(0)',
            tabs04: '(0)',
            tabs05: '(0)',
            tabs06: '(0)',
        });
    }
}

/*Q1Hvf+wdWDLNjqEGe10EE2YUqiD7uIamapJAi/4MbIXjl20HFtkpxpsPWwGxyxGw*/