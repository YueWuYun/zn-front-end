//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, toast, print, high, promptBox,createPageIcon } from 'nc-lightapp-front';
import Utils from '../../../public/utils/index';
const { NCCheckbox, NCDiv,NCMessage } = base;
const { PrintOutput } = high;
const URLS = {
    loadTreeDataUrl:"/nccloud/uapbd/projecttype/loadtreedata.do",
    queryCardUrl:"/nccloud/uapbd/projecttype/querycard.do",
    enablestateUrl:"/nccloud/uapbd/projecttype/enablestate.do",
    addCardUrl:"/nccloud/uapbd/projecttype/addcard.do",
    deleteUrl:'/nccloud/uapbd/projecttype/deltreenode.do',
    saveUrl:'/nccloud/uapbd/projecttype/savenode.do',
    printUrl:'/nccloud/uapbd/eps/printProjecttype.do'
};
export default class ProjectType extends Component{
    constructor(props){
        super(props);
        this.state = {afterInit:false};
        const createUIDomParam = (pagecode, appcode) =>{
            let param  = {pagecode:pagecode};
            return window.location.href.startsWith('http://localhost:3006') ? {...param, appcode: appcode} : param;
        };
        this.loadTemplateAndLang(//加载模板和多语
            {...createUIDomParam(this.props.pagecode, this.props.appcode)},
            {moduleId: '10140PRJT',domainName: 'uapbd'},
            (data,multiLang)=>{
                this.MultiLang = multiLang;//多语
                this.root.refname = this.root.title = this.MultiLang['10140PRJT-000000'];
                this.resetState(()=>{
                    this.props.meta.setMeta(data.template,()=>{this.loadTreeData(this.setTreeData);});//设置模板
                    this.props.button.setButtons(data.button,this.setButtonStatus);//设置按钮
                });
            });
    }
    MultiLang = {};
    root = {refpk:'~',refname:'',title:'',refcode:'~',key:'~',id:'~',isleaf:false};
    /****************************
     * 加载模板和多语
     ***************************/
    loadTemplateAndLang = (tempParam,langParam,callback)=> {
        let template,lang;//模板 、多语
        this.props.createUIDom(tempParam,(data)=>{
            template = data;
            !!lang && callback && callback(template,lang);
        });
        this.props.MultiInit.getMultiLang(Object.assign(langParam,{callback:(json, status, inlt)=>{
            lang = json;// this.inlt = inlt;
            !!template && callback && callback(template,lang); 
        }}));  
    }
    /***************************
     * 重置state
     ***************************/
    resetState = (callback)=>{
        this.state = {
            status:'browse',
            curSelectNode:null,//选中节点
            afterInit:true,
            treeCfg : {
                treeId :this.props.treeId,
                needEdit: true, //不启用编辑
                showLine: false, //显示连线
                needSearch: true, //是否需要搜索框
                selectedKeys:[],
                onSelectEve: this.onSelectTree,//选择
                onMouseEnterEve:this.onMouseEnterEve,
                clickEditIconEve: this.onEditProjectType, //编辑点击 回调
                clickAddIconEve: this.onAddProjectType, //新增点击 回调
                clickDelIconEve: this.onDeleteProjectType, // 删除点击 回调
                showModal:false,
                disabledSearch:false,
            },//树配置
            showOff : {
                checked:false,
                onChange:()=>{this.state.showOff.checked = !this.state.showOff.checked;this.setState(this.state,this.loadTreeData)},
                disabled:false
            },//显示停用配置
            btnCfg : {
                area: this.props.formId,
                buttonLimit: 3,
                onButtonClick: this.onButtonClick,
                popContainer: document.querySelector('.'+this.props.formId)
            },//按钮配置
            cardCfg : {
                onAfterEvent: this.onAfterFormEvent,
                onBeforeEvent:this.onBeforeFormEvent,
                cancelPSwitch:true
            },//卡片配置
            printCfg : {
                ref : 'printOutput',
                url : URLS.printUrl,
                data :{
                    funcode:'10140PRJTG',
                    nodekey:'',     //模板节点标识
                    oids: null,    
                    outputType: "output"
                }
            }
        };
        this.setState(this.state,callback);
    }
    /***************************
     * 加载树数据
     * @param callback 设置树数据
     ***************************/
    loadTreeData = (callback)=>{
        let {checked} = this.state.showOff; let {nodeType} = this.props;
        ajax({
            url:URLS.loadTreeDataUrl,
            data:{ showOff:checked,nodeType:nodeType},
            success:(res)=>{
                res.success && (callback ? callback(res.data,()=>{
                    this.props.syncTree.openNodeByPk(this.props.treeId, this.root.refpk);//展开根节点
                }):this.setTreeData(res.data,()=>{
                    this.props.syncTree.openNodeByPk(this.props.treeId, this.root.refpk);//展开根节点
                }));
            }
        });
    }
    /***************************
     * 设置树数据
     ***************************/
    setTreeData = (data,callback)=>{
        //同步树  加载全部数据
        this.props.syncTree.setSyncTreeData(this.props.treeId , this.dealTreeData([Object.assign( {...this.root} , {children : data} )]));
        callback && callback();
    }
    /***************************
     * 设置按钮状态
     ***************************/
    setButtonStatus = (status = this.state.status)=>{
        this.props.button.setButtonVisible({
            Save:status == 'add'|| status=='edit',
            SaveAdd:status == 'add',
            Cancel:status == 'add'|| status=='edit',
            Refresh:status=='browse',
            Print:status == 'browse'
        })
    }
    /***************************
     * 按钮点击事件
     ***************************/
    onButtonClick = (props,id)=>{
        switch(id){
            case 'Refresh':
                this.onRefreshProjectType();break;
            case 'Save':
                this.onSaveProjectType(); break;
            case 'SaveAdd':
                this.onSaveAddProjectType();break;
            case 'Cancel':
                this.onCancelProjectTypePrompt(this.onCancelProjectType);break;
            case 'Print':
            case 'Menu_Print':
                let treeData = this.props.syncTree.getSyncTreeValue(this.props.treeId);
                treeData && print('pdf',URLS.printUrl,{billtype:'',funcode:'10140PRJTG',nodekey:'',oids:this.getTreeAllPks(treeData),outputType:'print'});
                break;
            case 'Menu_Output':
                let {printCfg} = this.state;
                printCfg.oids = this.getTreeAllPks(this.props.syncTree.getSyncTreeValue(this.props.treeId));
                this.setState(this.state,this.refs.printOutput.open())
                break;
            default:break;
        }
    }
    getTreeAllPks = (treeData)=>{
        let result = new Array();
        const loop = (treeData)=>{
            treeData.forEach(data=>{
                if(data.refpk!='~'){
                    result.push(data.refpk);
                }
                if(data.hasOwnProperty('children') &&data.children!=null&& data.children.length>0){
                    loop(data.children);
                }
            })
        }
        loop(treeData);
        return result;
    }
    /***************************
     * 刷新
     ***************************/
    onRefreshProjectType = ()=>{
        let {treeCfg,cardCfg,showOff,curSelectNode,status} = this.state;
        curSelectNode = null;treeCfg.selectedKeys = [this.root.refpk];
        this.setState({status:'browse'},()=>{
            this.loadTreeData((res)=>{
                this.props.form.EmptyAllFormValue(this.props.formId);//清空表单数据
                this.props.form.setFormItemsDisabled(this.props.formId,{enablestate:true}); //设置表单项可用
                this.setTreeData(res,()=>{
                    this.props.syncTree.openNodeByPk(this.props.treeId, this.root.refpk);//展开根节点
                    this.setButtonStatus(this.state.status);
                    toast({title:this.MultiLang['10140PRJT-000037'],color:'success'});
                });
            });
        });
    }
    onSaveProjectType = (callback)=>{
        if(!this.props.form.isCheckNow(this.props.formId)){return;}//主动表单校验
        let formData = this.props.form.getAllFormValue(this.props.formId);//获得表单信息
        formData.areacode = this.props.formId;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态
        let data = {model: formData,pageid: this.props.pageCode};//请求参数
        let {treeCfg,cardCfg,showOff,curSelectNode,status} = this.state;
        this.validateToSave(data,()=>{
            this.operateProjectType(URLS.saveUrl,Object.assign(data,{nodeType:this.props.nodeType}),(result)=>{
                this.settingShowFormula(result);
                if( result.data.treeNodeData[0].children && result.data.treeNodeData[0].children.length == 0 ){
                    delete result.data.treeNodeData[0].children;
                }
                debugger;
                this.props.syncTree.setNodeDisable(this.props.treeId,false);//设置树可用
                result.data.treeNodeData.forEach(item => {
                    item.iconBox = {
                        addIcon:false,
                        editIcon: true,
                        delIcon: true
                    }
                })
                this.state.status == 'add' ? this.props.syncTree.addNodeSuccess(this.props.treeId,result.data.treeNodeData[0]):
                            this.props.syncTree.editNodeSuccess(this.props.treeId,result.data.treeNodeData);
                console.log(this.state.status);
                treeCfg.disabledSearch = false;showOff.disabled = false;
                this.setState({status:'browse'},()=>{
                    this.setButtonStatus(this.state.status);//设置按钮状态
                    this.setTreeStatusAfterSave(result.data.treeNodeData);
                    this.props.form.EmptyAllFormValue(this.props.formId);
                    //取消时  启用状态改为 true/false
                    var enablestateObj = Utils.convertEnableState(result.data.curFormData[this.props.formId].rows[0].values['enablestate'],'form');
                    result.data.curFormData[this.props.formId].rows[0].values['enablestate'] = enablestateObj;
                    this.props.form.setAllFormValue({[this.props.formId]:result.data.curFormData[this.props.formId]});//新增成功，设置表单默认值
                    this.props.form.setFormStatus(this.props.formId, this.state.status);
                    this.props.form.setFormItemsDisabled(this.props.formId,{enablestate:false}); //设置表单项可用
                    toast({title:this.MultiLang['10140PRJT-000028'],color:'success'});/* 国际化处理： 保存成功！*/
                    callback && callback();
                });
            })
        });
    }
    onSaveAddProjectType = ()=>{
        let {treeCfg,cardCfg,showOff,curSelectNode,status} = this.state;
        let selectedTreeNode = curSelectNode || this.props.syncTree.getSelectNode(this.props.treeId);//获得选中节点
        this.onSaveProjectType(()=>{
            this.onAddProjectType(selectedTreeNode);
        })
    }
    onCancelProjectTypePrompt = (callback)=>{
        promptBox({
            title:this.MultiLang['10140PRJT-000031'],/* 国际化处理： 确认取消*/
            content:this.MultiLang['10140PRJT-000032'],/* 国际化处理： 是否确认要取消?*/
            beSureBtnClick:function(){
                callback && callback();
            }.bind(this)
        })
    }
    /**
     * 取消
     */
    onCancelProjectType = ()=>{
        let {treeCfg,cardCfg,showOff,curSelectNode,status} = this.state;
        showOff.disabled = false;treeCfg.disabledSearch = false;
        let selectedTreeNode = curSelectNode || this.props.syncTree.getSelectNode(this.props.treeId);//获得选中节点
        this.setState({status:'browse'},()=>{
            this.props.form.EmptyAllFormValue(this.props.formId);
            if(selectedTreeNode != null){
                 selectedTreeNode && selectedTreeNode.refpk ==  this.root.refpk ? this.props.form.setFormItemsDisabled(this.props.formId,{enablestate:true}):
                this.operateProjectType(URLS.queryCardUrl,{pk_projectclass:selectedTreeNode.refpk,nodeType:this.props.nodeType},(result)=>{
                    this.settingShowFormula(result);
                    //取消时  启用状态改为 true/false
                    var enablestateObj = Utils.convertEnableState(result.data[this.props.formId].rows[0].values['enablestate'],'form');
                    result.data[this.props.formId].rows[0].values['enablestate'] = enablestateObj;
                    this.props.form.setAllFormValue({[this.props.formId]:result.data[this.props.formId]});
                    this.props.form.setFormItemsDisabled(this.props.formId,{enablestate:false});//设置表单项不可用
                });
            }
            this.props.form.setFormStatus(this.props.formId, this.state.status);
            this.props.syncTree.setNodeDisable(this.props.treeId,false);//设置树可用
            this.setButtonStatus(this.state.status); //设置按钮状态
        })
    }
    /**
     * 校验公式
     */
    validateToSave = (data,callback)=>{
        this.props.validateToSave(data,callback,{[this.props.formId]:'form'},'form');
    }
    setTreeStatusAfterSave = (treeNode)=>{
        this.props.syncTree.openNodeByPk(this.props.treeId, treeNode[0].pid);//展开树节点
        this.props.syncTree.setNodeSelected(this.props.treeId, treeNode[0].refpk);
    }
    /***************************
     * form编辑前事件
     ***************************/
    onBeforeFormEvent = (props, moduleId, key, value,data)=>{
        let {treeCfg,cardCfg,showOff,curSelectNode,status} = this.state;
        let node = this.state.curSelectNode || this.props.syncTree.getSelectNode(this.props.treeId);
        return !node?true:this.checkCurNodeEnableStateAuth(node);
    }
    /**
     * 检查是否可以停启用
     * @param node
     * @returns {boolean}
     */
    checkCurNodeEnableStateAuth = (node)=>{ 
        if(node.refpk == 'root' || node.refpk == '~'){
            return true;
        }
        if(!node.nodeData.isGroupNode && this.props.nodeType == 'GROUP_NODE'){
            toast({content:this.MultiLang['10140PRJT-000033'],color:'warning'});/* 国际化处理： 当前集团只能维护当前集团的数据！*/
            return false;
        }else if(node.nodeData.isGroupNode && this.props.nodeType == 'GLOBE_NODE'){
            toast({content:this.MultiLang['10140PRJT-000034'],color:'warning'});/* 国际化处理： 全局只能维护全局的数据！*/
            return false;
        }
        return true;
    }
    /***************************
     * form编辑后事件
     ***************************/
    onAfterFormEvent = (props, moduleId, key, value, index)=>{
        let {treeCfg,cardCfg,showOff,curSelectNode,status} = this.state;
        switch(key){
            case "enablestate":
                let selectedTreeNode = curSelectNode || this.props.syncTree.getSelectNode(this.props.treeId);
                if(!this.checkCurNodeEnableStateAuth(selectedTreeNode)){
                    props.form.setFormItemsValue(this.config.formId,{enablestate:{value:!value.value,display:!value.value}});
                    return;
                }
                let requestParam = {
                    pk_projectclass:selectedTreeNode.refpk,
                    enablestate:value.value?'2':'1',
                    nodeType:this.props.nodeType,
                };
                promptBox({
                    color:"warning",
                    title:this.MultiLang['10140PRJT-000003'],/* 国际化处理： 提示*/
                    content:value.value?this.MultiLang['10140PRJT-000004']:this.MultiLang['10140PRJT-000005'],/* 国际化处理： 确认启用该数据？,确认停用该数据？*/
                    beSureBtnClick:()=>{
                        this.operateProjectType(URLS.enablestateUrl,{pk_projectclass:selectedTreeNode.refpk,enablestate:value.value?'2':'1',nodeType:this.props.nodeType},(result)=>{
                            result.success && toast({title:value.value?this.MultiLang['10140PRJT-000025']:this.MultiLang['10140PRJT-000026'],color:'success'});/* 国际化处理： 启用成功！,停用成功！*/
                        })
                    },
                    cancelBtnClick:()=>{
                        props.form.setFormItemsValue(this.props.formId,{enablestate:{value:!value.value,display:!value.value}});
                        return;
                    }
                });
                break;
            default:
                break;
        }
    }
    /***************************
     * 删除事件
     * @param selectedTreeNode
     ***************************/
    onDeleteProjectType = (selectedTreeNode)=>{
        promptBox({
            title: this.MultiLang['10140PRJT-000013'],/* 国际化处理： 删除*/
            content: this.MultiLang['10140PRJT-000011'],
            beSureBtnClick: () => {
                this.operateProjectType(URLS.deleteUrl,{pk_projectclass:selectedTreeNode.refpk,nodeType:this.props.nodeType},()=>{
                    this.props.form.EmptyAllFormValue(this.props.formId);
                    //调用异步树的接口，删除该树节点
                    this.props.syncTree.delNodeSuceess(this.props.treeId,selectedTreeNode.refpk);
                    //设置表单项可用
                    this.props.form.setFormItemsDisabled(this.props.formId,{enablestate:true});
                    this.setButtonStatus(this.state.status);
                    toast({title:this.MultiLang['10140PRJT-000014'],color:'success'});/* 国际化处理： 删除成功！,提示*/
                });
            }
        });
    }
    /***************************
     * 新增事件
     ***************************/
    onAddProjectType = (selectedTreeNode)=>{
        let {treeCfg,cardCfg,showOff,curSelectNode,status} = this.state;
        treeCfg.selectedKeys = selectedTreeNode?[selectedTreeNode.refpk]:'~';treeCfg.disabledSearch = true;curSelectNode = selectedTreeNode;
        showOff.disabled = true;
        this.props.form.EmptyAllFormValue(this.props.formId);//清空表单数据
        this.props.form.setFormStatus(this.props.formId, 'add');//设置表单为编辑态
        this.setState({status:'add'},()=>{
            this.operateProjectType(URLS.addCardUrl,{pk_parent:this.root.refpk,nodeType:this.props.nodeType},(result)=>{
                this.settingShowFormula(result);//显示公式
                this.props.form.setAllFormValue({[this.props.formId]:this.filterEmptyData(result.data[this.props.formId].rows[0].values,this.state.status)}); //设置新增默认值
                this.props.form.setFormItemsDisabled(this.props.formId,{enablestate:true});//设置表单项不可用
                this.props.syncTree.setNodeDisable(this.props.treeId,true);//编辑时设置整棵树不可用
                this.setButtonStatus(this.state.status);
            })
        });
    }
    filterEmptyData = (data,status)=>{
        const isObject =function (param){
            return Object.prototype.toString.call(param).slice(8, -1) === 'Object';
        }
        if(!isObject(data) || status != 'add'){
            return {rows:[{values:data}]};
        }
        let filterData = new Object();
        Object.keys(data).forEach(key=>{
            data[key] && (data[key].value || data[key].display) && Object.assign(filterData,{[key]:data[key]});
        })
        return {rows:[{values:filterData}]};
    }
    /***************************
     * 操作项目类型树节点
     * @param url
     * @param data
     * @param callback 回调
     ***************************/
    operateProjectType = (url,data,callback)=>{
        ajax({
            url,
            data,
            success:(res)=>{
                res.success && callback && callback(res);
            }
        })
    }
    /***************************
     * 编辑事件
     ***************************/
    onEditProjectType = (selectedTreeNode)=>{
        let {treeCfg,cardCfg,showOff,curSelectNode,status} = this.state;
        treeCfg.selectedKeys = [selectedTreeNode.refpk];treeCfg.disabledSearch = true;curSelectNode = selectedTreeNode;
        showOff.disabled = true;
        this.setState({status:'edit'},()=>{
            this.operateProjectType(URLS.queryCardUrl,{pk_projectclass:selectedTreeNode.refpk,nodeType:this.props.nodeType},(result)=>{
                this.settingShowFormula(result);//设置显示公式
                this.props.syncTree.setNodeDisable(this.props.treeId,true);//编辑时设置整棵树不可用
                //设置表单数据
                this.props.form.setAllFormValue({[this.props.formId]:result.data[this.props.formId]});
                this.props.form.setFormItemsDisabled(this.props.formId,{enablestate:true});//设置表单项不可用
                //设置表单状态为编辑态
                this.props.form.setFormStatus(this.props.formId, this.state.status);
                this.setButtonStatus(this.state.status);
            })
        });
    }
    /***************************
     * 树节点选中事件
     ***************************/
    onSelectTree = (refpk)=>{
        let {treeCfg,cardCfg,showOff,curSelectNode,status} = this.state;
        treeCfg.selectedKeys = [refpk];
        curSelectNode = this.props.syncTree.getSyncTreeValue(this.props.treeId,refpk);
        this.setState(this.state,()=>{
            this.props.button.setButtonDisabled(['Print','Menu_Output'],refpk == this.root.refpk);
            if(refpk == this.root.refpk){this.props.form.EmptyAllFormValue(this.props.formId);return;}
            //加载form数据
            this.operateProjectType(URLS.queryCardUrl,{pk_projectclass:refpk,nodeType:this.props.nodeType},(result)=>{
                this.settingShowFormula(result);//设置显示公式
                //表单数据
                let headData = result.data.head.rows[0].values;
                if(headData.hasOwnProperty('enablestate')){
                    result.data.head.rows[0].values.enablestate.value = headData.enablestate.value == '2';
                    result.data.head.rows[0].values.enablestate.display = headData.enablestate.value == '2';
                }
                //清空表单
                this.props.form.EmptyAllFormValue(this.props.formId);
                //设置表单为所选树节点数据
                this.props.form.setAllFormValue({[this.props.formId]:result.data[this.props.formId]});
                //设置表单项enablestate可用
                this.props.form.setFormItemsDisabled(this.props.formId,{enablestate:false});
            });
        })
    }
    settingShowFormula = (result)=>{
        result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0 && this.props.dealFormulamsg( result.formulamsg,{[this.props.formId]:'form'});
    }
    /***************************
     * 鼠标移动到树节点事件
     ***************************/
    onMouseEnterEve = (key)=>{
        let node = this.props.syncTree.getSyncTreeValue(this.props.treeId,key);
        //false:隐藏； true:显示; 默认都为true显示
        let obj = {delIcon:true,editIcon:true,addIcon:false};
        if(key == this.root.refpk){//根节点
            obj = {delIcon:false,editIcon:false,addIcon:true};
        }else if(this.props.nodeType == 'GROUP_NODE' && !node.nodeData.isGroupNode){//集团节点 && 不是集团树节点
            obj = {delIcon:false,editIcon:false,addIcon:false};
        }else if(this.props.nodeType == 'GLOBE_NODE' && node.nodeData.isGroupNode){//全局节点 && 是集团树节点
            obj = {delIcon:false,editIcon:false,addIcon:false};
        }
        this.props.syncTree.hideIcon(this.props.treeId, key, obj );
    }
    /***************************
     * 处理树数据
     * @param data
     * @returns {*}
     ***************************/
    dealTreeData =(data)=>{
        let deleteDataChildrenProp = function(node){
            node.iconBox = {editIcon:true,delIcon:true,addIcon:false};
            if(!node.children || node.children.length == 0) {
                delete node.children;
            }else{
                node.isLeaf = false;
                node.children.forEach( (e) => {
                    deleteDataChildrenProp(e);
                });
            }
        };
        data.forEach( (e) => {deleteDataChildrenProp(e);});
        return data;
    }
    render = ()=>{
        let {showOff,btnCfg,treeCfg,cardCfg,printCfg,afterInit,} = this.state;
        const {syncTree,form,button,DragWidthCom,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        const {createSyncTree} = syncTree;//创建同步树 需要引入这个
        const {createForm} = form;//创建表单，需要引入这个
        const {createButtonApp}=button;
        return afterInit && (
            <div className="nc-bill-tree-card">
                <NCDiv  areaCode={NCDiv.config.HEADER}  className="header"> {/* 头部 header*/}
                    {/*createPageIcon()*/}
                    <div className="title">
                    {/*this.props.nodeType == 'GROUP_NODE'?this.MultiLang['10140PRJT-000000']:this.MultiLang['10140PRJT-000036']*/}
                    {/* 标题 title*/}
                    {createBillHeadInfo({
                                        title:this.props.nodeType == 'GROUP_NODE'?this.MultiLang['10140PRJT-000000']:this.MultiLang['10140PRJT-000036'],
                                        initShowBackBtn:false
                                    })} </div>
                        <span className="showOff">
                            <NCCheckbox {...showOff}>{this.MultiLang['10140PRJT-000023']/* 国际化处理： 显示停用*/}</NCCheckbox>
                        </span>
                    <div className=" btn-group">{createButtonApp({...btnCfg})}</div>
                </NCDiv>
                <div className="tree-card"> {/* 树卡区域 */}
                    <DragWidthCom
                        leftDom = {<div className="tree-area">{createSyncTree({...treeCfg})}</div>}//左侧区域dom
                        rightDom = {<div className="card-area">{createForm(this.props.formId, {...cardCfg})}</div> }//右侧区域dom
                        defLeftWid = '20%'      // 默认左侧区域宽度，px/百分百
                        leftMinWid = '300px'
                    />
                </div>
                <PrintOutput {...printCfg}></PrintOutput>
            </div>
        );
    }
}
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65