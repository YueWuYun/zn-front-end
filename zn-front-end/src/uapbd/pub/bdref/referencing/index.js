//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast } from 'nc-lightapp-front';
let { NCPopconfirm,NCModal } = base;

const searchid = '10140REFCO';
const tableid = 'referencing';
const pagecode = '10140REFCO_referencing';
const urls = {
    save : '/nccloud/uapbd/bdref/save.do',
    query : '/nccloud/uapbd/bdref/querybdrefdata.do'
};
let allTableData = {};


class Referencing extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.props.button.setButtonsVisible({
            listButton:true,
            relatedbillButton:true
        });
        this.state={
            curMeta:'',
            curPk:'',
            RefPk:'',
            json:{},
            inlt:null
        };
    }

    componentDidMount(){
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
                this.initTemplate.call(this, this.props, json, inlt)
            } else {
                console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
            }

        }
        this.props.MultiInit.getMultiLang({moduleId: '10140REFCO',domainName: 'uapbd',callback})
    }
    initTemplate (props,json,inlt) {
        //改为弹出框，注释以下内容
        /*let data={
            referencingTable:props.getUrlParam('referencingTable'),
            referencingColumn:props.getUrlParam('referencingColumn'),
            referencedTable:props.getUrlParam('referencedTable'),
            docPk:props.getUrlParam('docPk'),
            pagecode: pagecode		//pagecode,在生成的json模板获取
        }*/
        let data={
            referencingTable:props.config['referencingTable'],
            referencingColumn:props.config['referencingColumn'],
            referencedTable:props.config['referencedTable'],
            docPk:props.config['docPk'],
            pagecode: pagecode		//pagecode,在生成的json模板获取
        }
        ajax({
            url: urls['query'],
            data,
            success: function(res) {
                let meta = res.data.meta;
                meta[tableid].name=json["10140REFCO-000014"];
                props.meta.setMeta(meta);
                meta[tableid].areaVisible = true;
                allTableData = {rows:[]};
                if(res.data.data&&res.data.data[tableid]){
                    allTableData = res.data.data[tableid];
                }
                //props.editTable.setTableData(tableid, allTableData);
                props.table.setAllTableData(tableid, allTableData);

            }
        });
    }


    //更新按钮状态
    updateButtonStatus(){
        //此处控制按钮的隐藏显示及启用状态
        let tableData = this.props.table.getCheckedRows(tableid);
        let length = tableData.length;//获取列表页选择数据的行数
        this.props.button.setButtonsVisible({
            listButton:true,
            relatedbillButton:true
        });
    }

    //按钮点击事件
    onButtonClick(id) {
        switch (id) {
            case 'list':
                this.props.linkTo('referenced/index.html', {
                    status: 'ing',
                    data:props.getUrlParam('data')
                });
                break;
            case "relatedbill":
                break;
        }
    }

    render() {
        let { cardTable,table, button, search,editTable,modal } = this.props;
        let { createEditTable } = editTable;
        let { createSimpleTable } = table;
        let { NCCreateSearch } = search;
        let { createButton } = button;
        let {NCFormControl,NCCheckbox} = base;
        let {createModal} = modal;
        let {createCardTable} = cardTable;

        return (

            <div className="nc-single-table">
                {/* 头部 header */}
                {/*改为弹出框组件，注释此段内容*/}
                {/*<div className="nc-singleTable-header-area">
                     标题 title
                    <div className="header-title-search-area">
                        <h2 className="title-search-detail">引用数据</h2>
                    </div>

                     按钮区  btn-group
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'list-actions',
                            buttonLimit: 6,
                            onButtonClick: this.onButtonClick.bind(this),
                            popContainer: document.querySelector('.header-button-area')

                        })}
                        {createButton('list', {name: '列表',onButtonClick: this.onButtonClick.bind(this, 'list'),buttonColor:'secondary-button'})}	 绑定修改事件
                        {createButton('relatedbillButton', {name: '联查单据',onButtonClick: this.onButtonClick.bind(this, 'relatedbill'),buttonColor:'secondary-button'})}	 绑定修改事件
                    </div>
                </div>*/}
                <div className='nc-singleTable-table-area'>
                    {createSimpleTable(tableid, {//列表区
                        useFixedHeader:true,
                        selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
                        showIndex:false,				//显示序号
                        showCheck:false			//显示复选框

                    })}
                </div>
            </div>

        );
    }
}

Referencing = createPage({
    initTemplate: ()=>{}
})(Referencing);

export default Referencing;
//ReactDOM.render(<Referencing />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65