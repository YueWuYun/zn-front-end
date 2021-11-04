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
                funcode:'10140AFR',      //小应用编码
                nodekey:'List_10140AFR',    //模板节点标识
                oids:[]
            }
        }
    }

    loadListData = (callback = EMPTY_FN)=>{
        //获取查询区数据
        let searchData = this.props.search.getAllSearchData(this.state.listSearch.id);
        if(!searchData) return;
        //不能从meta直接获取查询模板id，目前meta里的oid是错误的
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
                        toast({color:"success",content:"查询出"+data[this.state.listTable.id].rows.length+"条数据"});
                    }else{
                        this.props.table.setAllTableData(this.state.listTable.id, { rows: [] }, false);
                        toast({ color: 'warning', content: this.lang['10140AFR-000001'] });/* 国际化处理： 查询结果0*/
                        return;
                    }
                    this.setState(this.state, callback);
                }
            }
        })
    }

    /**
     * 查询按钮点击事件
     */
    onClickSearchBtn(props, val){
        this.loadListData(()=>{
            //toast({ color: 'success', content: this.lang['10140AFR-000002'] });/* 国际化处理： 查询成功*/
        });
    }

    /**
     * 列表双击
     * @param {} id 
     */
    onRowDoubleClick(record){
        this.state.showCard = true;
        this.state.pk_relation = record.pk_relation.value;
        this.state.pk_factorchart = record.pk_factorchart.value;
        this.state.pk_accountingbook = record.pk_book.value;
        // 这里必须要先setState，因为这个时候drawCard还没有加载，不先render的话，this.props.form加载不到
        this.setState(this.state, this.loadCardData(record.pk_relation.value, this.buttonStatus()));
    }

    /**
     * 卡片表体参照过滤
     */
    filterBodyRef = ()=>{
        let meta = this.props.meta.getMeta();
        for (var item of meta[this.state.cardTables.id].items) {
            // 会计科目
            if(item.attrcode === 'pk_accasoa'){
                item.queryCondition=()=>{
                    return {
                        pk_accountingbook: this.state.pk_accountingbook
                    };
                };
            }
            // 核算要素
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
     * 加载卡片
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
                        let idObj = { id: pk_relation, status: 1 }//status均传1
                        
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

    //卡片翻页事件
    cardpagecharge(props, pks, that) {
        this.loadCardData(pks);
    }

    /**
     * 按钮点击状态切换监听事件
     * @param id
     */
    buttonStatus = (id)=>{
        let meta = this.props.meta.getMeta();
        if(this.state.showCard){
            if(this.state.pagesate === BROWSE){
                // 卡片浏览
                this.props.button.setButtonVisible(['edit_card','print_card','refresh_card'], true);
                this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
                this.props.button.setButtonVisible(['save_card','cancel_card','addline','delline'], false);
            } else {
                // 卡片编辑
                this.props.button.setButtonVisible(['edit_card','print_card','refresh_card'], false);
                this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
                this.props.button.setButtonVisible(['save_card','cancel_card','addline','delline'], true);
            }
        }
    }

    //获取列表肩部信息
    getCardTableHead = () => {
        let { button } = this.props;
        let { createButtonApp } = button;
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'btn_card_table',//按钮注册中的按钮区域
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
     * 卡片返回箭头
     */
    backBtnClick(){
        this.state.showCard = false;
        this.setState(this.state, this.backList());
        //this.setState(this.state, this.loadListData());
    }
    backList = (callback = EMPTY_FN)=>{
        let { getDefData } = cardCache;
        let cachedata = getDefData(this.state.listTable.id, dataSource);//获取缓存数据
        this.props.table.setAllTableData(this.state.listTable.id, cachedata[this.state.listTable.id], true);
    }

    onButtonClick(props, id, text, record, index){
        switch (id) {
            case 'refresh_list'://刷新
                // this.loadListData(()=>{
                //     toast({ color: 'success', content: this.lang['10140AFR-000003'] });/* 国际化处理： 刷新成功*/
                // });
                let { getDefData } = cardCache;
                let cachedata = getDefData(this.state.listTable.id, dataSource);//获取缓存数据
                this.props.table.setAllTableData(this.state.listTable.id, cachedata[this.state.listTable.id], true);
                toast({ color: 'success', content: this.lang['10140AFR-000003'] });/* 国际化处理： 刷新成功*/
                break;
            case 'refresh_card':
                this.loadCardData(this.state.pk_relation, ()=>{
                    toast({ color: 'success', content: this.lang['10140AFR-000003'] });/* 国际化处理： 刷新成功*/
                });
                break;
            case 'edit_card':
                this.editCard();
                break;
            case 'save_card':
                this.state.pagesate = BROWSE;
                this.setState(this.state, this.onsave(()=>{
                    this.buttonStatus();
                    toast({ color: 'success', content: this.lang['10140AFR-000009'] });/* 国际化处理： 保存成功*/
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
                // 当前行index
                let currIndex = this.props.cardTable.getCurrentIndex(this.state.cardTables.id);
                if(!currIndex || currIndex===-1){
                    toast({ color: 'warning', content: this.lang['10140AFR-000007'] });/* 国际化处理： 请选择要删行的数据*/
                }
                this.props.cardTable.delRowsByIndex(this.state.cardTables.id, currIndex);
                break;
        }
    }

    /**
     * 保存
     */
    onsave = (callback=EMPTY_FN)=>{
        // 过滤工行
        this.props.cardTable.filterEmptyRows(this.state.cardTables.id, []);
        // 校验子表是否有值
        let tableDatas = this.props.cardTable.getVisibleRows(this.state.cardTables.id);
        if(!tableDatas || tableDatas.length==0){
            toast({ color: 'warning', content: this.lang['10140AFR-000008'] });/* 国际化处理： 子表数据不可为空*/
            return false;
        }
        // 获取主子单据数据，这里使用了一主多子，因为后天votransform类转换aggvo用的是extbillcard
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
                        // 目前只修改子表的数据
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
            color: 'warning',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.lang['10140AFR-000004'],/* 国际化处理： 确认取消*/
            content: this.lang['10140AFR-000005'],/* 国际化处理： 是否确定要取消？*/
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
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                urls.accfactorPrint,
                this.state.printOutData
            );
        })
    }

    validPrintData = (flag='print', callback=EMPTY_FN)=>{
        let pks = [];
        if(!this.state.showCard){
            // 列表打印
            let printData = this.props.table.getCheckedRows(this.state.listTable.id);
            if(!printData || printData.length==0){
                toast({ color: 'warning', content: this.lang['10140AFR-000010'] });/* 国际化处理： 请选择需要打印或输出的数据！*/
                return;
            }
            printData.forEach( (val)=>{
                let pk = val.data.values.pk_relation.value;
                pks.push(pk);
            });
            // 列表打印模板
            this.state.printOutData.nodekey = 'List_10140AFR';
        } else {
            pks.push(this.state.pk_relation);
            // 卡片打印模板
            this.state.printOutData.nodekey = 'Card_10140AFR';
        }
        this.state.printOutData.oids = pks;
        if(flag === 'out') this.state.printOutData.outputType = 'output';   // 判断是否是打印、输出
        else delete this.state.printOutData.outputType;
        this.setState(this.state, callback);
    }

    //卡片浏览态删除肩部第一个按钮
    hideExpandBtn(){
        let btn = document.getElementsByClassName('icon-shituliebiaoqiehuan');
        console.log('btn::', btn);
        let arrBtn = Array.prototype.slice.call(btn, 0);
        arrBtn.forEach(element => {
            element.style.display = 'none';
        });
    }

    render(){
        if(!this.lang) return ''; // 异步加载多语未完成，返回空，待setmeta调用setstate后再render
        var { listTable,listSearch,cardForm,cardTables } = this.state;
        var { button,search,table,form,cardTable,BillHeadInfo,cardPagination } = this.props;
        var { createBillHeadInfo } = BillHeadInfo;
        var { createButtonApp } = button;
        var { NCCreateSearch } = search;
        var { createSimpleTable } = table;
        var { createForm } = form;
        var { createCardTable } = cardTable;
        var {createCardPagination} = cardPagination;                  
                        
        let drawList = ()=>{
            return (
                <div className="nc-single-table">
                    {/* 头部 header */}
                    <NCDiv className="nc-singleTable-header-area" areaCode={NCDiv.config.HEADER}>
                        {/* 标题 title */}
                        <div className="header-title-search-area">
                            {createBillHeadInfo(
                                {
                                    title: this.lang['10140AFR-000000']/* 国际化处理： 科目要素关联*/,
                                    backBtnClick:()=>{},
                                    initShowBackBtn: false
                                }
                            )}
                        </div>
                        {/* 按钮区  btn-group */}
                        <div className="header-button-area header-button-area-print-btn">
                            {createButtonApp({
                                area: 'btn_list',//按钮注册中的按钮区域
                                onButtonClick: this.onButtonClick.bind(this)
                            })}
                        </div>
                    </NCDiv>
                    {/* 查询区 */}
                    <div className="nc-singleTable-search-area">
                        {NCCreateSearch(listSearch.id, listSearch)}
                    </div>
                    {/* 列表区 */}
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
                                            title: this.lang['10140AFR-000000']/* 国际化处理： 科目要素关联*/,
                                            backBtnClick: this.backBtnClick.bind(this),
                                            initShowBackBtn: this.state.pagesate == 'browse'
                                        }
                                    )}
                                </div>

                                <div className="header-button-area">
                                    {createButtonApp({
                                        area: 'btn_card',//按钮注册中的按钮区域
                                        onButtonClick: this.onButtonClick.bind(this),
                                    })} 
                                    {/* 卡片分页组件 */}
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
// 渲染页面
ReactDOM.render(<AccfactorRelation/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65