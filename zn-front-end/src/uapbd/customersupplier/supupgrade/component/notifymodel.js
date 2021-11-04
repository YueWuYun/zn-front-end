//+sFdMPZktBQXjII1ghiHP0aFUDV2W8JEIj41obzF5S1SzMYIDBkGkOyyYaqtF/R/
import React, { Component } from 'react';
import { base,high,ajax} from 'nc-lightapp-front';

const {NCForm,NCFormControl,NCRadio,NCCheckbox,NCButton,NCSelect,NCSwitch,NCTextArea,NCNumber,NCRow,NCCol} = base;
const {NCOption} = NCSelect;
const {NCFormItem} = NCForm;
const { NCUploader ,Refer} = high;
class NotifyModel extends Component{
    constructor(props){
        super(props);
        this.config = Object.assign({
            formId:'form',
            pagecode:'1317SUUG_supupgrade',
            items:[
                {label:'接收人',itemType:'refer',refType: 'grid',disabled:false,
                    refName: '客户联系人',disabled:false,
                    refCode: 'uapbd.ref.CustomerLinkManGridRef',
                    placeholder: '客户联系人',
                    queryGridUrl: '/nccloud/uapbd/ref/CustomerLinkManGridRef.do',name:'receivepsn',initialValue:{},onChange:{}},
                {label:'在线用户',itemType:'checkbox_switch',name:'online',initialValue:{},onChange:{}},
                {label:'主题',itemType:'input',name:'theme',cols:'2',size:'45%',initialValue:{},onChange:{}},
                {label:'颜色',itemType:'button',name:'color',cols:'1',initialValue:{},onChange:{},onClick:{}},
                {label:'优先级',itemType:'select',name:'level',width:'40%',cols:'1',options:[
                        {value:'0',display:'高'},
                        {value:'1',display:'普通'},
                        {value:'2',display:'低'}
                    ],
                    initialValue:{value:'1',label:'普通'},
                        onChange:{}
                    },
                    {label:'已读消息回执',itemType:'checkbox_switch',name:'isread',initialValue:{},onChange:{}},
                    {label:'添加附件',itemType:'file',name:'file',cols:'4',initialValue:{},onClick:{}},
                    {label:'',itemType:'textarea',name:'message',rows:8,cols:'120',onChange:{}}
                ]
            },this.props.config);
            this.state = {
                showUploader: false,//是否显示文件上传框
                target: null,
                formData:{}
            }

            this.createItem = this.createItem.bind(this);
            this.combinedItemValue = this.combinedItemValue.bind(this);
            this.setFormItemValue = this.setFormItemValue.bind(this);
            this.sendMessage = this.sendMessage.bind(this);
        }

        /**
         * 创建表单项
         */
        createItem(){
            var me = this;
            let formDOM = me.config.items.map((item, i)=>{
                let formitem;
                let initValue = item.initialValue ? item.initialValue.value : '' ||
                                me.state.formData[item.name] ? me.state.formData[item.name].value : '' || '';
                switch (item.itemType) {
                    case 'input':
                        formitem = <NCFormControl
                                        disabled={!!item.disabled}
                                        placeholder={item.placeholder}
                                        size={item.size}
                                        name={item.name}
                                        value={initValue}
                                        onChange = {this.onChange.bind(this,{name:item.name,type:item.itemType})}/>
                        break;
                    case 'number':
                        let scale = item.scale;
                        if (item.queryOperateType === 'between') {
                            formitem = (
                                <NCNumber
                                    start={{
                                        scale: scale ? scale : item.scale,
                                        placeholder: '起始'
                                    }}
                                    end={{
                                        scale: scale ? scale : item.scale,
                                        placeholder: '结束'
                                    }}
                                    value={initValue}
                                    onChange = {this.onChange.bind(this,{name:item.name,type:item.itemType})}
                                />
                            );
                        } else {
                            formitem = (
                                <NCNumber
                                    disabled={!!item.disabled}
                                    name={item.name}
                                    value={initValue}
                                    suffix={item.suffix}
                                    scale={scale ? scale : item.scale}
                                    placeholder={item.placeholder}
                                    onChange = {this.onChange.bind(this,{name:item.name,type:item.itemType})}
                                />
                            );
                        }
                        break;
                    case 'textarea':
                        formitem = (
                                <NCTextArea
                                    disabled={!!item.disabled}
                                    name={item.name}
                                    value={initValue}
                                    rows={item.rows || 1}
                                    cols={item.cols || 20}
                                    placeholder={item.placeholder}
                                    onChange = {this.onChange.bind(this,{name:item.name,type:item.itemType})}
                                />
                        );
                        break;
                    case 'radio':
                        formitem = (
                            <NCRadioGroup name={item.name}>
                                {item.options &&
                                item.options.map((e, i) => {
                                    return (
                                        <NCRadio
                                            color="info"
                                            disabled={!!e.disabled || !!item.disabled}
                                            value={e.value}
                                            key={i}
                                            onChange = {this.onChange.bind(this,{name:item.name,type:item.itemType})}
                                        >
                                            {e.display}
                                        </NCRadio>
                                    );
                                })}
                            </NCRadioGroup>
                        );
                        break;
                    case 'checkbox_switch':
                        formitem = (
                            <NCCheckbox
                                className="single-checkbox"
                                name={item.name}
                                disabled={!!item.disabled}
                                colors="dark"
                                value={initValue}
                                key={i}
                                onChange = {this.onChange.bind(this,{name:item.name,type:item.itemType})}
                            >{item.label}</NCCheckbox>
                        );
                        break;
                    case 'checkbox':
                        formitem =
                            item.options &&
                            item.options.map((e, i) => (
                                <NCCheckbox disabled={!!item.disabled} colors="dark"
                                            checked={e.checked} key={i} name={item.name}
                                            value={initValue}
                                            onChange = {this.onChange.bind(this,{name:item.name,type:item.itemType})}>
                                    {e.label}
                                </NCCheckbox>
                            ));
                        break;
                    case 'select':
                        formitem = (
                            <NCSelect
                                labelInValue={true}
                                name={item.name}
                                style={{width:item.width}}
                                value={item.initialValue}
                                disabled={!!item.disabled}
                                placeholder={item.placeholder}
                                onChange = {this.onChange.bind(this,{name:item.name,type:item.itemType})}
                                dropdownClassName={NODE_ENV === 'test' && item.attrcode + '-' + 'select'}
                            >
                                {item.options &&
                                item.options.map((e, i) => (
                                    <NCOption value={String(e.value)} key={i}>
                                        {e.display}
                                    </NCOption>
                                ))}
                            </NCSelect>
                        );
                        break;
                    case 'switch_browse':
                        formitem = <NCSwitch disabled={!!item.disabled}
                                             value={initValue}
                                             onChange = {this.onChange.bind(this,{name:item.name,type:item.itemType})}/>;
                        break;
                    case 'switch':
                        formitem = <NCSwitch disabled={!!item.disabled}
                                             value={initValue}
                                             onChange = {this.onChange.bind(this,{name:item.name,type:item.itemType})}/>;
                        break;
                    case 'refer':
                        switch(item.refType){
                            case 'tree':
                                formitem = <Refer
                                    refName={item.label}
                                    refCode={item.attrcode}
                                    isShowUnit={item.isShowUnit || true}
                                    placeholder= {item.placeholder}
                                    refType={item.refType}
                                    onChange = {this.onChange.bind(this,{name:item.name,type:item.itemType})}
                                    queryTreeUrl={item.queryTreeUrl}
                                    disabled={!!item.disabled}
                                    queryCondition={item.queryCondition}
                                />
                                break;
                            case 'grid':
                                formitem= <Refer
                                    refName={item.label}
                                    refCode={item.attrcode}
                                    isShowUnit={item.isShowUnit || true}
                                    placeholder= {item.placeholder}
                                    refType={item.refType}
                                    onChange = {this.onChange.bind(this,{name:item.name,type:item.itemType})}
                                    queryGridUrl={item.refcode}
                                    disabled={!!item.disabled}
                                    queryCondition={item.queryCondition}
                                />
                                break;
                            case 'gridTree':
                                formitem= <Refer
                                    refName={item.label}
                                    refCode={item.attrcode}
                                    isShowUnit={item.isShowUnit || true}
                                    placeholder= {item.placeholder}
                                    refType={item.refType}
                                    onChange = {this.onChange.bind(this,{name:item.name,type:item.itemType})}
                                    queryGridUrl={item.refGridCode}
                                    queryTreeUrl={item.refTreeCode}
                                    disabled={!!item.disabled}
                                    queryCondition={item.queryCondition}
                                />
                                break;
                        }
                        break;
                    case 'file':
                        formitem =
                            <div className="nc-faith-demo-div1">
                                <NCButton className="nc-faith-demo-button" onClick={(eve) => {
                                me.setState({
                                    showUploader: !me.state.showUploader,
                                    target: eve.target
                                })}}>{item.label}</NCButton>
                                {me.state.showUploader &&
                                        <div className="nc-faith-demo-div2">
                                            <NCUploader
                                                billId={me.config.pagecode}
                                                showUploadList={item.isShow || me.state.showUploader}
                                                target = {me.state.target}
                                                placement={'top'}
                                                multiple={item.multiple || false}
                                                size={5*1024*1024}
                                                beforeUpload={me.beforeUpload.bind(this)} />
                                        </div>
                                }
                                 </div>

                    break;
                    case 'button':
                        formitem =  <NCButton className="nc-faith-demo-button" onClick={(eve) => {

                                    }}>{item.label}</NCButton>;
                        break;
                }
                return formitem ? "file,textarea".includes(item.itemType) ? (
                    <NCRow>
                        <NCCol xs={12} md={12} sm={12}>
                    <NCFormItem
                        key={i}
                        inline={true}
                        labelXs={2}
                        xs={6}
                        md={6}
                        sm={6}
                        leftspace={item.leftspace || 0}
                        rightspace={item.rightspace || 0}
                        showMast={item.required}
                        labelName={'file,checkbox_switch,button'.includes(item.itemType.toLowerCase()) ? '' : item.label}
                        name={item.name}
                        horizontalGap={20}
                        disabled={item.disabled}
                        pagestatus={status}
                        isrequired={item.required || false}
                        errormessage={item.errorMessage || ''}
                        itemtype={item.itemType}
                        cols={item.cols} // textarea
                    >
                        {formitem}
                    </NCFormItem>
                        </NCCol>
                    </NCRow>
                ): (<NCFormItem
                    key={i}
                    inline={true}
                    labelXs={2}
                    xs={4}
                    md={4}
                    sm={4}
                    leftspace={item.leftspace || 0}
                    rightspace={item.rightspace || 0}
                    showMast={item.required}
                    labelName={'file,checkbox_switch,button'.includes(item.itemType.toLowerCase()) ? '' : item.label}
                    name={item.name}
                    horizontalGap={20}
                    disabled={item.disabled}
                    pagestatus={status}
                    isrequired={item.required || false}
                    errormessage={item.errorMessage || ''}
                    itemtype={item.itemType}
                    cols={item.cols} // textarea
                >
                    {formitem}
                </NCFormItem>) : ( <span/>);
            });
            return formDOM;
        }

        /**
         * 组装表单数据
         * @param name
         * @param value
         */
        combinedItemValue(name,value){
            if(!name){
                throw new Error(`未找到${name}对应的表单项`);
            }
            this.state.formData[name] = {value:value.value};
            if(value.display)
                this.state.formData[name].display = value.display;
            this.setState(this.state);
        }
        componentWillMount(){
            var me = this;
            if(!me.config.queryMessageUrl){
                throw new Error('请确认传入的参数，必须包括queryMessageUrl');
            }
            if(!me.config.pk){
                throw new Error('请确认传入的参数，必须包括pk(业务主键)');
            }
            let requestParam = {
                pk:me.config.pk
            }
            ajax({
                url: me.config.queryMessageUrl,
            async:false,
            data:requestParam,
            success: function (res) {
                let { success, data } = res;
                if(success){
                    me.setFormItemValue({message:{value:data}});
                }
            }
        })
    }
    /**
     * 获取表单数据
     * @returns {{}|NotifyModel.state.formData}
     */
    getFormData(){
        return this.state.formData;
    }

    /**
     * 发送消息
     */
    sendMessage(){
        var me = this;
        let data = me.getFormData();
        console.log(data)
    }
    onChange(name,value){
        var me =this;
        let realValue;
        switch(name.type.toLowerCase()){
            case "input":
            case "date":
            case "checkbox":
            case "checkbox_switch":
                realValue = {'value':value};
                break;
            case 'refer':
                realValue = {'value':value.refpk,'display':value.refname};
                break;
            case 'file':
                break;
            case 'select':
                realValue = {'value':value.key,'display':value.label};
                break;
        }
        me.combinedItemValue(name.name,realValue);
    }

    /**
     * 设置表单项值
     * @param obj 可以为数组 也可以为对象  格式为{value:--,display:''} 或 [{value:--,display:''}]
     */
    setFormItemValue(obj){
       /* let dom = document.getElementsByName(name);
        dom[0].value = value;*/
       if(Object.prototype.toString.call(obj) == '[object Object]'){
           for(let key in obj){
               this.state.formData[key] = {value:obj[key].value};
               if(obj[key].display)
                   this.state.formData[key].display = obj[key].display;
           }
       }
       if(Object.prototype.toString.call(obj) == '[object Array]'){
           for(let item of obj){
               for(let key in item){
                   this.state.formData[key] = {value:item[key].value};
                   if(item[key].display)
                       this.state.formData[key].display = item[key].display;
               }
           }
       }
        this.setState(this.state);
    }
    /**
     * 文件上传前校验
     * @param billId
     * @param fullPath
     * @param file
     * @param fileList
     * @returns {boolean}
     */
    beforeUpload(billId, fullPath, file, fileList) {
        // 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
        console.log(billId, fullPath, file, fileList);

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            alert('上传大小小于5M')
        }
        return isLt2M;
        // 备注： return false 不执行上传  return true 执行上传
    }
    render(){
        let allItems = this.createItem();
        return(
            <div id={this.config.formid} className={`ncc-hr-form-style group-form-item`}>
                <NCForm
                    showSubmit={false}
                    useRow={true}
                    id={'test'}
                    checkFormNow={false}
                    horizontal={10}
                    className="lightapp-component-form"
                >
                    {allItems}
                </NCForm>
            </div>
        )
    }
}
export default  NotifyModel ;
//+sFdMPZktBQXjII1ghiHP0aFUDV2W8JEIj41obzF5S1SzMYIDBkGkOyyYaqtF/R/