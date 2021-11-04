//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, createPageIcon, ajax, base, toast, high, print, promptBox, cardCache } from 'nc-lightapp-front';
import './index.less';
import createUIDom from '../../../public/utils/BDCreateUIDom';
const { NCAffix, NCPopconfirm, NCFormContro, NCSelect, NCCheckbox, NCFormControl, NCButton, NCBackBtn, NCDiv } = base;
const { PrintOutput } = high;
let nullValue = { display: null, value: null };
let dataSource = 'upabd.psninfo.psnbankacc.data';
let checkValue = '';//列表页面显示停用勾选情况
const { setDefData, getDefData, addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;
class PsnbankaccCard extends Component {
    constructor(props) {
        super(props);

        this.formId = 'psnbankacc';              //表头id
        this.accinfo = "accinfo";
        this.netbankinfo = "netbankinfo";
        this.tableId = 'bankaccsub';              //表格id
        this.pagecode = '10140PSNBA_card';         //pagecode
        this.appId = '10140PSNBA';                //按钮注册id
        this.bankaccbasTs = '';
        this.tableIds = ['psnbankacc', 'bankaccsub']
        this.carddata = {};                      //用于数据快速重置
        this.ajaxurl = {
            add: '/nccloud/uapbd/psnbankacc/PsnbankaccAddAction.do',
            save: '/nccloud/uapbd/psnbankacc/PsnbankaccSaveAction.do',
            delete: '/nccloud/uapbd/psnbankacc/PsnbankaccDelAction.do',
            enable: '/nccloud/uapbd/psnbankacc/PsnbankaccEnableAction.do',
            disable: '/nccloud/uapbd/psnbankacc/PsnbankaccDisableAction.do',
            queryCardUrl: '/nccloud/uapbd/psnbankacc/PsnbankaccQueryBypkAction.do',
            afterEvnUrl: '/nccloud/uapbd/psnbankacc/PsnBankaccEditor.do',
            isEditPermissionUrl: '/nccloud/uapbd/psnbankacc/IsEditPermissionAction.do',
            cardPrint: '/nccloud/uapbd/psnbankacc/PsnbankaccCardPrintAction.do'
        }
        this.linkurl = {
            index: '/uapbd/psninfo/psnbankacc/main/index.html'
        }

        let status = this.props.getUrlParam('status');
        let pk = this.props.getUrlParam('id');
        let isCopy = this.props.getUrlParam('isCopy');
        checkValue = this.props.getUrlParam('checkValue');

        this.state = {
            pagesate: status,
            pk_psnbankacc: pk,
            cardtableindex: -1, //子表当前选中行
            pk_org: '',
            title_code: '',
            totalcount: 0,
            applycount: 0,
            context: {
                pk_org: '',
                pk_org_v: '',
                org_Name: '',
                org_v_Name: '',
                mdid: '',
                PermissionOrgIDs: []
            },
            json: {},
            inlt: null,
            noaddcancel: true,    // 非新增点击取消
        }


        createUIDom(props)(
            { pagecode: this.pagecode },
            {
                moduleId: "10140PSNBA", domainName: 'uapbd'
            },
            (data, langData, inlt) => {
                if (langData) {
                    this.state.json = langData;
                    if (inlt) {
                        this.state.inlt = inlt
                    }
                }
                if (data) {
                    let context = data.context;
                    this.state.context = Object.assign(this.state.context, context);
                    this.setState(this.state, () => {
                        if (data.template) {
                            this.modifierMeta(props, data.template);
                            props.meta.setMeta(data.template);
                            data.button && props.button.setButtons(data.button);
                            // 设置启用按钮组不可见，已改为单个按钮
                            props.button.setButtonVisible(['Enable', 'Disable'], false);
                            if ('Y' === isCopy) {
                                this.getdata(() => { this.onCopy() });
                            } else if ('add' === status) {
                                this.onAdd();
                            } else {
                                this.getdata();
                            }
                        }
                    })

                }
            }
        )

    }

    modifierMeta = (props, meta) => {
        //控制显示区域顺序
        // if(meta['formrelation'] && meta['formrelation']['psnbankacc']){
        //     let arr = meta['formrelation']['psnbankacc'];
        //     if(arr && arr.length==2 && arr[0]==='netbankinfo' && arr[1]==='accinfo'){
        //         meta['formrelation']['psnbankacc'] = ["accinfo", "netbankinfo"];
        //     }
        // }
        meta[this.formId].items.map((item) => {
            if (item['attrcode'] === 'pk_psndoc') {//人员编码
                item['refcode'] = 'uapbd/refer/psninfo/PsndocTreeGridRef/index.js';
                item.isShowDimission=true;
                item['queryCondition'] = () => { return { pk_org: 'nopk1234567890123456' } };
            } else if (item['attrcode'] === 'pk_org') {//所属业务单元
                item['refcode'] = 'uapbd/refer/org/BusinessUnitTreeRef/index.js';
                item['queryCondition'] = () => {//主组织权限
                    return {
                        // "AppCode": this.appId,
                        "AppCode":props.getAppCode(),
                        'TreeRefActionExt': 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    };
                }
            }
        });
        meta['accinfo'].items.map((item) => {
            if (item['attrcode'] === 'pk_bankdoc') {//开户银行
                item['refcode'] = 'uapbd/refer/bankacc/BankDocDefaultGridTreeRef/index.js';
            } else if (item['attrcode'] === 'pk_banktype') {//银行类别
                item['refcode'] = 'uapbd/refer/bankacc/BanktypeDefaultGridRef/index.js';
                item['queryCondition'] = () => {
                    return {
                        'GridRefActionExt': 'nccloud.web.uapbd.psnbankacc.BanktypeGridRefExt'
                    }
                }
            }
        });
        meta['netbankinfo'].items.map((item) => {
            if (item['attrcode'] === 'pk_netbankinftp') {//网银接口类别
                item['refcode'] = 'uapbd/refer/sminfo/NetbankTemplateDefaultGridRef/index.js';
            } else if (item['attrcode'] === 'areacode') {//地区代码
                item['refName'] = this.state.json['10140PSNBA-000000'];/* 国际化处理： 地区代码*/
                item['placeholder'] = this.state.json['10140PSNBA-000000'];/* 国际化处理： 地区代码*/
                item['onlyLeafCanSelect'] = true;//设置只可选择末级
                item['rootNode'] = { refname: this.state.json['10140PSNBA-000000'], refpk: 'root' };/* 国际化处理： 地区代码*/
                item['refcode'] = 'uapbd/refer/userdef/DefdocTreeRef/index.js';
                item['queryCondition'] = () => {
                    return {
                        pk_defdoclist: '1001ZZ10000000009031'
                    };
                };
            }
        });
        return meta;
    }

    componentDidMount() {
        this.toggleShow();
    }
    componentDidUpdate() {
        if (this.state.pagesate === 'browse') {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    //页面清空
    clearPage() {
        this.props.form.EmptyAllFormValue(this.formId);
        this.props.cardTable.setTableData(this.tableId, { rows: [] });
    }

    getdata = (callback) => {
        if (this.state.pk_psnbankacc == undefined) {
            return;
        }
        let data = {
            pk_psnbankacc: this.state.pk_psnbankacc,
            pagesate: this.state.pagesate
        };
        ajax({
            url: this.ajaxurl['queryCardUrl'],
            data: data,
            success: (res) => {
                let { success, data, formulamsg } = res;
                if (success) {
                    this.carddata = data;
                    this.clearPage();
                    if (formulamsg && formulamsg instanceof Array && formulamsg.length > 0) {
                        props.dealFormulamsg(
                            res.formulamsg,  //参数一：返回的公式对象
                            {                //参数二：界面使用的表格类型
                                "psnbankacc": "form",
                                // "accinfo":"",
                                // "netbankinfo":"",
                                "bankaccsub": "cardTable"
                            }
                        );
                    }

                    if (data && data['form']) {
                        //个人银行信息
                        let formdata = data['form'][this.formId];
                        //账户基本信息 
                        let bankaccbasdata = data['form1']['accinfo'];
                        this.bankaccbasTs = bankaccbasdata.rows[0].values.ts['value'];
                        //网银信息
                        let netBankAccdata = data['form2']['netbankinfo'];
                        //部分字段赋值
                        this.partialFieldAssignment(data, formdata, bankaccbasdata, netBankAccdata);
                        //合并formdata
                        this.objectAssign(bankaccbasdata, formdata);
                        this.props.form.setAllFormValue({ [this.formId]: bankaccbasdata });

                        // 判断启用状态，未启用=1,已启用=2,已停用=3
                        if (bankaccbasdata.rows[0].values.enablestate.value === '2') {
                            this.props.button.setButtonVisible('Cardenable', false);
                            this.props.button.setButtonVisible('Carddisable', true);
                        } else {
                            this.props.button.setButtonVisible('Cardenable', true);
                            this.props.button.setButtonVisible('Carddisable', false);
                        }

                        //子户表格赋值
                        if (data['grid']) {
                            this.props.cardTable.setTableData(this.tableId, data['grid'][this.tableId]);
                        }
                        this.props.form.setFormItemsDisabled(this.formId, { 'pk_psndoc.id': true });
                        if (this.state.pagesate === 'edit') {
                            this.modifyReferCond([{ key: 'pk_psndoc', value: formdata.rows[0].values.pk_org['value'] }]);
                            this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
                            if (bankaccbasdata.rows[0].values.enablestate['value'] != '1') {
                                this.props.form.setFormItemsDisabled(this.formId, { 'pk_psndoc': true });
                                this.props.form.setFormItemsDisabled(this.formId, { 'accnum': true });
                            }
                        }
                    }

                    this.toggleShow();
                    callback && callback();
                }
            }
        });
    }

    //部分字段赋值
    partialFieldAssignment(data, formdata, bankaccbasdata, netBankAccdata) {
        //身份类别赋值
        if (data['idtype']) {
            formdata.rows[0].values['pk_psndoc.idtype'] = data['idtype'];
        }
        //网银接口类别赋值
        bankaccbasdata.rows[0].values['pk_netbankinftp'] = netBankAccdata.rows[0].values['pk_netbankinftp'];
        //地区代码赋值
        bankaccbasdata.rows[0].values['areacode'] = netBankAccdata.rows[0].values['areacode'];
    }

    //合并formdata
    objectAssign(bankaccbasdata, formdata) {
        let data = Object.assign(bankaccbasdata.rows[0].values, formdata.rows[0].values);
        bankaccbasdata.rows[0].values = data;
    }

    //修改界面参照的过滤条件，一般初始化或者编辑后时间需用到 mapNum [{key:'aaa',value:'bbb'}]
    modifyReferCond(mapNum) {
        if (!mapNum || mapNum.length == 0) return;
        let meta = this.props.meta.getMeta();
        mapNum.map((item) => {
            switch (item['key']) {
                case 'pk_psndoc'://人员编码
                    meta[this.formId].items != null && (meta[this.formId].items.find((obj) => obj.attrcode == 'pk_psndoc')['queryCondition'] = () => {
                        return {
                            'pk_org': item['value'] ? item['value'] : 'nopk1234567890123456'
                        }
                    });
                    break;
                case 'pk_bankdoc'://开户银行
                    meta[this.accinfo].items != null && (meta[this.accinfo].items.map((obj) => {
                        obj.attrcode === 'pk_bankdoc' &&
                            (obj['queryCondition'] = () => {
                                return {
                                    'pk_banktype': item['value'],
                                    'pk_org': this.props.form.getFormItemsValue(this.formId, 'pk_org').value,
                                    'TreeRefActionExt': 'nccloud.web.uapbd.psnbankacc.BankaccDefaultTreeRefExt'
                                }
                            })
                    }));
                    break;
                case 'pk_netbankinftp'://网银接口
                    meta[this.netbankinfo].items != null && (meta[this.netbankinfo].items.map((obj) => {
                        obj.attrcode === 'pk_netbankinftp' &&
                            (obj['queryCondition'] = () => {
                                return {
                                    'pk_banktype': item['value'],
                                    'TreeRefActionExt': 'nccloud.web.uapbd.psnbankacc.NetbankTemplateDefaultGridReffExt'
                                }
                            })
                    }));
                    break;
                default:
                    break;
            }
        });
        this.props.meta.setMeta(meta);
    }

    //切换页面状态
    toggleShow = () => {
        //按钮的显示状态
        if (this.state.pagesate == 'add') {
            this.props.button.setButtonVisible(['Add', 'Edit', 'Delete', 'Copy', 'Cardenable', 'Carddisable', 'Print', 'Print1', 'Output', 'Refresh', 'Return', 'import', 'export'], false);
            this.props.button.setButtonVisible(['Save', 'SaveAdd', 'Cancel'], true);
            this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false, 'pk_psndoc': false, 'accnum': false });
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
            //document.getElementById('back').style.display='none';
        } else if (this.state.pagesate == 'edit') {
            this.props.button.setButtonVisible(['SaveAdd', 'Add', 'Edit', 'Delete', 'Copy', 'Cardenable', 'Carddisable', 'Print', 'Print1', 'Output', 'Refresh', 'Return', 'import', 'export'], false);
            this.props.button.setButtonVisible(['Save', 'Cancel'], true);
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
            //document.getElementById('back').style.display='none';
        } else {
            this.props.button.setButtonVisible(['Edit', 'Delete', 'Copy', 'Print', 'Print1', 'Output', 'Refresh'], this.state.noaddcancel);
            if (this.state.noaddcancel) {
                // 非新增状态点击取消-设置启用、停用按钮显隐性
                let cardenable = this.props.form.getFormItemsValue(this.formId, 'enablestate') && this.props.form.getFormItemsValue(this.formId, 'enablestate').value;    // 启用状态
                // 判断启用状态，未启用=1,已启用=2,已停用=3
                if (cardenable === '2') {
                    this.props.button.setButtonVisible('Cardenable', false);
                    this.props.button.setButtonVisible('Carddisable', true);
                } else {
                    this.props.button.setButtonVisible('Cardenable', true);
                    this.props.button.setButtonVisible('Carddisable', false);
                }
            }
            this.props.button.setButtonVisible(['Add', 'import', 'export'], true);
            this.props.button.setButtonVisible(['Save', 'SaveAdd', 'Cancel', 'Return'], false);
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', this.state.noaddcancel);
            //document.getElementById('back').style.display='';
        }
        this.props.form.setFormStatus(this.formId, this.state.pagesate);
        this.props.cardTable.setStatus(this.tableId, this.state.pagesate);
    }

    onButtonClick = (props, id) => {
        switch (id) {
            case 'Refresh'://刷新
                this.getdata(() => { toast({ content: this.state.json['10140PSNBA-000001'], color: 'success' }); });/* 国际化处理： 刷新成功*/
                break;
            case 'Add'://新增
                this.onAdd();
                break;
            case 'Edit'://编辑 isEditPermissionUrl
                this.onEdit();
                break;
            case 'Delete'://删除
                this.onDelete();
                break;
            case 'Copy'://复制
                this.onCopy();
                break;
            case 'Cardenable'://启用
                this.onEnable();
                break;
            case 'Carddisable'://停用
                this.onDisable();
                break;
            case 'Print'://打印
                this.print();
                break;
            case 'Output'://输出
                this.output();
                break;
            case 'Save'://保存
                this.onSave(() => { toast({ color: 'success', content: this.state.json['10140PSNBA-000002'] }); });/* 国际化处理： 保存成功！*/
                break;
            case 'SaveAdd'://保存新增
                this.onSave(() => {
                    toast({ color: 'success', content: this.state.json['10140PSNBA-000003'] });/* 国际化处理： 保存新增成功！*/
                    this.onAdd();
                });
                break;
            case 'Cancel':
                this.onCancel();
                break;
            case 'back': //返回列表
                props.pushTo('list', { pagecode: '10140PSNBA_list', checkValue: checkValue });
                break;
            case 'Addline'://增行
                this.addLine();
                break;
            case 'Delline'://删行
                this.delLine();
                break;
            default:
                break;
        }
    }

    //新增
    onAdd() {
        this.setState(
            { pagesate: 'add' },
            () => {
                ajax({
                    url: this.ajaxurl['add'],
                    data: {},
                    success: (res) => {
                        let { data, success } = res;
                        if (success) {
                            this.clearPage();
                            if (data && data['form']) {
                                //账户基本信息与网银信息赋值
                                let bankaccbasdata = data['form1']['accinfo'];
                                this.bankaccbasTs = '';
                                //个人银行账户赋值
                                let formdata = data['form'][this.formId];
                                this.objectAssign(bankaccbasdata, formdata);
                                this.props.form.setAllFormValue({ [this.formId]: bankaccbasdata });
                                this.props.form.setFormItemsDisabled(this.formId, { 'pk_psndoc.id': true });
                                //子户表自动增一行
                                this.addLine();
                                //所属组织赋值
                                this.props.form.setFormItemsValue(this.formId, {
                                    'pk_org':
                                    {
                                        value: this.state.context.pk_org,
                                        display: this.state.context.org_Name
                                    }
                                })

                                this.toggleShow();
                            }
                        }
                    }
                });
            }
        );
    }

    //修改
    onEdit() {
        ajax({
            url: this.ajaxurl['isEditPermissionUrl'],
            data: { pks: [this.state.pk_psnbankacc] },
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    this.setState(
                        { pagesate: 'edit' },
                        () => {
                            this.toggleShow();
                        }
                    );
                }
            }
        });
    }

    //删除
    onDelete() {
        let paramData = this.getParaDat();
        promptBox({
            color: 'warning',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['10140PSNBA-000004'],/* 国际化处理： 确认删除*/
            content: this.state.json['10140PSNBA-000005'],/* 国际化处理： 是否确定要删除？*/
            beSureBtnClick: () => {
                ajax({
                    url: this.ajaxurl['delete'],
                    data: paramData,
                    success: (res) => {
                        if (res.success) {
                            //这个更新以下缓存added by liusenc 
                            let id = this.props.getUrlParam("id");

                            //根据当前id,获取下个id
                            /*
                            * id：数据主键的值
                            * dataSource: 缓存数据命名空间
                            */
                            let nextId = getNextId(id, dataSource);
                            // let nextId = this.props.cardPagination.getNextCardPaginationId({
                            //     id: id,
                            //     status: 1
                            // });

                            //调用删除缓存数据方法
                            /*
                            * idname: 数据主键的命名
                            * id：数据主键的值
                            * dataSource: 缓存数据命名空间
                            */

                            deleteCacheById('pk_psnbankacc', id, dataSource);
                            toast({ color: 'success', content: this.state.json['10140PSNBA-000006'] });/* 国际化处理： 删除成功！*/
                            this.clearPage();
                            if (nextId) {
                                this.state.pagesate = 'browse';
                                this.state.pk_psnbankacc = nextId;
                                this.setState(this.state, () => {
                                    this.getdata();
                                })
                            } else {
                                this.props.pushTo('list', { pagecode: '10140PSNBA_list', checkValue: checkValue });
                                //break;
                            }
                        }
                    }
                });
            }
        });
    }

    getParaDat() {
        return {
            pks: [this.props.form.getFormItemsValue(this.formId, 'pk_psnbankacc')['value']],
            pktss: [this.props.form.getFormItemsValue(this.formId, 'pk_psnbankacc')['value'] + '##' + this.props.form.getFormItemsValue(this.formId, 'ts')['value']]
        };
    }

    //复制
    onCopy() {
        this.setState(
            { pagesate: 'add' },
            () => {
                this.toggleShow();
                //清空主键以及ts
                this.bankaccbasTs = '';
                // 清空启用人、启用时间、停用人、停用时间、清空最后修改人、最后修改时间
                this.props.form.setFormItemsValue(this.formId,
                    {
                        'pk_psnbankacc': nullValue,
                        'ts': nullValue,
                        'pk_bankaccbas': nullValue,
                        'enableuser': nullValue,
                        'enabletime': nullValue,
                        'disableuser': nullValue,
                        'disabletime': nullValue,
                        'modifier': nullValue,
                        'modifiedtime': nullValue,
                        'enabletime': false,
                        'enablestate':{ display: this.state.json['10140PSNBA-000019'], value: '1' }
                    }
                );
                this.props.cardTable.setColValue(this.tableId, 'pk_bankaccsub', nullValue);
                this.props.cardTable.setColValue(this.tableId, 'ts', nullValue);
                this.props.cardTable.setColValue(this.tableId, 'pk_bankaccbas', nullValue);
                //修改子表状态字段为新增
                let count = this.props.cardTable.getNumberOfRows(this.tableId);
                let arr = [];
                for (let i = 0; i < count; i++) {
                    arr[i] = { index: i, status: '2' };
                }
                this.props.cardTable.setRowStatusByIndexs(this.tableId, arr);
            }
        );
    }

    //保存
    onSave(callback) {
        if (!this.props.form.isCheckNow(this.formId)) return;
        //if(!this.props.cardTable.checkTableRequired(this.tableId))return;

        let data = this.props.form.getAllFormValue(this.formId);
        let cardData = this.props.cardTable.getAllData(this.tableId);
        let dataParam = {
            formData: {
                'pageid': this.pagecode,
                'model': {
                    'areacode': this.formId,
                    'rows': data.rows
                }
            },
            formData1: {
                'pageid': this.pagecode,
                'model': {
                    'rows': data.rows
                }
            },
            cardmodel: {
                'pageinfo': null,
                'rows': cardData.rows
            },
            exdata: {
                bankaccbasTs: this.bankaccbasTs,
                pagecode: this.pagecode
            }

        };
        let supplierBaseInfo = this.props.form.getAllFormValue(this.accinfo)
        supplierBaseInfo["areacode"] = this.accinfo
        let CardData = this.props.createMasterChildData(this.pagecode, this.formId, 'bankaccsub');
        var validateParams = {
            'model': supplierBaseInfo,
            "pageid": this.pagecode
        }

        //在这里加一下判断当前是新增态还是修改态；
        let isAdd = (this.state.pagesate === 'add');//此时为新增态，其他未浏览态，主要是下面用来更新缓存使用
        //---------copy
        this.props.validateToSave(validateParams, () => {
            this.props.validateToSave(CardData, () => {
                ajax({
                    url: this.ajaxurl['save'],
                    data: dataParam,
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            if (isAdd) {//新增一下缓存数据；
                                addCache(data['pk_psnbankacc'], data, this.formId, dataSource);
                            } else {//说明这个是更新数据的；
                                updateCache('pk_psnbankacc', data['pk_psnbankacc'], data, this.formId, dataSource);
                            }
                            this.setState(
                                {
                                    pagesate: 'browse',
                                    pk_psnbankacc: data['pk_psnbankacc']
                                },
                                () => {
                                    this.getdata(callback);
                                }
                            );
                        }
                    }
                })

            }, { 'bankaccsub': 'cardTable', }, 'card')

        }, { 'accinfo': 'form' }, 'form')
        //---------copy end

    }

    //还原到初始始查询数据
    restData() {
        let data = this.carddata;
        if (data && data['form']) {
            //账户基本信息与网银信息赋值
            let bankaccbasdata = data['form1']['accinfo'];
            this.bankaccbasTs = bankaccbasdata.rows[0].values.ts['value'];
            //个人银行账户赋值
            let formdata = data['form'][this.formId];
            //网银信息
            let netBankAccdata = data['form2']['netbankinfo'];
            //部分字段赋值
            this.partialFieldAssignment(data, formdata, bankaccbasdata, netBankAccdata);
            //合并formdata
            this.objectAssign(bankaccbasdata, formdata);
            this.props.form.setAllFormValue({ [this.formId]: bankaccbasdata });

            //子户表格赋值
            if (data['grid']) {
                this.props.cardTable.setTableData(this.tableId, data['grid'][this.tableId]);
            }
        }
        this.toggleShow();
    }

    //启用
    onEnable() {
        let paramData = this.getParaDat();
        promptBox({
            color: 'warning',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['10140PSNBA-000007'],/* 国际化处理： 确认启用*/
            content: this.state.json['10140PSNBA-000008'],/* 国际化处理： 是否确定要启用？*/
            beSureBtnClick: () => {
                ajax({
                    url: this.ajaxurl['enable'],
                    data: paramData,
                    success: (res) => {
                        if (res.success) {
                            toast({ color: 'success', title: this.state.json['10140PSNBA-000009'] });/* 国际化处理： 启用成功！*/
                            this.getdata();
                        }
                    }
                });
            }
        });
    }

    //停用
    onDisable() {
        let paramData = this.getParaDat();
        promptBox({
            color: 'warning',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['10140PSNBA-000010'],/* 国际化处理： 确认停用*/
            content: this.state.json['10140PSNBA-000011'],/* 国际化处理： 是否确定要停用？*/
            beSureBtnClick: () => {
                ajax({
                    url: this.ajaxurl['disable'],
                    data: paramData,
                    success: (res) => {
                        if (res.success) {
                            toast({ color: 'success', title: this.state.json['10140PSNBA-000012'] });/* 国际化处理： 停用成功！*/
                            this.getdata();
                        }
                    }
                });
            }
        });
    }

    //打印
    print() {
        let pks = [this.state.pk_psnbankacc];
        let param = {
            funcode: this.appId,
            nodekey: 'psnbankacccard',  //模板节点标识
            oids: pks
        };
        print(
            'pdf',
            this.ajaxurl['cardPrint'],
            param
        );
    }

    //输出
    output() {
        let pks = [this.state.pk_psnbankacc];
        this.setState({
            printpks: pks
        }, () => {
            this.refs.printOutput.open();
        });
    }

    //返回
    onCancel() {
        promptBox({
            color: 'warning',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['10140PSNBA-000013'],/* 国际化处理： 确认取消*/
            content: this.state.json['10140PSNBA-000014'],/* 国际化处理： 是否确定要取消？*/
            beSureBtnClick: () => {
                this.props.cardTable.filterEmptyRows(this.tableId, []);
                this.props.cardTable.resetTableData(this.tableId, () => {
                    this.props.form.setFormStatus(this.formId, 'browse');
                    if (this.state.pagesate === 'add') {
                        if (this.state.pk_psnbankacc) {
                            this.getdata();
                            this.setState({ noaddcancel: true });    // 非新增点击取消
                        } else {
                            this.clearPage();
                            this.setState({ noaddcancel: false });    // 新增点击取消
                            //this.props.button.setButtonVisible('Edit', false);
                        }

                    }
                    this.setState(
                        { pagesate: 'browse' },
                        () => {
                            this.restData();
                        }
                    );
                })

            }
        });
    }

    pageInfoClick = (props, pk) => {
        console.log("just for debug: " + pk);
        this.getDataForCache(pk)
    }

    getDataForCache(pk) {
        if (!pk) {
            // this.props.form.EmptyAllFormValue(this.formId)
            // this.props.cardTable.setTableData(this.tableId, {rows: []})
            this.props.pushTo('/list', { pagecode: '10140PSNBA_list', checkValue: checkValue });

            return
        }
        let data = getCacheById(pk, dataSource);
        if (data && data['form']) {
            //账户基本信息与网银信息赋值
            let bankaccbasdata = data['form1']['accinfo'];
            this.bankaccbasTs = bankaccbasdata.rows[0].values.ts['value'];
            //个人银行账户赋值
            let formdata = data['form'][this.formId];
            //网银信息
            let netBankAccdata = data['form2']['netbankinfo'];
            //部分字段赋值
            this.partialFieldAssignment(data, formdata, bankaccbasdata, netBankAccdata);
            //合并formdata
            this.objectAssign(bankaccbasdata, formdata);
            this.props.form.setAllFormValue({ [this.formId]: bankaccbasdata });

            if (bankaccbasdata.rows[0].values.enablestate.value === '2') {
                this.props.button.setButtonVisible('Cardenable', false);
                this.props.button.setButtonVisible('Carddisable', true);
            } else {
                this.props.button.setButtonVisible('Cardenable', true);
                this.props.button.setButtonVisible('Carddisable', false);
            }
            //子户表格赋值
            if (data['grid']) {
                this.props.cardTable.setTableData(this.tableId, data['grid'][this.tableId]);
            }

            if (this.state.pagesate === 'edit') {
                this.modifyReferCond([{ key: 'pk_psndoc', value: formdata.rows[0].values.pk_org['value'] }]);
                this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
                if (bankaccbasdata.rows[0].values.enablestate['value'] != '1') {
                    this.props.form.setFormItemsDisabled(this.formId, { 'pk_psndoc': true });
                    this.props.form.setFormItemsDisabled(this.formId, { 'accnum': true });
                }
            }

            this.props.setUrlParam(pk)//动态修改地址栏中的id的值
        }
        else {
            this.state.pk_psnbankacc = pk;
            this.state.pagesate = 'browse';
            this.setState(this.state, () => {
                this.getdata(() => {
                    updateCache('pk_psnbackacc', pk, this.carddata, this.formId, dataSource)
                    this.props.setUrlParam(pk)//动态修改地址栏中的id的值
                });

            })


        }

    }

    //from编辑前事件
    onBeforeEvent(props, moduleId, key, value, data) {
        let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org');
        let pk_banktype = props.form.getFormItemsValue(this.accinfo, 'pk_banktype');
        switch (key) {
            case 'pk_psndoc':
                this.modifyReferCond([{ key: 'pk_psndoc', value: pk_org ? pk_org.value : '' }]);
                break;
            case 'pk_bankdoc'://开户银行   pk_banktype  ttname
                this.modifyReferCond([{ key: 'pk_bankdoc', value: pk_banktype ? pk_banktype.value : '' }]);
                break;
            case 'pk_netbankinftp'://网银接口  pk_banktype
                this.modifyReferCond([{ key: 'pk_netbankinftp', value: pk_banktype ? pk_banktype.value : '' }]);
                break;
            default:
                break;
        }

        return true;
    }

    //from编辑后事件
    onAfterEvent = (props, moduleId, key, value, changedrows, i, s, g) => {
        let dataParam = {};
        switch (key) {
            case 'pk_org':
                dataParam = { 'pk_psndoc': nullValue, 'pk_psndoc.name': nullValue, 'pk_psndoc.id': nullValue, 'pk_psndoc.idtype': nullValue };
                ajax({
                    url: this.ajaxurl['afterEvnUrl'],
                    data: {
                        key: 'pk_org',
                        value: value['value']
                    },
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            if (data['currtype']) {
                                if (this.props.cardTable.getNumberOfRows(this.tableId) > 0) {
                                    this.props.cardTable.setValByKeyAndIndex(this.tableId, 0, 'pk_currtype', data['currtype']);
                                }
                            }
                        }
                    }
                });
                break;
            case 'pk_psndoc':
                if (value['value'] && value['values']) {
                    dataParam = {
                        'pk_psndoc.name': i.values['psndocname'],
                        'pk_psndoc.id': i.values['id'].value ? { display: i.values['id'].value } : nullValue,
                        'pk_psndoc.idtype': i.values['idtypename'].value ? { display: i.values['idtypename'].value, value: i.values['idtype'].value } : nullValue
                    };
                } else {
                    dataParam = {
                        'pk_psndoc.name': nullValue,
                        'pk_psndoc.id': nullValue,
                        'pk_psndoc.idtype': nullValue
                    };
                }
                break;
            case 'pk_bankdoc'://开户银行   pk_banktype  ttname
                if (value['value'] && value['values']) {
                    dataParam = { 'pk_banktype': i.values['pk_banktype'].value ? { display: i.values['ttname'].value, value: i.values['pk_banktype'].value } : nullValue };
                    this.props.form.setFormItemsDisabled(this.formId, { 'pk_banktype': true });
                    ajax({
                        url: this.ajaxurl['afterEvnUrl'],
                        data: {
                            key: 'pk_bankdoc',
                            value: value['value']
                        },
                        success: (res) => {
                            let { success, data } = res;
                            if (success) {
                                if (data['pk_bankdoc']) {
                                    this.props.form.setFormItemsValue(this.formId, data['pk_bankdoc']);
                                }
                            }
                        }
                    });
                } else {
                    dataParam = {
                        'pk_banktype': nullValue,
                        'areacode': nullValue,
                        'orgnumber': nullValue,
                        'combineaccnum': nullValue,
                        'bankarea': nullValue,
                        'province': nullValue,
                        'city': nullValue,
                        'customernumber': nullValue,
                        'issigned': nullValue
                    };
                    this.props.form.setFormItemsDisabled(this.formId, { 'pk_banktype': false });
                }
                break;
            case 'pk_banktype'://银行类别   pk_banktype
                dataParam = { 'pk_bankdoc': nullValue };
                break;
            default:
                break;
        }
        this.props.form.setFormItemsValue(this.formId, dataParam);
    }

    //增加行
    addLine() {
        //根据id获取表格中所有(可见)的行的数量
        let count = this.props.cardTable.getNumberOfRows(this.tableId);
        this.props.cardTable.addRow(this.tableId, count, {
            'pk_currtype': { diaplay: '' }
        }, false)
        this.setState({ cardtableindex: count });
        this.props.cardTable.focusRowByIndex(this.tableId, count);
    }

    //删除行
    delLine() {
        let cardtableindex = this.state.cardtableindex;
        if (cardtableindex != -1) {
            this.props.cardTable.delRowsByIndex(this.tableId, cardtableindex);
            let count = this.props.cardTable.getNumberOfRows(this.tableId);
            if (count > cardtableindex) {
                this.props.cardTable.focusRowByIndex(this.tableId, cardtableindex);
            } else {
                this.setState({ cardtableindex: cardtableindex - 1 });
                if (count != 0) {
                    this.props.cardTable.focusRowByIndex(this.tableId, cardtableindex - 1);
                }
            }
        }
    }

    //选中行事件  props, moduleId(区域id), record（行数据）, index（当前index）
    onRowClick(props, moduleId, record, index) {
        this.setState({ cardtableindex: index });
    }

    //获取列表肩部信息
    getTableHead = () => {
        let { button } = this.props;
        let { createButtonApp } = button;
        let status = this.state.pagesate;
        if (status && (status === 'add' || status === 'edit')) {
            return (
                <div className="shoulder-definition-area">
                    <div className="definition-icons">
                        {createButtonApp({
                            area: 'pageCard',//按钮注册中的按钮区域
                            onButtonClick: this.onButtonClick.bind(this)
                        })}
                        {this.props.cardTable.createBrowseIcons(this.tableId, {
                            iconArr: ['close', 'open', 'max', 'setCol'],
                            maxDestAreaId: 'nc-bill-card'
                        })}
                    </div>
                </div>
            )
        } else {
            return '';
        }
    }

    render() {
        let { form, button, modal, cardTable, cardPagination, BillHeadInfo } = this.props;
        let { createButtonApp } = button;
        const { createCardPagination } = cardPagination;
        const { createBillHeadInfo } = BillHeadInfo;
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createModal } = modal;
        return (
            <div id='nc-bill-extCard' className="nc-bill-extCard">
                <div className='nc-bill-top-area'>
                    <NCAffix>
                        <NCDiv className='nc-bill-header-area' areaCode={NCDiv.config.HEADER}>
                            <div className='title'>
                                {createBillHeadInfo(
                                    {
                                        //title-search-detail
                                        title: this.state.json['10140PSNBA-000015'] /*个人银行账户 */,
                                        backBtnClick: this.onButtonClick.bind(this, this.props, 'back'),
                                        initShowBackBtn: this.state.pagesate == 'browse'
                                    }
                                )}
                            </div>

                            <div className="header-button-area">
                                {createButtonApp({
                                    area: 'card-area',//按钮注册中的按钮区域
                                    onButtonClick: this.onButtonClick.bind(this),
                                    popContainer: document.querySelector('.card-area')
                                })}
                                {/* 20180719 卡片分页组件报错 */}
                                <div className='header-cardPagination-area' style={{ float: 'right' }}>
                                    {createCardPagination({
                                        dataSource: dataSource,
                                        handlePageInfoChange: this.pageInfoClick.bind(this)
                                    })}
                                </div>
                            </div>
                        </NCDiv>
                    </NCAffix>
                    <div className="nc-bill-form-area">
                        {createForm(this.formId, {
                            expandArr: [this.accinfo],
                            onAfterEvent: this.onAfterEvent.bind(this),
                            onBeforeEvent: this.onBeforeEvent.bind(this)
                        })}
                    </div>
                </div>

                <div className="nc-bill-bottom-area">
                    <div className="nc-bill-table-area">
                        {createCardTable(this.tableId, {
                            tableHead: this.getTableHead.bind(this),
                            onRowClick: this.onRowClick.bind(this),
                            showIndex: true
                        })}
                    </div>
                </div>


                {createModal('edit', {})}
                {createModal('delete', {})}
                {createModal('modal', {})}

                <PrintOutput
                    ref='printOutput'
                    url={this.ajaxurl['cardPrint']}
                    data={{
                        funcode: this.appId,
                        nodekey: 'psnbankacccard',  //模板节点标识
                        oids: this.state.printpks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        outputType: "output"
                    }}
                //callback={this.onSubmit}
                >
                </PrintOutput>

            </div>

        );
    }
}

PsnbankaccCard = createPage({
    initTemplate: function () { },
    billinfo: {
        billtype: 'card',
        pagecode: '10140PSNBA_card',
        headcode: 'psnbankacc',
        bodycode: 'bankaccsub'
    }

})(PsnbankaccCard);
export default PsnbankaccCard

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65