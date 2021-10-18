/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { createPage, ajax, base  ,toast ,print,promptBox} from 'nc-lightapp-front';
import {setButtonVisible,onDelete,onCancel ,constData} from './initRestMoneyDate';
export default function buttonClick(json1, props, id) {
    /**设置小应用按钮事件 */
    let invokethis = this;
    //let checkeddate = props.editTable.getCheckedRows(this.tableId);
    // 财务组织
    let pkorg = this.props.search.getAllSearchData(this.searchId);
    let pkorgvalue = null;
    if (pkorg && pkorg.conditions[0] && pkorg.conditions[0].value && pkorg.conditions[0].value.firstvalue) {
        pkorgvalue = pkorg.conditions[0].value.firstvalue;
    }
    if(pkorgvalue == null){
        toast({ color: 'warning', content: json1['360701OB-000000'] });/* 国际化处理： 请选择财务组织*/
        return;
    }
    // 资金形态
    let fundcode = null;
    let fundname = null;
    let fundtree = invokethis.getFundform();
    if (fundtree && fundtree.refcode) {
        fundcode = fundtree.refcode;
        if(fundcode && fundcode==0){
           fundname = json1['360701OB-000032'];
        }else if(fundcode && fundcode==1){
           fundname = json1['360701OB-000033'];
        }
        //fundname = fundtree.refname;
    }
    // 此处不允许出现选择全部的情况
    if (fundcode == null) {
        toast({ color: 'warning', content: json1['360701OB-000001'] });/* 国际化处理： 请选择资金形态*/
        return;
    }
    //刷新按钮
    if (id == constData.refresh) {
        this.refreshHtml();
        return;
    }
    let pktsmap = {};
    // 过滤的不符合条件的数据
    let error = [];
    // 列表操作的索引数组
    let indexarr = [];
    switch (id) {
    //删除，可以支持批量 2
    case 'deleteLine':
        let deletedData = props.editTable.getCheckedRows(this.tableId);
        if (deletedData.length == 0) {
            toast({ color: 'warning', content: json1['360701OB-000002'] });/* 国际化处理： 请选择数据*/
            return
        }
        //处理选择数据
        deletedData.forEach((val) => {
            if(val.data.values.approver && val.data.values.approver.value){
                // error.push(val.data.values.pk_account.display);
                error.push(val.index+1);
                // continue;
            }else{
                indexarr.push(val.index);
                // pk ts map结构
                pktsmap[val.data.values.pk_initdata.value] = val.data.values.ts.value;
            }
        });
        let content = null;
        // 没有选择可以删除的数据，则提示
        if (JSON.stringify(pktsmap) == '{}')  {
            content = json1['360701OB-000003']/* 国际化处理： 已复核的数据不允许删除！*/
            toast({ color: 'warning', content: content });
            return;
        }
        if (error && error.length>0) {
            content = <div> {json1['360701OB-000021']} {error.join(', ')} {json1['360701OB-000022']}，{json1['360701OB-000023']}？</div>/* 国际化处理： 序号,将会删除失败,是否确定删除*/
        }else{
            content = json1['360701OB-000004'];/* 国际化处理：  删除操作不可逆，是否确定？*/
        }
        // props.ncmodal.show('onDelete',{
        //     content: content,
        //     color:'warning',
        //     //点击确定按钮事件
        //     beSureBtnClick: onDelete.bind(this, props, id,pktsmap,indexarr)
        // });
         //更换弹框add by zhanghjr
         promptBox({
            color: "warning",
            content: content,
            beSureBtnClick: onDelete.bind(this, props, id,pktsmap,indexarr)
          });
    break;
    //保存
    case 'save':
    	props.syncTree.setNodeDisable('tree', false);//控制树的节点可编辑
    	props.button.setButtonVisible(['refresh'],true);
        let saveDate = props.editTable.getChangedRows(this.tableId);
        //let alldate = props.table.getAllTableData(this.tableId);
        let alldate = props.editTable.getAllRows(this.tableId);
        //数据校验
        if (saveDate.length == 0) {
            let editstatus = props.editTable.getStatus(this.tableId);
            if (editstatus == 'edit') {
                props.editTable.cancelEdit(this.tableId);
                props.editTable.setStatus(this.tableId, 'browse', null);
                setButtonVisible(props,true);
                return;
            }else{
                toast({ color: 'info', content: json1['360701OB-000005'] });/* 国际化处理： 没有要保存的数据*/
                return;
            } 
        }
         
        if(pkorgvalue == null){
            toast({ color: 'warning', content: json1['360701OB-000000'] });/* 国际化处理： 请选择财务组织*/
            return;
        }
        // 保存不允许资金形态选择全部
        if (fundcode == null || fundcode == '-1') {
            toast({ color: 'warning', content: json1['360701OB-000001'] });/* 国际化处理： 请选择资金形态*/
            return;
        }
        // 校验帐号+币种组合只能出现一次
        let valiset = new Set();
        let saveflag = false;
        alldate.forEach((val,index)=>{
            let valvalue = val.values;
            let saveaccount = valvalue.pk_account.value;
            let savecurrtype = valvalue.pk_currtype.value;
            if (!saveaccount) {
                toast({ color: 'warning', content: json1['360701OB-000006'] });/* 国际化处理： 账户不能为空*/
                saveflag = true;
                return;
            }
            if (!savecurrtype) {
                toast({ color: 'warning', content: json1['360701OB-000007'] });/* 国际化处理： 币种不能为空*/
                saveflag = true;
                return;
            }
            valiset.add(saveaccount+savecurrtype);
        })
        // 出现校验不通过，直接返回
        if (saveflag) {
            return;
        }
        if (valiset.size != alldate.length) {
            toast({ color: 'warning', content: json1['360701OB-000008'] });/* 国际化处理： 账户+币种的组合只能出现一次*/
            return;
        }
        //处理需要保存的数据
        for (let i = saveDate.length-1; i > -1; i--) {
            let val = saveDate[i];
            //往保存的数据里添加组织，资金形态
            val.values.pk_org.value = pkorgvalue;
            val.values.formcode.value = fundcode;
            // 保存失败的元素
            if (!val.values.init_local || !val.values.init_local.value) {
                // 原币金额为空的元素可以保存，需要将其置为0
                let defaultvalue = {value:'0'};
                val.values.globalrealtime_local = defaultvalue;
                val.values.globalcurrent_local = defaultvalue;
                val.values.groupinit_local = defaultvalue;
                val.values.grouprealtime_local = defaultvalue;
                val.values.groupcurrent_local = defaultvalue;
                val.values.init_primal = defaultvalue;
                val.values.init_local = defaultvalue;
                val.values.realtime_local = defaultvalue;
                val.values.realtime_primal = defaultvalue;
                val.values.current_primal = defaultvalue;
                val.values.current_local = defaultvalue;
            }
        }
        let vodate = {
            areacode : 'table_area',
            areaType : 'table',
            rows : saveDate,
            pagecode: '360701OB_L01',
        };
        ajax({
            url: '/nccloud/cmp/bankaccountbook/initrestmoneysave.do',
            data: {
                model : vodate,
                pageid : '360701OB_L01'
            },
            success: function (res) {
                let { success, data } = res;
                if (success) {
                    // refreshHtml();
                    toast({ color: 'success', content: json1['360701OB-000009'] });/* 国际化处理： 保存成功*/
                    // NCMessage.create({ content: '审批成功', color: 'success', position: 'top' });
                    setButtonVisible(props,true);
                    invokethis.refreshHtml();
                }
            }
        });
        break;

    //增行，与保存走一个方法
    case 'addLine':
    	props.syncTree.setNodeDisable('tree', true);//控制树的节点不可编辑
    	props.button.setButtonVisible(['refresh'],false);
        let number = props.editTable.getNumberOfRows(this.tableId);
        // 资金形态的默认值
        let addfundcode = { 'formcode':{display:fundname, value:fundcode}, 'pk_org': {value:pkorgvalue} }
        props.editTable.addRow(this.tableId, number,true,addfundcode);
        let keys = ['pk_account','init_primal'];
        props.editTable.setEditableRowKeyByIndex(this.tableId, number, keys, true);
        //begin tm tangleic 20200323 增加状态标志，取消的逻辑需要与实际的操作做区分，
        //新增的需要删行，不能纯粹的只是用edittable的缓存数据更新 
        props.setUrlParam({status:'add'});
        //end tm tangleic
        setButtonVisible(props,false);
        break;
    //复核
    case 'audit':
        let auditDate = props.editTable.getCheckedRows(this.tableId);
        if (auditDate.length == 0) {
            toast({ color: 'warning', content: json1['360701OB-000002'] });/* 国际化处理： 请选择数据*/
            return;
        }
        if(pkorgvalue == null){
            toast({ color: 'warning', content: json1['360701OB-000000'] });/* 国际化处理： 请选择财务组织*/
            return;
        }
        let indexArr5 = [];
        //处理选择数据
        for (let index = auditDate.length-1; index > -1; index--) {
            let val = auditDate[index];
            let aupk = val.data.values.pk_initdata.value;
            let auts = val.data.values.ts.value;
            //dateArr5.push(val.data.values.pk_initdata.value);//主键数组
            if(val.data.values.approver && val.data.values.approver.value){
                error.push(val.data.values.pk_account.display);
            }else{
                // vo数组
                indexArr5.push(val.index);
                pktsmap[aupk] = auts; 
            }
        }
        // 需要复核的数据为空
        if (JSON.stringify(pktsmap) == '{}') {
            if (error.length>0) {
                toast({ color: 'warning', content: json1['360701OB-000010']/* 国际化处理： 账户*/
                                +error.join(', ')+json1['360701OB-000011'] });/* 国际化处理： 复核失败！*/
            }
            return;
        }
        
        //处理不允许修改的数据
        //自定义请求数据
        let data5 = {
            pktsmap:pktsmap,
            pk_org:pkorgvalue
        };
        ajax({
            url: '/nccloud/cmp/bankaccountbook/initrestmoneyaudit.do',
            data: data5,
            success: function (res) {
                let { success, data } = res;
                if (success) {
                    let content = json1['360701OB-000012'];/* 国际化处理： 复核成功*/
                    if (data && data.message) {
                        content = data.message;
                    }
                    // if (error && error.length ) {
                    //     // 用户不可被复核的数据，提示出来
                    //     toast({ color: 'warning', content: <div>
                    //         {content}
                    //         <br/> 
                    //         {props.MutiInit.getIntl("360701OB") && props.MutiInit.getIntl("360701OB").get('360701OB-000010')}{error.join(', ')}{props.MutiInit.getIntl("360701OB") && props.MutiInit.getIntl("360701OB").get('360701OB-000025')}！{/* 国际化处理： 账户,复核失败*/}
                    //     </div> });
                    // }else{
                    // }
                    toast({ color: 'success', content: content});
                    invokethis.refreshHtml();
                    //props.table.deleteTableRowsByIndex(tableid, indexArr5)//直接删除table中的行列
                }else{
                    toast({ color: 'warning', content: json1['360701OB-000013'] });/* 国际化处理： 复核失败，请稍后再试！*/
                }
            }
        });
        break;

    //取消复核
    case 'antiaudit':
        let antiDate = props.editTable.getCheckedRows(this.tableId);
        if (antiDate.length == 0) {
            toast({ color: 'warning', content: json1['360701OB-000002'] });/* 国际化处理： 请选择数据*/
            return;
        }
        let indexArr6 = [];
        //处理选择数据
        for (let i = antiDate.length-1; i > -1; i--) {
            let val = antiDate[i];
            //dateArr6.push(val.data.values.pk_initdata.value);//主键数组
            if(!val.data.values.approver || !val.data.values.approver.value){
                //toast({ color: 'warning', content: '未审核过的数据不能取消审核！' });
                //flag6 = true;
                error.push(val.data.values.pk_account.display);
            }else{
                let ants = val.data.values.ts.value;
                let anpk = val.data.values.pk_initdata.value;
                indexArr6.push(val.index);
                pktsmap[anpk] = ants;
            }
        }
        // 需要复核的数据为空
        if (JSON.stringify(pktsmap) == '{}') {
            if (error.length>0) {
                toast({ color: 'warning', content: json1['360701OB-000010']/* 国际化处理： 账户*/
                                +error.join(', ')+json1['360701OB-000011'] });/* 国际化处理： 复核失败！*/
            }
            return;
        }
        //自定义请求数据
        let data6 = {
            pktsmap:pktsmap
        };
        ajax({
            url: '/nccloud/cmp/bankaccountbook/initrestmoneyantiaudit.do',
            data: data6,
            success: function (res) {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        // if (error && error.length > 0 ) {
                        //     // 用户不可被复核的数据，提示出来
                        //     toast({ color: 'warning', content: data.message +'\n' + this.props.MutiInit.getIntl("360701OB") && this.props.MutiInit.getIntl("360701OB").get('360701OB-000010')/* 国际化处理： 账户*/
                        //         +error.join(', ')+this.props.MutiInit.getIntl("360701OB") && this.props.MutiInit.getIntl("360701OB").get('360701OB-000014') });/* 国际化处理： 取消复核失败！*/
                        // }
                        // data会返回错误信息
                        // toast({ color: 'info', content: data.message });
                        if (data.flag == 'true') {
                            toast({ color: 'success', content: json1['360701OB-000015'] });/* 国际化处理： 取消复核成功*/
                        }else{
                            // data会返回错误信息
                            toast({ color: 'info', content: data.message });
                            return;
                        }
                    }else{
                        toast({ color: 'success', content: json1['360701OB-000015'] });/* 国际化处理： 取消复核成功*/
                        if (error && error.length > 0 ) {
                            // 用户不可被复核的数据，提示出来
                            toast({ color: 'warning', content: json1['360701OB-000010']/* 国际化处理： 账户*/
                                +error.join(', ')+json1['360701OB-000014'] });/* 国际化处理： 取消复核失败！*/
                        }
                    }
                    invokethis.refreshHtml();
                    //props.table.deleteTableRowsByIndex(tableid, indexArr6)//直接删除table中的行列
                }else{
                    toast({ color: 'warning', content: json1['360701OB-000016'] });/* 国际化处理： 取消复核失败，请稍后再试！*/
                }
            }
        });
        break;
        /**导入 */
        case 'getin':
            if(pkorgvalue == null){
                toast({ color: 'warning', content: json1['360701OB-000000'] });/* 国际化处理： 请选择财务组织*/
                return;
            }
            // 导入不允许资金形态选择全部
            if (fundcode == null || fundcode == '-1') {
                toast({ color: 'warning', content: json1['360701OB-000001'] });/* 国际化处理： 请选择资金形态*/
                return;
            }
            let pkaccounts = [];
            // 当前页面上所有数量
            let alllength = props.editTable.getNumberOfRows(this.tableId);
            //自定义请求数据
            let geiindate = {
                pk_org: pkorgvalue,
                fundform: fundcode,
                pagecode: '360701OB_L01',
            };
            ajax({
                url: '/nccloud/cmp/bankaccountbook/initrestmoneygetin.do',
                data: geiindate,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if(data){
                            //allDate[0].values.push(data[this.tableId]);
                            //data[this.tableId].rows.unshift(allDate);
                            let addindex = 0;
                            // 页面超过200行就不拼接之前的数据
                            // if (alllength<=200) {
                            // addindex = alllength;
                            // }
                            // 正常的币种和组织本位币相同的数据
                            let indexarr = [];
                            // 币种和组织本位币不相同的数据
                            let diffindexarr = [];
                            let localcurrtype = invokethis.localcurrtype;
                            data[invokethis.tableId].rows.forEach((val,index) => {
                                
                                val.status = 2;
                                val.values.pk_org.value = pkorgvalue;
                                val.values.formcode.value = fundtree.refcode;
                                val.values.formcode.display = fundtree.refname;
                                let pk_currtype = val.values.pk_currtype.value;
                                if (localcurrtype && localcurrtype==pk_currtype) {
                                    // 币种与组织本位币相同
                                    indexarr.push(addindex+index);
                                }else{
                                    // 币种和组织本位币不同
                                    diffindexarr.push(addindex+index);
                                }
                            });
                            // 页面上超过200行之后就不拼接之前的数据了
                            // 页面上不拼接之前的数据了
                            // if(alllength<=200){
                            //     // data[invokethis.tableId].rows = allDate.concat(data[invokethis.tableId].rows);
                            //     invokethis.props.editTable.insertRowsAfterIndex(invokethis.tableId, data[invokethis.tableId], alllength-1)
                            // }else{
                            // }
                            invokethis.props.editTable.setTableData(invokethis.tableId, data[invokethis.tableId],false);
                            invokethis.props.editTable.setStatus(invokethis.tableId, 'edit', null);
                            setButtonVisible(props,false);
                            // 设置和组织本币一样的币种的编辑性
                            let keys = ['pk_account','init_primal'];
                            props.editTable.setEditableRowKeyByIndex(invokethis.tableId, indexarr, keys, true);
                            // 设置和组织本币币种不一致的数据的编辑性
                            if (diffindexarr.length > 0) {
                                let triblekeys = ['pk_account','init_primal','init_local'];
                                props.editTable.setEditableRowKeyByIndex(invokethis.tableId, diffindexarr, triblekeys, true);  
                            }
                            if((data[invokethis.tableId].rows.length)>=500){//返回的数据
                                toast({ color: 'success', content: json1['360701OB-000062'] });//每次最多导入500条，剩余的需要再次导入
                            }
                        }else{
                            toast({ color: 'warning', content: json1['360701OB-000017'] });/* 国际化处理： 没有需要导入的数据*/
                        }
                    }
                }
            });

        break;
        /**刷新 */
        case 'refresh':
            invokethis.refreshHtml();
        break;
        // 打印
        case 'print':
            let printdata = props.editTable.getAllRows(this.tableId);;
            if(printdata && printdata.length==0){
                toast({ color: 'warning', content: json1['360701OB-000018'] });/* 国际化处理： 请选择至少一条数据！*/
                return;
            }
            let printpks = [];
            printdata.forEach((val) => {
                let pk = val.values.pk_initdata.value;
                printpks.push(pk);
            })
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                '/nccloud/cmp/bankaccountbook/initrestmoneyprint.do',  // 后台url
                {
                    //billtype:'D5',      //单据类型
                    appcode:'360701OB',   //功能节点编码，即模板编码
                    nodekey:'NCC360701OB-LIST',     //模板节点标识
                    printTemplateID:'1001Z61000000000N8NM',  //模板id
                    oids:printpks
                }
            );
        break;
        case 'cancel':
        	props.syncTree.setNodeDisable('tree', false);//控制树的节点可编辑
        	props.button.setButtonVisible(['refresh'],true);
            // props.editTable.cancelEdit('table_area');
            // props.editTable.setStatus('table_area', 'browse', null);
            // setButtonVisible(props,true);
            let cancelcon = json1['360701OB-000019'];/* 国际化处理： 取消之后您的编辑数据将不可用，是否确认取消？*/
            // props.ncmodal.show('onDelete',{
            //     title: json1['360701OB-000020'],/* 国际化处理： 确认取消*/
            //     content: cancelcon,
            //     color:'warning',
            //     //点击确定按钮事件
            //     beSureBtnClick: onCancel.bind(this, props)
            // });
            //更换弹框add by zhanghjr
            promptBox({
                color: "warning",
                title:json1['360701OB-000020'],/* 国际化处理： 确认取消*/
                content: cancelcon,
                beSureBtnClick: onCancel.bind(this, props)
              });
            //invokethis.refreshHtml();
        break;    
    }
}


/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/