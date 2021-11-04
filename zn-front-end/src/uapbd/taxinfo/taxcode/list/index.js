//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {createPage, ajax, base, toast, print, high, promptBox, cardCache,createPageIcon} from 'nc-lightapp-front';
import './index.less';
import Utils from '../../../public/utils';
import Util from '../util.js';
import CountryExDefaultGridRef from '../../../../uapbd/refer/pubinfo/CountryExDefaultGridRef/index';
import createUIDom from '../../../public/utils/BDCreateUIDom';
const { NCDiv } = base;
const { getDefData, setDefData } = cardCache;
const { PrintOutput } = high;
const dataSource = 'uapbd.taxinfo.taxcode.dataSource';
const searchId = 'taxcodesearch';
const tableId = 'taxcode';
const pagecode = '10140VATCR_taxcode_list';//页面id
const childpagecode = '10140VATCR_taxcode_card';//卡片页面id
const appcode = '10140VATCR';//注册按钮的id
const pk_value = "pk_taxcode"; //页面数据主键
const formId = 'editTaxRate';//调整税率formid

let urls={
    queryListUrl:"/nccloud/uapbd/taxcode/TaxcodeQueryAction.do",
    delTaxsUrl:"/nccloud/uapbd/taxcode/TaxcodeDeleteAction.do",
    SaveTaxrateUrl:"/nccloud/uapbd/taxcode/TaxcodeTaxrateSaveAction.do",
    enableTaxUrl:"/nccloud/uapbd/taxcode/TaxcodeEnableAction.do",
    disableTaxUrl:"/nccloud/uapbd/taxcode/TaxcodeDisableNccAction.do",
    editTaxrateUrl:"/nccloud/uapbd/taxcode/TaxrateEditAction.do",
    print: "/nccloud/uapbd/taxcode/TaxcodeListPrintAction.do"
};

class TaxcodeList extends Component {
	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;

        let selCountryId = getDefData("selCountry_10140VATCR", dataSource);
        let isShowOff = getDefData("isShowOff_10140VATCR",dataSource);

        createUIDom(props)(
			{ pagecode: pagecode},  //页面id 
			{ moduleId: appcode,domainName: 'uapbd' },
            (data,langData,inlt) => {
				//多语
				if(langData){
					this.state.json = langData;
					if(inlt){
						this.state.inlt = inlt;
					}					
				}
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        meta = this.modifierMeta(props, meta);
                        props.meta.setMeta(meta);
                        
                        data.button && props.button.setButtons(data.button);
                        props.button.setPopContent({'Delete':this.state.json['10140VATCR-000017']});/* 国际化处理： 确认删除？*/
                        this.initButtonStates();
                        
                        if(selCountryId && selCountryId['refpk']){
                            let searchVal = getDefData("searchParams_10140VATCR",dataSource);
                            if(searchVal){
                                this.props.search.setSearchValue(searchId,searchVal.conditions);
                            }
                        }
                        
                        if(selCountryId){
                            this.getData(this.props);
                        }
                    }
                }
            }
        );

        this.state={
            showOffDisable: false,			                    //显示停用复选框是否禁用	true：禁用		false：可用
            isShowOff: isShowOff?isShowOff:false,				//列表是否显示停用数据
            selCountryId : selCountryId?selCountryId:''         //国家地区
            ,ry : ''
            ,index: -1                      //当前选中行
            ,pks: []                        //打印pks
            ,json : {}                      //多语json
			,inlt : null
        }
    }
    
    modifierMeta(props, meta) {
        meta[searchId].items = meta[searchId].items.map((item, key) => {
            if (item.attrcode == 'pk_group') {
                item.isShowDisabledData = true;
            }
            return item;
        });
        meta[tableId].items = meta[tableId].items.map((item, key) => {
            //item.width = 150;
            if (item.attrcode == 'code') {
                item.render = (text, record, index) => {
                    return (
                        <a
                            style={{color: '#007ace', cursor: 'pointer' }}
                            onClick={() => {
                                props.pushTo('/card', {
                                    pagecode:               childpagecode,
                                    appcode: appcode,
                                    status: 'browse',
                                    id: record[pk_value].value
                                });
                            }}
                        >
                            {record?(record.code && record.code.value):null}
                        </a>
                    );
                };
            }else if(item.attrcode==='enablestate'){
                item.itemtype = "input";
            }
            return item;
        });
    
        //添加操作列
        meta[tableId].items.push({
            attrcode: 'opr',
            itemtype:'customer',
            label: this.state.json['10140VATCR-000018'],/* 国际化处理： 操作*/
            width: 200,
            className : 'table-opr',
            fixed: 'right',
            visible: true,
            render: (text, record, index) => {
                let btnArray = ["Delete","Edit","EditTaxRate"];
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "line-area",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => {this.oprButtonClick(props, id, text, record, index)}
                    }
                )
            }
        });
    
        return meta;
    }

    /**
     * 行操作
     * @param {*} props 
     * @param {*} id 
     * @param {*} text 
     * @param {*} record 
     * @param {*} index 
     */
    oprButtonClick(props, id, text, record, index){

        switch (id) {
            // 表格操作按钮
            case 'Edit':
                props.pushTo('/card', {
                    status: 'edit',
                    pagecode: childpagecode,
                    appcode: appcode,
                    id: record[pk_value].value
                })
                break;
            case 'Delete':
                    ajax({
                        url: urls['delTaxsUrl'],
                        data:{
                            id: record[pk_value].value,
                            ts: record.ts.value
                        },
                        success:(res)=>{
                            if(res.success){
                                props.table.deleteTableRowsByIndex(tableId, index);
                                toast({ color: 'success', title: this.state.json['10140VATCR-000014'] });/* 国际化处理： 删除成功！*/
                            }
                        }
                    });
                break;
            case 'EditTaxRate':
                props.modal.show('editTaxrate');
                ajax({
                    url: urls['editTaxrateUrl'],
                    data: {pk_taxcode: record[pk_value].value,iscardOrlist: 'Y'},
                    success: (result) => {
                        if(result.success){
    
                            props.form.EmptyAllFormValue(formId);
                            //设置表单为所选树节点数据
                            let formdata = {};
                            formdata[formId] = result.data['form'][formId];
                            props.form.setAllFormValue(formdata);
    
                            props.form.setFormStatus(formId,'edit');
                            /**
                             * <p>
                             * 如果老终止日期是9999年遵循以下规则：<br>
                             * 如果起始日期在今年之前，新起始日期设上明年，如果起始日期在今年之后，设上起始日期后一年
                             * </p>
                             * 如果老终止日期不是9999，新起始日期设上老终止日期后一年。
                             * <p>
                             * 比如今年是2012年：
                             * </p>
                             * <table border="1px" style="text-align:center">
                             * <tr>
                             * <td>老日期</td>
                             * <td>默认新日期</td>
                             * </tr>
                             * <tr>
                             * <td>2011-9999</td>
                             * <td>2013-9999</td>
                             * </tr>
                             * <tr>
                             * <td>2013-9999</td>
                             * <td>2014-9999</td>
                             * </tr>
                             * <tr>
                             * <td>2013-2015</td>
                             * <td>2016-9999</td>
                             * </tr>
                             * </table>
                             */
                            let newbegindate;
                            let fdata = formdata[formId]['rows'][0];
                            if (fdata.values.enddate.value.substr(0,4) === '9999' || fdata.values.enddate.value === "9999-12-31" ) {
                                if ( parseInt(fdata.values.begindate.value.substr(0,4)) > new Date().getFullYear()) {
                                    newbegindate = (parseInt(fdata.values.begindate.value.substr(0,4))+1) + "-01-01";
                                }else{
                                    newbegindate = (new Date().getFullYear()+1) + "-01-01";
                                }
                            } else {
                                newbegindate = (parseInt(fdata.values.begindate.value.substr(0,4)) +1)+ "-01-01";
                            }
                            let dataParam = {
                                'oldtaxtype': fdata.values.taxtype,
                                'oldtaxrate': fdata.values.taxrate,
                                'oldrealtaxrate': fdata.values.realtaxrate,
                                'oldbegindate': fdata.values.begindate,
                                'oldenddate': fdata.values.enddate,
                                'begindate': {value: newbegindate},
                                'enddate': {value: "9999-12-31"},
                                'taxrate': {value: ''},
                                'realtaxrate': {value: ''},
                                'note': {value: ''}
                            };
                            props.form.setFormItemsValue(formId,dataParam);
                        }
                    }
                });
                break;
            default:
                break;
        }
    }

	componentDidMount() {
        //
    }

    componentDidUpdate(){
        let l_formstatus = this.props.form.getFormStatus(formId);
        if(l_formstatus && l_formstatus==="edit"){
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }else{
            window.onbeforeunload = null;
        }
    }
    
    initButtonStates(){
        this.props.button.setButtonDisabled(['Enable','Enable1','Disable','Print','Output'],true);
    }

    //按钮事件
    onButtonClick(props, id) {
        let index = this.state.index;
        let dat = props.table.getAllTableData(tableId);
        let paramData = {};
        switch (id) {
            case 'Add':
                if(!this.state.selCountryId || !this.state.selCountryId['refpk']){
                    toast({ color: 'warning', content: this.state.json['10140VATCR-000019'] });/* 国际化处理： 请选择报税国家*/
                }else{
                    props.pushTo('/card', {
                        status:'add',
                        appcode: appcode,
                        pagecode: childpagecode,
                        id: 'add111'
                    })
                }
                break;
            case 'Refresh':
                this.getData(props, ()=>{
                    toast({ color: 'success', title: this.state.json['10140VATCR-000006'] });/* 国际化处理： 刷新成功！*/
                });
                break;
            case 'Enable':
                paramData = {
                    id: dat['rows'][index]['values'][pk_value]['value'],
                    ts: dat['rows'][index]['values']['ts']['value']
                };
                promptBox({
					color: 'info',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140VATCR-000007'],/* 国际化处理： 确认启用*/
                    content: this.state.json['10140VATCR-000008'],/* 国际化处理： 是否确定要启用？*/
                    beSureBtnClick: ()=>{
                        ajax({
                            url: urls['enableTaxUrl'],
                            data: paramData,
                            success:(res)=>{
                                if(res.success){
                                    toast({ color: 'success', title: this.state.json['10140VATCR-000009'] });/* 国际化处理： 启用成功！*/
                                    this.getData();
                                }
                            }
                        });
                    }
				});
                break;
            case 'Disable':
                paramData = {
                    id: dat['rows'][index]['values'][pk_value]['value'],
                    ts: dat['rows'][index]['values']['ts']['value']
                };
                promptBox({
					color: 'info',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140VATCR-000010'],/* 国际化处理： 确认停用*/
                    content: this.state.json['10140VATCR-000011'],/* 国际化处理： 是否确定要停用？*/
                    beSureBtnClick: ()=>{
                        ajax({
                            url: urls['disableTaxUrl'],
                            data: paramData,
                            success:(res)=>{
                                if(res.success){
                                    toast({ color: 'success', title: this.state.json['10140VATCR-000012'] });/* 国际化处理： 停用成功！*/
                                    this.getData();
                                }
                            }
                        });
                    }
				});
                break;
            case 'Print':
				let printParam={
                    funcode : appcode,
                    nodekey: 'taxcodelist'
				};
				this.pintFunction(printParam);
                break;
			case 'Output':
                let allData=this.props.table.getAllTableData(tableId);
                let pks=[];
                allData.rows.forEach((item)=>{
                    pks.push(item.values['pk_taxcode'].value);
                });
                this.setState({
                    pks:pks
                },() => {
                    this.refs.printOutput.open();
                });
				break;
            default:
                break;
        }
    }

    //输出和打印功能函数
	pintFunction(param){
		let allData=this.props.table.getAllTableData(tableId);
		let pks=[];
		allData.rows.forEach((item)=>{
			pks.push(item.values['pk_taxcode'].value);
		});
		param.oids=pks;
		print(
			'pdf',
			urls['print'],
			param
		);
	}

	//列表双击事件
    doubleClick(record, index, e) {
        let searchVal = this.props.search.getAllSearchData(searchId);
        setDefData("searchParams_10140VATCR", dataSource, searchVal);
        this.props.pushTo('/card', {
            status: 'browse',
            //appcode: appcode,
            pagecode: childpagecode,
            id: record[pk_value].value
        });
    }

    //显示停用数据
    showOffChange =()=>{
        this.setState({
            isShowOff : !this.state.isShowOff
        },() => {
            setDefData("isShowOff_10140VATCR", dataSource, this.state.isShowOff);
            this.getData(this.props);
        });
    }

	//查询区按钮点击事件
    clickSearchBtn(props,searchVal) {
        let searchVa = this.props.search.getAllSearchData(searchId);
        setDefData("searchParams_10140VATCR", dataSource, searchVa);
        this.getData(props, (length) => {
            if(length && length>0){
                toast({ color: 'success', content: this.state.inlt&&this.state.inlt.get('10140VATCR-000020', {count: length})});/* 国际化处理： 查询成功，共+length+条。*/
            }else{
                toast({ color: 'warning', content: this.state.json['10140VATCR-000021'] });/* 国际化处理： 未查询出符合条件的数据！*/
            }
        }, true);
    };

    //国家发生变化事件
    onCountryChange(value){
        this.setState({
            selCountryId : value
        },() => {
            setDefData("selCountry_10140VATCR", dataSource, value);
            (value && value['refpk']) && this.getData(this.props);
        });
    }

	//查询列表数据
	getData = (props, callback, isQuery) => {

        if(!this.state.selCountryId || !this.state.selCountryId['refpk']){
            toast({ color: 'warning', content: this.state.json['10140VATCR-000019'] });/* 国际化处理： 请选择报税国家*/
            return;
        }

        let searchVal = getDefData("searchParams_10140VATCR", dataSource);
        let showOff = this.state.isShowOff;
        let queryInfo = this.props.search.getQueryInfo(searchId, isQuery?true:false);
        let data={
            showDisableDataFlag : showOff,
            querycondition : searchVal==null?null:searchVal,
            pagecode : pagecode,
            queryAreaCode : searchId,  //查询区编码
            oid : queryInfo.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype : 'tree',
            selCountryId : this.state.selCountryId.refpk 
        };

        ajax({
            url: urls.queryListUrl,
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    //处理显示公式
                    if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                        this.props.dealFormulamsg(
                            res.formulamsg,
                            {
                                [tableId] : "editTable"
                            }
                        );
                    }
                    let length = 0;
                    if(data){
                        if(data['warning']){
                            toast({ color: 'warning', content: data['warning'] });
                            return;
                        }

                        let dat = Util.setTab_hForTab_b(data['grid'][this.tableId],'taxrate',
                            [ ['taxtype','taxtype',[{"display": this.state.json['10140VATCR-000000'],"value": "0"},{"display": this.state.json['10140VATCR-000001'],"value": "1"}]],/* 国际化处理： 应税内含,应税外加*/
                              ['taxrate_b','taxrate'],['realtaxrate','realtaxrate'],['begindate','begindate'],['enddate','enddate']]);
                        this.props.table.setAllTableData(tableId, dat);
                        this.setState(
                            {index: 0},
                            () => {
                                this.props.table.focusRowByIndex(this.tableId, 0);
                                let enablestate = dat.rows[0]['values']['enablestate']['value'];
                                if(enablestate === '2'){
                                    this.props.button.setButtonDisabled(['Enable','Enable1'],true);
                                    this.props.button.setButtonDisabled('Disable',false);
                                }else{
                                    this.props.button.setButtonDisabled(['Enable','Enable1'],false);
                                    this.props.button.setButtonDisabled('Disable',true);
                                }
                            }
                        );
                        this.props.button.setButtonDisabled(['Print','Output'],false);
                        length = dat.rows.length;
                    }else{
                        this.props.button.setButtonDisabled(['Print','Output','Enable','Disable'],true);
                        this.props.table.setAllTableData(this.tableId, {rows:[]});
                        this.setState({index: -1});
                    }
                    callback && callback(length);
                }
            }
        });
	}

    //调整税率卡片界面编辑后事件
    onAfterFormEvent = () => {}

    //在state中附上选中值
    onRowClick = (props, moduleId, record, index) => {
        this.setState(
            {index: index},
            () => {
                if(record.enablestate['value'] === '2'){
                    this.props.button.setButtonDisabled(['Enable','Enable1'],true);
                    this.props.button.setButtonDisabled('Disable',false);
                }else{
                    this.props.button.setButtonDisabled(['Enable','Enable1'],false);
                    this.props.button.setButtonDisabled('Disable',true);
                }
            }
        );
    }

	render() {
        let { button, search, modal, form, table,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
		let buttons = this.props.button.getButtons();
		let { NCCreateSearch } = search;
        let {NCCheckbox} = base;
        let { createButtonApp, getButtons } = button;
        let { createModal } = modal;  //模态框
        const {createForm} = form;//创建表单，需要引入这个

        let { createSimpleTable } = table;

		return (
			<div className="nc-bill-list cn_10140VATCR">
				<NCDiv  areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area" >
                        {createBillHeadInfo({
                                title:( this.state.json['10140VATCR-000015']),
                                initShowBackBtn:false
							}
						)}
						<div className="search-box" style={{position:'relative'}}>
                            {(this.state.selCountryId && this.state.selCountryId.refpk)
							    ? '' : <span style={{color: 'red',position:'absolute',left: 3,top: 8,zIndex: 1}}>*</span>}
							{CountryExDefaultGridRef({
                                fieldid:'countryex',
                                refName: this.state.json['10140VATCR-000022'],/* 国际化处理： 国家地区*/
                                placeholder: this.state.json['10140VATCR-000023'],/* 国际化处理： 国家*/
								onChange:this.onCountryChange.bind(this),
								value:this.state.selCountryId
							})}
						</div>
                        <span className="showOff">
                            <NCCheckbox
                                checked={this.state.isShowOff}
                                onChange={this.showOffChange.bind(this)}
                                disabled={this.state.showOffDisable}
                            >
                                {this.state.json['10140VATCR-000024'] /* 国际化处理： 显示停用*/}
                            </NCCheckbox>
                        </span>
					</div>
					<div className="header-button-area">
                        {createButtonApp({
                            area: 'list-area',
                            buttonLimit: 3,
                            onButtonClick: this.onButtonClick.bind(this),
                            popContainer: document.querySelector('.list-area')

                        })}
					</div>
				</NCDiv>
				<div className="nc-bill-search-area" fieldid='nc-bill-searchid'>
					{NCCreateSearch(this.searchId, {
                        clickSearchBtn: this.clickSearchBtn.bind(this),
                        defaultConditionsNum:3     //默认显示查询添加个数，如果不传该参数则全部显示 
					})}
				</div>
				<div className="nc-bill-table-area" fieldid='nc-bill-tableId'> 
                    {createSimpleTable(this.tableId, {
                        dataSource: dataSource,
                        pkname: 'pk_taxcode',
                        onRowClick:this.onRowClick.bind(this),
                        showIndex: true,
                        onRowDoubleClick: this.doubleClick.bind(this)
                    })}
				</div>

                {createModal('model',{})}
                {createModal('editTaxrate',{
                    title: this.state.json['10140VATCR-000016'],/* 国际化处理： 调整税率*/
                    userControl: true,
                    content: 
                    <div>
                        {createForm(formId, {
                            //onAfterEvent: this.onAfterFormEvent.bind(this)
                        })}
                    </div>,
                    beSureBtnClick: () => {
                        let formData = this.props.form.getAllFormValue(formId);
                        let requestParam = {
                            model: formData,
                            pageid: '10140VATCR_taxcode_list' //pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                        };
                        //ajax请求
                        ajax({
                            url: urls['SaveTaxrateUrl'],
                            data: requestParam,
                            success: (result) => {
                                if(result.success){
                                    toast({title:this.state.json['10140VATCR-000013'], color: 'success'});/* 国际化处理： 保存成功！*/
                                    this.props.modal.close('editTaxrate');
                                    //保存后刷新界面
                                    this.getData();
                                }
                            }
                        });
                    },
                    cancelBtnClick: () => {
                        this.props.form.setFormStatus(formId,'browse');
                        this.props.modal.close('editTaxrate');
                    } //取消按钮事件回调
                    //,closeModalEve: this.closeModalEve //关闭按钮事件回调    
                })}
                <PrintOutput
                    ref='printOutput'
                    url= {urls['print']}
                    data={{
                        funcode : appcode,
                        nodekey :'taxcodelist',  //模板节点标识
                        oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        outputType: "output"
                    }}
                    //callback={this.onSubmit}
                >
                </PrintOutput>
			</div>
		);
	}
}

TaxcodeList = createPage({})(TaxcodeList);
export default TaxcodeList;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65