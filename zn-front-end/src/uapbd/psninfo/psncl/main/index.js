//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { base, ajax, toast, cacheTools, print, output, getBusinessInfo, createPageIcon, excelImportconfig, high } from 'nc-lightapp-front';
import Utils from '../../../public/utils';
import manageModeutils from '../../../public/utils/ManageModeUtils';
import confirmUtil from '../../../public/pubComponent/confirmUtil/confirmUtil';
const { NCCheckbox, NCDiv, EmptyAreaTip } = base;
const { ExcelImport } = high;
const { convertGridEnablestateToSave, convertGridEnablestateToShow } = Utils;
let formId = 'head';
let treeId = 'psnclTree';
let ajaxurl = {
    loadPsncl: '/nccloud/uapbd/psncl/loadPsnclTree.do',
    query4form: '/nccloud/uapbd/psncl/queryPsncl4Form.do',
    savePsncl: '/nccloud/uapbd/psncl/savePsncl.do',
    addPsncl: '/nccloud/uapbd/psncl/addPsncl.do',
    delPsncl: '/nccloud/uapbd/psncl/delPsncl.do',
    enablePsncl: '/nccloud/uapbd/psncl/enablePsncl.do',
    disablePsncl: '/nccloud/uapbd/psncl/disablePsncl.do',
    printUrl: '/nccloud/uapbd/psncl/print.do'
};

/**
 * author zhenmx
 *
 */
class PsnclCardTable extends Component {

    constructor(props) {
        super(props);
        this.root = {//为人员类别树创建一个根节点
            "isleaf": false,
            "key": "ROOT",
            "id": "ROOT",
            "innercode": "ROOT",
            "pid": "",
            "refpk": "ROOT"
        };
        this.state = {
            cardEmpty: true,
            loadLang: false,
            checked: false,
            currentNODE: {},
            showNCCheck: true,
            disabledSearch: false,
            context: {},
            json: {},
            x: ''
        };
        this.config = props.config;
        this.config.appcode = props.getSearchParam('c');
        this.config.pagecode = props.getSearchParam('p');
        this.onInit = this.onInit.bind(this);
        this.dealTreeData = this.dealTreeData.bind(this);
        this.updateButtonStatus = this.updateButtonStatus.bind(this);

        let tempParam = {
            pagecode: props.config.pagecode
        }, langParam = {
            moduleId: "10140PSNCL_NCC", domainName: 'uapbd'
        }
        this.loadTempAndLang(props, tempParam, langParam, (tempdata, mutiJson, inlt) => {
            this.resetStateAfterLoadLang(mutiJson, inlt, tempdata, (data) => {
                let me = this;
                if (data) {
                    let meta = data.template;
                    if (data.button) {
                        let excelimportconfig = excelImportconfig(props, 'uapbd', this.config.billType, true, '', { 'appcode': this.config.appcode, 'pagecode': this.config.pagecode }, () => {
                            this.onInit();
                        });
                        props.button.setUploadConfig("Import", excelimportconfig);
                        props.button.setButtons(data.button);
                    }
                    props.meta.setMeta(meta, () => {
                        //初始设定表单为浏览态
                        me.props.form.setFormStatus(formId, 'browse');
                        me.props.button.setButtonDisabled(['btnPrint', 'output'], true);
                        //初始化设置停启用开过不可用
                        me.props.form.setFormItemsDisabled(formId, { 'enablestate': true });
                        me.updateButtonStatus(props);
                        this.onInit();
                    });
                }
            })
        })
    }
    loadTempAndLang = (props, tempParam, langParam, callback) => {
        let temp, lang, inlt;
        props.createUIDom(tempParam, (data) => {
            temp = data;
            if (!!lang) {
                callback && callback(temp, lang, inlt);
            }
        });
        let langCallback = (multiJson, json, inlt) => {
            lang = multiJson;
            inlt = inlt;
            if (!!temp) {
                callback && callback(temp, lang, inlt);
            }
        }
        props.MultiInit.getMultiLang(Object.assign(langParam, { callback: langCallback }));
    }
    resetStateAfterLoadLang = (mutiJson, inlt, tempdata, callback) => {
        this.state.context = tempdata.context;
        this.state.json = mutiJson;
        this.state.x = inlt;
        this.state.loadLang = true;
        this.setState(this.state, callback.call(this, tempdata))
    }

    componentDidMount() { //界面渲染后开始调用init方法

    }

    componentDidUpdate() {
        let formStatus = this.props.form.getFormStatus(formId);
        if (formStatus == 'browse') {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    onInit(callback) { //初始化界面(在页面渲染后)
        let requestParam = {
            checked: cacheTools.get('checkedVal') === true ? true : false,
            NODE_TYPE: this.config.NODE_TYPE
        };
        ajax({
            url: '/nccloud/uapbd/psncl/loadPsnclTree.do',
            data: requestParam,
            success: (result) => {
                if (result.success) {
                    let allpks = [];
                    if (result.data) {
                        result.data.map((obj) => {
                            allpks.push(obj.id);
                        })
                    }
                    if (allpks.length > 0) {
                        this.setState({ cardEmpty: false })
                    } else {
                        this.setState({ cardEmpty: true })
                    }
                    cacheTools.set('allpks', allpks);
                    this.root.title = this.state.json['10140PSNCL-000000'];
                    this.root.refname = this.state.json['10140PSNCL-000000'];
                    let data = [Object.assign(this.root, { children: result.data })];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(treeId, this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(treeId, this.root.refpk);
                    //设置默认选中root节点
                    this.props.syncTree.setNodeSelected(treeId, 'ROOT');
                    //清空表单
                    this.props.form.EmptyAllFormValue(formId);
                    this.props.form.setFormItemsDisabled(formId, { 'enablestate': true });
                    callback && callback.call(this)
                }
            }
        });
    }

    dealTreeData(data) {
        let deleteDataChildrenProp = function (node) {
            if (!node.children || node.children.length == 0) {

                delete node.children;
            }
            else {
                node.isLeaf = false;
                node.children.forEach((e) => {
                    deleteDataChildrenProp(e);
                });
            }
        };
        data.forEach((e) => {
            deleteDataChildrenProp(e);
        });
        return data;
    }

    //更新按钮状态
    updateButtonStatus(props) {
        let formstatus = props.form.getFormStatus(formId);

        //先设置隐藏
        props.button.setButtonsVisible({
            add: false,
            edit: false,
            del: false,
            more: false,
            print: false,
            //新增或者编辑态 显示保存 取消，编辑态没有保存新增，
            saveAdd: formstatus === 'add',
            save: formstatus === 'edit' || formstatus === 'add',
            cancel: formstatus === 'edit' || formstatus === 'add',
            refrensh: formstatus !== 'add' && formstatus !== 'edit',
            btnPrint: formstatus !== 'add' && formstatus !== 'edit',
            Import: formstatus !== 'add' && formstatus !== 'edit',
            Export: formstatus !== 'add' && formstatus !== 'edit',

        });
        props.form.setFormItemsDisabled(formId, { enablestate: formstatus === 'edit' || formstatus === 'add' });
        props.button.setMainButton('save', true);
        this.setState({
            disabledSearch: formstatus !== 'browse',
            showNCCheck: formstatus === 'browse'
        });
    }

    //按钮点击事件
    onButtonClick(props, id) {
        let formdata = props.form.getAllFormValue(formId);
        let newrows = convertGridEnablestateToSave(formdata.rows);
        formdata.areacode = formId;
        formdata.rows = newrows;
        let pk_psncl = formdata.rows[0].values.pk_psncl.value;
        if (!formdata) return;
        let pks = cacheTools.get('allpks');
        let oldFormData = {
            'head': formdata
        }
        switch (id) {
            case 'save':
                //校验公式
                props.form.isCheckNow(formId) && props.validateToSave({ pageid: this.config.pagecode, model: formdata }, () => {
                    ajax({
                        url: ajaxurl.savePsncl,
                        data: {
                            NODE_TYPE: this.config.NODE_TYPE,
                            pageid: this.config.pagecode,
                            head: formdata,
                            userjson: id
                        },
                        success: (res) => {
                            let { success, data } = res;
                            if (success) {
                                if (res.hasOwnProperty('data')) {
                                    let { head, psnclTree } = data;
                                    if (psnclTree[0].hasOwnProperty('children') && psnclTree[0].children.length == 0) {
                                        delete psnclTree[0].children;
                                    }
                                    head[formId].rows = convertGridEnablestateToShow(head[formId].rows);
                                    props.form.setAllFormValue({ [formId]: head[formId] });
                                    props.form.setFormStatus(formId, 'browse');
                                    //保存成功更新左侧树的数据
                                    if (pk_psncl) {
                                        //修改回调后修改
                                        props.syncTree.editNodeSuccess(treeId, psnclTree[0]);
                                    } else {
                                        //新增回调后添加
                                        props.syncTree.addNodeSuccess(treeId, psnclTree[0]);
                                    }
                                    //展开树节点
                                    props.syncTree.openNodeByPk(treeId, psnclTree[0].pid);
                                    props.syncTree.setNodeSelected(treeId, psnclTree[0].refpk);
                                    props.syncTree.setNodeDisable(treeId, false);
                                    props.syncTree.setTreeEdit(treeId, true);
                                    this.updateButtonStatus(props);
                                    //编码规则设置为不可编辑
                                    toast({ title: this.state.json['10140PSNCL-000001'], color: 'success' });
                                    /* 国际化处理： 保存成功！*/
                                }
                            } else {
                                //请求成功，但是返回异常保持表单原有的数据不变
                                toast({
                                    color: 'danger',
                                    content: this.state.json['10140PSNCL-000002'],
                                    title: this.state.json['10140PSNCL-000003']
                                });
                                /* 国际化处理： 服务器请求错误，保存失败！,提示*/
                                oldFormData[formId].rows = convertGridEnablestateToShow(oldFormData[formId].rows);
                                props.form.setAllFormValue({ [formId]: oldFormData[formId] });
                            }
                        }
                    });
                }, { [formId]: 'form' }, 'form');


                break;
            case 'saveAdd':
                let ajaxdata = {
                    NODE_TYPE: this.config.NODE_TYPE,
                    'pageid': this.config.pagecode,
                    'head': formdata,
                    'userjson': id
                }
                //校验公式
                props.form.isCheckNow(formId) && props.validateToSave({ pageid: this.config.pagecode, model: formdata }, () => {
                    ajax({
                        url: ajaxurl.savePsncl,
                        data: ajaxdata,
                        success: (res) => {
                            let { success, data } = res;
                            if (success) {
                                if (!res.hasOwnProperty('data')) return;
                                let { head, psnclTree } = data;
                                if (psnclTree[0].hasOwnProperty('children') && psnclTree[0].children.length == 0) {
                                    delete psnclTree[0].children;
                                }
                                //保存成功更新左侧树的数据
                                if (pk_psncl) {
                                    //修改回调后修改
                                    props.syncTree.editNodeSuccess(treeId, psnclTree[0]);
                                } else {
                                    //新增回调后添加
                                    props.syncTree.addNodeSuccess(treeId, psnclTree[0]);
                                }
                                //展开树节点
                                props.syncTree.openNodeByPk(treeId, psnclTree[0].pid);
                                props.syncTree.setNodeSelected(treeId, psnclTree[0].refpk);
                                props.form.EmptyAllFormValue(formId);
                                props.form.setFormItemsValue(formId, {
                                    'pk_org': head[formId]['rows'][0]['values']['pk_org'],
                                    'code': head[formId]['rows'][0]['values']['code'],
                                    'pk_group': head[formId]['rows'][0]['values']['pk_group'],
                                    'enablestate': { display: "", scale: "-1", value: '2' },
                                    'memo': { display: "", scale: "-1", value: "" }
                                });
                                props.form.setFormStatus(formId, 'add');
                                props.syncTree.setNodeDisable(treeId, false);
                                props.syncTree.setTreeEdit(treeId, true);
                                this.updateButtonStatus(props);
                                //如果有编码规则，根据编码规则设置code的编辑性
                                props.form.setFormItemsDisabled(formId, { 'code': head['userjson'] == 'false' });
                                toast({ title: this.state.json['10140PSNCL-000001'], color: 'success' });
                                /* 国际化处理： 保存成功！*/
                            } else {
                                //请求成功，但是返回异常保持表单原有的数据不变
                                oldFormData[formId].rows = convertGridEnablestateToShow(oldFormData[formId].rows);
                                props.form.setAllFormValue({ [formId]: oldFormData[formId] });
                                toast({
                                    color: 'danger',
                                    content: this.state.json['10140PSNCL-000002'],
                                    title: this.state.json['10140PSNCL-000003']
                                });
                                /* 国际化处理： 服务器请求错误，保存失败！,提示*/
                            }
                        }
                    });

                }, { [formId]: 'form' }, 'form');
                break;
            case 'cancel':
                //点击取消 从state中取当前选中节点 设置选中
                confirmUtil.call(this, {
                    title: this.state.json['10140PSNCL-000004'], /* 国际化处理： 询问？*/
                    content: this.state.json['10140PSNCL-000005'], /* 国际化处理： 是否确认取消？*/
                    beSureBtnClick: () => {
                        ajax({
                            url: '/nccloud/uapbd/psncl/cancelAdd.do',
                            data: { 'billcode': props.form.getFormItemsValue(formId, 'code').value },
                            success: (res) => {
                                let { success } = res;
                                if (success) {
                                    this.props.syncTree.setNodeSelected(treeId, this.state.currentNODE.refpk);
                                    props.form.setFormStatus(formId, 'browse');
                                    props.form.EmptyAllFormValue(formId);
                                    this.state.showNCCheck = true;
                                    this.state.currentNODE.refpk !== 'ROOT' && this.loadPsnclFormData(this.state.currentNODE.refpk);
                                    if (!props.syncTree.getSyncTreeValue("psnclTree")[0].children || props.syncTree.getSyncTreeValue("psnclTree")[0].children.length === 0) {
                                        this.state.cardEmpty = true;
                                    }
                                    this.setState(this.state, () => {
                                        props.syncTree.setNodeDisable(treeId, false);
                                        props.syncTree.setTreeEdit(treeId, true);
                                        this.updateButtonStatus(props);
                                    });
                                }

                            }
                        });
                    }
                });
                break;
            case 'refrensh':
                this.onInit(() => {
                    toast({
                        title: this.state.json['10140PSNCL-000006'], /* 国际化处理： 刷新成功！*/
                        color: 'success'
                    })
                });
                break;
            case 'btnPrint':
                let treeData = this.props.syncTree.getSyncTreeValue(treeId);
                let pkss = this.getTreeAllPks(treeData);
                var userJSON = {
                    "pk_org": props.form.getFormItemsValue(formId, 'pk_org').value,
                    "pk_group": props.form.getFormItemsValue(formId, 'pk_group').value
                }
                var user = JSON.stringify(userJSON);
                print(
                    'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                    ajaxurl.printUrl,
                    {
                        funcode: props.config.appcode,
                        appcode: props.config.appcode,
                        nodekey: props.config.nodeKey,
                        oids: pkss,
                        userjson: user


                    }
                );
                break;
            case 'output':
                output({
                    url: ajaxurl.printUrl,
                    data: {
                        funcode: props.config.appcode,
                        outputType: 'output',
                        nodekey: props.config.nodeKey,
                        oids: pks
                    }
                });
                break;
            case 'Export':
                this.setState({

                }, () => {
                    this.props.modal.show('exportFileModal');
                });
                break;
            default:
                break;
        }
    }

    getTreeAllPks = (treeData) => {
        let result = new Array();
        const loop = (treeData) => {
            treeData.forEach(data => {
                if (data.refpk != '~') {
                    result.push(data.refpk);
                }
                if (data.hasOwnProperty('children') && data.children && data.children.length > 0) {
                    loop(data.children);
                }
            })
        }
        loop(treeData);
        return result;
    }
    //根据节点pk查询节点数据
    loadPsnclFormData(pk, callback) {
        ajax({
            url: ajaxurl.query4form,
            data: {
                pk_psncl: pk,
                NODE_TYPE: this.config.NODE_TYPE,
                pagecode: this.config.pagecode
            },
            success: (res) => {
                if (res.success) {
                    if (res.hasOwnProperty('data')) {
                        let returndata = res.data;
                        //添加动作管控模式
                        let rem = manageModeutils.call(this, this.props.config.NODE_TYPE, returndata[formId]['rows'][0].values.pk_org.value, returndata[formId]['rows'][0].values.pk_group.value, '', getBusinessInfo().groupId);
                        returndata[formId].rows = convertGridEnablestateToShow(returndata[formId].rows);
                        this.props.form.setAllFormValue({ [formId]: returndata[formId] });
                        let meta = this.props.meta.getMeta();
                        let item = meta[formId]['items'].find(item => item['attrcode'] === 'code');
                        item.disabled = returndata['userjson'] === 'false' ? true : false;
                        this.props.form.setFormItemsDisabled(formId, { enablestate: !rem.editFlag });
                        callback && callback.call(this);
                    }
                }
            }
        });
    }

    //树节点选中事件
    onSelectTree(pk, node) {
        //每次选择都要清空form的信息
        this.props.form.EmptyAllFormValue(formId);
        this.props.form.setFormStatus(formId, 'browse');
        this.updateButtonStatus(this.props);
        if (pk === 'ROOT') {
            this.props.button.setButtonDisabled(['btnPrint', 'output'], true);
            this.props.form.setFormItemsDisabled(formId, { 'enablestate': true });
            return;
        }
        this.props.button.setButtonDisabled(['btnPrint', 'output'], false);
        this.loadPsnclFormData(pk);
    }

    onAfterFormEvent(props, moduleI, key, value) {
        let _this = this;
        let formstatus = props.form.getFormStatus(formId);
        let formvalue = props.form.getFormItemsValue(formId, ['pk_org', 'pk_group']);
        // 浏览态form 的编辑后事件
        if (formstatus === 'browse' || typeof (formstatus) === 'undefined') {
            //添加动作管控模式
            let rem = manageModeutils.call(this, props.config.NODE_TYPE, formvalue[0].value, formvalue[1].value, '', getBusinessInfo().groupId);
            //启用停用标识 false 停 true 启用
            let flag = value.value;
            //此时拿到的formdata 的enablestate的值已经是点击过开关之后的值了
            let curentformData = props.form.getAllFormValue(moduleI);
            //需要转化一下
            curentformData.rows[0].values.enablestate.value = !flag;
            switch (key) {
                case 'enablestate':
                    //form 数据中开关字段 从布尔转换成123；
                    curentformData.rows = convertGridEnablestateToSave(curentformData.rows);
                    rem.editFlag && ajax({
                        url: !flag ? ajaxurl.disablePsncl : ajaxurl.enablePsncl,
                        data: {
                            pageid: this.config.pagecode,
                            gridmodel: curentformData
                        },
                        success: (res) => {
                            let { data, success } = res;

                            if (success) {

                                data[formId].rows = convertGridEnablestateToShow(data[formId].rows);

                                console.log(data);
                                props.form.setAllFormValue({ [formId]: res.data[formId] });

                                toast({
                                    title: !flag ? this.state.json['10140PSNCL-000009'] : this.state.json['10140PSNCL-000010'],
                                    color: 'success'
                                });

                                // 停用成功后刷新一下数据
                                this.onInit()
                                /* 国际化处理： 停用成功！,启用成功！*/
                            } else {
                                toast({
                                    title: !flag ? this.state.json['10140PSNCL-000011'] : this.state.json['10140PSNCL-000012'],
                                    color: 'danger'
                                });
                                /* 国际化处理： 停用失败！,启用失败！*/
                            }
                        }
                    });
                    rem.editFlag || toast({ color: 'danger', title: rem.message });
                    props.form.setFormItemsValue(formId, { 'enablestate': { value: !flag, display: null } });
                    break;
                default:
                    break;

            }

        }
    }

    onMouseEnterEve(key) {
        //设置
        let showIcon;
        let node = this.props.syncTree.getSyncTreeValue(treeId, key);
        if (key === this.root.refpk) {
            showIcon = {
                delIcon: false, //false:隐藏； true:显示; 默认都为true显示
                editIcon: false,
                addIcon: true
            }
        } else {
            let rem = manageModeutils.call(this, this.config.NODE_TYPE, node.nodeData.pk_org, node.nodeData.pk_group, '', getBusinessInfo().groupId);
            showIcon = {
                delIcon: rem.editFlag, //false:隐藏； true:显示; 默认都为true显示
                editIcon: rem.editFlag,
                addIcon: true
            };
        }
        this.props.syncTree.hideIcon(treeId, key, showIcon);
    }

    //显示停用
    onCheckShowDisable(val) {
        cacheTools.set('checkedVal', val);
        this.onInit();
    }

    //树节点点击新增事件
    onAddTreeClick(key) {
        this.props.form.setFormStatus(formId, 'add');
        let formdata = this.props.form.getAllFormValue(formId);
        formdata.rows = convertGridEnablestateToSave(formdata.rows);
        this.props.form.setAllFormValue({ [formId]: formdata });
        // 每次对树操作 变换选中节点
        this.props.syncTree.setNodeSelected(treeId, key.refpk);
        //把当前树节点缓存到state里
        this.state.currentNODE = key;
        this.props.form.EmptyAllFormValue(formId);
        //新增设置默认上级人员分类为选中节点预加载
        this.state.showNCCheck = false;
        this.props.syncTree.setNodeDisable(treeId, true);//编辑时设置整棵树不可用
        this.props.syncTree.setTreeEdit(treeId, false);//编辑时树置灰
        this.setState(this.state, () => {
            this.updateButtonStatus(this.props);
        });
        ajax({
            url: ajaxurl.addPsncl,
            data: {
                NODE_TYPE: this.config.NODE_TYPE,
                parent_id: key.refpk,
                pk_org: this.state.context.pk_org,
                pagecode: this.config.pagecode
            },
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    //data[formId].rows =convertGridEnablestateToShow(data[formId].rows);
                    this.props.form.EmptyAllFormValue(formId);
                    this.props.form.setFormStatus(formId, 'add');
                    Utils.filterEmptyData(data[formId].rows[0].values);
                    this.props.form.setAllFormValue({ [formId]: data[formId] });
                    this.props.form.setFormItemsDisabled(formId, { 'code': data['userjson'] == 'false' });
                    this.setState({ cardEmpty: false })
                }
            }
        });

    }

    //树节点修改事件
    onEditTreeClick(key) {
        //添加动作管控模式
        let rem = manageModeutils.call(this, this.config.NODE_TYPE, key.nodeData.pk_org, key.nodeData.pk_group, '', getBusinessInfo().groupId);
        if (!rem.editFlag) {
            toast({ color: 'warning', title: rem.message });
            return;
        }
        // 每次对树操作 变换选中节点
        this.props.syncTree.setNodeSelected(treeId, key.refpk);
        //把当前树节点缓存到state里
        this.state.currentNODE = key;
        //调用节点选中事件查询节点信息
        this.loadPsnclFormData(key.refpk, () => {
            //设置数据 enablestate编辑态的时候要转为 数值
            let formdata = this.props.form.getAllFormValue(formId);
            formdata.rows = convertGridEnablestateToSave(formdata.rows);
            this.props.form.setAllFormValue({ [formId]: formdata });
        });
        //设置右表为编辑态
        this.props.form.setFormStatus(formId, 'edit');
        this.props.syncTree.setNodeDisable(treeId, true);//编辑时设置整棵树不可用
        this.props.syncTree.setTreeEdit(treeId, false);//编辑时树置灰
        this.state.showNCCheck = false;
        this.setState(this.state, () => {
            //更新按钮状态
            this.updateButtonStatus(this.props);
        });
    }

    //树节点删除事件
    onDelTreeClick(key) {
        //添加动作管控模式
        let rem = manageModeutils.call(this, this.config.NODE_TYPE, key.nodeData.pk_org, key.nodeData.pk_group, '', getBusinessInfo().groupId);
        if (!rem.editFlag) {
            toast({ color: 'warning', title: rem.message });
            return;
        }
        // 每次对树操作 变换选中节点
        this.props.syncTree.setNodeSelected(treeId, key.refpk);
        //把当前树节点缓存到state里
        this.state.currentNODE = key;
        let requestParam = {};
        this.props.form.getFormItemsValue(formId, 'data');
        if (key.refpk == this.root.refpk) {
            toast({ color: 'warning', content: this.state.json['10140PSNCL-000013'] }); /* 国际化处理： 根节点不能删除*/
            return;

        }
        if (key.hasOwnProperty('children') && !!key.children && key.children.length > 0) {
            toast({ color: 'warning', content: this.state.json['10140PSNCL-000015'] }); /* 国际化处理： 该节点包含子节点，不允许删除！*/
            return;
        }
        confirmUtil.call(this, {
            title: this.state.json['10140PSNCL-000016'], /* 国际化处理： 确认删除*/
            content: this.state.json['10140PSNCL-000014'], /* 国际化处理： 确认要删除所选数据吗？*/
            beSureBtnClick: () => {
                requestParam = {
                    pk_psncl: key.refpk,
                    ts: key.nodeData.ts,
                    isLeaf: key.isLeaf,
                    NODE_TYPE: this.config.NODE_TYPE
                }
                ajax({
                    url: ajaxurl.delPsncl,
                    data: requestParam,
                    success: (result) => {
                        if (result.success) {
                            this.props.form.EmptyAllFormValue(formId);
                            //调用异步树的接口，删除该树节点
                            this.props.asyncTree.delTreeData(treeId, key.refpk);
                            if (!this.props.syncTree.getSyncTreeValue("psnclTree")[0].children || this.props.syncTree.getSyncTreeValue("psnclTree")[0].children.length === 0) {
                                this.setState({ cardEmpty: true })
                            }
                            toast({ title: this.state.json['10140PSNCL-000017'], color: 'success' });
                            /* 国际化处理： 删除成功！*/
                        }

                    }
                })
            }
        });
        this.updateButtonStatus(this.props);
    }

    addClickCall = () => {
        this.setState({
            cardEmpty: false
        });
        this.onAddTreeClick(this.root);
    }

    onBeforeFormEvent(props, moduleId, key, value, data) {
        let formStatus = this.props.form.getFormStatus(formId)
        if (formStatus == 'browse' && !data.pk_psncl.value) {
            return false;
        }
        return true;
    }
    renderPage = () => {
        const { form, button, DragWidthCom, syncTree, BillHeadInfo } = this.props;
        const { createSyncTree } = syncTree
        const { createBillHeadInfo } = BillHeadInfo;
        const { createForm } = form;//创建表单，需要引入这个
        const { createButtonApp } = button;
        const { cardEmpty } = this.state;
        let titleName = this.config.NODE_TYPE === 'GLOBE_NODE' ? this.state.json['10140PSNCL-000018'] : this.state.json['10140PSNCL-000019']
        return (
            <div style={{ height: '100%' }} className="nc-bill-tree-card">
                {/* 头部 header*/}
                <NCDiv className="header" areaCode={NCDiv.config.HEADER}>
                    {/* 标题 title*/}
                    <div className="title">
                        {createBillHeadInfo(
                            {
                                title: this.config.NODE_TYPE === 'GLOBE_NODE' ? this.state.json['10140PSNCL-000018'] : this.state.json['10140PSNCL-000019'],
                                backBtnClick: () => { },
                                initShowBackBtn: false
                            }
                        )}
                    </div>
                    <span className="showOff">
                        <NCCheckbox disabled={!this.state.showNCCheck} onChange={this.onCheckShowDisable.bind(this)}
                            checked={cacheTools.get('checkedVal')}>{this.state.json['10140PSNCL-000020']}</NCCheckbox>
                    </span>
                    {/* 按钮组 btn-group*/}
                    <div className="btn-group">
                        {createButtonApp({
                            area: 'btn-group',
                            buttonLimit: 3,
                            onButtonClick: this.onButtonClick.bind(this),
                            popContainer: document.querySelector('.header-button-area')

                        })}
                    </div>
                </NCDiv>
                {/* 树卡区域 */}
                <div className="tree-card">
                    <DragWidthCom
                        // 左树区域
                        defLeftWid='280px'
                        leftDom={
                            <div className="tree-area">
                                {createSyncTree({
                                    treeId: treeId,
                                    needEdit: true, //不启用编辑
                                    showLine: false, //显示连线
                                    needSearch: true, //是否需要搜索框
                                    onSelectEve: this.onSelectTree.bind(this),//选择
                                    onMouseEnterEve: this.onMouseEnterEve.bind(this),
                                    clickEditIconEve: this.onEditTreeClick.bind(this), //编辑点击 回调
                                    clickAddIconEve: this.onAddTreeClick.bind(this), //新增点击 回调
                                    clickDelIconEve: this.onDelTreeClick.bind(this), // 删除点击 回调
                                    showModal: false,
                                    searchType: 'filtration',//树节点过滤方式修改
                                    disabledSearch: this.state.disabledSearch//树的搜索框禁用属性

                                })}
                            </div>}     //左侧区域dom
                        // 右卡片区域
                        rightDom={
                            <div style={{ height: '100%' }}>
                                <EmptyAreaTip
                                    type="btn"
                                    onClick={this.addClickCall}
                                    desc={this.state.json['10140PSNCL-000021']}
                                    show={cardEmpty} />
                                <div className="card-area" style={{ display: cardEmpty ? 'none' : 'block' }}>
                                    {createForm(formId, {
                                        onAfterEvent: this.onAfterFormEvent.bind(this),
                                        cancelPSwitch: false,
                                        onBeforeEvent: this.onBeforeFormEvent.bind(this)
                                    })
                                    }
                                </div>
                            </div>}     //右侧区域dom
                        defLeftWid='20%'      // 默认左侧区域宽度，px/百分百
                    />
                </div>
                <ExcelImport
                    {...Object.assign(this.props)}
                    moduleName='uapbd'//模块名
                    billType={this.config.billType}//单据类型
                    selectedPKS={[]}
                    appcode={this.config.appcode}
                    pagecode={this.config.pagecode}
                />
            </div>)
    }

    render() {
        return (
            <div>{this.state.loadLang ? this.renderPage() : <div />}</div>
        )
    }
}

export default PsnclCardTable;





//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65