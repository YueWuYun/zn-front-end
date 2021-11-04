//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, cardCache, cacheTools, toast, createPageIcon } from 'nc-lightapp-front';
import { buttonClick, initTemplate, searchBtnClick, onRowClick,search } from '../list/events';
import {modify} from '../main'
import './index.less'
const { setDefData, getDefData } = cardCache;
const { get } = cacheTools;
let dataSource = 'uap.bcbd.barappobject.barappobjectcache';
class BarappObjectList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json: {},
            inlt: null,
            bodyMap: {},
            rollbackcodeObj:[]
        }
    }
    componentWillMount() {
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt });// 保存json和inlt到页面state中并刷新页面
            } else {
                console.log("未加载到多语资源");   // 未请求到多语资源的后续操作/* 国际化处理： 未加载到多语资源,未加载到多语资源*/
            }
        }
        this.props.MultiInit.getMultiLang({ 'moduleId': '1057-1057baor', 'domainName': 'uap', callback });
    }
    componentDidMount() {
        this.showMaterialData('code');
        //添加默认加载数据的方法
        let code = this.props.getUrlParam('code');
        if (code) {
            this.findChildbypk(code);
        } else {//从卡片页面回来的不重新加载
            this.getData();
        }
    }

    findChildbypk(code) {
        if (!code) return;
        let _this = this;
        ajax({
            url: '/nccloud/bcbd/barappregister/querydetail.do',
            data: code,
            success: (result) => {
                if (result && result.success && result.data && result.data.bodyMapGrid) {
                    _this.state.bodyMap[code] = result.data.bodyMapGrid;
                    _this.props.cardTable.setTableData('body', result.data.bodyMapGrid.body);
                } else {
                    _this.props.cardTable.setTableData('body', { rows: [] });
                }
            }
        });
    }

    getData() {
        let _this = this;
        this.setPageData(_this);
        // ajax({
        //     url: '/nccloud/bcbd/barappregister/queryAll.do',
        //     success: (res) => {
        //         if (res.success) {
        //             _this.setPageData(_this, res);
        //         }
        //     }
        // })
    }



    showMaterialData(nodeType) {
        let _this = this;

        let data ={
           
                 head:{
                    rows: [{
                        status: "0",
                        isOptimized: false,
                        values: {
                            versionName: {},
                            code: { value: "01" },
                            name: { value: "成本中心结构1" },
                            default: { value: "是" },
                            versionNumber:{value:"202001"},
                            versionName:{value:"初始版本"},
                            effectiveDate:{value:"2020-2-15"},
                            expirationDate:{value:"9999-12-31"},
                            enable:{value:"已启用"},
                            creatPerson:{value:"张三"},
                            creatData:{value:"2020-1-1"},
                            Lastmodifiedby:{value:"李四"},
                            pk_code:{values:""}
                        }
                    }]
                 }
                 
            
         
           
        }
        _this.props.editTable.setTableData('head', data.head);
    
    }











    setPageData(_this, res) {
        let data ={
            headListGrid:{
                 head:{
                    rows: [{
                        status: "0",
                        isOptimized: false,
                        values: {
                            versionName: {},
                            code: { value: "01" },
                            name: { value: "成本中心结构1" },
                            default: { value: "是" },
                            versionNumber:{value:"202001"},
                            versionName:{value:"初始版本"},
                            effectiveDate:{value:"2020-2-15"},
                            expirationDate:{value:"9999-12-31"},
                            enable:{value:"已启用"},
                            creatPerson:{value:"张三"},
                            creatData:{value:"2020-1-1"},
                            Lastmodifiedby:{value:"李四"},
                            pk_code:{value:'1'}
                        }
                    }]
                 }
            }
    
        }
        if (!data) {
            toast({ color: 'danger' });
            return;
        }
        if (data.errmsg) {
            toast({ color: 'danger', content: res.data.errmsg });
            return;
        }
        if (data && data.headListGrid != null) {
            let head = data.headListGrid.head;
            let key = data.headListGrid.head.rows[0].values.code.value;
            _this.props.table.setAllTableData('head', head);
            toast({ content: _this.state.inlt && _this.state.inlt.get('barappobject-000014', { 'total': head.rows.length }), color: "success" });/* 国际化处理： 查询成功,共 {total} 条。*/
        } else {
            _this.props.table.setAllTableData('head', { rows: [] });
            toast({ content: _this.state.json['barappobject-000011'], color: 'warning' });/* 国际化处理： 未查询出符合条件的数据*/
        }
    }
    render() {
        let { button, search, modal, ncmodal, table, cardTable } = this.props;
        let { NCCreateSearch } = search;
        let { createButton, createButtonApp } = button;
        let { createModal } = modal;
        let { createSimpleTable } = table;
        let { createEditTable } = this.props.editTable;
        let { createCardTable } = cardTable;
        const { createBillHeadInfo } = this.props.BillHeadInfo;
        const { NCDiv,NCCheckbox } = base;
        return (
            <div className="nc-single-table">
                <NCDiv areaCode={NCDiv.config.HEADER}>
                    <div className="nc-singleTable-header-area">
                        <div className="header-title-search-area">
                            <span>
                                {createBillHeadInfo({
                                    title: "成本中心结构--集团",
                                    initShowBackBtn: false          //标题
                                })}
                            </span>
                            <div className="demo-checkbox" style={{marginTop:"8px"}}>
                                <NCCheckbox colors="dark">显示停用</NCCheckbox>
                            </div>
                        </div>
                        {/**条码对象注册表头按钮区域*/}
                        <div className="header-button-area">
                            {this.props.button.createButtonApp({
                                area: 'head',
                                buttonLimit: 15,
                                onButtonClick: buttonClick.bind(this),
                                popContainer: document.querySelector('.header-button-area')
                            })}
                        </div>
                    </div>
                </NCDiv>
                {/**查询区域*/}
                <div>
                <div className="nc-singleTable-search-area">
                    {NCCreateSearch('query', {
                        clickSearchBtn: searchBtnClick.bind(this),
                        showAdvBtn: true,
                        showClearBtn: false,//显示清空
                        showSearchBtn: false,//显示查询按钮
                        onlyShowPlan: false, // 显示方案列表
                    })}
                </div>
                {/**列表表头区域*/}
                <div className="nc-singleTable-table-area">
                    {this.props.editTable.createEditTable('head', {
                        showIndex: true,
                        showCheck: false,
                        hideSwitch: false,
                        adaptionHeight: true,
                        dataSource: dataSource,
                        pkname: "code",
                        onRowClick: onRowClick.bind(this)
                    })}
                    {/* {createCardTable('body', { showIndex: true,hideSwitch:()=>{return false} })} */}
                </div>
                {/* {createModal('attrclass', {})}
                {this.props.ncmodal.createModal('ncmodal', {})} */}
                </div>
            </div>
        )
    }
}
BarappObjectList = createPage({
    initTemplate: initTemplate,
})(BarappObjectList);

ReactDOM.render(<BarappObjectList/>, document.querySelector('#app'));


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65