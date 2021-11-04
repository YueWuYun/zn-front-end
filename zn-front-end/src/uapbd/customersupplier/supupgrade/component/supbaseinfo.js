//X97gS0i3tcrxQmz4vedOfpE17790Cp6S8yYC1hEqkUh6WO2PtyevDrmb6GBXAG8q
import React,{Component} from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,createButtonApp,cardTable} from 'nc-lightapp-front';
import Linkman from '../../../public/pubComponent/linkman/LinkmanForm';

const urls = {
    queryTemplateUrl: "/nccloud/platform/templet/querypage.do",
    querySupBaseInfoUrl:"/nccloud/uapbd/customersupplier/querysupbaseinfo.do",
    savelinkman:'/nccloud/uapbd/bankacc/savelinkman.do',
    querylinkman:'/nccloud/uapbd/custsubinfo/queryLinkman.do'
}
let pageCode='1317SUUG_supbaseinfo',linkManRecord={},appid='0001Z010000000002950',appcode='1317SUUG',tableId='suplinkman',lineIndex;
const {NCMessage:Message} = base;
class SupBaseInfo extends Component{
    constructor(props){
        super(props);
        this.config =  Object.assign({
            formId:"supplier_baseInfo",
            linkmanFormId:'suplinkmanform2',
            tableId1:"supbankacc",
            tableId2:"suplinkman",
            tableId3:"supcountrytaxes",
            pageCode:"1317SUUG_supbaseinfo",
            appid:'0001Z010000000002950'
        },this.props.config);
        this.state = {
            allValues:''
        }
        pageCode = this.config.pageCode;
        this.state = {
            allValues:"",
            json:{},
            inlt:{}
        }
        this.initLinkManRecord = this.initLinkManRecord.bind(this);
        this.initLinkManRecord();
        this.initData = this.initData.bind(this);
        this.getValues = this.getValues.bind(this);
        this.modifierMeta = this.modifierMeta.bind(this);
        this.tableButtonClick = this.tableButtonClick.bind(this);
        this.buttonStatus = this.buttonStatus.bind(this);
        this.initTemplate = this.initTemplate.bind(this);
        this.dealShowFormula = this.dealShowFormula.bind(this);
    }
    /*
    初始化linkManRecord
     */
    initLinkManRecord(){
        linkManRecord.areaType = 'form';
        linkManRecord.rows = [{values:{}}];
    }
    componentDidUpdate(){
        let formStatus = this.props.form.getFormStatus(this.config.formId);
        if(!formStatus || formStatus === 'browse'){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提 示
                return '';
            };
        }
    }
    getValues(){
        var me = this;
        return me.state.allValues;
    }
    componentWillMount(){
        this.initTemplate(this.props);
    }
    componentWillReceiveProps(newProps){
        this.state.json = newProps.json || {};
        this.state.inlt = newProps.inlt || {};
        this.setState(this.state);
    }
    /**
     * 加载模板
     * @param props
     */
    initTemplate = (props)=>{
        let me = this;
        props.createUIDom(
            {
                pagecode: pageCode,//页面id
                appcode: appcode
            },
            function (data){
                if(data){
                    if(data.template){
                        let meta = data.template;
                        me.modifierMeta(props,meta);
                        props.meta.setMeta(meta);
                        if(props.initData)
                            props.initData(meta.pageid);
                        if(props.from)
                            me.initData(meta.pageid);
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                        props.button.setPopContent({'DelLine':me.state.json['1317SUUG-000018']});
                        me.buttonStatus(props,'browse');
                    }
                }
            }
        )
    }
    /**
     * 点击操作列按钮
     * @param props
     * @param id
     * @param text
     * @param record
     * @param index
     * @returns {boolean}
     */
    tableButtonClick(props, id, text, record, index){
        switch(id){
            case "DelLine"://删除行
                props.cardTable.delRowsByIndex(tableId, index);
                break;
            case "EditLine"://编辑
                /*props.cardTable.openModel(tableId,'edit',record,index);
                linkManRecord.rows[0] = record;
                console.log(linkManRecord)*/
                this.queryLinkman({
                    pk_linkman:record.values.pk_linkman.value,
                    areacode:this.config.linkmanFormId,
                    pagecode:this.config.pageCode,
                    callback:(data)=>{
                        if(data){
                            props.form.setAllFormValue({[this.config.linkmanFormId]:data[this.config.linkmanFormId]});
                        }else
                            props.form.EmptyAllFormValue(this.config.linkmanFormId);
                        props.modal.show('linkman');
                    }
                });
                break;
            case 'Expand':
                this.queryLinkman({
                    pk_linkman:record.values.pk_linkman.value,
                    areacode:this.config.linkmanFormId,
                    pagecode:this.config.pageCode,
                    callback:(data)=>{
                        props.modal.show('linkman',{
                            noFooter:true
                        });
                        props.form.setFormStatus(this.config.linkmanFormId,'browse');
                        if(data){
                            props.form.setAllFormValue({[this.config.linkmanFormId]:data[this.config.linkmanFormId]});
                        }else
                            props.form.EmptyAllFormValue(this.config.linkmanFormId);

                    }
                });
                break;
            default:
                console.log(id,index);
                break;
        }
    }

    /**
     * 查询联系人
     * @param param
     */
    queryLinkman(param){
        let {pk_linkman,areacode,pagecode,callback} = param;
        let requestParam = {
            queryCondition:{
                pk_linkman,areacode,pagecode
            }
        }
        ajax({
            url: urls['querylinkman'],
            data: requestParam,
            success: (res) => {
                let {formulamsg} = res;
                this.dealShowFormula(formulamsg,{
                    [this.config.linkmanFormId]:'form'
                });
                callback && callback(res.data);
            }
        })
    }
    /**
     * 按钮显示和表单状态
     * @param props
     */
    buttonStatus(props,status){
        if(!status)
            status = props.form.getFormStatus('supplier_baseInfo');
        //按钮的显示状态
        if(status == 'edit' || status == 'add'){
            props.button.setDisabled({
                'AddLine': false,
                'BatchDel':false,
                'DelLine':false,
                'EditLine':false
            });
            props.button.setButtonVisible(['AddLine','BatchDel'],true);
        }else{
            props.button.setDisabled({
                'AddLine': true,
                'BatchDel':true,
                'DelLine':true,
                'EditLine':true
            });
            props.button.setButtonVisible(['AddLine','BatchDel'],false);
        }
    }
    /**
     * 给table增加操作列
     * @param props
     * @param meta
     * @returns {*}
     */
    modifierMeta(props, meta) {
        let me = this;
        meta[tableId].status = 'browse';

        let porCol = {
            attrcode: 'opr',
            label: me.state.json['1317SUUG-000019'],//多语 操作
            visible: true,
            className:'table-opr',
            width:'200px',
            itemtype: 'customer',
            //fixed:'right',
            render(text, record, index) {
                let btnArray = me.tableBtnAry.call(this);
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "opr",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => me.tableButtonClick(props, id, text, record, index)
                    }
                )
            }
        };
        meta[tableId].items.push(porCol);
        return meta;
    }
    tableBtnAry =()=>{
        let me = this;
        let status = me.props.form.getFormStatus(me.config.formId);
        return 'add,edit'.includes(status) ?  ['DelLine','EditLine'] : [ 'Expand' ];
    }

    /**
     * 处理显示公式
     * @param formulamsg
     */
    dealShowFormula(formulamsg,param){
        let me = this;
        if (formulamsg && formulamsg instanceof Array && formulamsg.length > 0) {
            me.props.dealFormulamsg(
                formulamsg,
                param || {
                            [me.config.formId]:'form',
                            [me.config.tableId1]:'cardTable',
                            [me.config.tableId2]:'cardTable',
                            [me.config.tableId3]:'cardTable'
                        }
            );
        }
    }
    /**
     * 加载明细数据
     * @param pk_supplier
     */
    initData(templateid){
        let me = this;
        if(!me.props.pk_supplier)
            return;

        let requestParams = {
            pk_supplier:me.props.pk_supplier,
            templateid:templateid
        }
        ajax({
            url: urls['querySupBaseInfoUrl'],
            //async:false,
            data:requestParams,
            success: function (res) {
                let { success, data ,formulamsg} = res;
                me.dealShowFormula(formulamsg);
                if(success){
                    let {billCard,supplierClassVo,head} = data;
                    let finalData = {
                        [me.config.baseFormId]:billCard.head[me.config.baseFormId],
                        [me.config.bankTableId]:billCard.bodys[me.config.bankTableId],
                        [me.config.linkTableId]:billCard.bodys[me.config.linkTableId],
                        [me.config.countryTableId]:billCard.bodys[me.config.countryTableId],
                        classVo:supplierClassVo
                    };
                    me.state.allValues = finalData;
                    me.setState(me.state,()=>{
                        if(me.props.from){
                            me.props.form.setFormStatus(me.config.formId,'edit');
                            me.props.button.setDisabled({
                                AddLine:false,
                                BatchDel:false
                            });
                        }
                        me.props.form.setAllFormValue({[me.config.formId]:billCard.head[me.config.formId]});
                        me.props.cardTable.setTableData(me.config.tableId1,billCard.bodys[me.config.tableId1]);
                        me.props.cardTable.setTableData(me.config.tableId2,billCard.bodys[me.config.tableId2]);
                        me.props.cardTable.setTableData(me.config.tableId3,billCard.bodys[me.config.tableId3]);
                        if(me.props.callback)
                            me.props.callback();
                    });
                    
                }
            }
        })
    }
    /**
     * 侧拉框编辑后事件，用来手动处理linkManRecord，解决无法获取侧拉框form值
     * 表单item编辑后事件 暂时先手动将model中form值拼接，后续待平台提供接口后可修改为平台调用
     */
    onTableModelAfterEdit(props,moduleId,key,value,changedRows,index,record){
        //this.props.modal.show('type');
        linkManRecord.rows[0].values[key] = {display:value,value:value};
        lineIndex = index;
        if(key == 'name'){
            props.cardTable.setValByKeyAndIndex(tableId,index,'name',{value:value,display:value});
            console.log(props.cardTable.getAllData(tableId))
        }
    }
    /**
     * 侧拉框关闭事件
     * @param props
     */
    closeModel = (props)=>{
        props.cardTable.closeModel(tableId);
        props.cardTable.setStatus(tableId,'browse');
        let record = props.cardTable.getModalDataByIndex(tableId,lineIndex);
        if(Object.keys(record).length > 0 && record.hasOwnProperty("name") && record.name.value){
            linkManRecord.rows[0] = {
                status : '1',
                rowid : '0',
                values : record
            };
            this.saveLinkMan(props);
        }
    }
    /**
     * 侧拉框整单保存
     * @param props
     */
    modelSave = (callback)=>{
        /*注释的为侧拉框方式
        props.cardTable.closeModel(tableId);
        let record = props.cardTable.getModalDataByIndex(tableId,lineIndex);
        if(Object.keys(record).length > 0 && record.hasOwnProperty("name") && record.name.value){
            linkManRecord.rows[0] = {
                status : '1',
                rowid : '0',
                values : record
            };
            this.saveLinkMan(props);
        }*/
        linkManRecord = this.props.form.getAllFormValue(this.config.linkmanFormId);
        this.saveLinkMan(this.props,callback);
        //this.saveLinkMan(props);
    }

    /**
     * 保存联系人
     */
    saveLinkMan = (props,callback) =>{
        linkManRecord.areacode = this.config.linkmanFormId;
        let requestParam = {
            model: linkManRecord,
            pageid: this.config.pageCode
        };
        let businessLogic = ()=>{
            ajax({
                url: urls['savelinkman'],
                data: requestParam,
                success: (res) => {
                    let record = {};
                    if (res.success) {
                        if(res.data){
                            let {data} = res;
                            //设置列表linkmans值
                            //props.cardTable.setValByKeyAndIndex(tableId,lineIndex,'pk_linkman',{value:res.data.pk_linkman,display:res.data.name});
                            props.cardTable.setValByKeysAndIndex(tableId,lineIndex,{
                                'pk_linkman':{value:data.pk_linkman,display:data.name},
                                'pk_linkman.sex':{value:data.sex,display:data.sex && data.sex == '1' ? this.state.json['1317SUUG-000020'] : this.state.json['1317SUUG-000021']},//多语  男女
                                'pk_linkman.vjob':{value:data.vjob},
                                'pk_linkman.phone':{value:data.phone},
                                'pk_linkman.cell':{value:data.cell},
                                'isdefault':{value:data.isdefault}
                            });
                            this.initLinkManRecord();
                        }
                        callback && callback();
                        //多语 "保存成功！"
                        //toast({title : this.state.json['1317SUUG-000022'],color : 'success'});
                    }
                }
            })
        }
        props.validateToSave(requestParam,businessLogic,{[this.config.linkmanFormId]:'form'},'form');
    }
    /**
     * 按钮点击事件
     * @param id
     */
    onButtonClick(props,id) {
        switch (id.toLowerCase()) {
            case "addline":
                //props.cardTable.openModel(tableId,'add');
                props.cardTable.addRow(tableId);
                lineIndex = props.cardTable.getNumberOfRows(tableId)-1;
                props.modal.show('linkman');
                break;
            case 'batchdel':
                let checkedRows = props.cardTable.getCheckedRows(tableId);
                if(checkedRows.length == 0){
                    //多语  '请选中需要删除的记录'
                    toast({content: this.state.json['1317SUUG-000023'], color: 'warning'});
                    return;
                }
                let indexs = checkedRows.map((item,index)=>{
                    return item.index;
                });
                props.cardTable.delRowsByIndex(tableId,indexs);
                break;
            default:
                console.log(id);
                break;
        }
    }

    onFormAfterEvent(props, moduleId, key,value, oldValue) {
        if(key == 'supprop') {
            props.form.setFormItemsDisabled(this.config.formId,{pk_financeorg: value.value == 0})
            props.form.setFormItemsRequired(this.config.formId,{pk_financeorg: value.value == 1})
        }
    }

    /**
     *获取联系人列表肩部信息
     */
    getTableHead = () => {
        let {button} = this.props;
        let { createButtonApp } = button;
        return (
            <div className="shoulder-definition-area">
                <div className="btn-group" style={{paddingTop:5}}>
                    {createButtonApp({
                        area: 'header',
                        buttonLimit: 3,
                        onButtonClick: this.onButtonClick.bind(this)
                    })}
                </div>
                <div className="definition-icons">
                    {this.props.cardTable.createBrowseIcons(tableId, {
                        iconArr: ['close', 'open', 'max','setCol'],
                        maxDestAreaId: 'nc-bill-card'
                    })}
                </div>
            </div>
        )
    }

    render(){
        const {form,cardTable,modal} = this.props;
        const {createForm} = form;//创建表单，需要引入这个
        let {createModal} = modal;  //模态框
        const {createCardTable } = cardTable;

        return (
            <div className="nc-bill-extCard">
                {createModal('linkman',{
                    noFooter:false,
                    userControl:true,
                    title:'联系人',
                    content:<Linkman {...{form,formId:this.config.linkmanFormId}}/>,
                    beSureBtnClick:()=>{
                        this.modelSave.call(this,()=>{
                            this.props.modal.close('linkman');
                        });
                    },
                    cancelBtnClick:()=>{
                        this.props.modal.close('linkman');
                    }
                })}
                <div className="nc-bill-top-area">
                    <div className="nc-bill-form-area">
                        {createForm(this.config.formId, {
                            onAfterEvent: this.onFormAfterEvent.bind(this)
                        })}
                    </div>
                </div>
                <div className="nc-bill-bottom-area">
                    <div className="nc-bill-tableTab-area">
                        {createCardTable(this.config.tableId1, {
                            showIndex:true
                        })}
                    </div>
                    <div className="nc-bill-tableTab-area">
                        {createCardTable(this.config.tableId2, {
                            showCheck:true,
                            onAfterEvent:this.onTableModelAfterEdit.bind(this),//编辑后事件
                            //modelSave: this.modelSave.bind(this),//关闭编辑侧拉框事件
                            showIndex:true,
                            //hideModelSave:true,
                            //hideAdd:true,
                            tableHead:this.getTableHead.bind(this)
                           // modelClose:this.closeModel.bind(this)//关闭侧拉框事件
                        })}
                    </div>
                    <div className="nc-bill-tableTab-area">
                        {createCardTable(this.config.tableId3, {
                            showIndex:true
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

/**
 * 创建页面
 */
export default SupBaseInfo = createPage({
    //initTemplate:initTemplate
    billinfo:[{
            billtype: 'card',
            pagecode: pageCode,
            headcode: 'supplier_baseInfo',
            bodycode:['supbankacc','suplinkman','supcountrytaxes']
        },{
            billtype: 'form',
            pagecode: pageCode,
            headcode: 'suplinkmanform2'
        }
    ]
})(SupBaseInfo);
//X97gS0i3tcrxQmz4vedOfpE17790Cp6S8yYC1hEqkUh6WO2PtyevDrmb6GBXAG8q