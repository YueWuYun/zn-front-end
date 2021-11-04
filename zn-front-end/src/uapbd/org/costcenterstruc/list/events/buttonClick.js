//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import { ajax, toast } from 'nc-lightapp-front';
import AttrClassModal from '../../attrclass/index';
import Utils from '../../../../public/utils/index';
const {convertGridEnablestateToSave} = Utils;
let sysVersionStatus = 'browse';
let data ={
           
    head:{
       rows: [{
           status: "0",
           isOptimized: false,
           values: {
               versionName: {},
               code: { value: "01" },
               name: { value: "成本中心结构1" },
               default: { value: "是" },
               versionNumber:{value:"202001"},
               versionName:{value:"初始版本"},
               effectiveDate:{value:"2020-2-15"},
               expirationDate:{value:"9999-12-31"},
               enable:{value:"已启用"},
               creatPerson:{value:"张三"},
               creatData:{value:"2020-1-1"},
               Lastmodifiedby:{value:"李四"},
           }
       },
       
    ]
    }
}

export default function buttonClick(props, id) {
    let _this = this;
    switch (id) {
        case 'add':
            onAdd(this);

            break;
        case 'copy':
            oncopy(this)
        break;
        case 'attrcalssify':
            props.modal.show('attrclass', {
                title: _this.state.json['barappobject-000005'],/* 国际化处理： 属性分类*/
                size: 'xlg',
                noFooter: true,
                content: <AttrClassModal />
            });
            break;
        case 'btnsave':
            btnsave(props);
            break;

        case 'del':
            let chechrows = props.table.getCheckedRows('head');
            if (!chechrows || chechrows.length <= 0) {
                toast({ color: 'warning', content: _this.state.json['barappobject-000007'] });/* 国际化处理： 请选择要删除的数据*/
                return;
            }
            let delrows = [];
            let delIndexs = [];
            for (let index = 0; index < chechrows.length; index++) {
                delrows.push(chechrows[index].data);
                delIndexs.push(chechrows[index].index);
            }
            _this.props.ncmodal.show('ncmodal', {
                title: <span className='nc-theme-common-font-c'>{_this.state.json['barappobject-000003']}</span>,/* 国际化处理： 是否确认要删除?*/
                beSureBtnClick: () => {
                    ajax({
                        url: '/nccloud/bcbd/barappobject/delete.do',
                        data: { head: { rows: delrows } },
                        success: (result) => {
                            if (result && result.success) {
                                if (result.data && result.data.status) {
                                    _this.props.table.deleteTableRowsByIndex('head', delIndexs);
                                    toast({ color: 'success' });
                                } else if (result.data && result.data.errmsg) {
                                    toast({ color: 'danger', content: result.data.errmsg });
                                }
                            }
                        }
                    });
                }
            });
            break;
    }

}


function btnsave(props){
    setTimeout(()=>{
        // props.editTable.filterEmptyRows('head',['pk_org'],'include');
        //获取新增或修改过的rows的数组
        let changedRows = props.editTable.getChangedRows('head');
        // changedRows = convertGridEnablestateToSave(changedRows);
        //停用启用值true false 转换
        // if (changedRows.length == 0 && this.state.rollbackcodeObj.length == 0) {
        //     props.editTable.setStatus('head', 'browse');
        //     this.gridStatusChange();
        //     toast({title: '保存成功', color: 'success'});
        //     /* 国际化处理： 保存成功！*/
        //     this.setState({
        //         defaultAddValue:{},
        //         rollbackcodeObj:[]
        //     },()=>{
                
        //         // this.loadGridData(this.getLoadParmData());
        //     })
        //     return;
        // }
        props.editTable.setStatus('head', 'browse');
        gridStatusChange(props);
        toast({title: '保存成功', color: 'success'});
        return;
    }
    )};

   function gridStatusChange(props) {
        let gridStatus = props.editTable.getStatus('head');
        gridStatus === 'browse' ? props.button.setButtonsVisible({
            'btnsave': false,
            'btnCancel': false,
            'add':true, 
            'copy':true, 
            'version':true,
             'print':true,
        }) : props.button.setButtonsVisible({
            'add': false,
            'copy': false,
            'version': false,
            'print': false,
            
            'btnsave': true,
            'btnCancel': true,
            
        });
        if(gridStatus === 'browse'){
            //表格切换为浏览态
           //props.editTable.setTableData('head',state.queryGridData);
        }else{
            //表格切换为编辑态
            let copydata = this.state.queryGridData;
            copydata.rows = convertGridEnablestateToSave(copydata.rows);
            props.editTable.setTableData(gridId,copydata);
        }
    }

    function setVerButton(status, tthis) {
        let _this = tthis;
        sysVersionStatus = status;
        _this.props.editTable.setStatus('head', status);
        if (status === 'edit') {
            _this.props.button.setButtonVisible(['add', 'copy', 'version', 'print'], false);
            _this.props.button.setButtonVisible(['btnsave'], true);
        } else {
            _this.props.button.setButtonVisible(['add', 'copy', 'version', 'print'], true);
            _this.props.button.setButtonVisible(['btnsave'], false);
        }
        windowCloseListener(status);
    
    }

    function windowCloseListener(uiStatus) {
        if (uiStatus === 'browse') {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

function onAdd(that) {
    let _this = that;
    
_this.props.editTable.setTableData('head', data.head);
_this.props.editTable.addRow("head");
//  _this.pagestatus = 'add';
//   setPageStatus('add', _this);
setVerButton('edit',_this);
_this = null;

}




function oncopy(that) {
    let _this = that;
    let rowNum = _this.props.editTable.getNumberOfRows("head");
    if(rowNum === 0){
        toast({ color:'warning',content:"请选择数据"});
        return;
    }
    // let ind = _this.props.editTable.getClickRowIndex(head);
    // let pk_vid = ind.record.values.pk_vid.values;
    // let ts = ind.record.values.ts.value;
   let name = data.head.rows[0].values.name.value;
   let rows1 = data.head.rows[0];
    let data1 ={
           
        head:{
           rows: [rows1,
           {
            status: "0",
            isOptimized: false,
            values: {
                versionName: {},
                code: { value: "02" },
                name: { value: "成本中心结构1" },
               default: { value: "是" },
                versionNumber:{value:"202001"},
                versionName:{value:"初始版本"},
                effectiveDate:{value:"2020-2-15"},
                expirationDate:{value:"9999-12-31"},
                enable:{value:"已启用"},
                creatPerson:{value:"张三"},
                creatData:{value:"2020-1-1"},
                Lastmodifiedby:{value:"李四"},
            }
        },
          
          
        ]
        }
}
_this.props.editTable.setTableData('head', data1.head);
_this.props.editTable.addRow("head");
// setVerButtonSat('edit',_this);

}

// function setVerButtonSat(status, tthis) {
//     let _this = tthis;
//     // sysVersionStatus = status;
//     _this.props.editTable.setStatus(sysVersionModalId, status);
//     if (status === 'edit') {
//         _this.props.button.setButtonVisible(['AddVersion', 'EditVersion', 'RefreshV', 'DelVersion'], false);
//         _this.props.button.setButtonVisible(['SaveVersion', 'CancelVersion'], true);
//     } else {
//         _this.props.button.setButtonVisible(['AddVersion', 'EditVersion', 'RefreshV', 'DelVersion'], true);
//         _this.props.button.setButtonVisible(['SaveVersion', 'CancelVersion'], false);
//     }
//     windowCloseListener(status);

// }

// function windowCloseListener(uiStatus) {
//     if (uiStatus === 'browse') {
//         window.onbeforeunload = null;
//     } else {
//         window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
//             return '';
//         };
//     }
// }





//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS