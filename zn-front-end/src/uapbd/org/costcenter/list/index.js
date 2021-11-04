//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, ajax, base,high,toast,print,getBusinessInfo,createPageIcon } from 'nc-lightapp-front';
const { PrintOutput } = high;
import './index.less'
const {NCForm,NCInput,NCTable,NCBackBtn,NCDiv} = base;
let loginContext=getBusinessInfo();//当前登录用户信息
let searchId='costcenterquery';
let pageCode='10100CC_listView';
let appCode='10100CC';
let tableid='resacostcenter';
let oid='1001Z31000000000YUNS';//查询模板oid
let urls={
    print:'/nccloud/uapbd/costcenter/print.do',
    costcenterquery:'/nccloud/uapbd/costcenter/queryarea.do'
};


class CostcenterList extends Component {

    constructor(props) {
		super(props);
        this.state={
            queryparam:{
                querycondition: {},
                queryAreaCode:searchId,  //查询区编码
                oid:oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                querytype:'tree',
                custcondition:{
                    conditions:[],
                    logic:'and'
                }
            }
        };

        this.loadMeta(()=>{
            let searchVal=this.props.search.getQueryInfo(searchId);
            searchVal.custcondition={
                conditions:[],
                logic:'and'
            };
            this.loadData(searchVal,'init');
        });
    }

    //加载模板
    loadMeta(initData){
        let prop=this.props;
        prop.createUIDom(
            {
                pagecode: pageCode
            }, 
            function (data){
                if(data.button){
                    let button = data.button;
                    prop.button.setButtons(button);
                } 
                if(data){
                    if(data.template){
                        let meta = data.template;
                        //设置集团不可编辑，并赋默认值
                        let pk_group = meta['costcenterquery'].items.find(item => item.attrcode === 'pk_group');
                        pk_group.disabled='Y';//禁用集团参照
                        //pk_group.isShowDisabledData=true;
                        //设置所属业务单元、上级成本中心、负责人、创建人、修改人、所属利润中心、所属财务组织、所属工厂是否显示停用数据
                        let pk_org = meta['costcenterquery'].items.find(item => item.attrcode === 'pk_org');
                        pk_org.isShowDisabledData=true;
                        let pk_father = meta['costcenterquery'].items.find(item => item.attrcode === 'pk_father');
                        pk_father.isShowDisabledData=true;
                        let pk_principal = meta['costcenterquery'].items.find(item => item.attrcode === 'pk_principal');
                        pk_principal.isShowDisabledData=true;
                        let creator = meta['costcenterquery'].items.find(item => item.attrcode === 'creator');
                        //creator.isShowDisabledData=true;
                        let modifier = meta['costcenterquery'].items.find(item => item.attrcode === 'modifier');
                        //modifier.isShowDisabledData=true;
                        let pk_profitcenter = meta['costcenterquery'].items.find(item => item.attrcode === 'pk_profitcenter');
                        pk_profitcenter.isShowDisabledData=true;
                        let pk_financeorg = meta['costcenterquery'].items.find(item => item.attrcode === 'pk_financeorg');
                        pk_financeorg.isShowDisabledData=true;
                        let pk_factory = meta['costcenterquery'].items.find(item => item.attrcode === 'pk_factory');
                        pk_factory.isShowDisabledData=true;
    
                        prop.meta.setMeta(meta);
                        prop.search.setSearchValByField(searchId,'pk_group',{value: loginContext.groupId, display: loginContext.groupName});
                        prop.search.setSearchValByField(searchId,'pk_org',{value: data.context.pk_org, display: data.context.org_Name})
                    }
                } 
                initData(); 
            }
        )
    }

    onButtonClick(props,id){
        switch (id){
            
            case 'refresh':
				let refreshParam = this.state.queryparam;//获取state中维护的查询条件
                //查询条件中没有conditions,说明没有做查询，直接点刷新
                if(!refreshParam.querycondition.conditions){
                    //参考查询操作，来构造查询条件
                    refreshParam=this.props.search.getQueryInfo(searchId);
                    refreshParam.custcondition={
                        conditions:[],
                        logic:'and'
                    };
                }
                this.loadData(refreshParam,()=>{
                    toast({title:this.props.config.json['10100CC-000004'],color:"success"});/* 国际化处理： 刷新成功！*/
                });
                break;
            case 'print':
                let printParam={
                    funcode:appCode,
                    nodekey:'listView'
                };
                this.pintFunction(printParam);
                break;
            case 'export':
                let allData=this.props.editTable.getAllData(tableid);
                let pks=[];
                allData.rows.forEach((item)=>{
                    pks.push(item.values['pk_costcenter'].value);
                });
                this.setState({
                    ids: pks
                }, this.refs.printOutput.open());
                break;
            case 'return':
                //返回时回调函数卸载该组件
                this.props.config('N',{json:this.props.config.json,cacheOrg:this.props.cacheOrg,cacheRefPk:this.props.cacheRefPk});
                break;
        }
    }

    //输出和打印功能函数
	pintFunction(param){
		let allData=this.props.editTable.getAllData(tableid);
        let pks=[];
		allData.rows.forEach((item)=>{
			pks.push(item.values['pk_costcenter'].value);
		});
		param.oids=pks;
		print(
			'pdf',
			urls['print'],
            param
		);
	}

    loadData(param,prompt){
        ajax({
            url:urls['costcenterquery'],
            data:param,
            success: (res) => {
                if(res.success&&res.data){
                    //适配显示公式
					if(res.formulamsg&&res.formulamsg instanceof Array&&res.formulamsg.length>0){
						this.props.dealFormulamsg(
							res.formulamsg,
							{
								tableid:"editTable"
							}
						);
					}

                    this.props.editTable.setTableData(tableid, res.data[tableid]);
                    //如果刷新成功，需要给出提示
					if(prompt&&(prompt instanceof Function)){
						prompt();
					}else if(prompt=='init'){
                        
                    }else{
                        toast({content:this.props.config.json['10100CC-000037']+res.data[tableid].rows.length+this.props.config.json['10100CC-000038'],color:"success"});/* 国际化处理： 查询成功，共,条。*/
                    }
                    this.props.button.setDisabled({
                        print:false,
                        export:false
                    });
                }else{
                    this.props.editTable.setTableData(tableid, {rows:[]});
                    if(prompt&&(prompt instanceof Function)){
						prompt();
					}else if(prompt=='init'){
                        
                    }else{
                        toast({content:this.props.config.json['10100CC-000039'],color:"warning"});/* 国际化处理： 未查询出符合条件的数据！*/
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
            oid:oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype:'tree',
            custcondition:{
                conditions:[],
                logic:'and'
            }
        };*/
        this.setState({queryparam:searchVal});//将查询区数据放到state里，作刷新时用到
        this.loadData(searchVal);
    }

    clickSuperSearch=()=>{
        this.props.search.setSearchValByField(searchId,'pk_group',{value: loginContext.groupId, display: loginContext.groupName});
        //this.prop.search.setSearchValByField(searchId,'pk_org',{value: data.context.pk_org, display: data.context.org_Name})
    }

    render(){

        let { editTable ,search ,button,BillHeadInfo} = this.props;
        let { createEditTable } = editTable;
        let { NCCreateSearch } = search;
        let { createButton } = button;
        let { createButtonApp } = button;
        const {createBillHeadInfo} = BillHeadInfo;
        return (
        <div className="nc-bill-list">
            <div className="nc-single-table">
                <NCDiv  areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area" >
                    <div className="header-title-search-area" >
                        {/* <NCBackBtn className='title-search-detail'
                            onClick={this.onButtonClick.bind(this,null,'return') }></NCBackBtn> */}
                        {/* {createPageIcon()}标题图标 */}
                        {/* <h2 className="title-search-detail title-page" style={{fontSize:'16px'}}>{this.props.config.json['10100CC-000000']/* 国际化处理： 成本中心}</h2> */}
                        {createBillHeadInfo({
                            title:this.props.config.json['10100CC-000000']/* 国际化处理： 成本中心*/,
                            initShowBackBtn:true,
                            backBtnClick:this.onButtonClick.bind(this,null,'return')
                        })}
                    </div>
                    <div className="header-button-area btnList costcenter_output">
                        {createButtonApp({
                            area: 'list_btn',
                            buttonLimit: 3, 
                            onButtonClick: this.onButtonClick.bind(this), 
                            popContainer: document.querySelector('.header-button-area')
                        })}
                    </div>
                </NCDiv>
                <div className="nc-bill-search-area btnList">
					{NCCreateSearch(searchId, {
                        clickSearchBtn: this.clickSearchBtn.bind(this),
                        statusChangeEvent:this.clickSuperSearch.bind(this)
					})}
				</div>
				<div className='nc-bill-table-area'>
					{createEditTable(tableid, {//列表区
						showIndex:true,				//显示序号                            // 自定义传参
                        useFixedHeader:true,
                        adaptionHeight:true
					})}
				</div>
                <PrintOutput
                    ref='printOutput'
                    url={urls['print']}
                    data={{
                        funcode: appCode,
                        nodekey: 'listView',
                        oids: this.state.ids,
                        outputType: 'output'
                    }}
                />
            </div>
        </div>
        )
    }

}

CostcenterList = createPage({
	initTemplate: ()=>{}
})(CostcenterList);
export default CostcenterList;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65