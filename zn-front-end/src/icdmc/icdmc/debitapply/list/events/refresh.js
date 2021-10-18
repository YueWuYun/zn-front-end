/*TVz0urOFwYZ+3VqYTGVzt+sI9CxiivRa7henc7fsgIJ7yg/xEBy77oDrDEsYrh1i*/
import { ajax, cardCache, deepClone, toast } from 'nc-lightapp-front';
import { list, baseReqUrl, javaUrl } from '../../cons/constant.js';
import { buttonDisabled } from './buttonClick';
let { setDefData, getDefData } = cardCache;

/**
 * 点击刷新，获取查询区数据
 * @param {*} props           页面内置对象
 * @param {*} condition       大家查一下文档，没细看
 * @param {*} type            ...
 * @param {*} querycondition  ...
 * @param {*} isToast         是否弹出toast
 */
export function refreshBtnClick (props, condition, type, querycondition, isToast= true) {
    if (!condition) {//刷新按钮
        condition= deepClone(getDefData(this.searchKey, this.dataSource));//缓存的查询条件{需要先克隆一下}
        if (!condition) {
            toast({color: 'success', content: this.state.json['36362IDA-000036']});/* 国际化处理： 刷新成功!*/
            return;
        }
    } else {//查询按钮
        setDefData(this.searchKey, this.dataSource, condition);
    }
    if (!condition.conditions || condition.conditions.length == 0) {
        return;
    }
    
    let groupCondition = getGroupCondition.call(this, this.state.status);
    let pageInfo = props.table.getTablePageInfo(this.tableId);
    pageInfo.pageIndex= 0;
    let searchdata = {
        querycondition: condition,
        custcondition: {
            logic: 'and', //逻辑操作符，and、or
            conditions: groupCondition
        },
        pageInfo: pageInfo,
        pagecode: list.pageCode,
        queryAreaCode: this.searchId,  //查询区编码
        oid: list.searchOid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: 'tree'
    };
    getListData.call(this, javaUrl.list, searchdata, isToast);
};

/**
 * 状态页签变化
 * @param {*} status 分组键
 */
export function onTabChange (status) {
    setDefData(this.statusKey, this.dataSource, status || 'all');
    this.setState({status});
    let tabVal= status ? [{
        field: list.tabKey,
        value: {
            firstvalue: status,
            secondvalue: null
        },
        oprtype: '=',
    }] : [];
    //查询条件先取缓存，再去查询区
    let searchVal = deepClone(getDefData(this.searchKey, this.dataSource));//缓存的查询条件{需要先克隆一下}
    // if (!searchVal) {
    //     searchVal = this.props.search.getAllSearchData(this.searchId);//查询区条件
    //     // 将所有查询条件赋值进缓存[查询的时候已经放入缓存]
    //     setDefData(this.searchKey, this.dataSource, searchVal);
    // }
    if (!searchVal) {
        return;
    }
    let pageInfo = this.props.table.getTablePageInfo(this.tableId);
    pageInfo.pageIndex = 0;
    let searchdata = {
        querycondition: searchVal,
        custcondition: {
            logic: 'and', //逻辑操作符，and、or
            conditions: tabVal
        },
        pageInfo: pageInfo,
        pageCode: this.pageId,
        queryAreaCode: this.searchId,   //查询区编码
        oid: list.searchOid,            //查询模板id
        querytype: 'tree'
    };
    getListData.call(this, javaUrl.list, searchdata, false);
}

/**
 * 获取分组查询条件
 * @param {*} status 分组键
 */
function getGroupCondition (status) {
    return status ? [{
        field: list.tabKey,
        value: {
            firstvalue: status,
            secondvalue: null
        },
        oprtype: '=',
    }] : [];
}

/**
 * 点击分页、改变每页条数
 * @param {*} props           页面内置对象
 * @param {*} config          大家查一下文档，没细看，貌似没用上
 * @param {*} pks             拿到当前页的所有pks
 */
export function pageInfoClick (props, config, pks) {
    let pageInfo = props.table.getTablePageInfo(this.tableId);
    let searchVal = props.search.getAllSearchData(this.searchId);
    let data = {
        pks,
        pageCode: this.pageId
    };
    getListData.call(this, javaUrl.pks, data, false);
}

/**
 * 请求列表接口
 * @param {*} path       接口地址
 * @param {*} data       数据
 * @param {*} isToast    是否弹出toast
 */
function getListData (path, data, isToast) {
    ajax({
        url: `${baseReqUrl}${path}.do`,
        data,
        success: (res) => {
            listRender.call(this, res, isToast);
        },
        error: (res) => {
            listRender.call(this, {success: false});
            toast({color: 'warning', content: res.message});
        }
    });
}

/**
 * 拿到返回的数据，对列表进行渲染
 * @param {*} res            后台返回的res
 * @param {*} isToast        是否弹出toast
 */
function listRender (res, isToast) {
    let { success, data } = res;
    let tabContainer= data ? data[this.tabContainer] || {} : {};
    if (success && data && data.grid && data.grid[this.tableId]) {
        this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
        let flag= false;
        for (let key in tabContainer) {
            if (tabContainer[key]!== '0') {
                flag= true;
            }
        }
        if (isToast) {
            if (flag) {
                toast({color: 'success', content: this.state.json['36362IDA-000036']});/* 国际化处理： 刷新成功!*/
            } else {
                toast({color: 'warning', content: this.state.json['36362IDA-000027']});/* 国际化处理： 未查询出符合条件的数据!*/
            }
        }
    } else {
        this.props.table.setAllTableData(this.tableId, { rows: [] });
    }
    buttonDisabled.call(this);
    setStatusNumKey.call(this, tabContainer);
}

export function setStatusNumKey (tabContainer) {
    if (Object.keys(tabContainer).length) {
        let { tabStatus }= this.state;
        for (let item of this.tabStatus) {
            tabStatus[item].num= tabContainer[item] || (item=== 'all' ? '' : 0);
        }
        this.setState({tabStatus}, () => {
            setDefData(this.dataSource, this.statusNumKey, tabContainer);
        });
    }
}

/*TVz0urOFwYZ+3VqYTGVzt+sI9CxiivRa7henc7fsgIJ7yg/xEBy77oDrDEsYrh1i*/