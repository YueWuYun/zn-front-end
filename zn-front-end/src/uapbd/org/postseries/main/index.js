//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 岗位序列
 * @author	xuewenc
 */
import React, { Component } from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,print,high,promptBox,createPageIcon} from 'nc-lightapp-front';
import './index.less';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import Utils from '../../../public/utils';
const { NCMenu,NCCheckbox,NCDiv } = base;
const {NCMenuGroup} = NCMenu;
const { PrintOutput } = high;

/****************默认参数  开始***********************/
let formId = 'head';//卡片组件Id
let formdata = {};
let urls={
    loadTreeDataUrl:"/nccloud/org/postseries/PostSeriesAppDataInitAction.do",
    queryCardUrl:"/nccloud/org/postseries/PostSeriesQueryAction.do",
    enablestateUrl:"/nccloud/org/postseries/PostSeriesIsEnableAction.do",
    addCardUrl:"/nccloud/org/postseries/PostSeriesAddAction.do",
    deleteUrl:'/nccloud/org/postseries/PostSeriesDelAction.do',
    saveUrl:'/nccloud/org/postseries/PostSeriesSaveAction.do',
    print: '/nccloud/org/postseries/PostSeriesPrintAction.do',
    isPermission: '/nccloud/org/postseries/IsPostSeriesPermisAction.do'
};
let pageCode="10100PSG_postseries";//默认集团
let appcode="10100PSG";//默认集团
let postseriesTs = (new Date()).valueOf().toString();     //快捷键操作时取最大时间
/***************默认参数  结束********************/

/**
 * 岗位序列-集团
 */
class Postseries extends Component {
    constructor(props){
        super(props)
        this.config =Object.assign({
            //title: '岗位序列-集团',
            treeId:"epsTree",
            formId:"head",
            pageCode:"10100PSG_postseries",
            appcode : "10100PSG",
            nodeType:'GROUP_NODE',
            isGlbGrp:'1',
            urls:urls
        },props.config);

        //自定义根节点
        this.root = {
            "isleaf": false,
            "key":"~",
            "title": "岗位序列",
            "id":"~",
            "innercode":"~",
            "pid": "",
            "refname": "岗位序列",
            "refpk": "~"
        };
        //主动事件，绑定this指针
        this.initButtonStatus = this.initButtonStatus.bind(this);
        this.changeButtonStatus = this.changeButtonStatus.bind(this);
        this.onStartPostseries = this.onStartPostseries.bind(this);
        this.onStopPostseries = this.onStopPostseries.bind(this);
        this.dealTreeData = this.dealTreeData.bind(this);

        //显示停用复选框的状态标志
        this.state = {
            checked: false,//判断 显示停用按钮是否选中
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            showOffDisable: false, //判断 显示停用按钮是否显示
            addSelNodeId: {},      //新增时选中的树节点
            pks: [],                //打印ids
            treeDisabledSearch: false,
            json : {},                      //多语json
			inlt : null
        }

        this.initTemplate(props, () => {
            this.loadTreeDataUrl();
        });
    }

    /**
     * 单据模板
     * @param props
     */
    initTemplate = (props, callback)=>{
        pageCode = props.config.pageCode?props.config.pageCode:pageCode;
        appcode = props.config.appcode?props.config.appcode:appcode;
        let isGlb = props.config.isGlbGrp==='0'?'Y':'N';
        createUIDom(props)(
            {pagecode:pageCode},
            {moduleId: '10100PSG',domainName: 'uapbd'},
            (data,langData,inlt) => {
                //多语
				if(langData){
                    this.state.json = langData;
                    this.root['refname'] = this.root['title'] = this.state.json['10100PSG-000002'];/* 国际化处理： 岗位序列*/                    
                    if(inlt){
                        this.state.inlt = inlt;
                    }
                }
                //设置元数据
                if(data.template){
                    //设置元数据
                    data.template[formId].items.map((obj)=>{
                        if(obj.attrcode == 'father_pk'){
                            obj['refcode']='uapbd/refer/org/PostSeriesDefaultAllTreeRef/index.js';
                            obj['queryCondition'] = (
                                () => {
                                    return {
                                        'isGlb': isGlb,
                                        'isEnable': 'Y',
                                        'TreeRefActionExt':'nccloud.web.uapbd.org.postseries.util.PostSeriesDefaultAllTreeRefExt'
                                    }
                                }
                            );
                        } 
                        // else if(obj.attrcode==='postseriesdesc'){
                        //     obj['itemtype'] = 'textarea';
                        //     obj['rows'] = '4';
                        //     obj['col'] = '8';
                        // }
                        // else if(obj.attrcode==='creator'||obj.attrcode==='creationtime'||obj.attrcode==='modifier'||obj.attrcode==='modifiedtime'){
                        //     obj.visible = false;
                        // }
                    });
                    props.meta.setMeta(data.template);
                }
                if (data.button) {
                    props.button.setButtons(data.button);
                };

                callback && callback();
            }
        );

    }

    /**
     * 处理树数据
     * @param data
     * @returns {*}
     */
    dealTreeData(data){
        let deleteDataChildrenProp = function(node){
            //node.beforeName = <span>{node['code']?(node['code']+' '):''}</span>
            if(!node.children || node.children.length == 0) {
                delete node.children;
            }
            else{
                node.isLeaf = false;
                node.children.forEach( (e) => {
                    deleteDataChildrenProp(e);
                } );
            }
        };
        data.forEach( (e) => {
            e.iconBox = {
                editIcon:false,
                addIcon:false,
                delIcon:false
            };
            deleteDataChildrenProp(e);
        });
        return data;
    }

    /**
     * react 生命周期函数 组件渲染完后触发事件
     */
    componentDidMount(){
        //this.loadTreeDataUrl();
    }

    componentDidUpdate(){
        let l_formstatus = this.props.form.getFormStatus(this.config.formId);
        if(l_formstatus != 'add' && l_formstatus != "edit"){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    /**
     * 加载树数据
     */
    loadTreeDataUrl(nodeSelected = true){
        let requestParam = { checked:this.state.checked,isGlbGrp: this.config.isGlbGrp};
        /*************
         * ajax请求 加载树数据
         *************/
        ajax({
            url:this.config.urls.loadTreeDataUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    let data = [Object.assign( {...this.root} , {children : result.data} )];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
                    
                    if(this.state.curSelectedNode && this.state.curSelectedNode.refpk ){
                        //展开树节点
                        this.props.syncTree.openNodeByPk(this.config.treeId, this.state.curSelectedNode.pid);
                        if(nodeSelected)
                            this.props.syncTree.setNodeSelected(this.config.treeId, this.state.curSelectedNode.refpk);
                        //zhangchik start
                        if(this.state.curSelectedNode.refpk === '~'){
                            this.props.button.setDisabled(['Print','Output'], true);
                        }else{
                            this.props.button.setDisabled(['Print','Output'], false);
                        }
                        //    this.props.button.setDisabled(['Print','Output'], false);
                        //zhangchik end
                        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);
                        if(!selectedTreeNode){
                            this.setState({
                                curSelectedNode: null
                            });
                            this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                            this.props.button.setDisabled(['Print','Output'], true);
                        }
                    }else{
                        //展开节点  设置默认展开项
                        this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                        this.props.button.setDisabled(['Print','Output'], true);
                    }
                }
            }
        });
        //修改按钮状态
        this.initButtonStatus();
    }

    /**
     * 页面初始设置button状态
     */
    initButtonStatus(){
        //设置按钮不显示
        this.props.button.setButtonVisible(['Save','Cancel','SaveAdd'],false);
    }

    /**
     * 点击树节点
     * @param refpk
     */
    onSelectTree(refpk){
        this.setState({
            curSelectedNode: this.props.syncTree.getSelectNode(this.config.treeId)
        });
        //编辑态  树节点操作无效  应该提供一个接口，编辑态任何操作都不能动
        let status = this.props.form.getFormStatus(this.config.formId);
        if(status == 'edit' || status == 'add'){
            return;
        }
        if(refpk == this.root.refpk){
            //清空表单
            this.props.form.EmptyAllFormValue(this.config.formId);
            this.props.button.setDisabled(['Print','Output'], true);
            this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});//设置表单项是否不可编辑
            return;
        }
        /********************************
         * ajax 请求选择的树节点数据
         ********************************/
        postseriesTs = (new Date()).valueOf().toString();
        ajax({
            url:this.config.urls.queryCardUrl,
            data:{
                pk_postseries: refpk,
                isGlbGrp: this.config.isGlbGrp,
                postseriesTs: postseriesTs
            },
            success:(result)=>{

                if(result.success){
                    
                    if(result.data['postseriesTs']===postseriesTs){
                        result.data = result.data.form;
                        //处理显示公式
                        this.dealDisplayFm(result);        
    
                        //表单数据处理
                        this.dealFormData(result, true);
                        //清空表单
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        //设置表单为所选树节点数据
                        formdata[formId] = result.data[this.config.formId];
                        this.props.form.setAllFormValue(formdata);
                        //设置启用状态enablestate是否可编辑
                        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);
    
                        this.props.button.setDisabled(['Print','Output'], false);
    
                        let nodeType = this.props.config.nodeType;
                        if((nodeType==='GLOBE_NODE' && selectedTreeNode && selectedTreeNode.refpk!='~') || (nodeType==='GROUP_NODE' && selectedTreeNode && selectedTreeNode.nodeData.isGrp)){
                            this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});//设置表单项是否不可编辑
                        }else{
                            this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});//设置表单项是否不可编辑
                        }

                    }
                }
            }
        });
    }

    /**
     * 表单数据处理
     */
    dealFormData(result, isChangeEnable){
        let headData = result.data.head.rows[0].values;
        if(isChangeEnable){
            if(headData.hasOwnProperty('enablestate')){ 
                let enablestateValue = headData.enablestate.value;
                //根据表单项enablestate的值修改开关状态
                if(enablestateValue == '2'){
                    result.data.head.rows[0].values.enablestate.value = true;
                }else{
                    result.data.head.rows[0].values.enablestate.value = false;
                }
            }
        }
        if(headData.father_pk.value === this.root.refpk || headData.father_pk.display === 'root'){
            result.data.head.rows[0].values.father_pk.display = '';
            result.data.head.rows[0].values.father_pk.value='';
        }
    }

    /**
     * 表单编辑事件
     */
    onAfterFormEvent(props, moduleId, key, value, index){
        switch(key){
            case "enablestate":
                //获得选中节点
                let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);
                
                if(!selectedTreeNode){
                    let content = value.value?this.state.json['10100PSG-000003']:this.state.json['10100PSG-000004'];/* 国际化处理： 请选中需要启用的树节点,请选中需要停用的树节点*/
                    toast({ color: 'warning', title: content });
                    return;
                }
                //数据权限校验
                ajax({
                    url: this.config.urls['isPermission'],
                    data: { pk_postseries: selectedTreeNode.refpk},
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            if(data!='success'){
                                this.props.form.setFormItemsValue(this.config.formId, { 'enablestate': {value:!value.value} });
                                toast({ color: 'danger', title: data });
                                return;
                            }
                            let requestParam = {
                                pk_postseries : selectedTreeNode.refpk,
                                enablestate : value.value?'2':'1',
                                ts : this.props.form.getFormItemsValue(this.config.formId,'ts').value
                            };
                            promptBox({
                                color: 'warning',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                title:this.state.json['10100PSG-000005'],/* 国际化处理： 提示*/
                                content:value.value?this.state.json['10100PSG-000006']: this.state.json['10100PSG-000007'],/* 国际化处理： 确认启用该数据？,您确定要停用所选数据及其所有下级数据吗？*/
                                beSureBtnClick:()=>{
                                    ajax({
                                        url:this.config.urls.enablestateUrl,
                                        data:requestParam,
                                        success:(result)=>{
                                            let {success, data} = result;
                                            if(success){
                                                toast({title: value.value?this.state.json['10100PSG-000008']:this.state.json['10100PSG-000009'],color:'success'});/* 国际化处理： 启用成功！,停用成功！*/
                                                if(data){
                                                    props.form.setFormItemsValue(this.config.formId,{'ts': {value:data}});
                                                }
                                            }
                                        }
                                    });
                                },
                                cancelBtnClick:()=>{
                                    props.form.setFormItemsValue(this.config.formId,{'enablestate': {value:!value.value}});
                                    return;
                                },
                                closeBtnClick:()=>{
                                    this.props.form.setFormItemsValue(this.config.formId, { 'enablestate': {value:!value.value} });
                                    return;
                                }
                            });
                        }
                    }
                });
                break;
            default:
                break;
        }
        //some code
    }

    /**
     * 新增
     */
    onAddPostseries(selectNode){
        this.setState({
            curSelectedNode: selectNode,
            addSelNodeId: selectNode
        });
        let requestParam = {isGlbGrp: this.config.isGlbGrp};//请求参数对象
        if(selectNode){
            //存在选中节点，设置父节点pk为选中节点refpk
            requestParam['father_pk'] = selectNode.refpk;
        }else{
            //不存在选中节点，设置父节点为根节点refpk
            requestParam['father_pk'] = this.root.refpk;
        }
        ajax({
            url:this.config.urls.addCardUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    //表单数据处理
                    this.dealFormData(result);
                    //清空表单数据
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    //设置表单为编辑态
                    this.props.form.setFormStatus(this.config.formId, 'add');
                    //设置新增默认值
                    formdata[formId] = result.data[this.config.formId];
                    Utils.filterEmptyData(formdata[formId].rows[0].values);
                    this.props.form.setAllFormValue(formdata);
                    //设置表单项不可用
                    this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});

                    this.props.syncTree.setNodeDisable(this.config.treeId,true);//编辑时设置整棵树不可用
                }
            }
        })
        this.changeButtonStatus(selectNode,'add');
    }

    /**
     * 编辑
     */
    onEditPostseries(selectedTreeNode){

        //数据权限校验
        ajax({
            url: this.config.urls['isPermission'],
            data: { pk_postseries: selectedTreeNode.refpk},
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if(data!='success'){
                        toast({ color: 'danger', title: data });
                        return;
                    }
                    this.doEditPostseries(selectedTreeNode);
                }
            }
        });

    }

    doEditPostseries(selectedTreeNode){
        this.setState({
            curSelectedNode : selectedTreeNode
        });
        /**************************************************
         *
         * 编辑：
         *      1、构造请求参数
         *      2、ajax请求，后台查询需要编辑的对象
         *      3、回调，设置表单数据为编辑的对象
         *
         * 编辑状态下：
         *      只有 保存  取消 按钮 显示
         *
         **************************************************/
        /***ajax请求***/
        let isGlbGrp = this.config.isGlbGrp;
        ajax({
            url:this.config.urls.queryCardUrl,
            data:{pk_postseries:selectedTreeNode.refpk,isGlbGrp: isGlbGrp},
            success:(result)=>{

                if(result.success){
                    result.data = result.data.form;
                    //处理显示公式
                    this.dealDisplayFm(result);

                    this.props.syncTree.setNodeDisable(this.config.treeId,true);//编辑时设置整棵树不可用
                    //表单数据处理
                    this.dealFormData(result);
                    //设置表单数据
                    formdata[formId] = result.data[this.config.formId];
                    this.props.form.setAllFormValue(formdata);
                    this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});//设置表单项不可用
                    //设置表单状态为编辑态
                    this.props.form.setFormStatus(this.config.formId, 'edit');

                    //给岗位序列参照加过滤条件,全局只可看到全局岗位序列
                    //let pk_postseries = result.data[this.config.formId]['rows'][0]['values']['pk_postseries']['value'];
                    // let isGlb = isGlbGrp==='0'?'Y':'N';
                    // let meta = this.props.meta.getMeta();
                    // meta[formId].items.find((item) => item.attrcode == 'father_pk')['queryCondition'] = (
                    //     () => {
                    //         return {
                    //             'isGlb': isGlb
                    //         }
                    //     }
                    // );
                    // this.props.meta.setMeta(meta);
                }
            }
        });
        this.changeButtonStatus(selectedTreeNode,'edit');
    }

    onButtonClick(props,id){
        switch(id){
            case 'Refresh':
                this.onSelectTree(this.state.curSelectedNode ? this.state.curSelectedNode['refpk'] : '~');
                this.loadTreeDataUrl();
                toast({ color: 'success', title: this.state.json['10100PSG-000010'] });/* 国际化处理： 刷新成功！*/
                break;
            case 'Save':
                this.onSavePostseries();
                break;
            case 'SaveAdd':
                this.onSavePostseries({isSaveAdd: true});
                break;
            case 'Cancel':
                promptBox({
                    color: 'warning',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title : this.state.json['10100PSG-000011'],/* 国际化处理： 确认取消*/
                    content : this.state.json['10100PSG-000012'],/* 国际化处理： 是否确认要取消？*/
                    beSureBtnClick : () => {
                        this.onCancelPostseries();
                    }
                });
                break;
            case 'Print':
				let printParam={
                    funcode: this.config.isGlbGrp==='0'?'10100PSB':'10100PSG',
                    nodekey: 'postseriesPrint'
				};
				this.pintFunction(printParam);
                break;
            case 'Output':
                let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                if(selectedTreeNode && selectedTreeNode['refpk']){
                    this.setState(
                        {pks : [selectedTreeNode['refpk']]},
                        () => {
                            this.refs.printOutput.open();
                        }
                    );
                }
				break;
            default:
                break;
        }
    }

    //输出和打印功能函数
	pintFunction(param){
		let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
		param.oids = [selectedTreeNode.refpk];
		print(
			'pdf',
			urls['print'],
			param
		);
	}

    /**
     * 保存
     */
    onSavePostseries({isSaveAdd=false}={}){
        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
        if(!selectedTreeNode){
            selectedTreeNode = this.state.curSelectedNode;
        }
        let requestParam= {};
        /**************************************************
         *
         * 保存：
         *     1、获取表单对象
         *     2、构造请求参数模型
         *     3、ajax请求，后台根据表单对象主键执行保存或更新操作
         *     4、回调，刷新当前树节点的父节点
         *
         * 保存状态下：
         *      恢复到浏览态，根据当前选中的树节点决定按钮的可见性和可操作性
         *
         **************************************************/
        if(!this.props.form.isCheckNow(this.config.formId)) return;

        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        formData.areacode = this.config.formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态
        /***设置请求参数***/
        requestParam = {
            model: formData,
            pageid: this.config.pageCode//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };

        /****判断刷新父节点，还是刷新选中节点****/
        /************************************
         * 如果是新增，就刷新当前选中节点
         * 如果是编辑，就刷新当前节点的父节点
         *
         ************************************/
        var pk = null;
        if(formData.rows[0].values.hasOwnProperty('pk_postseries')){
            pk = formData.rows[0].values.pk_postseries.value;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点
        }
        let nonPk = false;//没有主键  false时就是有主键  即编辑 即刷新父节点
        if(pk == null || pk ==''){
            nonPk = true;// true时 就是无主键 即 新增  即刷新当前节点
        }
        //ajax请求
        let saveajax = () => {
            ajax({
                url: this.config.urls.saveUrl,
                data: requestParam,
                success: (result) => {
                    if(result.success){
                        toast({title:this.state.json['10100PSG-000013'],color:'success'});/* 国际化处理： 保存成功！*/
                        let refpk = result.data[0].refpk;
                        //设置表单浏览态
                        this.props.form.setFormStatus(this.config.formId, 'browse');
                        //设置树可用
                        this.props.syncTree.setNodeDisable(this.config.treeId,false);
                        if(!result.data[0].children || result.data[0].children.length == 0 ){
                            delete result.data[0].children;
                        }
                        if(nonPk){
                            //新增回调后添加
                            this.props.syncTree.addNodeSuccess(this.config.treeId,result.data);
                        }else{
                            //修改回调后修改
                            //this.props.syncTree.editNodeSuccess(this.config.treeId,result.data[0]);
                            this.props.syncTree.setNodeSelected(this.config.treeId, refpk);
                            selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
                            let childrenTree = selectedTreeNode.hasOwnProperty('children')?selectedTreeNode['children']:null;
                            if(childrenTree && childrenTree.length>0){
                                result.data[0]['children'] = childrenTree;
                            }
                            this.props.asyncTree.delTreeData(this.config.treeId,refpk);
                            this.props.syncTree.addNodeSuccess(this.config.treeId,result.data);
                        }
                        //展开树节点
                        this.props.syncTree.openNodeByPk(this.config.treeId, result.data[0].pid);
                        this.props.syncTree.setNodeSelected(this.config.treeId, refpk);
                        //设置表单项可用
                        this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});
                        //清空自定已选中项
                        this.setState({curSelectedNode:null});
                        this.changeButtonStatus(selectedTreeNode,'save');
                        if(isSaveAdd){
                            this.onAddPostseries(this.state.addSelNodeId);
                        }else{
                            this. onSelectTree(refpk);
                        }
                    }
                }
            });
        }

        this.props.validateToSave(requestParam, saveajax, {[this.config.formId]:'form'}, 'form');
    }

    /**
     * 删除
     */
    onDeletePostseries(selectedTreeNode){
        let requestParam = {};
        
        //数据权限校验
        ajax({
            url: this.config.urls['isPermission'],
            data: { pk_postseries: selectedTreeNode.refpk},
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if(data!='success'){
                        toast({ color: 'danger', title: data });
                        return;
                    }
                    let message = this.state.json['10100PSG-000014'];/* 国际化处理： 确认要删除所选数据吗？*/
                    promptBox({
                        color: 'warning',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                        title: this.state.json['10100PSG-000015'],/* 国际化处理： 确认删除*/
                        content: message,
                        beSureBtnClick: () => {
                            requestParam = {
                                pk_postseries: selectedTreeNode.refpk,
                                isGlbGrp: this.config.isGlbGrp,
                                ts: selectedTreeNode.nodeData['ts']
                            }
                            let pid = selectedTreeNode.pid;
                            ajax({
                                url:this.config.urls.deleteUrl,
                                data:requestParam,
                                success:(result)=>{
                                    if(result.success){
                                        this.props.form.EmptyAllFormValue(this.config.formId);
                                        //调用异步树的接口，删除该树节点
                                        this.props.asyncTree.delTreeData(this.config.treeId,selectedTreeNode.refpk);
                                        toast({title:this.state.json['10100PSG-000016'],color:"success"});/* 国际化处理： 删除成功！*/
                                    }
                                }
                            })
                        }
                    });
                }
            }
        });
    }

    /**
     * 取消
     */
    onCancelPostseries(){
        //同步树 取消的逻辑
        let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得选中节点
        /**********************************************************
         *
         * 取消：
         *      1、重新根据选中的树节点查询表单对象
         *      2、回调，设置表单对象
         *      3、设置按钮状态
         *
         **********************************************************/
        this.props.form.EmptyAllFormValue(this.config.formId);
        if(selectedTreeNode && selectedTreeNode['refpk']!='~'){
            //设置启用状态是否可编辑
            let nodeType = this.props.config.nodeType;
            if((nodeType==='GLOBE_NODE' && selectedTreeNode.refpk!='~') || (nodeType==='GROUP_NODE' && selectedTreeNode.nodeData.isGrp)){
                this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});//设置表单项是否不可编辑
            }else{
                this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});//设置表单项是否不可编辑
            }
            //查询节点信息
            ajax({
                url:this.config.urls.queryCardUrl,
                data:{pk_postseries:selectedTreeNode.refpk,isGlbGrp: this.config.isGlbGrp},
                success:(result)=>{
                    if(result.success){
                        result.data = result.data.form;

                        //处理显示公式
                        this.dealDisplayFm(result);

                        //表单数据处理
                        this.dealFormData(result, true);
                        formdata[formId] = result.data[this.config.formId];
                        this.props.form.setAllFormValue(formdata);
                    }
                }
            });
            this.onSelectTree(selectedTreeNode.refpk);
        }else{
            //没有选中项  清空所有数据
            this.props.form.EmptyAllFormValue(this.config.formId);
        }
        this.props.form.setFormStatus(this.config.formId, 'browse');
        //设置树可用
        this.props.syncTree.setNodeDisable(this.config.treeId,false);
        //设置按钮状态
        this.changeButtonStatus(selectedTreeNode,'cancel');
    }

    /**
     * 启用
     */
    onStartPostseries(){
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(this.config.treeId);//获得选中节点
        let requestParam = {};
        /**************************************************
         *
         * 启用/停用
         *      1、判断选中树节点的状态，做出相应的提示
         *      2、构造请求参数
         *      3、ajax请求，后台执行更新
         *
         * 启用/停用状态下：
         *      按钮的可见性和可操作性不变
         *
         *
         **************************************************/
        if(!selectedTreeNode){
            toast({ color: 'warning', title: this.state.json['10100PSG-000017'] });//默认top/* 国际化处理： 请选中需要启用的树节点！*/
        }else if(formData.rows[0].values.enablestate.value == '2'){
            toast({ color: 'warning', title: this.state.json['10100PSG-000018'] });//默认top/* 国际化处理： 该数据已启用，无需多次启用！*/
            return;
        }
        requestParam = {
            pk_postseries:formData.rows[0].values.pk_postseries.value,
            enablestate:'2',
            isGlbGrp: this.config.isGlbGrp
        }
        ajax({
            url:this.config.urls.enablestateUrl,
            data:requestParam,
            success:(result)=>{
                //启用成功，设置表单数据
                formdata[formId] = result.data[this.config.formId];
                this.props.form.setAllFormValue(formdata);
                //关闭 展开，可以做一个refreshTreeNode方法
                this.refreshTreeNode(this.config.treeId,selectedTreeNode.pid);
            }
        });
    }

    /**
     * 停用
     */
    onStopPostseries(){
        let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(this.config.treeId);//获得选中节点
        let requestParam = {};

        if(!selectedTreeNode){
            toast({ color: 'warning', title: this.state.json['10100PSG-000019'] });//默认top/* 国际化处理： 请选中需要停用的树节点！*/
        }else if(formData.rows[0].values.enablestate.value == '1'){
            toast({ color: 'warning', title: this.state.json['10100PSG-000020'] });//默认top/* 国际化处理： 该数据已停用，无需多次停用！*/
            return;
        }
        requestParam = {
            pk_postseries:formData.rows[0].values.pk_postseries.value,
            enablestate:'1',
            isGlbGrp: this.config.isGlbGrp
        }
        
        ajax({
            url:this.config.urls.enablestateUrl,
            data:requestParam,
            success:(res)=>{
                if(res.success){
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    this.refreshTreeNode(this.config.treeId,selectedTreeNode.pid);
                }
            }
        });
    }
    /*****button group end*****/

    /**
     * 更多按钮点击更多选项时触发事件
     * @param key
     */
    onMoreSelect({ key }) {
        if(key == 'start'){
            this.onStartPostseries();
        }else if(key == 'stop'){
            this.onStopPostseries();
        }
    }

    /**
     * 按钮点击状态切换监听事件
     * @param id
     */
    changeButtonStatus(selectedTreeNode,id){
        switch(id){
            case 'add':
            case 'saveAdd':
                this.props.button.setButtonVisible(['Refresh','Print'],false);
                this.props.button.setButtonVisible(['Save','SaveAdd','Cancel'],true);
                this.setState({
                    showOffDisable: true,
                    treeDisabledSearch : true
                });
                break;
            case 'edit':
                this.props.button.setButtonVisible(['Refresh','Print','SaveAdd'],false);
                this.props.button.setButtonVisible(['Save','Cancel'],true);
                this.setState({
                    showOffDisable: true,
                    treeDisabledSearch : true
                });
                break;
            case 'save':
            case 'cancel':
                this.props.button.setButtonVisible(['Refresh','Print'],true);
                this.props.button.setButtonVisible(['Save','SaveAdd','Cancel'],false);
                this.setState({
                    showOffDisable: false,
                    treeDisabledSearch : false
                });
            default :
                break;
        }
    }

    /**
     * 鼠标进入树节点事件,设置树节点上的按钮显示状态 nodeType:'GLOBE_NODE'
     * @param key
     */
    onMouseEnterEve(key,node){
        let nodeType = this.props.config.nodeType;
        let obj = {};
        if((nodeType==='GLOBE_NODE' && key!='~' && node.nodeData['isGlb']) || (nodeType==='GROUP_NODE' && key!='~' && node.nodeData['isGrp'])){
            obj = {
                delIcon:true, //false:隐藏； true:显示; 默认都为true显示
                editIcon:true,
                addIcon:true
            };
        }else{
            obj = {
                delIcon:false, //false:隐藏； true:显示; 默认都为true显示
                editIcon:false,
                addIcon:true
            };
        }
        this.props.syncTree.hideIcon(this.config.treeId, key, obj );
    }

    /**
     * enablestate change 事件
     * @param checked
     */
    onChange(checked){
        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得树节点选中项
        let requestParam = {};
        if(!selectNode ){
            toast({ color: 'warning', title: this.state.json['10100PSG-000021'] });//默认top/* 国际化处理： 请选中树节点！*/
        }
        requestParam['pk_postseries'] = selectNode.refpk;
        requestParam['enablestate'] = checked?'2':'1';
        requestParam['isGlbGrp'] = this.config.isGlbGrp
        ajax({
            url:this.config.urls.enablestateUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success) {
                    if (checked) {
                        //如果是选中 那就把数据再加载到表单
                        formdata[formId] = result.data[this.config.formId];
                        this.props.form.setAllFormValue(formdata);
                    } else {
                        //如果不是选中那就清空表单
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        this.props.syncTree.delNodeSuceess(this.config.treeId, selectNode.refpk);
                    }
                }

            }
        });
    }

    /**
     * checkbox 选中事件
     */
    onCheckBoxClick(){
        this.setState(
            {checked:!this.state.checked},
            () => {
                this.loadTreeDataUrl(false);
                this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
            }
        );
    }


    //处理显示公式
    dealDisplayFm = (result) => {
        if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
            this.props.dealFormulamsg(
                result.formulamsg,
                {
                    [formId] : "form"
                }
            );
        }
    }

    /**
     * 渲染
     * @returns {*}
     */
    render(){
        /**
         *  经过createPage方法后，初始对象都放到了props中
         *  例如 asyncTree,syncTree,form,table……
         *  我们用的话直接从props里取就可以了
         * */
        const {asyncTree,syncTree,form,button,modal,search,DragWidthCom,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
        //DragWidthCom 平台出的左右布局的组件  专用于树卡和树表
        const {createAsyncTree} = asyncTree;//创建异步树，需要引入这个
        const {createSyncTree} = syncTree;//创建同步树 需要引入这个
        const {createForm} = form;//创建表单，需要引入这个

        let { createButtonApp } = button;
        let { createModal } = modal;  //模态框
        const {NCCreateSearch} = search;
        const {Item} = NCMenu;
        
        let title = this.config.appcode==='10100PSB'?this.state.json['10100PSG-000022']:this.state.json['10100PSG-000023'];/* 国际化处理： 岗位序列-全局,岗位序列-集团*/

        return(

            <div className="postseries_10100PS nc-bill-tree-card">
                {/* 头部 header*/}
                <NCDiv className="header"  areaCode={NCDiv.config.HEADER}>
                   
                    {/* 标题 title*/}
                    <div className="title" >
                        {createBillHeadInfo({ 
                            title:title,
                            initShowBackBtn:false
                        })}
                    </div>
                    <span className="showOff" >
                        <NCCheckbox
                            defaultChecked={false}
                            checked={this.state.checked}
                            onChange={this.onCheckBoxClick.bind(this)}
                            disabled={this.state.showOffDisable}
                            size="lg"
                        >
                            {this.state.json['10100PSG-000024']/* 国际化处理： 显示停用*/}
                        </NCCheckbox>
			        </span>
                    {/* 按钮组 btn-group*/}
                    <div className=" btn-group">
                        {createButtonApp({
                            area: this.config.formId,
                            buttonLimit: 3,
                            onButtonClick: this.onButtonClick.bind(this),
                            popContainer: document.querySelector('.'+this.config.formId)
                        })}
                    </div>
                </NCDiv>
                {/* 树卡区域 */}
                <div className="tree-card">
                    <DragWidthCom
                        // 左树区域
                        leftDom = {
                            <div className="tree-area">
                                {createSyncTree({
                                    treeId :this.config.treeId,
                                    needEdit: true, //不启用编辑
                                    showLine: true, //显示连线
                                    needSearch: true, //是否需要搜索框
                                    onSelectEve: this.onSelectTree.bind(this),//选择
                                    onMouseEnterEve:this.onMouseEnterEve.bind(this),
                                    clickEditIconEve: this.onEditPostseries.bind(this), //编辑点击 回调
                                    clickAddIconEve: this.onAddPostseries.bind(this), //新增点击 回调
                                    clickDelIconEve: this.onDeletePostseries.bind(this), // 删除点击 回调
                                    showModal: false,
                                    searchType:'filtration',//树节点过滤方式修改
                                    disabledSearch: this.state.treeDisabledSearch
                                })}
                            </div>}     //左侧区域dom
                         // 右卡片区域
                        rightDom = {
                            <div className="card-area">
                                {createForm(this.config.formId, {
                                    cancelPSwitch: true,
                                    onAfterEvent: this.onAfterFormEvent.bind(this)
                                })}
                            </div> }     //右侧区域dom
                        defLeftWid = '280px'      // 默认左侧区域宽度，px/百分百
                        leftMinWid = '300px'
                    />
                </div>
                <PrintOutput
                    ref='printOutput'
                    url= {urls['print']}
                    data={{
                        funcode : this.config.isGlbGrp==='0'?'10100PSB':'10100PSG',
                        nodekey :'postseriesPrint',  //模板节点标识
                        oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        outputType: "output"
                    }}
                >
                </PrintOutput>
            </div>
        )
    }
}


/**
 * 创建页面
 */
export default Postseries;
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65