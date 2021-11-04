//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, print, getMultiLang} from 'nc-lightapp-front';

const { NCAffix,NCPopconfirm,NCFormControl,NCAnchor,NCScrollElement,NCScrollLink,NCDiv} = base;
const {PrintOutput,NCUploader} = high;

const queryCardUrl = '/nccloud/uapbd/creditctlreapply/credApplyCardQuery.do';   //卡片查询url

const formId = 'creditpf';   //表头id
const tableId = 'financeorgs';   //子表id
const pageId = '10100CRESP_card'; //pagecode
const searchId = 'search';       //查询区id


class Card extends Component{
    constructor(props){
        super(props);
        this.formId = formId;
        this.searchId = searchId;
        this.tableId = tableId;
        this.state = {
            pk_org:'',
            title_code:'',
            showBaseInfo:true,
            showApprove:false,
            json:{}

        }
    }

    initTemplate =(props,callback)=>{
        props.createUIDom(
            {
                pagecode:pageId  //页面id
            },
            (data)=>{
                if(data){
                    if(data.template){
                        // props.meta.setMeta(data.template)
                        let meta = data.template;
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        // props.meta.setMeta(data.button)
                        let button = data.button;
                        props.button.setButtons(button);
                        props.button.setButtonVisible(['Refresh','Attment'],true);
                        props.button.setButtonDisabled(['Refresh','Attment'],false);
                    }
                }
                if (callback && callback == 'function') {
                    callback()
                }
            }
        )
    }

    componentDidMount(){
        let callback = (json, status, inlt)=>{
            if(status){
                this.setState({json,inlt},()=>{
                    this.initTemplate(this.props,()=>{
                      let pk = this.props.getUrlParam('id');
                      this.getdata(pk);
                    })
                })
            }
        }
        this.props.MultiInit.getMultiLang({moduleId: '10100CRESP', domainName: 'uapbd', callback })
    }

    buttonClick =(props,id)=>{
        let _this = this;
        switch(id){
            case 'Refresh':
                this.refresh(props);
                break;
            case 'Attment':
                this.Attment();
                break;
            default:
                break
        }
    }

    refresh=(props)=>{
        this.getdata(props.getUrlParam('id'),()=>{
            toast({title:this.state.json['10100CRESP-000021'],color:'success'});/**国际化处理：刷新成功 */
        })
    }

    //附件管理
    Attment=()=>{
        this.state.showlogoUploader=true;
        this.setState(this.state)
    }
    //关闭附件窗口
    onHidUploader=()=>{
        this.state.showlogoUploader=false;
        this.setState(this.state)
    }
    //通过单据id查询单据信息
    getdata = (pk,callback)=>{
        let data = {pk};
        ajax({
            url:queryCardUrl,
            data,
            success:(res)=>{
                if(res.data.head){
                    let formData = {
                        [this.formId]:res.data.head[this.formId],
                        "creditbaseinfo":res.data['creditbaseinfo']['creditbaseinfo']
                    }
                    this.props.form.setAllFormValue(formData)
                }
                if(res.data.bodys){
                    res.data.bodys.forEach((item,index)=>{
                        tableId.forEach((tableId)=>{
                            if(item.hasOwnProperty(tableId)){
                                this.props.cardTable.setTableData(tableId,res.data.bodys[index][tableId])
                            }
                        })
                    })
                }
                if(callback && typeof callback == 'function'){
                    callback()
                }
            }
        })
    }

    render(){
        let { cardTable, form,button,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let status = this.props.getUrlParam('status');
        let { createButtonApp } = button;

        return(
            <div id='nc-bill-card'>
                <div className='nc-bill-card'>
                    <NCAffix>
                        <NCDiv fieldid={this.state.json['10100CRESP-000000']} areaCode={NCDiv.config.Title} className='nc-bill-header-area'>
                            <div className='header-title-search-area'>
                                {createBillHeadInfo({
                                    title:this.state.json['10100CRESP-000000'],
                                    initShowBackBtn:false
                                })}
                            </div>
                        </NCDiv>
                    </NCAffix>
                    {/* 子表导航树 */}
                    <NCAnchor>
                        <NCScrollLink
                           to={this.formId}
                           spy={true}
                           smooth={true}
                           duration={300}
                           offset={-100}
                        >
                         <p>{this.state.json['10100CRESP-000001']}</p>
                        </NCScrollLink>
                        <NCScrollLink
                            to={'financeorgs'}
                            spy={true}
                            smooth={true}
                            duration={300}
                            offset={-100}
                        >
                          <p>{this.state.json['10100CRESP-000002']/*财务组织 */}</p>
                        </NCScrollLink>
                    </NCAnchor>
                    <NCScrollElement name={this.formId}>
                        <div className="nc-bill-form-area">
                            {createForm(this.formId, {})}
                        </div>
                    </NCScrollElement>

                    <NCScrollElement name={this.state.json['10100CRESP-000001']}>
                        <div className="nc-bill-form-area">
                            <div className='group-form-wrapper'>
                                <NCDiv fieldid='creditbaseinfo' areaCode={NCDiv.config.Group} className="group-form-name">
                                    <span 
                                          className={`toggle-form-icon iconfont ${iconItem}`}
                                          onClick={() => {
                                              let show = !this.state.showBaseInfo
                                              this.setState({
                                                  showBaseInfo: show
                                              });
                                          }}
                                    />
                                    <span className="name">{this.state.json['10100CRESP-000001']}</span>
                                </NCDiv>
                                <div className={`group-form-item ${groupItem} `}>
                                    {createForm('creditbaseinfo', {})}
                                </div>
                            </div>
                        </div>
                    </NCScrollElement>
                    <NCScrollElement name={'custapplybanks'}>
                        <div className="nc-bill-table-area">
                            {createCardTable("financeorgs", {

                            })}
                        </div>
                    </NCScrollElement>
                </div>
                {/* 附件管理 */}
                {this.state.showlogoUploader&&<NCUploader
                  billId={'uapbd/6d6d4a15-d9bb-4b0c-9da3-80760872bf87/'+this.props.getUrlParam('id')}
                  placement={'bottom_right'}
                  Multiple={false}
                  onHide={this.onHidUploader.bind(this)}
                />}
            </div>
        )
    }
}

Card = createPage({

})(Card);
ReactDOM.render(<Card />,document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65