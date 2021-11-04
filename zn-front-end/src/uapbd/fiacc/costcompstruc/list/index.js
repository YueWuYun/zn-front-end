//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage,high,base,toast,cardCache,getMultiLang,createPageIcon} from 'nc-lightapp-front';
import {buttonClick,initTemplate,doubleClick,pageInfoClick,onClickSearchBtn} from './events';
const {NCDiv } = base;
import {tableTypeObj,multiLangCode,searchId,tableId,oid,dataSource,pkname,pagecode,module,moduleName,exprotBillType,importPageId} from './constants';
const { BillTrack,ExcelImport} = high;
import {onListButtonControl} from '../../../public/excomponents/pubUtils/buttonVisible';
import defaultPeriod from '../../../public/excomponents/pubUtils/defaultPeriod.js';
import { operateTypeChange } from '../../../public/excomponents/pubUtils/operateTypeChange';
import CostCompoStrucDistriModal from '../costCompoStrucDistriModal/index';
import SubCf from '../subCF';
import CancelSubCf from '../cancelSubCf';
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
            isModalShow: false,//分配成本组件结构，false不加载模态框，true为加载
            transfershowModal:false, // 快速分配
            cancelDistributeShowModel:false // 快速取消分配
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
		if(!this.props.table.hasCacheData(dataSource)){
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
		let cachesearch = getDefData(searchId, dataSource);
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
    // 分配成本组件结构模态框
    isModalShow = () =>{
		this.setState({transfershowModal : !this.state.transfershowModal})
	}
  // 取消分配成本组件结构模态框
  cancelModalShow = () =>{
    this.setState({cancelDistributeShowModel : !this.state.cancelDistributeShowModel})
}


    render() {
        const {table,button ,search,modal} = this.props;
        const { createButtonApp } = button;
        const { NCCreateSearch } = search;
        const { createSimpleTable } = table;
        let { createModal } = modal;
        const { createBillHeadInfo } = this.props.BillHeadInfo;
        return (
            <div className="nc-bill-list">
                <NCDiv areaCode={NCDiv.config.HEADER}>
                <div className="nc-bill-header-area" >
                    <div className="header-title-search-area">
                    
                        {createBillHeadInfo({
							title: this.state.json['10140CCSC-000000'],//国际化处理： 消耗单
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
                <SubCf
					showFormModal={this.state.transfershowModal}
                    parent={this}
                    checkedData={this.props.table.getCheckedRows(tableId)}
               	/>
                <CancelSubCf
					cancelShowFormModal={this.state.cancelDistributeShowModel}
                    parent={this}
                    checkedData={this.props.table.getCheckedRows(tableId)}
               	/>
            </div>
        )
    }
}
JobEditTable = createPage({
    billinfo:{
        billtype: 'grid',
        pagecode:  pagecode,
        bodycode: tableId
    },
})(JobEditTable);
export {JobEditTable}


export default JobEditTable;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65