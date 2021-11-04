//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,high,promptBox,createPageIcon} from 'nc-lightapp-front';
const { NCUploader } = high;  
const { NCDiv } = base;
import './index.less'
import  Utils from '../../../public/utils';
import UploadImg from '../../../../uap/public/packages/uploadImg';
const {NCMessage:Message,NCCol:Col,NCRow:Row,NCDropdown:Dropdown,NCMenu:Menu,NCButton:Button,NCCheckbox:Checkbox,NCTooltip:Tooltip}=base;
const {NCMenu,NCDropdown,NCCheckbox,NCPopconfirm} = base;
const {NCMenuGroup} = NCMenu;
const { Item } = Menu;

/****************默认参数  开始***********************/
let formId = 'head';//卡片组件Id
let urls={
    loadTreeDataUrl:"/nccloud/baseapp/group/treequery.do",
    queryCardUrl:"/nccloud/baseapp/group/cardquery.do",
    saveUrl:'/nccloud/baseapp/group/cardsave.do',
    refreshUrl:'/uapbd/org/group/main/index.html'
};
let pageCode="10100GRP_groupdoc";
/***************默认参数  结束********************/

/**
 * 集团
 */
class Postseries extends Component {
    constructor(props){
        super(props)
        this.config =Object.assign({
            treeId:"epsTree",
            formId:"head",
            pageCode:"10100GRP_groupdoc",
            nodeType:'GROUP_NODE',
            isGlbGrp:'1',
            urls:urls
        },props.config);

        //显示停用复选框的状态标志
        this.state = {
            json:{},//多语资源文件数据
            imgSrc:'',
            imgModalShow:false,
            status:'browse',//标记页面状态，控制参照查询区 的显隐性
            showUploader: false,//logo管理
            target: null,//logo管理
            pk_group:'~',//用于保存选中的树节点pk
            checked: false,//判断 显示停用按钮是否选中
            curSelectedNode: null //直接点击树节点操作按钮时 用于记录selectedNode
        }

        //加载多语资源
		Utils.initPage(
			props,
			pageCode,
			'10100GRP',//多语资源编码
			()=>{
                //自定义根节点
                this.root = {
                    "isleaf": false,
                    "key":"~",
                    "id":"~",
                    "innercode":"~",
                    "pid": "",
                    "refname": this.state.json['10100GRP-000000'],/* 国际化处理： 集团*/
                    "refpk": "~"
                };
                //主动事件，绑定this指针
                this.dealTreeData = this.dealTreeData.bind(this);
				//初始化只显示刷新按钮
                props.button.setDisabled({
                    edit:true,
                    refresh:false,
                    queryBusiInfo:true,
                    logo:true
                });
				return this.modifierMeta(this.props.meta.getMeta(), props);
			},
			()=>{
				this.loadData();
			},
			this
		);
    }

    modifierMeta(meta,props) {
        meta[formId].items.map((item)=>{
            if(item.attrcode=="industry"){
                item.queryCondition=()=>{
                    return {pk_defdoclist:'1009ZZ100000000034NN'}//所属行业自定义档案参照
                };
                //item.placeholder='所属行业';
                //item.rootNode={ refname: '自定义档案(树)', refpk: 'root' };
            }
            if(item.attrcode=="ecotype"){
                item.queryCondition=()=>{
                    return {pk_defdoclist:'1009ZZ100000000034NZ'}//经济类型自定义档案参照
                };
            }
            if(item.attrcode=="countryarea"){
                item.queryCondition=()=>{
                    let pk_country=props.form.getFormItemsValue(formId,'countryzone').value;
                    return {pk_country:pk_country}//经济类型自定义档案参照
                };
            }
        }
    
        );
        return meta;
    
    }


    componentDidUpdate(){
		if(this.state.status === 'edit'){
			window.onbeforeunload=()=>{
				return '';
			}
		}else{
			window.onbeforeunload=null;
		}
	}

    /**
     * 处理树数据
     * @param data
     * @returns {*}
     */
    dealTreeData(data){
        let deleteDataChildrenProp = function(node){
            node.beforeName=node.code?(node.code+'  '):'';
            //node.beforeName=node.code;
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
            deleteDataChildrenProp(e);
        });
        return data;
    }

    loadData(prompt){
        /**************
         * 构造请求参数
         * @type {{checked: boolean}}
         *************/
        let requestParam = { checked:this.state.checked,isGlbGrp: this.config.isGlbGrp};

        /*************
         * ajax请求 加载树数据
         *************/
        ajax({

            url:this.config.urls.loadTreeDataUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    //适配显示公式
                    if(result.formulamsg&&result.formulamsg instanceof Array&&result.formulamsg.length>0){
                        this.props.dealFormulamsg(
                            result.formulamsg,
                            {
                                "head":"form"
                            }
                        );
                    }
                    
                    let data = [Object.assign( {...this.root} , {children : result.data} )];
                    //同步树  加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId , this.dealTreeData(data));
                    //展开节点  设置默认展开项
                    if(this.state.pk_group=='~'){
                        this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                    }else{
                        this.props.syncTree.setNodeSelected(this.config.treeId, this.state.pk_group);
                        this.props.syncTree.openNodeByPk(this.config.treeId, this.state.pk_group);
                    }

					//默认情况选中第一节点
                    if(result.data[0].key){
                        this.props.syncTree.setNodeSelected(this.config.treeId, result.data[0].key);
                        this.onSelectTree(result.data[0].key);//默认选中第一条
                    }

                    //如果刷新成功，需要给出提示
					if(prompt&&(prompt instanceof Function)){
						prompt();
					}
                    
                }
            }
        });
        this.updateButtonStatus('browse');
    }

    /**
     * 点击树节点
     * @param refpk
     */
    onSelectTree(refpk){

        this.setState({pk_group:refpk});
        //编辑态  树节点操作无效  应该提供一个接口，编辑态任何操作都不能动
        let status = this.props.form.getFormStatus(this.config.formId);
        if(status == 'edit'){
            return;
        }

        if(refpk == this.root.refpk){
            //清空表单
            this.props.form.EmptyAllFormValue(this.config.formId);
            //设置只有刷新按钮可用
            this.props.button.setDisabled({
                edit:true,
                refresh:false,
                queryBusiInfo:true,
                logo:true
            });
            return;
        }
        //
        /********************************
         * ajax 请求选择的树节点数据
         ********************************/
        ajax({
            url:this.config.urls.queryCardUrl,
            data:{pk_group:refpk,isGlbGrp: this.config.isGlbGrp},
            success:(result)=>{

                if(result.success){
                    //表单数据
                    let headData = result.data.head.rows[0].values;
                    if(headData.hasOwnProperty('enablestate')){ 
                        let enablestateValue = headData.enablestate.value;
                        //根据表单项enablestate的值修改开关状态
                        if(enablestateValue == '2'){
                            //result.data.head.rows[0].values.enablestate.value = true;
                        }else{
                            //result.data.head.rows[0].values.enablestate.value = false;
                        }
                    }
                    
                    //清空表单
                    this.props.form.EmptyAllFormValue(this.config.formId);
                    //设置表单为所选树节点数据
                    this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});
                    //设置表单项enablestate可用
                    this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:false});
                    //设置所有按钮可用
                    this.props.button.setDisabled({
                        edit:false,
                        refresh:false,
                        queryBusiInfo:false,
                        logo:false
                    });

                }
            }
        });
    }


    /**
     * 表单编辑事件
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param index
     */
    onAfterFormEvent(props, moduleId, key, value, index){
    }

    /*****button group end*****/

    /**
     * 查询按钮点击事件 貌似没用？？？？？
     * @param props
     * @param val
     */
    onClickSearchBtn(props,val){
        let url = "/uapbd/eps/main/list/index.html";
        //获得查询区域条件
        let param = {};
        if(val!=null){
            val.map((e)=>{
                
                param[e.field] = e.value.firstvalue;
            });
        }


        props.linkTo(
            url,param
        );
    }

    /**
     * 更多按钮点击更多选项时触发事件
     * @param key
     */
    onMoreSelect({ key }) {
        if(key == 'start'){
            this.onStartEps();
        }else if(key == 'stop'){
            this.onStopEps();
        }

    }

    /**
     * 更多选项，切换选项时触发事件
     * @param visible
     */
    onVisibleChange(visible) {
    }

    /**
     * 更多按钮占位事件
     */
    onMore(){
    }

    /**
     * 同步树：新增回调   【目前废弃】
     * @param data
     * @param pk
     * @param node
     */
    onAddNodeCallBack(data,pk,node){
        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);

        let requestParam = {};//请求参数对象

        if(selectNode){
            //存在选中节点，设置父节点pk为选中节点refpk

            requestParam['pid'] = selectNode.refpk;
        }else{
            //不存在选中节点，设置父节点为根节点refpk
            requestParam['pid'] = this.root.refpk;
        }

        ajax({
            url:this.config.urls.addCardUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
                    //this.props.form.setAllFormValue(result.data);//设置新增默认值
                    this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});
                    this.props.form.setFormStatus(this.config.formId, 'edit');//设置表单为编辑态
                    this.props.syncTree.setNodeDisable(this.config.treeId,true);//编辑时设置整棵树不可用
                }
            }
        })



    }

    /**
     * 编辑回调   【目前废弃】
     * @param data
     * @param pk
     * @param node
     */
    onEditNodeCallBack(data,pk,node){
        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);

        let requestParam = {isGlbGrp: this.config.isGlbGrp};//请求参数对象

        if(selectNode){
            //存在选中节点，设置父节点pk为选中节点refpk

            requestParam['pk_postseries'] = selectNode.refpk;
        }else{
            Message.create({content: this.state.json['10100GRP-000001'], color: 'warning'});//默认top/* 国际化处理： 请选中需要编辑的节点*/
            return;
        }
        ajax({
            url:this.config.urls.queryCardUrl,
            data:requestParam,
            success:(result)=>{
                this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
               this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});
                this.props.form.setFormStatus(this.config.formId, 'edit');//设置表单为编辑态
                this.props.syncTree.setNodeDisable(this.config.treeId,true);//编辑时设置整棵树不可用
            }
        })
    }

    /**
     * 删除回调   【目前废弃】
     * @param data
     * @param pk
     * @param node
     */
    onDelNodeCallBack(data,pk,node){
        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);

        //集团不允许删除全局下的数据
        if(this.config.isGlbGrp=='1' && !selectNode.nodeData.isModify){
            Message.create({content: this.state.json['10100GRP-000002'], color: 'warning'});//默认top/* 国际化处理： 集团节点只能维护当前登录集团的数据！*/
            return;
        }

        let requestParam = {isGlbGrp: this.config.isGlbGrp};//请求参数对象

        if(selectNode){
            //存在选中节点，设置父节点pk为选中节点refpk
            requestParam['pk_postseries'] = selectNode.refpk;
        }else{
            Message.create({content: this.state.json['10100GRP-000003'], color: 'warning'});//默认top/* 国际化处理： 请选中需要删除的节点*/
            return;
        }
        ajax({
            url:this.config.urls.deleteUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    //删除成功事件
                    this.props.syncTree.delNodeSuceess(this.config.treeId,selectNode.refpk);
                }

            }
        })
    }

    /**
     * 鼠标进入树节点事件
     * @param key
     */
    onMouseEnterEve(key){
        //设置
        if(key === this.root.refpk){
            let obj = {
                delIcon:false, //false:隐藏； true:显示; 默认都为true显示
                editIcon:false,
                addIcon:true
            };
            this.props.syncTree.hideIcon(this.config.treeId, key, obj );
        }

    }

    /**
     * enablestate change 事件
     * @param checked
     */
    onChange(checked){
        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);//获得树节点选中项
        let requestParam = {};
        if(!selectNode ){
            Message.create({content: this.state.json['10100GRP-000004'], color: 'warning'});//默认top/* 国际化处理： 请选中树节点*/
        }
        requestParam['pk_group'] = selectNode.refpk;
        requestParam['enablestate'] = checked?'2':'1';
        requestParam['isGlbGrp'] = this.config.isGlbGrp
        ajax({
            url:this.config.urls.enablestateUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success) {
                    if (checked) {
                        //如果是选中 那就把数据再加载到表单
                        this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});
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
     * checkbox change 事件
     */
    onCheckBoxChange(){
        let checked = this.state.checked;
        let requestParam = {
          checked:this.state.checked,
          isGlbGrp: this.config.isGlbGrp
        };
        ajax({
            url:this.config.urls.loadTreeDataUrl,
            data:requestParam,
            success:(result)=>{
                if(result.success){
                    var data = [Object.assign( {...this.root} , {children : result.data} )],
                        initLeaf = function(node){
                            if(!node.children || node.children.length == 0) {
                                
                                delete node.children;
                            }
                            else{
                                node.isLeaf = false;
                                node.children.forEach( (e) => {
                                    initLeaf(e);
                                } );
                            }
                        };

                    data.forEach( (e) => {
                        initLeaf(e);
                    });

                    //同步树 加载全部数据
                    this.props.syncTree.setSyncTreeData(this.config.treeId , data);
                    //展开节点  设置默认展开项
                    this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                }

            }
        })
    }

    /**
     * checkbox 选中事件
     */
    onCheckBoxClick(){

        this.setState({checked:!this.state.checked});
        this.props.form.EmptyAllFormValue(this.config.formId);//清空表单数据
    }

    //按钮点击事件
	onButtonClick(props,id) {
		switch (id) {
            case 'logo':
                const that = this;
                ajax({
                    loading: true,
                    url: '/nccloud/group/group/grouplogo.do',
                    data:this.state.pk_group,
                    success: function (res) {
                        if(res.success){
                            that.setState({imgSrc: res.data})
                        }else {
                            alert(res.message)
                        }
                    },
                    error: function (res) {
                        alert(res.message)
                    }
                });
        
                this.setState({imgModalShow: true});
                break;
            case 'queryBusiInfo':
                if(this.state.pk_group!=this.root.refpk){
                    this.props.openTo('/nccloud/resources/uapbd/org/orgunit_glb/main/#/list',{appcode:'10100ORG',pagecode:'10100ORG_orgunit'});
                }else{
                    this.props.openTo('/nccloud/resources/uapbd/org/orgunit_glb/main/#/list',{appcode:'10100ORG',pagecode:'10100ORG_orgunit'});
                }
                
                break;
			case 'refresh':
                this.loadData(()=>{
                    this.onSelectTree(this.state.pk_group);//根据刷新前是否有选中的树节点信息选择加载卡片数据
                    toast({title:this.state.json['10100GRP-000019']/* 国际化处理： 刷新成功！,刷新成功*/,color:'success'});
                });//加载树结构直接判断是否之前有选中的树节点
				break;
            case 'edit':
                this.state.status='edit';
                this.setState(this.state);
                this.props.form.setFormItemsDisabled(this.config.formId,{'enablestate':true});
                this.props.syncTree.setNodeDisable(this.config.treeId,true);//编辑时设置整棵树不可用
                if(!this.props.syncTree.getSelectNode(this.config.treeId)||this.props.syncTree.getSelectNode(this.config.treeId).id=='~'){
                    return;
                }
                this.props.form.setFormStatus(this.config.formId, 'edit');
                this.updateButtonStatus('edit');
				break;
            case 'cancel':
                promptBox({
                    color:'warning',
                    title : this.state.json['10100GRP-000020'],/* 国际化处理： 确认取消,确认取消*/
                    content : this.state.json['10100GRP-000021'],/* 国际化处理： 是否确认取消？,是否确认取消*/
                    beSureBtnClick : (()=>{
                        this.props.form.cancel(this.config.formId);
                        this.updateButtonStatus('browse');
                        this.props.syncTree.setNodeDisable(this.config.treeId,false);//设置整棵树可用
                        this.state.status='browse';
                        this.setState(this.state);
                    })
                });
				break;
            case 'save':
                //form表单必输项校验
				if(!this.props.form.isCheckNow(this.config.formId)){
					//toast({color:'danger',content:'请输入必输项！'});
					return;
				}

                let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
                //适配校验公式
                formData.areacode=this.config.formId;

                formData.rows['status'] = '2';//设置状态
                let requestParam = {
                    model: formData,
                    pageid: this.config.pageCode,//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                };
                //ajax请求
                let saveCallBack=()=>ajax({
                    url: this.config.urls.saveUrl,
                    data: requestParam,
                    success: (result) => {
                        if(result.success){
                            toast({title:this.state.json['10100GRP-000005'],color:'success'});/* 国际化处理： 保存成功*/
                            //设置表单浏览态
                            this.props.form.setFormStatus(this.config.formId, 'browse');
                            //设置树可用
                            this.props.syncTree.setNodeDisable(this.config.treeId,false);

                            this.props.form.EmptyAllFormValue(this.config.formId);
                            //新增成功，设置表单默认值
                            //this.props.form.setAllFormValue(result.data);
                            this.props.form.setAllFormValue({[this.config.formId]:result.data[this.config.formId]});

                            let requestParam = { checked:this.state.checked};

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
                                        //展开节点  设置默认展开项
                                        this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
                                        this.props.syncTree.setNodeSelected(this.config.treeId, result.data[0].refpk);
                                    }
                                }
                            });
                            //清空自定已选中项
                            this.updateButtonStatus('browse');
                            this.state.status='browse';
                            this.setState(this.state);
                        }

                    }
                });
                this.props.validateToSave(requestParam,saveCallBack,{'head':'form'},'form');
				break;
		}
	
	}

    //卡片区状态监听，用于调整按钮状态
    updateButtonStatus(status){
        if(/*this.props.form.getFormStatus(formId) === 'edit'*/status=='edit'){//编辑状态
			this.props.button.setButtonsVisible({
                edit:false,
                refresh:false,
                queryBusiInfo:false,
                logo:false,
				save: true,
                cancel: true
			});
		}else{//浏览态
			this.props.button.setButtonsVisible({
				edit:true,
                refresh:true,
                queryBusiInfo:true,
                logo:true,
				save: false,
                cancel: false
			});
		}
    }

    // 附件的关闭点击
    onHideUploader = () => {
        this.setState({
            showUploader: false
        })
    }

    beforeUpload(billId, fullPath, file, fileList) {  
        // 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
        if(fileList.length > 0){
            toast({content:this.state.json['10100GRP-000006'],color:'warning'});/* 国际化处理： logo只允许上传一张图片，请先删除原图片！*/
            return false;
        }
        let isJPG = false;
        if(file.type === 'image/jpeg' || file.type === 'image/png'){
            isJPG = true;
        }

        if (!isJPG) {
            toast({content:this.state.json['10100GRP-000007'],color:'warning'});/* 国际化处理： 只支持jpg,png格式图片！*/
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            toast({content:this.state.json['10100GRP-000008'],color:'warning'});/* 国际化处理： 上传大小小于2M！*/
        }
        return isJPG && isLt2M;
        // 备注： return false 不执行上传  return true 执行上传
    }

    //图片上次预览begin
    closeModal(val) {//关闭模态框
        if(val == 'del') {
            this.setState({
                imgSrc: ''
            })
        }
        this.setState({
            imgModalShow: false
        })
    }
    uploadSuccess(info) {
        this.setState({
            imgSrc :' '
        }, () => {
            this.render();
        })
        this.setState({
            imgSrc :info.data
        }, () => {
            this.render();
        })
        console.log('info2', info);
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
        const {BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        const {asyncTree,syncTree,form,button,modal,search,DragWidthCom} = this.props;
        //DragWidthCom 平台出的左右布局的组件  专用于树卡和树表
        const {createAsyncTree} = asyncTree;//创建异步树，需要引入这个
        const {createSyncTree} = syncTree;//创建同步树 需要引入这个
        const {createForm} = form;//创建表单，需要引入这个

        const {createButton}=button;

        let { createModal } = modal;  //模态框

        let { createButtonApp } = button;

        const {NCCreateSearch} = search;

        //适配集团管理logo上传功能
        const props = {
            name: 'file',
            data:{"pk_org":this.state.pk_group,
                  "billType":this.state.billType,
                  "importProcess":this.state.importProcess},
            action: '/nccloud/group/group/logosave.do',
            accept:"image/*",
            headers: {
              authorization: 'authorization-text',
            },
            onChange(info) {
                // debugger;
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                  //记录成功或失败信息
                  if(info.file.response.error){
                      if(info.file.response.error.message){
                          alert(info.file.response.error.message);
                      }
                  }
                  if(info.file.response.success){
                    _this.props.modal.show('hint');
                  }
                console.log(`${info.file.name} file uploaded successfully`);
              } else if (info.file.status === 'error') {
                console.log(`${info.file.name} file upload failed.`);
              }
            },
          };
        return(            
            <div className='nc-bill-tree-card'>
                {createModal('modal',{noFooter:false})}
                {createModal('hint',{title:this.state.json['10100GRP-000009']/* 国际化处理： 提示*/,content:this.state.json['10100GRP-000010']/* 国际化处理： 上传成功*/})}
                {/* 头部 header*/}
                <NCDiv  areaCode={NCDiv.config.HEADER} className="header" >
                    {/* {createPageIcon()} */}
                    {/* 标题图标 */}
                    {/* 标题 title*/}
                    <div className="title title-text">
	                    {createBillHeadInfo({
                            title:this.state.json['10100GRP-000000']/* 国际化处理： 集团*/,
                            initShowBackBtn:false
                        }	
                        )}
                    </div>
                    {/* <div className="title title-text">{this.state.json['10100GRP-000000']/* 国际化处理： 集团}</div> */}
                    
                    {/* 按钮组 btn-group*/}
					<div className="btn-group">
						{createButtonApp({
							area: 'list_btn',
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
                        leftDom = {
                            <div className="tree-area">
                                {createSyncTree({
                                    treeId :this.config.treeId,
                                    needEdit: false, //不启用编辑
                                    showLine: false, //显示连线
                                    disabledSearch:this.state.status=='browse'?false:true,
                                    onSelectEve: this.onSelectTree.bind(this),//选择
                                    onMouseEnterEve:this.onMouseEnterEve.bind(this),
                                    showModal:false

                                })}
                            </div>}     //左侧区域dom
                         // 右卡片区域
                        rightDom = {
                            <div className="card-area">
                                {createForm(this.config.formId, {
                                    onAfterEvent: this.onAfterFormEvent.bind(this)
                                })
                                }
                            </div> }     //右侧区域dom

                        defLeftWid = '280px'      // 默认左侧区域宽度，px/百分百
                    />
                </div>

                {/* 图片上传 */}
                <UploadImg
                    paramObj = {{
                        "pk_org":this.state.pk_group,
                        "billType":this.state.billType,
                        "importProcess":this.state.importProcess
                    }}
                    uploadModalShow={this.state.imgModalShow}
                    uploadAction = '/nccloud/group/group/logosave.do'
                    uploadTitle={this.state.json['10100GRP-000017']/* 国际化处理： logo上传*/}
                    uploadImgSrc={this.state.imgSrc}
                    onCloseModal={this.closeModal.bind(this)}
                    onUploadSuccess={this.uploadSuccess.bind(this)}
                    delImgAction="/nccloud/group/group/grouplogoupdel.do"
                    delParamObj = {
                        this.state.pk_group
                    }/>
                {/* 这里是附件上传组件的使用，需要传入三个参数 */}
                {this.state.showUploader && <NCUploader 
                        billId={'logo/'+this.state.pk_group} 
                        //billNo={'001'}
                        //target={this.state.target}
                        multiple={false}
                        placement={'bottom_right'}
                        beforeUpload={this.beforeUpload}
                        onHide={this.onHideUploader}/>
                    }
            </div>

        )
    }
}

/**
 * 创建页面
 */
export default Postseries = createPage({
    billinfo:{
        billtype:'form',
        pagecode:pageCode,
        headcode:formId
    },
    initTemplate: ()=>{},
})(Postseries)

/**
 * 渲染页面
 */
ReactDOM.render(<Postseries {...{config:{
    pageCode:'10100GRP_groupdoc',
    nodeType:'GLOBE_NODE',
    formId:'head',
    treeId:'epsTree',
    isGlbGrp:'0'
}}}/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65