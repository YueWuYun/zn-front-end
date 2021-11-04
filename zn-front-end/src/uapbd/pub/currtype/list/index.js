//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, toast, print, promptBox, getMultiLang, createPageIcon, excelImportconfig } from 'nc-lightapp-front';
//import  deepClone from '../../deepClone.js';
let { NCMessage, NCPopconfirm } = base;
import {component} from '../../../public/platwapper/index.js';
const { NCButton: Button  } = component;
const { NCDropdown: Dropdown, NCIcon: Icon, NCMenu: Menu} = base;
const { PrintOutput, ExcelImport } = high;
import Utils from '../../../public/utils';
// import {ExcelImport} from '../../../public/excelImport'
//import '../../../static/style/common.less';
//import './index.less';


const searchid = '10140UDDDBQ';
const tableid = 'currtype';
const pagecode = '10140CURTP_currtype';
const appid = '0001Z01000000000157O';
const urls = {
    save: '/nccloud/uapbd/currtype/save.do',
    query: '/nccloud/uapbd/currtype/query.do',
    print: '/nccloud/uapbd/currtype/print.do',
    queryTemplet: '/nccloud/platform/templet/querypage.do',
    param: '/nccloud/uapbd/currtype/param.do'
};
const isShowOffEnable = false;			//是否启用“显示停用”功能
let allTableData = {};
let global_curr = false;//是否启用了全局本位币
let group_curr = false; //是否启用了集团本位币

function currParamCheck(){
    ajax({
        url: urls['param'],
        data: {
            "pagecode": pagecode
        },
        success: (res) => {console.log(res);
            if(res && res.data){
                global_curr = res.data.global||false
                group_curr=res.data.group||false
            }
           
        }
    });
}

function getDatas(showOff = false, props) {
    console.log("getData");
    //如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
    ajax({
        url: urls['query'],
        data: {
            "pagecode": pagecode
        },
        success: (res) => {
            console.log("getData2");
            console.log(res);
            let { success, data } = res;
            if (success) {
                /* data[tableid].rows.map(item) => {
                    if (item.values['isgrade'].value) {

                    }
                }; */
                allTableData = data[tableid];
                props.editTable.setTableData(tableid, data[tableid]);
                if(allTableData != null && allTableData.rows.length > 0){
                    props.button.setDisabled({
                        print: false,
                        output: false,
                    });
                    // toast({content:'查询成功,共'+allTableData.rows.length+'条数据',color:'success'});
                }else{
                    props.button.setDisabled({
                        print: true,
                        output: true,
                    });
                    // toast({content:'未查询出符合条件的数据',color:'warning'});
                }
            }
        }
    });
};

// //获取并初始化模板
// let initTemplate = (props) => {
//     props.createUIDom({
//             pagecode: pagecode,
//             // appid : appid,
//             // appcode : '10140CURTP'
//         },
//         (data) => {
//             let meta = data.template;
//             console.log(data);
//             meta = modifierMeta(props, meta)
//             props.meta.setMeta(meta);
//             data.button && props.button.setButtons(data.button);
//             getDatas(false, props)
//             props.button.setButtonsVisible({
//                 add: true,
//                 edit: true,
//                 del: true,
//                 save: false,
//                 cancel: false,
//                 refresh: true
//             });
//             props.button.setPopContent('tabledel',props.MutiInit.getIntl("10140CURTP")&&props.MutiInit.getIntl("10140CURTP").get('10140CURTP-000000'));/* 国际化处理： 确认要删除该信息吗？*/
//         }
//     );
    // ajax({
    // 	url: urls['queryTemplet'],
    // 	data: {
    // 		pagecode: pagecode		//pagecode,在生成的json模板获取
    // 	},
    // 	success: function(res) {
    // 		let meta = res.data;
    // 		meta = modifierMeta(props,meta);
    // 		props.meta.setMeta(meta);
    // 	}
    // });
// }

function buttongroups(props, record) {
    /*if(props.config.nodeType==="GROPE_NODE"&&record['pk_group'].value!=record['pk_org'].value){
        return [];
    }else{
        return record['enablestate'].value==true?['edit','delete','disable']:['edit','delete','enable'];
    }*/
    return ['tabledel'];
}

//对表格模板进行加工操作
function modifierMeta(props, meta) {
    meta[tableid].showindex = true;  //表格显示序号
    //添加表格操作列
    let event = {
        label: props.MutiInit.getIntl("10140CURTP")&&props.MutiInit.getIntl("10140CURTP").get('10140CURTP-000001'),/* 国际化处理： 操作*/
        attrcode: 'opr',
        key: 'opr',
        itemtype: 'customer',
        fixed: 'right',
        className: 'table-opr',
        visible: true,
        render(text, record, index) {
            /*let btnArray = buttongroups(props,record)
            return props.button.createOprationButton(
                btnArray,
                {
                    area: "table-opr-button",
                    buttonLimit: 3,
                    onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
                }
            )*/

            let tableStatus = props.editTable.getStatus(tableid);
            console.log(tableStatus);
            return tableStatus == 'add' || tableStatus == 'edit' ? (
                <div className="currency-opr-col">
                    {/* <NCPopconfirm
                        trigger="click"
                        placement="top"
                        content="确认删除?"
                        onClose={() => {
                            if (props.editTable.getStatus(tableid) === 'edit') {//编辑状态
                                props.editTable.deleteTableRowsByIndex(tableid, index);
                            } else {//浏览态
                                let delObj = {
                                    rowId: index,
                                    status: '3',
                                    values: {
                                        ts: {
                                            display: '时间戳',
                                            value: record.values.ts.value
                                        },
                                        pk_currtype: {
                                            display: '主键',
                                            value: record.values.pk_currtype.value
                                        }
                                    }
                                };
                                let indexArr = [];
                                indexArr.push(index);
                                let data = {
                                    model: {
                                        areaType: 'table',
                                        pageinfo: null,
                                        rows: [delObj]
                                    }
                                };
                                ajax({
                                    url: urls['save'],
                                    data,
                                    success: function (res) {
                                        let { success, data } = res;
                                        if (success) {
                                            let allD = props.editTable.getAllData(tableid);
                                            console.log(allD); console.log(record);
                                            let newRows = [];
                                            for (let i = 0; i < allD.rows.length; i++) {
                                                if (allD.rows[i].rowid != record.rowid) {
                                                    newRows.push(allD.rows[i]);
                                                }
                                            }
                                            allD.rows = newRows;
                                            props.editTable.setTableData(tableid, allD);
                                            //props.editTable.deleteTableRowsByIndex(tableid, indexArr);
                                            NCMessage.create({ content: '删除成功', color: 'success', position: 'bottom' });
                                        }
                                    }.bind(this)
                                });
                            }
                        }}
                    > */}
                        {/* <span className='delete-span'>删除</span> */}
                        {''}
                    {/* </NCPopconfirm> */}
                </div>
            ) : props.button.createOprationButton(
                ['tabledel'],
                {
                    area: "table-opr-button",
                    buttonLimit: 3,
                    onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
                }
            );
        }
    };
    meta[tableid].items.push(event);
    //props.renderItem('table',tableid,'creator',refer('creator'));
    return meta;
}

function tableButtonClick(props, id, text, record, index) {
    console.log(id); console.log(record); console.log(index);
    switch (id) {
        case 'tabledel':
            let tableStatus = props.editTable.getStatus(tableid);
            if (tableStatus === 'browse') {
                let indexArr = [];
                let dataArr = [];
                let delObj = {
                    status: '3',
                    values: {
                        ts: {
                            display: props.MutiInit.getIntl("10140CURTP")&&props.MutiInit.getIntl("10140CURTP").get('10140CURTP-000003'),/* 国际化处理： 时间戳*/
                        },
                        pk_currtype: {
                            display: props.MutiInit.getIntl("10140CURTP")&&props.MutiInit.getIntl("10140CURTP").get('10140CURTP-000004'),/* 国际化处理： 主键*/
                        }
                    }
                };
                delObj.rowId = record.rowid;
                delObj.values.ts.value = record.values.ts.value;
                delObj.values.pk_currtype.value = record.values.pk_currtype.value;
                delObj.values = record.values;
                dataArr.push(delObj);
                indexArr.push(index);
                let data = {
                    pageid: pagecode,
                    model: {
                        areaType: 'table',
                        pageinfo: null,
                        rows: dataArr
                    }
                };
                ajax({
                    url: urls['save'],
                    data,
                    success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                        let { success, data } = res;
                        if (success) {
                            props.editTable.deleteTableRowsByIndex(tableid, indexArr);
                            //删除后需要重新setdata
                            let allD = props.editTable.getAllData(tableid);
                            let newRows = []; console.log(allD);
                            for (let i = 0; i < allD.rows.length; i++) {
                                if (allD.rows[i].rowid != record.rowid) {
                                    newRows.push(allD.rows[i]);
                                }
                            }
                            allD.rows = newRows;
                            props.editTable.setTableData(tableid, allD);
                            //删除后需要重新setdata
                            // NCMessage.create({ content: '删除成功', color: 'success', position: 'bottom' });
                            toast({ title: props.MutiInit.getIntl("10140CURTP")&&props.MutiInit.getIntl("10140CURTP").get('10140CURTP-000006'), color: 'success' });/* 国际化处理： 删除成功！*/
                        }
                    }
                });
            } else if (tableStatus === 'edit') {
                props.editTable.deleteTableRowsByIndex(tableid, index);
            }
            break;
        default:
            break;
    }
}

class SingleTable extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.props.button.setButtonsVisible({
            add: false,
            edit: false,
            save: false,
            cancel: false,
            del: false
        });
        this.state = {
            searchValue: '',
            searchDisable: false,				//简单搜索框是否禁用	true：禁用		false：可用
            moreButton: false,				//更多按钮状态
            showOffDisable: true,			//显示停用复选框是否禁用	true：禁用		false：可用
            isShowOff: false,				//列表是否显示停用数据
            json:{},
            selectedPKS: ''
        }
        // let callback = (json) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
        //     console.log(json);
        //     this.setState({json});       // 保存json和inlt到页面state中并刷新页面
        //     // this.initTemplate(props);
        // }
        // getMultiLang({moduleId: '10140CURTP',domainName: 'uapbd',callback});
        this.initTemplate(props);
    }

    componentWillMount(){
        // let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
        //     console.log('callback');
        //     if (status) {
        //         initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
        //         this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
        //     } else {
        //         console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
        //     }
      
        // }
        // this.props.MultiInit.getMultiLang({moduleId: '10140CURTP',domainName: 'uapbd',callback})
        let callback = (json) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            console.log(json);
            this.setState({json})       // 保存json和inlt到页面state中并刷新页面
        }
        getMultiLang({moduleId: '10140CURTP',domainName: 'uapbd',callback});
        // console.log('componentWillMount');
    }
    componentDidMount() {
        //initTemplate.call(this, this.props)
        this.props.button.setDisabled({
            del: true,
            print: true,
            output: true,
        });
        currParamCheck();
        // this.getData(false);
    }
    //获取并初始化模板
    initTemplate = (props) => {
        props.createUIDom({
                pagecode: pagecode,
                // appid : appid,
                // appcode : '10140CURTP'
            },
            (data) => {
                let meta = data.template;
                console.log(data);
                meta = modifierMeta(props, meta)
                props.button.setUploadConfig("Import",excelImportconfig(this.props,"uapbd","currtypeinfo",true,"",{appcode: '10140CURTP', pagecode: pagecode},()=>{}));
                props.meta.setMeta(meta);
                data.button && props.button.setButtons(data.button);
                getDatas(false, props)
                props.button.setButtonsVisible({
                    add: true,
                    edit: true,
                    del: true,
                    save: false,
                    cancel: false,
                    refresh: true
                });
                props.button.setPopContent('tabledel',props.MutiInit.getIntl("10140CURTP")&&props.MutiInit.getIntl("10140CURTP").get('10140CURTP-000040'));/* 国际化处理： 确认要删除该信息吗？*/
            }
        );
    }
    //请求列表数据
    getData = (showOff = false) => {
        console.log("getData");
        //如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
        ajax({
            url: urls['query'],
            data: {
                "pagecode": pagecode
            },
            success: (res) => {
                console.log("getData2");
                console.log(res);
                let { success, data } = res;
                //显示公式
                if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                    props.dealFormulamsg(
                        res.formulamsg,  //参数一：返回的公式对象
                        {                //参数二：界面使用的表格类型
                            "table1":"editTable",
                            "table2":"cardTable"
                        }
                    );
                }        
                if (success) {
					/* data[tableid].rows.map(item) => {
						if (item.values['isgrade'].value) {

						}
					}; */
                    allTableData = data[tableid];
                    this.props.editTable.setTableData(tableid, data[tableid]);
                    console.log(allTableData);
                    if(allTableData != null && allTableData.rows.length > 0){
                        this.props.button.setDisabled({
                            print: false,
                            output: false,
                        });
                        // toast({content:'查询成功,共'+allTableData.rows.length+'条数据',color:'success'});
                    }else{
                        this.props.button.setDisabled({
                            print: true,
                            output: true,
                        });
                        // toast({content:'未查询出符合条件的数据',color:'warning'});
                    }
                    toast({title:this.state.json['10140CURTP-000007'],color:"success"});/* 国际化处理： 刷新成功！*/
                }
            }
        });
    };
    getDataSave = (showOff = false) => {
        console.log("getData");
        //如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
        ajax({
            url: urls['query'],
            data: {
                "pagecode": pagecode
            },
            success: (res) => {
                console.log("getData2");
                console.log(res);
                let { success, data } = res;
                //显示公式
                if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                    props.dealFormulamsg(
                        res.formulamsg,  //参数一：返回的公式对象
                        {                //参数二：界面使用的表格类型
                            "table1":"editTable",
                            "table2":"cardTable"
                        }
                    );
                }        
                if (success) {
					/* data[tableid].rows.map(item) => {
						if (item.values['isgrade'].value) {

						}
					}; */
                    allTableData = data[tableid];
                    this.props.editTable.setTableData(tableid, data[tableid]);
                    console.log(allTableData);
                    if(allTableData != null && allTableData.rows.length > 0){
                        this.props.button.setDisabled({
                            print: false,
                            output: false,
                        });
                        // toast({content:'查询成功,共'+allTableData.rows.length+'条数据',color:'success'});
                    }else{
                        this.props.button.setDisabled({
                            print: true,
                            output: true,
                        });
                        // toast({content:'未查询出符合条件的数据',color:'warning'});
                    }
                    //toast({title:this.state.json['10140CURTP-000007'],color:"success"});/* 国际化处理： 刷新成功！*/
                }
            }
        });
    };

    //点击查询按钮  单表页面去除查询区
	/* onSearchBtnClick(props) {
		let searchVal = this.props.search.getAllSearchData(searchid);
		let metaData = this.props.meta.getMeta();
		let data={
			"conditions":searchVal,
			//editTable不提供分页
			"pagecode": pagecode,
			"queryAreaCode":searchid,  //查询区编码
			"oid":"0001Z010000000004GIF",  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			"queryType":"simple"
		 }
	
		ajax({
			url: '/nccloud/riamm/defdoclist/query.do',
			data: data,
			success:  (res)=> {
				let { success, data } = res;
				if (success) {
					this.props.editTable.setTableData(tableid, data[tableid]);
				}
			}
		}); 
	} */

    //表格编辑后事件
    onAfterEvent(props, moduleId, key, changerows, value, index, data) {
        return;//目前data一直为空，报错，此处先屏蔽
        //props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
        //表格的编辑后事件，暂时没用到，处理表格字段编辑后业务及验证使用
        let length = this.props.editTable.getNumberOfRows(moduleId);
        if (((length - 1) === index) && data.status === '2') {
            this.onButtonClick('add');
        }
        if (key === 'isgrade' && data.values['doclevel'] === '0') {
            let allRows = props.editTable.getAllRows(moduleId);
            data.status = '1'
            let changDdata = {
                pageid: pagecode,
                model: {
                    areaType: 'table',
                    pageinfo: null,
                    rows: data
                }
            };
            ajax({
                url: urls['save'],
                data: changDdata,
                success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                    let { success, data } = res;
                    if (success) {
                        () => {
                            //操作成功，更新页面当前行数据
                            // let retData = data[moduleId];
                            // allRows[index] = retData.rows[0];
                            // let allData = props.editTable.getAllData(moduleId);
                            // allData.rows = allRows;
                            // props.editTable.setTableData(moduleId, allData);
                            let allD = this.props.editTable.getAllData(tableid);
                            Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                            Utils.filterResult(allD, data[tableid].rows);//将保存后返回的数据重新放置到页面
                            this.props.editTable.setTableData(tableid, allD);
                        }
                        toast({title:this.state.json['10140CURTP-000008'],color:"success"});/* 国际化处理： 保存成功*/
                    }
                }
            });
        }
    }

    //更新按钮状态
    updateButtonStatus() {
        console.log('updateButtonStatus');
        //此处控制按钮的隐藏显示及启用状态
        let tableData = this.props.editTable.getCheckedRows(tableid);
        let length = tableData.length;//获取列表页选择数据的行数
        if (length === 0) {//未选择数据
            this.props.button.setDisabled({
                del: true
            });
        } else if (length === 1) {//选择一行数据
            this.props.button.setDisabled({
                del: false
            });
        } else {//选择多行数据
            this.props.button.setDisabled({
                del: false
            });
        }
        console.log("status=" + this.props.editTable.getStatus(tableid));
        console.log(this.props.button);
        if (this.props.editTable.getStatus(tableid) === 'edit') {//编辑状态
            this.props.button.setButtonsVisible({
                add: true,
                edit: false,
                save: true,
                cancel: true,
                del: true,
                refresh: false,
                print: false,
                output: false,
                Import: false,
                Export: false
            });
            this.setState({
                searchDisable: true,
                showOffDisable: true
            });
            this.props.button.setMainButton(['add'], false);
        } else {//浏览态
            this.props.button.setButtonsVisible({
                add: true,
                edit: true,
                del: true,
                save: false,
                cancel: false,
                refresh: true,
                print: true,
                output: true,
                Import: true,
                Export: true
            });
            this.setState({
                searchDisable: false,
                showOffDisable: false
            });
            this.props.button.setMainButton(['add'], true);
        }

    }

    //显示停用数据
    showOffChange() {
        this.setState({
            isShowOff: !this.state.isShowOff
        });
        this.getData(this.state.isShowOff);
    }
    cancelConfirmModal(props) {
        this.props.editTable.cancelEdit(tableid);
        this.props.editTable.showColByKey(tableid, 'opr');//显示操作列
        this.updateButtonStatus();
        window.onbeforeunload = null;
    }
    //
    onDeleteSys(props) {
        let selectedData = this.props.editTable.getCheckedRows(tableid);
        let indexArr = [];
        let dataArr = [];
        selectedData.forEach((val) => {
            let delObj = {
                status: '3',
                values: {
                    ts: {
                        display: this.state.json['10140CURTP-000003'],/* 国际化处理： 时间戳*/
                    },
                    pk_currtype: {
                        display: this.state.json['10140CURTP-000004'],/* 国际化处理： 主键*/
                    }
                }
            };
            delObj.rowId = val.data.rowId;
            delObj.values.ts.value = val.data.values.ts.value;
            delObj.values.pk_currtype.value = val.data.values.pk_currtype.value;
            delObj.values = val.data.values;
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
        ajax({
            url: urls['save'],
            data,
            success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                let { success, data } = res;
                if (success) {
                    let allD = this.props.editTable.getAllData(tableid);
                    let newRows = []; console.log(allD);
                    for (let i = 0; i < allD.rows.length; i++) {
                        if (allD.rows[i].selected != true) {
                            newRows.push(allD.rows[i]);
                        }
                    }
                    allD.rows = newRows;
                    this.props.editTable.setTableData(tableid, allD);
                    // this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
                    //NCMessage.create({ content: '删除成功', color: 'success', position: 'bottom' });
                    toast({ title: this.state.json['10140CURTP-000006'], color: 'success' });/* 国际化处理： 删除成功！*/
                }
            }
        });
        this.props.modal.close('delConfirmModal');
    }
    //校验公式
    execCalidateFormular = (callback) =>{
        this.props.editTable.filterEmptyRows(tableid,['code','name','currtypesign'],'include');
        let tableData = this.props.editTable.getChangedRows(tableid);
        console.log(tableData);
        let validateData = {
            pageid: pagecode,
            model: {
                areacode: tableid,
                areaType: "table",
                pageinfo: null,
                rows: tableData
            }
        };
        let tableTypeObj = {[tableid]:'editTable'};
        let billType = 'grid';
        this.props.validateToSave( validateData , ()=>{
            console.log('校验公式执行返回成功');
            setTimeout(()=>{this.btnSave(callback)},100);
        } , tableTypeObj , billType );
    }
    //保存按钮
    btnSave = (callback)=>{
        this.props.editTable.filterEmptyRows(tableid);
        let tableData = this.props.editTable.getChangedRows(tableid);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
        console.log("getChangedRows");
        console.log(tableData);
        if (tableData.length < 1) {
            // toast({ content: '没有被修改的数据', color: 'warning' });
            this.props.editTable.cancelEdit(tableid);
            window.onbeforeunload = null;
            toast({ title: this.state.json['10140CURTP-000013'], color: 'success' });/* 国际化处理： 保存成功！*/
            return;
        }
        //return;
        let data = {
            pageid: pagecode,
            model: {
                areacode: tableid,
                areaType: "table",
                pageinfo: null,
                rows: []
            }
        };
        //去除掉空行
        let tempArr = new Array();
        // for (let i = 0; i < tableData.length; i++) {
        //     if (tableData[i].values.code.value != null && tableData[i].values.code.value.length > 0) {
        //         tableData[i].values.extIndex = {display:7,value:7+''};
        //         tempArr.push(tableData[i]);
        //     }
        // }

        let alldata = this.props.editTable.getAllRows(tableid); console.log(alldata);
        let codeStr = '';
        let isdefault = false;
        let resutlStr = "";
        for (let i = 0; i < alldata.length; i++) {
            console.log(alldata[i]);
            // if(i == alldata.length - 1){//最后一行空行校验，最后一行可能是自定增行加入的，如果为空，则不保存最后一条
                if((alldata[i].values.code == null || alldata[i].values.code.value == null|| alldata[i].values.code.value.length < 1)
                    && (alldata[i].values.name == null || alldata[i].values.name.value == null || alldata[i].values.name.value.length < 1)
                    && (alldata[i].values.currtypesign == null || alldata[i].values.currtypesign.value == null || alldata[i].values.currtypesign.value.length < 1)
                    && (alldata[i].values.currdigit == null || alldata[i].values.currdigit.value == null || alldata[i].values.currdigit.value.length < 1)
                    && (alldata[i].values.roundtype == null || alldata[i].values.roundtype.value == null || alldata[i].values.roundtype.value.length < 1)
                    && (alldata[i].values.unitcurrdigit == null || alldata[i].values.unitcurrdigit.value == null || alldata[i].values.unitcurrdigit.value.length < 1)
                    && (alldata[i].values.unitroundtype == null || alldata[i].values.unitroundtype.value == null || alldata[i].values.unitroundtype.value.length < 1)
                ){
                    continue;
                }
            // }
            tempArr.push(alldata[i]);
            if(alldata[i].values.code == null || alldata[i].values.code.value == null|| alldata[i].values.code.value.length < 1){
                resutlStr += this.state.json['10140CURTP-000014']/* 国际化处理： 、[币种编码]*/
            }
            if(alldata[i].values.name == null || alldata[i].values.name.value == null || alldata[i].values.name.value.length < 1){
                resutlStr += this.state.json['10140CURTP-000015']/* 国际化处理： 、[币种名称]*/
            }
            if(resutlStr.length > 0){
                resutlStr = resutlStr.substr(1);
                toast({ content: this.state.json['10140CURTP-000016'] + (i + 1) + this.state.json['10140CURTP-000017']+resutlStr, color: 'warning' });/* 国际化处理： 下列字段值不能为空： <br>第,行：*/
                return;
            }
            if (codeStr.indexOf('|' + alldata[i].values.code.value + '$$$') > -1) {
                toast({ content: this.state.json['10140CURTP-000018'] + (i + 1) + this.state.json['10140CURTP-000019'], color: 'warning' });/* 国际化处理： 第,行币种编码重复*/
                return;
            }
            if (isdefault === true && alldata[i].values.isdefault.value === true) {
                toast({ content: this.state.json['10140CURTP-000018'] + (i + 1) + this.state.json['10140CURTP-000020'], color: 'warning' });/* 国际化处理： 第,行全局本位币重复*/
                return;
            }
            isdefault = alldata[i].values.isdefault.value;
            codeStr += ('|' + alldata[i].values.code.value + '$$$');
            console.log(alldata[i].status);
        }

        if (tempArr.length < 1) {
            // toast({ content: '没有被修改的数据', color: 'warning' });
            this.props.editTable.cancelEdit(tableid);
            window.onbeforeunload = null;
            toast({ title: this.state.json['10140CURTP-000013'], color: 'success' });/* 国际化处理： 保存成功！*/
            return;
        } else {
            tableData = tempArr;
        }

        data.model.rows = tableData;
        ajax({
            url: urls['save'],
            data,
            success: function (res) {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                let { success, data } = res;
                console.log("save success");
                console.log(res);
                console.log(this.props);
                if (success) {
                    //this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
                    // this.props.editTable.cancelEdit(tableid);
                    console.log('data--'); console.log(data);
                    if (data) {
                        console.log('data'); console.log(data);
                        let allD = this.props.editTable.getAllData(tableid);
                        let newRows = []; console.log(allD);
                        for (let i = 0; i < allD.rows.length; i++) {
                            if (allD.rows[i].status === "0") {
                                newRows.push(allD.rows[i]);
                            }
                        }
                        if (data[tableid] != null && data[tableid].rows != null && data[tableid].rows.length > 0) {
                            for (let i = 0; i < data[tableid].rows.length; i++) {
                                newRows.push(data[tableid].rows[i]);
                            }
                        }
                        allD.rows = newRows;
                        this.props.editTable.setTableData(tableid, allD);
                        this.props.editTable.cancelEdit(tableid);
                        window.onbeforeunload = null;
                        this.setState(this.state);
                        //Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                        //Utils.filterResult(allD,data[tableid].rows);//将保存后返回的数据重新放置到页面
                        //this.props.editTable.addRow
                        //this.props.editTable.setTableData(tableid, data[tableid]);
                        //this.props.editTable.setTableData(tableid,data[tableid]);
                        //this.props.editTable.addRow(tableid,-1,true,data[tableid]);
                        toast({title:this.state.json['10140CURTP-000008'],color:'success'});//保存成功
                        callback && callback();
                    }
                }
            }.bind(this)
        });
    }
    //按钮点击事件
    onButtonClick(props, id) {
        console.log('onButtonClick'); console.log(id);
        switch (id) {
            case 'print':
                let allD = this.props.editTable.getAllData(tableid);
                let pks = [];
                allD.rows.forEach((item, index) => {
                    pks.push(item.values['pk_currtype'].value);
                });
                print(
                    'pdf',
                    urls['print'],
                    {
                        billtype: '',//单据类型
                        funcode: '10140CURTP',//功能节点编码，即模板编码
                        nodekey: '',//模板节点标识
                        oids: pks,//单据pk
                        outputType: 'print'
                    }
                );
                break;
            case 'output':
                allD = this.props.editTable.getAllData(tableid);
                pks = [];
                allD.rows.forEach((item, index) => {
                    pks.push(item.values['pk_currtype'].value);
                });
                this.setState({
                    pks: pks
                }, () => {
                    this.refs.printOutput.open()
                });
                return;
                print(
                    'pdf',
                    urls['print'],
                    {
                        billtype: '',//单据类型
                        funcode: '10140CURTP',//功能节点编码，即模板编码
                        nodekey: '',//模板节点标识
                        oids: pks,//单据pk
                        outputType: 'output'
                    }
                );
                break;
            case 'add':
                //this.props.editTable.addRow(tableid);
                //let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
                //this.props.editTable.setValByKeyAndIndex(tableid, num - 1, 'currdigit', { value: '2', display: '2' });//设置档案属性默认值
                //this.props.editTable.setValByKeyAndIndex(tableid, num - 1, 'roundtype', { value: '4', display: this.state.json['10140CURTP-000009'] });//设置分级默认值/* 国际化处理： 四舍五入*/
                //this.props.editTable.setValByKeyAndIndex(tableid, num - 1, 'unitroundtype', { value: '4', display: this.state.json['10140CURTP-000009'] });//设置分级默认值/* 国际化处理： 四舍五入*/
                //this.props.editTable.setValByKeyAndIndex(tableid, num - 1, 'unitcurrdigit', { value: '2', display: '2' });//设置分级默认值
                //this.props.editTable.setValByKeyAndIndex(tableid, num - 1, 'pk_org', { value: 'GLOBLE00000000000000', display: this.state.json['10140CURTP-000010'] });//设置组织默认值/* 国际化处理： 全局*/
                
                // 重构修改 start
                let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
                this.props.editTable.addRow(tableid, num, true, {
                    'currdigit': { value: '2', display: '2' },
                    'roundtype': { value: '4', display: this.state.json['10140CURTP-000009'] },
                    'unitroundtype': { value: '4', display: this.state.json['10140CURTP-000009'] },
                    'unitcurrdigit': { value: '2', display: '2' },
                    'pk_org': { value: 'GLOBLE00000000000000', display: this.state.json['10140CURTP-000010'] }
                });
                // 重构修改 end
                
                //this.props.editTable.hideColByKey(tableid,'opr');//隐藏操作列
                this.props.editTable.setStatus(tableid, 'edit');
                this.updateButtonStatus();
                window.onbeforeunload = () => {return '';}
                this.setState(this.state);
                break;
            case 'edit':
                this.props.editTable.setStatus(tableid, 'edit');
                this.updateButtonStatus();
                window.onbeforeunload = () => {return '';}
                this.setState(this.state);
                //this.props.editTable.hideColByKey(tableid,'opr');//隐藏操作列
                break;
            case 'cancel':
                //this.props.modal.show('cancelConfirmModal');
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['10140CURTP-000039'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
                    content: this.state.json['10140CURTP-000012'],             // 提示内容,非必输/* 国际化处理： 确认取消操作？*/
                    // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                    // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                    beSureBtnClick: this.cancelConfirmModal.bind(this),
                    cancelBtnClick: () => {
                        console.log('cancelBtnClick');
                        this.props.modal.close('cancelConfirmModal');
                        this.setState(this.state);
                    }
                })


                return;
                this.props.editTable.cancelEdit(tableid);
                this.props.editTable.showColByKey(tableid, 'opr');//显示操作列
                this.updateButtonStatus();
                break;
            case 'refresh':
                this.getData();
                break;
            case 'save':
                this.execCalidateFormular(()=>{
                    this.getDataSave();
                });
                // setTimeout(()=>{this.btnSave()},100);
                break;
            case "del": console.log(this.props.modal);
                let selectedData = this.props.editTable.getCheckedRows(tableid);
                if (selectedData.length == 0) {
                    NCMessage.create({ content: this.state.json['10140CURTP-000021'], color: 'error', position: 'bottom' })/* 国际化处理： 请选择要删除的数据！*/
                    return
                }
                let tableStatus = props.editTable.getStatus(tableid);
                console.log(selectedData);
                console.log(this.props.editTable);
                if (tableStatus == 'edit') {
                    let rowids = [];
                    for (let i = 0; i < selectedData.length; i++) {
                        selectedData[i].data.selected = false;
                        rowids.push(selectedData[i].index);
                    }
                    this.props.editTable.deleteTableRowsByIndex(tableid, rowids);
                    return;
                }
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['10140CURTP-000041'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
                    content: this.state.json['10140CURTP-000022'],             // 提示内容,非必输/* 国际化处理： 确定要删除数据吗？*/
                    // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                    // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                    beSureBtnClick: this.onDeleteSys.bind(this),
                    // cancelBtnClick:()=>{console.log('cancelBtnClick');
                    //     this.props.modal.close('cancelConfirmModal');
                    // }
                })
                // this.props.modal.show('delConfirmModal');
                // let indexArr=[];
                // let dataArr=[];
                // selectedData.forEach((val) => {
                // 	let delObj = {
                // 		status: '3',
                // 		values: {
                // 			ts: {
                // 				display: '时间戳',
                // 			},
                // 			pk_currtype: {
                // 				display: '主键',
                // 			}
                // 		}
                // 	};
                // 	delObj.rowId=val.data.rowId;
                // 	delObj.values.ts.value=val.data.values.ts.value;
                // 	delObj.values.pk_currtype.value=val.data.values.pk_currtype.value;
                // 	dataArr.push(delObj);
                // 	indexArr.push(val.index);
                // });
                // data = {
                // 	pageid:pagecode,
                // 	model: {
                // 		areaType: 'table',
                // 		pageinfo: null,
                // 		rows: dataArr
                // 	}
                // };
                // ajax({
                // 	url: urls['save'],
                // 	data,
                // 	success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                // 		let { success, data } = res;
                // 		if (success) {
                //             this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
                //             NCMessage.create({content: '删除成功', color: 'success', position: 'bottom'});
                // 		}
                // 	}
                // });
                break;
            case 'Export':
                this.setState({
                    selectedPKS:''
                },()=>{
                    this.props.modal.show('exportFileModal');
                });
                break
        }

    }

    onSelectMoreButton({ key }) {
        console.log(`${key} selected`);
        NCMessage.create({ content: this.state.json['10140CURTP-000023'], color: 'info', position: 'bottom' });/* 国际化处理： 努力开发中......*/

    }

    // onSearch(value){
    // 	this.setState({ searchValue:value });
    // 	let allData =   deepClone(allTableData);
    // 	if(value.trim()===''){

    // 	}else{
    // 		let rows = Array.of();
    // 		for(var row of allData.rows){
    // 			if(row.values['code'].value.indexOf(value)>-1 || row.values['name'].value.indexOf(value)>-1){
    // 				rows.push(row);
    // 			}
    // 		}
    // 		allData.rows = rows;
    // 	}
    // 	this.props.editTable.setTableData(tableid,allData);
    // }

    /* 非通用代码，与节点业务有关，不同业务自行修改，不需要的删除 */
    onChangeIsgrade() {

    }

    //表头简单筛选
    onSearch(value) {
        this.setState({ searchValue: value });
        let allData = Utils.clone(allTableData);
        if (value.trim() === '') {

        } else {
            let rows = Array.of();
            for (var row of allData.rows) {
                if (row.values['code'].value.indexOf(value) > -1 || row.values['name'].value.indexOf(value) > -1) {
                    rows.push(row);
                }
            }
            allData.rows = rows;
        }
        this.props.editTable.setTableData(tableid, allData);
    }

    //自动增行回调
    addRowCallback = (p,q,r,s) => {
        // console.log("自动增行回调");
        // console.log(p);console.log(q);console.log(r);console.log(s);
        let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
        this.props.editTable.setValByKeyAndIndex(tableid, num - 1, 'pk_org', { value: 'GLOBLE00000000000000', display: this.state.json['10140CURTP-000010'] });//设置组织默认值/* 国际化处理： 全局*/
                
    }
    onTableAfter = (props,moduleId,key,value,changedrows,index,record) => {
        console.log(moduleId);
        console.log(key);
        console.log(value);
        console.log(changedrows);
        console.log(record);
        console.log(index);
        if(key == 'isdefault'){//全局本位币
            if(value){
                console.log(global_curr);
                if(global_curr == false){//已经设置了全局本位币
                    toast({title:this.state.json['10140CURTP-000038'],color:'warning'});
                    this.props.editTable.setValByKeyAndIndex(tableid, index,key,{value: !value});
                }else{
                    let allD = this.props.editTable.getAllRows(tableid);
                    console.log(allD);
                    if(value == true){
                        for(let i = 0; i < allD.length; i++){
                            if(i != index){
                                this.props.editTable.setValByKeyAndIndex(tableid, i,key,{value: false});
                            }
                        }
                    }
                }
            }else{//update by wangying16 for nccloud-NCCLOUD-144464  同NC保持一致，错也错的一样
                if(!group_curr){
                    toast({title:this.state.json['10140CURTP-000038'],color:'warning'});
                    this.props.editTable.setValByKeyAndIndex(tableid, index,key,{value: !value});
                }
            }
            
        }
    }

    render() {
        let { table, button, search, editTable, modal ,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        let { createEditTable } = editTable;
        let { NCCreateSearch } = search;
        let { createButton } = button;
        let { NCFormControl, NCCheckbox ,NCDiv} = base;
        const { Item } = Menu;
        let { createButtonApp } = button;
        let { createModal } = modal;
        let moreButton = (
            <Menu
                onSelect={this.onSelectMoreButton.bind(this)}>
                <Item key="1">{this.state.json['10140CURTP-000032']-this.state.json['10140CURTP-000010']/* 国际化处理： 自定义档案维护,全局*/}</Item>
                <Item key="2">{this.state.json['10140CURTP-000032']-this.state.json['10140CURTP-000033']/* 国际化处理： 自定义档案维护,集团*/}</Item>
                <Item key="3">{this.state.json['10140CURTP-000032']-this.state.json['10140CURTP-000034']/* 国际化处理： 自定义档案维护,业务单元*/}</Item>
            </Menu>
        );
        return (
            <div className="nc-single-table">
                {/* 标题 title */}
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area" style={{borderBottom: 'none'}}>
                    <div className="header-title-search-area" >
                        {
                            createBillHeadInfo(
                                {
                                    title :this.state.json['10140CURTP-000035']/* 国际化处理： 币种*/,             //标题
                                    initShowBackBtn:false
                                }
                            )}
                        {/* 简单查询 */}
                        <div className="title-search-detail" fieldid = "search">
                            <NCFormControl
                                placeholder={this.state.json['10140CURTP-000024']}/* 国际化处理： 请输入编码或名称*/
                                value={this.state.searchValue}
                                onChange={this.onSearch.bind(this)}
                                type="search"
                                disabled={this.state.searchDisable}
                            />
                        </div>
                        {/* 显示停用数据 */}
                        {isShowOffEnable ? (
                            <div className="title-search-detail">
                                <span className="showOff">
                                    <NCCheckbox
                                        checked={this.state.isShowOff}
                                        onChange={this.showOffChange.bind(this)}
                                        disabled={this.state.showOffDisable}
                                    >this.state.json['10140CURTP-000036']</NCCheckbox>/* 国际化处理： 显示停用*/
                                </span>
                            </div>
                        ) : ('')}
                    </div>
                    {/* 按钮区  btn-group */}
                    <div className="header-button-area">
                        {/* {createButton('addButton', {name: '新增',onButtonClick: this.onButtonClick.bind(this,'add'),colors:'danger'})}
                        {createButton('editButton', {name: '修改',onButtonClick: this.onButtonClick.bind(this, 'edit'),colors:'danger'})}
                        {createButton('refreshButton', {name: '刷新',onButtonClick: this.onButtonClick.bind(this, 'refresh'),colors:'danger'})}
						{createButton('saveButton', {name: '保存',onButtonClick: this.onButtonClick.bind(this, 'save'),colors:'danger'})}
						{createButton('delButton', {name: '批量删除',style:{width:'90px'},onButtonClick: this.onButtonClick.bind(this, 'del'),colors:'danger'})}
                        {createButton('cancelButton', {name: this.state.json['10140CURTP-000030'],onButtonClick: this.onButtonClick.bind(this, 'cancel'),colors:'danger'})} *//* 国际化处理： 取消*/}
                        {createButtonApp({
                            area: 'header-button-area',//按钮注册中的按钮区域
                            buttonLimit: 1,
                            onButtonClick: this.onButtonClick.bind(this),
                            popContainer: document.querySelector('.header-button-area')
                        })}
                        {/* <Dropdown
							trigger={['hover']}
							overlayClassName={'overlay-button'}
							overlay={moreButton}
							animation="slide-up">
							<Button 
							colors='danger' 
							className={
								`${  this.state.moreButton ? 'show' : 'hide' }  button-component `
								}
							style={{'height':'30px','line-height':'20px'}}>更多</Button>
						</Dropdown> */}
                    </div>
                </NCDiv>
                {/* 单表页面去除查询区 */}
                {/* <div className="search-area">
						{NCCreateSearch(searchid, {//查询区
							clickSearchBtn: this.onSearchBtnClick.bind(this),		//查询按钮点击事件绑定
							defaultConditionsNum:2		//默认显示查询添加个数，如果不传该参数则全部显示 
							//saveSearchPlan:true			//是否显示保存方案，默认false不显示
						})}
					</div> */}

                {/* 列表区 */}
                <div className='nc-singleTable-table-area"'>
                    {createEditTable(tableid, {//列表区
                        //onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件 
                        onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件  
                        useFixedHeader: true,
                        isAddRow: true,//失去焦点自动增行
                        //onSelected: onSelectedFn,                        // 左侧选择列单个选择框回调
                        //onSelectedAll: onSelectedAllFn,                  // 左侧选择列全选回调
                        selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
                        statusChange: this.updateButtonStatus.bind(this),				//表格状态监听
                        showIndex: true,				//显示序号
                        showCheck: true,			//显示复选框
                        onAfterEvent: this.onTableAfter.bind(this),
                        addRowCallback: this.addRowCallback.bind(this),//自动增行回调
                        adaptionHeight:true
                        //params: 'test',                                  // 自定义传参

                    })}
                    {createModal('delConfirmModal', {
                        title: this.state.json['10140CURTP-000031'],/* 国际化处理： 删除提醒*/
                        content: this.state.json['10140CURTP-000022'],/* 国际化处理： 确定要删除数据吗？*/
                        userControl: true,//自己控制什么时候关闭窗口
                        beSureBtnClick: this.onDeleteSys.bind(this),
                        cancelBtnClick: () => {
                            console.log('cancelBtnClick');
                            this.props.modal.close('delConfirmModal');
                        }
                    })}
                    {createModal('cancelConfirmModal', {
                        title: this.state.json['10140CURTP-000011'],/* 国际化处理： 注意*/
                        content: this.state.json['10140CURTP-000012'],/* 国际化处理： 确认取消操作？*/
                        beSureBtnClick: this.cancelConfirmModal.bind(this),
                        cancelBtnClick: () => {
                            console.log('cancelBtnClick');
                            this.props.modal.close('cancelConfirmModal');
                        }
                    })}
                    <PrintOutput
                        ref='printOutput'
                        url={urls.print}
                        data={{
                            funcode: '10140CURTP',
                            nodekey: '',
                            oids: this.state.pks,
                            outputType: 'output'
                        }}
                    />
                    <ExcelImport
                        {...this.props}
                        moduleName = "uapbd"//模块名
                        pagecode= "10140CURTP_currtype"
                        appcode="10140CURTP"
                        selectedPKS = {[]}
                        billType = "currtypeinfo"//单据类型
                    />
                </div>
            </div>



        );
    }
}

SingleTable = createPage({
    billinfo:{
        billtype: 'grid', 
        pagecode: '10140CURTP', 
        headcode: 'head',
        bodycode: 'currtype'
    },
    initTemplate: ()=>{},
    mutiLangCode: '10140CURTP'
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65