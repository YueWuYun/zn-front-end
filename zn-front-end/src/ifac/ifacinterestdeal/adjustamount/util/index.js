/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
//引入常量定义
import { FIELD, URL_INFO, tab_key, tab_source, PAGE_STATUS, appcode, card_page_id, card_form_id, card_search_id, card_table_id, search_source, search_key } from "../cons/constant";
//引入轻量化api
import { ajax, cardCache, toast } from 'nc-lightapp-front';
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
//引入卡片事件
import { buttonVisible, afterEvent } from "../card/events/index";
//页签
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
const { NCTabPane } = NCTabs;
/**
 * 获取多语
 * @param {*} props
 * @param {*} langCode
 */
export const getLang = function (mutiLang, langCode) {
    let code = appcode + '-' + langCode;
    let text = mutiLang[code];
    return text;
}

/**
 * 构造查询参数
 * @param {*} props 页面属性
 * @param {*} isCache 是否从缓存取
 */
export const getQueryData = function (props, isCache) {
    if (isCache) {
        return cardCache.getDefData(search_key, search_source);
    }
    // 查询条件：计息对象，账户，开始日期，结束日期
    let queryParam = {
        pk_intobj: '',
        pk_accinfo: '',
        begdate: '',
        enddate: '',
        settlemode: ''
    };
    let data = {
        queryCon: '',
        extraParam: {
        }
    }
    let pk_intobj, pk_accinfo, begdate, enddate, settlemode;
    // 联查，从url取查询条件
    let islinkquery = props.getUrlParam(URL_INFO.PARAM.ISLINKQUERY);
    if (islinkquery) {
        pk_intobj = props.getUrlParam(URL_INFO.PARAM.PKINTOBJ);
        pk_accinfo = props.getUrlParam(URL_INFO.PARAM.PKACCINFO);
        begdate = props.getUrlParam(URL_INFO.PARAM.BEGDATE);
        enddate = props.getUrlParam(URL_INFO.PARAM.ENDDATE);
        settlemode = props.getUrlParam(URL_INFO.PARAM.SETTLEMODE);
        data.extraParam.islinkquery = islinkquery;
    }
    // 非联查，从查询框取查询条件
    else {
        let objAndAcc = props.search.getSearchValByField(card_search_id, FIELD.SEARCH.PKINTOBJ).value.firstvalue.split('&');
        let date = props.search.getSearchValByField(card_search_id, FIELD.SEARCH.BEGENDDATE);
        date = date && date.value;
        pk_intobj = objAndAcc[0];
        pk_accinfo = objAndAcc[1];
        begdate = date.firstvalue;
        enddate = date.secondvalue;
    }
    queryParam.pk_intobj = pk_intobj;
    queryParam.pk_accinfo = pk_accinfo;
    queryParam.begdate = begdate;
    queryParam.enddate = enddate;
    queryParam.settlemode = settlemode;
    queryParam = checkQueryData.call(this, queryParam);
    data.queryCon = queryParam;
    return data;
}

/**
 * 组织多版本控制
 * @param {*} props 
 */
export const versionControl = function (props) {
    //组织版本试图
    orgVersionView(props, card_form_id);
}

/**
* 处理公式
* @param {*} res 
* @param {*} props 
*/
export const processFormulamsg = function (props, res) {
    if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
        let obj = {};
        props.dealFormulamsg(
            formulamsg,
            obj
        );
    }
}

/**
 * 保存
 * @param {*} props 页面内置对象
 * @param {*} cards 修改的卡片
 * @param {*} callback 回调函数
 */
export const save = async function (props, cards, callback) {
    let searchData = cardCache.getDefData(search_key, search_source);
    let data = {
        queryCon: searchData && searchData.queryCon,
        extraParam: searchData && searchData.extraParam,
        changeCards: cards,
        pageCode: card_page_id
    }
    ajax({
        url: URL_INFO.SAVE,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                data = initTabs.call(this, data, this.state.selectedGroup);
                loadData2Card.call(this, props, data, callback);
                toast({ color: 'success', content: getLang(this.state.json, '000004') });
            }
        }
    });
}

/**
 * 根据PK加载数据
 * @param {*} props 页面内置对象
 * @param {*} data 传入后台的查询参数
 * @param {*} isRefresh 是否刷新
 * @param {*} istoast 是否需要提示
 * @param {*} callback 回调方法
 */
export const qryData = function (props, data, isRefresh, istoast = true, callback) {
    ajax({
        url: URL_INFO.QUERY,
        data: data,
        success: (res) => {
            // 查询后初始化页签，加载数据到卡片
            let carddata = initTabs.call(this, res.data);
            loadData2Card.call(this, props, carddata, callback);
            if (res.data) {
                istoast && toastQry.call(this, res.data, !isRefresh);
            }
            else {
                istoast && toastQry.call(this, res.data, !isRefresh);
            }
        }
    });
}

/**
 * 加载数据到卡片
 * @param {*} props 页面内置对象
 * @param {*} data 后台返回的数据
 * @param {*} callback 回调方法
 */
export const loadData2Card = function (props, data, callback) {
    props.beforeUpdatePage();//打开开关
    //数据存在则更新卡片界面
    if (data) {
        let { head, body } = data;
        if (head) {
            props.form.setAllFormValue({ [card_form_id]: head[card_form_id] });
        }
        if (body) {
            props.cardTable.setTableData(card_table_id, body[card_table_id]);
        }
    }
    //数据不存在，则置空卡片
    else {
        props.form.EmptyAllFormValue(card_form_id);
        props.cardTable.setTableData(card_table_id, { rows: [] });
    }
    let isBrowse = this.state.isBrowse;
    //重绘页面
    repaintView.call(this, props, isBrowse ? PAGE_STATUS.BROWSER : PAGE_STATUS.EDIT, !data);
    props.updatePage(card_form_id, card_table_id);//关闭开关
    //执行回调函数
    if (callback && (typeof callback == 'function')) {
        callback.call(this);
    }
}

/**
 * 界面重绘
 * @param {*} props 页面内置对象
 * @param {*} status 页面状态，默认为浏览
 */
export const repaintView = function (props, status, isempty) {
    //设置页面组件的显示状态
    props.cardTable.setStatus(card_table_id, status);
    //处理按钮
    buttonVisible(props, status, isempty);
    //设置查询区显隐性
    let islinkquery = props.getUrlParam(URL_INFO.PARAM.ISLINKQUERY);
    let showSearchArea = status == PAGE_STATUS.BROWSER && !islinkquery;
    this.setState({ showSearchArea: showSearchArea, isBrowse: status == PAGE_STATUS.BROWSER });
}

/**
 * 创建页签
 * @param {*} tabarray 页签卡片数组
 */
export const createTabs = function (tabarray) {
    return tabarray.map((tab) => {
        return <NCTabPane tab={tab.name} key={tab.key} />
    });
}

/**
 * 页签初始化，创建页签和对应的卡片放入缓存，返回第一条页签的数据
 * @param {*} datas 后台返回的卡片数据数组
 * @param {*} currentTab 初始化后要显示的页签，默认为第一页
 */
const initTabs = function (datas, currentTab) {
    let tabDataMap = new Map();
    let index = 0;
    let tablist = [];
    currentTab = currentTab ? currentTab : "0";
     datas && datas.map((data) => {
        // 页签的key值需要转成字符串类型
        let tabKey = index++ + "";
        tablist.push({ key: tabKey, name: data.head[card_form_id].rows[0].values[FIELD.HEAD.TABTITLE].value });
        tabDataMap.set(tabKey, data);
    });
    // 把页签key和data的map放入缓存
    cardCache.setDefData(tab_key, tab_source, tabDataMap);
    afterEvent.call(this, this.props, card_table_id, 'init', tabDataMap, null, null);
    this.setState({
        tablist: tablist,
        selectedGroup: currentTab,
        isBrowse: true
    });
    return tabDataMap.get(currentTab);
}

/**
 * 查询刷新提示
 * @param {*} isSuccess 是否成功
 * @param {*} isSearch 是否属于查询
 */
const toastQry = function (isSuccess, isSearch) {
    if (isSuccess) {
        let content;
        if (!isSearch) {
            content = getLang(this.state.json, '000005');   /* 国际化处理： 刷新成功*/
        }
        else {
            content = getLang(this.state.json, '000006');   /* 国际化处理： 查询成功*/
        }
        toast({
            color: 'success',
            content: content
        })
    }
    else {
        toast({
            color: 'warning',
            content: getLang(this.state.json, '000007') /* 国际化处理： 未查询出符合条件的数据*/
        })
    }
}

/**
 * 查询条件检查
 * @param {*} data 查询条件
 */
const checkQueryData = function (data) {
    let begDate = null;
    let endDate = null;
    if (!data.pk_intobj) {
        toast({
            color: 'danger',
            content: getLang(this.state.json, '000008') /* 国际化处理： 计息对象主键不能为空*/
        })
        data = null;
    }
    if (!data.enddate) {
        toast({
            color: 'danger',
            content: getLang(this.state.json, '000011') /* 国际化处理： 结束日期不能为空*/
        })
        data = null;
    }
    else {
        endDate = new Date(Date.parse(data.enddate.replace(/-/g, "/")));
    }
    if (!data.begdate) {
        // 查询条件开始日期为空时，设置一个最小日期
        // data.begdate = '0000-01-01 00:00:00';
        begDate = endDate;
        begDate.setFullYear(begDate.getFullYear() - 2);
        data.begdate = begDate.getFullYear()
            + '-' + (begDate.getMonth() + 1).padLeft(2)
            + '-' + begDate.getDate().padLeft(2)
            + ' ' + begDate.getHours().padLeft(2)
            + ':' + begDate.getMinutes().padLeft(2)
            + ':' + begDate.getSeconds().padLeft(2);
    }
    // 判断日期间隔是否超过两年
    else {
        begDate = new Date(Date.parse(data.begdate.replace(/-/g, "/")));
        let begyear = begDate.getFullYear();
        let endyear = endDate.getFullYear();
        if (endyear - begyear > 2) {
            data = null;
            toast({
                color: 'danger',
                content: getLang(this.state.json, '000010') /* 国际化处理： 开始日期和结束日期间隔不能超过两年*/
            });
        }
    }
    return data;
}

/**
 * 给Number原型添加左边补位函数
 * @param {*} lng 补位后长度
 * @param {*} chr 占位字符
 */
Number.prototype.padLeft = function (lng, chr) {
    if (!lng) lng = 0;
    if (!chr) chr = '0';
    var vStr = this.toString();

    if (vStr.length > lng) {
        return vStr.substring(vStr.length - lng, vStr.length);
    } else if (vStr.length < lng) {
        var tnum = Math.pow(10, lng - vStr.length).toString();
        return tnum.substring(1, tnum.length).replace("0", chr) + this.toString();
    }
    return this.toString();
}

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/