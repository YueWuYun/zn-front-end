/*70pQip1fb69q2Mxa9uL6oZlJ8FgtDAff4Uj0JRSuQj7mlzXxK1V82CNnoPCKKBoi*/
import { ajax, cardCache } from 'nc-lightapp-front';
import { elecSignListPrint,elecSignCardPrint} from "../../../../tmpub/pub/util/index";
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
//引入卡片事件
import { buttonVisible } from "../card/events/index";
//引入查询的一些方法
import { buildQryData, updateListView } from "../list/events/searchBtnClick";
//引入常量定义
import {
    card_shouder_buttons, group_all, group_needcommit, group_approving, sourceModel,
    list_table_id, list_head_buttons, card_page_url, list_search_id, card_page_id, searchArea,
    selectedGroupArea, groupCountArea, dataSource, card_from_id, card_table_id,
    card_table_id_browse, appcode, base_url, islink,elecsignPrintParameter
} from "../cons/constant";

/**
 * 界面重绘
 * @param {*} props 
 */
export const repaintView = function (that, props) {
    //从地址栏获取状态
    let status = props.getUrlParam("status");
    //判断是否是浏览态
    let viewmode = status === 'browse' ? 'browse' : 'edit';
    //设置页面组件的显示状态
    props.form.setFormStatus(card_from_id, viewmode);
    props.cardTable.setStatus(card_table_id, viewmode);
    let orgedit = status == 'add';
    //新增时组织可编辑
    props.form.setFormItemsDisabled(card_from_id, { 'pk_org': !orgedit });
    //版本控制
    versionControl(props);
    //处理按钮
    buttonVisible(that);
}

/**
 * 处理复制粘贴的数据
 * @param {*} props 
 * @param {*} areacode 表格table的id
 * @param {*} index 要粘贴的位置
 */
export const handlePastData = function (props, areacode, index) {
    let selectRows = props.cardTable.getCheckedRows(areacode);
    if (selectRows == null || selectRows.length == 0) {
        toast({
            'color': 'warning',
            'content': this.state.json['36300STG-000014']/* 国际化处理： 未选中要复制的行*/
        });
        return false;
    }
    let selectIndexs = [];
    let selectRowCopy = JSON.parse(JSON.stringify(selectRows));
    for (let item of selectRowCopy) {
        item.data.selected = false;
        item.data.values.pk_spegather_b.value = null;
        item.data.values.pk_spegather_b.display = null;
        selectIndexs.push(item.data);
    }
    if (index == undefined) {
        index = props.cardTable.getNumberOfRows(areacode, false);
    }
    //TODO 等待平台批量复制的API
    props.cardTable.insertRowsAfterIndex(areacode, selectIndexs, index)
    return true;
}


/**
 * 设置卡片表体肩部按钮的可用性
 */
export const setCardShouderBtnUseful = function (props) {
    //初始时设置肩部按钮都不可用
    props.button.setButtonDisabled(card_shouder_buttons, true);
    //资金组织有值后，增行按钮可用
    if (props.form.getFormItemsValue(card_from_id, 'pk_org') && props.form.getFormItemsValue(card_from_id, 'pk_org').value) {
        props.button.setButtonDisabled(['AddLine'], false);
    }
    let lineNum = props.cardTable.getNumberOfRows(card_table_id, true);
    if (lineNum > 0) {
        let selectdata = props.cardTable.getCheckedRows(card_table_id);
        if (selectdata.length > 0) {
            props.button.setButtonDisabled(['DelLine', 'CopyLine'], false);
        }
    }

}

/**
 * 设置列表表头按钮的可用性
 */
export const setListButtonUseful = function () {
    //首先设置按钮不可用
    this.props.button.setButtonDisabled(list_head_buttons, true);
    //列表页面表格中选中的行数
    let selectdata = this.props.table.getCheckedRows(list_table_id);
    //没有选中数据
    if (!selectdata || selectdata.length == 0) {
        this.props.button.setButtonDisabled(list_head_buttons, true);
    }
    //选中一条数据，根据状态判断哪些按钮可用
    else if (selectdata.length == 1) {
        //选中一条，以下按钮即可使用
        this.props.button.setButtonDisabled(['Copy', 'linkgroup', 'LinkNtbPlan', 'File', 'Print', 'OutPut', 'Refresh'], false);
        //单据状态
        let billstatus = null;
        //审批状态
        let vbillstatus = null;
        //制证标志
        let ismakevoucher = null;
        //来源模块
        let recmodul = null;
        //处理选择数据
        selectdata.forEach((val) => {
            billstatus = val.data.values.billstatus.value;
            vbillstatus = val.data.values.vbillstatus.value;
            ismakevoucher = val.data.values.ismakevoucher.value;
            recmodul = val.data.values.recmodul.value;
        });
        //待提交
        if (billstatus == '5') {
            this.props.button.setButtonDisabled(['BatchDelete', 'BatchCommit'], false);
        }
        //待审批
        else if (billstatus == '2') {
            this.props.button.setButtonDisabled(['BatchUncommit', 'LinkViewApprove'], false);
        }
        //转账成功但没制证
        else if (billstatus == '3' && !ismakevoucher) {
            this.props.button.setButtonDisabled(['BatchUncommit', 'LinkViewApprove', 'LinkSendBill','ReturnBill',,'Official','Inofficial'], false);
        }
        //转账成功且制证
        else if (vbillstatus == '1' && ismakevoucher) {
            this.props.button.setButtonDisabled(['LinkViewApprove', 'LinkSendBill', 'LinkQueryVoucher','ReturnBill','Official','Inofficial'], false);
        }
        //根据来源来源模块判断“上游单据”是否显示
        if (recmodul == sourceModel.ModuleCode_CMP) {
            this.props.button.setButtonDisabled(['LinkSourceBill'], false);
        }
    }
    //选中多条数据，则批处理按钮可使用
    else if (selectdata.length > 1) {
        //选中多条，以下按钮可使用
        this.props.button.setButtonDisabled(list_head_buttons, false);
    }
}

/**
 * 加载查询区域缓存
 * @param {*} props 
 */
export const loadSearchCache = function (props) {
    //从缓存中获取查询区域条件
    let searchData = cardCache.getDefData(searchArea, dataSource);
    //更新查询区域
    if (searchData) {
        props.search.setSearchValue(list_search_id, searchData);
    }
}

/**
 * 获取缓存数据
 */
export const getCahceValue = function (props, updateStateFunc, callback) {
    let updateStateObj = {};
    //从缓存中获取分组合计数据
    let groupCount = cardCache.getDefData(groupCountArea, dataSource);
    if (groupCount) {
        updateStateObj['groupCount'] = groupCount;
    }
    //从缓存中获取选中的分组页签数据
    let selectedGroup = cardCache.getDefData(selectedGroupArea, dataSource);
    if (selectedGroup) {
        updateStateObj['selectedGroup'] = selectedGroup;
    }

    //更新列表state
    if (Object.keys(updateStateObj).length > 0) {
        updateStateFunc(updateStateObj);
    }
    //回调
    if (callback && (typeof callback == 'function')) {
        callback(props);
    }
}

/**
 * 列表跳转卡片
 * @param {*} props 
 * @param {*} urlParam 
 */
export const goTocard = function (props, urlParam, getStateFunc, callback) {
    //获取分组合计数据
    let groupCount = getStateFunc('groupCount');
    //缓存分组合计数据
    cardCache.setDefData(groupCountArea, dataSource, groupCount);
    //获取选中的分组页签
    let selectedGroup = getStateFunc('selectedGroup');
    //缓存选中的分组页签
    cardCache.setDefData(selectedGroupArea, dataSource, selectedGroup);
    // //不为联查场景时 才缓存查询区域数据
    // let islinked = getDefData(dataSource, islink);
    // if (!islinked) {
    //     //获取查询区域条件(不校验必输项)
    //     let searchData = props.search.getQueryInfo(list_search_id, false);
    //     //缓存查询区域条件
    //     cardCache.setDefData(searchArea, dataSource, (searchData && searchData.querycondition && searchData.querycondition.conditions) || null);
    // }
    if (!urlParam) {
        urlParam = {};
        urlParam['status'] = 'browse';
    }
    urlParam['pagecode'] = card_page_id;
    //页面跳转
    props.pushTo(card_page_url, urlParam);
    //回调
    if (callback && (typeof callback == 'function')) {
        callback(props);
    }
}

/**
 * 组织多版本控制
 * @param {*} props 
 */
export const versionControl = function (props) {
    //组织版本试图
    orgVersionView(props, card_from_id);
}

/**
 * 自动加载数据
 * @param {*} props 
 * @param {*} groupKey 分组页签
 */
export const autoLoadData = function (props, groupKey) {
    //获取包装好的queryInfo，flag参数表示是否校验数据，默认为true校验
    let searchData = props.search.getQueryInfo(list_search_id, false);
    //无groupKey，则默认为第一个:待提交
    if (!groupKey) {
        groupKey = group_needcommit;
    }
    let data = buildQryData(props, searchData.querycondition, groupKey);
    let extParam = {
        appCode: appcode
    }
    data['extParam'] = extParam;
    ajax({
        url: base_url + 'spegatherlistautoqry.do',
        data,
        success: (res) => {
            updateListView.call(this, props, res, groupKey);
        }
    });
}
/**
 * 获取新行
 * @param {*} props 
 */
export const getNewRow = function (props) {
    let values = {};
    values['pk_org'] = props.form.getFormItemsValue(card_from_id, 'pk_org');
    values['pk_group'] = props.form.getFormItemsValue(card_from_id, 'pk_group');
    values['pk_currtype'] = props.form.getFormItemsValue(card_from_id, 'pk_currtype');
    values['pk_spegather_h'] = props.form.getFormItemsValue(card_from_id, 'pk_spegather_h');
    return values;
}

/**
 * 电子签章打印
 * @param {*} props 
 * @param {*} offical 是否为正式打印 
 * @param {*} isCard  判断卡片还是列表
 */
export const elecSignPrint = function (props,offical,isCard) {
    //卡片打印
    if(isCard){
        elecSignCardPrint(props, {
            url: elecsignPrintParameter.actionUrl,
            offical,
            appCode: appcode,
            nodeKey: offical ? elecsignPrintParameter.printnodekey_offical : elecsignPrintParameter.printnodekey_inoffical,
            headCode: card_from_id,
            field_id: 'pk_spegather_h',
            field_billno: 'vbillno',
            validateFunc: () => {
                let billstatus = props.form.getFormItemsValue(card_from_id, 'billstatus').value;
                if ('3' != billstatus) {
                    return this.state.json['36300STG-000018']/** 单据状态非转账成功！ */;
                }
                return null;
            }
        });
    }else{//列表打印
        elecSignListPrint(props, {
            url: elecsignPrintParameter.actionUrl,
            offical,
            appCode: appcode,
            nodeKey: offical ? elecsignPrintParameter.printnodekey_offical : elecsignPrintParameter.printnodekey_inoffical,
            tableCode: list_table_id, 
            field_id: 'pk_spegather_h', 
            field_billno: 'vbillno',
            validateFunc: (selectData) => {
                let billstatus = selectData && selectData.data && selectData.data.values && selectData.data.values['billstatus'] && selectData.data.values['billstatus'].value;
                if ('3' != billstatus) {
                    return this.state.json['36300STG-000065']/** 单据状态非转账成功！ */;
                }
                return null;
            }
        });

    }
}
/*70pQip1fb69q2Mxa9uL6oZlJ8FgtDAff4Uj0JRSuQj7mlzXxK1V82CNnoPCKKBoi*/