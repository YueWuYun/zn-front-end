//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 银行账户授权情况查询-集团
 * @author	wanglqh
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,cacheTools,toast,cardCache,createPageIcon } from 'nc-lightapp-front';
import  Utils from '../../../public/utils';
import createUIDom from '../../../public/utils/BDCreateUIDom';
let {setDefData, getDefData } = cardCache;
let { NCPopconfirm,NCModal ,NCDropdown, NCIcon, NCMenu, NCButton,NCDiv} = base;
let {BDselect} = Utils;
import './index.less'

const searchid = '1014180802';
const tableid = 'head';
const pagecode = '10140BAQG_list';
const datasource = 'bankaccusepowerbankaccoid';
const urls = {
	save : '/nccloud/riamm/defdoclist/save.do',
	query : '/nccloud/uapbd/bankaccusepower/query.do',
	queryTemplet : '/nccloud/platform/templet/querypage.do'
};
let allTableData = {};
const keys = ['doclevel','isgrade','isrelease','mngctlmode'];  //过来空行时，忽略的字段



class SingleTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		
		this.state={
			searchValue:'',
			json: {},
			//curOrg:{},
			searchDisable:true,				//简单搜索框是否禁用	true：禁用		false：可用
			showOffDisable:true,			//显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff:false				//列表是否显示停用数据
		}

		this.initTemplate(props);
	}

	
	//初始化单据模板
    initTemplate = (props,callback) => {
		let that = this;
		let data1 = {
			"display":null,
			"value": null
		};
        createUIDom(props)(
            {
                pagecode:props.config.pageCode//页面id
            // appcode:props.config.appcode//注册按钮的id
            },
            {
                moduleId: '10140BAQG',domainName: 'uapbd'
            },
            (data, langData)=>{ //(data, langData)
                if(langData){
					this.state.json = langData
					if(props.config.nodeType == 'GROUP_NODE'){
						props.config.nodeName = props.MutiInit.getIntl("10140BAQG") && props.MutiInit.getIntl("10140BAQG").get('10140BAQG-000004')//this.state.json['10140Z00-000000'],/* 国际化处理： 银行账户授权情况查询-集团*/
					}else{
						props.config.nodeName = props.MutiInit.getIntl("10140BAQG") && props.MutiInit.getIntl("10140BAQG").get('10140BAQG-000005')//this.state.json['10140Z00-000000'],/* 国际化处理： 银行账户授权情况查询-财务组织*/
					}
                }
                if (data) {
                	//默认业务单元赋值
                    // let ccontext = data.context || {};
                    // that.state.curOrg = {
                    //     refpk : ccontext.pk_org,
                    //     refname : ccontext.org_Name,
                    //     display : ccontext.org_Name,
                    //     values : {refpk : ccontext.pk_org, refname : ccontext.org_Name}
                    // };
                    if(data.template){
							let meta = data.template;
							setDefData('bankaccoid',datasource,data.template['1014180802'].oid);
							//cacheTools.set('bankaccoid',data.template['1014180802'].oid);
								meta['1014180802'].items.map((obj)=>{
									if(obj.attrcode == 'pk_org'){
										if(props.config.nodeType == 'GROUP_NODE'){
												obj.disabled = true;	
												obj.required = false;
												data1 = {
													"display":this.props.MutiInit.getIntl("10140BAQG") && this.props.MutiInit.getIntl("10140BAQG").get('10140BAQG-000000'), //this.state.json['10140BAQG-000000'],/* 国际化处理： 当前集团*/
													"value": this.props.MutiInit.getIntl("10140BAQG") && this.props.MutiInit.getIntl("10140BAQG").get('10140BAQG-000000'), //this.state.json['10140BAQG-000000'],/* 国际化处理： 当前集团*/
												};
										//props.search.setSearchValByField('1014180802',obj.attrcode, data1);
										}else{
											data1 = {
												"display":data.context.org_Name,
												"value": data.context.pk_org
											};
											//主组织增加可见性组织过滤
											obj.isMultiSelectedEnabled = true;
											obj.queryCondition = function () {
												return {
													TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgWithGroupSQLBuilder',
													AppCode:props.config.appcode
												}
											}
										}
									}
									if(obj.attrcode == 'pk_useorg' || obj.attrcode == 'controlorg' || obj.attrcode =='pk_opendept'){
										obj.isShowDisabledData = true;
									}
								})
							props.meta.setMeta(meta,()=>{ props.search.setSearchValByField('1014180802','pk_org', data1); });
                	}
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button);
                    }
                    callback && callback();
                }
            }
        )
		}
		
		
	componentDidMount() {
		//this.getData();
	}

	//点击查询按钮  单表页面去除查询区
	onSearchBtnClick(props,data) {
		// let queryInfo = this.props.search.getQueryInfo(props.config.searchid)
        // let OID = queryInfo.oid
		let searchVal = this.props.search.getAllSearchData(searchid);
		let metaData = this.props.meta.getMeta();
		// let conditions = [];
		// let custcondition = {};
		// conditions.push({display:'',field:'nodetype',oprtype:'like',value:{firstvalue:this.props.config.nodeType,secondvalue:null}});
		// custcondition = {conditions,logic:'or'};

		let datacondition = {
			querycondition:data,
			// custcondition:{
			//     conditions:[{
			//         field:'pk_group',
			//         value:{
			//             firstvalue:null
			//         },
			//         oprtype:'='
			//     }]
			// },
			custcondition:{},
			nodetype:this.props.config.nodeType,
			pagecode:this.props.config.pagecode,
			queryAreaCode:this.props.config.searchid,
			pageInfo:{},
			querytype:'tree',
			oid:getDefData('bankaccoid',datasource)
		};
		// let data={
		// 	"conditions":searchVal.conditions,
		// 	"nodetype":this.props.config.nodeType,
		// 	//editTable不提供分页
		// 	"pagecode": this.props.config.pagecode,
		// 	"queryAreaCode":this.props.config.searchid,  //查询区编码
		// 	"oid":cacheTools.get('bankaccoid'),  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
		// 	"queryType":"tree"
		//  }
	
		ajax({
			url: urls['query'],
			data: datacondition,
			success:  (res)=> {
				let { success, data } = res;
				if (success && data) {
					data.head.rows.map((obj)=>{
						obj.values['pk_bankaccbas.accopendate'].value = obj.values['pk_bankaccbas.accopendate'].value.substring(0,10);
						obj.values['pk_bankaccbas.accopendate'].display = obj.values['pk_bankaccbas.accopendate'].display.substring(0,10);
					});
					this.props.editTable.setTableData(tableid, data[tableid]);
					toast({content:this.state.json['10140BAQG-000001']+data[tableid].rows.length+this.state.json['10140BAQG-000002'],color:"success"});/* 国际化处理： 查询成功，共,条*/
				}else{
					this.props.editTable.setTableData(tableid, {rows: []});
					toast({content:this.state.json['10140BAQG-000003'],color:"warning"});/* 国际化处理： 未查询出符合条件的数据！*/

				}
			}
		}); 
	} 


	render() {
		let { table, button, search,editTable,modal,BillHeadInfo } = this.props;
		const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButton } = button;
		let {NCFormControl,NCCheckbox} = base;
		let {createModal} = modal;
		const { Item } = NCMenu;

		return (
			<div className="nc-single-table">
				{/* 标题 title */}
				<NCDiv  areaCode={NCDiv.config.HEADER} className = 'nc-singleTable-header-area'>
                <div className="header-title-search-area" >
					{ /*createPageIcon()*/ }
					<h2 className="title-search-detail">
						{createBillHeadInfo({ 
                            title:this.props.config.nodeName,
                            initShowBackBtn:false
                        })}
					</h2>
					{/* 按钮区  btn-group */}
					</div>
					{/* 单表页面去除查询区 */}
					{ }
				</NCDiv>
					
				<div className="nc-singleTable-search-area">
					{NCCreateSearch(searchid, {//查询区
						clickSearchBtn: this.onSearchBtnClick.bind(this),		//查询按钮点击事件绑定
						defaultConditionsNum:3,		//默认显示查询添加个数，如果不传该参数则全部显示 
						oid:getDefData('bankaccoid',datasource)
						//saveSearchPlan:true			//是否显示保存方案，默认false不显示
					})}
				</div>
				{/* 列表区 */}
				<div className='nc-singleTable-table-area'>
					<div className="table-area">
						{createEditTable(tableid, {//列表区
							useFixedHeader:true,    
							showIndex:true,				//显示序号
							adaptionHeight: true,
							showCheck:false			//显示复选框
						})}
					</div>
				</div>
			</div>
		);
	}
}

SingleTable = createPage({
	//initTemplate: initTemplate
	mutiLangCode: '10140BAQG'
})(SingleTable);
export default SingleTable;
//ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65