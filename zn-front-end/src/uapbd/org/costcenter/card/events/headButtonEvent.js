//eTQyK/ccmp+8xw2ZSk6B7tz8ww9WevF5h4krTN5HP/d5ED4Fgs4IVVO1J5QmPCG9
import { createPage,ajax,base,toast,cardCache,getMultiLang, high,cacheTools,promptBox } from 'nc-lightapp-front';
import CCVersion from '../../ccversion' ;
import {headButton, innerButton} from "../../common/btnName";
import {pageId, appcode, formId, tableIds, head, urls,TableBtn} from './../content';
let {
    getDefData
} = cardCache;
/**
 *
 * @param props
 * @param tbnName 点击按钮的key值
 */
export default function handleButtonClick(props, id){
    console.log('bojdJJ', props, id)
    if(id=='query'){
        let selectNode = this.props.syncTree.getSelectNode(this.config.treeId);//获取左侧树选中节点
        let cacheRefPk = '';//记录左侧树-选中节点pk
        if(selectNode != null){
            cacheRefPk = selectNode.refpk;
        }
        //卡片页面点查询时，把业务单元pk和左侧树选中节点的pk传给父组件，在父组件的状态中维护（返回卡片页面时还原数据）
        this.props.config('Y',{json:this.state.json,cacheOrg:this.state.curOrg,cacheRefPk:cacheRefPk});
        return;
    }
    if(this.state.curOrg.pk_org.length==0){
        return;
    }
    let saveAdd = [headButton.Save_add];
    let tableDelDisable = [TableBtn.delccdept,TableBtn.delccwork,TableBtn.delfeetype ]
    switch (id) {
        //新增
        case headButton.Add:
            //设置停启用开关不可编辑
            this.props.form.setFormItemsDisabled(formId,{'enablestate':true});
            //设置子表编辑状态
            this.props.cardTable.setStatus(tableIds[0],'edit',()=>{});
            this.props.cardTable.setStatus(tableIds[1],'edit',()=>{});
            this.props.cardTable.setStatus(tableIds[2],'edit',()=>{});

            //新增时清空子表数据
            this.props.cardTable.setTableData(tableIds[2], {
                areacode:tableIds[2],
                rows:[]
            }, false);
            this.props.cardTable.setTableData(tableIds[1], {
                areacode:tableIds[1],
                rows:[]
            }, false);
            this.props.cardTable.setTableData(tableIds[0], {
                areacode:tableIds[0],
                rows:[]
            }, false);
            //更改按钮状态变量
            //填充默认值
            this.props.syncTree.setNodeDisable(this.config.treeId,true);//设置树不可编辑
            this.props.form.EmptyAllFormValue(this.config.formId);
            this.props.form.setFormStatus(this.config.formId,'add');
            let formVal=this.props.form.getAllFormValue(this.config.formId);
            //适配编辑公式【新增时候，默认为未启用】
            // formVal.rows[0].values['enablestate'].value='1';
            // formVal.rows[0].values['enablestate'].display='未启用';
            formVal.rows[0].values['enablestate'].value='2';
            formVal.rows[0].values['enablestate'].display='启用';
            // formVal.rows[0].values['enablestate'].value='3';
            // formVal.rows[0].values['enablestate'].display='已停用';
            //新增时需要填充默认值
            formVal.rows[0].values['pk_org'].value=this.state.curOrg.pk_org;
            formVal.rows[0].values['pk_org'].display=this.state.curOrg.name;
            
            if(this.props.syncTree.getSelectNode(this.config.treeId)&&this.props.syncTree.getSelectNode(this.config.treeId).refpk!=this.root.refpk){
                formVal.rows[0].values['pk_father'].value=this.props.syncTree.getSelectNode(this.config.treeId).refpk;
                formVal.rows[0].values['pk_father'].display=this.props.syncTree.getSelectNode(this.config.treeId).refname;
            }

            if(this.state.curOrg.isFinanceorg=='Y'){
                formVal.rows[0].values['pk_financeorg'].value=this.state.curOrg.pk_org;
                formVal.rows[0].values['pk_financeorg'].display=this.state.curOrg.name;
            }
            
            if(this.state.curOrg.isBenifity=='Y'){
                formVal.rows[0].values['pk_profitcenter'].value=this.state.curOrg.pk_org;
                formVal.rows[0].values['pk_profitcenter'].display=this.state.curOrg.name;
            }

            if(this.state.curOrg.isFactory=='Y'){
                formVal.rows[0].values['pk_factory'].value=this.state.curOrg.pk_org;
                formVal.rows[0].values['pk_factory'].display=this.state.curOrg.name;
                //维护所属工厂字段
                this.state.pk_factory=this.state.curOrg.pk_org;
            }else{
                this.state.pk_factory='';
            }
            this.props.form.setFormItemsDisabled(this.config.formId,{'pk_financeorg':this.state.curOrg.isFinanceorg=='Y','pk_profitcenter':this.state.curOrg.isBenifity=='Y','pk_factory':this.state.curOrg.isFactory=='Y'});

            formVal.rows[0].values['cctype'].display=this.state.json['10100CC-000012'];/* 国际化处理： 基本生产*/
            formVal.rows[0].values['cctype'].value='2';

            this.props.form.setAllFormValue({[this.config.formId]:formVal});
            let date = new Date().getDate();
            let month = new Date().getMonth() + 1;
            let year = new Date().getFullYear();
            let versiondata ={
                vname:{ value:"初始版本"},
                vno:{ value:`${year}${month<10?`0${month}`:`${month}`}`},
                effectivedate:{ value:`${year}${`-`}${month<10?`0${month}`:`${month}`}${`-`}${date<10?`0${date}`:`${date}`}` + ' 00:00:00'},
                expirationdate:{ value:"9999-12-31 23:59:59"},
            };
            this.props.form.setFormItemsValue(this.config.formId,versiondata);
            this.setButtonStatus();
            this.state.status='add';
            this.setState(this.state);
            this.props.button.setButtonVisible(saveAdd,true);
            //修改时关联部门、工作中心表体和要素类型删除按钮默认禁用
            this.props.button.setDisabled(tableDelDisable,true);
            break;
        //表头修改
        case headButton.Edit:
            //设置停启用开关不可编辑
            this.props.form.setFormItemsDisabled(formId,{'enablestate':true});
            //适配编辑公式
            let enablestate11=this.props.form.getFormItemsValue(formId,'enablestate');
            this.props.form.setFormItemsValue(formId,{'enablestate':{value:(enablestate11.value==true?'2':'3')}});
            //设置子表编辑状态
            this.props.cardTable.setStatus(tableIds[0],'edit',()=>{});
            this.props.cardTable.setStatus(tableIds[1],'edit',()=>{});
            this.props.cardTable.setStatus(tableIds[2],'edit',()=>{});
            this.props.syncTree.setNodeDisable(this.config.treeId,true);//设置树不可编辑
            this.props.form.setFormStatus(this.config.formId,'edit');
            this.setButtonStatus();
            this.state.status='edit';
            this.setState(this.state);
            this.props.button.setButtonVisible(saveAdd,false);
            //this.isDelBtnEnable();
            //修改时关联部门和工作中心表体删除按钮默认禁用
            this.props.button.setDisabled(tableDelDisable,true);
            break;
        //保存新增
        case headButton.Save_add:
            //form表单必输项校验
            if(!this.props.form.isCheckNow(this.config.formId)){
                toast({color:'danger',content:this.state.json['10100CC-000001']});/* 国际化处理： 请输入必输项！*/
                return;
            }
            this.state.ccworksdata=[];
            this.state.ccdeptsdata=[];
            this.setState(this.state);
            //按钮传值操作需要做一次数据转换
            let enablestate1=this.props.form.getFormItemsValue(this.config.formId,'enablestate');
            this.props.form.setFormItemsValue(this.config.formId,{'enablestate':{value:(enablestate1.value=='2'?2:3)}});
            let formData1= this.props.form.getAllFormValue(this.config.formId);//获得表单信息
            if(formData1.rows[0].values['pk_father']!=null&&formData1.rows[0].values['pk_father'].value=='~'){
                formData1.rows[0].values['pk_father'].value=null;
            }
            let cardData1 = props.createExtCardData(this.config.pageCode, this.config.formId, [this.config.tableIds[0], this.config.tableIds[1]]);

            //处理树节点数据选中状态及form表单数据
            //ajax请求
            let saveAddCallBack=()=>ajax({
                url: urls['saveCostUrl'],
                data: cardData1,
                success: (result) => {
                    if(result.success){
                        toast({color:'success',title:this.state.json['10100CC-000002']});/* 国际化处理： 保存成功！*/
                        //设置表单浏览态
                        this.props.form.setFormStatus(this.config.formId, 'browse');
                        //设置树可用
                        this.props.syncTree.setNodeDisable(this.config.treeId,false);

                        //表单数据
                        let headData1 = result.data.head[this.config.formId];
                        let deptData1 = result.data.bodys[this.config.tableIds[0]];
                        let workData1 = result.data.bodys[this.config.tableIds[1]];

                        //清空表单
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        //设置表单为所选树节点数据
                        this.props.form.setAllFormValue({[this.config.formId]:headData1});
                        
                        this.props.cardTable.setTableData(this.config.tableIds[0], deptData1, false);

                        this.props.cardTable.setTableData(this.config.tableIds[1], workData1, false);
                        
                        //刷新树节点、并选择当前操作数据为选择状态
                        let selectNode1={refpk:''};
                        selectNode1.refpk=headData1.rows[0].values['pk_costcenter'].value;
                        let requestParam1={ enablestate:this.state.enablestate,pk_org:this.state.curOrg.pk_org };
                        this.loadTree(requestParam1,selectNode1);//选中后开始加载部门数据
                        this.updateButtonStatus();
                        this.state.status='browse';
                        this.setState(this.state);
                        this.onButtonClick(props,'add');
                    }

                }
            });
            this.props.validateToSave(cardData1,saveAddCallBack,{'pk_group':'form','audit':'form','ccdepts':'cardTable','ccworkcenters':'cardTable'},'extcard');
            break;
        //导入
        case headButton.ImportData: //'import':
            break;
        //导出
        case headButton.ExportData: // 'export'://NC导出功能必须要选择数据（即只能单条导出）
            if(!this.props.syncTree.getSelectNode(this.config.treeId)||this.props.syncTree.getSelectNode(this.config.treeId).refpk==this.root.refpk){
                toast({content:this.state.json['10100CC-000003'],color:'warning'});/* 国际化处理： 请先选择要导出的数据！*/
                return ;
            }
            this.setState({

            },()=>{
                this.props.modal.show('exportFileModal');
            });
            break;
        //刷新
        case headButton.Refresh:
            let selectTreeNode=this.props.syncTree.getSelectNode(this.config.treeId);
            let requestParam={ enablestate:this.state.enablestate,pk_org:this.state.curOrg.pk_org };
            this.loadTree(requestParam,selectTreeNode);
            //需要刷新卡片数据
            if(selectTreeNode){
                this.onSelectTree(selectTreeNode.refpk,()=>{
                    toast({color:'success',title:this.state.json['10100CC-000004']});/* 国际化处理： 刷新成功！*/
                });
            }else{
                toast({color:'success',title:this.state.json['10100CC-000004']});/* 国际化处理： 刷新成功！*/
            }
            break;
        //成本中心组
        case 'costcentergrp':
            this.props.modal.show('costcentergrp',{
                title : this.state.json['10100CC-000005'],/* 国际化处理： 成本中心组*/
                content : <CostcenterGRP json={this.state.json} config={this.state.curOrg.pk_org}/>
            });
            break;
        //停用启用
        case 'enable':
            if(!this.props.syncTree.getSelectNode(this.config.treeId)||this.props.syncTree.getSelectNode(this.config.treeId).refpk==this.root.refpk){
                toast({content:this.state.json['10100CC-000006'],color:'warning'});/* 国际化处理： 请选择要启用的数据！*/
                return 
            }
            promptBox({
                color:'warning',
                title : this.state.json['10100CC-000007'],/* 国际化处理： 确认启用*/
                content : this.state.json['10100CC-000008'],/* 国际化处理： 您确认启用所选数据？*/
                beSureBtnClick : this.onEnableCost.bind(this)
            })
            break;
        case 'disable':
            if(!this.props.syncTree.getSelectNode(this.config.treeId)||this.props.syncTree.getSelectNode(this.config.treeId).refpk==this.root.refpk){
                toast({content:this.state.json['10100CC-000009'],color:'warning'});/* 国际化处理： 请选择要停用的数据！*/
                return 
            }
            promptBox({
                color:'warning',
                title : this.state.json['10100CC-000010'],/* 国际化处理： 确认停用*/
                content : this.state.json['10100CC-000011'],/* 国际化处理： 您确认停用所选数据？*/
                beSureBtnClick : this.onDisableCost.bind(this)
            })
                
            break;

        
        case headButton.Cancel:
            promptBox({
                color:'warning',
                title : this.state.json['10100CC-000013'],/* 国际化处理： 确认取消*/
                content : this.state.json['10100CC-000014'],/* 国际化处理： 是否确认取消？*/
                beSureBtnClick : (()=>{
                    //设置停启用开关可编辑
                    this.props.form.setFormItemsDisabled(formId,{'enablestate':false});
                    //取消时维护子表数据
                    this.state.ccworksdata=[];
                    this.state.ccdeptsdata=[];
                    this.setState(this.state);
                
                    //同步树 取消的逻辑
            
                    if(this.props.syncTree.getSelectNode(this.config.treeId)&&this.props.syncTree.getSelectNode(this.config.treeId).refpk!='~'){
                        this.onSelectTree(this.props.syncTree.getSelectNode(this.config.treeId).refpk);
                    }else{
                        //没有选中项  清空所有数据
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        this.props.cardTable.setTableData(tableIds[2], {
                            areacode:tableIds[2],
                            rows:[]
                        }, false);
                        this.props.cardTable.setTableData(tableIds[1], {
                            areacode:tableIds[1],
                            rows:[]
                        }, false);
                        this.props.cardTable.setTableData(tableIds[0], {
                            areacode:tableIds[0],
                            rows:[]
                        }, false);
                        this.props.form.setFormItemsDisabled(this.config.formId,{enablestate:true});//设置表单项不可用
                    }
                    this.props.form.setFormStatus(this.config.formId, 'browse');
                    //设置树可用
                    this.props.syncTree.setNodeDisable(this.config.treeId,false);
                    this.setButtonStatus();
                    this.state.status='browse';
                    this.setState(this.state);
                    //设置子表编辑状态
                    this.props.cardTable.setStatus(tableIds[0],'browse',()=>{});
                    this.props.cardTable.setStatus(tableIds[1],'browse',()=>{});
                    this.props.cardTable.setStatus(tableIds[2],'browse',()=>{});
                })
            });
            break;
        case headButton.Save:
            //form表单必输项校验
            if(!this.props.form.isCheckNow(this.config.formId)){
                toast({color:'danger',content:this.state.json['10100CC-000001']});/* 国际化处理： 请输入必输项！*/
                return;
            }

            //保存时维护子表数据
            this.state.ccworksdata=[];
            this.state.ccdeptsdata=[];
            this.setState(this.state);
            //按钮传值操作需要做一次数据转换
            let enablestate=this.props.form.getFormItemsValue(this.config.formId,'enablestate');
            this.props.form.setFormItemsValue(this.config.formId,{'enablestate':{value:(enablestate.value=='2'?2:3)}});
            let formData = this.props.form.getAllFormValue(this.config.formId);//获得表单信息
            if(formData.rows[0].values['pk_father']!=null&&formData.rows[0].values['pk_father'].value=='~'){
                formData.rows[0].values['pk_father'].value=null;
            }
            if(!formData.rows[0].values['pk_financeorg'] && formData.rows[0].values['pk_profitcenter'] && !formData.rows[0].values['pk_factor']){
                toast({color:'danger',content:'成本中心上“所属财务组织”、“所属利润中心”、“所属工厂”不可以同时为空!'});
                return;
            }
            if(formData.rows[0].values['effectivedate'] &&  formData.rows[0].values['expirationdate'] && formData.rows[0].values['effectivedate'].value > formData.rows[0].values ['expirationdate'].value){//失效日期大于生效日期
                toast({color:'danger',content:'失效日期不可以小于生效日期'});
                return;
            }
            let cardData = props.createExtCardData(this.config.pageCode, this.config.formId, [this.config.tableIds[0], this.config.tableIds[1],this.config.tableIds[2]]);
            //ajax请求
            let saveCallBack=()=>ajax({
                url: urls['saveCostUrl'],
                data: cardData,
                success: (result) => {
                    if(result.success){
                        //设置子表编辑状态
                        this.props.cardTable.setStatus(tableIds[0],'browse',()=>{});
                        this.props.cardTable.setStatus(tableIds[1],'browse',()=>{});
                        toast({color:'success',title:this.state.json['10100CC-000002']});/* 国际化处理： 保存成功！*/
                        //设置表单浏览态
                        this.props.form.setFormStatus(this.config.formId, 'browse');
                        //设置树可用
                        this.props.syncTree.setNodeDisable(this.config.treeId,false);

                        //表单数据
                        let headData = result.data.head[this.config.formId];
                        let deptData = result.data.bodys[this.config.tableIds[0]];
                        let workData = result.data.bodys[this.config.tableIds[1]];

                        //清空表单
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        //设置表单为所选树节点数据
                        this.props.form.setAllFormValue({[this.config.formId]:headData});
                        
                        this.props.cardTable.setTableData(this.config.tableIds[0], deptData, false);

                        this.props.cardTable.setTableData(this.config.tableIds[1], workData, false);
                        
                        //刷新树节点、并选择当前操作数据为选择状态
                        let selectNode={refpk:''};
                        selectNode.refpk=headData.rows[0].values['pk_costcenter'].value;
                        let requestParam={ enablestate:this.state.enablestate,pk_org:this.state.curOrg.pk_org };
                        this.loadTree(requestParam,selectNode);//选中后开始加载部门数据
                        this.onSelectTree(selectNode.refpk);
                        this.updateButtonStatus();
                        this.state.status='browse';
                        this.setState(this.state);
                        //设置停启用开关可编辑
                        this.props.form.setFormItemsDisabled(formId,{'enablestate':false});
                    }

                }
            });
            this.props.validateToSave(cardData,saveCallBack,{'pk_group':'form','audit':'form','ccdepts':'cardTable','ccworkcenters':'cardTable'},'extcard');
            break;
       //表头版本化
        case headButton.Version :
            let meta = this.props.meta.getMeta();
            let pk_costcenter = this.props.form.getFormItemsValue("pk_group","pk_costcenter");
            let param1 = {json:this.state.json,meta:meta,pk_costcenter:pk_costcenter,loadVersionData:this.onVersionData.bind(this)};
            props.modal.show('modal',{
                title : '版本化',/* 国际化处理： 版本化*/
                content : <CCVersion config={param1}/> ,
                beSureBtnClick : this.confirmVerionModal.bind(this)
            })
            break;
        case headButton.Delete:

            if (!this.props.syncTree.getSelectNode(this.config.treeId)) {
    
                NCMessage.create({content: this.state.json['10100CC-000015'], color: 'warning'});//默认top/* 国际化处理： 请选中需要删除的节点*/
                return;
    
            }
            if(this.props.syncTree.getSelectNode(this.config.treeId).refpk == this.root.refpk){
                NCMessage.create({content: this.state.json['10100CC-000016'], color: 'warning'});//默认top/* 国际化处理： 根节点不能删除*/
                return;
    
            }
            let message = this.state.json['10100CC-000017']/* 国际化处理： 确认要删除所选数据吗？*/
            if(this.props.syncTree.getSelectNode(this.config.treeId).hasOwnProperty('children') && this.props.syncTree.getSelectNode(this.config.treeId).children.length>0){
                NCMessage.create({content: this.state.json['10100CC-000018'], color: 'warning'});//默认top/* 国际化处理： 该节点包含子节点，不允许删除！*/
                return;
            }
    
            promptBox({
                color:'warning',
                title: this.state.json['10100CC-000019'],/* 国际化处理： 确认删除*/
                content: message,
                beSureBtnClick: () => {
                    let enablestate=this.props.form.getFormItemsValue(this.config.formId,'enablestate');
                    this.props.form.setFormItemsValue(this.config.formId,{'enablestate':{value:(enablestate.value?2:3)}});
                    let cardData = props.createExtCardData(this.config.pageCode, this.config.formId, [this.config.tableIds[0], this.config.tableIds[1]]);
                    ajax({
                        url:urls['delCostUrl'],
                        data:cardData,
                        success:(result)=>{
                            if(result.success){
                                this.props.form.EmptyAllFormValue(formId);
                                this.props.cardTable.setTableData(tableIds[1], {
                                    areacode:tableIds[1],
                                    rows:[]
                                }, false);
                                this.props.cardTable.setTableData(tableIds[0], {
                                    areacode:tableIds[0],
                                    rows:[]
                                }, false);
                                //调用异步树的接口，删除该树节点
                                this.props.syncTree.delNodeSuceess(this.config.treeId,this.props.syncTree.getSelectNode(this.config.treeId).refpk);
    
                                toast({title:this.state.json['10100CC-000020'],color:"success"});/* 国际化处理： 删除成功！*/

                                this.props.syncTree.cancelSelectedNode(this.config.treeId);                               
                            }
    
                        }
                    })
                }
            });
    }

    

}

//eTQyK/ccmp+8xw2ZSk6B7tz8ww9WevF5h4krTN5HP/d5ED4Fgs4IVVO1J5QmPCG9