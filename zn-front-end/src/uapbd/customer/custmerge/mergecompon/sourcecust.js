//aR62tz4PtEOGt5ufiTZh+/BfvIXdH42q5SrAnUwperrsipALoEJivz7/MVMwMHUI
//主子表卡片
import React, { Component } from 'react';
import { createPage, ajax, base, toast ,high} from 'nc-lightapp-front';
import createUIDom from "../../../public/utils/BDCreateUIDom";
import utils from '../../../public/utils';
const {showFormular } = utils;
let { NCAffix  } = base;

const formId = 'customer';
const tableId1 = 'custbanks';
const tableId2 = 'custcontacts';
const tableId3 = 'custtaxtypes';
const pageId = '1317CUUG_base';//页面id
const appcode = '1317CUUG';//注册按钮的id

class Sourcecust extends Component {
    constructor(props) {
        super(props);
        this.formId = formId;
        this.moduleId = '3630';
        this.tableId1 = tableId1;
        this.tableId2 = tableId2;
        this.tableId3 = tableId3;
        this.pageId = pageId;
        this.appcode = appcode;
        this.config =Object.assign({
            pk_custmerge:null,
        },props.config);
        this.state={
            json:{}
        }
        this.initTemplate(this.props, () => {
            this.getData();
        });
    }

    initTemplate = (props,callback) =>{
        createUIDom(props)(
            {
                pagecode: pageId,
                appcode:appcode
            },
            {
                moduleId: "1317CUME",domainName: 'uapbd'
            },
            (data,langData)=>{
                if(langData){
                    this.state.json = langData
                }
                if(data){
                    if(data.template){
                        let meta = data.template;
                        this.modifierMeta(props, meta)
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                    }
                    callback && callback();
                }
            }
        )
    }

    modifierMeta = (props, meta)=> {
        let status = 'browse';
        meta[formId].status = status;
        meta[tableId1].status = status;
        meta[tableId2].status = status;
        meta[tableId3].status = status;

        let multiLang = props.MutiInit.getIntl('3630');
        let porCol = {
            attrcode: 'opr',
            // label: multiLang && multiLang.get('36300TP-0005'),
            label: this.state.json['1317CUME-000036'],/* 国际化处理： 操作*/
            fixed: 'right',
            itemtype: 'customer',
            visible: true,
            width:'200px',
            render(text, record, index) {
                let status = props.cardTable.getStatus(tableId1);
                let btnArray = status === 'browse' ?["detail"]:["spread"]
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table-opr-area",
                        buttonLimit: 3,
                        onButtonClick: (props, id ) => this.tableButtonClick(props, id,tableId1, text, record, index)
                    }
                )
            }
        };
        meta[tableId1].items.push(porCol);

        let porCol2 = {
            attrcode: 'opr',
            // label: multiLang && multiLang.get('36300TP-0005'),
            label: this.state.json['1317CUME-000036'],/* 国际化处理： 操作*/
            fixed: 'right',
            itemtype: 'customer',
            visible: true,
            width:'200px',
            render(text, record, index) {
                let status = props.cardTable.getStatus(tableId2);
                let btnArray = status === 'browse' ?["detail"]:["spread"]
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table-opr-area",
                        buttonLimit: 3,
                        onButtonClick: (props, id ) => this.tableButtonClick(props, id,tableId1, text, record, index)
                    }
                )
            }
        };
        meta[tableId2].items.push(porCol2);

        let porCol3 = {
            attrcode: 'opr',
            // label: multiLang && multiLang.get('36300TP-0005'),
            label: this.state.json['1317CUME-000036'],/* 国际化处理： 操作*/
            fixed: 'right',
            itemtype: 'customer',
            visible: true,
            width:'200px',
            render(text, record, index) {
                let status = props.cardTable.getStatus(tableId3);
                let btnArray = status === 'browse' ?["detail"]:["spread"]
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table-opr-area",
                        buttonLimit: 3,
                        onButtonClick: (props, id ) => this.tableButtonClick(props, id,tableId1, text, record, index)
                    }
                )
            }
        };
        meta[tableId3].items.push(porCol3);

        return meta;
    }

    tableButtonClick = (props, id, tableId,text, record, index)=>{

        switch(id){
            case "detail"://更多
                props.cardTable.toggleRowView(tableId, record);
                break;
            case "spread"://展开
                props.cardTable.openModel(tableId, 'edit', record, index);
                break;
            default:
                break;
        }
    }

    componentDidMount() {

    }

    //查询数据
    getData =() =>{
        debugger
        if(this.config.pk_custmerge != null){
            let data = { pk: this.config.pk_custmerge, pageid: this.pageId ,templetid:this.props.meta.getMeta().pageid};
            let that = this;
            ajax({
                url: '/nccloud/uapbd/custmerge/querysourcecustomer.do',
                data: data,
                success: (res) => {
                    showFormular(this.props,res,{
                        [formId] : "form",
                        [tableId1]:"cardTable",
                        [tableId2]:"cardTable",
                        [tableId3]:"cardTable"
                    });
                    if (res.data) {
                        if (res.data.head) {
                            this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        }
                        if (res.data.bodys) {
                            this.props.cardTable.setTableData(that.tableId1, res.data.bodys[that.tableId1]);
                            this.props.cardTable.setTableData(that.tableId2, res.data.bodys[that.tableId2]);
                            this.props.cardTable.setTableData(that.tableId3, res.data.bodys[that.tableId3]);
                        }
                    } else {
                        this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                        this.props.cardTable.setTableData(this.tableId1, { rows: [] });
                        this.props.cardTable.setTableData(this.tableId2, { rows: [] });
                        this.props.cardTable.setTableData(this.tableId3, { rows: [] });
                    }
                }
            });
        }
    }

    // 获取列表肩部信息
    getTableHead = (buttons, tableId) => {
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {this.props.cardTable.createBrowseIcons(tableId, {
                        iconArr: ['close', 'open', 'max'],
                        maxDestAreaId: 'finance-fts-commissionpayment-card'
                    })}
                </div>
            </div>
        );
    };

    render() {
        let { cardTable, form } = this.props;
        let { createForm } = form;
        let buttons = this.props.button.getButtons();
        let { createCardTable } = cardTable;

        return (
            <div className="nc-bill-extCard">
                <div className="nc-bill-top-area">
                    <NCAffix>
                        <div className="nc-bill-header-area">
                        </div>
                    </NCAffix>
                    <div className="nc-bill-form-area">
                        {createForm(this.formId, {
                        })}
                    </div>
                </div>
                <div className="nc-bill-bottom-area">
                    <div className="nc-bill-table-area">
                        {createCardTable(this.tableId1, {
                            tableHead: this.getTableHead.bind(this, buttons, this.tableId1),
                            modelSave: this.saveBill,
                            showIndex: true
                        })}
                    </div>

                    <div className="nc-bill-table-area">
                        {createCardTable(this.tableId2, {
                            tableHead: this.getTableHead.bind(this, buttons, this.tableId2),
                            modelSave: this.saveBill,
                            showIndex: true
                        })}
                    </div>

                    <div className="nc-bill-table-area">
                        {createCardTable(this.tableId3, {
                            tableHead: this.getTableHead.bind(this, buttons, this.tableId3),
                            modelSave: this.saveBill,
                            showIndex: true
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default Sourcecust = createPage({
    billinfo:{
        billtype: 'extcard',
        pagecode: "1317CUUG_base",
        headcode: 'customer',
        bodycode: ['custbanks','custcontacts','custtaxtypes']
    }
})(Sourcecust);



//aR62tz4PtEOGt5ufiTZh+/BfvIXdH42q5SrAnUwperrsipALoEJivz7/MVMwMHUI