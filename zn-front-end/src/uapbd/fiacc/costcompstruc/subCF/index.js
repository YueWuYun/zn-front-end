//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react'
import { createPage, base, ajax, high, toast,promptBox,getMultiLang} from 'nc-lightapp-front'
import {multiLangCode,module,pkname} from '../list/constants';

const { NCModal, NCButton, NCMessage } = base
const { Transfer } = high

class SubCf extends Component {
    constructor(props) {
        
        super(props)
        this.state = {
            selectedTreeNode: null, // 左侧树选中行
            rows: [],
            selectedRow: null,
            pk_accountingbook: '',
            selectedTreeNodes: [],
            pks: '',
            targetKeys:[],
            target:[],//切换时，将所有数据保存，需要确定时使用
            json:{}
        }
        this.status="";
    }
    // componentDidMount() {
    //     this.qryData();
    //   }
    componentWillMount() {
        let callback= (json) =>{
			this.setState({json:json},()=>{
			})
		}
        getMultiLang({moduleId: [multiLangCode], currentLocale: 'simpchn',domainName:module,callback})
        this.setState(this.state.selectedTreeNodes, () => {

         });
    }
        componentWillReceiveProps(nextProps) {
            this.qryData();
        }

    // 查询数据
    qryData = () => {
        // 查左边的数据
        ajax({
            url: '/nccloud/uapbd/costcompstruc/queryallorgs.do',
            success: (res) => {
                if (res.data) {
                    this.setState({ selectedTreeNodes: res.data });
                }
            }
        })
    }
    // 保存
    save = (value) => {
        let target=this.state.target;
        let checkedData = this.props.checkedData;
        let orgsArr = [];//更新的数据集合
        for(let j = 0;j<checkedData.length;j++){
            orgsArr[j] = checkedData[j].data.values.pk_costcompstruc.value;
        }
        let targetOrgs = [];
        for(let i = 0;i<target.length;i++){
            targetOrgs[i] = target[i].key;
        }
        if (orgsArr.length == 0) {
            toast({ content: `${this.state.json['10140CCSC-000035']}`, color: 'warning' });/* 国际化处理： 请先选中要进行分配的成本组建结构！*/
            return;
        }
        if (targetOrgs.length == 0) {
            toast({ content: `${this.state.json['10140CCSC-000040']}`, color: 'warning' });/* 国际化处理： 请先选择要分配该成本组件结构的组织！*/
            return;
        }
        promptBox({
		color: 'warning',
		title: this.state.json['10140CCSC-000033'],
		content: this.state.json['10140CCSC-000036'],/* 国际化处理： 确定要进行分配么?*/
		beSureBtnClick: function () {
			ajax({
				url: '/nccloud/uapbd/costcompstruc/distributeOrgs.do',
				data: {
                    pk_bills:orgsArr,
                    pk_orgs:targetOrgs
                },
				success: (res) => {
					let { success, data } = res;
					if (success) {
                        if(data){
                            if(res.data.singlemessage) {
                                toast({ color: 'danger', content: res.data.singlemessage });//删除失败信息
                                return;
                            }
                            if(res.data.message)
                            {
                               toast({ color: 'success', content:res.data.message});/* 国际化处理： 分配成功*/
                            } 
                        }
					}
                }
			});
		}
    });
    this.cancelFormButtonClick.call(this);
    }

    contain(value) {
        if (pks.indexOf(value)) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * 取消按钮点击
     */
    cancelFormButtonClick() {
        this.props.parent.setState({ [this.props.showFormModalState]: false });
        this.props.parent.setState({ transfershowModal:false});
        this.setState({ transfershowModal: false, HszbRef: {}, NbjydzgzRef: {}, KmRef: {}, NdValue: ''});
    };

    onTargetKeysChange = (targetKeys) => {
        
        let flag=true;
        let selectedTreeNodes=this.state.selectedTreeNodes;
        let target=[];
        if(selectedTreeNodes.length>0){
            selectedTreeNodes.map((item, index) => { 
                targetKeys.map((key, i) => { 
                    if(key==item.key){
                        target.push({key:item.key,title:item.title});
                    }
                })
            })
        }
        if(targetKeys.length>0){
            if(targetKeys[0].key){
                flag=false;
            }
        }
        if(flag==false){
            targetKeys=[];
        }
        this.setState({
            targetKeys:targetKeys,
            target:target
        });
    };

    render() {
        let { selectedTreeNodesAll, selectedTreeNodes } = this.state;

        const {
            showFormModal,
            // pk_accountingbook, 
            cancel,
            syncTree: { createSyncTree }
        } = this.props

        const {
            onSelectEve,
            selectOne,
            selectAll,
            deleteOne,
            deleteAll,
            onCheckEve
        } = this

        let getShowFlag = () => {
            if (showFormModal) {
                return true;
            } else {
                return false;
            }
        }
        const transferProps = {
            dataSource: this.state.selectedTreeNodes,   //所有数据
            targetKeys: this.state.targetKeys,    //目标数据
            onTargetKeysChange: this.onTargetKeysChange,  
           // checkable: true,
            className: 'my-transfer-demo',
            showMoveBtn: false,
            listRender: ({ key, title }) =>title
        };


        return (
            <NCModal show={getShowFlag()} id='SubTransfer' className='SubTransfer-table' fieldid='subcf'>

            <NCModal.Header>
                    <NCModal.Title fieldid ={this.state.json['10140CCSC-000032']}>{this.state.json['10140CCSC-000032']}</NCModal.Title>{/* 国际化处理：快速分配*/}
                 </NCModal.Header>
                 <NCModal.Body>
                    <Transfer  {...transferProps} />
                 </NCModal.Body>
                 <NCModal.Footer>
                     <NCButton colors="primary" onClick={this.save.bind(this)} fieldid='confirm'>{this.state.json['10140CCSC-000033']}</NCButton>{/* 国际化处理： 确定*/}
                     <NCButton onClick={this.cancelFormButtonClick.bind(this)} fieldid ='cancel'>{this.state.json['10140CCSC-000034']}</NCButton>{/* 国际化处理： 取消*/}
                 </NCModal.Footer>
            </NCModal>
        )
    }
}
SubCf = createPage({})(SubCf);
export default SubCf;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65