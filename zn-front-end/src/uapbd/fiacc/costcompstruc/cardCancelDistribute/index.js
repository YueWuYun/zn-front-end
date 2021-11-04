//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react'
import { createPage, base, ajax, high, toast,promptBox,getMultiLang} from 'nc-lightapp-front'
import {multiLangCode,module,pagecode,formId,tableId,tableId1} from '../card/constants';
import { queryCard} from '../card/events/costCompStruc';

const { NCModal, NCButton, NCMessage } = base
const { Transfer } = high

class CardCancelDistribute extends Component {
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
    componentWillMount() {
        let callback= (json) =>{
			this.setState({json:json},()=>{
                ///this.qryData();
			})
		}
        getMultiLang({moduleId: [multiLangCode], currentLocale: 'simpchn',domainName:module,callback})
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
    // 快速取消分配
    cancelDistribute = (value) => {
        let that = this;
        let target=this.state.target;
        let pk_bill = this.props.currentData;
        let targetOrgs = [];
        for(let i = 0;i<target.length;i++){
            targetOrgs[i] = target[i].key;
        }
        if (pk_bill == null || pk_bill == 'undefined'|| pk_bill == "") {
            toast({ content: `${this.state.json['10140CCSC-000035']}`, color: 'warning' });/* 国际化处理： 请先选中要进行分配的成本组建结构！*/
            return;
        }
        if (targetOrgs.length == 0) {
            toast({ content: `${this.state.json['10140CCSC-000035']}`, color: 'warning' });/* 国际化处理： 请先选中要取消分配成本组建结构的组织！*/
            return;
        }
        promptBox({
		color: 'warning',
		title: this.state.json['10140CCSC-000038'],
		content: this.state.json['10140CCSC-000043'],/* 国际化处理： 确定要取消分配么?*/
		beSureBtnClick: function () {
			ajax({
				url: '/nccloud/uapbd/costcompstruc/cardCancelDistributeOrgs.do',
				data: {
                    pk_bill:pk_bill,
                    pk_orgs:targetOrgs,
                    pageId:pagecode
                },
				success: (res) => {
					let { success, data } = res;
					if (success) {
                        if(res.data)
                        {
                            if(res.data.singlemessage) {
                                toast({ color: 'danger', content: res.data.singlemessage });//删除失败信息
                            }
                            if(res.data.message)
                            {
                               toast({ color: 'success', content:res.data.message});/* 国际化处理： 取消分配成功*/
                               that.props.parent.setTableDistri(res.data.recard.bodys[tableId1]);
                              // that.props.cardTable.updateTableData(tableId1, res.data.recard.bodys[tableId1]);
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
        this.props.parent.setState({ [this.props.cancelDistributeShowModel]: false });
        this.props.parent.setState({ cancelDistributeShowModel:false});
        this.setState({ cancelDistributeShowModel: false, HszbRef: {}, NbjydzgzRef: {}, KmRef: {}, NdValue: '' });
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
            cancelShowFormModal,
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
            if (cancelShowFormModal) {
                return true;
            } else {
                return false;
            }
        }
        const transferProps = {
            dataSource: this.state.selectedTreeNodes,
            targetKeys: this.state.targetKeys,
            onTargetKeysChange: this.onTargetKeysChange,
           // checkable: true,
            className: 'my-transfer-demo',
            showMoveBtn: false,
            listRender: ({ key, title }) =>title
        };


        return (
            <NCModal show={getShowFlag()} id='SubTransfer' className='SubTransfer-table' fieldid='subcf'>

            <NCModal.Header>
                    <NCModal.Title fieldid ={this.state.json['10140CCSC-000032']}>{this.state.json['10140CCSC-000038']}</NCModal.Title>{/* 国际化处理：取消分配*/}
                 </NCModal.Header>
                 <NCModal.Body>
                    <Transfer  {...transferProps} />
                 </NCModal.Body>
                 <NCModal.Footer>
                     <NCButton colors="primary" onClick={this.cancelDistribute.bind(this)} fieldid='confirm'>{this.state.json['10140CCSC-000039']}</NCButton>{/* 国际化处理： 快速取消分配*/}
                     <NCButton onClick={this.cancelFormButtonClick.bind(this)} fieldid ='cancel'>{this.state.json['10140CCSC-000034']}</NCButton>{/* 国际化处理： 取消*/}
                 </NCModal.Footer>
            </NCModal>
        )
    }
}
CardCancelDistribute = createPage({})(CardCancelDistribute);
export default CardCancelDistribute;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65