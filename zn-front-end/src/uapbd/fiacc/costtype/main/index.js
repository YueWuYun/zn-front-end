//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { base, createPage, ajax, toast, promptBox,print } from 'nc-lightapp-front';
import  Utils from '../../../public/utils';
const { NCDiv, NCFormControl, NCCheckbox } = base;

const pagecode = '10140CT_list';
const tableid = 'costtype_table';
const urls = {
    saveUrl: '/nccloud/uapbd/costtype/save.do', // 保存URL
    queryUrl: '/nccloud/uapbd/costtype/query.do', // 查询URL
    enableUrl: '/nccloud/uapbd/costtype/enable.do', // 启用
    disableUrl: '/nccloud/uapbd/costtype/disable.do', // 停用
    printUrl: '/nccloud/uapbd/costtype/costTypePrint.do' // 停用
}

/**
 * 费用类型-列表
 * @date 2020-03-04
 */
class CostTypeList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showStopped: false, // 显示停用
            tableData: {rows:[]}, // 表格数据维护到state,页面简单查询时不再请求后台
            searchStr: '' // 查询字符串
        }

        this.initTemplate({ pagecode: pagecode }, { moduleId: "10140CT", domainName: 'uapbd' }, (lang, data) => {
            this.lang = lang; // 多语数据
            if (data.template) {
                let meta = data.template;
                this.modifierMeta(this.props, meta); // 修改meta
                this.props.meta.setMeta(meta, () => {
                    if (data.button) {
                        this.props.button.setButtons(data.button, () => {
                            this.setButtonsStatus(); // 按钮状态设置
                        });
                    }
                    this.queryData({ showStopped: false }); // 获取数据-默认不显示停用
                });
            }
        });
    }

    /**
     * 加载多语和模板信息
     * @param {*} templateParam 请求模板参数
     * @param {*} langParam 请求多语参数
     * @param {*} callback 回调函数
     */
    initTemplate(templateParam, langParam, callback=()=>{}) {

        // 模板数据和多语数据
        let templateInfo,langInfo;
        
        // 加载多语数据
        this.props.MultiInit.getMultiLang(Object.assign(langParam, {callback:(json, status, inlt)=>{
            langInfo = json;
            this.inlt = inlt;
            !!templateInfo && callback(langInfo, templateInfo); 
        }})); 
        
        // 加载模板数据
        this.props.createUIDom(templateParam, (data)=>{
            templateInfo = data;
            !!langInfo && callback(langInfo, templateInfo);
        });
    }

    /**
     * 修改meta，添加操作列
     * @param {*} props 
     * @param {*} meta 
     */
    modifierMeta(props,meta) {
        // 表格行内按钮事件
        let tableButtonClick = (props, id, text, record, index)=>{
            this.oprBtnClick(props, id, text, record, index);
        }
        // 添加表格操作列
        let event = {
            label: this.lang['10140CT-000011'], /* 国际化处理： 操作 */
            attrcode: 'opr',
            key: 'opr',
            itemtype: 'customer',
            visible:true,
            fixed: 'right',
            render(text, record, index) {
                return props.button.createOprationButton(
                    ['delete_opr'],
                    {
                        area:'table_inner',
                        buttonLimit:3,
                        onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
                    }
                );
            }
        };
        meta[tableid].items.push(event);
        return meta;
    }

    /**
     * 按钮状态控制
     */
    setButtonsStatus(){
        let tableStatus = this.props.editTable.getStatus(tableid);
        
        if(tableStatus == 'edit'){ // 编辑态
            this.props.button.setButtonsVisible({
                add: true,
                edit: false,
                save: true,
                cancel: true,
                delete: true,
                printList:true
            });

            // 主要按钮设置
            this.props.button.setMainButton('save', true);
            this.props.button.setMainButton('add', false);

        } else if(tableStatus == 'browse'){ // 浏览态
            this.props.button.setButtonsVisible({
                add: true,
                edit: true,
                save: false,
                cancel: false,
                delete: true,
                printList:true
            });

            // 主要按钮设置
            this.props.button.setMainButton('add', true);
            this.props.button.setMainButton('save', false);
        }  
    }

    /**
     * 按钮事件
     * @param {*} props 
     * @param {*} id 按钮编码
     */
    onButtonClick(props, id){
        switch(id){
            case 'add':
                props.editTable.setStatus(tableid, 'edit');
                props.editTable.addRow(tableid);
                this.setButtonsStatus();
                break;

            case 'save':
                this.save();
                break;

            case 'edit':
                props.editTable.setStatus(tableid, 'edit');
                this.setButtonsStatus();
                break;

            case 'delete':
                this.delete();
                break;

            case 'cancel':
                this.cancel();
                break;

            case 'refresh':
                // 重新查询数据
                this.queryData( {showStopped: this.state.showStopped} );
                break;
            case 'enable':
                this.enable();
                break;
            case 'disable':
                this.disable();
                break;
            case 'printList':
                this.printList();
                break;
            default:
                break;
        }
    }

    /**
     * 表格行内按钮事件
     * @param {*} props 
     * @param {*} id 
     * @param {*} text 
     * @param {*} record 
     * @param {*} index 
     */
    oprBtnClick(props, id, text, record, index){
        switch(id){
            case 'delete_opr': // 表格行内删除按钮
                this.deleteOpr(record, index);
                break;

            default :
                break;
        }
    }

    /**
     * 保存按钮-事件
     */
    save() {
        this.props.editTable.filterEmptyRows(tableid, []);
        let allTableRows = this.props.editTable.getAllRows(tableid, true);
        if (!this.props.editTable.checkRequired(tableid, allTableRows)) {
            return;
        }

        // 只获取改变的数据行
        let tableData = this.props.editTable.getChangedRows(tableid);
        if (!tableData || tableData.length === 0) {
            this.props.editTable.cancelEdit(tableid, this.setButtonsStatus());
            toast({ title: this.lang['10140CT-000003'], color: 'success' }); /* 国际化处理： 保存成功！*/
            return;
        }

        // 此处改成getAllRows获取表格所有数据传递给后台，为了返回正常的提示行号
        tableData = this.props.editTable.getAllRows(tableid);
        let data = {
            pageid: pagecode,
            model: {
                areaType: "table",
                areacode: tableid,
                pageinfo: null,
                rows: []
            }
        };
        data.model.rows = tableData;
        let saveFunction = () => {
            this.saveData(data);
        }
        this.props.validateToSave(data, saveFunction, { [tableid]: 'table' }, 'grid');
    }

    /**
     * 删除按钮-事件
     */
    delete() {
        let selectedData = this.props.editTable.getCheckedRows(tableid); // 选中数据
        if (selectedData.length == 0) {
            toast({ content: this.lang['10140CT-000012'], color: 'warning' }); /* 国际化处理： 请选择数据！ */
            return;
        }

        let indexArr = [];
        let dataArr = [];
        selectedData.forEach((val) => {
            let delObj = {
                rowId: val.data.rowId,
                status: '3',
                values: {
                    ts: { 
                        display: this.lang['10140CT-000013'], /* 国际化处理： 时间戳 */ 
                        value: val.data.values.ts.value
                    },
                    pk_costtype: { 
                        display: this.lang['10140CT-000014'], /* 国际化处理： 主键 */ 
                        value: val.data.values.pk_costtype.value
                    },
                    name: { 
                        display: this.lang['10140CT-000015'], /* 国际化处理： 名称 */ 
                        value: val.data.values.name.value
                    },
                    code: { 
                        display: this.lang['10140CT-000016'], /* 国际化处理： 编码 */ 
                        value: val.data.values.code.value
                    }
                }
            };
            dataArr.push(delObj);
            indexArr.push(val.index);
        });
        let data = {
            pageid: pagecode,
            model: {
                areaType: 'table',
                pageinfo: null,
                rows: dataArr
            }
        };

        let pageStatus = this.props.editTable.getStatus(tableid);
        if(pageStatus && pageStatus=='edit'){
            // 编辑态删除数据，只是从页面上移除数据，保存时再调后台接口去删除
            this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
            return;
        }

        // 确认删除提示
        promptBox({
            color:"warning",
            title: this.lang['10140CT-000018'], /* 国际化处理： 确认删除 */
            content: this.lang['10140CT-000019'], /* 国际化处理： 是否确认要删除？*/
            noFooter: false,
            noCancelBtn: false,
            beSureBtnName: this.lang['10140CT-000009'], /* 国际化处理： 确定 */
            cancelBtnName: this.lang['10140CT-000010'], /* 国际化处理： 取消 */
            beSureBtnClick: () => {
                this.saveData(data, ()=>{
                    this.props.editTable.deleteTableRowsByIndex(tableid, indexArr); // 页面上删掉已删除数据
                    toast({ title: this.lang['10140CT-000017'], color: 'success' }); /* 国际化处理： 删除成功！*/
                });
            }
        });
    }


    /**
     * 启用按钮-事件
     */
    enable() {
        let selectedData = this.props.editTable.getCheckedRows(tableid); // 选中数据
        if (selectedData.length == 0) {
            toast({ content: this.lang['10140CT-000012'], color: 'warning' }); /* 国际化处理： 请选择数据！ */
            return;
        }

        let indexArr = [];
        let dataArr = [];
        selectedData.forEach((val) => {
            let rowDate = {
                pk_bill : val.data.values.pk_costtype.value,
                pageId : pagecode,
                index : val.index
            }
            dataArr.push(rowDate);
            indexArr.push(val.index);
        });

        let pageStatus = this.props.editTable.getStatus(tableid);
        if(pageStatus && pageStatus=='edit'){
            // 编辑态删除数据，只是从页面上移除数据，保存时再调后台接口去删除
            this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
            return;
        }

        // 确认启用提示
        promptBox({
            color:"warning",
            title: this.lang['10140CT-000020'], /* 国际化处理： 确认启用 */
            content: this.lang['10140CT-000021'], /* 国际化处理： 是否确认要启用？*/
            noFooter: false,
            noCancelBtn: false,
            beSureBtnName: this.lang['10140CT-000009'], /* 国际化处理： 确定 */
            cancelBtnName: this.lang['10140CT-000010'], /* 国际化处理： 取消 */
            beSureBtnClick: () => {
                this.enableData(dataArr, (resultDate)=>{
                    // this.props.editTable.deleteTableRowsByIndex(tableid, indexArr); // 页面上删掉已删除数据
                    dataArr.forEach((val) => {
                        this.props.editTable.setValByKeyAndIndex(tableid,val.index,'enablestate',{value: resultDate[val.index].values.enablestate.value, display:resultDate[val.index].values.enablestate.display, scale:0,isEdit:false })
                    });
                    toast({ title: this.lang['10140CT-000024'], color: 'success' }); /* 国际化处理： 启用成功！*/
                });
            }
        });
    }

    /**
     * 启用
     * @param {*} data 保存请求参数
     * @param {*} callBack 保存后的回调
     */
    enableData(dataArr, callBack=(resultDate)=>{ toast({title:this.lang['10140CT-000003'], color:'success'}); /* 国际化处理： 保存成功！*/}) {
        ajax({
            url: urls['enableUrl'],
            data:dataArr,
            success: (res) => {
                let { success, data } = res;
                let resultDate;
                if (success) {
                    this.props.editTable.setStatus(tableid, 'browse'); // 设置表格状态为浏览态
                    this.setButtonsStatus(); // 更新按钮状态
                    if (data) {
                        resultDate = data.grid;
                    }
                    callBack && callBack(resultDate); // 执行回调
                }
            }
        });
    }

    printList(){
        let data = this.props.editTable.getAllRows(tableid);
        let indexPk = [];
        data.forEach((dataVar)=>{
            indexPk.push(dataVar.values.pk_costtype.value);
        });
        print(
            'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
            urls['printUrl'], //后台服务url
            {
                // billtype: 'RA00', //单据类型
                funcode: '10140CT', //功能节点编码，即模板编码---冲销、审核、查询使用的打印模板和凭证录入是一套模板，所以这里传入凭证录入编码即可
                nodekey: '10140CT', //模板节点标识
                oids: indexPk, // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
                // userjson: billtype //单据类型,billtype不是必需字段，后台没有设置接收字段，以userjson代替
            }
        );
    }



    /**
     * 停用按钮-事件
     */
    disable() {
        let selectedData = this.props.editTable.getCheckedRows(tableid); // 选中数据
        if (selectedData.length == 0) {
            toast({ content: this.lang['10140CT-000012'], color: 'warning' }); /* 国际化处理： 请选择数据！ */
            return;
        }

        let indexArr = [];
        let dataArr = [];
        selectedData.forEach((val) => {
            let rowDate = {
                pk_bill : val.data.values.pk_costtype.value,
                pageId : pagecode,
                index : val.index
            }
            dataArr.push(rowDate);
            indexArr.push(val.index);
        });

        let pageStatus = this.props.editTable.getStatus(tableid);
        if(pageStatus && pageStatus=='edit'){
            // 编辑态删除数据，只是从页面上移除数据，保存时再调后台接口去删除
            this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
            return;
        }

        // 确认启用提示
        promptBox({
            color:"warning",
            title: this.lang['10140CT-000022'], /* 国际化处理： 确认启用 */
            content: this.lang['10140CT-000023'], /* 国际化处理： 是否确认要启用？*/
            noFooter: false,
            noCancelBtn: false,
            beSureBtnName: this.lang['10140CT-000009'], /* 国际化处理： 确定 */
            cancelBtnName: this.lang['10140CT-000010'], /* 国际化处理： 取消 */
            beSureBtnClick: () => {
                this.disableData(dataArr, (resultDate)=>{
                    // this.props.editTable.deleteTableRowsByIndex(tableid, indexArr); // 页面上删掉已删除数据
                    dataArr.forEach((val) => {
                        if(!this.state.showStopped){
                            this.props.editTable.deleteTableRowsByIndex(tableid, indexArr); // 页面上删掉已删除数据
                        }else{
                            this.props.editTable.setValByKeyAndIndex(tableid,val.index,'enablestate',{value: resultDate[val.index].values.enablestate.value, display:resultDate[val.index].values.enablestate.display, scale:0,isEdit:false })
                        }
                    });

                    toast({ title: this.lang['10140CT-000025'], color: 'success' }); /* 国际化处理： 启用成功！*/
                });
            }
        });
    }

    /**
     * 停用
     * @param {*} data 保存请求参数
     * @param {*} callBack 保存后的回调
     */
    disableData(dataArr, callBack=(resultDate)=>{ toast({title:this.lang['10140CT-000003'], color:'success'}); /* 国际化处理： 保存成功！*/}) {
        ajax({
            url: urls['disableUrl'],
            data:dataArr,
            success: (res) => {
                let { success, data } = res;
                let resultDate;
                if (success) {
                    this.props.editTable.setStatus(tableid, 'browse'); // 设置表格状态为浏览态
                    this.setButtonsStatus(); // 更新按钮状态
                    if (data) {
                        resultDate = data.grid;
                    }
                    callBack && callBack(resultDate); // 执行回调
                }
            }
        });
    }




    
    /**
     * 表格行内按钮点击事件
     * @param {*} record 
     * @param {*} index 
     */
    deleteOpr(record, index){
        let delObj = {
			rowId: index,
			status: '3',
            values: {
                ts: { 
                    display: this.lang['10140CT-000013'], /* 国际化处理： 时间戳 */ 
                    value: record.values.ts.value
                },
                pk_costtype: { 
                    display: this.lang['10140CT-000014'], /* 国际化处理： 主键 */ 
                    value: record.values.pk_costtype.value
                },
                name: { 
                    display: this.lang['10140CT-000015'], /* 国际化处理： 名称 */ 
                    value: record.values.name.value
                },
                code: { 
                    display: this.lang['10140CT-000016'], /* 国际化处理： 编码 */ 
                    value: record.values.code.value
                }
            }
		};
		let indexArr=[];
		indexArr.push(index);
		let data = {
			pageid:pagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: [ delObj ]
			}
        };

        let pageStatus = this.props.editTable.getStatus(tableid);
        if(pageStatus && pageStatus=='edit'){
            // 编辑态删除数据，只是从页面上移除数据，保存时再调后台接口去删除
            this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
            return;
        }
        
        // 确认删除
        promptBox({
            color:"warning",
            title: this.lang['10140CT-000018'], /* 国际化处理： 确认删除 */
            content: this.lang['10140CT-000019'], /* 国际化处理： 是否确认要删除？*/
            noFooter: false,
            noCancelBtn: false,
            beSureBtnName: this.lang['10140CT-000009'], /* 国际化处理： 确定 */
            cancelBtnName: this.lang['10140CT-000010'], /* 国际化处理： 取消 */
            beSureBtnClick: () => {
                this.saveData(data, ()=>{
                    this.props.editTable.deleteTableRowsByIndex(tableid, indexArr); // 页面上删掉已删除数据
                    toast({ title: this.lang['10140CT-000017'], color: 'success' }); /* 国际化处理： 删除成功！*/
                });
            }
        });
    }

    /**
     * 取消按钮-事件
     */
    cancel(){
        promptBox({
            color:"warning",
            title: this.lang['10140CT-000007'], /* 国际化处理： 确认取消 */
            content: this.lang['10140CT-000008'], /* 国际化处理： 是否确认要取消？*/
            noFooter: false,
            noCancelBtn: false,
            beSureBtnName: this.lang['10140CT-000009'], /* 国际化处理： 确定 */
            cancelBtnName: this.lang['10140CT-000010'], /* 国际化处理： 取消 */
            beSureBtnClick: () => {
                this.props.editTable.setStatus(tableid, 'browse');
                this.props.editTable.cancelEdit(tableid, this.setButtonsStatus());
            }
        });
    }

    /**
     * 查询数据
     * @param {*} params 
     */
    queryData(params) {
        ajax({
            url: urls['queryUrl'],
            data: { ...params },
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data && data[tableid]) {
                        let sum = data[tableid].rows.length;
                        if (sum == 0) {
                            toast({ title: this.lang['10140CT-000004'], color: 'warning' }); /* 国际化处理： 未查询到符合条件的数据！*/
                            this.props.editTable.setTableData(tableid, { rows: [] });
                            return;
                        }
                        toast({ title: this.lang['10140CT-000005'] + sum + this.lang['10140CT-000006'], color: 'success' }); /* 国际化处理：查询成功，共N条数据！ */
                        this.setState({ tableData: data[tableid] }, () => {
                            this.props.editTable.setTableData(tableid, data[tableid]);
                        });
                    } else {
                        toast({ title: this.lang['10140CT-000004'], color: 'warning' }); /* 国际化处理： 未查询到符合条件的数据！*/
                        this.props.editTable.setTableData(tableid, { rows: [] });
                        return;
                    }
                }
            }
        });
    }

    /**
     * 保存数据方法。单表中新增、修改、删除都调这个方法。
     * @param {*} data 保存请求参数
     * @param {*} callBack 保存后的回调
     */
    saveData(data, callBack=()=>{ toast({title:this.lang['10140CT-000003'], color:'success'}); /* 国际化处理： 保存成功！*/}) {
        ajax({
            url: urls['saveUrl'],
            data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    this.props.editTable.setStatus(tableid, 'browse'); // 设置表格状态为浏览态
                    this.setButtonsStatus(); // 更新按钮状态
                    if (data) {
                        let addData = this.props.editTable.getAllData(tableid);
                        Utils.filterDelRows(addData.rows); // 过滤清除删除状态的行
                        Utils.filterResult(addData, data[tableid].rows); // 将保存后返回的数据重新放置到页面
                        this.props.editTable.setTableData(tableid, addData);
                    }

                    callBack && callBack(); // 执行回调
                }
            }
        });
    }

    /**
     * 简单查询事件
     * @param {*} searchStr 
     */
    onSearch(searchStr) {
        this.setState({ searchStr: searchStr }, () => {

            let tableData = Utils.clone(this.state.tableData);

            if (searchStr.trim() === '') {
                // 清空查询字符串时，还原数据，不会重新查询数据
                this.props.editTable.setTableData(tableid, tableData);
            } else if (tableData.rows.length > 0) {
                let rows = [];
                for (var row of tableData.rows) {
                    if (row.values['code'].value.indexOf(searchStr) > -1 || row.values['name'].value.indexOf(searchStr) > -1) {
                        rows.push(row);
                    }
                }
                tableData.rows = rows;
                this.props.editTable.setTableData(tableid, tableData);
            }
        });
    }

    /**
     * 显示停用复选框事件
     * @param {*} value 
     */
    showOffChange(value) {
        this.setState({ showStopped: value }, () => {
            // 查询数据
            this.queryData({ showStopped: value });
        });
    }

    render() {

        let { button, editTable, BillHeadInfo } = this.props;
        let { createEditTable } = editTable;
        let { createButtonApp } = button;
        let { createBillHeadInfo } = BillHeadInfo;

        if(!this.lang){ // 多语未加载完不渲染
            return('');
        }

        return (
            <div className="nc-single-table">
                
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area">
                    {/* 标题 */}
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title: this.lang['10140CT-000000'],/* 国际化处理： 费用类型-集团*/
                            initShowBackBtn: false
                        })}

                        {/* 简单查询 */}
                        <div className="title-search-detail">
                            <NCFormControl
                                placeholder = {this.lang['10140CT-000001']} /* 国际化处理： 请输入编码或名称筛选*/
                                onChange = { this.onSearch.bind(this) }
                                value = { this.state.searchStr }
                                type = "search"
                            />
                        </div>

                        {/* 显示停用数据 */}
                        <div className="title-search-detail">
                            <span className="showOff">
                                    <NCCheckbox
                                        onChange={ this.showOffChange.bind(this) }

                                    > {this.lang['10140CT-000002']}
                                    </NCCheckbox>
                             </span>
                        </div>
                    </div>

                    {/* 按钮区 */}
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'list_head',
                            buttonLimit: 3,
                            onButtonClick: this.onButtonClick.bind(this)
                        })}
                    </div>
                </NCDiv>
                

                {/* 列表区 */}
                <div className="nc-singleTable-table-area">
                    {createEditTable(tableid, {  
                        useFixedHeader: true, 
                        showIndex: true, // 显示序号
                        showCheck: true, // 显示复选框
                        adaptionHeight: true
                    })}
                </div>

            </div>
        );
    }
}

CostTypeList = createPage({})(CostTypeList);
ReactDOM.render(<CostTypeList/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65