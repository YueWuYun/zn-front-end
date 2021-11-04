//wwQjM14LUN7PxzeemSRTVylkH9rxg3fnBHsMmPgwSKpmY4bM9sirolMVeGAbpprh
import React,{Component} from 'react';
import { createPage, base, ajax ,NCCreateSearch,toast,createButtonApp,cardTable} from 'nc-lightapp-front';
import '../main/index .less';

let pageCode='10140SGMENU_batchAdd',appid='0001Z01000000000HXU1';
class SgmenuBatchAdd extends Component{
    constructor(props){
        super(props);
        this.config = Object.assign({
            pageCode:`10140SGMENU_batchAdd`,
            appid:`0001Z01000000000HXU1`,
            formId:`batchForm`,
            tableId1:`marbasclass`,
            tableId2:`supplier_table`
        },props.config);

        this.state = {
            json:this.config.json || {}
        }
        pageCode = this.config.pageCode;
        appid = this.config.appid;
        this.modifierMeta = this.modifierMeta.bind(this);
        this.tableButtonClick = this.tableButtonClick.bind(this);
        this.buttonStatus = this.buttonStatus.bind(this);
        this.initTemplate.call(this,this.props);
    }
    componentWillReceiveProps(newProps){
        this.state.json = newProps.json || {};
        this.setState(this.state);
    }
    /**
     * 加载模板
     * @param props
     * @param callback
     */
    initTemplate = (props,callback)=>{
        let me = this;
        props.createUIDom(
            {
                pagecode: pageCode//页面id
                //appid: appid//注册按钮的id
            },
            function (data){
                if(data){
                    if(data.template){
                        let meta = data.template;
                        me.modifierMeta(props,meta,me.config.tableId1);
                        me.modifierMeta(props,meta,me.config.tableId2);
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                        //props.button.setPopContent({'DelLine':me.state.json['10140SGMENU-000021']});/* 国际化处理： 确认要删除该信息吗？*/
                        me.buttonStatus(props,'browse');
                    }
                    callback && callback();
                }
            }
        )
    }

    /**
     * 修改模板
     * @param props
     * @param meta
     * @param tableId
     * @returns {*}
     */
    modifierMeta(props, meta,tableId) {
        let me = this;
        meta[me.config.formId].status = 'edit';
        meta[tableId].status = 'edit';
        if(tableId == 'marbasclass'){
            meta[tableId].items.find((item)=>item.attrcode=='pk_marbasclass').isShowUnit=false;
            meta[tableId].items.find((item)=>item.attrcode=='pk_marbasclass').isMultiSelectedEnabled = true;
        }
        else{
            meta[tableId].items.find((item)=>item.attrcode=='pk_supplier').isShowUnit=false;
            meta[tableId].items.find((item)=>item.attrcode=='pk_supplier').isMultiSelectedEnabled=true;
        }
        let porCol = {
            attrcode: 'opr',
            label:me.state.json['10140SGMENU-000022'],/* 国际化处理： 操作*/
            visible: true,
            className:'table-opr',
            width:'200px',
            itemtype: 'customer',
            //fixed:'right',
            render(text, record, index) {
                let btnArray = [ 'DelLine'];
                return props.button.createOprationButton(
                    btnArray,
                    {
                        area: "opr",
                        buttonLimit: 3,
                        onButtonClick: (props, id) => me.tableButtonClick(props, id, text, record, index,tableId)
                    }
                )
            }
        };
        meta[tableId].items.push(porCol);
        return meta;
    }

    /**
     * 按钮状态
     * @param props
     * @param status
     */
    buttonStatus(props,status){
        //按钮的显示状态
        if(status == 'edit' || status == 'add' || status=='cancel'){
            props.button.setButtonVisible(['AddLine','AddLine1'],true);
        }else{
            props.button.setButtonVisible(['AddLine','AddLine1'],false);
        }
    }

    /**
     * 操作列按钮点击
     * @param props
     * @param id
     * @param text
     * @param record
     * @param index
     * @param tableId
     * @returns {boolean}
     */
    tableButtonClick(props, id, text, record, index,tableId){
        let status = props.cardTable.getStatus(this.config.tableId1);
        if(status != 'add' && status != 'edit')
            return false;
        switch(id){
            case "DelLine"://删除行
                props.cardTable.delRowsByIndex(tableId, index);
                break;
            default:
                console.log(id,index);
                break;
        }
    }
    componentDidMount(){
        var me = this;
        me.props.form.setFormStatus(me.config.formId,'edit');
        me.props.cardTable.setStatus(me.config.tableId1,'edit');
        me.props.cardTable.setStatus(me.config.tableId2,'edit');
    }
    /**
     * 按钮点击事件
     * @param id
     */
    onButtonClick(tableId,props,id) {
        switch (id.toLowerCase()) {
            case "addline":
            case 'addline1':
                props.cardTable.addRow(tableId);
                break;
            default:
                console.log(id);
                break;
        }
    }
    /**
     *获取列表肩部信息
     */
    getTableHead = (tableId) => {
        let {button} = this.props;
        let { createButtonApp } = button;
        return (
            <div>
                <div className="btn-group" style={{paddingTop:5}}>
                    {tableId == this.config.tableId1 && createButtonApp({
                        area: 'header',
                        buttonLimit: 3,
                        onButtonClick: this.onButtonClick.bind(this,tableId)
                    })}
                    {tableId == this.config.tableId2 && createButtonApp({
                        area: 'header2',
                        buttonLimit: 3,
                        onButtonClick: this.onButtonClick.bind(this,tableId)
                    })}
                </div>
            </div>
        )
    }
    /**
     * item编辑后事件
     */
    onAfterEvent(props,moduleId,key,value,changedRows,index,record){
        var me = this;
        let code = moduleId == 'marbasclass' ? 'pk_marbasclass' : 'pk_supplier';
        if(Array.isArray(value)) {
            if(moduleId == 'marbasclass'){
                let temp = value.filter(item => item.isleaf == false);
                if(temp && temp.length > 0){
                    toast({color:'danger',content:me.state.json['10140SGMENU-000102']});
                    me.props.cardTable.setValByKeyAndIndex(moduleId,index,code,{value:'',display:''});
                    me.props.cardTable.setValByKeyAndIndex(moduleId,index,`name`,{value:'',display:''});
                    return;
                }
            }
            value.forEach((item, ind) => {
                if(ind == 0)
                    return;
                setTimeout(() => {
                    me.props.cardTable.addRow(moduleId, index + ind, {
                        [code]: {value: item.refpk, display: item.refcode},
                        'name': {value: item.refname, display: item.refname}
                    });
                }, 0);
            });
            if(value[0] && value[0].refpk)
                me.props.cardTable.setValByKeysAndIndex(moduleId, index,{
                    [code]: {value: value[0].refpk, display: value[0].refcode},
                    'name': {value: value[0].refname, display: value[0].refname}
                });
            else
                me.props.cardTable.setValByKeyAndIndex(moduleId,index,`name`,{value:'',display:''});
        }else{
            if(value.refpk){
                me.props.cardTable.setValByKeyAndIndex(moduleId,index,`name`,{value:value.refname});
            }else{
                me.props.cardTable.setValByKeyAndIndex(moduleId,index,`name`,{value:'',display:''});
            }
        }
        //me.props.cardTable.setValByKeyAndIndex(moduleId,index,`name`,{value:value.refname});
        me.buttonStatus(me.props,'edit');
    }
    /**
     * 表单编辑后事件
     * @param props
     * @param moduleId
     * @param key
     * @param value
     * @param index
     */
    onAfterFormEvent(props, moduleId, key, value, index,refValue){
        let me = this;
        if(moduleId == me.config.formId){
            if(key == 'pk_org'){
                value.value && me.buttonStatus(props,'edit');
                !value.value && me.buttonStatus(props,'browse');
                let meta = me.props.meta.getMeta();
                meta[me.config.tableId1].items.find((item)=>item.attrcode=='pk_marbasclass').queryCondition={
                    pk_org:value.value
                };
                meta[me.config.tableId2].items.find((item)=>item.attrcode=='pk_supplier').queryCondition={
                    pk_org:value.value
                };
                me.props.meta.setMeta(meta);
            }
        }
    }
    render(){
        const {form,cardTable} = this.props;
        const {createForm} = form;//创建表单，需要引入这个
        const {createCardTable } = cardTable;
        return(
            <div className='card-area-padding0'>
                <div className="card-area nc-theme-gray-area-bgc">{createForm(this.config.formId, {
                    onAfterEvent:this.onAfterFormEvent.bind(this)
                })}</div>
                <div className="card-area nc-theme-gray-area-bgc">
                    {createCardTable(this.config.tableId1, {
                        onAfterEvent:this.onAfterEvent.bind(this),//编辑后事件
                        tableHead:this.getTableHead.bind(this,this.config.tableId1),
                        showMore:false,
                        showIndex:true
                    })}
                    {createCardTable(this.config.tableId2, {
                        onAfterEvent:this.onAfterEvent.bind(this),//编辑后事件
                        showIndex:true,
                        showMore:false,
                        tableHead:this.getTableHead.bind(this,this.config.tableId2)
                    })}
                </div>
            </div>
        )
    }
}
/**
 * 创建页面
 */
export default SgmenuBatchAdd = createPage({
    //initTemplate:initTemplate
    billinfo:{
        billtype: 'extcard',
        pagecode: pageCode,
        headcode: 'batchForm',
        bodycode: ['marbasclass','supplier_table']
    }
})(SgmenuBatchAdd);
//wwQjM14LUN7PxzeemSRTVylkH9rxg3fnBHsMmPgwSKpmY4bM9sirolMVeGAbpprh