//IM1pz7KKHXOhyuN2O/zz+yOF0tBg3BuYhFj/6LtfTRgQ2RIiyGoztZ/RdnkKfviC
import React, { Component } from 'react';
import { ajax, base } from 'nc-lightapp-front';
import '../component/component.less';
import {component} from '../../../public/platwapper/index.js';

let { NCTable} = component;
const {NCMessage:Message} = base;

var urls = {
    queryUrl:"/nccloud/uapbd/sgmenu/priceQuery.do"
}
class PriceQueryTable extends Component{
    constructor(props){
        super(props);
        this.config = Object.assign({
            pageCode:'10140SGMENU_10140SGMENU',
            headTableId:'material_vendor_h',
            bodyTableId:'material_vendor_b',
            tab:0
        },this.props);
        this.state = {
            headColumns:'',
            headTableData:[],
            selectRow:'',
            json:this.props.json || {}
        }
        this.initColumns = this.initColumns.bind(this);
        this.loadHeadTableData  = this.loadHeadTableData.bind(this);
        this.getSelectedRow = this.getSelectedRow.bind(this);
        this.getHeadTableData = this.getHeadTableData.bind(this);
    }
    componentWillMount(){
        this.initColumns();
    }
    componentWillReceiveProps(newProps){
        this.state.json = newProps.json || {};
        this.setState(this.state);
    }

    /**
     * 初始化table对应的columns
     */
    initColumns(){
        var me = this;

        let headTableColumns = [
            {title:me.state.json['10140SGMENU-000014'],dataIndex:'currencyName',width:'150'},/* 国际化处理： 币种*/
            {title:me.state.json['10140SGMENU-000015'],dataIndex:'price',width:'150',render:(value,record,index)=>{/* 国际化处理： 无税价格*/
                return formatAcuracy(value);
            }},
            {title:me.state.json['10140SGMENU-000016'],dataIndex:'taxPrice',width:'150',render:(value,record,index)=>{/* 国际化处理： 含税价格*/
                    return formatAcuracy(value);
            }},
            {title:me.state.json['10140SGMENU-000017'],dataIndex:'priceSource',width:'150'}/* 国际化处理： 来源*/
        ];
        /**
         * 插入序号列
         */
        headTableColumns.unshift({
            title: me.state.json['10140SGMENU-000007'],/* 国际化处理： 序号*/
            dataIndex: 'numberindex',
            className: 'table-index',
            width: '60px'
        });
        me.state.headColumns = JSON.parse(JSON.stringify(headTableColumns));
        me.setState(me.state);
    }
    loadHeadTableData(selectedBodyRow,callback){
        var me = this;
        let requestParam = {
            pk_org:selectedBodyRow.pk_org,
            pk_material:selectedBodyRow.pk_material,
            pk_supplier:selectedBodyRow.pk_supplier,
        }
        ajax({
            url: urls["queryUrl"],
            data:requestParam,
            //async:false,
            success: (res) =>{
                let{data,success}=res;
                if(success){
                    if(data){
                        data.values.map((record,index)=>{
                            record.numberindex = `${index+1}`;
                            if(index == 0)//默认选中第一条
                                me.state.selectRow = record;
                        });
                        me.state.headTableData = data;
                    }
                    me.setState(me.state,()=>{
                        if(callback)
                            callback();
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
     * 获取上面表格数据
     * @returns {Array}
     */
    getHeadTableData(){
        var me = this;
        return me.state.headTableData;
    }
    render(){
        let {headColumns,headTableData} = this.state;
        return(
            <div>
                <NCTable
                    columns={headColumns}
                    data={headTableData}
                    rowKey="_id"
                    scroll={{ x: true, y: 400 }}
                    rowClassName={(record)=> {return record._id == this.state.selectRow ? 'table-selected-row' : ''}}
                    onRowClick={this.rowClick.bind(this,'head')}
                />
                <div style={{'border':'solid;'}}>
                    {`${this.state.json['10140SGMENU-000018']}：${this.state.json['10140SGMENU-000019']}，${this.state.json['10140SGMENU-000020']}。`/* 国际化处理： 注意,以上为该供应商存货所对应的价格,存在价格数据的纪录不可删除*/}
                </div>
            </div>
        )
    }
}
//精度 + 补0 + 千分位综合处理
export function formatAcuracy(value, len = 0) {
    if (value === null || value === undefined) {
        return value;
    }
    return commafy(addZero(formatDot(value, len), len));
}
//数字转换成千分位 格式
export function commafy(num) {
    let pointIndex, intPart, pointPart;
    if (num === '-') {
        return '-';
    }
    if (isNaN(num)) {
        return '';
    }

    num = num + '';
    if (/^.*\..*$/.test(num)) {
        pointIndex = num.lastIndexOf('.');
        intPart = num.substring(0, pointIndex);
        pointPart = num.substring(pointIndex + 1, num.length);
        intPart = intPart + '';
        let re = /(-?\d+)(\d{3})/;
        while (re.test(intPart)) {
            intPart = intPart.replace(re, '$1,$2');
        }
        num = intPart + '.' + pointPart;
    } else {
        num = num + '';
        let re = /(-?\d+)(\d{3})/;
        while (re.test(num)) {
            num = num.replace(re, '$1,$2');
        }
    }
    return num;
}
// 精度处理
export function formatDot(value, len = 8) {
    let formatVal, dotSplit, val;

    val = (value || 0).toString();

    dotSplit = val.split('.');

    if (dotSplit.length > 2 || !value) {
        return value;
    }

    if (val.indexOf('.') > -1) {
        if (len == 0) {
            formatVal = dotSplit[0];
        } else {
            formatVal = val.substring(0, val.indexOf('.') + len + 1);
        }
    } else {
        formatVal = val;
    }

    return formatVal;
}
// 补0
const addZero = (num, scale) => {
    if (num === '' || num === undefined || num === null) {
        return '';
    }

    if (scale > 0) {
        let start = String(num).split('.')[0];
        let end = String(num).split('.')[1];
        if (!end) {
            end = '';
        }
        let len = end.length;
        if (len < scale) {
            end = end.padEnd(scale, '0');
        }
        return start + '.' + end;
    } else {
        return num;
    }
}
export default PriceQueryTable
//IM1pz7KKHXOhyuN2O/zz+yOF0tBg3BuYhFj/6LtfTRgQ2RIiyGoztZ/RdnkKfviC