import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax ,NCCreateSearch} from 'nc-lightapp-front';


const {NCMenu,NCDropdown,NCMessage:Message} = base;
const {NCMenuGroup} = NCMenu;
const { Item } = Menu;

/*******
 *
 * 使用者直接替换这里的treeId，formId，searchAreaId，nodeTitle 的值
 *
 *******/

let treeId = 'epsTree';//树组件Id
let formId = 'head';//卡片组件Id
let searchAreaId = 'epsQryTemp';//查询区组件Id
let nodeTitle = '企业项目结构（EPS）-集团';//节点标题


/**
 * 企业项目结构（EPS）-集团
 */
class EpsDemo extends Component {
    constructor(props){
        super(props)

        //主动事件，绑定this指针
        this.initButtonStatus = this.initButtonStatus.bind(this);
        this.refreshTreeNode = this.refreshTreeNode.bind(this);
        this.changeButtonStatus = this.changeButtonStatus.bind(this);
        this.onStartEps = this.onStartEps.bind(this);
        this.onStopEps = this.onStopEps.bind(this);
    }

    /**
     * react 生命周期函数 组件渲染完后触发事件
     */
    componentDidMount(){
        //查根节点
        ajax({
            url:'/nccloud/uapbd/eps/loadtreedata.do',
            data:{pk_parent:"root",pk_group:"0001451000000000AJAG"},
            success:(res)=>{
                if(res.success){
                    this.props.asyncTree.setTreeData(treeId, res.data);
                }
            }

        })
        //修改按钮状态
        this.initButtonStatus();
    }
    /**
     * 页面初始设置button状态
     * @param props
     */
    initButtonStatus(){

        this.props.button.setButtonVisible('add',true);
        this.props.button.setButtonVisible('edit',true);
        this.props.button.setButtonVisible('del',true);
        // this.props.button.setButtonVisible('start',true);
        // this.props.button.setButtonVisible('stop',true);
        this.props.button.setButtonVisible('save',false);
        //设置取消按钮不显示
        this.props.button.setButtonVisible('cancel',false);
        //设置保存新增按钮不显示
        this.props.button.setButtonVisible('saveAdd',false);
        //设置所有按钮不可用
        this.props.button.setDisabled({
            add:true,
            edit:true,
            del:true
        });
    }

    /**
     * 刷新树节点
     * @param treeId
     * @param pk
     */
    refreshTreeNode(treeId,pk){
        this.props.asyncTree.closeNodeByPkAsync(treeId, pk);
        this.props.asyncTree.openNodeByPkAsync(treeId, pk);
    }

    /**
     * 点击树节点
     * @param refpk
     */
    onSelectTree(refpk){
        //编辑态  树节点操作无效  应该提供一个接口，编辑态任何操作都不能动
        let status = this.props.form.getFormStatus(formId);
        if(status == 'edit'){
            return;
        }
        if(refpk[0] == '~'){
            return;
        }
        //查询节点信息
        ajax({
            url:"/nccloud/uapbd/eps/querycard.do",
            data:{pk_eps:refpk[0]},
            success:(result)=>{

                if(result.success){
                    this.props.form.EmptyAllFormValue(formId);
                    this.props.form.setAllFormValue(result.data);

                }
            }
        });
        this.onSelectTreeNodeChange();
    }

    /**
     * 加载树数据
     * @param pid
     * @param node
     */
    onLoadTreeData(pid,node){
        //查询子节点数据
        ajax({
            url:"/nccloud/uapbd/eps/loadtreedata.do",
            data:{pk_parent:pid},
            success:(result)=>{
                if(result.success){
                    
                    this.props.asyncTree.setTreeData("epsTree",result.data,node);
                }
            }
        });
    }

    /**
     * 树节点切换监听事件
     * @param val
     */
    onSelectTreeNodeChange(val){

        
        //获得表单状态
        let formStatus = this.props.form.getFormStatus(formId);
        if(formStatus == 'edit'){
            //编辑状态下，切换树节点，不改变按钮状态
            return;
        }
        if(val){//如果有树节点选中项

            //设置按钮的显示状态
            this.props.button.setButtonVisible('add',true);
            this.props.button.setButtonVisible('edit',true);
            this.props.button.setButtonVisible('del',true);
            //this.props.button.setButtonVisible('stop',true);
            this.props.button.setButtonVisible('save',false);
            this.props.button.setButtonVisible('cancel',false);//设置取消按钮隐藏
            this.props.button.setButtonVisible('saveAdd',false);//设置保存新增按钮隐藏
            //设置显示的按钮的可编辑性
            switch(val.refpk){
                case '~':
                    this.props.button.setDisabled({
                        add:false,
                        edit:true,
                        del:true,
                    });
                    break;
                default:

                    this.props.button.setDisabled({
                        add:false,
                        edit:false,
                        del:false,
                    });
                    break;

            }
        }
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
       //some code
    }

    /**
     * 新增
     */
    onAddEps(){
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(treeId);//获得选中节点
        let requestParam = {};
        /**************************************
         *
         * 新增：
         *      1、清空表单所有数据
         *      2、构造请求参数
         *      3、ajax请求，后台设置默认值
         *      4、回调，设置默认表单对象
         *
         * 新增状态下：
         *      只有 保存  保存新增  取消  按钮显示
         **************************************/

        /**清空表单数据**/
        this.props.form.EmptyAllFormValue(formId);

        /**构造参数**/

        if (!selectedTreeNode) {
            ////判断是否有选中节点,如果没有默认加载根节点下面
            requestParam = {
                pk_parent:'~'
            };
        } else {
            requestParam = {
                pk_parent:selectedTreeNode.refpk
            };
        }
        /**ajax请求**/
        ajax({
            url: "/nccloud/uapbd/eps/addcard.do",
            data: requestParam,
            success: (result) => {

                if(result.success){

                    //设置表单默认值
                    this.props.form.setAllFormValue(result.data);
                    //设置表单为编辑态
                    this.props.form.setFormStatus(formId, 'edit');


                }

            }

        });
        this.changeButtonStatus('add');

    }

    /**
     * 编辑
     */
    onEditEps(){
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(treeId);//获得选中节点


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
         *
         **************************************************/

        /****未选中提示***/
        if (!selectedTreeNode) {

            Message.create({content: '请选中需要编辑的节点', color: 'warning'});//默认top
            return;

        }
        /***ajax请求***/
        ajax({
            url:"/nccloud/uapbd/eps/querycard.do",
            data:{pk_eps:selectedTreeNode.refpk},
            success:(result)=>{

                if(result.success){

                    //设置表单数据
                    this.props.form.setAllFormValue(result.data);

                    //设置表单状态为编辑态
                    this.props.form.setFormStatus(formId, 'edit');

                }
            }
        });
        this.changeButtonStatus('edit');

    }

    /**
     * 保存
     */
    onSaveEps(){
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(treeId);//获得选中节点
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

        let formData = this.props.form.getAllFormValue(formId);//获得表单信息
        formData.areacode = formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态

        /***设置请求参数***/
        requestParam = {
            model: formData,
            pageid: '10140EPSG'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
        };

        /****判断刷新父节点，还是刷新选中节点****/
        /************************************
         * 如果是新增，就刷新当前选中节点
         * 如果是编辑，就刷新当前节点的父节点
         *
         ************************************/
        var pk = null;
        
        if(formData.rows[0].values.hasOwnProperty('pk_eps')){

            pk = formData.rows[0].values.pk_eps.value;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点

        }
        let nonPk = false;//没有主键  false时就是有主键  即编辑 即刷新父节点
        if(pk == null || pk ==''){
            nonPk = true;// true时 就是无主键 即 新增  即刷新当前节点
        }
        //ajax请求
        ajax({
            url: '/nccloud/uapbd/eps/savenode.do',
            data: requestParam,
            success: (result) => {
                if(result.success){


                    this.props.form.setFormStatus(formId, 'browse');
                    //关闭树节点方法
                    //this.props.asyncTree.closeNodeByPkAsync(treeId, noPk?selectedTreeNode.refpk:selectedTreeNode.pid);
                    //展开树节点方法  同时触发loadTreeData方法
                    //this.props.asyncTree.openNodeByPkAsync(treeId, noPk?selectedTreeNode.refpk:selectedTreeNode.pid);

                    this.refreshTreeNode("epsTree",nonPk?selectedTreeNode.refpk:selectedTreeNode.pid);
                }

            }
        });
        this.changeButtonStatus('save');

    }

    /**
     * 保存新增
     */
    onSaveAddEps(){
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(treeId);//获得选中节点
        let requestParam = {};
        /**************************************************
         *
         * 保存新增：
         *     1、获取表单对象
         *     2、构造请求参数模型
         *     3、ajax请求，后台根据表单对象主键执行保存或更新操作
         *     4、回调，刷新当前树节点的父节点
         *
         * 保存状态下：
         *      恢复到浏览态，根据当前选中的树节点决定按钮的可见性和可操作性
         *
         **************************************************/
        let formData = this.props.form.getAllFormValue(formId);//获得表单信息
        formData.areacode = formId;
        formData.rows['status'] = '2';

        //设置请求参数
        requestParam = {
            model: formData,
            pageid: '10140EPSG'
        };
        var pkvalue = null;
        
        if(formData.rows[0].values.hasOwnProperty('pk_eps')){

            pkvalue = formData.rows[0].values.pk_eps.value;//当前表单有pk:update 刷新父节点；没有pk:save 刷新当前节点

        }
        let nonPk = false;
        if(pkvalue == null || pkvalue ==''){
            nonPk = true;
        }
        /***ajax请求***/
        ajax({
            url: '/nccloud/uapbd/eps/savenode.do',
            data: requestParam,
            success: (result) => {
                /**********
                 *
                 * 这里的代码可以精简，临时先这样，逻辑思路是一样的
                 *
                 *
                 *********/

                if(result.success){
                    //设置表单状态
                    this.props.form.setFormStatus(formId, 'browse');
                    this.refreshTreeNode("epsTree",nonPk?selectedTreeNode.refpk:selectedTreeNode.pid);
                    // this.props.asyncTree.closeNodeByPkAsync(treeId, nonPk?selectedTreeNode.refpk:selectedTreeNode.pid);
                    // this.props.asyncTree.openNodeByPkAsync(treeId,nonPk?selectedTreeNode.refpk:selectedTreeNode.pid);


                    //清空表单数据
                    this.props.form.EmptyAllFormValue(formId);
                    //判断是否有选中节点
                    if (!selectedTreeNode) {
                        //如果没有默认加载根节点下面
                        requestParam = {
                            pk_parent:'~'
                        };
                    } else {
                        requestParam = {
                            pk_parent:selectedTreeNode.refpk
                        };
                    }
                    //ajax请求
                    ajax({
                        url: "/nccloud/uapbd/eps/addcard.do",
                        data: requestParam,
                        success: (result) => {
                            if(result.success){

                                //新增成功，设置表单默认值
                                this.props.form.setAllFormValue(result.data);
                                //设置表单为编辑态
                                this.props.form.setFormStatus(formId, 'edit');
                            }
                        }

                    })
                }


            }
        });
        this.changeButtonStatus('saveAdd');

    }

    /**
     * 删除
     */
    onDeleteEps(){
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(treeId);//获得选中节点

        let requestParam = {};
        /*******************************************
         *
         * 删除：
         *      1、根据选中的树节点做出相应的提示
         *      2、弹出删除确认提示
         *      3、构造请求参数
         *      4、ajax请求，后台执行删除
         *      5、回调，执行前台删除动作
         *
         * 删除状态下：
         *      清空表单对象数据，按钮全成Disabled状态
         *
         *******************************************/
        if (!selectedTreeNode) {

            Message.create({content: '请选中需要删除的节点', color: 'warning'});//默认top
            return;

        }
        if(selectedTreeNode.refpk == '~'){
            Message.create({content: '根节点不能删除', color: 'warning'});//默认top
            return;

        }
        let message = "确认要删除所选数据吗？"
        if(selectedTreeNode.hasOwnProperty('children') && selectedTreeNode.children.length>0){
            Message.create({content: '含有子节点的树节点，在删除时，应该提示是否一并删除子节点，也就涉及Modal上套Modal的情况，应该怎么处理', color: 'warning'});//默认top
            message = "该节点包含子节点，确认删除吗？";
        }
        this.props.modal.show('modal', {
            title: '确认删除',
            content: message,
            beSureBtnClick: () => {
                
                requestParam = {
                    pk_eps:selectedTreeNode.refpk
                }
                let pid = selectedTreeNode.pid;
                ajax({
                    url:'/nccloud/uapbd/eps/deltreenode.do',
                    data:requestParam,
                    success:(result)=>{
                        if(result.success){
                            
                            this.props.form.EmptyAllFormValue(formId);
                            //调用异步树的接口，删除该树节点
                            this.props.asyncTree.delTreeData(treeId,selectedTreeNode.refpk);
                            //删除成功提示
                            Message.create({content: '删除成功！', color: 'success'});//默认top
                        }

                    }
                })
            }
        });
        this.changeButtonStatus('del');

    }

    /**
     * 取消
     */
    onCancelEps(){
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(treeId);//获得选中节点
        /**********************************************************
         *
         * 取消：
         *      1、重新根据选中的树节点查询表单对象
         *      2、回调，设置表单对象
         *      3、设置按钮状态
         *
         **********************************************************/
        if(selectedTreeNode){
            //查询节点信息
            ajax({
                url:"/nccloud/uapbd/eps/querycard.do",
                data:{pk_eps:selectedTreeNode.refpk},
                success:(result)=>{

                    if(result.success){

                        this.props.form.setAllFormValue(result.data);


                    }
                }
            });
        }else{
            //没有选中项  清空所有数据
            this.props.form.EmptyAllFormValue(formId);
        }
        this.props.form.setFormStatus(formId, 'browse');
        this.changeButtonStatus('cancel');
    }

    /**
     * 启用
     */
    onStartEps(){
        let formData = this.props.form.getAllFormValue(formId);//获得表单信息
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(treeId);//获得选中节点
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

            Message.create({content: '请选中需要启用的树节点', color: 'warning'});//默认top
        }else if(formData.rows[0].values.enablestate.value == '2'){
            Message.create({content: '该数据已启用，无需多次启用', color: 'warning'});//默认top
            return;
        }
        requestParam = {
            pk_eps:formData.rows[0].values.pk_eps.value,
            enablestate:'2'
        }
        ajax({
            url:"/nccloud/uapbd/eps/enablestate.do",
            data:requestParam,
            success:(result)=>{
                //启用成功，设置表单数据
                this.props.form.setAllFormValue(result.data);
                //关闭 展开，可以做一个refreshTreeNode方法

                this.refreshTreeNode("epsTree",selectedTreeNode.pid);
                // this.props.asyncTree.closeNodeByPkAsync(treeId, selectedTreeNode.pid);
                // this.props.asyncTree.openNodeByPkAsync(treeId, selectedTreeNode.pid);
            }
        });
        this.changeButtonStatus('start');
    }

    /**
     * 停用
     */
    onStopEps(){
        let formData = this.props.form.getAllFormValue(formId);//获得表单信息
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(treeId);//获得选中节点
        let requestParam = {};

        if(!selectedTreeNode){

            Message.create({content: '请选中需要停用的树节点', color: 'warning'});//默认top
        }else if(formData.rows[0].values.enablestate.value == '1'){
            Message.create({content: '该数据已停用，无需多次停用', color: 'warning'});//默认top
            return;
        }
        requestParam = {
            pk_eps:formData.rows[0].values.pk_eps.value,
            enablestate:'1'
        }
        
        ajax({
            url:"/nccloud/uapbd/eps/enablestate.do",
            data:requestParam,
            success:(res)=>{
                if(res.success){

                    this.props.form.EmptyAllFormValue(formId);

                    this.refreshTreeNode("epsTree",selectedTreeNode.pid);
                    // this.props.asyncTree.closeNodeByPkAsync(treeId, selectedTreeNode.pid);
                    // this.props.asyncTree.openNodeByPkAsync(treeId, selectedTreeNode.pid);
                }
            }
        });
        this.changeButtonStatus('stop');
    }

    /*****button group end*****/

    /**
     * 查询按钮点击事件
     * @param props
     * @param val
     */
    onClickSearchBtn(props,val){
        let url = "/uapbd/eps/main/list/index.html";
        //获得查询区域条件
        // let data = props.search.getAllSearchData("epsQryTemp");
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
        
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log(visible);
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~");
    }

    /**
     * 更多按钮占位事件
     */
    onMore(){
        
    }

    /**
     * 按钮点击状态切换监听事件
     * @param id
     */
    changeButtonStatus(id){
        let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(treeId);//获得选中节点
        switch(id){
            case 'add':
            case 'saveAdd':
                this.props.button.setButtonVisible('add',false);
                this.props.button.setButtonVisible('edit',false);
                this.props.button.setButtonVisible('del',false);
                // this.props.button.setButtonVisible('stop',false);
                this.props.button.setButtonVisible('save',true);
                this.props.button.setButtonVisible('saveAdd',true);
                this.props.button.setButtonVisible('cancel',true);
                this.props.button.setDisabled({
                    save:false,
                    saveAdd:false,
                    cancel:false
                });
                
                this.props.asyncTree.setAsyncNodeDisable(treeId, true);
                break;
            case 'edit':
                this.props.button.setButtonVisible('add',false);
                this.props.button.setButtonVisible('edit',false);
                this.props.button.setButtonVisible('del',false);
                //this.props.button.setButtonVisible('stop',false);
                this.props.button.setButtonVisible('save',true);
                this.props.button.setButtonVisible('saveAdd',false);
                this.props.button.setButtonVisible('cancel',true);
                this.props.button.setDisabled({
                    save:false,
                    cancel:false
                });
                this.props.asyncTree.setAsyncNodeDisable(treeId, true);
                break;
            case 'del':
                this.props.button.setButtonVisible('add',true);
                this.props.button.setButtonVisible('edit',true);
                this.props.button.setButtonVisible('del',true);
                //this.props.button.setButtonVisible('stop',true);
                this.props.button.setButtonVisible('save',false);
                this.props.button.setButtonVisible('saveAdd',false);
                this.props.button.setButtonVisible('cancel',false);
                this.props.button.setDisabled({
                    add:false,
                    edit:false,
                    del:false,
                });
                break;
            case 'save':
            case 'cancel':
                this.props.button.setButtonVisible('add',true);
                this.props.button.setButtonVisible('edit',true);
                this.props.button.setButtonVisible('del',true);
                //this.props.button.setButtonVisible('stop',true);
                this.props.button.setButtonVisible('save',false);
                this.props.button.setButtonVisible('saveAdd',false);
                this.props.button.setButtonVisible('cancel',false);
                if(!selectedTreeNode){
                    //无选中节点，按钮不可用
                    this.props.button.setDisabled({
                        add:true,
                        edit:true,
                        del:true,
                    });
                }else if(selectedTreeNode.refpk =='~'){
                    //选中根节点，只有新增可用
                    this.props.button.setDisabled({
                        add:false,
                        edit:true,
                        del:true,
                    });
                }else{
                    //选中非根节点，显示状态的按钮都可用
                    this.props.button.setDisabled({
                        add:false,
                        edit:false,
                        del:false,
                    });
                }
                this.props.asyncTree.setAsyncNodeDisable(treeId, false);
            default :
                break;
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
        const {asyncTree,form,button,modal,search,DragWidthCom} = this.props;

        const {createAsyncTree} = asyncTree;//创建异步树，需要引入这个

        const {createForm} = form;//创建表单，需要引入这个

        const {createButton}=button;

        let { createModal } = modal;  //模态框

        const {NCCreateSearch} = search;
        const menu1 = (
            <Menu
                onSelect={this.onMoreSelect.bind(this)}>
                <Item key="start">启用</Item>
                <Item key="stop">停用</Item>
            </Menu>
        );
        return(

            <div>
                {createModal('modal',{noFooter:false})}
                {/* 头部 header*/}
                <div className="header">
                    {/* 标题 title*/}
                    <div className="title">{nodeTitle}</div>
                    {/* 按钮组 btn-group*/}
                    <div className=" btn-group">
                        { createButton('add', {name: '新增', colors:'danger', onButtonClick: this.onAddEps.bind(this) })}
                        { createButton('edit', {name: '编辑',colors:'danger', onButtonClick: this.onEditEps.bind(this)})}
                        {/*{ createButton('start', {name: '启用',colors:'danger', onButtonClick: this.headerButtonClick.bind(this) })}*/}
                        {/*{ createButton('stop', {name: '停用',colors:'danger', onButtonClick: this.headerButtonClick.bind(this) })}*/}
                        { createButton('save', {name: '保存',colors:'danger', onButtonClick: this.onSaveEps.bind(this) })}
                        { createButton('saveAdd', {name: '保存新增',colors:'danger',style:{width:'90px'}, onButtonClick: this.onSaveAddEps.bind(this) })}
                        { createButton('del', {name: '删除',colors:'danger', onButtonClick: this.onDeleteEps.bind(this) })}
                        { createButton('cancel', {name: '取消',colors:'danger', onButtonClick: this.onCancelEps.bind(this) })}
                        <Dropdown
                            trigger={['click']}
                            overlay={menu1}
                            animation="slide-up"
                            onVisibleChange={this.onVisibleChange.bind(this)}>
                            { createButton('more', {name: '更多',colors:'danger', onButtonClick:this.onMore.bind(this)})}
                        </Dropdown>
                    </div>
                </div>
                <div className="search-area">
                    { NCCreateSearch(
                        searchAreaId,
                        {
                            clickSearchBtn: this.onClickSearchBtn.bind(this),//点击按钮事件
                            maxNum: 4   //一行显示几个字段，默认6个
                        }
                    )}

                </div>

                {/* 树卡区域 */}
                <div className="tree-card">

                    <DragWidthCom
                         // 左树区域
                        leftDom = {
                            <div className="tree-area">
                                {createAsyncTree({
                                    treeId:treeId,
                                    onSelectEve: this.onSelectTree.bind(this),
                                    loadTreeData: this.onLoadTreeData.bind(this),
                                    onSelectedChange:this.onSelectTreeNodeChange.bind(this),
                                    showLine:true
                                })
                                }
                            </div>}     //左侧区域dom
                         // 右卡片区域
                        rightDom = {
                            <div className="card-area">
                                {createForm(formId, {
                                    onAfterEvent: this.onAfterFormEvent.bind(this)

                                })
                                }
                            </div> }     //右侧区域dom

                        defLeftWid = '20%'      // 默认左侧区域宽度，px/百分百
                    />
                </div>

            </div>

        )
    }
}

/**
 * 单据模板
 * @param props
 */
const initTemplate = (props)=>{

    ajax({
            url: '/nccloud/platform/templet/querypage.do',
            data:{pagecode:"10140EPSG"},
            success: function (res) {
                
                console.log(res);

                //let meta = res.data.head;
                // 
                //对返回的meta进行处理
                //meta = modifierMeta(meta,props);

                props.meta.setMeta(res.data);
            }
        });

}

/**
 * 更新元数据 设置参照
 * @param meta
 * @param props
 * @returns {*}
 */
function  modifierMeta(meta,props) {
    // props.renderItem('form',formId,'parent_id',refer('parent_id'));
    // props.renderItem('form',formId,'pk_group',refer('pk_group'));
    return meta;

}

/**
 * 创建页面
 */
export default EpsDemo = createPage({
    initTemplate: initTemplate,
})(EpsDemo)

/**
 * 渲染页面
 */
ReactDOM.render(<EpsDemo/>, document.querySelector('#app'));
