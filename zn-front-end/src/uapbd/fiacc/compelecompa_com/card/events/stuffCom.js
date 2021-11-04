//m8Lcnc0K+IWU/vxCSPSM8daqwGx71wBVba3jQ+ZDbEHnnpO2/lKwINK7kaqERTNK
import { createPage, ajax, base, toast, cardCache, high, print, output } from 'nc-lightapp-front';
import toggleShow from './toggleShow';
import headAfterEvent from './headAfterEvent';
import { tableTypeObj, dataValiType, pkname, formId, tableId, bodypkname, billtype, funcode, nodekey, tableId_edit } from '../constants';
let { getCacheById, updateCache, addCache,deleteCacheById } = cardCache;
import { dealCardData } from '../../../../public/excomponents/pubUtils/dealCardData';
import { getContext } from '../../../../public/excomponents/pubUtils/loginContext';
/**
 * 
 * 消耗单公共方法提取
 */




//渲染页面数据，用于查询后铺数据
export const loadPageValue = function (data, props) {
    if (data) {
        if (data.head) {
            props.form.setAllFormValue({ [formId]: data.head[formId] });
        }
        if (data.body) {
            if (data.body[tableId]) {
                props.cardTable.setTableData(tableId, data.body[tableId]);
            } else {
                props.cardTable.setTableData(tableId, { rows: [] });
            }

        }
    }
    else {
        props.form.EmptyAllFormValue(formId);
        props.cardTable.setTableData(tableId, { rows: [] });
    }
}

//更新卡片表体数据，应用于卡片子表数据较多，只更新处理的数据
export const loadPageValue2 = function (data, props) {
    if (data) {
        if (data.head) {
            props.form.setAllFormValue({ [formId]: data.head[formId] });
        }
        if (data.body) {
            if (data.body[tableId]) {
                props.cardTable.updateDataByRowId(tableId, data.body[tableId],true);
            } else {
                props.cardTable.setTableData(tableId, { rows: [] });
            }
        }
    }
    else {
        props.form.EmptyAllFormValue(formId);
        props.cardTable.setTableData(tableId, { rows: [] });
    }
}

export const queryCard = function (props) {
    let that = this;
    if (!props.getUrlParam('status')) {
        toggleShow(that, props);
        return;
    }
    if (props.getUrlParam('status') != 'add') {
        let data = { pk_bill: props.getUrlParam('id'), pageId: `${props.getSearchParam('c')}_card`  };
        var url = '/nccloud/uapbd/compelecompa/querycard.do';
        let cardData;
        if (props.getUrlParam('status') == 'edit') {
            //页面修改不从缓存中查数据
        } else if (props.getUrlParam('status') != 'refresh') {
            //页面刷新不从缓存中查数据
            cardData = getCacheById(props.getUrlParam('id'), that.props.dataSource);
        } else {
            //刷新更新状态为浏览态
            props.setUrlParam({ status: 'browse' });
        }
        if (cardData) {
            loadPageValue(cardData, props);
            toggleShow(that, props);
            if (props.getUrlParam('status') == 'edit') {
                //修改状态不可编辑财务组织
                that.props.form.setFormItemsDisabled(formId, { 'pk_org': true });
            } else {
                //其他状态可编辑财务组织
                that.props.form.setFormItemsDisabled(formId, { 'pk_org': false });
            }
        } else {
            ajax({
                url: url,
                data: data,
                async: false,//同步
                success: (res) => {
                    if (props.getUrlParam('status') == 'edit' ) {
                        that.state.buttonflag = true;
                    } else {
                        that.state.buttonflag = null;
                    }
                    var vbillcodeEdit = res.data.userjson;
                    //根据编码规则设置合同编码是否可编辑
                    if ("false" == vbillcodeEdit || false == vbillcodeEdit) {
                        //不可编辑
                        that.props.form.setFormItemsDisabled(formId, { vbillcode: true });
                    }
                    else {
                        //可编辑
                        that.props.form.setFormItemsDisabled(formId, { vbillcode: false });
                    }
                    if (props.getUrlParam('status') == 'edit') {
                        //修改状态不可编辑财务组织
                        that.props.form.setFormItemsDisabled(formId, { 'pk_org': true });
                    } else {
                        //其他状态可编辑财务组织
                        that.props.form.setFormItemsDisabled(formId, { 'pk_org': false });
                    }
                    loadPageValue(res.data, props);
                    toggleShow(that, props);
                        updateCache(pkname, that.props.getUrlParam('id'), res.data, formId, that.props.dataSource);
                },
                error: (res) => {
                    that.props.form.EmptyAllFormValue(that.formId);
                    that.props.cardTable.setTableData(that.tableId, { rows: [] });
                    deleteCacheById(pkname, props.getUrlParam('id'), that.props.dataSource);
                    toggleShow(that, props);
                    toast({ color: 'danger', content: res.message });
                }
            });
        }
    } else {
        initAdd(that, false);
    }

}


//保存数据方法
export const SaveBill = function (props) {
    let that = this;
    let url = '';
    if (props.getUrlParam('status') == 'add' ) {
        //新增保存
        url = '/nccloud/uapbd/compelecompa/insertsave.do';
    } else if (props.getUrlParam('status') == 'edit') {
        //修改保存
        url = '/nccloud/uapbd/compelecompa/updatesave.do';
    }
    //子表进行判空过滤,核算要素、材料为空，则过滤掉
    that.props.cardTable.filterEmptyRows(tableId, ['costcompid'], 'include');

    if (!that.props.form.isCheckNow(formId)) {
        //表单验证
        return;
    }
    if (!that.props.cardTable.checkTableRequired(tableId)) {
        //表格验证
        return;
    }

    let CardData = that.props.createMasterChildData(`${props.getSearchParam('c')}_card` , formId, tableId);
    let newCardData = dealCardData(that, CardData);//去掉空值，减少压缩时间
    let callback = () => {
        ajax({
            url: url,
            data: newCardData,
            async: false,
            success: (res) => {
                toast({ color: 'success', content: that.state.json['10140CECA-000007'] });/* 国际化处理： 保存成功*/
                that.props.beforeUpdatePage();//打开开关
                //根据差异数据模型更新表格数据，降低流量
                loadPageValue2(res.data, that.props);
                that.props.form.setFormStatus(formId, 'browse');
                that.props.cardTable.setStatus(tableId, 'browse');
                that.props.updatePage(formId, tableId);//关闭开关

                let cstuffid = that.props.form.getFormItemsValue(formId, pkname).value;
                //关闭整单保单的页签
                if (that.Info.isModelSave) {
                    that.Info.isModelSave = false;
                    that.props.cardTable.closeModel(tableId);
                }
                //重新拉取页面数据作为缓存
                var data = that.props.createMasterChildData(`${props.getSearchParam('c')}_card` , formId, tableId);
                if (props.getUrlParam('status') == 'add' )//新增保存
                {
                    addCache(cstuffid, data, formId, that.props.dataSource);
                }
                else if (props.getUrlParam('status') == 'edit')//修改保存
                {
                    updateCache(pkname, cstuffid, data, formId, that.props.dataSource);
                }
                that.props.setUrlParam({ status: 'browse', id: cstuffid });
                toggleShow(that, that.props,true);
            }
        });
    }
    //保存前数据校验
    that.props.validateToSave(newCardData, callback, { table1: tableTypeObj }, dataValiType);
};
//清空表体主键pk,可增加其他清楚逻辑
export const resetBodyPk = function (props, index) {
    props.cardTable.setValByKeyAndIndex(tableId, index, bodypkname, { value: null });
}
export const initAdd = function (that, flag) {
    let pk_org = getContext("pk_org");
    let org_Name = getContext("org_Name");
    that.props.setUrlParam({ status: 'add' })
    that.state.buttonflag = true;
    that.props.form.setFormItemsDisabled(formId, { 'pk_org': false });
    that.props.cardTable.setStatus(tableId, 'edit');
    that.props.form.setFormStatus(formId, 'edit');
    that.props.form.EmptyAllFormValue(formId);
    that.props.cardTable.setTableData(tableId, { rows: [] });
    that.props.cardTable.addRow(tableId,undefined,null,false);
    // that.props.initMetaByPkorg();
    //新增时作业编码，名称字段不显示
    if (!flag && pk_org && org_Name) {
        //如果个性化中心设置了财务组织，该处构造一次编辑后事件
        let aftervalue = {}
        aftervalue.refname = org_Name;
        aftervalue.value = pk_org;
        //附加默认值给框
        that.props.form.setFormItemsValue(formId, { pk_org: { value: pk_org, display: org_Name } });
        //调用一次财务组织编辑后事件
        headAfterEvent.call(that, that.props, formId, 'pk_org', aftervalue);
    } else {
        toggleShow(that, that.props);
    }
}
/**
 * 打印
 */
export const onPrint = function (that, props) {
    let printData = that.props.createMasterChildData(`${props.getSearchParam('c')}_card` , formId, tableId);
    let pk_data = printData.head[formId].rows[0].values[pkname].value;
    var pk = [];
    pk.push(pk_data);
    print(
        'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        '/nccloud/uapbd/compelecompa/print.do', //后台服务url
        {
            billtype: billtype, //单据类型
            funcode: funcode, //功能节点编码，即模板编码
            nodekey: nodekey, //模板节点标识
            oids: pk, // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
            // userjson: billtype //单据类型,billtype不是必需字段，后台没有设置接收字段，以userjson代替
        }
    );
};
/**
  * 打印输出
  */
export const onOutput = function (that, props) {
    let printData = that.props.createMasterChildData(`${props.getSearchParam('c')}_card` , formId, tableId);
    let pk_data = printData.head[formId].rows[0].values[pkname].value;
    var pk = [];
    pk.push(pk_data);
    output({
        url: '/nccloud/uapbd/compelecompa/printoutput.do',
        data: {
            outputType: 'output', //输出类型
            funcode: funcode, //功能节点编码，即模板编码
            nodekey: nodekey, //模板节点标识
            oids: pk // 功能节点的数据主键 oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
        },
    });
};
//附件
export const openFile = function (that, props) {
    let printData = that.props.createMasterChildData(`${props.getSearchParam('c')}_card` , formId, tableId);
    let pk = printData.head[formId].rows[0].values[pkname].value;
    let vbillcode = printData.head[formId].rows[0].values.vbillcode.value;
    that.setState({
        checkId: pk,
        checkValue: vbillcode
    }, () => {
        if (that.state.showUploader == false) {
            that.setState({ showUploader: true });
        } else {
            that.setState({ showUploader: false });
        }
    });
}
/**
* 卡片导出
*/
export const exportcFun = function (that, props) {
    if(that.state.forceRender){
        that.setState({forceRender: false})
    }
    let exprotData = that.props.createMasterChildData(`${props.getSearchParam('c')}_card` , formId, tableId);
    let pk_data = exprotData.head[formId].rows[0].values[pkname].value;
    let pk_bills = [];
    pk_bills.push(pk_data);
    that.Info.selectedPKS = pk_bills;//传递主键数组,之前nc需要导出的加主键
    that.props.modal.show('exportFileModal');//不需要导出的只执行这行代码
};
//单据追溯
export const openBillTrack = function (that, props) {
    var exprotData = that.props.createMasterChildData(`${props.getSearchParam('c')}_card` , formId, tableId);
    var pk_data = exprotData.head[formId].rows[0].values[pkname].value;
    that.setState({
        trackshow: true,
        checkId: pk_data
    })
}
//m8Lcnc0K+IWU/vxCSPSM8daqwGx71wBVba3jQ+ZDbEHnnpO2/lKwINK7kaqERTNK