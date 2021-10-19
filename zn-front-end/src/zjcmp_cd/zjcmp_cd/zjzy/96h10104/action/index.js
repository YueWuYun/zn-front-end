import { ajax,toast,print,promptBox } from 'nc-lightapp-front';

const gridid = 'head';
const searchid = 'search';
const pageId = '96H10104_fundplanVO';
const appcode = '96H10104';
const printNodeKey = null;
const keys = ['iseucountry'];
const urls = {
queryUrl:'/nccloud/zjcmp_cd/fundplanVO/FundplanVOQuery.do',
pageQueryUrl:'/nccloud/zjcmp_cd/fundplanVO/FundplanVOQueryPageGridByPks.do',
saveUrl:'/nccloud/zjcmp_cd/fundplanVO/FundplanVOSave.do',
printUrl:'/nccloud/zjcmp_cd/fundplanVO/FundplanVOPrint.do'
}

/**
* 初始化页面模板
* @param {*} props
* @param {*} callback
*/
export function initTemplate (props,callback){
props.createUIDom(
{
pagecode: pageId//,//页面id
},
(data) => {
if (data) {
if (data.template) {
let meta = data.template;
meta = modifierMeta.call(this,props, meta);
props.meta.setMeta(meta);
}
if (data.button) {
let button = data.button;
props.button.setButtons(button);
props.button.setButtonDisabled({'Delete':true});
props.button.setButtonDisabled({'Edit':true});
props.button.setPopContent('DelLine',this.state.json['96H10104-000019']) /*国际化：确认要删除该信息吗？ 设置操作列上删除按钮的弹窗提示 */
}
}
callback();
}
)
}

/**
* 组织查询条件
*/
export function onloaddata(){
this.props.button.setButtonsVisible({
'Save':false,
'Cancel':false
});
let paramData = {
querycondition: {},
pageInfo:this.props.editTable.getTablePageInfo(gridid),
pagecode: pageId,
queryAreaCode:searchid,  //查询区编码
oid:this.props.meta.getMeta()[searchid].oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
querytype:'tree'
}
loadGridData.call(this,false,paramData);
}

/**
* 按钮点击事件
* @param {*} props
* @param {*} id 按钮id
*/
export function onClickButton(props,id){
let _this = this;
//获取选中行数据
let rowsdata  = props.editTable.getCheckedRows(gridid);
//获取分页信息
let pageInfo =  props.editTable.getTablePageInfo(gridid);
//查询区条件
let searchval = (this.state.hasSearched && this.state.hasSearched == true)?props.search.getAllSearchData(searchid, false):null;
//获取查询模板信息
let OID = this.props.meta.getMeta()[searchid].oid;
//queryInfo.oid;
//定义请求参数
let paramData = {
pageInfo:pageInfo,
querycondition:searchval==null?{}:searchval,
pagecode: pageId,
queryAreaCode:searchid,  //查询区编码
oid:OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
querytype:'tree'
}
switch (id) {
case 'Add':
props.editTable.setStatus(gridid,'edit');
let num = this.props.editTable.getNumberOfRows(gridid);
props.editTable.addRow(gridid,num,true);
props.button.setButtonsVisible('Edit',false);
props.button.setMainButton('Add',false);
break;
case 'Cancel':
promptBox({
color:"warning",
title:this.state.json['96H10104-000006'],/* 国际化处理： 确认取消*/
content:this.state.json['96H10104-000007'],/* 国际化处理： 是否确认要取消!*/
beSureBtnClick: () => {
props.editTable.cancelEdit(gridid);
props.editTable.setStatus(gridid,'browse');
props.button.setButtonDisabled('Edit',true);
props.button.setMainButton('Add',true);
props.button.setButtonDisabled('Delete',true);
gridStatusChange.call(this);
}
})
break;
case 'Edit':
props.editTable.setStatus(gridid,'edit');
props.button.setButtonsVisible('Edit',false);
props.button.setMainButton('Add',false);
break;
case 'Save':
// 必填项校验
props.editTable.filterEmptyRows(gridid,keys);

let changedRows = props.editTable.getAllData(gridid);//props.editTable.getChangedRows(gridid,true);
if(!changedRows || changedRows.length === 0){
props.editTable.cancelEdit(gridid);
props.editTable.setStatus(gridid,'browse');
props.button.setButtonsVisible('Edit',true);
props.button.setMainButton('Add',true);
gridStatusChange.call(this);
return;
}
if(!props.editTable.checkRequired(gridid,changedRows.rows)) return;
props.editTable.setStatus(gridid,'browse');
let changedata = {
pageid:pageId,
model:{
pageInfo,
rows:changedRows.rows,
areaType:'table',
areacode:'head'
}
}
this.props.validateToSave( changedata , ()=>{
ajax({
url:urls['saveUrl'],
data:changedata,
success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
this.props.editTable.setStatus(gridid,'browse');
if(res.data){
let allD = this.props.editTable.getAllData(gridid);
filterResult(allD,res.data[gridid].rows);
this.props.editTable.setTableData(gridid,allD);
toast({ color: 'success', title: this.state.json['96H10104-000008'] });/* 国际化处理： 保存成功*/
}
props.button.setButtonDisabled('Edit', true);
props.button.setMainButton('Add', true);
props.button.setButtonDisabled('Delete', true);
gridStatusChange.call(this);
}.bind(this)
})
},{[gridid]:'editTable'},'grid' )
break;
case 'Delete':
if(rowsdata.length!=0){
if(props.editTable.getStatus(gridid) && props.editTable.getStatus(gridid) == 'edit'){
let indexs = rowsdata.map(item => {
return item.index
});
props.editTable.deleteTableRowsByIndex(gridid, indexs);
}else{
let newData2 = rowsdata.map(item => {
return {
status: '3',
values: item.data.values
}
});
let data = {
pageid:pageId,
model: {
areaType: 'table',
pageInfo,
rows: newData2
}
};
promptBox({color:"warning",
title: this.state.json['96H10104-000009'],/* 国际化处理： 确认删除*/
content: this.state.json['96H10104-000010'],/* 国际化处理： 确定要删除所选数据吗？*/
beSureBtnClick: deleteOpr.bind(this,data,paramData)
});
}

}else{
promptBox({color:"warning",
title:this.state.json['96H10104-000011'],/* 国际化处理： 提示*/
content:this.state.json['96H10104-000012']/* 国际化处理： 请选择数据操作!*/
});
}
break;
case 'PrintGrp':
onPrint.call(this);
break;
case 'Print':
onPrint.call(this);
break;
case 'Output':
onOutput.call(this);
break;
case 'Refresh':
loadGridData.call(this,false,paramData);
toast({title:this.state.json['96H10104-000020'],color:'success'});/* 国际化处理： 无可打印数据*/
default:
break;
}
}

/**
* 表格复选框选择改变事件
*/
export function onSelected(){
let rows = this.props.editTable.getCheckedRows(gridid);
let isDisable = (rows && rows.length>0)?false:true;
this.props.button.setButtonDisabled(['Delete'],isDisable);
this.props.button.setButtonDisabled(['Edit'],isDisable);
//重新渲染页面
this.setState(this.state);
}

/**
* 选择改变事件
* @param {*} props
*/
export function gridBeChecked(props){
//此处控制按钮的隐藏显示及启用状态
let tableData = props.editTable.getCheckedRows(gridid);
let length = tableData.length;//获取列表页选择数据的行数
props.button.setDisabled({
'btnDel': length === 0
});
}

/**
* 表格状态改变事件
*/
export function gridStatusChange(){
let gridStatus =  this.props.editTable.getStatus(gridid);
this.props.button.setButtonsVisible({
'Save':gridStatus !=='browse',
'Cancel':gridStatus !=='browse',
'Add':gridStatus ==='browse',
'Edit':gridStatus ==='browse',
'Delete':gridStatus ==='browse',
'Refresh':gridStatus ==='browse',
'PrintGrp':gridStatus ==='browse',
'Output':gridStatus ==='browse'
});
this.props.button.setPopContent('DelLine',gridStatus ==='browse'?this.state.json['96H10104-000000']:'');/* 国际化处理： 确定要删除吗？*/
}

/**
* 翻页点击事件
* @param {*} props
* @param {*} config
* @param {*} pks
*/
export function onClickPageInfo(props,config, pks){
let pageInfo = props.editTable.getTablePageInfo(gridid);
let searchVal = props.search.getAllSearchData(searchid);
let paramdata = {
pks,
pageInfo:pageInfo,
querycondition: searchVal
};
loadGridData.call(this,false,paramdata,'pageQueryUrl');
}

/**
* 点击查询按钮事件
* @param {*} props
* @param {*} data
*/
export function onClickSearchBtn(props,data){
if(props.editTable.getStatus() && props.editTable.getStatus() == 'edit'){
promptBox({color:"warning",
title:this.state.json['96H10104-000011'],/* 国际化处理： 提示*/
content:this.state.json['96H10104-000015']/* 国际化处理： 编辑态不能查询*/
});
};
let OID = this.props.meta.getMeta()[searchid].oid;
let paramdata = {
querycondition: data==null?{}:data,
pageInfo:props.editTable.getTablePageInfo(gridid),
pagecode: pageId,
queryAreaCode:searchid,  //查询区编码
oid:OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
querytype:'tree'
}
//校验通过后，条件查询请求
loadGridData.call(this,true,paramdata);
}

/**
* 删除
* @param {*} data
* @param {*} paramData
*/
function deleteOpr(data,paramData){
ajax({
url:urls['saveUrl'],
data:data,
success:(res)=>{
if(res.success){
this.props.button.setButtonDisabled(['Delete'],true);
loadGridData.call(this,false,paramData);
toast({ color: 'success', title: this.state.json['96H10104-000002'] });/* 国际化处理： 删除成功*/
}else{
alert(res.message);
}
}
})
}

/**
* 打印
*/
function onPrint(){
let allData = this.props.editTable.getAllData(gridid);
if(allData.length === 0){
toast({content:this.state.json['96H10104-000013'],color:'warning'});/* 国际化处理： 无可打印数据*/
return;
}
let pks = [];
allData.rows.forEach((item,key)=>{
pks.push(item.values['pk_country'].value);
});
print(
'pdf',
urls['printUrl'],
{
funcode:appcode,//功能节点编码
nodekey:printNodeKey,//模板节点编码
oids:pks
}
)
}

/**
* 输出
*/
function onOutput(){
let allData = this.props.editTable.getAllData(gridid);
if(allData.length === 0){
toast({content:this.state.json['96H10104-000014'],color:'warning'});/* 国际化处理： 无可输出的数据*/
return;
}
let pks = [];
allData.rows.forEach((item,key)=>{
pks.push(item.values['true'].value);
});
this.setState({
ids : pks
},this.refs.printOutput.open());
}

/**
* 请求数据
* @param {*} isToast
* @param {*} paramData
* @param {*} queryUrl
*/
function loadGridData (isToast,paramData,queryUrl){
let _this = this;
let qryUrl = queryUrl==undefined?'queryUrl':queryUrl;
ajax({
url: urls[qryUrl],
data:paramData,
success: (res) => {
let { success, data } = res;
if (success) {
//查询时执行显示公式前端适配
if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
_this.props.dealFormulamsg(
res.formulamsg,  //参数一：返回的公式对象
{                //参数二：界面使用的表格类型
[gridid]:"table"
}
);
}
if(res.hasOwnProperty('data') && data != null){
_this.props.editTable.setTableData(gridid,data[gridid]);
_this.props.button.setButtonDisabled({
'PrintGrp':false,
'Output':false,
'Delete':true,
'Edit':true
});
}else{
let nulldata = {
rows:[]
}
_this.props.editTable.setTableData(gridid,nulldata);
_this.props.button.setButtonDisabled({
'PrintGrp':true,
'Output':true,
'Delete':true,
'Edit':true
});
}
_this.props.editTable.setStatus('browse');
if(isToast===true){
toast({color: 'success', content: this.state.json['96H10104-000003']+data[gridid].allpks.length+this.state.json['96H10104-000004']});/* 国际化处理： 查询成功，共,条。*/
}
this.setState({hasSearched:true});
}
},
error: (res) => {
if(isToast===true){
toast({color: 'warning', content: this.state.json['96H10104-000005']});/* 国际化处理： 未查询出符合条件的数据*/
}
}
})

}

/**
* 加工meta
* @param {*} props
* @param {*} meta
*/
function modifierMeta(props, meta){
meta[gridid].showindex = true;
meta[gridid].status = 'browse';
//去掉分页效果
meta[gridid].pagination = false;
//添加操作列
meta[gridid].items.push({
attrcode: 'opr',
label: this.state.json['96H10104-000001'],/* 国际化处理： 操作*/
width: 200,
fixed: 'right',
className : 'table-opr',
itemtype: 'customer',
visible: true,
render: (text, record, index) => {
let btnArray = tableBtnAry(props);
return props.button.createOprationButton(
btnArray,
{
area: "table-opr-area",
buttonLimit: 3,
onButtonClick: (props, id) => tableButtonClick.call(this,props, id, text, record, index)
}
)
}
});
return meta;
}

function tableBtnAry(props){
return props.editTable.getStatus(gridid) === 'browse'
? [ 'EditLine','DelLine' ]: ['Spread','DelLine'];
}

/**
* 操作列点击事件
* @param {*} props
* @param {*} id
* @param {*} text
* @param {*} record
* @param {*} index
*/
function tableButtonClick(props, id, text, record, index){
switch(id){
case "DelLine"://删除行
let tableStatus = props.editTable.getStatus(gridid);
if(tableStatus == 'browse' || tableStatus == undefined){
let row = {
status: '3',
values:record.values
}
let data = {
pageid:pageId,
model: {
areaType: 'table',
rows: [row]
}
};
ajax({
url:urls['saveUrl'],
data:data,
success:(res)=>{
if(res.success){
toast({ color: 'success', title: this.state.json['pk_lang-000002'] });/* 国际化处理： 删除成功*/
props.editTable.deleteTableRowsByIndex(gridid, index);
let allD = props.editTable.getAllData(gridid);
filterDelRows(allD.rows);//过滤清除删除状态的行
props.editTable.setTableData(gridid,allD);
gridBeChecked.call(this,props);
}else{
alert(res.message);
}
}
})
}else{
props.editTable.deleteTableRowsByIndex(gridid, index);
}
break;
case "EditLine"://修改
props.editTable.setStatus(gridid,'edit');
props.button.setMainButton('Add',false);
props.editTable.openModel(gridid, 'edit', record, index);
break;
case "Spread"://展开
props.editTable.setStatus(gridid,'edit');
props.editTable.openModel(gridid, 'edit', record, index);
break;
default:
console.log(id,index);
break;
}
}

function filterDelRows(rows){
let length = rows.length-1;
for(;length>=0;length--){
if(rows[length].status === '3'){
rows.splice(length,1);
}
}
}

function filterResult(allData,reDataRows){
if(!reDataRows) return;
if(allData.rows){
allData.rows.forEach((item,index) => {
reDataRows.forEach((it,i) => {
if(it.rowid === item.rowid){
allData.rows[index] = it;
}
});
});
}
}