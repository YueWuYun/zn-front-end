//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast,cacheTools,print,high,getBusinessInfo,promptBox,getMultiLang,cardCache} from 'nc-lightapp-front';
let { getCacheById, updateCache ,addCache,getCurrentLastId ,getNextId, deleteCacheById,setDefData, getDefData} = cardCache;
const { NCAffix,NCPopconfirm,NCFormControl,NCDiv,NCBackBtn} = base;
const {PrintOutput} = high;
import AssignModal from '../assign/AssignModal';
import createUIDom from '../../../public/utils/BDCreateUIDom';

const formId = 'head';                      //表头id
const tableId = 'bodyvos';                  //子表id
const pageId = '10140PRJG_card';            //pagecode
const searchId = 'search';                  //查询区id
const appId ='10140PRJG';        //按钮注册id
const queryCardUrl = '/nccloud/uapbd/pmbase/ProjectCardQuery.do';   //卡片查询url
const saveUrl = '/nccloud/uapbd/pmbase/ProjectSave.do';             //新增保存
const updateUrl = '/nccloud/uapbd/pmbase/ProjectUpdate.do';         //修改保存
const deleteUrl = '/nccloud/uapbd/pmbase/ProjectDelete.do';         //删除
const qryUserInfoUrl = '/nccloud/uapbd/sminfo/PaymentLoginUserInfoQuery.do'//登录用户信息
const enableUrl = '/nccloud/uapbd/pmbase/ProjectEnable.do';         //启用
const disableUrl = '/nccloud/uapbd/pmbase/ProjectDisable.do';       //停用
const printUrl = '/nccloud/uapbd/pmbase/ProjectPrint.do';       //打印
const addUrl = '/nccloud/uapbd/pmbase/ProjectAdd.do';           //新增
const vaidUrl = '/nccloud/uapbd/pmbase/ProjectValid.do';        //校验
const pk_item = 'pk_project';               //单据主键--用于卡片查询刷新
const titleCode = 'project_code';           //单据编码--用于卡片表头显示
// const titleName = this.state.json['10140PRJB-000011'];					//节点名称/* 国际化处理： 项目*/
//const tableBtnAry = ['delline','detail','spread'];		//表格列操作按钮
const cachKey = '10140PRJG_list';//缓存的标识

let tableBtnAry =(props)=>{
    return props.getUrlParam('status') === 'browse'
        ? [ 'detail' ]: ['insertline','delline','spread'];
}

//
// let initTemplate =(props)=>{
//
// }


class Card extends Component {

    constructor(props) {
        super(props);
        this.formId = formId;
        this.searchId = searchId;
        this.tableId = tableId;
        this.state = {
            pk_org : '',
            title_code : '',
            totalcount : 0,
            applycount : 0,
            json:{}	
        }
        createUIDom(props)(
            {
                pagecode: props.pagecode_card//,//页面id
                // appcode: props.appcode//注册按钮的id
            },
            {
                moduleId: "10140PRJB",domainName: 'uapbd'
            },
            (data,langData)=>{
                if(langData){
                    this.state.json = langData;
                }
                if(data){
                    if(data.template){
                        let meta = data.template;
                        this.modifierMeta(props, meta)
                        props.meta.setMeta(meta);
                        // let status = props.getUrlParam('status');
                        // if(status && status == 'add'){
                        // 	props.cardTable.addRow(tableId);
                        // }
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                        this.toggleShow(props);
                    }
                }
            }
        )
    }

    componentDidMount() {
        // toggleShow(this.props);

        let status = this.props.getUrlParam('status');
        if(status != "add"){
            let	pk = this.props.getUrlParam('id');
            if(pk && pk != 'undefined'){
                this.getdata(pk);
            }
        }
        else{
            let data = {
                nodeType:this.props.nodeType
            }
            this.setDefaultValue(data);
        }
        this.toggleShow(this.props);
    }


    componentDidUpdate(){
        let l_formstatus = this.props.form.getFormStatus(formId);
        if(l_formstatus != 'add' && l_formstatus != "edit"){
            window.onbeforeunload = null;
        }
        else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    setDefaultValue = (data,callback) =>{
        // this.props.form.setFormItemsValue(this.formId,{'bill_status':{value:'0',display:'自由态'}});
        // if(this.props.nodeType == 'group'){
        //    ajax({
        //        url:qryUserInfoUrl,
        //        success:(res)=>{
        //            this.props.form.setFormItemsValue(this.formId,{'pk_org':
        //                    {
        //                        value:res.data.group.pk_group,
        //                        display:res.data.group.name
        //                    }});
        //        }
        //    })
        // }
        // else if(this.props.nodeType == 'global'){
        //
        //    this.props.form.setFormItemsValue(this.formId,{'pk_org':
        //            {
        //                value:'GLOBLE00000000000000',
        //                display:'全局'
        //            }});
        // }

        let rst = getDefData('listAddData',cachKey);
        if(rst && rst != null){
            this.setValue(data,rst);
            setDefData('listAddData',cachKey,null);
        }else{
            ajax({
                url:addUrl,
                data,
                success:(res)=>{
                    if(res){
                        callback && callback();
                        this.setValue(data,res);
                    }
                }
            })
        }
    }

    setValue=(data,res)=>{  

        if(!(data.event && data.event == 'cancel')){

            this.props.form.setAllFormValue({[this.formId]:res.data["10140PRJG_card"].head[this.formId]});
            
            let billcode = res.data["10140PRJG_card"].head[this.formId].rows[0].values[titleCode].value;

            if(billcode && billcode != ''){
                //是否可编辑
                this.props.form.setFormItemsDisabled(this.formId,{[titleCode]:res.data.billnumberIsEditable=='Y'?false:true});
            }
            if(res.data["10140PRJG_card"].body){
                this.props.cardTable.setTableData(this.tableId, res.data["10140PRJG_card"].body[this.tableId]);
            }else{
                this.props.cardTable.setTableData(this.tableId, []);
            }
            // translateSwitch();
            // this.props.form.setFormItemsValue(this.formId,{'enablestate':{value:true,display:'已启用'}});
            // 项目组织节点，责任组织由项目组织带出,修改态不能编辑项目组织，所以取管理组织值，不触发编辑后事件,这先加上处理，之后可以看看改成编辑前事件
            if(this.props.nodeType == 'org'){
                let pk_org = this.props.form.getFormItemsValue(this.formId,'pk_org').value;
                this.setDeptPsnRefCond(this.props,pk_org);

                //项目组织节点，没有选项目组织的时候，表头不可编辑
                if(pk_org){
                    this.props.form.setFormStatus(formId,this.props.getUrlParam('status'))
                    this.props.cardTable.setStatus(tableId, this.props.getUrlParam('status'));
                }else{
                    this.props.form.setFormStatus(formId, 'browse');
                    this.props.cardTable.setStatus(tableId, 'browse');
                }                        
            }
        }
        this.toggleShow(this.props);
    
    }


    buttonClick =(props, id)=>{

        let _this = this;
        switch (id) {
            case 'add':
                let data = {
                    nodeType:props.nodeType
                }
                this.setDefaultValue(data,()=>{
                    props.form.EmptyAllFormValue("org_select")
                    props.form.EmptyAllFormValue(this.formId)
                    props.cardTable.setTableData(this.tableId, { rows: [] })
                    // props.linkTo(props.cardUrl, {
                    //     appcode:props.appcode,
                    //     pagecode:props.pagecode_card,
                    //     status: 'add'
                    // })   
                    props.setUrlParam({
                        appcode:props.appcode,
                        pagecode:props.pagecode_card,
                        status: 'add'
                    });
                    this.toggleShow(props);
                });
                break
            case 'edit':
                let pk_org = this.props.form.getFormItemsValue(this.formId,'pk_duty_org').value;
                this.setDeptPsnRefCond(props,pk_org);
                this.valid(props,()=>{
                    // props.linkTo(props.cardUrl, {
                    //     appcode:props.appcode,
                    //     pagecode:props.pagecode_card,
                    //     status: 'edit',
                    //     id: props.getUrlParam('id')
                    // })
                    
                    props.setUrlParam({
                        appcode:props.appcode,
                        pagecode:props.pagecode_card,
                        status: 'edit',
                        id: props.getUrlParam('id')
                    });
                    this.toggleShow(props);
                })
                break;
            case 'delete':
                this.valid(props,()=>{
                        promptBox({
                            color:"warning",title: this.state.json['10140PRJB-000010'],/* 国际化处理： 删除*/
                            content: this.state.json['10140PRJB-000013'],/* 国际化处理： 确定要删除吗？*/
                            beSureBtnClick: this.delConfirm.bind(this)
                    })})
                break
            case 'back':
                props.pushTo(props.listUrl, {
                    // appcode:props.appcode,
                    pagecode:props.pagecode_list,
                    status: 'browse'
                });
                cacheTools.remove('preid');
                break
            case 'save':
                this.saveClick();
                break
            case 'cancel':
                promptBox({
                    color:"warning",
                    title: this.state.json['10140PRJB-000012'],/* 国际化处理： 取消*/
                    content: this.state.json['10140PRJB-000014'],/* 国际化处理： 确定要取消吗？*/
                    beSureBtnClick: this.cancel.bind(this,props)
                });
                break
            case 'addline':
                props.cardTable.addRow(this.tableId);
                break
            case 'refresh':
                // props.linkTo(props.cardUrl, {
                //     appcode:props.appcode,
                //     pagecode:props.pagecode_card,
                //     status:props.getUrlParam('status'),
                //     id:props.getUrlParam('id')
                // })
                props.setUrlParam({
                    appcode:props.appcode,
                    pagecode:props.pagecode_card,
                    status:props.getUrlParam('status'),
                    id:props.getUrlParam('id')
                });
                this.getdata(props.getUrlParam('id'),'refresh');
                break;
            case 'enable':
                this.valid(props,()=>{
                    promptBox({
                        color:"warning",
                        title: this.state.json['10140PRJB-000012'],/* 国际化处理： 注意*/
                        content: this.state.json['10140PRJB-000015'],/* 国际化处理： 确认启用？*/
                        beSureBtnClick: this.enableAction.bind(this)
                    });
                })
                break;
            case 'enable1':
                this.valid(props,()=>{
                    promptBox({
                        color:"warning",
                        title: this.state.json['10140PRJB-000012'],/* 国际化处理： 注意*/
                        content: this.state.json['10140PRJB-000015'],/* 国际化处理： 确认启用？*/
                        beSureBtnClick: this.enableAction.bind(this)
                    });
                })
                break;
            case 'disable':
                this.valid(props,()=>{
                    promptBox({
                        color:"warning",
                        title: this.state.json['10140PRJB-000012'],/* 国际化处理： 注意*/
                        content: this.state.json['10140PRJB-000016'],/* 国际化处理： 确认停用？*/
                        beSureBtnClick: this.disableAction.bind(this)
                    });
                })
                break;
            case 'assig':
                this.valid(props,()=>{this.assignModal.show('assign');})
                break;
            case 'assig1':
                this.valid(props,()=>{this.assignModal.show('assign');})
            case 'unassig':
                this.valid(props,()=>{this.assignModal.show('unassig');})
                break;
            case 'printGrp':
                this.onPrint();
                break;
            case 'print':
                this.onPrint();
                break;
            case 'output':
                this.onOutput();
                break;
            default:
                break
        }
    }

    
    cancel=(props)=>{

        let pk = this.props.getUrlParam('id');
        if(!pk){
            pk = getCurrentLastId(cachKey);
        }

        //回退单据号
        if (props.getUrlParam('status') === 'add') {
            let billcode = this.props.form.getFormItemsValue(this.formId,titleCode).value;
            let data ={
                event:'cancel',
                [titleCode]:billcode==null?null:billcode,
                nodeType:props.nodeType
            }
            this.setDefaultValue(data);
        }

        props.setUrlParam({
            appcode:props.appcode,
            pagecode:props.pagecode_card,
            status: 'browse',
            id: pk 
        });

        this.getdata(pk);
        this.toggleShow(this.props);

        // debugger
        // if (props.getUrlParam('status') === 'add') {

        //     let billcode = this.props.form.getFormItemsValue(this.formId,titleCode).value;

        //     let data ={
        //         event:'cancel',
        //         [titleCode]:billcode==null?null:billcode
        //     }

        //     this.setDefaultValue(data);

        //     if(cacheTools.get("preid")){

        //         props.form.cancel(this.formId);
        //         props.cardTable.resetTableData(this.tableId);
        //         // props.linkTo(props.cardUrl, {
        //         //     appcode:props.appcode,
        //         //     pagecode:props.pagecode_card,
        //         //     status: 'browse',
        //         //     id: cacheTools.get("preid")
        //         // })
        //         props.setUrlParam({
        //             appcode:props.appcode,
        //             pagecode:props.pagecode_card,
        //             status: 'browse',
        //             id: cacheTools.get("preid")
        //         });
        //         this.toggleShow(this.props);
        //     }
        //     else{
        //         props.pushTo(props.listUrl, {
        //             appcode:props.appcode,
        //             pagecode:props.pagecode_list,
        //             status: 'browse'
        //         })
        //     }
        // }
        // if ((props.getUrlParam('status') === 'edit')) {
        //     // props.form.cancel(this.formId);
        //     // props.cardTable.resetTableData(this.tableId);//新增的子表数据依旧存在
        //     // props.linkTo(props.cardUrl, {
        //     //     appcode:props.appcode,
        //     //     pagecode:props.pagecode_card,
        //     //     status: 'browse',
        //     //     id: props.getUrlParam('id')
        //     // })
        //     let	pk = this.props.getUrlParam('id');
        //     if(pk && pk != 'undefined'){
        //         this.getdata(pk);
        //     }
        //     props.setUrlParam({
        //         appcode:props.appcode,
        //         pagecode:props.pagecode_card,
        //         status: 'browse',
        //         id: props.getUrlParam('id')
        //     });
        // }
        // this.toggleShow(this.props);
    }

    valid=(props,callback)=>{
        let data = {
            pks:[props.form.getFormItemsValue(formId,pk_item).value],
            nodeType:props.nodeType
        }
        ajax({
            url:vaidUrl,
            data,
            success:(res)=>{
                callback && callback();
            }
        })
    }
    /**
     * 返回按钮操作
     */
    onReturnClick(){
        this.props.pushTo(this.props.listUrl, {
            pagecode: this.props.pagecode_list,
            // appcode: this.props.appcode,
            status: 'browse'
        })
    }
    //打印
    onPrint=()=>{

        let allData = this.props.form.getAllFormValue(formId);

        if(allData.length === 0){
            toast({content:this.state.json['10140PRJB-000017'],color:'warning'});/* 国际化处理： 无可打印数据*/
            return;
        }

        let pks = [];

        allData.rows.forEach((item,key)=>{
            pks.push(item.values[pk_item].value);
        });
        print(
            'pdf',
            printUrl,
            {
                funcode:this.props.printFunCode,//小应用编码
                nodekey:this.props.printNodeKey,//模板节点编码
                oids:pks
            }
        )
    }
    //输出
    onOutput=()=>{

        let allData = this.props.form.getAllFormValue(formId);
        if(allData.length === 0){
            toast({content:this.state.json['10140PRJB-000018'],color:'warning'});/* 国际化处理： 无可输出的数据*/
            return;
        }
        let pks = [];

        allData.rows.forEach((item,key)=>{
            pks.push(item.values[pk_item].value);
        });
        this.setState({
            ids : pks
        },this.refs.printOutput.open());
    }

    //启用
    enableAction=(isSwitch)=>{

        let curSels = this.props.form.getAllFormValue(formId).rows[0];

        let rows = [];
        //获取到的是新状态，所以修改回原状态，做后台更新用
        if(isSwitch){
            curSels.values.enablestate.value = curSels.values.enablestate.value==true?'3':'2';
        }else{
            curSels.values.enablestate.value = curSels.values.enablestate.value==true?'2':'3';
        }

        rows.push(curSels);

        let data= {
            model:{rows:rows}
        }

        ajax({
            url:enableUrl,
            data:data,
            success: (res) => {
                toast({title : this.state.json['10140PRJB-000019'],color : 'success'});/* 国际化处理： 启用成功*/
                this.getdata(this.props.getUrlParam('id'));
            }
        })
    }
    //停用
    disableAction=(isSwitch)=>{
        let curSels = this.props.form.getAllFormValue(formId).rows[0];

        let rows = [];
        //获取到的是新状态，所以修改回原状态，做后台更新用，开关事件，修改了启用状态
        if(isSwitch){
            curSels.values.enablestate.value = curSels.values.enablestate.value==true?'3':'2';
        }else{
            curSels.values.enablestate.value = curSels.values.enablestate.value==true?'2':'3';
        }

        rows.push(curSels);

        let data= {
            model:{rows:rows}
        }

        ajax({
            url:disableUrl,
            data:data,
            success: (res) => {
                toast({title : this.state.json['10140PRJB-000020'],color : 'success'});/* 国际化处理： 停用成功*/
                this.getdata(this.props.getUrlParam('id'));
            }
        })
    }

    pageInfoClick=(props, pk)=>{

        this.getdata(pk);

        // let data = {
        //     "pk": pk,
        //     "pageid": props.pagecode_card
        // };
        // ajax({
        //     url: queryCardUrl,
        //     data: data,
        //     success: (res) =>{
        //         if (res.data.head) {

        //             props.form.setAllFormValue({ [formId]: res.data.head[formId] });
        //             props.setUrlParam(pk)//动态修改地址栏中的id的值
        //         }
        //         if (res.data.body) {
        //             props.cardTable.setTableData(tableId, res.data.body[tableId]);
        //         }
        //     }
        // });
    }

    setDeptPsnRefCond=(props,pk_org)=>{
         debugger
        let meta = props.meta.getMeta();

        if(meta && meta != null && meta['head'] && meta['head'] != null){
            meta['head'].items = meta['head'].items.map((item) => {
                //责任部门参照需要将责任组织pk_org作为过滤条件
                if (item.attrcode == 'pk_duty_dept_v') {
                    item.queryCondition = () => {
                        return {
                            pk_org: pk_org,
                            busifuncode: 'it',
                        }
                    }
                }

               
              /**  if (item.attrcode == 'hdef57') {
             //       item.queryCondition = () => {
             //           return {
             //               pk_org: pk_org,
              ////              busifuncode: 'it',
            //            }
            //        }
           //     }
                */
                if (item.attrcode == 'pk_duty_dept') {
                    item.queryCondition = () => {
                        return {
                            pk_org: pk_org,
                            busifuncode: 'it',
                        }
                    }
                }
                //责任人参照需要将责任组织pk_org作为过滤条件
                if (item.attrcode == 'pk_dutier') {
                    item.queryCondition = {
                        pk_org: pk_org,
                        busifuncode: 'it'
                    }
                }
              
                if(item.attrcode == 'pk_parentpro'){
                       debugger
                       item.queryCondition = {
                        pk_org: pk_org,
                        busifuncode: 'it'
                    }

                }

                return item;
            })
            props.meta.setMeta(meta);
        }
    }

    setEnablestate = (stat)=>{
        this.props.form.setFormItemsValue(this.formId,{'enablestate':{value:stat,display:(stat == true?this.state.json['10140PRJB-000021']:this.state.json['10140PRJB-000022'])}});/* 国际化处理： 已启用,已停用*/
    }

    afterEvent =(props, moduleId, key,value, changedrows, i, s, g)=>{
         debugger
        //选择某一参照后需将参照值作为关联参照的过滤条件
        if (key === 'pk_duty_org_v' && value.value !== '' && value.value != undefined && value.value != null) {
            //选择责任组织后清空责任人和责任部门值
            props.form.setFormItemsValue(formId,{'pk_dutier':{value:'',scale: "-1",display:''},'pk_duty_dept_v':{value:'',scale: "-1",display:''}});
            let pk_vid = props.form.getFormItemsValue(formId, 'pk_duty_org_v');
            let pk_org;
            //根据责任组织pk_vid获取其pk_org
            ajax({
                url: '/nccloud/uapbd/pmbase/ProjectItemChangeQuery.do',
                data: {
                    item: 'pk_duty_org_v',
                    pk: pk_vid.value
                },
                success: (res) => {
                    pk_org = res.data['pk_itemorg']
                    this.setDeptPsnRefCond(props,pk_org)
                    // 设置币种
                    let pk_currtype = res.data['PK_CURRTYPE']
                    this.props.form.setFormItemsValue(formId,{'pk_currtype':{value:pk_currtype,display:''}})
                }
            });
        }
        //选择完责任人后,若责任部门为空则自动填充责任部门
        if (key === 'pk_dutier') {
            let pk_duty_dept_v = props.form.getFormItemsValue(formId, 'pk_duty_dept_v');
            let deptValue = pk_duty_dept_v.value;
            if ((deptValue === ''||deptValue==null||deptValue==undefined) && value.value !== '' && value.value != undefined && value.value != null) {
                ajax({
                    url: '/nccloud/uapbd/pmbase/ProjectItemChangeQuery.do',
                    data: {
                        item: 'pk_psndoc',
                        pk: value.value
                    },
                    success: (res) => {
                        props.form.setFormItemsValue(formId, { 'pk_duty_dept_v': { display: res.data['name'], scale: "-1", value: res.data['pk_vid'] } })
                    }
                });
            }



        }
        if(key === 'enablestate' && props.form.getFormStatus(moduleId) == 'browse'){

            this.valid(props,()=>{
                if (value.value == true || value.value == '2') {
                    // promptBox({
                    //     color:"warning",
                    //     title: this.state.json['10140PRJB-000012'],/* 国际化处理： 注意*/
                    //     content: this.state.json['10140PRJB-000015'],/* 国际化处理： 确认启用？*/
                    //     beSureBtnClick: this.enableAction.bind(this,true),
                    //     cancelBtnClick: this.setEnablestate.bind(this,false)
                    // });
                    this.enableAction(true)
                }
                else {
                    // promptBox({
                    //     color:"warning",
                    //     title: this.state.json['10140PRJB-000012'],/* 国际化处理： 注意*/
                    //     content: this.state.json['10140PRJB-000016'],/* 国际化处理： 确认停用？*/
                    //     beSureBtnClick: this.disableAction.bind(this,true),
                    //     cancelBtnClick: this.setEnablestate.bind(this,true)
                    // });
                    this.disableAction(true)
                }})
        }

        if(key === 'pk_parti_org_v' && s.status === '2'){
            let rowNum = props.cardTable.getNumberOfRows(this.tableId)-1;
            let isChangedRow = true;
            // props.cardTable.delRowsByIndex(moduleId, rowNum);
            //子表编辑弹出侧拉框，组织参照没有更新成多选，此处做个判断先，之后提问题给平台
            if(value.length != undefined){
                
                value.forEach(element => {
                    if(isChangedRow){
                        props.cardTable.setValByKeyAndIndex(this.tableId,i,'pk_parti_org_v',{value: element.refpk, display: element.refcode});
                        props.cardTable.setValByKeyAndIndex(this.tableId,i,'pk_parti_org_v.name',{value: element.refname, display: element.refname});
                        isChangedRow = false;
                    }
                    else{
                        props.cardTable.addRow(this.tableId,rowNum,{'showorder':{display:'',value:rowNum+1+''},'pk_parti_org_v':{display:element.refcode,value:element.refpk},'pk_parti_org_v.name':{display:element.refname,value:element.refname}},false);
                    }
                });
            }
            else{
                // props.cardTable.addRow(this.tableId,rowNum,{'pk_parti_org_v':{display:value.refcode,value:value.refpk},'pk_parti_org_v.name':{display:value.refname,value:value.refname}},false);
                props.cardTable.setValByKeyAndIndex(this.tableId,i,'pk_parti_org_v.name',{value: value.refname, display: value.refname});
            }   
        }
        if(key === 'pk_parti_org_v' && s.status === '1'){
            // props.cardTable.delRowsByIndex(moduleId, i);
            var ss = s.values['pk_parti_org_v'].display.split(",");
            var sProjectB = s.values['pk_project_b'].value;
            let isChangedRow = true;
            //先默认带备注，模板配其他字段后需要继承时可以用循环赋值，以后再处理！！！！！
            let rowNum = props.cardTable.getNumberOfRows(this.tableId);
            //props.cardTable.setValByKeyAndRowId(moduleId,rowNum,'item',{value: '' })
            if(value.length != undefined){
                value.forEach(element => {
                    
                    if(isChangedRow){
                        props.cardTable.setValByKeyAndIndex(this.tableId,i,'pk_parti_org_v',{value: element.refpk, display: element.refcode});
                        props.cardTable.setValByKeyAndIndex(this.tableId,i,'pk_parti_org_v.name',{value: element.refname, display: element.refname});
                        isChangedRow = false;
                    }
                    else{
                        // if(element.refcode == null){
                        //     element.refcode = ss[0]
                        // }
                        props.cardTable.addRow(this.tableId,rowNum,{'showorder':{display:'',value:rowNum+1+''},'pk_parti_org_v':{display:element.refcode,value:element.refpk},'pk_parti_org_v.name':{display:element.refname,value:element.refname}},false);
                    
                    }
                });
            }
            else{
                // props.cardTable.addRow(this.tableId,rowNum,{'pk_parti_org_v':{display:value.refcode,value:value.refpk},'pk_parti_org_v.name':{display:value.refname,value:value.refname}},false);
                props.cardTable.setValByKeyAndIndex(this.tableId,i,'pk_parti_org_v.name',{value: value.refname, display: value.refname});
            }       
        }
    }


    beforeEvent=(props, moduleId, key,value, changedrows, i, s, g)=>{

     }


    //通过单据id查询单据信息
    getdata = (pk,btn) =>{
        debugger;
        if(pk == undefined || pk == ''){
            // toast({ 'color':'danger','content':this.state.json['10140PRJB-000023']});/* 国际化处理： 卡片数据异常，返回列表后重新进入！*/
            //清除上个界面的所有的值
            this.props.form.EmptyAllFormValue(formId);
            this.props.cardTable.setTableData(tableId,{rows: []});
            return;
        }
        let data = {pk};
        ajax({
            url: queryCardUrl,
            data,
            success: (res) => {
                if(res.data==undefined){
                    toast({ 'color':'danger','content':this.state.json['10140PRJB-000024']});/* 国际化处理： 数据不存在或已删除！请返回列表*/
                    return; 
                }
                if (res.data.head) {
                    res.data.head.head.rows[0].values.enablestate.value=res.data.head.head.rows[0].values.enablestate.value === '2'?true:false;
                    // this.props.form.setFormItemsValue('org_select','pk_org',res.data.head.head.rows[0].values.pk_org);
                    this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId]});
                    let title_code = res.data.head[this.formId].rows[0].values[titleCode].value;
                    this.setState({title_code});

                    // 设置项目组织默认值
                    if(this.props.nodeType == 'org'){
                        let pk_org = this.props.form.getFormItemsValue(this.formId,'pk_org');
                        let pk_group = this.props.form.getFormItemsValue(this.formId,'pk_group');
                        // let orgvalue= {'pk_org':{pk_org}};
                        let orgvalue= {pk_org};
                        if(pk_org && pk_org.value !=pk_group.value&&pk_org.value!='GLOBLE00000000000000'){
                            this.props.form.setFormItemsValue('org_select',orgvalue);
                        }
                    }else{
                        this.props.form.setFormItemsValue('org_select',{});
                    }
                    this.props.setUrlParam(pk)//动态修改地址栏中的id的值
                }
                if (res.data.body) {
                    this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                    // let totalcount = this.props.cardTable.getNumberOfRows(this.tableId);
                    // let arr = this.props.cardTable.getAllRows(this.tableId);
                    // let applycount = 0;
                    // arr.map((item)=>{
                    // 	applycount += parseInt(item.values.pk_project.value);
                    // })
                    // this.setState({applycount});
                    // this.setState({totalcount});
                }else{
                    this.props.cardTable.setTableData(this.tableId, {rows: []});
                }
                if(btn == 'refresh'){
                    debugger
                    toast({title : this.state.json['10140PRJB-000025'],color : 'success'});/* 国际化处理： 刷新成功*/
                }
                this.toggleShow(this.props);
            }
        });
    }

    validBodyRepeat=(rows)=> {

        if(!rows || rows.length == 0)
            return true;

        let pkMap = new Map();

        if(rows && rows.length>0){
            let i = 1;
            rows.forEach((row,key)=>{
                let pk = row.values.pk_parti_org_v.value;
                let rowNum = pkMap.get(pk);
                if(!rowNum || rowNum == null){
                    rowNum = i.toString();
                    i++;
                }else{
                    rowNum = `${rowNum},${i}`;
                    i++;
                }
                pkMap.set(pk,rowNum);
            });
        }
        let errMsg = this.state.json['10140PRJB-000026'];/* 国际化处理： 输入错误提示：项目-参与组织主键行  */
        pkMap.forEach((value,key, map) => {
            if(value.includes(',')){
                errMsg = errMsg + '['+ value + this.state.json['10140PRJB-000027']/* 国际化处理： ] 不能重复*/
            }
        });
        if(errMsg != this.state.json['10140PRJB-000026']){/* 国际化处理： 输入错误提示：项目-参与组织主键行  */
            toast({content : errMsg ,color : 'danger'});
            return false;
        }
        return true;
    } 

    // 表头信息校验
    validHead=(formData)=>{

        if(formData){
            let row = formData.rows[0];

            if(row){
                let startDate = row.values.plan_start_date;
                let finishDate = row.values.plan_finish_date;
                if(!startDate || !finishDate)return;
                if(!(startDate && startDate.value != null))
                    return this.state.json['10140PRJB-000028'];/* 国际化处理： 计划开始日期不能为空*/
                if(!(finishDate && finishDate.value != null))
                    return this.state.json['10140PRJB-000029'];/* 国际化处理： 计划完成日期不能为空*/
                if(Date.parse(new Date(startDate.value))>Date.parse(new Date(finishDate.value)))
                    return this.state.json['10140PRJB-000030']/* 国际化处理： 计划完成日期必须大于等于计划开始日期*/
            }
        }
    }

    //保存单据
    saveClick = () =>{

        if(this.props.form.isCheckNow(this.formId) && this.props.cardTable.checkTableRequired(tableId)){

            let formData = this.props.form.getAllFormValue(this.formId);
            
            let msg = this.validHead(formData);

            if( msg!= null){
                toast({content : msg,color : 'danger'});
                return;
            } 

            this.props.cardTable.filterEmptyRows(tableId);
            
            let visibleRows = this.props.cardTable.getVisibleRows(tableId);
            if(!this.validBodyRepeat(visibleRows))
                return;

            let CardData = this.props.createMasterChildData(this.props.pagecode_card, this.formId, this.tableId);
            // CardData.head.head.rows[0].values.bill_code = _this.state.bill_code;
            let url = saveUrl;//新增保存
            if (this.props.getUrlParam('status') === 'edit') {
                //启用状态调整
               // CardData.head.head.rows[0].values.enablestate.value = CardData.head.head.rows[0].values.enablestate.value==true?'2':'3';
                debugger
               url = updateUrl;//修改保存

            }
            //验证公式的校验方法
            this.props.validateToSave( CardData ,()=>{
                ajax({
                    url: url,
                    data: CardData,
                    success: (res) => {
                        let pk_value = null
                        if (res.success) {
                            if (res.data) {
                                if (res.data.head && res.data.head[this.formId]) {
                                    this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                                    pk_value = res.data.head[this.formId].rows[0].values[pk_item].value
                                }
                                if (res.data.body && res.data.body[this.tableId]) {
                                    this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId])
                                }
                            }
                            toast({title : this.state.json['10140PRJB-000031'],color : 'success'});/* 国际化处理： 保存成功*/
                            this.getdata(pk_value);
                            this.props.setUrlParam({
                                appcode:this.props.appcode,
                                pagecode:this.props.pagecode_card,
                                status: 'browse',
                                id: pk_value
                            });
                            cacheTools.set('preid',pk_value);
                            this.toggleShow(this.props)
                        }
                    }
                })
            }, {
                formId: 'form',
                [tableId]: 'cardTable'
            },'card');

        }
    }

    //删除单据
    delConfirm = () => {
        // var pk = this.props.getUrlParam('id');
        var pk =  this.props.form.getFormItemsValue(formId,pk_item).value
        // var ts =  props.form.getFormItemsValue(formId,pk_item).value
        ajax({
            url: deleteUrl,
            data: {deleteinfo:[{
                    id: pk,
                    ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
                }]},
            success: (res) => {
                if(res){
                    // this.props.pushTo(this.props.listUrl,{

                    //     appcode:this.props.appcode,
                    //     pagecode:this.props.pagecode_list,
                    //     status: 'browse'
                    // });
                    //删除后显示下一条数据
                    let nextId = getNextId(pk, cachKey);//根据当前id,获取下个id
                    //调用删除缓存数据方法
                    deleteCacheById("pk_item",pk,cachKey);
                    this.props.setUrlParam({
                        appcode:this.props.appcode,
                        pagecode:this.props.pagecode_card,
                        status: 'browse',
                        id: nextId 
                    });
                     //根据nextId查询下条数据
                     this.getdata(nextId);
                     this.toggleShow(this.props);
                }

            }
        });
    };

    modelSave = (props)=>{
        props.cardTable.closeModel(this.tableId);
        this.saveClick();
    }

    getButtonNames = (codeId) => {
        if (codeId === 'edit'||codeId === 'add'||codeId === 'save'){
            return 'main-button'
        }else {
            return 'secondary - button'
        }
    };

    onOrgChange=(props, moduleId, key,value, changedrows, i, s, g)=>{
        // let pk_org = this.props.form.getFormItemsValue('org_select','pk_org');
        // this.props.form.setFormItemsValue(this.formId,{'pk_org':pk_org});
        if(key == 'pk_org'){

            let billcode = this.props.form.getFormItemsValue(this.formId,titleCode).value;
            let ts = this.props.form.getFormItemsValue(this.formId,'ts').value;
            let pk = this.props.form.getFormItemsValue(this.formId,pk_item).value;
            let data={
                'nodeType':this.props.nodeType,
                [titleCode]:billcode==null?null:billcode,
                [key]:value.value,
                ts,
                [pk_item]:pk
            }

            if(changedrows.value == null && changedrows.display == null){
                
                this.setDefaultValue(data)
            }else{

                promptBox({
                    color:"warning",
                    title: this.state.json['10140PRJB-000012'],/* 国际化处理： 注意*/
                    content: this.state.json['10140PRJB-000032'],/* 国际化处理： 是否修改组织，这样会清空您录入的信息？*/
                    beSureBtnClick: this.setDefaultValue.bind(this,data)
                });
            }
        }
    }

    //获取列表肩部信息
    getTableHead = () => {
        let {button} = this.props;
        let { createButtonApp } = button;
        let buttons  = this.props.button.getButtons();
        let status = this.props.getUrlParam("status");
        return (
            <div className="shoulder-definition-area">

                <div className="definition-icons">
                    {createButtonApp({
                        area: 'definition-icons',//按钮注册中的按钮区域
                        //buttonLimit: 5,
                        onButtonClick: this.buttonClick.bind(this)
                        //popContainer: document.querySelector('.header-button-area')
                    })}
                    {this.props.cardTable.createBrowseIcons(this.tableId, {
                        iconArr: ['close', 'open', 'max','setCol'],
                        maxDestAreaId: 'nc-bill-card'
                    })}
                    {/* {createButton("deleteline", {
						name: '删行',
						onButtonClick: buttonClick.bind(this)
					})} */}
                </div>
            </div>
        )
    }
    render() {
        let { cardTable, form, button, modal, cardPagination, BillHeadInfo} = this.props;
        const {createCardPagination} = cardPagination;
        const {createBillHeadInfo} = BillHeadInfo;
        let buttons = this.props.button.getButtons();
        // buttons = buttons.sort((a,b)=>{
        // 	return b.btnorder - a.btnorder;
        // });
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createButtonApp } = button;
        let { createModal } = modal;
        let status = this.props.getUrlParam('status');
        let nodeName = this.state.json['10140PRJB-000044'];/* 国际化处理： 项目-全局*/
        if(this.props.appcode === '10140PRJG'){
            nodeName = this.state.json['10140PRJB-000034'];
        }
        if(this.props.appcode === '10140PRJO'){
            nodeName = this.state.json['10140PRJB-000045'];
        }
        return (
            <div className='nc-bill-card'>
                <div className="nc-bill-top-area">
                    <NCAffix>
                        <NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                            {/* <div>
                                {status=='browse'?<NCBackBtn onClick={ this.onReturnClick.bind(this) }></NCBackBtn>:''}
                            </div> */}
                            <div className='header-title-search-area'>
                                    {createBillHeadInfo({
                                            title: nodeName ,
                                            backBtnClick: this.onReturnClick.bind(this)
                                        }
                                    )}
                                {/*<h2 className='title-search-detail'>{nodeName}{status=='browse'?`：${this.state.title_code}`:''}</h2>*/}
                            </div>
                            <span className="bill-info-code" style={{fontSize: '16px',marginLeft: '8px',lineHeight: '32px',verticalAlign: 'baseline'}}>
									{status=='browse' && ": "+this.state.title_code}
								</span>
                            {/*分页 */}
                            {/* {status=='browse'?<div className='header-button-cardPagination'>
									{createCardPagination({	handlePageInfoChange: pageInfoClick.bind(this)})}
									</div>:''} */}
                            <div className="header-button-area">
                                {createButtonApp({
                                    area: 'header-button-area',//按钮注册中的按钮区域
                                    //buttonLimit: 5,
                                    onButtonClick: this.buttonClick.bind(this)
                                    //popContainer: document.querySelector('.header-button-area')
                                })}
                                {createCardPagination({
                                    handlePageInfoChange: this.pageInfoClick.bind(this),
                                    dataSource: cachKey
                                })}
                            </div>
                        </NCDiv>
                    </NCAffix>
                    <div className="nc-bill-form-area">
                        {this.props.nodeType === 'org'?createForm('org_select', {
                            onAfterEvent: this.onOrgChange.bind(this)
                        }):(<span/>)}
                        {createForm(this.formId, {
                            onAfterEvent:this.afterEvent.bind(this)
                           
                            
                        })}
                    </div>
                </div>
                <div className="nc-bill-bottom-area"> 
                    <div className="nc-bill-table-area">
                        {createCardTable(this.tableId, {
                            adaptionHeight:true,
                            tableHead:this.getTableHead.bind(this),
                            modelSave:this.modelSave.bind(this),
                            onAfterEvent:this.afterEvent.bind(this),
                            showIndex:true
                        })}
                    </div>
                </div>
                    {createModal('delete', {
                        title: this.state.json['10140PRJB-000012'],/* 国际化处理： 注意*/
                        content: this.state.json['10140PRJB-000013'],/* 国际化处理： 确认删除？*/
                        beSureBtnClick: this.delConfirm.bind(this)
                    })}
                    <AssignModal ref={(item => this.assignModal = item)} {...{getData:this.getdata,json:this.state.json}} {...this.props}/>
                    <PrintOutput
                        ref='printOutput'
                        url={printUrl}
                        data={{
                            funcode:this.props.printFunCode,//功能节点编码
                            nodekey:this.props.printNodeKey,//模板节点编码
                            oids : this.state.ids,
                            outputType : 'output'
                        }}
                    />
                
            </div>

        );
    }


        
    modifierMeta=(props, meta)=> {
        let status = props.getUrlParam('status');
        meta[formId].status = status;
        if(meta[tableId]){
            meta[tableId].status = status;
        }
        let AppCode =props.getAppCode();
        meta['org_select'].items = meta['org_select'].items.map((item, key) => {
            if(item.attrcode == 'pk_org'){
                item.queryCondition = {
                    "AppCode": AppCode,
                    TreeRefActionExt:'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                };
            }
            return item;
        })

        meta['head'].items = meta['head'].items.map((item, key) => {
            if(item.attrcode == 'pk_duty_dept_v'){

                //item.isShowUnit=true;
                if(props.form.getFormItemsValue(this.formId,'pk_org')){
                    let pk_org = props.form.getFormItemsValue(this.formId,'pk_org').value;
               
                    item.queryCondition = () => {
                     return {
                         pk_org: pk_org,
                       
                     }
                     
                 };
                }
                   

                
              
            }
            //项目上的专项补丁自定义档案的参照自定义项57
           /**  if(item.attrcode== 'hdef57'){
                 debugger
                //item.isShowUnit=true;
                   let pk_org = props.form.getFormItemsValue(this.formId,'pk_org').value;
               
                   item.queryCondition = () => {
                    return {
                        pk_org: pk_org,
                      
                    }          
                };
            } */
            return item;
        })
       
        meta[tableId].items = meta[tableId].items.map((item, key) => {
            if(item.attrcode == 'pk_parti_org_v'){
                item.isMultiSelectedEnabled = true;
            }
            return item;
        })

        meta[formId].items = meta[formId].items.map((item, key) => {
            if(item.attrcode == 'pk_eps'){//eps参照只能选择叶子节点
                item.onlyLeafCanSelect = true;
                item.refName_db=this.state.json['10140PRJB-000049']  /* 国际化处理： 项目基本分类*/
            }
            return item;
        })
        let that = this;
        let porCol = {
            attrcode: 'opr',
            label: this.state.json['10140PRJB-000009'],/* 国际化处理： 操作*/
            visible: true,
            className:'table-opr',
            width:'200px',
            itemtype: 'customer',
            fixed:'right',
            render(text, record, index) {

                let btnArray = tableBtnAry(props);

                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "table-opr-area",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => that.tableButtonClick(props, id, text, record, index)
                    }
                )

                // let status = props.cardTable.getStatus(tableId);
                // return status === 'browse' ? (
                // 	<span
                // 		onClick={() => {
                //             props.cardTable.toggleRowView(tableId, record)

                //         }}
                //         > 展开
                //  	</span>
                // ):(<div className="currency-opr-col">
                // 		<span
                // 			className="currency-opr-del"
                // 			onClick={(e) => {
                // 				props.cardTable.openModel(tableId, 'edit', record, index);
                // 				e.stopPropagation();
                // 			}}
                // 		>更多</span>
                // 		&nbsp;&nbsp;
                // 		<span
                // 			className="currency-opr-del"
                // 			onClick={(e) => {
                // 				props.cardTable.delRowsByIndex(tableId, index);
                // 				e.stopPropagation();
                // 			}}
                // 		>删除</span>
                // 	</div>
                // );
            }
        };
        meta[tableId].items.push(porCol);

        return meta;
    }

    tableButtonClick=(props, id, text, record, index)=>{

        switch(id){
            case 'insertline'://插入行
                props.cardTable.addRow(tableId,index,false);
                break;
            case "delline"://删除行
                props.cardTable.delRowsByIndex(tableId, index);
                break;
            case "detail"://更多
                props.cardTable.toggleRowView(tableId, record);
                break;
            case "spread"://展开
                props.cardTable.openModel(tableId, 'edit', record, index);
                break;
            default:
                console.log(id,index);
                break;
        }
    }

    //切换页面状态
    toggleShow=(props)=>{
        let status = props.getUrlParam('status');
        let pk = this.props.getUrlParam('id');
        //返回图标控制
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: status === 'browse'
        });
        // 返回按钮不用了，也可在按钮注册处删除。
        props.button.setButtonVisible(['back'],false);
        if(status === 'browse'){
            let disabled = !pk||pk===undefined||pk==='';
            props.button.setButtonDisabled(['edit','delete','refresh','detail','assig','assig1','unassig','printGrp','print','output','enable','enable1','disable'],disabled);
            props.button.setButtonVisible(['add'],true);
            props.button.setButtonVisible(['edit','delete','refresh','detail','assig','assig1','unassig','printGrp','print','output','enable','enable1','disable'],!disabled);
            props.button.setButtonVisible(['save','cancel','addline','insertline','delline','spread'],false);
            props.form.setFormStatus(formId, 'browse');
            props.form.setFormStatus('org_select', status);
            props.cardTable.setStatus(tableId, 'browse');
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !disabled);
            //隐藏子表操作列
            if(props.meta.getMeta()[tableId]){
                props.cardTable.hideColByKey(tableId,'opr');
            }
        }
        let isAdd = status === 'add' ? true : false;
        let enablestate = props.form.getFormItemsValue(formId,'enablestate');
        //按钮的显示状态
        if(status == 'edit' || status == 'add'){
            //隐藏子表操作列
            if(props.meta.getMeta()[tableId]){
                props.cardTable.showColByKey(tableId,'opr');
            }

            props.button.setButtonVisible(['edit','add','delete','refresh','detail','assig','assig1','unassig','printGrp','print','output','enable','enable1','disable'],false);
            props.button.setButtonVisible(['save','cancel','addline','insertline','delline','spread'],true);
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);

            if(enablestate && enablestate.value){
                props.form.setFormItemsValue(formId,{'enablestate':{display:'已启用',value:'2'}});
            }else{
                props.form.setFormItemsValue(formId,{'enablestate':{display:'已停用',value:'3'}});
            }
            //props.form.getFormItemsValue(formId,'enablestate').value = (enablestate.value=='2' || enablestate.value == true)?true:false;

            props.form.setFormItemsDisabled(formId,{'enablestate':true});
        }else{
            //隐藏子表操作列
            if(props.meta.getMeta()[tableId]){
                props.cardTable.hideColByKey(tableId,'opr');
            }
            
            props.button.setButtonVisible(['save','cancel','addline','insertline','delline','spread','assig1','enable1','print'],false);
            props.button.setButtonVisible(['add','edit','delete','refresh','detail','assig','unassig','printGrp','output','enable','disable'],true);
            //全局时没有分配
            props.nodeType == 'global' && props.button.setButtonVisible('assig',false);

            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
    
            //卡片停启用有开关，按钮直接隐藏不用
            props.button.setButtonVisible(['enable','disable'],false);
            // if(enablestate && (enablestate.value == '2' || enablestate.value == true)){
            //     props.button.setButtonDisabled(['enable1','enable'],true);
            //     props.button.setButtonDisabled('disable',false);
                
            // }else{
            //     props.button.setButtonDisabled(['enable1','enable'],false);
            //     props.button.setButtonDisabled('disable',true);
            // } 
            if(enablestate && enablestate.value == 2 ){
                this.setEnablestate(true)
            }
            if(enablestate && enablestate.value == 3 ){
                this.setEnablestate(false)
            }
            
            
            props.form.setFormItemsDisabled(formId,{'enablestate':false});
        }
        //只有新增是可编辑,写法累赘，回头优化
        props.form.setFormItemsDisabled('org_select',{'pk_org':!isAdd})
        
        props.form.setFormStatus('org_select', status);

        let headOrg = props.form.getFormItemsValue(formId,'pk_org');
        if(props.form.nodeType == 'org' && (headOrg || headOrg.value == null)){
            props.form.setFormStatus(formId, 'browse');
            props.cardTable.setStatus(tableId, 'browse');
        }else{
            props.form.setFormStatus(formId, status);
            props.cardTable.setStatus(tableId, status);
        }
    }
}




// ReactDOM.render(<Card />, document.querySelector('#app'));
export default Card;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65