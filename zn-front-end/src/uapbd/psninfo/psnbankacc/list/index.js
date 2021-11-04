//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import {Component} from 'react';
import ReactDOM from 'react-dom';
import {createPage, createPageIcon, ajax, base, toast, cacheTools, print, high, promptBox, cardCache,excelImportconfig} from 'nc-lightapp-front';
import './index.less';
import createUIDom from '../../../public/utils/BDCreateUIDom';

const {getDefData, setDefData} = cardCache;
const {PrintOutput,ExcelImport} = high;
const {NCCheckbox, NCDiv} = base;

let gridId = 'psnbankacc';
let searchId = 'psnbankacc_search';
let pagecode = '10140PSNBA_list';
let ajaxurl = {
    queryPage: '/nccloud/uapbd/psnbankacc/PsnbankaccQueryAction.do',
    add: '/uapbd/psnbankacc/PsnbankaccAddAction.do',
    delete: '/nccloud/uapbd/psnbankacc/PsnbankaccDelAction.do',
    enable: '/nccloud/uapbd/psnbankacc/PsnbankaccEnableAction.do',
    disable: '/nccloud/uapbd/psnbankacc/PsnbankaccDisableAction.do',
    isEditPermissionUrl: '/nccloud/uapbd/psnbankacc/IsEditPermissionAction.do',
    listPrint: '/nccloud/uapbd/psnbankacc/PsnbankaccListPrintAction.do'
}
let linkurl = {
    index: '/uapbd/psninfo/psnbankacc/card/index.html'
}

let dataSource = 'upabd.psninfo.psnbankacc.data'

class PsnbankaccSimpleTable extends Component {
    constructor (props) {
        super(props);
        this.config = {
            pageTitle: '', /* 国际化处理： 个人银行账户*/
            appcode: '10140PSNBA',
            gridId: 'psnbankacc',
            searchId: 'psnbankacc_search',
            pagecode: '10140PSNBA_list',
            oid: '1001Z010000000016RCP',
            billType:'psnbankacc'
        };

        this.state = {
            searchValue: '',
            checkValue: false,
            index: -1,
            pks: [], //翻页pk集合
            printpks: [],
            json: {},
            inlt: null,
        }
        createUIDom(props)(
            {
                pagecode: pagecode,
                appcode: '10140PSNBA'
            },
            {
                moduleId: "10140PSNBA", domainName: 'uapbd'
            },
            (data, langData, inlt) => {
                if (langData) {
                    this.state.json = langData
                    if (inlt) {
                        this.state.inlt = inlt
                    }
                }
                if (this.props.getUrlParam('checkValue')) {
                    this.state.checkValue = this.props.getUrlParam('checkValue');
                }
                this.setState(this.state, () => {
                    this.config.pageTitle = this.state.json['10140PSNBA-000015'];
                    let meta = data.template;
                    meta = this.modifierMeta(props, meta);
                    props.meta.setMeta(meta, () => {
                        this.initialization();
                    });
                    if(data.button){
                        let excelimportconfig = excelImportconfig(props,'uapbd',this.config.billType,true,'',{'appcode':this.config.appcode , 'pagecode':'10140PSNBA_card'},()=>{
                            this.loadGridData({});
                        });
                        props.button.setUploadConfig("Import",excelimportconfig);
                        props.button.setButtons(data.button);
                        props.button.setPopContent({'Del': this.state.json['10140PSNBA-000016']});
                        /* 国际化处理： 确认删除？*/
                    }
                    this.initButtonDisable();

                });

            }
        );


    }

    modifierMeta = (props, meta) => {
        meta[searchId].items.map((item) => {
            if (item.attrcode == 'pk_psndoc') {
                item['isShowUnit'] = true;
                item['isShowDimission'] = true;
                item['isShowDisabledData'] = true;
                item['refcode'] = 'uapbd/refer/psninfo/PsndocTreeGridRef/index.js';
            }
        });
        
        meta[gridId].items = meta[gridId].items.map((item, key) => {
            //item.width = 150;
            if (item.attrcode == 'pk_bankaccbas.accnum') {
                item.render = (text, record, index) => {
                    return (
                        <a
                            style={{color: '#007ace', cursor: 'pointer'}}
                            onClick={(e) => {
                                props.pushTo('/card', {
                                    pagecode: '10140PSNBA_card',
                                    appcode: '10140PSNBA',
                                    status: 'browse',
                                    isCopy: 'N',
                                    id: record.psnbankaccVO.value.pk_psnbankacc,
                                    checkValue: this.state.checkValue
                                });
                            }}
                        >
                            {record && record['pk_bankaccbas.accnum'] && record['pk_bankaccbas.accnum'].value}
                        </a>
                    )
                }
            }
            return item;
        });

        meta[searchId].items = meta[searchId].items.map((item, key) => {
            if (item.attrcode == 'pk_psndoc') {
                item['unitCondition'] = () => {
                    return {
                        "AppCode": this.config.appcode,
                        "TreeRefActionExt": 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    }
                };
            } else if (item.attrcode == 'pk_org') {
                item['queryCondition'] = () => {//主组织权限
                    return {
                        "AppCode": this.config.appcode,
                        'TreeRefActionExt': 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    }
                };
            }
            return item;
        });

        //添加操作列
        meta[gridId].items.push({
            attrcode: 'opr',
            itemtype: 'customer',
            label: this.state.json['10140PSNBA-000017'], /* 国际化处理： 操作*/
            width: '200px',
            fixed: 'right',
            className: 'table-opr',
            visible: true,
            render: (text, record, index) => {
                let btnArray = ['Edit', 'Del', 'Copy'];
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table-area",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => {
                            this.tableButtonClick(props, id, text, record, index)
                        }
                    }
                )
            }
        });
        return meta;
    }

    componentDidMount () {
        //
    }

    initialization () {
        //let searchVal = cacheTools.get("searchParams_10140PSNBA");
        let searchVal = getDefData("searchParams_10140PSNBA", dataSource);
        if (searchVal != 'undefined' && searchVal && searchVal.conditions) {
            this.loadGridData();
        }
    }

    //初始化按钮是否可用
    initButtonDisable () {
        this.props.button.setDisabled(['Delete', 'Enable', 'Enable1', 'Disable', 'Print', 'Print1', 'Output'], true);
    }

    //显示停用按钮点击事件
    onCheckShowDisable = () => {
        this.setState({
            checkValue: !this.state.checkValue
        }, () => {
            //cacheTools.set("isShowOff_10140PSNBA", this.state.checkValue);
            setDefData("isShowOff_10140PSNBA", this.config.datasource, this.state.checkValue);
            this.loadGridData();
        });
    }

    //查询区按钮点击事件
    onClickSearchBtn (props, data) {
        let searchVa = this.props.search.getAllSearchData(searchId);
        //cacheTools.set("searchParams_10140PSNBA", searchVa);
        setDefData("searchParams_10140PSNBA", dataSource, searchVa);
        this.loadGridData({}, (data) => {
            //给出查询结果提示
            if (data && data['grid']['psnbankacc'].allpks.length > 0) {
                toast({
                    color: 'success',
                    content: `${this.state.json['10140PSNBA-000024']},${this.state.json['10140PSNBA-000025']}` + data['grid']['psnbankacc'].allpks.length + `${this.state.json['10140PSNBA-000026']}`/* 国际化处理： 查询成功,共,条*/
                });
            } else {
                toast({
                    color: 'warning',
                    content: `${this.state.json['10140PSNBA-000027']}！`/* 国际化处理： 未查询出符合条件的数据*/
                });
            }

        });
    }

    //加载列表数据
    loadGridData = ({pagepks = []} = {}, callback) => {
        //let searchVal = cacheTools.get("searchParams_10140PSNBA");
        // let searchVal = getDefData('searchParams_10140PSNBA', this.config.datasource)
        let searchData = this.props.search.getAllSearchData('psnbankacc_search');

        /** 20190227 返回列表，从缓存中获取pks，pageinfo */ 
        pagepks = getDefData('pagePks_10140PSNBA',dataSource) || pagepks;
        let pageInfo = getDefData('pageInfo_10140PSNBA',dataSource) || this.props.table.getTablePageInfo(gridId);

        let queryInfo = this.props.search.getQueryInfo('psnbankacc_search');
        let paramData = {
            showDisableDataFlag: this.state.checkValue,
            querycondition: searchData,
            pageCode: pagecode,
            queryAreaCode: searchId,  //查询区编码
            oid: queryInfo.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: 'tree',
            pageInfo: pageInfo,
            pagepks: pagepks  //翻页时pk集合
        };

        //若不是翻页查询则需清除state中pks
        if (!pagepks || pagepks.length == 0) {
            this.setState({pks: []});
        }

        ajax({
            url: ajaxurl.queryPage,
            data: paramData,
            success: (res) => {
                if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                    this.props.dealFormulamsg(
                        res.formulamsg,  //参数一：返回的公式对象
                        {                //参数二：界面使用的表格类型
                            "psnbankacc": "simpleTable"
                        }
                    );
                }

                let {success, data} = res;
                if (success) {
                    callback && callback(data)
                    this.initButtonDisable();
                    if (data) {
                        this.makePageDatas(data['grid'][gridId].rows, data['pkstrans']);
                        this.props.table.setAllTableData(gridId, data['grid'][gridId]);

                        this.props.button.setDisabled(['Print', 'Print1', 'Output'], false);
                    } else {
                        this.props.table.setAllTableData(gridId, {rows: []});
                    }
                }
            }
        })
    }

    //翻页查询
    pageInfoClick = (props, config, pks) => {
        this.setState(
            {pks: pks},
            () => {
                let pageInfo = props.table.getTablePageInfo(gridId);
                //cacheTools.set('pageInfo_10140PSNBA', pageInfo);

                /** 20190227 缓存中设置当前pageinfo，pks */
                setDefData('pageInfo_10140PSNBA', dataSource, pageInfo);
                setDefData('pagePks_10140PSNBA', dataSource, pks);
                this.loadGridData({pagepks: this.state.pks});
            }
        );
    }

    /**
     * 列表显示数据填充 -- 主键翻译为name或者code
     * @param {*} data
     * @param {*} pkstrans
     */
    makePageDatas (data, pkstrans) {
        if (data.length > 0) {

            let banktypeTrans = pkstrans['banktype'];
            let bankdocTrans = pkstrans['bankdoc'];
            let psndocTrans = pkstrans['psndoc'];

            data.forEach(item => {
                let pk_psndoc = item.values.psnbankaccVO.value.pk_psndoc;
                let pk_banktype = item.values.bankaccbasVO.value.pk_banktype;
                let pk_bankdoc = item.values.bankaccbasVO.value.pk_bankdoc;
                let enablestate = item.values.bankaccbasVO.value.enablestate;

                let obj = {};

                obj['pk_psndoc'] = {
                    value: pk_psndoc,
                    display: psndocTrans[pk_psndoc + "_code"]
                };
                obj['pk_psndoc.name']={
                    value: pk_psndoc,
                    display: psndocTrans[pk_psndoc + "_name"]
                };
                obj['pk_bankaccbas.accnum'] = {value: item.values.bankaccbasVO.value.accnum};
                obj['pk_bankaccbas.pk_banktype.name'] = {
                    value: pk_banktype,
                    display: banktypeTrans[pk_banktype]
                };
                obj['pk_bankaccbas.pk_bankdoc.name'] = {
                    value: pk_bankdoc,
                    display: bankdocTrans[pk_bankdoc]
                };
                obj['pk_bankaccbas.accopendate'] = {value: item.values.bankaccbasVO.value.accopendate};
                obj['pk_bankaccbas.enablestate'] = {
                    value: enablestate,
                    display: enablestate == 2 ? this.state.json['10140PSNBA-000018'] : enablestate == 1 ? this.state.json['10140PSNBA-000019'] : this.state.json['10140PSNBA-000020']
                };
                /* 国际化处理： 已启用,未启用,已停用*/
                let payacc = item.values.psnbankaccVO.value.payacc;
                obj['payacc'] = {
                    value: payacc,
                    display: payacc ? (this.state.json['10140PSNBA-000021'] + payacc) : '' /* 国际化处理： 工资卡*/
                };
                obj["isexpenseacc"]={value:item.values.psnbankaccVO.value.isexpenseacc};

                item.values = Object.assign(item.values, obj);
            });
        }
    }
    
    //行按钮点击事件
    tableButtonClick (props, id, text, record, index) {
        switch (id) {
            case 'Edit'://编辑
                ajax({
                    url: ajaxurl['isEditPermissionUrl'],
                    data: {pks: [record.psnbankaccVO.value.pk_psnbankacc]},
                    success: (res) => {
                        let {success, data} = res;
                        if (success) {
                            props.pushTo('/card', {
                                pagecode: '10140PSNBA_card',
                                appcode: '10140PSNBA',
                                status: 'edit',
                                isCopy: 'N',
                                id: record.psnbankaccVO.value.pk_psnbankacc,
                                checkValue: this.state.checkValue
                            });
                        }
                    }
                });
                break;
            case 'Del'://删除
                let paraDat = {
                    pks: [record.psnbankaccVO.value.pk_psnbankacc],
                    pktss: [record.psnbankaccVO.value.pk_psnbankacc + '##' + record.psnbankaccVO.value.ts]
                };
                this.onDelete({paraDat: paraDat});
                break;
            case 'Copy'://复制
                props.pushTo('/card', {
                    pagecode: '10140PSNBA_card',
                    appcode: '10140PSNBA',
                    status: 'add',
                    isCopy: 'Y',
                    id: record.psnbankaccVO.value.pk_psnbankacc,
                    checkValue: this.state.checkValue
                });
                break;
            default:
                break;
        }
    }

    //按钮点击事件
    onClickButton (props, id) {
        switch (id) {
            case 'Refresh'://刷新
                this.loadGridData({}, () => {
                    toast({title: this.state.json['10140PSNBA-000001'], color: 'success'});
                });
                break;
            case 'Add'://新增
                // let allrows = props.table.getAllTableData(gridId);

                /** 20190227 获取当前页面下最后一个pk */
                let pageCurrPks = props.table.getPks(gridId);

                // let lastPk=allrows
                props.pushTo('/card', {
                    pagecode: '10140PSNBA_card',
                    appcode: '10140PSNBA',
                    status: 'add',
                    isCopy: 'N',
                    // id: allrows.allpks[allrows.allpks.length - 1],
                    id: pageCurrPks[pageCurrPks.length-1],
                    checkValue: this.state.checkValue
                });
                break;
            case 'Delete'://删除
                promptBox({
                    color: 'warning',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['10140PSNBA-000004'], /* 国际化处理： 确认删除*/
                    content: this.state.json['10140PSNBA-000022'], /* 国际化处理： 您确定要删除所选数据吗?*/
                    beSureBtnClick: this.onDelete.bind(this)
                });
                break;
            case 'Enable'://启用
                this.onEnable();
                break;
            case 'Enable1'://启用
                this.onEnable();
                break;
            case 'Disable'://停用
                this.onDisable();
                break;
            case 'Print'://打印
                this.print();
                break;
            case 'Print1'://打印
                this.print();
                break;
            case 'Output'://输出
                this.output();
                break;
            case 'Export':
                this.setState({

                },()=>{
                    this.props.modal.show('exportFileModal');
                });
                break;
            default:
                break;
        }
    }

    //拼接选中数据
    getSelParam (selData) {
        let pks = [];
        let pktss = [];
        selData.map((data) => {
            let pk_psnbankacc = data.data.values.psnbankaccVO.value.pk_psnbankacc;
            let ts = data.data.values.psnbankaccVO.value.ts;
            pks.push(pk_psnbankacc);
            pktss.push(pk_psnbankacc + '##' + ts);
        });
        return {pks: pks, pktss: pktss};
    }

    //删除
    onDelete ({paraDat = null} = {}) {
        let paramData = {};
        if (paraDat) {//行删除
            paramData = paraDat;
        } else {//选中数据删除
            let selData = this.props.table.getCheckedRows(gridId);
            if (!selData && selData.length) return;
            paramData = this.getSelParam(selData);
        }
        ajax({
            url: ajaxurl['delete'],
            data: paramData,
            success: (res) => {
                if (res.success) {
                    toast({color: 'success', content: this.state.json['10140PSNBA-000006']});
                    /* 国际化处理： 删除成功！*/
                    this.loadGridData();
                }
            }
        });
    }

    //启用
    onEnable () {
        let selData = this.props.table.getCheckedRows(gridId);
        if (!selData && selData.length) return;

        let paramData = this.getSelParam(selData);

        promptBox({
            color: 'warning',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['10140PSNBA-000007'], /* 国际化处理： 确认启用*/
            content: this.state.json['10140PSNBA-000008'], /* 国际化处理： 是否确定要启用？*/
            beSureBtnClick: () => {
                ajax({
                    url: ajaxurl['enable'],
                    data: paramData,
                    success: (res) => {
                        if (res.success) {
                            toast({color: 'success', title: this.state.json['10140PSNBA-000009']});
                            /* 国际化处理： 启用成功！*/
                            this.loadGridData({pagepks: this.state.pks});
                        }
                    }
                });
            }
        });
    }

    //停用
    onDisable () {
        let selData = this.props.table.getCheckedRows(gridId);
        if (!selData && selData.length) return;

        let paramData = this.getSelParam(selData);

        promptBox({
            color: 'warning',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['10140PSNBA-000010'], /* 国际化处理： 确认停用*/
            content: this.state.json['10140PSNBA-000011'], /* 国际化处理： 是否确定要停用？*/
            beSureBtnClick: () => {
                ajax({
                    url: ajaxurl['disable'],
                    data: paramData,
                    success: (res) => {
                        if (res.success) {
                            toast({color: 'success', title: this.state.json['10140PSNBA-000012']});
                            /* 国际化处理： 停用成功！*/
                            this.loadGridData({pagepks: this.state.pks});
                        }
                    }
                });
            }
        });
    }

    //打印
    print () {
        let allData = this.props.table.getAllTableData(gridId);
        let pks = [];
        allData.rows.forEach((item) => {
            pks.push(item.values.psnbankaccVO.value.pk_psnbankacc);
        });
        let param = {
            funcode: this.config.appcode,
            nodekey: 'psnbankacclist',  //模板节点标识
            oids: pks
        };
        print(
            'pdf',
            ajaxurl['listPrint'],
            param
        );
    }

    //输出
    output () {
        let allData = this.props.table.getAllTableData(gridId);
        let pks = [];
        allData.rows.forEach((item) => {
            pks.push(item.values.psnbankaccVO.value.pk_psnbankacc);
        });
        this.setState({
            printpks: pks
        }, () => {
            this.refs.printOutput.open();
        });
    }

    //列表双击事件
    doubleClick (record, index, e) {
        //let searchVal = this.props.search.getAllSearchData(searchId);
        //cacheTools.set("searchParams_10140PSNBA", searchVal);
        this.props.pushTo('/card', {
            pagecode: '10140PSNBA_card',
            appcode: '10140PSNBA',
            status: 'browse',
            isCopy: 'N',
            id: record.psnbankaccVO.value.pk_psnbankacc,
            checkValue: this.state.checkValue
        });
    }

    //左侧选择列单个选择框回调
    onSelected (props, moduleId/*区域id*/, record/*行数据*/, index/*当前index*/, status/*选框值*/) {
        //此处控制按钮的隐藏显示及启用状态
        let selData = props.table.getCheckedRows(gridId);

        if (!selData || selData.length === 0) {//未选择数据
            this.props.button.setDisabled(['Delete', 'Enable', 'Enable1', 'Disable'], true);
        } else {//选择多行数据
            let enableShowFlag = true, disableShowFlag = true;
            for (let i = 0; i < selData.length; i++) {
                let data = selData[i].data;
                if (data.values.bankaccbasVO.value.enablestate === '2') {
                    disableShowFlag = false;
                } else {
                    enableShowFlag = false;
                }
            }
            this.props.button.setDisabled(['Delete'], false);
            this.props.button.setDisabled(['Enable', 'Enable1'], enableShowFlag);
            this.props.button.setDisabled(['Disable'], disableShowFlag);
        }
    }

    //左侧全选回调
    onSelectedAll (props, moduleId, status, length) {
        let selData = props.table.getCheckedRows(moduleId);
        //设置按钮状态
        if (!selData || selData.length === 0) {//未选择数据
            this.props.button.setDisabled(['Delete', 'Enable', 'Enable1', 'Disable'], true);
        } else {//选择多行数据
            let enableShowFlag = true, disableShowFlag = true;
            for (let i = 0; i < selData.length; i++) {
                let data = selData[i].data;
                if (data.values.bankaccbasVO.value.enablestate === '2') {
                    disableShowFlag = false;
                } else {
                    enableShowFlag = false;
                }
            }
            this.props.button.setDisabled(['Delete'], false);
            this.props.button.setDisabled(['Enable', 'Enable1'], enableShowFlag);
            this.props.button.setDisabled(['Disable'], disableShowFlag);
        }
    }

    render () {
        const {table, button, search, modal, BillHeadInfo} = this.props;
        const {createButtonApp} = button;
        const {createBillHeadInfo} = BillHeadInfo;
        const {NCCreateSearch} = search;
        const {createModal} = modal;
        const {createSimpleTable} = table;
        return (
            <div className="nc-bill-list cn_10140PSNBA_list">
                {/* 模态框 */}
                {createModal('modal')}

                {/* 头部 header */}
                <NCDiv className="nc-bill-header-area" areaCode={NCDiv.config.HEADER}>
                    {/* 标题 title */}
                    <div className="header-title-search-area">
                        {createBillHeadInfo(
                            {
                                //title-search-detail
                                title: this.config.pageTitle,
                                backBtnClick:()=>{},
                                initShowBackBtn: false
                            }
                        )}
                        {/* 显示停用  showOff*/}
                        <div className="title-search-detail">
                            <span className='showOff'>
                                <NCCheckbox id='checkbox'
                                            defaultChecked={false}
                                            checked={this.state.checkValue}
                                            onChange={this.onCheckShowDisable.bind(this)}
                                >
                                    {this.state.json['10140PSNBA-000023']}{/* 国际化处理： 显示停用*/}
                                </NCCheckbox>
                            </span>
                        </div>
                    </div>
                    {/* 按钮区  btn-group */}
                    <div className="header-button-area">
                        {createButtonApp({
                            area: 'header-button-area',
                            onButtonClick: this.onClickButton.bind(this),
                            popContainer: document.querySelector('.header-button-area')

                        })}
                    </div>
                </NCDiv>
                {/* 查询区 */}
                <div className="nc-bill-search-area">
                    {NCCreateSearch(searchId, {
                        clickSearchBtn: this.onClickSearchBtn.bind(this),
                        oid: this.config.oid
                    })}
                </div>
                {/* 列表区 */}
                <div className="nc-bill-table-area">
                    {createSimpleTable(gridId, {
                        dataSource: dataSource,
                        handlePageInfoChange: this.pageInfoClick.bind(this),
                        onRowDoubleClick: this.doubleClick.bind(this),
                        onSelected: this.onSelected.bind(this),
                        onSelectedAll: this.onSelectedAll.bind(this),
                        showIndex: true,
                        showCheck: true
                    })}
                </div>

                <PrintOutput
                    ref='printOutput'
                    url={ajaxurl['listPrint']}
                    data={{
                        funcode: this.config.appcode,
                        nodekey: 'psnbankacclist',  //模板节点标识
                        oids: this.state.printpks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        outputType: "output"
                    }}
                    //callback={this.onSubmit}
                >
                </PrintOutput>
                <ExcelImport
                    {...Object.assign(this.props)}
                    moduleName = 'uapbd'//模块名
                    billType = {this.config.billType}//单据类型
                    selectedPKS = {[]}
                    appcode={this.config.appcode}
                    pagecode={'10140PSNBA_card'}
                />
            </div>
        )
    }
}

PsnbankaccSimpleTable = createPage({})(PsnbankaccSimpleTable);
export default PsnbankaccSimpleTable
//ReactDOM.render(<PsnbankaccSimpleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65