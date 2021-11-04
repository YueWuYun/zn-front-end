//43kIysj+pr1J0X1JaV1VyFw1pS61MQFlQc6nFs3/csq/kcz/HSde77dLivJAYPp1
import React, { Component } from 'react';
import { base,high,ajax,toast} from 'nc-lightapp-front';

const {NCForm,NCFormControl,NCRadio,NCIcon,NCCheckbox,NCButton,NCSelect,NCSwitch,NCTextArea,NCNumber,NCRow,NCCol,NCUpload} = base;
const {NCFormItem} = NCForm;
const {NCOption} = NCSelect;
const {Refer} = high;
const {NCMessage:Message} = base;

class FileUploadForm extends Component{
    constructor(props){
        super(props);
        this.config = Object.assign({
            items:[],
            urls:{
                // 上传附件接口
                uploadAttachment: '/nccloud/uapbd/sgmenu/upload.do',
                // 上传url接口
                uploadUrl: '/nccloud/platform/attachment/uploadurl.do'
            }
        },this.props.config);

        this.state = {
            formData:{},
            showUploader:true,
            fileList:[]
        }
        this.createItems = this.createItems.bind(this);
        this.combinedItemValue = this.combinedItemValue.bind(this);
        this.setFormItemValue = this.setFormItemValue.bind(this);
        this.formatConfigItems = this.formatConfigItems.bind(this);
        this.getFormData = this.getFormData.bind(this);
    }

    /**
     * 默认将items后加入file item
     */
    formatConfigItems(){
        let me = this;
        if(Array.isArray(me.config.items)){
            let isContainFile = me.config.items.filter((item)=>{
                return item.itemType == 'file';
            });
            if(!isContainFile || isContainFile.length == 0)
                me.config.items.push({
                    itemType:'file',
                    label:'上传',
                    size:me.config.fileSize || 5*1024*1024,
                    multiple:me.config.multiple || false
                });
        }else if(me.isObj(me.config.items)){
            let temp = Array.of({...me.config.items});
            me.config.items = temp;
            me.formatConfigItems();
        }
    }

    /**
     * 判断是否为对象
     * @param param
     * @returns {boolean}
     */
    isObj(param) {
        return Object.prototype.toString.call(param).slice(8, -1) === 'Object';
    }

    /**
     * 判断文件名是否重复
     * @param file
     * @returns {boolean}
     */
    isExit(file){
        let me = this;
        if(me.state.fileList.length == 0)
            return false;
        let exit = false;
        me.state.fileList.forEach((item)=>{
            if(item.name == file.name)
                exit = true;
        });
        return exit;
    }
    /**
     * 文件上传前校验
     * @param file
     * @param fileList
     * @returns {boolean}
     */
    beforeUpload(file, fileList) {
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            Message.create({content: '上传大小大于5M！', color: 'warning'});
            return false;
        }
        if(this.isExit.call(this,file)){
            Message.create({content: '已存在同名文件！', color: 'danger'});
            return false;
        }
        this.getFileUrl(file);
        return isLt5M;
        // 备注： return false 不执行上传  return true 执行上传
    }

    /**
     * 获取url
     * @param file
     */
    getFileUrl(file){
        if(window.createObjectURL)
            file.url = window.createObjectURL(file);
        else if(window.URL)
            file.url = window.URL.createObjectURL(file);
        else if(window.webkitURL)
            file.url = window.webkitURL.createObjectURL(file);
    }
    /**
     * 上传文件
     * @param info
     */
    handleChange(info) {
        let fileList = info.fileList;
        if(fileList.length == 0)
            return;
        //  自定义上传数量，只显示最近上传的文件
        fileList = fileList.slice(-2);
        // 读取返回数据，并显示成文件链接形式
        fileList = fileList.map((file,index) => {
            let {
                status, // 状态 'uploading' 'done' 'error'
                name,   // 名称
                response,
                percent,
                size,
            } = file;
            if (status == 'done' && response) {
                //组件会显示文件链接为超链接形式
                //file.url = response.data.url;
                file.fullPath = response.data.paths[index];
            }
            return file;
        });
        if(this.config.multiple)
            this.setState({fileList:fileList});
        else
            this.setState({fileList:[fileList[fileList.length-1]]});
    }

    /**
     * 删除文件
     * @param file
     */
    onRemove(file){
        let me = this;
        let newList = me.state.fileList.map((item,index)=>{
            if(item.name == file.name)
                return undefined;
            return item;
        });
        newList.filter((item)=>{
            if(item)
                return item;
        });
        if(newList.length == 1 && !newList[0])
            newList = new Array();
        me.setState({fileList:newList});
    }
    /**
     * 创建表单项
     */
    createItems(){
        var me = this;
        me.formatConfigItems();
        let formDOM = me.config.items.map((item, i)=>{
            let formitem;
            let initValue = item.initialValue ? item.initialValue.value : '' ||
            me.state.formData[item.name] ? me.state.formData[item.name].value : '' || '';
            if(item.initialValue && !me.state.formData[item.name])
                me.onChange.call(this,{name:item.name,type:item.itemType,value:item.initialValue});
            switch (item.itemType || 'input') {
                case 'input':
                    formitem = <NCFormControl
                        disabled={!!item.disabled}
                        placeholder={item.placeholder}
                        size={item.size}
                        name={item.name}
                        value={initValue}
                        onChange = {me.onChange.bind(this,{name:item.name,type:item.itemType})}/>
                    break;
                case 'number':
                    let scale = item.scale;
                    if (item.operateType === 'between') {
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
                            dropdownClassName={item.attrcode + '-' + 'select'}
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
                            <NCUpload
                                //billId={me.config.pagecode}
                                name={'fileform'}
                                action={me.config.urls.uploadAttachment}
                                fileList={me.state.fileList}
                                defaultFileList={me.state.fileList}
                                data={{'billId':'tempUploadFile'}}
                                className={'upload-list-inline'}
                                listType={'text'}
                                showUploadList={item.isShow || me.state.showUploader}
                                multiple={item.multiple || false}
                                accept={me.config.accept || 'xls,xls'}
                                size={item.size || 5*1024*1024}
                                onChange={me.handleChange.bind(this)}
                                onRemove={me.onRemove.bind(this)}
                                beforeUpload={me.beforeUpload.bind(this)} >
                                <NCButton colors="primary" shape="border">
                                    <NCIcon type="uf-upload" /> {item.label}
                                </NCButton>
                            </NCUpload>
                    break;
                default:
                    break;
            }
            return formitem ? (
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
                            labelName={'checkbox_switch,button'.includes(item.itemType.toLowerCase()) ? '' : `${item.label}:`}
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
            ) : ( <span/>);
        });
        return formDOM;
    }

    /**
     * 记录值
     * @param name
     * @param value
     */
    onChange(name,value){
        var me =this;
        let realValue;
        if(!value)
            value = name.value;
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
                realValue = {'value':value.key ? value.key : value.value,'display':value.label};
                break;
        }
        me.combinedItemValue(name.name,realValue);
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
    /**
     * 设置表单项值
     * @param obj 可以为数组 也可以为对象  格式为{value:--,display:''} 或 [{value:--,display:''}]
     */
    setFormItemValue(obj){
        /* let dom = document.getElementsByName(name);
         dom[0].value = value;*/
        if(this.isObj(obj)){
            for(let key in obj){
                this.state.formData[key] = {value:obj[key].value};
                if(obj[key].display)
                    this.state.formData[key].display = obj[key].display;
            }
        }
        if(Array.isArray(obj)){
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
     * 获取表单数据
     * @returns {{paths: any[]}}
     */
    getFormData(){
        let me = this;
        let allFullPath = new Array();
        me.state.fileList.forEach((item)=>{
            allFullPath.push(item.fullPath);
        });
        let newData = {
            ...me.state.formData,
            'paths':allFullPath
        }
        return newData;
    }
    render(){
        let allItems = this.createItems();
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
export default  FileUploadForm ;
//43kIysj+pr1J0X1JaV1VyFw1pS61MQFlQc6nFs3/csq/kcz/HSde77dLivJAYPp1