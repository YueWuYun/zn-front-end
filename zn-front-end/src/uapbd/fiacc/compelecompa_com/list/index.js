//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage,high,base,toast,cardCache,getMultiLang,createPageIcon} from 'nc-lightapp-front';
import {buttonClick,initTemplate,doubleClick,pageInfoClick,onClickSearchBtn} from './events';
const {NCDiv } = base;
import {multiLangCode,searchId,tableId,oid,pkname,module,} from './constants';
import {onListButtonControl} from '../../../public/excomponents/pubUtils/buttonVisible';
import defaultPeriod from '../../../public/excomponents/pubUtils/defaultPeriod.js';
import { operateTypeChange } from '../../../public/excomponents/pubUtils/operateTypeChange';
let {setDefData, getDefData } = cardCache;
//引入缓存---end
/**
 * 
 *
 */

class JobEditTable extends Component {
    constructor(props){
        super(props);
        this.state={
            billtype:null,
            json:{},
            trackshow: false,//单据追溯模态框显示、隐藏
            checkId:null,//选中数据主键
            forceRender: true,//导出模板懒加载，true为不加载，false为加载
        },
        this.Info = {
			allButtonsKey :[],//保存所有头部按钮
			selectedPKS:null,//保存选中行的主键
		}
        this.searchId = searchId;
		this.tableId = tableId;
    }
    componentDidMount() {        
    }
    initShow =()=>{
		if(!this.props.table.hasCacheData(this.props.dataSource)){
			this.onSelected();//缓存不存在，就控制按钮
		}
    }
    //列表控制按钮
	onSelected = () => {
		onListButtonControl(this);
	};
    componentWillMount(){
        let  callback= (json) =>{
            this.setState({json:json},()=>{
                initTemplate.call(this, this.props,this.initShow);
           })
       }
       getMultiLang({moduleId: [multiLangCode], currentLocale: 'simpchn',domainName:module,callback})
    }

    // 查询区渲染完成回调函数
	renderCompleteEvent = () => {
		let cachesearch = getDefData(searchId, this.props.dataSource);
		if (cachesearch && cachesearch.querycondition && cachesearch.querycondition.conditions) {
			for (let item of cachesearch.querycondition.conditions) {
				if (item.field == 'dmakedate') {
					// 时间类型特殊处理
					let time = [];
					time.push(item.value.firstvalue);
					time.push(item.value.secondvalue);
					this.props.search.setSearchValByField(searchId, item.field, {
						display: item.display,
						value: time
					});
				} else {
					this.props.search.setSearchValByField(searchId, item.field, {
						display: item.display,
						value: item.value.firstvalue
					});
				}
			}
		}
    };
    
    //切换面板事件
    clickPlanEve =()=>{
        defaultPeriod(this.props,this.searchId,this);
    }
    render() {
        const {table,button ,search,modal,title,  dataSource} = this.props;
        const { createButtonApp } = button;
        const { NCCreateSearch } = search;
        const { createSimpleTable } = table;
        const { createBillHeadInfo } = this.props.BillHeadInfo;
        return (
            <div className="nc-bill-list">
                <NCDiv areaCode={NCDiv.config.HEADER}>
                <div className="nc-bill-header-area" >
                    <div className="header-title-search-area">
                    
                        {createBillHeadInfo({
							title: title,
							initShowBackBtn: false
							})}
                    </div>
                    <div className="header-button-area">
                        {/* 按钮适配 第三步:在页面的 dom 结构中创建按钮组，传入显示的区域，绑定按钮事件*/}
                        {
                            createButtonApp({
                            area:searchId,
                            buttonLimit: 3,
                            onButtonClick: buttonClick.bind(this),
                            popContainer: document.querySelector('.header-button-area')
                        })}
                    </div>
                </div>
                </NCDiv>
                <div className="nc-bill-search-area" >
                    {
                        NCCreateSearch(searchId, {
                        clickSearchBtn: onClickSearchBtn.bind(this),
                        showAdvBtn: true,                           //  显示高级按钮
                        addAdvTabs: this.addAdvTabs,              // 添加高级查询区自定义页签 (fun), return Dom 
                        oid: oid,        //查询模板的oid，用于查询查询方案
                        clickPlanEve: this.clickPlanEve,
                        renderCompleteEvent: this.renderCompleteEvent, // 查询区渲染完成回调函数
                        onOperateTypeChange:operateTypeChange.bind(this,this,['cperiod'],searchId)//操作符切换事件
                    })}
                </div>
                {/* 列表区 */}
                <div className="nc-bill-table-area" >
                    {createSimpleTable(tableId, {
                        dataSource: dataSource,
                        pkname: pkname,
                        handlePageInfoChange: pageInfoClick.bind(this),
                        onRowDoubleClick: doubleClick.bind(this),
                        showCheck:true,
                        showIndex:true,
                        onSelected: this.onSelected.bind(this),
						onSelectedAll:this.onSelected.bind(this),	
						componentInitFinished:()=>{
							this.onSelected();
						}
                    })}
                </div>
            </div>
        )
    }
}
JobEditTable = createPage({})(JobEditTable);
export default JobEditTable;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65