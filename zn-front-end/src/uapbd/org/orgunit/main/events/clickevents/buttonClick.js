//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
//按钮点击事件
import {base,ajax,toast,cardCache,print,high,promptBox,output} from 'nc-lightapp-front';
//import DistribStep from '../../../distribStep';
const {NCFormControl,NCCheckbox} = base;
let {setDefData, getDefData } = cardCache;
const { NCUploader } = high;               // 从 高阶组件引入NCUploader。


export default function onClickButton(props,id){


    let searchId = props.config.searchId;
    let gridId =props.config.gridId;
    let pageId = props.config.pagecode;

    let refrenshflag = false;
    //停启用获取修改行数据
    let rows = {};

    debugger

    let _this = this;

    var pk_orgarr = [];
    var pk_org = '';
    let code = '';
    let name = '';
    let shortname = '';
    //获取选中行数据
    let selectMember = props.treeTableManyCol.getSelectedRow(gridId);
    let havecountryzone = true;
    let havenocountryzonename = '';
    if(selectMember.length != 0 ){
        selectMember.map((obj)=>{
            pk_orgarr.push(obj.values.pk_org.value);
            if(!obj.values.countryzone.value){
                havecountryzone = false;
                havenocountryzonename = havenocountryzonename + obj.values.name.value+'，';
            }
        })
        pk_org = selectMember[0].values.pk_org.value;
        code = selectMember[0].values.code.value;
        name = selectMember[0].values.name.value;
        shortname = selectMember[0].values.shortname.value;
    }
    
    setDefData('orgunit_pk_orgarr',props.config.datasource,pk_orgarr);
    setDefData('orgunit_pk_org',props.config.datasource,pk_org);
    setDefData('orgunit_code',props.config.datasource,code);
    setDefData('orgunit_name',props.config.datasource,name);
    setDefData('orgunit_shortname',props.config.datasource,shortname);
    //cacheTools.set('orgunit_pk_org',pk_org);
    //cacheTools.set('orgunit_code',code);
    //cacheTools.set('orgunit_name',name);
    //cacheTools.set('orgunit_shortname',shortname);
    //定义请求参数
    let paramData = {
        pageInfo:{},
        queryCondition:{
            'NODE_TYPE':_this.config.NODE_TYPE
        }
    }

    switch (id) {
        case 'add':
            //清空所有form
            //props.openTo('/nccloud/resources/uapbd/org/orgunit_glb/main/#/version',{appcode:'10100ORG',pagecode:'10100ORG_orgunitcard',pk_org:'0001F31000000000J3K8'});
            //列表态新增，如果取消就需要返回列表，卡片太新增，如果取消就返回卡片太
            setDefData('orgunit_listadd',props.config.datasource,'listadd');
            props.pushTo('/card', {
                pagecode:props.config.cardpagecode,
                pk_org: pk_org,
                status: 'add'
            })
            break;
        case 'edit':
            ajax({
                url:'/nccloud/uapbd/org/getcode.do',
                data: {pk_org:pk_org,status:'edit'}, 
                success:(res)=>{
                    if(res.success){     
                        props.pushTo('/card', {
                            status: 'edit',
                            pagecode:props.config.cardpagecode,
                            pk_org: pk_org
                        })
                    }
                }
            });
            
            break;
        case 'delete':
            ajax({
                url:'/nccloud/uapbd/org/getcode.do',
                data: {pk_org:pk_org,status:'edit'}, 
                success:(res)=>{
                    if(res.success){     
                        promptBox({
                            color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: _this.state.json['10100ORG-000099'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            hasCloseBtn:false,
                            content: _this.state.json['10100ORG-000009'],/* 国际化处理： 确认删除？*/
                            beSureBtnClick: () =>{
                                ajax({
                                    url:'/nccloud/uapbd/org/delete.do',
                                    data:{pk_org:pk_orgarr},
                                    success:(res)=>{
                                        if(res.success){
                                            toast({ color: 'success', title: _this.state.json['10100ORG-000010'] });/* 国际化处理： 删除成功！*/
                                        }
                                    }
                                });
                            }   
                        })
                    }
                }
            });
            
            break;
        case 'disable':

            ajax({
                url:'/nccloud/uapbd/org/getcode.do',
                data: {pk_org:pk_org,status:'edit'}, 
                success:(res)=>{
                    if(res.success){     
                        promptBox({
                            color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: _this.state.json['10100ORG-000103'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            content: _this.state.json['10100ORG-000034'],/* 国际化处理： 确认停用该组织？*/
                            beSureBtnClick: () =>{
                                ajax({
                                    url:'/nccloud/uapbd/org/disable.do',
                                    data:{pk_org:pk_orgarr},
                                    success:(res)=>{
                                        if(res.success){
                                            // setDefData('orgunit_changelistdataflag',_this.config.datasource,true);
                                            // selectMember.map((abe)=>{
                                            // rows = props.treeTableManyCol.getValueByRowId(props.config.gridId, abe.rowId);
                                            // rows.values.enablestate.display = '已停用';
                                            // rows.values.enablestate.value = false;
                                            // props.treeTableManyCol.editRowEve(props.config.gridId, rows);
                                            // })
                                            //修改了界面数据，需要重新加载数据
                                            dealdefaultdata(selectMember,res.data,props,_this.state.json['10100ORG-000013'],3,false);/* 国际化处理： 已停用*/
                                           // _this.onrefresh();
                                            toast({ color: 'success', title: _this.state.json['10100ORG-000014'] });/* 国际化处理： 停用成功！*/
                                        }
                                    }
                                });
                            }   
                        })
                    }
                }
            });
            
            break;
        case 'enable':
            ajax({
                url:'/nccloud/uapbd/org/getcode.do',
                data: {pk_org:pk_org,status:'edit'}, 
                success:(res)=>{
                    if(res.success){     
                        promptBox({
                            color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: _this.state.json['10100ORG-000102'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            content: _this.state.json['10100ORG-000102'],/* 国际化处理： 确认启用该组织？*/
                            beSureBtnClick: () =>{
                                ajax({
                                    url:'/nccloud/uapbd/org/enable.do',
                                    data:{pk_org:pk_orgarr},
                                    success:(res)=>{
                                        if(res.success){
                                            //修改了界面数据，需要重新加载数据
                                            dealdefaultdata(selectMember,res.data,props,_this.state.json['10100ORG-000017'],2,false);/* 国际化处理： 已启用*/
                                            toast({ color: 'success', title: _this.state.json['10100ORG-000018'] });/* 国际化处理： 启用成功！*/
                                        }
                                    }
                                });
                            }   
                        })
                    }
                }
            });

            break;
        case 'refresh':
            //props.onrefresh();
            //没有修改了界面数据，需要重新加载数据
            //setDefData('orgunit_needquerydata',that.config.datasource,true);
            //setDefData('orgunit_changelistdataflag',_this.config.datasource,false);
            setDefData('orgunit_btnopr',props.config.datasource,'refresh');
            _this.onrefresh();
            toast({title:_this.state.json['10100ORG-000041'],color:"success"});/* 国际化处理： 刷新成功！*/
            //toast({content:'刷新成功',color:'success'});
            break;
        case 'version':
            //版本化
            if(selectMember.length > 1){
                toast({content: _this.state.json['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                return;
            }
           props.modal.show('org_v',{title:_this.state.json['10100ORG-000056']});
           //查询版本信息还有新版本号
           let reqData = [
            {
                rqUrl: '/uapbd/org/queryversionvno.do',
                rqJson: `{\n  \"pk_org\": \"${pk_org}\"\n}`,
                rqCode: 'versionvno'
            },
            {
                rqUrl: '/uapbd/org/queryversionvo.do',
                rqJson: `{\n  \"pk_org\": \"${pk_org}\"\n}`,
                rqCode: 'versionvos'
            }
            ];
            ajax({
                url :'/nccloud/platform/pub/mergerequest.do',
                data : reqData,
                success : (res) => {
                    if(res.success){
                        debugger
                        //给table赋值versionvo
                        props.table.setAllTableData('org_v',res.data.versionvos['org_v']);
                        //给form赋值versioncode
                        props.form.setAllFormValue({['org_v_head']:res.data.versionvno['org_v_head']});
                    // props.form.setFormItemsValue('org_v_head',{vno:{value:res.data['versionvno'],display:res.data['versionvno']}});
                    //  props.form.setFormItemsValue('org_v_head',{pk_org:{value:pk_org,display:pk_org}});
                    }
                }
            });
           props.form.setFormStatus('org_v_head','edit');
           break;
        case 'financeorgversion':
            if(selectMember.length > 1){
                toast({content: _this.state.json['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                return;
            }
            
            ajax({
                url :'/nccloud/uapbd/org/queryfinanceversion.do',
                data:{type:'1'},
                success : (res) => {
                    if(res.success){
                        props.modal.show('financeorg_v',{title:_this.state.json['10100ORG-000019']});/* 国际化处理： 财务组织版本化*/
                        props.form.EmptyAllFormValue('financeorg_v');
                        if(res.data){
                            props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                        }
                    }
                }
            });
            setDefData('orgunit_versiontype',props.config.datasource,'1');
            setDefData('orgunit_modalid',props.config.datasource,'financeorg_v');
            //cacheTools.set('orgunit_versiontype','1');
            //cacheTools.set('orgunit_modalid','financeorg_v');
            props.form.setFormStatus('financeorg_v','edit');
            break;

        case 'adminorgversion':
            if(selectMember.length > 1){
                toast({content: _this.state.json['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                return;
            }
            
            ajax({
                url :'/nccloud/uapbd/org/queryfinanceversion.do',
                data:{type:'4'},
                success : (res) => {
                    if(res.success){
                        props.modal.show('financeorg_v',{title:_this.state.json['10100ORG-000020']});/* 国际化处理： 行政组织体系版本化*/
                        props.form.EmptyAllFormValue('financeorg_v');
                        if(res.data){
                            props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                        }
                    }
                }
            });
            setDefData('orgunit_versiontype',props.config.datasource,'4');
            setDefData('orgunit_modalid',props.config.datasource,'financeorg_v');
            //cacheTools.set('orgunit_versiontype','4');
            //cacheTools.set('orgunit_modalid','financeorg_v');
            props.form.setFormStatus('financeorg_v','edit');
            break;

        case 'liabilitycenterversion':
            if(selectMember.length > 1){
                toast({content: _this.state.json['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                return;
            }
            
            ajax({
                url :'/nccloud/uapbd/org/queryfinanceversion.do',
                data:{type:'2'},
                success : (res) => {
                    if(res.success){
                        
                        if(res.data){
                            if('error' == res.data['financeorg_v'].rows[0].values.vname.value){
                                promptBox({
                                    color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                    title: _this.state.json['10100ORG-000001'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                                    noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                                    content: _this.state.json['10100ORG-000021'],/* 国际化处理： 该集团下还未创建利润中心,确定要进行利润中心体系的版本化操作吗？*/
                                    beSureBtnClick: () =>{
                                        props.modal.show('financeorg_v',{title:_this.state.json['10100ORG-000022']});/* 国际化处理： 利润中心体系版本化*/
                                        props.form.EmptyAllFormValue('financeorg_v');
                                        props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                                        props.form.setFormItemsValue('financeorg_v',{'vname':{value:null,display:null}})
                                    }   
                                })
                            }else{
                                props.modal.show('financeorg_v',{title:_this.state.json['10100ORG-000022']});/* 国际化处理： 利润中心体系版本化*/
                                props.form.EmptyAllFormValue('financeorg_v');
                                props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                            }
                            
                        }
                    }
                }
            });
            setDefData('orgunit_versiontype',props.config.datasource,'2');
            setDefData('orgunit_modalid',props.config.datasource,'financeorg_v');
            props.form.setFormStatus('financeorg_v','edit');
            break;

        case 'hrorgversion':
            if(selectMember.length > 1){
                toast({content: _this.state.json['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                return;
            }
            
            ajax({
                url :'/nccloud/uapbd/org/queryfinanceversion.do',
                data:{type:'3'},
                success : (res) => {
                    if(res.success){
                        props.modal.show('financeorg_v',{title:_this.state.json['10100ORG-000023']});/* 国际化处理： 人力资源组织体系版本化*/
                        props.form.EmptyAllFormValue('financeorg_v');
                        if(res.data){
                            props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                        }
                    }
                }
            });
            setDefData('orgunit_versiontype',props.config.datasource,'3');
            setDefData('orgunit_modalid',props.config.datasource,'financeorg_v');
            props.form.setFormStatus('financeorg_v','edit');
            break;

        case 'orgmanager':
            if(selectMember.length > 1){
                toast({content: _this.state.json['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                return;
            }
        //组织主管
            
            ajax({
                url :'/nccloud/uapbd/org/orgmanagerquery.do',
                data:{pk_org:pk_org},
                success : (res) => {
                    if(res.success){
                        debugger
                        props.modal.show('orgmanager',{title: this.state.json['10100ORG-000057']});
                        if(res.data){
                            props.editTable.setTableData('orgmanager',res.data.orgmanager);
                        }else{
                            props.editTable.setTableData('orgmanager',{rows: []});
                        }
                        props.button.setButtonDisabled(['orgmanagedel'],true);
                        props.button.setButtonVisible(['orgmanagesave','orgmanagecancel'],false);
                        props.button.setButtonVisible(['orgmanageadd','orgmanageedit','orgmanagerefresh','orgmanagedel'],true);
                    }
                }
            });
            
            break;

        case 'attachconfig':
            //附件管理
            if(selectMember.length > 1){
                toast({content: _this.state.json['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                return;
            }
            console.log(getDefData('orgunit_pk_org', _this.config.datasource));
            _this.setState({
                showUploader: true,
            })
                break;
        case 'logomanage':
                //logo管理
                if(selectMember.length > 1){
                    toast({content: _this.state.json['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                    return;
                }
                ajax({
                    url :'/nccloud/uapbd/org/checklogo.do',
                    data:{pk_org:pk_org},
                    success : (res) => {
                        if(res.success){
                            if(res.data){
                                _this.setState({
                                    showlogoUploader: true,
                                })
                            }else{
                                toast({content: _this.state.json['10100ORG-000024'], color: 'warning'});/* 国际化处理： 业务单元中法人公司才能维护logo！*/
                                return;
                            }
                        }
                    }
                });
            break;
        case 'orgmoduleperiod':
                if(selectMember.length > 1){
                    toast({content: _this.state.json['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                    return;
                }
            //业务期初期间
                
                ajax({
                    url :'/nccloud/uapbd/org/orgmoduleperiod.do',
                    data:{pk_org: pk_org},
                    success : (res) => {
                        if(res.success){
                            debugger
                            props.modal.show('orgmoduleperiod',{title:this.state.json['10100ORG-000058']});
                            if(res.data){
                                props.editTable.setTableData('orgmoduleperiod',res.data.orgmoduleperiod);
                            }else{
                                props.editTable.setTableData('orgmoduleperiod',{rows: []});
                            }
                            props.editTable.setStatus('orgmoduleperiod','edit');
                        }
                    }
                });
            
            break;

        case 'createinnercustsupp':
            if(selectMember.length > 1){
                // toast({content: _this.state.json['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                // return;
                //支持批量生成内部客商，批量的时候需要把客商名称，客商简称，客商编码隐藏
                props.form.setItemsVisible('innercustsupp',{'code':false,'custname':false,'custshortname':false});
            }else{
                props.form.setItemsVisible('innercustsupp',{'code':true,'custname':true,'custshortname':true});
            }
            //生成内部客商
            //内部客商必须要把国家地区维护 !selectMember[0].values.countryzone.value
            if(!havecountryzone){
                toast({content:havenocountryzonename + _this.state.json['10100ORG-000025'], color: 'warning'});/* 国际化处理： 请先维护该组织的国家地区属性！*/
                return;
            }
            
            ajax({
                    url :'/nccloud/uapbd/org/checkinnercustsupp.do',
                    data:{pk_org: pk_orgarr},
                    success : (res) => {
                        if(res.success){
                            debugger
                            if(res.data.exists){
                                toast({content : res.data.existscontent,color : 'warning'});
                                return ;
                            }else{
                                props.modal.show('innercustsupp',{title: this.state.json['10100ORG-000059']});
                                props.form.setFormStatus('innercustsupp','edit');
                                props.form.EmptyAllFormValue('innercustsupp');
                                
                                props.form.setFormItemsValue('innercustsupp',{code:{value:getDefData('orgunit_code', props.config.datasource),display:getDefData('orgunit_code', props.config.datasource)}});
                                
                                props.form.setFormItemsValue('innercustsupp',{custname:{value:getDefData('orgunit_name', props.config.datasource),display:getDefData('orgunit_name', props.config.datasource)}});
                                props.form.setFormItemsValue('innercustsupp',{custshortname:{value:getDefData('orgunit_shortname', props.config.datasource),display:getDefData('orgunit_shortname', props.config.datasource)}});
                            }
                        }
                    }
                });
            break;

        case'editVAT':
            if(selectMember.length > 1){
                toast({content: _this.state.json['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                return;
            }
        //维护vat
        ajax({
            url :'/nccloud/uapbd/org/checklogo.do',
            data:{pk_org:pk_org},
            success : (res) => {
                if(res.success){
                    if(res.data){
                        ajax({
                            url :'/nccloud/uapbd/org/vatquery.do',
                            data:{pk_org: pk_org},
                            success : (res) => {
                                if(res.success){
                                    props.modal.show('orgvatfunclet',{title:this.state.json['10100ORG-000060']});
                                    debugger
                                    if(res.data){
                                        props.editTable.setTableData('orgvatfunclet',res.data.orgvatfunclet);
                                    }else{
                                        props.editTable.setTableData('orgvatfunclet',{rows: []});
                                    }
                                    props.editTable.setStatus('orgvatfunclet','browse');
                                    props.button.setButtonDisabled(['vatdel'],true);
                                    props.button.setButtonVisible(['vatadd','vatdel','vatedit','vatrefresh'],true);
                                    props.button.setButtonVisible(['vatsave','vatcancel','vatlinedel'],false);
                                }
                            }
                        });
                    }else{
                        toast({content: _this.state.json['10100ORG-000026'], color: 'warning'});/* 国际化处理： 业务单元中财务才能维护VAT！*/
                        return;
                    }
                }
            }
        });        
        break;

        case'orgunitreldept':
        //业务单元关联部门
            
            ajax({
                url :'/nccloud/uapbd/org/querytreenode.do',
                success : (res) => {
                    if(res.success){
                        debugger
                        props.modal.show('orgdept',{title: this.state.json['10100ORG-000061']});
                        //转换树的父子关系
                        //let treeData = dealTreeData(res.data);
                        props.syncTree.setSyncTreeData('orgunittree', res.data);
                        //设置默认中第一行
                        props.syncTree.setNodeSelected('orgunittree', pk_orgarr[0]);
                        _this.onSelectEve( pk_orgarr[0],null,true);
                        // if(res.data[0].refpk!=='root'){
                        //     props.onSelectEve( res.data[0].refpk,null,true);
                        // }
                    }else{
                        alert(res.message);
                    }
                }
            });
            break;

        case'setorgroot':
            if(selectMember.length > 1){
                toast({content: _this.state.json['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                return;
            }
            promptBox({
                color:'info',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: _this.state.json['10100ORG-000027'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 提示*/
                noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                content: _this.state.json['10100ORG-000028'],/* 国际化处理： 您确定要设置成根业务单元吗？*/
                beSureBtnClick: () =>{
                    _this.onSetUnitOrgRoot();
                }   
            })
           // props.modal.show('setorgroot');
            break;

        case'setcorproot':
            if(selectMember.length > 1){
                toast({content: _this.state.json['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                return;
            }

            promptBox({
                color:'info',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: _this.state.json['10100ORG-000027'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 提示*/
                noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                content: _this.state.json['10100ORG-000029'],/* 国际化处理： 您确定要设置成根公司吗？*/
                beSureBtnClick: () =>{
                    _this.onSetCorpRoot();
                }   
            })
            //props.modal.show('setcorproot');
            break;

        case'setadminorgroot':
            if(selectMember.length > 1){
                toast({content: _this.state.json['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                return;
            }

            promptBox({
                color:'info',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: _this.state.json['10100ORG-000027'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 提示*/
                noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                content: _this.state.json['10100ORG-000030'],/* 国际化处理： 您确定要设置成根行政组织吗？*/
                beSureBtnClick: () =>{
                    _this.onSetAdminOrgRoot();
                }   
            })
           // props.modal.show('setadminorgroot');
            break;

        case 'print':
            let pks = getDefData('orgunit_allpkorg', props.config.datasource);//cacheTools.get('orgunit_allpkorg');
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                '/nccloud/uapbd/org/print.do', 
                {
                    //billtype:'',  //单据类型
                    funcode: props.config.appcode,      //功能节点编码，即模板编码
                    nodekey:'listPrint',     //模板节点标识
                    oids: pks    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                },false
            );
            break;
        case 'export':
            let pks1 = getDefData('orgunit_allpkorg', props.config.datasource);//cacheTools.get('orgunit_allpkorg');
            let data = {
                funcode:props.config.appcode,  
                appcode:props.config.appcode,      //小应用编码
                nodekey:'listPrint',     //模板节点标识
                oids:pks1,    // 功能节点的数据主键  oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印
                outputType: 'output'
             }

            _this.setState({
                pks: pks1
             },() => {
                output({data: data,url:'/nccloud/uapbd/org/print.do'})
            });
            // print(
            //     'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
            //     '/nccloud/uapbd/org/print.do', 
            //     {
            //         //billtype:'',  //单据类型
            //         funcode: props.config.appcode,      //功能节点编码，即模板编码
            //         //nodekey:'',     //模板节点标识
            //         // nodekey:'assprinttem',  
            //         outputType:'output',
            //         oids: pks1    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
            //     }
            // );
            break;
        default:
            break;
    }
}


/**
     * 停启用等修改数据后，表头ts和停启用字段更新
     * @param data
     * @returns {*}
     */
function dealdefaultdata(selectMember,data,props,display,value,onlyupdatets){
        //这个获取选中节点方法耗时2秒左右，所以选择传进来
        //let selectMember = props.treeTableManyCol.getSelectedRow(props.config.gridId);
        //停启用之后不用刷新所有数据，只需要把停启用状态修改就可以了
        if(selectMember.length = 0 ){
            //如果没有选中数据，直接返回
            toast({content: _this.state.json['10100ORG-000089'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
            return ;
        }
        let rows = {};
        selectMember.map((abs)=>{
            if(onlyupdatets){
                rows.values.ts.value = data[rows.values.pk_org.value];
            }else{
                rows = props.treeTableManyCol.getValueByRowId(props.config.gridId, abs.rowId);
                rows.values.enablestate.display = display;
                rows.values.enablestate.value = value;
                rows.values.ts.value = data[rows.values.pk_org.value];
                props.treeTableManyCol.editRowEve(props.config.gridId, rows);
            }
            
            //如果有缓存数据，也需要把缓存的数据修改
            let enablecarddata = getDefData('orgunit_carddata_'+abs.values.pk_org.value,props.config.datasource);
            if(enablecarddata){
                enablecarddata.find((item) => {
                    if(item.hasOwnProperty('org')){
                        if(onlyupdatets){
                            item.org.rows[0].values.ts.value = data[rows.values.pk_org.value];
                        }else{
                            item.org.rows[0].values.enablestate.display = display;
                            item.org.rows[0].values.enablestate.value = value;
                            item.org.rows[0].values.ts.value = data[rows.values.pk_org.value];
                        }
                    }
                });
                //修改完数据之后，需要更新缓存数据
                setDefData('orgunit_carddata_'+abs.values.pk_org.value,props.config.datasource,enablecarddata);
            }
        })
    }

//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS