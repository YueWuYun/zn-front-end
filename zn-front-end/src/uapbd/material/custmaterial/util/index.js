//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import {config} from '../config/index';
import { createPage, ajax, base,high,toast ,cacheTools,getBusinessInfo,promptBox,excelImportconfig} from 'nc-lightapp-front';
const {queryarea,tablemater,tablesub,urls} = config;
export let initTemplate = (props,json,inlt,importRefresh) => {
    //let queryInfo = props.search.getQueryInfo(SEARCHAREA);
    props.createUIDom({
            pagecode : props.config.pageCode,
            /*appid : props.config.appid,
            appcode:props.config.funcode,
            templeteid:*/
        },
        (data)=>{
            let meta = data.template;
            meta = modifierMeta(props, meta,json)
            props.meta.setMeta(meta);
            let excelimportconfig = excelImportconfig(props,'uapbd',props.config.billType,true,'',{appcode: props.config.funcode,pagecode: props.config.pageCode},()=>{
                importRefresh && importRefresh();//导入成功后刷新页面
            });
            props.button.setUploadConfig("import",excelimportconfig);
            data.button && props.button.setButtons(data.button);
            if(data.button){
                props.button.setButtons(data.button);
                props.button.setPopContent('oprdelbro',json['10140CMG-000024'])/* 国际化处理： 确认要删除该条吗？*/ /* 设置操作列上删除按钮的弹窗提示 */
                props.button.setPopContent('oprdelsubbro',json['10140CMG-000024'])/* 国际化处理： 确认要删除该条吗？*/
            }
            gridStatusChange(props);
        });
}
//表格状态改变监听事件
function gridStatusChange(props){
    let gridStatus = props.editTable.getStatus(tablemater);
    gridStatus ==='browse' ?props.button.setButtonsVisible({
        'btnSave':false,
        'btnCancel':false,
        'btnAdd':true,
        'btnEdit':true
    }):props.button.setButtonsVisible({
        'btnAdd':true,
        'btnEdit':false,
        'btnSave':true,
        'btnCancel':true,
    })
}



//对表格模板进行加工操作
function modifierMeta(props,meta,json) {

    meta[tablemater].showindex = true;
    meta[tablemater].status = 'browse';

    meta[tablemater].items.forEach((item)=>{
        if(item.attrcode==='materialid'){
            item.isMultiSelectedEnabled = true;
        }
    })
    meta[tablesub].items.forEach((item)=>{
        if(item.attrcode==='subcustom'){
            item.isMultiSelectedEnabled = true;
            item.isShowDisabledData=false;
            item.queryCondition = {'enablestate':'2',isShowDisabledData:false}
        }
    })

    meta[queryarea].items.forEach((item)=>{
        if(item.attrcode==='materialid.pk_marbasclass'){
            item.isMultiSelectedEnabled = true;
            item.isShowDisabledData = true;
        }
        if(item.attrcode==='materialid'){
            item.isShowDisabledData = true;
        }
    })


    let tableButtonClick = function (props, key, text, record, index){
        let recordVal = record.values;
        switch (key) {
            // 表格操作按钮
            case 'oprextend':
                setStatus(props,tablemater,'edit');

                props.editTable.openModel(tablemater, 'edit', record, index,false);
                break;
            case 'opredit':
                setStatus(props,tablemater,'edit');
                //editDisable(props,tablemater);
                //setTimeout(()=>{
                props.editTable.openModel(tablemater, 'edit', record, index,false);
                // },50)
                break;
            case 'oprdel':
                if(checkDelDisable(props,record)){
                    return;
                }
                props.editTable.deleteTableRowsByIndex(tablemater, index);
                break;
            case 'oprdelbro':
                if(checkDelDisable(props,record)){
                    return;
                }

                let delObj = {
                    rowId: index,
                    status: '3'
                };

                delObj.values = record.values;

                let paramData = {
                    'pageid':props.config.pageCode,
                    'model':{
                        areaType: 'table',
                        pageinfo: null,
                        rows: [ delObj ]
                    }
                }
                ajax({
                    url: urls.savemater,
                    data: paramData,
                    success: (res) => {
                        if (res.success) {
                            props.editTable.deleteTableRowsByIndex(tablemater, [index]);
                            let allD = props.editTable.getAllData(tablemater);
                            //Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                            allD.rows = allD.rows.filter(item => item.status != '3');
                            props.editTable.setTableData(tablemater,allD);
                            toast({title:json['10140CMG-000012'],color:'success'});/* 国际化处理： 删除成功！*/
                        }
                    }
                });

                break;
            case 'oprdelsub':
                if(checkDelDisable(props,record)){
                    return;
                }
                props.editTable.deleteTableRowsByIndex(tablesub, index);
                break;
            case 'oprdelsubbro':
                if(checkDelDisable(props,record)){
                    return;
                }

                let delObj2 = {
                    rowId: record.rowid,
                    status: '3',
                    values: {
                        ts: {
                            value: record.values.ts.value
                        },
                        pk_custom: {
                            value: record.values.pk_custom.value
                        }
                    }
                };

                let paramData2 = {
                    'pageid':props.config.pageCode,
                    'model':{
                        areaType: 'table',
                        pageinfo: null,
                        rows: [ delObj2 ]
                    }
                }

                ajax({
                    url: urls.savesub,
                    data: paramData2,
                    success: (res) => {
                        if (res.success) {
                            props.editTable.deleteTableRowsByIndex(tablesub, [index]);
                            let allD = props.editTable.getAllData(tablesub);
                            //Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                            allD.rows = allD.rows.filter(item => item.status != '3');
                            props.editTable.setTableData(tablesub,allD);
                            toast({title:json['10140CMG-000012'],color:'success'});/* 国际化处理： 删除成功！*/
                        }
                    }
                });

                break;
            default:
                break;
        }
    }



    //添加操作列
    meta[tablemater].items.push({
        attrcode: 'opr',
        label: json['10140CMG-000026'],/* 国际化处理： 操作*/
        itemtype:'customer',
        width: 120,
        fixed: 'right',
        className: 'table-opr',
        visible: true,
        render: (text, record, index) => {
            let buttonAry = [];
            if(!rowDisable(props,record)){
                buttonAry = props.editTable.getStatus(tablemater) === "browse"
                    ? [ 'oprdelbro']
                    : [ "oprdel"];
            }

            return props.button.createOprationButton(buttonAry, {
                area: 'opractions',
                buttonLimit: 2,
                onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
            });
        }
    });

    meta[tablesub].showindex = true;
    meta[tablesub].status = 'browse';
    //添加操作列
    meta[tablesub].items.push({
        attrcode: 'opr',
        label: json['10140CMG-000026'],/* 国际化处理： 操作*/
        itemtype:'customer',
        width: 150,
        className: 'table-opr',
        visible: true,
        render: (text, record, index) => {
            let buttonAry =
                props.editTable.getStatus(tablesub) === "browse"
                    ? [ 'oprdelsubbro']
                    : [ 'oprdelsub'];

            return props.button.createOprationButton(buttonAry, {
                area: 'oprsubactions',
                buttonLimit: 2,
                onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
            });
        }
    });
    return meta;
}

export const rowDisable=(props,row)=>{
    return (row.values.pk_group.value==row.values.pk_org.value&&props.config.nodeType=='ORG_NODE')
        ||(row.values.pk_group.value!=row.values.pk_org.value&&props.config.nodeType=='GROUP_NODE');
}

function checkDelDisable(props,row){
    if(rowDisable(props,row)){
        if(props.config.nodeType=='ORG_NODE'){
            toast({content:json['10140CMG-000006'],color:'warning'});/* 国际化处理： 业务单元节点不允许删除集团数据！*/
            return true;
        }else if(props.config.nodeType=='GROUP_NODE'){
            return false;
        }

    }
}

export const setStatus=(props,tableId,status)=>{

    props.editTable.setStatus(tableId,status);

    if(status=='edit'){
        window.onbeforeunload = () => {
            return '';
        };
    }else{
        window.onbeforeunload = null;
    }
}



//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65