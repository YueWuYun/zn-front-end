//U+xO9EJ8f20ioZgpwMLm8cz5mt8D/Pb5gko5600R0DakkdEDTVzqLLuC/2e2cBIFbnsynlLL1GXN
//TDfhqGaGKw==
import React, { Component } from 'react';
import { ajax, base,promptBox } from 'nc-lightapp-front';
import '../component/component.less';
import Utils from "../../../public/utils";
import {component} from '../../../public/platwapper/index.js';

let { NCPagination} = base;
const { NCTable,NCSelect } = component;

const {NCMessage:Message} = base;

var urls = {
    queryTemplateUrl: "/nccloud/platform/templet/querypage.do",
    queryUrl:"/nccloud/uapbd/sgmenu/queryAction.do",
    queryChildUrl:'/nccloud/uapbd/sgmenu/queryChildTableAction.do'
}
class MaterialSgmenuTable extends Component{
    constructor(props){
        super(props);
        this.config = Object.assign({
            pageCode:'10140SGMENU_10140SGMENU',
            headTableId:'material_vendor_h',
            bodyTableId:'material_vendor_b',
            tab:'0'
        },this.props.config);
        this.state = {
            headColumns:'',
            bodyColumns:'',
            meta:'',
            headTableData:[],
            bodyTableData:[],
            selectRow:'',
            selectBodyRow:'',
            json: props.config && props.config.json || '',
            pageInfo:{//分页
                total:'',
                totalPage:1,
                pageIndex:1,
                pageSize:10
            },
            searchData:''//分页前记录当前查询条件
        }
        this.initTemplate = this.initTemplate.bind(this);
        this.initColumns = this.initColumns.bind(this);
        this.loadHeadTableData  = this.loadHeadTableData.bind(this);
        this.loadBodyTableData  = this.loadBodyTableData.bind(this);
        this.getSelectedRow = this.getSelectedRow.bind(this);
        this.getHeadTableData = this.getHeadTableData.bind(this);
        this.getBodyTableData = this.getBodyTableData.bind(this);
        this.getSelectedBodyRow = this.getSelectedBodyRow.bind(this);
        this.getFormatBodyTableData = this.getFormatBodyTableData.bind(this);
        this.getCountOfHeadTable = this.getCountOfHeadTable.bind(this);
        this.setHeadTablePageIndex = this.setHeadTablePageIndex.bind(this);
        this.getHeadTablePageInfo = this.getHeadTablePageInfo.bind(this);
        this.changeHeadTableDataFormat = this.changeHeadTableDataFormat.bind(this);
        this.formatTableData = this.formatTableData.bind(this);
        this.dealFormulamsg = this.dealFormulamsg.bind(this);
    }
    componentWillMount(){
        this.initTemplate(()=>{
            this.initColumns();
        });
        //this.loadHeadTableData();
    }
    componentWillReceiveProps(newProps){
        let newConfig = newProps.config || {};
        this.state.json = newConfig.json;
        this.setState(this.state);
    }

    /**
     * 加载模板
     */
    initTemplate(callback){
        var me = this;
        //请求参数
        let requestParam = {
            pagecode:me.config.pageCode
        }
        //请求元数据模板
        ajax({
            url: urls["queryTemplateUrl"],
            data:requestParam,
            success: (res) =>{
                var meta = res.data;

                //设置元数据
                me.state.meta = meta;
                me.setState(me.state,()=>{
                    if(callback)
                        callback();
                });
            }
        });
    }

    /**
     * 初始化table对应的columns
     */
    initColumns(){
        var me = this;
        let title = (item)=>{
            let isRequiredClass = item.required ? "card-table-title-required":"card-table-title-unrequired";
            let style = item.color ? {color: item.color} : {color: ''};
            return (
                <div
                    className={isRequiredClass}
                    style={style}
                    fieldid={item.attrcode+"_table-area"}
                >
                    {item.required && <span className="mark-required">*</span>}
                    {item.label}
                </div>
            )
        };
        let headTableColumns = me.state.meta[me.config.headTableId].items.filter((item) => !!item.visible).map((item,index)=>{
            if(item.visible){
                let col;

                if('suppliercode,pk_supplier.code'.includes(item.attrcode)){
                    col = {
                        title: title(item),
                        dataIndex: item.attrcode,
                        attrcode:item.attrcode,
                        render:(value,record,index)=>{
                            return <a style={{color: '#007ace', cursor: 'pointer' }}
                                      onClick={
                                            ()=>{
                                                me.config.openDetail && me.config.openDetail(record.pk_supplier,me.state.meta.pageid)
                                            }
                                      }>{record[item.attrcode]}</a>
                        }
                    };
                }else{
                    col = {
                        title: title(item),
                        dataIndex: item.attrcode,
                        attrcode:item.attrcode,
                        render:(value,record,index)=>{
                            return (
                                <div style={{ textAlign: "middle" }}>
                                    <span>{record[item.attrcode]}</span>
                                </div>
                            )
                        }
                    };
                }
                return col;
            }
        });
        /**
         * 插入序号列
         */
        headTableColumns.unshift({
            title: me.state.json['10140SGMENU-000007'],/* 国际化处理： 序号*/
            dataIndex: 'numberindex',
            attrcode:'numberindex',
            className: 'table-index',
            width: '60px'
        });
        let bodyTableColumns = me.state.meta[me.config.bodyTableId].items.filter((item) => !!item.visible).map((item,index)=>{
            if(item.visible){
                var col =  {
                    title: title(item),
                    dataIndex: item.attrcode,
                    attrcode:item.attrcode,
                    width:item.width,
                    render:(value,record,index)=>{
                        if(item.attrcode.includes("."))
                            return (
                                <div style={{ textAlign: "middle" }} fieldid={item.attrcode+"_table-area"}>
                                    <span>{record[item.attrcode]}</span>
                                </div>
                            );
                        switch(item.itemtype){
                            case 'select':
                                let options = item.options;
                                let res = value == '0' || value == 0 ? "" : value;
                                options.map((item)=>{
                                    if(item.value == value)
                                        res = item.display;
                                });
                                return res;
                                break;
                            case 'checkbox':
                            case 'checkbox_switch':
                                return value == 'Y' ? me.state.json['10140SGMENU-000008'] : me.state.json['10140SGMENU-000009'];/!* 国际化处理： 是,否*!/
                                break;
                            default:
                                if(value == '0' || value == 0)
                                    return "";
                                else
                                    return (
                                        <div style={{ textAlign: "middle" }} fieldid={item.attrcode+"_table-area"}>
                                            <span>{record[item.attrcode]}</span>
                                        </div>
                                    )
                        }
                    }
                };
                return col;
            }
        });
        /**
         * 插入序号列
         */
        bodyTableColumns.unshift({
            title: me.state.json['10140SGMENU-000007'],/* 国际化处理： 序号*/
            dataIndex: 'numberindex',
            attrcode:'numberindex',
            className: 'table-index',
            width: '60px'
        });
        me.state.headColumns = headTableColumns;
        me.state.bodyColumns = bodyTableColumns;
        me.setState(me.state);
    }

    /**
     * 适配显示公式
     * @param obj
     */
    dealFormulamsg(obj){
        let me = this;
        let {formulamsg,callback} = obj;
        if (formulamsg && formulamsg instanceof Array && formulamsg.length > 0) {
            let mesArr = [];
            let n = 0;
            let m = 0;
            formulamsg.forEach(item=>{
                let attr = null;
                if(item.render)
                    attr = me.state.meta[item.render.areacode].items.find(ite => ite.attrcode == item.render.attrcode);
                if (item.type === '5') {
                    if(attr)
                        me.state.meta[item.render.areacode].items.find(ite => ite.attrcode == item.render.attrcode).color = item.render.color;
                }
                if (item.type === '3' || item.type === '4') {//设置编辑性，暂时不考虑

                }
                if (item.type === '1') {
                    mesArr.push({
                        title: '提示',
                        color: 'info',
                        content: item.message,
                        noCancelBtn: true,
                        type: '1'
                    });
                }
                if (item.type === '2') {
                    if (item.message) {
                        mesArr.push({
                            title: '错误',
                            color: 'danger',
                            content: item.message,
                            noCancelBtn: true,
                            type: '2'
                        });
                    }
                }
                if (item.type === '0') {
                    if (item.message) {
                        n++;
                        mesArr.push({
                            title: '确认',
                            color: 'success',
                            content: item.message,
                            noCancelBtn: false,
                            type: '0'
                        });
                    }
                }

            });
            me.setState(me.state,()=>{
                callback && callback();
                outPromptByArr(mesArr, 0);

                function outPromptByArr(Arr, index) {
                    if (index < Arr.length) {
                        promptBox({
                            title: Arr[index].title,
                            color: Arr[index].color,
                            content: Arr[index].content,
                            noCancelBtn: Arr[index].noCancelBtn,
                            beSureBtnClick: () => {
                                if (Arr[index].type === '0') {
                                    m++;
                                    if (m === n) {
                                        callback && callback();
                                    }
                                }
                                outPromptByArr(Arr, ++index);
                            },
                            cancelBtnClick: () => {
                                if (Arr[index].type === '0') {
                                    m > 0 ? m-- : m;
                                }
                                outPromptByArr(Arr, ++index);
                            }
                        });
                    }
                }
            });

        }else
            callback && callback();
    }
    /**
     * 获取总记录数
     * @returns {string}
     */
    getCountOfHeadTable(){
        return this.state.pageInfo.total;
    }
    getHeadTablePageInfo(){
        return this.state.pageInfo;
    }
    setHeadTablePageIndex(index,callback){
        if(index)
            this.state.pageInfo.pageIndex = index;
        else{
            if(this.state.pageInfo.pageIndex > 1)  this.state.pageInfo.pageIndex--;
        }
        this.setState(this.state,()=>{callback && callback()});
    }
    loadHeadTableData(param,callback){
        var me = this;
        let {searchData,oid,searchId} = param;
        //处理查询区有条件，且当前页非第一页情况，若有查询条件则默认第一页
        let pageInfo = searchData.conditions && searchData.conditions.length>0 ?
                    {//首页
                        total:'',
                        totalPage:1,
                        pageIndex:1,
                        pageSize:10
                    }:me.state.pageInfo;
        let requestParam = {
            querycondition:searchData,
            pageInfo:pageInfo,
            queryAreaCode:searchId,
            oid:oid,
            querytype:'tree',
            userdefObj:{
                tab:me.config.tab,
                pageInfo:me.state.pageInfo,
                areacode:me.config.headTableId,
                pageCode:me.config.pageCode
            }
        }
        //查询条件
        if(searchData){
            me.state.searchData = param;
            //me.setState(me.state);
        }
        ajax({
            url: urls["queryUrl"],
            data:requestParam,
            success: (res) =>{
                let{data,success,formulamsg}=res;
                if(success){
                    me.dealFormulamsg({
                        formulamsg,
                        callback:()=>{
                            me.initColumns();
                            if(data && data.hasOwnProperty("pageInfo")){
                                let {pageInfo,tableData} = data;
                                me.state.pageInfo = pageInfo;
                                me.setState(me.state,()=>{
                                    tableData[me.config.headTableId].rows.map((record,index)=>{
                                        record.numberindex = `${index+1+(me.state.pageInfo.pageIndex-1)*me.state.pageInfo.pageSize}`;
                                        if(index == 0)//默认选中第一条
                                            me.state.selectRow = record;
                                    });
                                    if(tableData && tableData[searchId] && tableData[searchId].rows.length == 0){
                                        me.state.bodyTableData=[];
                                        me.state.selectRow='';
                                    }
                                    me.state.headTableData = me.changeHeadTableDataFormat(tableData);
                                    me.setState(me.state,()=>{callback && callback()});
                                });
                            }else{
                                me.state.headTableData = [];
                                me.state.bodyTableData = [];
                                me.state.pageInfo.total = 0;
                                me.state.selectRow = null;
                                me.setState(me.state,()=>{callback && callback()});
                            }
                        }
                    });

                }
            }
        });
    }

    /**
     * 格式化tableData
     * @param param
     * @returns {null}
     */
    formatTableData(param){
        let me = this;
        let {tableData,tableId,isNeedAdd} = param;
        if(!tableData || !tableData[tableId])
            return null;
        //如果是子表数据，转换前先手动添加下述属性
        if(isNeedAdd){
            tableData[tableId].rows.forEach(item=>{
                item.hierarchyname = (item.values)['pk_hierarchy.name'];
                item.suppliergrade = (item.values)['pk_level.suppliergrade'];
                item.supstatus = (item.values)['pk_level.supstatus'];
                if(me.config.tab == '0'){
                    item.code = (item.values)['pk_supplier.code'];
                    item.name = (item.values)['pk_supplier.name'];
                }else{
                    item.classname = (item.values)['pk_marbasclass.name'];
                    item.classcode = (item.values)['pk_marbasclass.code'];
                    item.materialcode = (item.values)['pk_material.code'];
                    item.materialname = (item.values)['pk_material.name'];
                    item.materialspec = (item.values)['pk_material.materialspec'];
                    item.materialtype = (item.values)['pk_material.materialtype'];
                    item.measname = (item.values)['pk_material.pk_measdoc.name'];
                }
                item = Object.assign(item,item.values);
                //删除rowid,status,values属性
                delete item.rowid;
                delete item.status;
                delete item.values;
            });

        }
        let res = tableData[tableId].rows.map(item=>{
            let {keys,values,entries} = Object;
            for (let [key,value] of entries(item)) {
                if(typeof value == "object" && value) {
                    if((key.startsWith('pk_') && !key.includes(".")) || 'feffectrange'.includes(key))
                        item[key] = value.value;
                    else
                        item[key] = value.display ? value.display : value.value;
                }
            }
            return item;
        });
        return res;
    }
    /**
     * 将后台返回的数据格式转换为key：value格式
     * @param tableData
     */
    changeHeadTableDataFormat(tableData){
        let me = this;
        if(!tableData)
            return;
        tableData[me.config.headTableId].rows.forEach(item=>{
            item.stockname = (item.values)['pk_org_v.name'];
            if(me.config.tab == '0'){
                item.classname = (item.values)['pk_marbasclass.name'];
                item.classcode = (item.values)['pk_marbasclass.code'];
                item.materialcode = (item.values)['pk_material.code'];
                item.materialname = (item.values)['pk_material.name'];
                item.materialspec = (item.values)['pk_material.materialspec'];
                item.materialtype = (item.values)['pk_material.materialtype'];
                item.measname = (item.values)['pk_material.pk_measdoc.name'];
            }else{
                item.suppliername = (item.values)['pk_supplier.name'];
                item.suppliercode = (item.values)['pk_supplier.code'];
            }
            item = Object.assign(item,item.values);
            //删除rowid,status,values属性
            delete item.rowid;
            delete item.status;
            delete item.values;
        });
        let res = me.formatTableData({tableData,tableId:me.config.headTableId});
        return res;
    }
    /**
     * 加载子表数据
     */
    loadBodyTableData(callback){
        var me = this;
        let record = me.state.selectRow;
        if(!record){
            Message.create({content: me.state.json['10140SGMENU-000010'], color: 'warning'});/* 国际化处理： 请先选择操作记录*/
            return;
        }
        /*查询区条件也对子表生效*/
        let {searchData,oid,searchId} = me.state.searchData;
        let requestParam = {
            querycondition:searchData,
            queryAreaCode:searchId,
            oid:oid,
            querytype:'tree',
            userdefObj:{
                tab:me.config.tab,
                pk_org:record.pk_org,
                pageCode:me.config.pageCode,
                areaCode:me.config.bodyTableId,
                pk:me.config.tab == '0' ? record.pk_material ? record.pk_material : record.pk_marbasclass : record.pk_supplier
            }
        }
        /*let requestParam = {
            tab:me.config.tab,
            pk_org:record.pk_org,
            pageCode:me.config.pageCode,
            areaCode:me.config.bodyTableId,
            pk:me.config.tab == '0' ? record.pk_material ? record.pk_material : record.pk_marbasclass : record.pk_supplier
        }*/
        ajax({
            url: urls["queryChildUrl"],
            data:requestParam,
            success: (res) =>{
                let{data,success,formulamsg}=res;
                if(success){
                    me.dealFormulamsg({
                        formulamsg,
                        callback:()=>{
                            if(data){
                                me.initColumns();
                                let dealData = me.formatTableData({tableData:data,tableId:me.config.bodyTableId,isNeedAdd:true});
                                if(dealData){
                                    dealData.map((record,index)=>{
                                        record.numberindex = `${index+1}`;
                                    });
                                }
                                me.state.bodyTableData = dealData;
                                me.setState(me.state,()=>{callback && callback()});
                            }else
                                callback && callback();
                        }
                    });
                }
            }
        });
    }
    /**
     * 行点击事件
     * @param record
     * @param index
     * @param flag  区分点击headTable还是bodyTable
     */
    rowClick(flag,record, index){
        var me = this;
        if(flag == 'head'){
            me.state.selectRow = record;
            me.setState(me.state,()=>{
                me.loadBodyTableData();
            });
        }else{
            me.state.selectBodyRow = record;
            me.setState(me.state);
        }
    }

    /**
     * 获取headtable选中行
     * @returns {string}
     */
    getSelectedRow(){
        var me = this;
        return me.state.selectRow;
    }
    /**
     * 获取bodytable选中行
     * @returns {string}
     */
    getSelectedBodyRow(){
        var me = this;
        return me.state.selectBodyRow;
    }

    /**
     * 获取上面表格数据
     * @returns {Array}
     */
    getHeadTableData(){
        var me = this;
        return me.state.headTableData;
    }
    /**
     * 获取下面表格数据
     * @returns {Array}
     */
    getBodyTableData(){
        var me = this;
        return me.state.bodyTableData;
    }

    /**
     * 将tableData格式转为平台grid中data格式
     * @returns {any[]}
     */
    getFormatBodyTableData(){
        var me = this;
        console.log(me.state.bodyTableData)
        let tableData = Utils.clone(me.state.bodyTableData);
        let formatData = tableData.map((item,index)=>{
            let {keys,values,entries} = Object;
            for (let [key,value] of entries(item)) {
                if(typeof value == "object")
                    item[key] = value;
                else
                    item[key] = {value:value};
                console.log(value)
            }
            return {
                values:item,
                status:0,
                rowid:index
            };
        });
        console.log(me.state.bodyTableData)
        return formatData;
    }
    /**
     * 改变每页记录数
     */
    onPageSizeChange(val){
        let me = this;
        me.state.pageInfo.pageSize = val;
        me.setState(me.state);
        me.loadHeadTableData(me.state.searchData);
    }

    /**
     * 翻页
     * @param val
     */
    pageIndexChange(val){
        let me = this;
        me.state.pageInfo.pageIndex = val;
        me.setState(me.state,()=>{
            me.loadHeadTableData(me.state.searchData);
        });
    }
    rowClassName = (flag,record,index,indent)=>{
        if(flag == 'head')
            return record['pk_vendorstock'] == this.state.selectRow['pk_vendorstock']?'extable-selected-row':'';
        return record['pk_vendorstock'] == this.state.selectBodyRow['pk_vendorstock']?'extable-selected-row':'';
    }
    render(){
        let {headColumns,bodyColumns,headTableData,bodyTableData} = this.state;
        return(
            <div>
                <div className="card-area nc-theme-gray-area-bgc">
                    {
                        headColumns &&
                        <NCTable
                            columns={headColumns}
                            data={headTableData}
                            scroll={{ x: true, y: 400 }}
                            rowClassName={this.rowClassName.bind(this,'head')}
                            onRowClick={this.rowClick.bind(this,'head')}
                        />
                    }
                </div>
                <div className="simpleTable-component-paginationDiv nc-theme-area-bgc">
                    <div className="page-size" fieldid="pagion_select">
                        <NCSelect
                            value={String(this.state.pageInfo.pageSize)}
                            style={{ width: 85 }}
                            onSelect={this.onPageSizeChange.bind(this)}
                            className="fl"
                            showClear={false}
                        >
                            <Option value={"10"}>10{`${this.state.json['10140SGMENU-000011']}/${this.state.json['10140SGMENU-000012']}`/* 国际化处理： 条,页*/}</Option>
                            <Option value={"20"}>20{`${this.state.json['10140SGMENU-000011']}/${this.state.json['10140SGMENU-000012']}`/* 国际化处理： 条,页*/}</Option>
                            <Option value={"50"}>50{`${this.state.json['10140SGMENU-000011']}/${this.state.json['10140SGMENU-000012']}`/* 国际化处理： 条,页*/}</Option>
                            <Option value={"100"}>100{`${this.state.json['10140SGMENU-000011']}/${this.state.json['10140SGMENU-000012']}`/* 国际化处理： 条,页*/}</Option>
                        </NCSelect>
                        {this.state.pageInfo.total &&
                                <span className="fl NC_total">
                                    {`${this.state.json['10140SGMENU-000013']}${this.state.pageInfo.total}${this.state.json['10140SGMENU-000011']}`/* 国际化处理： 共,条*/}
                                </span>
                        }
                    </div>
                    <div className="table-pagination">
                        <NCPagination
                            //first
                            //last
                            prev
                            next
                            boundaryLinks
                            items={Number(this.state.pageInfo.totalPage)}
                            maxButtons={5}
                            activePage={Number(this.state.pageInfo.pageIndex)}
                            onSelect={this.pageIndexChange.bind(this)}
                        />
                    </div>
                </div>
                <div className="card-area nc-theme-area-bgc nc-theme-gray-area-bgc" style={{paddingBottom:70}}>
                    {
                        bodyColumns &&
                        <NCTable
                            columns={bodyColumns}
                            scroll={{ x: true, y: 400 }}
                            data={bodyTableData}
                            rowClassName={this.rowClassName.bind(this,'body')}
                            onRowClick={this.rowClick.bind(this,'body')}
                        />
                    }
                </div>
            </div>
        )
    }
}
export default MaterialSgmenuTable
//U+xO9EJ8f20ioZgpwMLm8cz5mt8D/Pb5gko5600R0DakkdEDTVzqLLuC/2e2cBIFbnsynlLL1GXN
//TDfhqGaGKw==