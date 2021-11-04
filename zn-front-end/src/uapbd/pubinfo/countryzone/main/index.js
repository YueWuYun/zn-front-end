//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage,ajax,base,toast,print,high,promptBox,createPageIcon } from 'nc-lightapp-front';
import  Utils from '../../../public/utils';
const {NCFormControl,NCCheckbox, NCDiv} = base;
const {PrintOutput} = high;

import './index.less';

//let pagecode = '10140NAT_czncc';
const gridid = 'head';
const searchid = 'search';
const pageId = '10140NAT_czncc';
const oId = '1004Z010000000003RT0';
const appcode = '10140NAT';
const appid = '0001Z01000000000157R';
const printNodeKey = null;
const keys = ['iseucountry'];
const urls = {
    queryUrl:'/nccloud/uapbd/countyzone/CountryZoneQuery.do',
    pageQueryUrl:'/nccloud/uapbd/countyzone/CountryZoneQueryPageGridByPks.do',
    saveUrl:'/nccloud/uapbd/countyzone/CountryZoneSave.do',
    printUrl:'/nccloud/uapbd/countyzone/CountryZonePrint.do'
}

class CountryZoneTable extends Component {

    constructor(props){
        super(props);
        this.state={
            OID:'',
            searchValue:'',
            checkValue:'false',
            json:{}
        }
    }

    initTemplate =(props,callback)=>{
        props.createUIDom(
            {
                pagecode: pageId//,//页面id
                // appid: appid//注册按钮的id
            },
            (data) => {
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        meta = this.modifierMeta(props, meta)
                        props.meta.setMeta(meta);
                    }
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button);
                        props.button.setButtonDisabled({'Delete':true});
                        props.button.setPopContent('DelLine',this.state.json['10140NAT-000019']) /*国际化：确认要删除该信息吗？ 设置操作列上删除按钮的弹窗提示 */
                    }
                }
                callback();
            }
        )
    }
    
    modifierMeta(props, meta){
    
        meta[gridid].showindex = true;
    
        meta[gridid].status = 'browse';
        //去掉分页效果
        meta[gridid].pagination = false;

        // this.props.renderItem('form',searchid, 'pk_lang', null);
        let serchLang = meta[searchid].items.find((item)=>item.attrcode==='pk_lang');
        serchLang.itemtype = 'refer';
        serchLang.refcode = 'uap/refer/riart/ncLangTableRef/index';
        // lang.label=this.state.json['10140NAT-000021'];/* 国际化处理： 语种*/
        // lang.visible = true;
        // lang.isMultiSelectedEnabled = false;

        let gridLang = meta[gridid].items.find((item)=>item.attrcode==='pk_lang');
        gridLang.refcode = 'uap/refer/riart/ncLangTableRef/index';

        //添加操作列
        meta[gridid].items.push({
            attrcode: 'opr',
            label: this.state.json['10140NAT-000001'],/* 国际化处理： 操作*/
            width: 200,
            fixed: 'right',
            className : 'table-opr',
            itemtype: 'customer',
            visible: true,
            render: (text, record, index) => {
    
                let btnArray = this.tableBtnAry(props);
    
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table-opr-area",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                    }
                )
            }
        });
    
        return meta;
    }
    
    tableBtnAry(props){
    
        return props.editTable.getStatus(gridid) === 'browse'
            ? [ 'EditLine','DelLine' ]: ['Spread','DelLine'];
    }
    
    tableButtonClick(props, id, text, record, index){
    
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
                                toast({ color: 'success', title: this.state.json['10140NAT-000002'] });/* 国际化处理： 删除成功*/
                                props.editTable.deleteTableRowsByIndex(gridid, index);

                                let allD = props.editTable.getAllData(gridid);
                                Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
                                props.editTable.setTableData(gridid,allD);

                                this.gridBeChecked(props);
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

    componentDidMount() {
        // UE 要求打印下拉只有输出，确认规范后按钮注册再改。！！！
        this.props.button.setButtonsVisible({
            'Print':false
        });
        
        // let callback = (json, status, inlt) => {
		// 	if (status) {
		// 		this.setState({json, inlt},() => {
		// 			this.initTemplate(this.props,this.onloaddata.bind(this))
		// 		})       // 保存json和inlt到页面state中并刷新页面
		// 	}
        // }
        // this.props.MultiInit.getMultiLang({moduleId: '10140NAT', domainName: 'uapbd',callback})
        //add end
        //
        // this.props.button.setButtonsVisible({
        //     'Save':false,
        //     'Cancel':false
        // });
        //
        // //获取查询模板信息
        // // setTimeout(() => queryInfo = this.props.search.getQueryInfo(this.searchid),1) ;
        // // let OID = queryInfo.oid;
        //
        // let paramData = {
        //     querycondition: {},
        //     pageInfo:{},
        //     pagecode: pageId,
        //     queryAreaCode:searchid,  //查询区编码
        //     // oid:OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        //     querytype:'tree'
        // }
        // this.loadGridData(paramData);
    }

    componentDidUpdate(){
        let l_formstatus = this.props.editTable.getStatus(gridid);
        if(l_formstatus != 'add' && l_formstatus != "edit"){
            window.onbeforeunload = null;
        }
        else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    onloaddata(){
        this.props.button.setButtonsVisible({
            'Save':false,
            'Cancel':false
        });

        //获取查询模板信息
        // setTimeout(() => queryInfo = this.props.search.getQueryInfo(this.searchid),1) ;
        // let OID = queryInfo.oid;

        let paramData = {
            querycondition: {},
            pageInfo:this.props.editTable.getTablePageInfo(gridid),
            pagecode: pageId,
            queryAreaCode:searchid,  //查询区编码
            oid:this.props.meta.getMeta()[searchid].oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype:'tree'
        }
        this.loadGridData(false,paramData);
    }


    componentWillMount(){
        //modified wh 20181022 导入多语json
        //this.initTemplate(this.props,this.onloaddata.bind(this));
        let callback = (json, status, inlt) => {
			if (status) {
				this.setState({json, inlt},() => {
					this.initTemplate(this.props,this.onloaddata.bind(this))
				})       // 保存json和inlt到页面state中并刷新页面
			}
        }
        this.props.MultiInit.getMultiLang({moduleId: '10140NAT', domainName: 'uapbd',callback})

       
    }

    //加载列表数据
    loadGridData = (isToast,paramData,queryUrl)=>{

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
                        //表格数据启用状态 123 转化true false
                        data[gridid].rows =  _this.convertGridEnablestate(data[gridid].rows);
                        _this.props.editTable.setTableData(gridid,data[gridid]);
                        _this.props.button.setButtonDisabled({
                            'PrintGrp':false,
                            'Output':false,
                            'Delete':true
                        });
                    }else{

                        let nulldata = {
                                rows:[]
                            }
                        _this.props.editTable.setTableData(gridid,nulldata);
                        _this.props.button.setButtonDisabled({
                            'PrintGrp':true,
                            'Output':true,
                            'Delete':true
                        });
                    }
                    _this.props.editTable.setStatus('browse');

                    if(isToast===true){
                        toast({color: 'success', content: this.state.json['10140NAT-000003']+data[gridid].allpks.length+this.state.json['10140NAT-000004']});/* 国际化处理： 查询成功，共,条。*/
                    }
                    
                    this.setState({hasSearched:true});
                }
            },
            //add wh 20181018
            error: (res) => {
                if(isToast===true){
                    toast({color: 'warning', content: this.state.json['10140NAT-000005']});/* 国际化处理： 未查询出符合条件的数据*/
                }
            }
            //add end
        })

    }

    //表格数据启用状态 123 转化true false
    convertGridEnablestate= (griddata)=>{

        // if(griddata.length>0){
        //     griddata.map((ele,key)=>{
        //         if(ele.values.enablestate.value =='1'||ele.values.enablestate.value=='3'){
        //             ele.values.enablestate.value = false;
        //         }else{
        //             ele.values.enablestate.value = true;
        //         }
        //     });
        // }

        return griddata;

    }

    //按钮组选中事件
    onBtnMoreSelect({key}) {

        this.onClickButton(this.props,key);
    }

    //保留方法
    onVisibleChange(visible) {
        console.log(visible);
    }

    //按钮点击事件
    onClickButton(props,id){

        let _this = this;
        //获取选中行数据
        let rowsdata  = props.editTable.getCheckedRows(gridid);
        //获取分页信息
        let pageInfo =  props.editTable.getTablePageInfo(gridid);
        //查询区条件
        let searchval = (this.state.hasSearched && this.state.hasSearched == true)?props.search.getAllSearchData(searchid, false):null;
        //获取查询模板信息
        // let queryInfo = this.props.search.getQueryInfo(this.searchid);
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
                // props.editTable.openModel(gridid,'add');
                let num = this.props.editTable.getNumberOfRows(gridid);
                props.editTable.addRow(gridid,num,true);
                props.button.setButtonsVisible('Edit',false);
                props.button.setMainButton('Add',false);
                break;
            case 'Cancel':
                promptBox({
                    color:"warning",
                    title:this.state.json['10140NAT-000006'],/* 国际化处理： 确认取消*/
                    content:this.state.json['10140NAT-000007'],/* 国际化处理： 是否确认要取消!*/
                    beSureBtnClick: () => {
                        props.editTable.cancelEdit(gridid);
                        props.editTable.setStatus(gridid,'browse');
                        props.button.setButtonsVisible('Edit',true);
                        props.button.setMainButton('Add',true);
                        props.button.setButtonDisabled('Delete',true);
                        this.gridStatusChange();
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
                // if(!props.editTable.getAllRows(gridid))
                //     return;
                // props.editTable.openModel(gridid,'add');
                props.editTable.filterEmptyRows(gridid,keys);

                let changedRows = props.editTable.getAllData(gridid);//props.editTable.getChangedRows(gridid,true);
                if(!changedRows || changedRows.length === 0){
                    props.editTable.cancelEdit(gridid);
                    props.editTable.setStatus(gridid,'browse');
                    props.button.setButtonsVisible('Edit',true);
                    props.button.setMainButton('Add',true);
                    this.gridStatusChange();
                    return;
                }

                let tempMeta = this.props.meta.getMeta()

                let message = this.state.json['10140NAT-000022']
                changedRows.rows.forEach((row, index) => {
                    let nullItemList = []
                    tempMeta[gridid].items.forEach(item => {
                        if(item.required == true) {
                            if(row.values[item.attrcode].value == null || row.values[item.attrcode].value == '') {
                                nullItemList.push(`[${item.label}]`)
                            }
                        }
                    })
                    if(nullItemList.length > 0) {
                        message += this.props.MutiInit.getIntl("10140NAT").get('10140NAT-000023',{count:index + 1}) + nullItemList.join('、')
                    }    
                })
                if(message != this.state.json['10140NAT-000022']) {
                    toast({color: 'warning',content: message})
                    return
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
                                // this.props.editTable.updateTableData(gridid,res.data[gridid]);

                                /** NCCLOUD-172999-新增后修改校验重复-begin */
                                // Utils.filterResult(allD,res.data[gridid].rows);  返回没有rowid，所以更新不进去
                                let reDataRows = res.data[gridid].rows;
                                allD.rows.forEach((item,index) => {
                                    reDataRows.forEach((it,i) => {
                                        if(it.values.code.value === item.values.code.value){
                                            allD.rows[index] = it;
                                        }
                                    });
                                });
                                /** NCCLOUD-172999-新增后修改校验重复-begin */

                                //allD.rows[allD.rows.length-1].status = '0';
                                allD.rows.map(item => {
                                    return item.status = '0';
                                });
                                this.props.editTable.setTableData(gridid,allD);
                                // _this.loadGridData(false,paramData);
                                toast({ color: 'success', title: this.state.json['10140NAT-000008'] });/* 国际化处理： 保存成功*/
                            }
                            this.props.button.setButtonsVisible('Edit',true);
                            this.props.button.setMainButton('Add',true);
                            this.gridStatusChange();
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
                        title: this.state.json['10140NAT-000009'],/* 国际化处理： 确认删除*/
                        content: this.state.json['10140NAT-000010'],/* 国际化处理： 确定要删除所选数据吗？*/
                        beSureBtnClick: this.delete.bind(this,data,paramData)
                        });
                    }
                    
                }else{
                    promptBox({color:"warning",
                        title:this.state.json['10140NAT-000011'],/* 国际化处理： 提示*/
                        content:this.state.json['10140NAT-000012']/* 国际化处理： 请选择数据操作!*/
                    });
                }
                break;
            case 'PrintGrp':
                _this.onPrint();
                break;
            case 'Print':
                _this.onPrint();
                break;
            case 'Output':
                _this.onOutput();
                break;
            case 'Refresh':
                _this.loadGridData(false,paramData);
                toast({title:this.state.json['10140NAT-000020'],color:'success'});/* 国际化处理： 无可打印数据*/
            default:
                break;
        }
    }

    delete=(data,paramData)=>{

        ajax({
            url:urls['saveUrl'],
            data:data,
            success:(res)=>{
                if(res.success){    
                    this.props.button.setButtonDisabled(['Delete'],true);                                    
                    this.loadGridData(false,paramData);
                    toast({ color: 'success', title: this.state.json['10140NAT-000002'] });/* 国际化处理： 删除成功*/
                }else{
                    alert(res.message);
                }
            }
        })
    }

    //打印
    onPrint=()=>{

        let allData = this.props.editTable.getAllData(gridid);

        if(allData.length === 0){
            toast({content:this.state.json['10140NAT-000013'],color:'warning'});/* 国际化处理： 无可打印数据*/
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
    //输出
    onOutput=()=>{

        let allData = this.props.editTable.getAllData(gridid);
        if(allData.length === 0){
            toast({content:this.state.json['10140NAT-000014'],color:'warning'});/* 国际化处理： 无可输出的数据*/
            return;
        }
        let pks = [];

        allData.rows.forEach((item,key)=>{
            pks.push(item.values['pk_country'].value);
        });
        this.setState({
            ids : pks
        },this.refs.printOutput.open());
    }

    //分页信息点击事件
    onClickPageInfo(props,config, pks){
        let pageInfo = props.editTable.getTablePageInfo(gridid);
        let searchVal = props.search.getAllSearchData(searchid);
        // let queryparam = {};
        // if(searchVal!=null){
        //     searchVal.map((obj)=>{
        //         queryparam[obj.field] = obj.value.firstvalue;
        //
        //     });
        // }
        let paramdata = {
            pks,
            pageInfo:pageInfo,
            querycondition: searchVal
        };

        this.loadGridData(false,paramdata,'pageQueryUrl');
    }

    //查询区按钮点击事件
    onClickSearchBtn(props,data){

        if(props.editTable.getStatus() && props.editTable.getStatus() == 'edit'){
            promptBox({color:"warning",
                title:this.state.json['10140NAT-000011'],/* 国际化处理： 提示*/
                content:this.state.json['10140NAT-000015']/* 国际化处理： 编辑态不能查询*/
            });
        };

        //获取查询模板信息
        // let queryInfo = this.props.search.getQueryInfo(this.searchid);
        let OID = this.props.meta.getMeta()[searchid].oid;
            //queryInfo.oid;

        let paramdata = {
            querycondition: data==null?{}:data,
            pageInfo:props.editTable.getTablePageInfo(gridid),
            pagecode: pageId,
            queryAreaCode:searchid,  //查询区编码
            oid:OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype:'tree'
        }

        //校验通过后，条件查询请求
       this.loadGridData(true,paramdata);
    }

    //新增编辑模态框保存事件
    onModelConfirm(props,type,data){
        let paramdata = {
            pageid:'',
            gridmodel:{
                pageInfo:props.editTable.getTablePageInfo(gridid),
                areacode:gridid,
                rows:data
            }
        }
        ajax({
            url:urls['saveUrl'],
            data:paramdata,
            success:()=>{
                props.editTable.closeModel(gridid);
                props.linkTo('/uapbd/pubinfo/countryzone/main/index.html');
            }
        });
    }

    //模态框取消按钮事件
    onCloseTableModel(props){
    }

    //简单过滤区onSearch事件
    onSearchAfter(){
        let tableData = this.props.editTable.getAllRows(gridid)
        let keyWords = this.state.searchValue;

        if(keyWords ==''){
            this.loadGridData(true);
        }
        let tempTableData = {
            pageInfo:props.editTable.getTablePageInfo(gridid),
            areacode:gridid,
            rows:[]
        };
        tableData.map((ele)=>{
            if(ele.values.jobname.value.indexOf(keyWords)!=-1||ele.values.jobcode.value.indexOf(keyWords)!=-1){
                tempTableData.rows.push(ele);
            }
        });

        tempTableData.rows = this.convertGridEnablestate(tempTableData.rows);
        this.props.editTable.setTableData(gridid,tempTableData);
    }

    //简单过滤区onChange事件
    onChangeAfter(value){
        this.state.searchValue = value;
    }

    //显示停用按钮点击事件
    onCheckShowDisable(checked){
        this.state.checkValue = checked;

        let pageInfo = this.props.editTable.getTablePageInfo(gridid);
        let searchData = this.props.search.getAllSearchData(searchid);
        // let queryparam = {
        //     'enablestate':''
        // }
        // if(searchData!=null){
        //     searchData.map((obj)=>{
        //         queryparam[obj.field] = obj.value.firstvalue;
        //     });
        //
        // }
        let paramData = {
            pageInfo:pageInfo,
            querycondition: searchData
        };
        checked ===true?paramData.querycondition.enablestate = '2':paramData.querycondition.enablestate = '3';
       this.loadGridData(false,paramData);
    }

    //模态框编辑后事件
    onTableModelAfterEdit(props,moduleId,key,value,changedrows,record,index){
        // props, moduleId, key, value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）){
        //获取修改行的数据
        //如果启用状态修改
        let currentrowdata = props.editTable.getChangedRows(moduleId,true)[0];
        //ajax回传参数
        let _this = this;
        let  paramdata = {
            pageid:'10140NAT_czncc',
            gridmode:{
                areacode:gridid,
                pageInfo:props.editTable.getTablePageInfo(gridid),
                rows:[]
            }
        }
        if(key =='enablestate'){
            if(value){//如果是启用
                props.modal.show('modal',{
                    'content':this.state.json['10140NAT-000016'],/* 国际化处理： 确定启用？*/
                    beSureBtnClick:()=>{
                        currentrowdata.values.enablestate.value = '2';
                        paramdata.gridmode.rows.push(currentrowdata);
                        ajax({
                            url:'/nccloud/uapbd/CountryZone/CountryZoneEnable.do',
                            data:paramdata,
                            success:(res)=>{
                                if(res.success){
                                _this.loadGridData(false,paramdata)
                                }
                            },
                            error:(res) =>{
                                props.editTable.setValByKeyAndIndex(moduleId,index,key,{value:false});

                            }
                        });
                    },
                    cancelBtnClick:()=>{
                        props.editTable.setValByKeyAndIndex(moduleId, index, key, {value: false});
                        props.editTable.cancelEdit(moduleId)

                    }
                });
            }else{//如果是停用
                props.modal.show('modal',{
                    'content':this.state.json['10140NAT-000017'],/* 国际化处理： 确定停用？*/
                    beSureBtnClick:()=>{
                        currentrowdata.values.enablestate.value = '3';
                        paramdata.gridmode.rows.push(currentrowdata);
                        ajax({
                            url:'/nccloud/uapbd/CountryZone/CountryZoneDisable.do',
                            data:paramdata,
                            success:(res)=>{
                                if(res.success){
                                _this.loadGridData(false,paramdata)
                                }
                            },
                            error:(res) =>{
                                props.editTable.setValByKeyAndIndex(moduleId,index,key,{value:true});

                            }
                        });
                    },
                    cancelBtnClick:()=>{

                        props.editTable.setValByKeyAndIndex(moduleId,index,key, {value:true});
                    }
                });

            }

        }

    }

    //表格状态改变监听事件
    gridStatusChange(){
        //modified by wh 20181022
        let gridStatus =  this.props.editTable.getStatus(gridid);
        if(gridStatus ==='browse'){
            this.props.button.setButtonsVisible({
                'Save':false,
                'Cancel':false,
                'Add':true,
                'Edit':true,
                'Delete':true,
                'Refresh':true,
                'PrintGrp':true,
                'Output':true
            })
            this.props.button.setPopContent('DelLine',this.state.json['10140NAT-000000']);/* 国际化处理： 确定要删除吗？*/
        }else{
            this.props.button.setButtonsVisible({
                'Save':true,
                'Cancel':true,
                'Add':true,
                'Edit':false,
                'Delete':true,
                'Refresh':false,
                'PrintGrp':false,
                'Output':false
            })
            this.props.button.setPopContent('DelLine','');
        }
        // gridStatus ==='browse' ?this.props.button.setButtonsVisible({
        //     'Save':false,
        //     'Cancel':false,
        //     'Add':true,
        //     'Edit':true,
        //     'Delete':true,
        //     'Refresh':true,
        //     'PrintGrp':true,
        //     'Output':true
        // }):this.props.button.setButtonsVisible({
        //     'Save':true,
        //     'Cancel':true,
        //     'Add':true,
        //     'Edit':false,
        //     'Delete':true,
        //     'Refresh':false,
        //     'PrintGrp':false,
        //     'Output':false
        // })
    }

    //表格行选中事件
    gridBeChecked(props){
        //此处控制按钮的隐藏显示及启用状态
        let tableData = props.editTable.getCheckedRows(gridid);
        let length = tableData.length;//获取列表页选择数据的行数
        if(length === 0){//未选择数据
            props.button.setDisabled({
                'btnDel': true
            });
        }else if(length === 1){//选择一行数据
            props.button.setDisabled({
                'btnDel': false
            });
        }else {//选择多行数据
            props.button.setDisabled({
                'btnDel': false
            });
        }

    }

    // 列表勾选事件gridid
    onSelected=()=>{
        
        let rows = this.props.editTable.getCheckedRows(gridid);

        let isDisable = (rows && rows.length>0)?false:true;

        this.props.button.setButtonDisabled(['Delete'],isDisable);

        //重新渲染页面
        this.setState(this.state);
    }

    onDelForBrowse(){}

    render() {
        const {editTable,button ,search,modal, BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        const { createButtonApp } = button;
        const { NCCreateSearch } = search;
        const {createModal} = modal;
        const {createEditTable} = editTable;
        const tableState = this.props.editTable.getStatus(gridid);

        return (
            <div className="nc-single-table">
                {/* 头部 header */}
                <NCDiv className="nc-singleTable-header-area" style={tableState == 'browse' ? {}:{border:'none'}} areaCode={NCDiv.config.HEADER}>
                    {/* 标题 title */}
                    <div className="header-title-search-area">
                        {createBillHeadInfo(
                            {
                                title: this.state.json['10140NAT-000018']/* 国际化处理： 国家地区*/,
                                backBtnClick:()=>{},
                                initShowBackBtn: false
                            }
                        )}
                    </div>
                    {/* 按钮区  btn-group */}
                    <div className="header-button-area header-button-area-print-btn">
                        {createButtonApp({
                            area: 'header',//按钮注册中的按钮区域
                            onButtonClick: this.onClickButton.bind(this)
                        })}
                    </div>
                </NCDiv>

                <div className="nc-singleTable-search-area" style={{display: tableState == 'browse' ? '': 'none'}}>
                    {NCCreateSearch(searchid, {//查询区
                        clickSearchBtn: this.onClickSearchBtn.bind(this)
                    })}
                </div>
                {/* 列表区 */}
                <div className="nc-singleTable-table-area">
                    {createEditTable(gridid, {
                        handlePageInfoChange: this.onClickPageInfo.bind(this),
                        onCloseModel:this.onCloseTableModel.bind(this),
                        //tableModelConfirm:this.onModelConfirm.bind(this),
                        onAfterEvent:this.onTableModelAfterEdit.bind(this),
                        statusChange:this.gridStatusChange.bind(this),
                        selectedChange:this.gridBeChecked.bind(this),
                        onSelected:this.onSelected.bind(this),
                        onSelectedAll:this.onSelected.bind(this),
                        showCheck:true,
                        showIndex:true,
                        isAddRow:true,
                        showPagination:true,
                        adaptionHeight:true
                    })}
                </div>
                {/* 删除前确认模态框 */}
                {createModal('modal',{})}
                <PrintOutput
                    ref='printOutput'
                    url={urls['printUrl']}
                    data={{
                        funcode:appcode,//功能节点编码
                        nodekey:printNodeKey,//模板节点编码
                        oids : this.state.ids,
                        outputType : 'output'
                    }}
                />
            </div>
        )
    }
}

CountryZoneTable = createPage({
    //initTemplate: initTemplate
    billinfo:[{
        billtype: 'grid',
        pagecode: pageId,
        bodycode: gridid
        //headcode:gridid
    }],
    mutiLangCode: appcode
})(CountryZoneTable);

ReactDOM.render(<CountryZoneTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65