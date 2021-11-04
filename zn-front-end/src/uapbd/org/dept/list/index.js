//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, ajax, base,high,toast,print,createPageIcon } from 'nc-lightapp-front';
const {NCForm,NCInput,NCTable,NCBackBtn,NCDiv} = base;
const {PrintOutput} = high;
//import SetOfBookGridRef from '../../../refer/org/SetOfBookGridRef';
let searchId='deptquery';
let pageCode='10100DEPT_deptlist';
let appCode='10100DEPT';
let tableid='dept';
let billType='dept';
let urls={
    print:'/nccloud/baseapp/dept/print.do',
    deptquery:'/nccloud/baseapp/dept/queryarea.do',
    deptpagequery:'/nccloud/baseapp/dept/querypage.do',
};

class DeptList extends Component {

    constructor(props) {
        super(props);
        this.config={
            oid:''
        }
        this.state={
            allpks : [], //所有pk
            json:this.props.config.json,//多语资源文件数据
            queryparam:{
                pageInfo:{},//分页器模型
                ids:[],
                querycondition: {},
                queryAreaCode:searchId,  //查询区编码
                oid:'1010Z010000000005HKC',  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                querytype:'tree',
                custcondition:{
                    conditions:[],
                    logic:'and'
                }
            },
            curOrg:{   //当前主组织
                pk:'',
                name:''
            }
        };

        this.loadMeta(()=>{
            //this.loadData(this.state.queryparam);
            this.loadData({
                querycondition: this.props.search.getAllSearchData(searchId),
                queryAreaCode:searchId,  //查询区编码
                oid:this.props.search.getQueryInfo(searchId).oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                querytype:'tree',
                custcondition:{
                    conditions:[],
                    logic:'and'
                }
            },'init');
        });
    }

    loadMeta(initData){
        let prop=this.props;
        prop.createUIDom(
            {
                pagecode: pageCode//,//页面id
                //appcode: appCode//注册按钮的id
            }, 
             (data)=>{
                if(data){
                    if(data.context&&data.context.pk_org&&data.context.org_Name){
                        this.setState({
                            curOrg:{
                                pk:data.context.pk_org,
                                name:data.context.org_Name
                            }
                        })
                    }
                    if(data.template){
                        let meta = data.template;
                        this.config.oid=meta[searchId].oid
                        let pk_fatherorg = meta['deptquery'].items.find(item => item.attrcode === 'pk_fatherorg');
                        let deptlevel = meta['deptquery'].items.find(item => item.attrcode === 'deptlevel');
                        pk_fatherorg.isShowUnit = true;
                        deptlevel.queryCondition=()=>{
                            return {
                                pk_defdoclist:'1010ZZ10000000003PHX'
                            }
                        }
                        //设置部门高级查询参照是否显示停用选项
                        let principal = meta['deptquery'].items.find(item => item.attrcode === 'principal');
                        principal.isShowDisabledData=true;
                        if(data.button){
                            let button = data.button;
                            prop.button.setButtons(button);
                        }  
                        prop.meta.setMeta(meta,()=>{
                            initData&&initData();
                        });
                        
                    }
                } 
                
                
            }
        )
    }

    onButtonClick(props,id){
        switch (id){
            
            case 'refresh':
                this.loadData(this.state.queryparam,()=>{
                    toast({title:this.props.config.json['10100DEPT-000025'],color:"success"});/* 国际化处理： 刷新成功！*/
                });
                break;
            case 'print':
                let printParam={
                    funcode:appCode,
                    nodekey:'deptListPrint'
                };
                this.pintFunction(printParam);
                break;
            case 'export':
                //let pks=[];
                // let pks=this.props.table.getPks(tableid);//获取当前页所有的Pk
                /*this.props.editTable.getAllData(tableid).rows.forEach((item)=>{
                    pks.push(item.values['pk_dept'].value);
                });*/
                let {allpks} = this.state;
                this.setState({
                    ids : allpks
                },this.refs.printOutput.open());
                break;
            case 'return':
                //返回时回调函数卸载该组件
                this.props.config('N',{json:this.props.config.json,cacheOrg:this.props.cacheOrg,cacheRefPk:this.props.cacheRefPk});
                break;
            case 'export_card':
                this.setState(this.state,()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
        }
    }

    //输出和打印功能函数
	pintFunction(param){
		//let allData=this.props.editTable.getAllData(tableid);
        /*let pks=[];
		allData.rows.forEach((item)=>{
			pks.push(item.values['pk_dept'].value);
		});
        param.oids=pks;*/

        // let pks=this.props.table.getPks(tableid);//获取当前页所有的Pk
        // param.oids=pks;
		// print(
		// 	'pdf',
		// 	urls['print'],
		// 	param
        // );
        /**liyfp 输出查询出来部门的数据 ****/
        let {allpks} = this.state;
        param.oids=allpks;
		print(
			'pdf',
			urls['print'],
			param
		);
	}

    //刷新或查询时调用该方法
    loadData(param,prompt){
        ajax({
            url:urls['deptquery'],
            data:param,
            success: (res) => {
                this.setState({allpks : res.data[tableid].allpks});
                if(res.success&&res.data){
                    //适配显示公式
					if(res.formulamsg&&res.formulamsg instanceof Array&&res.formulamsg.length>0){
						this.props.dealFormulamsg(
							res.formulamsg,
							{
								tableid:"simpleTable"
							}
						);
					}

                    res.data[tableid].rows.forEach((row)=>{
                        row.values['displayorder'].value=row.values['displayorder'].value=='999999'?null:row.values['displayorder'].value
                    });
                    this.props.table.setAllTableData(tableid, res.data[tableid]);
                    //如果刷新成功，需要给出提示
					if(prompt&&(prompt instanceof Function)){
						prompt();
					}else if(prompt=='init'){
                        
                    }else{
                        toast({content:this.props.config.json['10100DEPT-000068']+res.data[tableid].allpks.length+this.props.config.json['10100DEPT-000069'],color:"success"});/* 国际化处理： 查询成功，共,条。*/
                    }
                    this.props.button.setDisabled({
                        print:false,
                        export:false
                    });
                }else{
                    this.props.table.setAllTableData(tableid, {rows:[]});
                    if(prompt&&(prompt instanceof Function)){
						prompt();
					}else if(prompt=='init'){
                        
                    }else{
                        toast({content:this.props.config.json['10100DEPT-000070'],color:"warning"});/* 国际化处理： 未查询出符合条件的数据！*/
                    }
                    this.props.button.setDisabled({
                        print:true,
                        export:true
                    });
                }
            },
            error : (res)=>{
                console.log(res.message);
            }
        });
    }

    onPageModalClick(props,config,pks){
        let pageInfo=props.table.getTablePageInfo(tableid);
        ajax({
            url:urls['deptpagequery'],
            data:{pk_depts:pks},
            success: (res) => {
                if(res.success&&res.data){
                    //适配显示公式
					if(res.formulamsg&&res.formulamsg instanceof Array&&res.formulamsg.length>0){
						this.props.dealFormulamsg(
							res.formulamsg,
							{
								tableid:"simpleTable"
							}
						);
					}

                    res.data[tableid].rows.forEach((row)=>{
                        row.values['displayorder'].value=row.values['displayorder'].value=='999999'?null:row.values['displayorder'].value
                    });
                    this.props.table.setAllTableData(tableid, res.data[tableid]);
                }else{
                    this.props.table.setAllTableData(tableid, {rows:[]});
                    toast({content:this.props.config.json['10100DEPT-000070'],color:"warning"});/* 国际化处理： 未查询出符合条件的数据！*/
                }
            },
            error : (res)=>{
                console.log(res.message);
            }
        });
    }

    //查询区事件处理
	clickSearchBtn = (props,searchVal)=>{
        searchVal=this.props.search.getQueryInfo(searchId);
        searchVal.custcondition={
            conditions:[],
            logic:'and'
        };

        /*let data = {
            querycondition: searchVal==null?null:searchVal,
            queryAreaCode:searchId,  //查询区编码
            oid:'1010Z010000000005HKC',  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype:'tree',
            custcondition:{
                conditions:[],
                logic:'and'
            }
        };*/
        
        this.setState({queryparam:searchVal});//将查询区数据放到state里，作刷新时用到
        this.loadData(searchVal);
    }
    //查询区渲染后事件
    renderCompleteEvent(){
        this.props.search.setSearchValByField(searchId,'pk_org',{value: this.state.curOrg.pk, display: this.state.curOrg.name})
    }

    render(){
        if(!this.state.json)
        return '';
        let { table ,search ,button,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButton } = button;
        let { createButtonApp } = button;
        return (

            <div className="nc-single-table">
                <NCDiv  areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area">
                    <div className="header-title-search-area">
                        {createBillHeadInfo({
                            title:this.state.json['10100DEPT-000000']/* 国际化处理： 部门*/,
                            backBtnClick: this.onButtonClick.bind(this,null,'return'),
                            showBackBtn:true,
                            initShowBackBtn:true}
                        )}
                    </div>
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'deptlist_btn',
                            buttonLimit: 3, 
                            onButtonClick: this.onButtonClick.bind(this), 
                            popContainer: document.querySelector('.header-button-area')
                        })}
                    </div>
                </NCDiv>
                <div className="nc-singleTable-search-area">
                    {NCCreateSearch(searchId, {
                        clickSearchBtn: this.clickSearchBtn.bind(this),
                        oid:this.config.oid,
                        renderCompleteEvent:this.renderCompleteEvent.bind(this)
                    })}
                </div>
				<div className='nc-singleTable-table-area'>
					{/*createEditTable(tableid, {//列表区
						showIndex:true,				//显示序号                            // 自定义传参
                        useFixedHeader:true
                    })*/}
                    {createSimpleTable(tableid,{
                        handlePageInfoChange:this.onPageModalClick.bind(this),
                        showIndex:true,
                        showCheck:false
                    })}
				</div>
                <PrintOutput
					ref='printOutput'
					url={urls['print']}
					data={{
						funcode : '10100DEPT',
						nodekey : 'deptListPrint',
                        // oids : this.state.ids,
                        oids : this.state.allpks,
						outputType : 'output'
					}}
				/>
            </div>
        )
    }

}

DeptList = createPage({
	initTemplate: ()=>{}
})(DeptList);
export default DeptList;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65