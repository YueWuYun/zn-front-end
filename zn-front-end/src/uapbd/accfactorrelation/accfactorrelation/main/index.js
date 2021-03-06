//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, toast, createButtonApp, cardTable, print, high, promptBox, createPageIcon, cardCache} from 'nc-lightapp-front';
import loadPlatData from "../util/loadPlatData";
let { setDefData, getDefData, updateCache } = cardCache;
const { PrintOutput }= high;
const {NCDiv,NCAffix} = base;

const urls = {
    accfactorQuery: "/nccloud/uapbd/accfactor/accfactorQuery.do",
    accfactorCardQuery: "/nccloud/uapbd/accfactor/accfactorCardQuery.do",
    accfactorSave: "/nccloud/uapbd/accfactor/accfactorSave.do",
    accfactorPrint: "/nccloud/uapbd/accfactor/accfactorPrint.do"
}

const cardprintBtn = ['print_card','temp_card','output_card'];
const EDIT = 'edit';
const BROWSE = 'browse';
const dataSource = 'uapbd.accfactorrelation.accfactorrelation.dataSource';


let EMPTY_FN = function(){};

class AccfactorRelation extends Component {
    constructor(props){
        super(props);
        loadPlatData({
            props: props,
            pageCode: '10140AFR_main',
            moduleId: '10140AFR',
            domainName: 'uapbd',
            callback: (meta) => {
                let {context, template, lang, button} = meta;
                this.lang = lang;
                this.initMeta(meta);
                this.initState(meta);
                this.setState(this.state, ()=>{
                    props.button.setButtons(button, ()=>{
                        this.buttonStatus();
                        props.meta.setMeta(template, ()=>{
                            //this.loadListData();
                        });
                    })
                })
            }
        });
    }

    initMeta(meta = {}){
        meta.template.table_list.items.push({
            label: this.lang['10140AFR-000006'],
            itemtype: 'customer',
            attrcode: 'opr',
            width: '200px',
            className: 'table-opr',
            visible: true,
            fixed: 'right',
            render: (text, record, index) => {
                let buttonAry = [ 'relation' ];
                return this.props.button.createOprationButton(buttonAry, {
                    area: "btn_opr",
                    buttonLimit: 3,
                    onButtonClick: (props, key) => this.onButtonClick(props, key, text, record, index)
                });
            }
        });
    }

    initState = (meta)=>{
        let {context, template, lang} = meta;
        this.state = {
            showCard: false,
            pagesate: 'browse',
            pk_relation: '',
            pk_factorchart: '',
            pk_accountingbook: '',
            listTable:{
                id: 'table_list',
                showCheck:true,
                showIndex:true,
                pkname:'pk_relation',
                dataSource: dataSource,
                onRowDoubleClick: this.onRowDoubleClick.bind(this)
            },
            listSearch:{
                id: 'search_list',
                clickSearchBtn: this.onClickSearchBtn.bind(this)
            },
            cardForm:{
                id: 'form_card',
            },
            cardTables:{
                id: 'table_card',
                tableHead: this.getCardTableHead.bind(this),
                showCheck:true,
                showIndex:true,
            },
            printOutData: {
                funcode:'10140AFR',      //???????????????
                nodekey:'List_10140AFR',    //??????????????????
                oids:[]
            }
        }
    }

    loadListData = (callback = EMPTY_FN)=>{
        //?????????????????????
        let searchData = this.props.search.getAllSearchData(this.state.listSearch.id);
        if(!searchData) return;
        //?????????meta????????????????????????id?????????meta??????oid????????????
        let queryInfo = this.props.search.getQueryInfo(this.state.listSearch.id);
        let oid = queryInfo.oid;
        let paramData = {
            querycondition: searchData,
            pageCode: '10140AFR_main',
            queryAreaCode: this.state.listSearch.id,
            oid: oid,
            querytype: 'tree',
        }
        ajax({
            url: urls.accfactorQuery,
            data: paramData,
            success: (res)  => {
                let { success, data } = res;
                if (success) {
                    if(data){
                        setDefData(this.state.listTable.id, dataSource, data);
                        this.props.table.setAllTableData(this.state.listTable.id, data[this.state.listTable.id], true);                     
                        toast({color:"success",content:"?????????"+data[this.state.listTable.id].rows.length+"?????????"});
                    }else{
                        this.props.table.setAllTableData(this.state.listTable.id, { rows: [] }, false);
                        toast({ color: 'warning', content: this.lang['10140AFR-000001'] });/* ?????????????????? ????????????0*/
                        return;
                    }
                    this.setState(this.state, callback);
                }
            }
        })
    }

    /**
     * ????????????????????????
     */
    onClickSearchBtn(props, val){
        this.loadListData(()=>{
            //toast({ color: 'success', content: this.lang['10140AFR-000002'] });/* ?????????????????? ????????????*/
        });
    }

    /**
     * ????????????
     * @param {} id 
     */
    onRowDoubleClick(record){
        this.state.showCard = true;
        this.state.pk_relation = record.pk_relation.value;
        this.state.pk_factorchart = record.pk_factorchart.value;
        this.state.pk_accountingbook = record.pk_book.value;
        // ??????????????????setState?????????????????????drawCard????????????????????????render?????????this.props.form????????????
        this.setState(this.state, this.loadCardData(record.pk_relation.value, this.buttonStatus()));
    }

    /**
     * ????????????????????????
     */
    filterBodyRef = ()=>{
        let meta = this.props.meta.getMeta();
        for (var item of meta[this.state.cardTables.id].items) {
            // ????????????
            if(item.attrcode === 'pk_accasoa'){
                item.queryCondition=()=>{
                    return {
                        pk_accountingbook: this.state.pk_accountingbook
                    };
                };
            }
            // ????????????
            if(item.attrcode === 'pk_factorasoa'){
                item.queryCondition=()=>{
                    return {
                        pk_factorchart: this.state.pk_factorchart
                    };
                };
            }
        }
    }

    /**
     * ????????????
     * @param {*} id 
     */
    loadCardData = (pk_relation, callback = EMPTY_FN)=>{
        let param = {
            pk_relation: pk_relation?pk_relation:this.state.pk_relation
        }
        ajax({
            loading: true,
            url: urls.accfactorCardQuery,
            data: param,
            success: (res)  => {
                let { success, data } = res;
                if (success) {
                    if(data && data.head){
                        let formData = data.head[this.state.cardForm.id];
                        this.props.form.setAllFormValue({[this.state.cardForm.id]: formData});
                        let idObj = { id: pk_relation, status: 1 }//status??????1
                        
                        console.log('pbj::', idObj)
                        this.props.cardPagination.setCardPaginationId(idObj);
                        if(data.body){
                            this.props.cardTable.setTableData(this.state.cardTables.id, data.body[this.state.cardTables.id]);
                            this.props.cardTable.setStatus(this.state.cardTables.id, this.state.pagesate);
                        }
                    }
                    this.setState(this.state, callback);
                    this.filterBodyRef();
                }
            }
        })
    }

    //??????????????????
    cardpagecharge(props, pks, that) {
        this.loadCardData(pks);
    }

    /**
     * ????????????????????????????????????
     * @param id
     */
    buttonStatus = (id)=>{
        let meta = this.props.meta.getMeta();
        if(this.state.showCard){
            if(this.state.pagesate === BROWSE){
                // ????????????
                this.props.button.setButtonVisible(['edit_card','print_card','refresh_card'], true);
                this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
                this.props.button.setButtonVisible(['save_card','cancel_card','addline','delline'], false);
            } else {
                // ????????????
                this.props.button.setButtonVisible(['edit_card','print_card','refresh_card'], false);
                this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
                this.props.button.setButtonVisible(['save_card','cancel_card','addline','delline'], true);
            }
        }
    }

    //????????????????????????
    getCardTableHead = () => {
        let { button } = this.props;
        let { createButtonApp } = button;
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'btn_card_table',//??????????????????????????????
                        onButtonClick: this.onButtonClick.bind(this)
                    })}
                    {this.props.cardTable.createBrowseIcons(this.state.cardTables.id, {
                        iconArr: ['close', 'open', 'max', 'setCol'],
                        maxDestAreaId: 'nc-bill-card'
                    })}
                </div>
            </div>
        )
    }

    /**
     * ??????????????????
     */
    backBtnClick(){
        this.state.showCard = false;
        this.setState(this.state, this.backList());
        //this.setState(this.state, this.loadListData());
    }
    backList = (callback = EMPTY_FN)=>{
        let { getDefData } = cardCache;
        let cachedata = getDefData(this.state.listTable.id, dataSource);//??????????????????
        this.props.table.setAllTableData(this.state.listTable.id, cachedata[this.state.listTable.id], true);
    }

    onButtonClick(props, id, text, record, index){
        switch (id) {
            case 'refresh_list'://??????
                // this.loadListData(()=>{
                //     toast({ color: 'success', content: this.lang['10140AFR-000003'] });/* ?????????????????? ????????????*/
                // });
                let { getDefData } = cardCache;
                let cachedata = getDefData(this.state.listTable.id, dataSource);//??????????????????
                this.props.table.setAllTableData(this.state.listTable.id, cachedata[this.state.listTable.id], true);
                toast({ color: 'success', content: this.lang['10140AFR-000003'] });/* ?????????????????? ????????????*/
                break;
            case 'refresh_card':
                this.loadCardData(this.state.pk_relation, ()=>{
                    toast({ color: 'success', content: this.lang['10140AFR-000003'] });/* ?????????????????? ????????????*/
                });
                break;
            case 'edit_card':
                this.editCard();
                break;
            case 'save_card':
                this.state.pagesate = BROWSE;
                this.setState(this.state, this.onsave(()=>{
                    this.buttonStatus();
                    toast({ color: 'success', content: this.lang['10140AFR-000009'] });/* ?????????????????? ????????????*/
                }));
                break;
            case 'cancel_card':
                this.cancelCard();
                break;
            case 'relation':
                this.state.pagesate = EDIT;
                this.onRowDoubleClick(record);
                break;
            case 'print_list':
            case 'print_card':
                this.onprint();
                break;
            case 'output_list':
            case 'output_card':
                this.output();
                break;
            case 'addline':
                this.props.cardTable.addRow(this.state.cardTables.id);
                break;
            case 'delline':
                // ?????????index
                let currIndex = this.props.cardTable.getCurrentIndex(this.state.cardTables.id);
                if(!currIndex || currIndex===-1){
                    toast({ color: 'warning', content: this.lang['10140AFR-000007'] });/* ?????????????????? ???????????????????????????*/
                }
                this.props.cardTable.delRowsByIndex(this.state.cardTables.id, currIndex);
                break;
        }
    }

    /**
     * ??????
     */
    onsave = (callback=EMPTY_FN)=>{
        // ????????????
        this.props.cardTable.filterEmptyRows(this.state.cardTables.id, []);
        // ????????????????????????
        let tableDatas = this.props.cardTable.getVisibleRows(this.state.cardTables.id);
        if(!tableDatas || tableDatas.length==0){
            toast({ color: 'warning', content: this.lang['10140AFR-000008'] });/* ?????????????????? ????????????????????????*/
            return false;
        }
        // ?????????????????????????????????????????????????????????????????????votransform?????????aggvo?????????extbillcard
        let cardData = this.props.createExtCardData('10140AFR_main', this.state.cardForm.id, [this.state.cardTables.id]);
        let requestParam = {
            ...cardData,
            formid: this.state.cardForm.id,
            tableid: this.state.cardTables.id
        }
        ajax({
            loading: true,
            data: requestParam,
            url: urls.accfactorSave,
            success: (res)=>{
                let { success, data } = res;
                if (success) {
                    if(data && data.head){
                        // ??????????????????????????????
                        if(data.body){
                            this.props.cardTable.setTableData(this.state.cardTables.id, data.body[this.state.cardTables.id]);
                            this.props.cardTable.setStatus(this.state.cardTables.id, this.state.pagesate);
                        }
                    }
                    this.setState(this.state, callback);
                }
            }
        });
    }

    editCard = ()=>{
        this.state.pagesate = EDIT;
        this.props.cardTable.setStatus(this.state.cardTables.id, EDIT);
        this.setState(this.state, this.buttonStatus());
    }

    cancelCard = ()=>{
        promptBox({
            color: 'warning',                 // ??????????????????"success"??? "success"/"info"/"warning"/"danger",?????????
            title: this.lang['10140AFR-000004'],/* ?????????????????? ????????????*/
            content: this.lang['10140AFR-000005'],/* ?????????????????? ????????????????????????*/
            beSureBtnClick: () => {
                this.state.pagesate = BROWSE;
                this.props.cardTable.setStatus(this.state.cardTables.id, BROWSE);
                this.setState(this.state, this.loadCardData(this.state.pk_relation, this.buttonStatus()));
            }
        });
    }

    output = ()=>{
        this.validPrintData('out', ()=>{
            this.refs.printOutput.open();
        });
    }

    onprint = ()=>{
        this.validPrintData('print', ()=>{
            print(
                'pdf',  //????????????: 'html'???????????????, 'pdf'???pdf??????
                urls.accfactorPrint,
                this.state.printOutData
            );
        })
    }

    validPrintData = (flag='print', callback=EMPTY_FN)=>{
        let pks = [];
        if(!this.state.showCard){
            // ????????????
            let printData = this.props.table.getCheckedRows(this.state.listTable.id);
            if(!printData || printData.length==0){
                toast({ color: 'warning', content: this.lang['10140AFR-000010'] });/* ?????????????????? ??????????????????????????????????????????*/
                return;
            }
            printData.forEach( (val)=>{
                let pk = val.data.values.pk_relation.value;
                pks.push(pk);
            });
            // ??????????????????
            this.state.printOutData.nodekey = 'List_10140AFR';
        } else {
            pks.push(this.state.pk_relation);
            // ??????????????????
            this.state.printOutData.nodekey = 'Card_10140AFR';
        }
        this.state.printOutData.oids = pks;
        if(flag === 'out') this.state.printOutData.outputType = 'output';   // ??????????????????????????????
        else delete this.state.printOutData.outputType;
        this.setState(this.state, callback);
    }

    //??????????????????????????????????????????
    hideExpandBtn(){
        let btn = document.getElementsByClassName('icon-shituliebiaoqiehuan');
        console.log('btn::', btn);
        let arrBtn = Array.prototype.slice.call(btn, 0);
        arrBtn.forEach(element => {
            element.style.display = 'none';
        });
    }

    render(){
        if(!this.lang) return ''; // ?????????????????????????????????????????????setmeta??????setstate??????render
        var { listTable,listSearch,cardForm,cardTables } = this.state;
        var??{??button,search,table,form,cardTable,BillHeadInfo,cardPagination }??=??this.props;
        var { createBillHeadInfo } = BillHeadInfo;
        var??{??createButtonApp??}??=??button;
????????????????var??{??NCCreateSearch??}??=??search;
????????????????var??{??createSimpleTable }??=??table;
        var??{??createForm??}??=??form;
????????????????var??{??createCardTable??}??=??cardTable;
        var {createCardPagination} = cardPagination;                  
                        
        let drawList = ()=>{
            return (
                <div className="nc-single-table">
                    {/* ?????? header */}
                    <NCDiv className="nc-singleTable-header-area" areaCode={NCDiv.config.HEADER}>
                        {/* ?????? title */}
                        <div className="header-title-search-area">
                            {createBillHeadInfo(
                                {
                                    title: this.lang['10140AFR-000000']/* ?????????????????? ??????????????????*/,
                                    backBtnClick:()=>{},
                                    initShowBackBtn: false
                                }
                            )}
                        </div>
                        {/* ?????????  btn-group */}
                        <div className="header-button-area header-button-area-print-btn">
                            {createButtonApp({
                                area: 'btn_list',//??????????????????????????????
                                onButtonClick: this.onButtonClick.bind(this)
                            })}
                        </div>
                    </NCDiv>
                    {/* ????????? */}
                    <div className="nc-singleTable-search-area">
                        {NCCreateSearch(listSearch.id, listSearch)}
                    </div>
                    {/* ????????? */}
                    <div className="nc-singleTable-table-area">
                        {createSimpleTable(listTable.id, listTable)}
                    </div>

                </div>
            )
        }

        let drawCard = ()=>{
            this.hideExpandBtn();     
            return (
                <div id='nc-bill-extCard' className="nc-bill-extCard">
                    <div className='nc-bill-top-area'>
                        <NCAffix>
                            <NCDiv className='nc-bill-header-area' areaCode={NCDiv.config.HEADER}>
                                <div className='title'>
                                    {createBillHeadInfo(
                                        {
                                            title: this.lang['10140AFR-000000']/* ?????????????????? ??????????????????*/,
                                            backBtnClick: this.backBtnClick.bind(this),
                                            initShowBackBtn: this.state.pagesate == 'browse'
                                        }
                                    )}
                                </div>

                                <div className="header-button-area">
                                    {createButtonApp({
                                        area: 'btn_card',//??????????????????????????????
                                        onButtonClick: this.onButtonClick.bind(this),
                                    })} 
                                    {/* ?????????????????? */}
                                    <div className='header-cardPagination-area' style={{float:'right'}}>
                                        {createCardPagination({
                                            dataSource: dataSource,
                                            handlePageInfoChange: this.cardpagecharge.bind(this)
                                        })}
                                    </div>                                
                                </div>
                            </NCDiv>
                        </NCAffix>

                        <div className="nc-bill-form-area">
                            {createForm(cardForm.id, cardForm)}
                        </div>
                    </div>

                    <div className="nc-bill-bottom-area">
                        <div className="nc-bill-table-area">
                            {createCardTable(cardTables.id, cardTables)}
                        </div>
                    </div>
                </div>
            )
        }

        return  (
            <div>
                {this.state.showCard ? drawCard() : drawList()}
                <PrintOutput
                        ref='printOutput'
                        url={urls.accfactorPrint}
                        data={this.state.printOutData}
                    >
                </PrintOutput>
            </div>   
        );
    }
}

AccfactorRelation = createPage({
    billinfo:{
        billtype: 'card',
        pagecode: '10140AFR_main',
        headcode: 'form_card',
        bodycode: 'table_card'
    }
})(AccfactorRelation);
// ????????????
ReactDOM.render(<AccfactorRelation/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65