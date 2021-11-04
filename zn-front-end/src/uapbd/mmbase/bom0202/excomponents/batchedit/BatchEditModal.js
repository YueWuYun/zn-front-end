//5WDelIanR8BEnstFViPZJ422bqc28xJVomYiAEj+nJJTeejKVDEz0j4QfGmDxjFl
   import React, {Component} from 'react'
import {base, ajax, toast} from 'nc-lightapp-front'
import '../../../../../uapbd/public/uapbdstyle/uapbd_style_common'
let {NCModal, NCButton, NCSelect} = base

const batchEditUpdate = '/nccloud/mmbd/bom0202/batchEditUpdate.do'

class BatchEditModal extends Component {
    // editType: '1',          //批改类型，默认“产品”(1)
    // bkititem:null,          //是否齐套（父项）
    // hnassparentnum:null,       //父项数量（父项）
    // fitemsource:null,       //备料来源    
    // fitemtype:null,         //子项类型
    // ibasenum: null,         //底数
    // bkitmaterial:null,      //是否齐料
    // bdeliver:null,          //是否发料
    // fsupplymode:null,       //供应方式
    // fcontrol:null,          //控制标志
    // bbunibatch:null,        //是否不允许混批
    // bbchkitemforwr:null,    //是否完工齐套检查
    // bcanreplace:null,       //是否可替代
    // freplacetype:null,      //替代类型
    // vmatingno:null,         //配套组号
    // fbackflushtype:null,    //倒冲方式
    // fbackflushtime:null,    //倒冲时机
    // bcustommaterial:null,   //是否客户专用料
    // bprojectmaterial:null,  //是否项目专用料
    constructor(props){
        super(props)
        this.state = {
            modal: {
                show: false,
                modalDropup: true,
                size: 'xlg'
            },
            component:{
                editType: '1',
                ...{}
            },
            selectedrecords: []
        }
        this.onfinish = null
    }

    show = (rows, callback) => {
        this.state.modal.show = true
        this.state.component = {editType:'1', ...{}}
        this.state.selectedrecords = rows
        this.setState(this.state)
        this.onfinish = callback
    }

    onsubmit = () => {
                
        console.log(this.state.selectedrecords)
        let pkparams = this.state.selectedrecords.map((row)=>{
            return row.data.values.cbomid.value
        })
        let editparams = this.state.component
        let data = {
            editparams,
            pkparams: pkparams 
        }
        console.log(data)
        if(data != null && data.data != null){
            ajax({
                url:batchEditUpdate,
                data,
                success: (res)=>{
                    this.state.modal.show = false
                    this.setState(this.state)
                    if(this.onfinish != null){
                        this.onfinish()
                    }
                }
            })
        }
    }

    cancel = () => {
        this.state.modal.show = false
        this.state.component = {editType:'1', ...{}}
        this.state.selectedrecords = []
        this.setState(this.state)
    }

    //改变批改类型
    //1：产品（父项）/2：材料（子项）
    onBatchEditTypeChange = (value) => {
        this.state.component.editType = value
        this.setState(this.state)
        // console.log(this.state)
    }

    //是否齐套选项
    //1：是；2：否
    onBkititemChange = (value) => {
        //this.state.bkititem = value == '1' ? true : false
        this.state.component.bkititem = value
        this.setState(this.state)
    }

    
    //父项数量输入框-onKeyUp(粘贴、退格、删除不起作用)
    onHnassparentnumChange = (evt) => {
        console.log('onHnassparentnumChange')
        //console.log(this.state.component.hnassparentnum)
        //console.log(evt.target.value)
        let oldvalue = this.state.component.hnassparentnum ? this.state.component.hnassparentnum : ''
        let newvalue = evt.target.value        

        if(this.checkHnassparentnumInput(newvalue) == false){
            this.state.component.hnassparentnum = oldvalue
        }else{
            this.state.component.hnassparentnum = newvalue
        }

        this.setState(this.state)
        console.log(this.state.component.hnassparentnum) 
    }

    //父项数量只接受八位浮点数输入
    checkHnassparentnumInput = (newvalue) => {
        let bright = true
        let hasdot = false
        for(let i = 0; i < newvalue.length; i++){
            if(newvalue.charAt(i) === '.'){
                if(hasdot == false){
                    hasdot = true
                }else{
                    bright = false
                    break
                }
            }
            if(i == 0){
                if(/[^0-9.-]/g.test(newvalue.charAt(i)) == true){
                    bright = false
                    break
                }
            }else{
                if(/[^0-9.]/g.test(newvalue.charAt(i)) == true){
                    bright = false
                    break
                }

            }
        }

        if(bright == true && hasdot == true){
            if(newvalue.substring(newvalue.indexOf('.')+1).length > 8){
                bright = false
            }
        }

        return bright
   }

    //备料来源选项
    //1：备料；2：领料；3：传输
    onFitemsourceChange = (value) => {
        this.state.component.fitemsource = value
        this.setState(this.state)
    }

    //子项类型选项
    //1：普通；2：工具；3：技术资料；4：客户手册
    onFitemtypeChange = (value) => {
        this.state.component.fitemtype = value
        this.setState(this.state)
    }

    //底数输入框
    onIbasenumChange = (evt) => {
        console.log('onIbasenumChange')
        let oldvalue = this.state.component.ibasenum ? this.state.component.ibasenum : ''
        let newvalue = evt.target.value        

        if(this.checkIbasenumInput(newvalue) == false){
            this.state.component.ibasenum = oldvalue
        }else{
            this.state.component.ibasenum = newvalue
        }

        this.setState(this.state)
        console.log(this.state.component.ibasenum) 
    }
    
    //只接受正整数输入
    checkIbasenumInput = (newvalue) => {
        let bright = true
        for(let i = 0; i < newvalue.length; i++){
            if(i == 0){
                if(/[^1-9]/g.test(newvalue.charAt(i)) == true){
                    bright = false
                    break
                }
            }else{
                if(/[^0-9]/g.test(newvalue.charAt(i)) == true){
                    bright = false
                    break
                }

            }
        }

        return bright
   }


    //是否齐料选项
    //1：是；2：否
    onBkitmaterialChange = (value) => {
        this.state.component.bkitmaterial = value
        this.setState(this.state)
    }

    //是否发料选项
    //1：是；2：否
    onBdeliverChange = (value) => {
        this.state.component.bdeliver = value
        this.setState(this.state)
    }

    //供应方式选项
    //1：一般发料；2：定量发料
    onFsupplymodeChange = (value) => {
        this.state.component.fsupplymode = value
        this.setState(this.state)
    }

    //控制标志选项
    //1：控制；2：不控制
    onFcontrolChange = (value) => {
        this.state.component.fcontrol = value
        this.setState(this.state)
    }

    //是否不允许混批选项
    //1：是；2：否
    onBbunibatchChange = (value) => {
        this.state.component.bbunibatch = value
        this.setState(this.state)
    }

    //是否完工齐套检查选项
    //1：是；2：否
    onBbchkitemforwrChange = (value) => {
        this.state.component.bbchkitemforwr = value
        this.setState(this.state)
    }

    //是否可替代选项
    //1：是；2：否
    onBcanreplaceChange = (value) => {
        this.state.component.bcanreplace = value
        this.setState(this.state)
    }

    //替代类型选项
    //1：全部替代；2：部分替代；3：清空替代类型
    onFreplacetypeChange = (value) => {
        this.state.component.freplacetype = value
        this.setState(this.state)
    }

    //配套组号输入框
    onVmatingnoChange = (value) => {
        console.log(value.target.value)
        this.state.component.vmatingno = value.target.value
        this.setState(this.state)
    }

    //倒冲方式选项
    //1：不倒冲；2：自动倒冲；3：交互式倒冲
    onFbackflushtypeChange = (value) => {
        this.state.component.fbackflushtype = value
        this.setState(this.state)
    }

    //倒冲时机选项
    //1：产品完工；2：工序完工；3：清空倒冲时机
    onFbackflushtimeChange = (value) => {
        this.state.component.fbackflushtime = value
        this.setState(this.state)
    }

    //是否客户专用料选项
    //1：是；2：否
    onBcustommaterialChange = (value) => {
        this.state.component.bcustommaterial = value
        this.setState(this.state)
    }

    //是否项目专用料选项
    //1：是；2：否
    onBprojectmaterialChange = (value) => {
        this.state.component.bprojectmaterial = value
        this.setState(this.state)
    }


    render = () => {
        var modalCfg = {...this.state.modal}
        return(
            <NCModal {...modalCfg} style={{width:'30%'}}>
                <NCModal.Header closeButton={false}>{'批量修改'}</NCModal.Header>
                <NCModal.Body>
                    <div style={{width:'35%'}}>
                        <NCSelect defaultValue='1' onChange={this.onBatchEditTypeChange.bind(this)} style={{width:'60%',paddingLeft:'15px'}} value={this.state.component.editType}>
                            <NCSelect.NCOption value='1'>{'产品'}</NCSelect.NCOption>
                            <NCSelect.NCOption value='2'>{'材料'}</NCSelect.NCOption>
                        </NCSelect>
                    </div>
                    {this.state.component.editType === '1' ? 
                    <div className='transfer_tree_container' style={{height:'100px'}}>
                        <div className='left-area' style={{padding:'15px',width:'calc(50% - 30px)'}}>
                            <NCSelect placeholder='齐套' onChange={this.onBkititemChange.bind(this)} value={this.state.component.bkititem}>
                                <NCSelect.NCOption value='1'>{'是'}</NCSelect.NCOption>
                                <NCSelect.NCOption value='2'>{'否'}</NCSelect.NCOption>
                            </NCSelect>                            
                        </div>
                        <div  className='right-area' style={{padding:'15px',width:'calc(50% - 30px)'}}>
                            <input type='text' id='hnassparentnum' value={this.state.component.hnassparentnum} onChange={this.onHnassparentnumChange.bind(this)}  placeholder='父项数量' style={{height:'30px',width:'100%',border:'1px solid #d5d6d9',textAlign:'right',paddingRight:'2px'}} />
                        </div>
                    </div>
                        :
                    <div  className='transfer_tree_container' style={{height:'350px'}}>
                        <div className='left-area' style={{padding:'15px',width:'calc(50% - 30px)'}}>
                            <div style={{marginBottom:'5px'}}>
                                <NCSelect placeholder='备料来源' onChange={this.onFitemsourceChange.bind(this)} value={this.state.component.fitemsource}>
                                    <NCSelect.NCOption value='1'>{'备料'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='2'>{'领料'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='3'>{'传输'}</NCSelect.NCOption>
                                </NCSelect>                            
                            </div>
                            <div style={{marginBottom:'5px'}}>
                                <input type='text' value={this.state.component.ibasenum} onChange={this.onIbasenumChange.bind(this)} placeholder='底数'  style={{height:'30px',width:'100%',border:'1px solid #d5d6d9',textAlign:'right',paddingRight:'2px'}} />
                            </div>
                            <div style={{marginBottom:'5px'}}>
                                <NCSelect placeholder='发料' onChange={this.onBdeliverChange.bind(this)} value={this.state.component.bdeliver}> 
                                    <NCSelect.NCOption value='1'>{'是'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='2'>{'否'}</NCSelect.NCOption>
                                </NCSelect>                            
                            </div>
                            <div style={{marginBottom:'5px'}}>
                                <NCSelect placeholder='控制标志' onChange={this.onFcontrolChange.bind(this)} value={this.state.component.fcontrol}>
                                    <NCSelect.NCOption value='1'>{'控制'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='2'>{'不控制'}</NCSelect.NCOption>
                                </NCSelect>                            
                            </div>
                            <div style={{marginBottom:'5px'}}>
                                <NCSelect placeholder='完工齐套检查' onChange={this.onBbchkitemforwrChange.bind(this)} value={this.state.component.bbchkitemforwr}>
                                    <NCSelect.NCOption value='1'>{'是'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='2'>{'否'}</NCSelect.NCOption>
                                </NCSelect>                            
                            </div>
                            <div style={{marginBottom:'5px'}}>
                                <NCSelect placeholder='替代类型' onChange={this.onFreplacetypeChange.bind(this)} value={this.state.component.freplacetype}>
                                    <NCSelect.NCOption value='1'>{'全部替代'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='2'>{'部分替代'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='3'>{'清空替代类型'}</NCSelect.NCOption>
                                </NCSelect>                            
                            </div>
                            <div style={{marginBottom:'5px'}}>
                                <NCSelect placeholder='倒冲方式' onChange={this.onFbackflushtypeChange.bind(this)} value={this.state.component.fbackflushtype}>
                                    <NCSelect.NCOption value='1'>{'不倒冲'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='2'>{'自动倒冲'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='3'>{'交互式倒冲'}</NCSelect.NCOption>
                                </NCSelect>                            
                            </div>
                            <div style={{marginBottom:'5px'}}>
                                <NCSelect placeholder='客户专用料' onChange={this.onBcustommaterialChange.bind(this)} value={this.state.component.bcustommaterial}>
                                    <NCSelect.NCOption value='1'>{'是'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='2'>{'否'}</NCSelect.NCOption>
                                </NCSelect>                            
                            </div>
                        </div>
                        <div  className='right-area' style={{padding:'15px',width:'calc(50% - 30px)'}}>
                            <div style={{marginBottom:'5px'}}>
                                <NCSelect placeholder='子项类型' onChange={this.onFitemtypeChange.bind(this)} value={this.state.component.fitemtype}>
                                    <NCSelect.NCOption value='1'>{'普通'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='2'>{'工具'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='3'>{'技术资料'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='4'>{'客户手册'}</NCSelect.NCOption>
                                </NCSelect>
                            </div>
                            <div style={{marginBottom:'5px'}}>
                                <NCSelect placeholder='齐料' onChange={this.onBkitmaterialChange.bind(this)} value={this.state.component.bkitmaterial}>
                                    <NCSelect.NCOption value='1'>{'是'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='2'>{'否'}</NCSelect.NCOption>
                                </NCSelect>
                            </div>
                            <div style={{marginBottom:'5px'}}>
                                <NCSelect placeholder='供应方式' onChange={this.onFsupplymodeChange.bind(this)} value={this.state.component.fsupplymode}>
                                    <NCSelect.NCOption value='1'>{'一般发料'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='2'>{'定量发料'}</NCSelect.NCOption>
                                </NCSelect>
                            </div>
                            <div style={{marginBottom:'5px'}}>
                                <NCSelect placeholder='不允许混批' onChange={this.onBbunibatchChange.bind(this)} value={this.state.component.bbunibatch}>
                                    <NCSelect.NCOption value='1'>{'是'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='2'>{'否'}</NCSelect.NCOption>
                                </NCSelect>
                            </div>
                            <div style={{marginBottom:'5px'}}>
                                <NCSelect placeholder='可替代' onChange={this.onBcanreplaceChange.bind(this)} value={this.state.component.bcanreplace}>
                                    <NCSelect.NCOption value='1'>{'是'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='2'>{'否'}</NCSelect.NCOption>
                                </NCSelect>
                            </div>
                            <div style={{marginBottom:'5px'}}>
                                <input type='text' value={this.state.component.vmatingno} onChange={this.onVmatingnoChange.bind(this)} placeholder='配套组号'  style={{height:'30px',width:'100%',border:'1px solid #d5d6d9',textAlign:'right',paddingRight:'2px'}} />
                            </div>
                            <div style={{marginBottom:'5px'}}>
                                <NCSelect placeholder='倒冲时机' onChange={this.onFbackflushtimeChange.bind(this)} value={this.state.component.fbackflushtime}>
                                    <NCSelect.NCOption value='1'>{'产品完工'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='2'>{'工序完工'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='3'>{'清空倒冲时机'}</NCSelect.NCOption>
                                </NCSelect>
                            </div>
                            <div style={{marginBottom:'5px'}}>
                                <NCSelect placeholder='项目专用料' onChange={this.onBprojectmaterialChange.bind(this)} value={this.state.component.bprojectmaterial}>
                                    <NCSelect.NCOption value='1'>{'是'}</NCSelect.NCOption>
                                    <NCSelect.NCOption value='2'>{'否'}</NCSelect.NCOption>
                                </NCSelect>
                            </div>
                        </div>
                    </div>
                    } 
                </NCModal.Body>
                <NCModal.Footer>
                    <span>
                        <NCButton onClick={this.onsubmit.bind(this)}>{'确定'}</NCButton>
                    </span>
                    <span>
                        <NCButton onClick={this.cancel.bind(this)}>{'取消'}</NCButton>
                    </span>
                </NCModal.Footer>
            </NCModal>
        )
    }
}

export default BatchEditModal
//5WDelIanR8BEnstFViPZJ422bqc28xJVomYiAEj+nJJTeejKVDEz0j4QfGmDxjFl