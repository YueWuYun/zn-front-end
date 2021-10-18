/*Q1Hvf+wdWDLNjqEGe10EE2YUqiD7uIamapJAi/4MbIXjl20HFtkpxpsPWwGxyxGw*/
import { cardCache } from 'nc-lightapp-front';
let { setDefData } = cardCache;
/**
 * [收款协同]-设置列表页签数值[适用于查询shceme数据]
 * @param {*} data 自己封装返回值
 */
export const setNavValue = function (data) {

    if (data && data.length > 0) {
        //页签赋值
        let tabs00 = '';    //全部
        let tabs01 = '';   //审批通过
        let tabs02 = ''; //审批中
        let tabs09 = '';     // 未确认
        let tabs10 = '';  //保存
        let tabs11 = '';  //待审批
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
            tabs00: '',
            tabs01: '',
            tabs02: '',
            tabs09: '',
            tabs10: '',
            tabs11: ''
        });
    }
}

/*Q1Hvf+wdWDLNjqEGe10EE2YUqiD7uIamapJAi/4MbIXjl20HFtkpxpsPWwGxyxGw*/