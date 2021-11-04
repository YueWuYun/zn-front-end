//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import {ajax, base, toast,cardCache,print,promptBox} from 'nc-lightapp-front';

let {setDefData, getDefData } = cardCache;




export  default function (gridId,props,id) {

    var _this = this;
    var pk_org = props.getUrlParam('pk_org')
    var status = props.getUrlParam('status')
    var pk_orgarr = [];
    let flag = true;
    if(getDefData('orgunit_btnopr',props.config.datasource) == 'copy'){
        status = 'copy';
    }

    setDefData('orgunit_btnopr',props.config.datasource,'browse');
    if(undefined == pk_org){
        pk_org = getDefData('orgunit_pk_org', props.config.datasource);//cacheTools.get('orgunit_pk_org');
    }
    
    pk_orgarr.push(pk_org);

    if(id == 'add' || id == 'orgunitreldept' || id == 'print' || id == 'export'|| id == 'refresh'){
        flag = false;
    }

    if(flag && undefined == pk_org &&  'add' != status && id != 'back'){
        toast({content : _this.state.json['10100ORG-000000'],color : 'warning'});/* 国际化处理： 请先选择组织！*/
    }
    
    let pk_fatherorg = props.form.getFormItemsValue('org','pk_fatherorg');

    switch (id) {
        case 'add':
            //清空所有form
            //根据编码规则获取编码
            setDefData('orgunit_listadd',props.config.datasource,'cardadd');
            props.setUrlParam({
                pagecode:props.config.pagecode,
                status: 'add'
            })
            //新增的时候使用零售不能编辑
            _this.props.form.setFormItemsDisabled('org',{'isretail':true});//设置表单项不可用
            //楼层加载数据也要清空
            _this.setState({orgtypefloor:[]},_this.onRefresh());
            //BillCode.getBillCode();
            buttonToggleShow(props,'add');
            break;
        case 'cancel':
            promptBox({
                color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: _this.state.json['10100ORG-000100'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                content: _this.state.json['10100ORG-000002'],/* 国际化处理： 您确定要取消吗？*/
                beSureBtnClick: () =>{
                    let isbacklist = getDefData('orgunit_listadd',props.config.datasource);
                    if(isbacklist == 'listadd'){
                        props.button.setButtonDisabled(['enable'],false);
                        setDefData('orgunit_btnopr',props.config.datasource,'refresh');
                        props.pushTo('/list', {
                            status: 'browse',
                            pagecode:props.config.listpagecode
                        })
                    }else{
                        //设置浏览器参数
                        props.setUrlParam({
                            status: 'browse',
                            pagecode:props.config.pagecode,
                            pk_org: pk_org
                        })
                        //记录按钮操作
                        setDefData('orgunit_btnopr',props.config.datasource,'cancel');
                        //记录可以用缓存数据，不需要强制走一遍数据库
                        setDefData('orgunit_needquerydata_'+pk_org,_this.props.config.datasource,false);

                        if(status == 'add'){
                            //编码回收
                            ajax({
                                url:'/nccloud/uapbd/org/rollbackcode.do',
                                data: {
                                    code:props.form.getFormItemsValue('org','code').value,
                                    pk_org:pk_org,
                                    nodetype:_this.config.nodeType
                                }, 
                                success:(res)=>{
                                    if(res.success){        
                                    }
                                }
                            });
                            //新增取消的时候，把已经勾选的楼层清空
                            _this.state.orgtypefloor = [];

                            //将所有职能都设置为form都设置为浏览态
                            props.config.orgtypearr.map((obj)=>{
                                props.form.EmptyAllFormValue(obj.subGrid);
                                props.form.setFormStatus(obj.subGrid,'browse');
                            })
                            
                        }else{
                            //将所有职能都设置为form都设置为浏览态
                            props.config.orgtypearr.map((obj)=>{
                                props.form.cancel(obj.subGrid);
                                props.form.setFormStatus(obj.subGrid,'browse');
                            })
                        }
                        _this.onRefresh();
                        //当是新增的时候需要把界面编码清除
                        if(undefined == props.form.getFormItemsValue('org','pk_org').value){
                            props.form.setFormItemsValue('org',{'code':{value:null,display:null}});
                        }
                        //控制页面按钮状态
                        buttonToggleShow(props,'cancel');
                        //新增取消之后，停启用按钮不可以使用
                        // if(status == 'add'){
                        //     props.button.setButtonDisabled(['enable'],true);
                        // }
                        //控制停启用按钮
                        toggleShow(props,props.form.getFormItemsValue('org','enablestate').value);

                        //取消的时候设置卡片翻页显示
                        _this.setState({
                            showSubGrid:true
                        });
                    }
                }   
            })
            break;
        case 'edit':

            //设置编码是否可以编辑,里面包含权限过滤
            ajax({
                url:'/nccloud/uapbd/org/getcode.do',
                data: {pk_org:pk_org,status:'edit'}, 
                success:(res)=>{
                    if(res.success){
                        if(res.data){
                            props.form.setFormItemsDisabled('org',{code:!res.data.isCodeEdit});
                        }

                        props.setUrlParam({
                            status: 'edit',
                            pagecode:props.config.pagecode,
                            pk_org: pk_org
                        })
            
                        //把勾选职能的设置为编辑态
                        props.form.setFormStatus('org','edit');
                        props.config.orgtypearr.map((obj)=>{
                            //不显示停启用按钮，编辑态
                            _this.toggleButtonShow (props,2,obj.subGrid);
                            //将form设置为编辑态
                            props.form.setFormStatus(obj.subGrid,'edit');
                        })
            
                        //如果上级组织为空，说明为根节点，n那么修改的时候需要把上级组织设置为非必填 pk_fatherorg.display == undefined || pk_fatherorg.display == ''
                        if(pk_fatherorg.display == undefined || pk_fatherorg.display == ''){
                            // pk_fatherorgitem = meta1['org'].items.find((item) => item.attrcode == 'pk_fatherorg');
                            // pk_fatherorgitem.required = false;
                            // pk_fatherorgitem.disabled = true;
                            // props.meta.setMeta(meta1);
            
                            props.form.setFormItemsDisabled('org',{'pk_fatherorg':true});
                            props.form.setFormItemsRequired('org',{'pk_fatherorg':false});
                        }
                        //编辑的时候，如果选中的就是法人根节点，那么上级就不能编辑
                        let corproot = getDefData('havecorprootorgunit',props.config.datasource);
                        if(!corproot.haveroot || pk_org == corproot.pk){
                            props.form.setFormItemsDisabled('corp',{'pk_fatherorg':true});
                            props.form.setFormItemsRequired('corp',{'pk_fatherorg':false});
                        }
                        if(corproot.haveroot && pk_org != corproot.pk){
                            props.form.setFormItemsDisabled('corp',{'pk_fatherorg':false});
                            props.form.setFormItemsRequired('corp',{'pk_fatherorg':true});
                        }
                        
                        //编辑的时候库存的财务组织，如果勾选财务，那么就不能编辑
                        if(_this.state.childstate.financeorg){
                                props.form.setFormItemsDisabled('stockorg',{pk_financeorg:true});//设置表单项不可用
                        }
                        //编辑的时候，如果选中的就是行政根节点，那么上级就不能编辑
                        let adminroot = getDefData('haveadminrootorgunit',props.config.datasource);
                        //编辑的时候会计期间方案和本位币是不可以修改
                        props.form.setFormItemsDisabled('org',{'pk_accperiodscheme':true});
                        props.form.setFormItemsDisabled('org',{'pk_currtype':true});
            
                        if(!adminroot.haveroot || pk_org == adminroot.pk){
                            //如果勾选的是根节点，则对应的设置根节点按钮不可以使用
                            props.form.setFormItemsDisabled('adminorg',{'pk_fatherorg':true});
                            props.form.setFormItemsRequired('adminorg',{'pk_fatherorg':false});
                        }
                        if(adminroot.haveroot && pk_org != adminroot.pk){
                            props.form.setFormItemsDisabled('adminorg',{'pk_fatherorg':false});
                            props.form.setFormItemsRequired('adminorg',{'pk_fatherorg':true});
                        }
            
                        //设置编码是否可以编辑
                        ajax({
                            url:'/nccloud/uapbd/org/getcode.do',
                            data: {pk_org:pk_org,status:'edit'}, 
                            success:(res)=>{
                                if(res.success){
                                    if(res.data){
                                        props.form.setFormItemsDisabled('org',{code:!res.data.isCodeEdit});
                                    }
                                }
                            }
                        });
                        if(getDefData('orgunit_needquerydata_'+pk_org,_this.props.config.datasource)){
                            //修改如果发现界面数据没修改了，就需要重新刷新数据
                            _this.onRefresh();
                        }
                        buttonToggleShow(props,'edit');
                        //如果勾选了库存和销售，那么使用零售应该是可以操作的其他情况不可以操作
                        var arr = _this.state.orgtypefloor.filter((obj)=>{
                            //如果勾选利润中心，那么管控范围就不能为空
                            if("stockorg" == obj.subGrid){
                                if(obj.isshow){
                                    return true;
                                }
                            }
                            if("saleorg" == obj.subGrid){
                                if(obj.isshow){
                                    return true;
                                }
                            }
                        })
            
                        if( arr.length > 0 ){
                            _this.props.form.setFormItemsDisabled('org',{'isretail':false});//设置表单项可用
                        }else{
                            _this.props.form.setFormItemsDisabled('org',{'isretail':true});//设置表单项不可用
                        }
                        
                        _this.setState({
                            showSubGrid:false
                        })
                    }
                }
            });
            //委托关系，需要根据开启的职能，关闭委托关系的不能编辑状态
            //_this.dealrelationformstatus();
            break;
        case 'back':
            //列表数据没有做缓存，所以每次返回都需要走一次后台查询
            props.button.setButtonDisabled(['enable'],false);
            setDefData('orgunit_btnopr',props.config.datasource,'refresh');
            //返回的时候相当于没有勾选显示停用按钮
            setDefData('orgunit_checkflag', this.config.datasource, false);
            props.pushTo('/list', {
                status: 'browse',
                pagecode:props.config.listpagecode,
                pk_org: pk_org
            })
            break;
        case 'save':
        //必填项校验
            
            let memberFlag = _this.props.form.isCheckNow('org');
            if(!memberFlag){
                return;
            }
            //记录错误提示信息
            let warm = '';

            //必填项校验
            var errorarr = _this.state.orgtypefloor.filter((obj)=>{
                //如果勾选利润中心，那么管控范围就不能为空
                if("liabilitycenter" == obj.subGrid){
                    let pk_controlarea = props.form.getFormItemsValue('org','pk_controlarea');
                    if(pk_controlarea.display == undefined || pk_controlarea.display == ''){
                        warm = _this.state.json['10100ORG-000003'] + props.form.getFormItemsValue('org','name').name.value+_this.state.json['10100ORG-000004'];/* 国际化处理： 利润中心,的管控范围不能为空！*/
                        return true;
                    }
                }
                if("stockorg" == obj.subGrid){
                    //校验必填项
                    if(!_this.props.form.isCheckNow('stockorg')){
                        warm = _this.state.json['10100ORG-000005'];/* 国际化处理： 库存组织有必填项未填！*/
                        return true;
                    }
                }
                if("adminorg" == obj.subGrid){
                    //校验必填项
                    if(!_this.props.form.isCheckNow('adminorg')){
                        warm = _this.state.json['10100ORG-000006'];/* 国际化处理： 行政有必填项未填！*/
                        return true;
                    }
                }
                if("corp" == obj.subGrid){
                    //校验必填项
                    if(!_this.props.form.isCheckNow('corp')){
                        warm = _this.state.json['10100ORG-000007'];/* 国际化处理： 法人公司有必填项未填！*/
                        return true;
                    }
                }
            })

            if(errorarr.length > 0 ){
                //toast({content: '业务单元中法人公司才能维护logo！', color: 'warning'});
                toast({content: warm, color: 'warning'});
                return ;
            }
            //界面上勾选的所有职能form（包含表头）
            let formidarr = [];
            //修改的时候，以前存在，现在取消的职能数组（需要删除）
            let deletemdata = [];
            
            let originalorgtypefloor = _this.state.originalorgtypefloor;
            
            //将原来存在现在取消的职能删除掉
            originalorgtypefloor && originalorgtypefloor.map((a)=>{
                _this.state.orgtypefloor.find((b)=>{
                       if(a.subGrid == b.subGrid ){
                           a.isshow = false;
                       }
               })
               
           });
           originalorgtypefloor.map((delobj)=>{
               if(delobj.isshow){
                deletemdata.push(delobj.subGrid);  
               }
               delobj.isshow = true;
           })
            _this.state.orgtypefloor.map((obj)=>{
                    //只往后台传勾选职能的form
                    //if(obj.isshow){
                //allneworgtype.push(obj);  
                formidarr.push(obj.subGrid);
                if("stockorg" == obj.subGrid){
                    formidarr.push("stocktrafficrelation");
                    formidarr.push("stockqccenterrelation");
                    formidarr.push("stockorgrelation");
                    formidarr.push("stockassetrelation");
                }
                if("maintainorg" == obj.subGrid){
                    formidarr.push("maintainstockrelation");
                }
                if("itemorg" == obj.subGrid){
                    formidarr.push("itemstockrelation");
                }
                if("assetorg" == obj.subGrid){
                    formidarr.push("assetorgmaintainrelation");
                }
                if("saleorg" == obj.subGrid){
                    formidarr.push("saleorgrelation");
                }
                   //}
            })
            //把表头加进去
            formidarr.push('org');

            let formdata = props.form.getAllFormValue(formidarr);

            let formdataarr = [];
            //为了适配校验公式，需要把每个模板的pagecode传进去
            if(formdata.adminorg != undefined){
                formdataarr.push({
                    model: formdata.adminorg,
                    pageid: '10100ORG_adminorg'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }
            if(formdata.assetorg != undefined){
                formdataarr.push({
                    model: formdata.assetorg,
                    pageid: '10100ORG_assetorg'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }
            if(formdata.corp != undefined){
                formdataarr.push({
                    model: formdata.corp,
                    pageid: '10100ORG_corp'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }
            if(formdata.factory != undefined){
                formdataarr.push({
                    model: formdata.factory,
                    pageid: '10100ORG_factory'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }
            if(formdata.fundorg != undefined){
                formdataarr.push({
                    model: formdata.fundorg,
                    pageid: '10100ORG_fundorg'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }
            if(formdata.financeorg != undefined){
                formdataarr.push({
                    model: formdata.financeorg,
                    pageid: '10100ORG_financeorg'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }
            if(formdata.hrorg != undefined){
                formdataarr.push({
                    model: formdata.hrorg,
                    pageid: '10100ORG_hrorg'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }
            if(formdata.itemorg != undefined){
                formdataarr.push({
                    model: formdata.itemorg,
                    pageid: '10100ORG_itemorg'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }
            if(formdata.liabilitycenter != undefined){
                formdataarr.push({
                    model: formdata.liabilitycenter,
                    pageid: '10100ORG_liabilitycenter'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }
            if(formdata.maintainorg != undefined){
                formdataarr.push({
                    model: formdata.maintainorg,
                    pageid: '10100ORG_maintainorg'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }
            if(formdata.org != undefined){
                formdataarr.push({
                    model: formdata.org,
                    pageid: '10100ORG_orgunitcard'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }
            if(formdata.planbudget != undefined){
                formdataarr.push({
                    model: formdata.planbudget,
                    pageid: '10100ORG_planbudget'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }
            if(formdata.plancenter != undefined){
                formdataarr.push({
                    model: formdata.plancenter,
                    pageid: '10100ORG_plancenter'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }
            if(formdata.purchaseorg != undefined){
                formdataarr.push({
                    model: formdata.purchaseorg,
                    pageid: '10100ORG_purchaseorg'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }
            if(formdata.qccenter != undefined){
                formdataarr.push({
                    model: formdata.qccenter,
                    pageid: '10100ORG_qccenter'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }
            if(formdata.saleorg != undefined){
                formdataarr.push({
                    model: formdata.saleorg,
                    pageid: '10100ORG_saleorg'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }
            if(formdata.stockorg != undefined){
                formdataarr.push({
                    model: formdata.stockorg,
                    pageid: '10100ORG_stockorg'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }
            if(formdata.trafficorg != undefined){
                formdataarr.push({
                    model: formdata.trafficorg,
                    pageid: '10100ORG_trafficorg'//pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
                });
            }

            props.validateToSave(formdataarr,()=>{
                //保存数据
                ajax({
                    url:'/nccloud/uapbd/org/save.do',
                    //data:formdata,
                    data:{formdata:formdata,status:status,deleteorgtype:deletemdata},
                    success:(res)=>{
                        let {success,data} = res;
                        if(success){
                            //设置浏览器状态，和参数
                            props.setUrlParam({
                                status: 'browse',
                                pagecode:props.config.pagecode,
                                pk_org: res.data.org.rows[0].values.pk_org.value
                            })

                            //保存的时候，如果是根节点行政组织，就设置为非必填项
                            if(_this.state.childstate.adminorg && !getDefData('haveadminrootorgunit',props.config.datasource).haveroot){
                                //如果保存的数据有行政，就把根行政设置为存在
                                setDefData('haveadminrootorgunit',props.config.datasource,{'haveroot':true,
                                'pk':res.data.org.rows[0].values.pk_org.value});
                            }

                            //保存的时候，如果是根节点法人组织，就设置为非必填项
                            if(_this.state.childstate.corp && !getDefData('havecorprootorgunit',props.config.datasource).haveroot){
                                //如果保存的数据有行政，就把根法人设置为存在
                                setDefData('havecorprootorgunit',props.config.datasource,{'haveroot':true,
                                'pk':res.data.org.rows[0].values.pk_org.value});
                            }

                            //保存的时候，如果是根节点组织，就设置为非必填项
                            if(_this.state.childstate.org && !getDefData('haverootorgunit',props.config.datasource).haveroot){
                                //如果保存的数据有行政，就把根设置为存在
                                setDefData('haverootorgunit',props.config.datasource,{'haveroot':true,
                                'pk':res.data.org.rows[0].values.pk_org.value});
                            }

                            //缓存数据
                            setDefData('orgunit_carddata_'+res.data.org.rows[0].values.pk_org.value,
                            props.config.datasource,undefined);

                            setDefData('orgunit_listadd',props.config.datasource,'cardadd');
                            //为了节省时间，界面的ts就不更新了，等用户需要在次操作的时候，更新界面ts
                            setDefData('orgunit_needquerydata_'+pk_org,_this.props.config.datasource,true);
                            //保存成功说明，根节点肯定就有了
                            //setDefData('orgunit_haverootorgunit',_this.props.config.datasource,{'haveroot':true,'pk':res.data.org.rows[0].values.pk_org.value});
                            //保存的时候， 都需要把楼层还有勾选的职能数据缓存一遍，以免保存完直接修改然后取消的时候，楼层和职能数据不能还原
                            setDefData('orgunit_childstate',_this.config.datasource,JSON.parse(JSON.stringify(_this.state.childstate)));
                            setDefData('orgunit_orgtypefloor',_this.config.datasource,_this.state.orgtypefloor);
                            setDefData('orgunit_pk_org',props.config.datasource,res.data.org.rows[0].values.pk_org.value);
                            setDefData('orgunit_name',props.config.datasource,res.data.org.rows[0].values.name.value);
                            setDefData('orgunit_btnopr',props.config.datasource,'save');
                            setDefData('orgunit_pk_accperiodscheme',props.config.datasource,res.data.org.rows[0].values.pk_accperiodscheme.value);
                            _this.props.form.setFormItemsDisabled('org',{'pk_corp':false});//设置表单项不可用
                            _this.props.form.setFormItemsRequired('org',{'pk_corp':false});


                            buttonToggleShow(props,'save');
                            //保存完之后应该是只显示停用
                            toggleShow(props,'2');
                            props.setUrlParam({status:'browse',pk_org:res.data.org.rows[0].values.pk_org.value});
                            props.config.orgtypearr.map((obj)=>{
                                props.form.setFormStatus(obj.subGrid,'browse');
                            })

                            //保存万需要刷新界面，添加新楼层
                            _this.setState({
                                orgtypefloor:_this.state.orgtypefloor,
                                pk_org : res.data.org.rows[0].values.pk_org.value,
                                originalorgtypefloor:JSON.parse(JSON.stringify(_this.state.orgtypefloor))
                            });

                            _this.onRefresh();

                            buttonToggleShow(props,'save');
                            //保存完之后应该是只显示停用
                            toggleShow(props,'2');
                            //将原来存在，现在删除的职能form数据清空
                            originalorgtypefloor.map((delobj)=>{
                                if(delobj.isshow){
                                    props.form.EmptyAllFormValue(delobj.subGrid);
                                    setDefData('orgunit_orgtypeformdata'+delobj.subGrid,props.config.datasource,undefined);
                                }
                            })
                        };
                    }
                });
            },{'orgdept':'form','adminorg':'form','assetorg':'form',
               'corp':'form','factory':'form','financeorg':'form',
               'fundorg':'form','hrorg':'form',
               'innercustsupp':'form','itemorg':'form','liabilitycenter':'form',
               'maintainorg':'form','orgmanager':'form','org':'form',
               'orgvatfunclet':'form','planbudget':'form','plancenter':'form',
               'purchaseorg':'form','qccenter':'form','saleorg':'form',
               'stockorg':'form','trafficorg':'form'} , 'form')
            
            break;
        case 'saveadd':
            let memberFlag1 = _this.props.form.isCheckNow('org');
            if(!memberFlag1){
                return;
            }
            props.setUrlParam({
                pagecode:props.config.pagecode,
                status: 'add'
            })
            //必填项校验
            var errorarr = _this.state.orgtypefloor.filter((obj)=>{
                //如果勾选利润中心，那么管控范围就不能为空
                if("liabilitycenter" == obj.subGrid){
                    let pk_controlarea = props.form.getFormItemsValue('org','pk_controlarea');
                    if(pk_controlarea.display == undefined || pk_controlarea.display == ''){
                        warm = _this.state.json['10100ORG-000003'] + props.form.getFormItemsValue('org','name').name.value+_this.state.json['10100ORG-000004'];/* 国际化处理： 利润中心,的管控范围不能为空！*/
                        return true;
                    }
                }
                if("stockorg" == obj.subGrid){
                    //校验必填项
                    if(!_this.props.form.isCheckNow('stockorg')){
                        warm = _this.state.json['10100ORG-000005'];/* 国际化处理： 库存组织有必填项未填！*/
                        return true;
                    }
                }
                if("adminorg" == obj.subGrid){
                    //校验必填项
                    if(!_this.props.form.isCheckNow('adminorg')){
                        warm = _this.state.json['10100ORG-000006'];/* 国际化处理： 行政有必填项未填！*/
                        return true;
                    }
                }
                if("corp" == obj.subGrid){
                    //校验必填项
                    if(!_this.props.form.isCheckNow('corp')){
                        warm = _this.state.json['10100ORG-000007'];/* 国际化处理： 法人公司有必填项未填！*/
                        return true;
                    }
                }
            })

            if(errorarr.length > 0 ){
                //toast({content: '业务单元中法人公司才能维护logo！', color: 'warning'});
                toast({content: warm, color: 'warning'});
                return ;
            }
            let formidarrs = [];
            let deletemdata1 = [];

            let originalorgtypefloor1 = _this.state.originalorgtypefloor;

            originalorgtypefloor1 && originalorgtypefloor1.map((a)=>{
                _this.state.orgtypefloor.find((b)=>{
                       if(a.subGrid == b.subGrid ){
                           a.isshow = false;
                       }
               })
               
           });
           originalorgtypefloor1.map((delobj)=>{
               if(delobj.isshow){
                deletemdata1.push(delobj.subGrid);     
               }
               delobj.isshow = true;
           })
            _this.state.orgtypefloor.map((obj)=>{
                    //只往后台传勾选职能的form
                    //if(obj.isshow){
                        formidarrs.push(obj.subGrid);
                        if("stockorg" == obj.subGrid){
                            formidarrs.push("stocktrafficrelation");
                            formidarrs.push("stockqccenterrelation");
                            formidarrs.push("stockorgrelation");
                            formidarrs.push("stockassetrelation");
                        }
                        if("maintainorg" == obj.subGrid){
                            formidarrs.push("maintainstockrelation");
                        }
                        if("itemorg" == obj.subGrid){
                            formidarrs.push("itemstockrelation");
                        }
                        if("assetorg" == obj.subGrid){
                            formidarrs.push("assetorgmaintainrelation");
                        }
                        if("saleorg" == obj.subGrid){
                            formidarrs.push("saleorgrelation");
                        }
                    //}
                })
                //把表头添加进去
            formidarrs.push('org');
            let formdatas = props.form.getAllFormValue(formidarrs);

            ajax({
                url:'/nccloud/uapbd/org/save.do',
                //data:formdata,
                data:{formdata:formdatas,status:status,deleteorgtype:deletemdata1},
                success:(res)=>{
                    let {success,data} = res;
                    if(success){

                        //保存的时候，如果是根节点行政组织，就设置为非必填项
                        if(_this.state.childstate.adminorg && !getDefData('haveadminrootorgunit',props.config.datasource).haveroot){
                            //如果保存的数据有行政，就把根行政设置为存在
                            setDefData('haveadminrootorgunit',props.config.datasource,{'haveroot':true,
                            'pk':res.data.org.rows[0].values.pk_org.value});
                        }

                        //保存的时候，如果是根节点法人组织，就设置为非必填项
                        if(_this.state.childstate.corp && !getDefData('havecorprootorgunit',props.config.datasource).haveroot){
                            //如果保存的数据有行政，就把根法人设置为存在
                            setDefData('havecorprootorgunit',props.config.datasource,{'haveroot':true,
                            'pk':res.data.org.rows[0].values.pk_org.value});
                        }

                        //保存的时候，如果是根节点组织，就设置为非必填项
                        if(_this.state.childstate.org && !getDefData('haverootorgunit',props.config.datasource).haveroot){
                            //如果保存的数据有行政，就把根设置为存在
                            setDefData('haverootorgunit',props.config.datasource,{'haveroot':true,
                            'pk':res.data.org.rows[0].values.pk_org.value});
                        }

                        props.form.setAllFormValue({['org']:res.data.org});
                       // toast({ color: 'success', content: '保存成功！' });
                        //保存成功说明，根节点肯定就有了
                        //setDefData('orgunit_haverootorgunit',_this.props.config.datasource,{'haveroot':true,'pk':res.data.org.rows[0].values.pk_org.value});
                        //保存完，将这个设置为最新的职能数据
                        _this.setState({
                            originalorgtypefloor:JSON.parse(JSON.stringify(_this.state.orgtypefloor))
                        });
                        //清空职能还有楼层信息
                        props.config.orgtypearr.map((obj)=>{
                            props.form.setFormStatus(obj.subGrid,'edit');
                            //职能楼层还有职能form，和列表态进入新增一样
                            _this.state.childstate[obj.subGrid] = false;
                        
                            props.form.EmptyAllFormValue(obj.subGrid);
                            obj.isshow = false;
                        })
                        
                        //按编码规则设置编码
                        ajax({
                            url:'/nccloud/uapbd/org/getcode.do',
                            data: {pk_org:pk_org,status:'saveadd'}, 
                            success:(res)=>{
                                if(res.success){
                                    if(res.data){
                                        props.form.setFormItemsDisabled('org',{code:!res.data.isCodeEdit});
                                        props.form.setFormItemsValue('org',{'code':{value:res.data.newCode,display:res.data.newCode}});
                                    }
                                }
                            }
                        });

                        setDefData('orgunit_listadd',props.config.datasource,'cardadd');
                        //保存的时候， 都需要把楼层还有勾选的职能数据缓存一遍，以免保存完直接修改然后取消的时候，楼层和职能数据不能还原
                        setDefData('orgunit_childstate',_this.config.datasource,JSON.parse(JSON.stringify(_this.state.childstate)));
                        setDefData('orgunit_orgtypefloor',_this.config.datasource,_this.state.orgtypefloor);
                        _this.props.form.setFormItemsDisabled('org',{'pk_corp':false});//设置表单项不可用
                        _this.props.form.setFormItemsRequired('org',{'pk_corp':false});
                        props.setUrlParam({
                            status: 'add',
                            pagecode:props.config.pagecode,
                            pk_org: res.data.org.rows[0].values.pk_org.value
                        })

                        props.form.setFormItemsDisabled('org',{'pk_fatherorg':false});
                        props.form.setFormItemsRequired('org',{'pk_fatherorg':true});
                        //将原来存在，现在删除的职能form数据清空
                        originalorgtypefloor1.map((delobj)=>{
                            if(delobj.isshow){
                                props.form.EmptyAllFormValue(delobj.subGrid);
                                setDefData('orgunit_orgtypeformdata'+delobj.subGrid,props.config.datasource,undefined);
                            }
                        })
                        //楼层加载数据也要清空
                        _this.setState({orgtypefloor:[]});
                    };
                    
                    buttonToggleShow(props,'saveadd');
                }
            });
            break;
        case 'delete':
            if(props.form.getFormItemsValue('org','pk_org').value == undefined || props.form.getFormItemsValue('org','pk_org').value == null){
                toast({content: _this.state.json['10100ORG-000008'], color: 'warning'});/* 国际化处理： 没有要删除的组织！*/
                return ;
            }
            
            ajax({
                url:'/nccloud/uapbd/org/getcode.do',
                data: {pk_org:pk_org,status:'edit'}, 
                success:(res)=>{
                    if(res.success){     
                        promptBox({
                            color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: _this.state.json['10100ORG-000099'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            content: _this.state.json['10100ORG-000009'],/* 国际化处理： 确认删除？*/
                            beSureBtnClick: () =>{
                                ajax({
                                    url:'/nccloud/uapbd/org/delete.do',
                                    data:{pk_org:[pk_org]},
                                    success:(res)=>{
                                        if(res.success){
                                            //删除完数据之后，应该加载下一条数据
                                            //获取下一个主键值
                                            let nextpk_org = _this.props.cardPagination.getNextCardPaginationId({id:pk_org,status:3});
                                            _this.props.cardPagination.setCardPaginationId({id:pk_org,status:3});
                                            _this.initData(nextpk_org);
                                            
                                            props.config.orgtypearr.map((obj)=>{
                                                props.form.setFormStatus(obj.subGrid,'browse');
                                                props.form.EmptyAllFormValue(obj.subGrid);
                                            })
                                            setDefData('orgunit_carddata_'+pk_org,undefined);
                                            
                                            setDefData('orgunit_pk_org',props.config.datasource,undefined);
                                            setDefData('orgunit_code',props.config.datasource,undefined);
                                            setDefData('orgunit_name',props.config.datasource,undefined);
                                            setDefData('orgunit_shortname',props.config.datasource,undefined);
                                            toast({ color: 'success', title: _this.state.json['10100ORG-000010'] });/* 国际化处理： 删除成功！*/
                                            //编码回收
                                            ajax({
                                                url:'/nccloud/uapbd/org/rollbackcode.do',
                                                data: {
                                                    code:props.form.getFormItemsValue('org','code').value,
                                                    pk_org:pk_org,
                                                    nodetype:_this.config.nodeType
                                                }, 
                                                success:(res)=>{
                                                    if(res.success){        
                                                    }
                                                }
                                            });
                                            
                                            _this.onRefresh(nextpk_org);
                                            //删除完需要把浏览器中保存的pk_org清除掉
                                            props.setUrlParam({
                                                pk_org:nextpk_org,
                                                status:'browse'
                                            })
                                        }
                                    }
                                });
                            }   
                        })
                    }
                }
            });
            
            break;
        case 'disable':
            if(props.form.getFormItemsValue('org','pk_org').value == undefined || props.form.getFormItemsValue('org','pk_org').value == null){
                toast({content: _this.state.json['10100ORG-000011'], color: 'warning'});/* 国际化处理： 没有要停用的组织！*/
                return ;
            }
            ajax({
                url:'/nccloud/uapbd/org/getcode.do',
                data: {pk_org:pk_org,status:'edit'}, 
                success:(res)=>{
                    if(res.success){     
                        promptBox({
                            color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: _this.state.json['10100ORG-000103'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            content: _this.state.json['10100ORG-000034'],/* 国际化处理： 确认停用该组织？*/
                            beSureBtnClick: () =>{
                                ajax({
                                    url:'/nccloud/uapbd/org/disable.do',
                                    data:{pk_org:[pk_org]},
                                    success:(res)=>{
                                        if(res.success){
                                            props.config.orgtypearr.map((obj)=>{
                                                props.form.setFormStatus(obj.subGrid,'browse');
                                            })
                                           // setDefData('orgunit_carddata_'+pk_org,undefined);
                                            //_this.onRefresh();
                                            //更新表头ts和停启用状态
                                            dealdefaultdata(res.data,props,_this.state.json['10100ORG-000013'],3,false,pk_org);/* 国际化处理： 已停用*/
                                            toast({ color: 'success', title: _this.state.json['10100ORG-000014'] });/* 国际化处理： 停用成功！*/
                                            toggleShow(props,'3');
                                        }
                                    }
                                });
                            }   
                        })
                    }
                }
            });
            
            break;
        case 'enable':

            if(props.form.getFormItemsValue('org','pk_org').value == undefined || props.form.getFormItemsValue('org','pk_org').value == null){
                toast({content: _this.state.json['10100ORG-000015'], color: 'warning'});/* 国际化处理： 没有要启用的组织！*/
                return ;
            }
            ajax({
                url:'/nccloud/uapbd/org/getcode.do',
                data: {pk_org:pk_org,status:'edit'}, 
                success:(res)=>{
                    if(res.success){     
                        promptBox({
                            color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                            title: _this.state.json['10100ORG-000102'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                            noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                            content: _this.state.json['10100ORG-000102'],/* 国际化处理： 确认启用该组织？*/
                            beSureBtnClick: () =>{
                                ajax({
                                    url:'/nccloud/uapbd/org/enable.do',
                                    data:{pk_org:[pk_org]},
                                    success:(res)=>{
                                        if(res.success){
                                            props.config.orgtypearr.map((obj)=>{
                                                props.form.setFormStatus(obj.subGrid,'browse');
                                            })
                                            //setDefData('orgunit_carddata_'+pk_org,undefined);
                                            //更新表头ts和停启用状态
                                            dealdefaultdata(res.data,props,_this.state.json['10100ORG-000017'],2,false,pk_org);/* 国际化处理： 已启用*/
                                            //_this.onRefresh();
                                            toast({ color: 'success', title: _this.state.json['10100ORG-000018'] });/* 国际化处理： 启用成功！*/
                                            toggleShow(props,'2');
                                        }
                                    }
                                });
                            }   
                        })
                    }
                }
            });
            
            break;
        case 'refresh':
            //props.onRefresh();
            //刷新按钮，不走缓存，直接查询数据库
            setDefData('orgunit_btnopr',props.config.datasource,'refresh');
            setDefData('orgunit_needquerydata_'+pk_org,_this.props.config.datasource,true);
            _this.initData(pk_org);
            _this.onRefresh();
           // toast({content:'刷新成功',color:'success'});
            break;
        case 'version':
            //版本化
           props.modal.show('org_v',{title:this.state.json['10100ORG-000056']});
           //查询版本信息还有新版本号
           let reqData = [
            {
                rqUrl: '/uapbd/org/queryversionvno.do',
                rqJson: `{\n  \"pk_org\": \"${pk_org}\"\n}`,
                rqCode: 'versionvno'
            },
            {
                rqUrl: '/uapbd/org/queryversionvo.do',
                rqJson: `{\n  \"pk_org\": \"${pk_org}\"\n}`,
                rqCode: 'versionvos'
            }
            ];
            ajax({
                url :'/nccloud/platform/pub/mergerequest.do',
                data : reqData,
                success : (res) => {
                    if(res.success){
                        //给table赋值versionvo
                        props.table.setAllTableData('org_v',res.data.versionvos['org_v']);
                        //给form赋值versioncode
                        props.form.setAllFormValue({['org_v_head']:res.data.versionvno['org_v_head']});
                    // props.form.setFormItemsValue('org_v_head',{vno:{value:res.data['versionvno'],display:res.data['versionvno']}});
                    //  props.form.setFormItemsValue('org_v_head',{pk_org:{value:pk_org,display:pk_org}});
                    }
                }
            });
           props.form.setFormStatus('org_v_head','edit');
           break;
        case 'financeorgversion':
            
            ajax({
                url :'/nccloud/uapbd/org/queryfinanceversion.do',
                data:{type:'1'},
                success : (res) => {
                    if(res.success){
                    
                        if(res.data){
                            props.modal.show('financeorg_v',{title:_this.state.json['10100ORG-000019']});/* 国际化处理： 财务组织版本化*/
                            props.form.EmptyAllFormValue('financeorg_v');
                            props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                        }
                        setDefData('orgunit_versiontype',props.config.datasource,'1');
                        setDefData('orgunit_modalid',props.config.datasource,'financeorg_v');
                        //cacheTools.set('orgunit_versiontype','1');
                        //cacheTools.set('orgunit_modalid','financeorg_v');
                        props.form.setFormStatus('financeorg_v','edit');
                    }
                }
            });
            
            break;

        case 'adminorgversion':
            
            ajax({
                url :'/nccloud/uapbd/org/queryfinanceversion.do',
                data:{type:'4'},
                success : (res) => {
                    if(res.success){
                        if(res.data){
                            props.modal.show('financeorg_v',{title:_this.state.json['10100ORG-000020']});/* 国际化处理： 行政组织体系版本化*/
                            props.form.EmptyAllFormValue('financeorg_v');
                            props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                        }
                        setDefData('orgunit_versiontype',props.config.datasource,'4');
                        setDefData('orgunit_modalid',props.config.datasource,'financeorg_v');
                        //cacheTools.set('orgunit_versiontype','4');
                       // cacheTools.set('orgunit_modalid','financeorg_v');
                        props.form.setFormStatus('financeorg_v','edit');
                    }
                }
            });
            
            break;

        case 'liabilitycenterversion':
            // props.modal.show('financeorg_v',{title:'利润中心体系版本化'});
            // props.form.EmptyAllFormValue('financeorg_v');
            ajax({
                url :'/nccloud/uapbd/org/queryfinanceversion.do',
                data:{type:'2'},
                success : (res) => {
                    if(res.success){
                        
                        if(res.data){
                            if('error' == res.data['financeorg_v'].rows[0].values.vname.value){
                                promptBox({
                                    color:'warning',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                    title: _this.state.json['10100ORG-000001'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                                    noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                                    content: _this.state.json['10100ORG-000021'],/* 国际化处理： 该集团下还未创建利润中心,确定要进行利润中心体系的版本化操作吗？*/
                                    beSureBtnClick: () =>{
                                        props.modal.show('financeorg_v',{title:_this.state.json['10100ORG-000022']});/* 国际化处理： 利润中心体系版本化*/
                                        props.form.EmptyAllFormValue('financeorg_v');
                                        props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                                        props.form.setFormItemsValue('financeorg_v',{'vname':{value:null,display:null}})
                                    }   
                                })
                                // props.modal.show('confirm',{
                                //     title:'提示',
                                //     content: "该集团下还未创建利润中心,确定要进行利润中心体系的版本化操作吗？",
                                //     userControl:false,//自己控制什么时候关闭窗口
                                //     beSureBtnClick:()=>{
                                //     props.modal.show('financeorg_v',{title:'利润中心体系版本化'});
                                //     props.form.EmptyAllFormValue('financeorg_v');
                                //     props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                                //     props.form.setFormItemsValue('financeorg_v',{'vname':{value:null,display:null}})
                                //    }
                                // });
                            }else{
                                props.modal.show('financeorg_v',{title:_this.state.json['10100ORG-000022']});/* 国际化处理： 利润中心体系版本化*/
                                props.form.EmptyAllFormValue('financeorg_v');
                                props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                            }
                            setDefData('orgunit_versiontype',props.config.datasource,'2');
                            setDefData('orgunit_modalid',props.config.datasource,'financeorg_v');
                            props.form.setFormStatus('financeorg_v','edit');
                            
                        }
                    }
                }
            });
            
            break;

        case 'hrorgversion':
            
            ajax({
                url :'/nccloud/uapbd/org/queryfinanceversion.do',
                data:{type:'3'},
                success : (res) => {
                    if(res.success){
                        if(res.data){
                            props.modal.show('financeorg_v',{title:_this.state.json['10100ORG-000023']});/* 国际化处理： 人力资源组织体系版本化*/
                            props.form.EmptyAllFormValue('financeorg_v');
                            props.form.setAllFormValue({['financeorg_v']:res.data['financeorg_v']});
                        }
                    }
                }
            });
            setDefData('orgunit_versiontype',props.config.datasource,'3');
            setDefData('orgunit_modalid',props.config.datasource,'financeorg_v');
            props.form.setFormStatus('financeorg_v','edit');
            break;

        case 'orgmanager':
        //组织主管
            
            ajax({
                url :'/nccloud/uapbd/org/orgmanagerquery.do',
                data:{pk_org:pk_org},
                success : (res) => {
                    if(res.success){
                        props.modal.show('orgmanager',{title:this.state.json['10100ORG-000057']});
                        if(res.data){
                            props.editTable.setTableData('orgmanager',res.data.orgmanager);
                        }else{
                            props.editTable.setTableData('orgmanager',{rows: []});
                        }
                        props.button.setButtonDisabled(['orgmanagedel'],true);
                        props.button.setButtonVisible(['orgmanagesave','orgmanagecancel'],false);
                        props.button.setButtonVisible(['orgmanageadd','orgmanageedit','orgmanagerefresh','orgmanagedel'],true);
                    }
                }
            });
            
            break;

        case 'attachconfig':
            //附件管理
            _this.setState({
                showUploader: true,
            })

                break;
        case 'logomanage':
                //logo管理
                if(!_this.state.childstate.corp){
                    toast({content: _this.state.json['10100ORG-000024'], color: 'warning'});/* 国际化处理： 业务单元中法人公司才能维护logo！*/
                    return;
                }
                _this.setState({
                    showlogoUploader: true,
                })
            break;

        case 'orgmoduleperiod':
            //业务期初期间
            //业务单元需具有以下四种职能之一：财务、资金、库存、资产，且已经启用时，才可以执行业务期初期间操作.
                ajax({
                    url :'/nccloud/uapbd/org/orgmoduleperiod.do',
                    data:{pk_org: pk_org},
                    success : (res) => {
                        if(res.success){
                            
                            if(res.data){
                                props.modal.show('orgmoduleperiod');
                                props.editTable.setTableData('orgmoduleperiod',res.data.orgmoduleperiod);
                            }else{
                                props.editTable.setTableData('orgmoduleperiod',{rows: []});
                            }
                            props.editTable.setStatus('orgmoduleperiod','edit');
                        }
                    }
                });
            
                 break;

            case 'createinnercustsupp':
                //生成内部客商
                //内部客商必须要把国家地区维护
                props.form.setItemsVisible('innercustsupp',{'code':true,'custname':true,'custshortname':true});
                if(!props.form.getFormItemsValue('org','countryzone').value){
                    toast({content: _this.state.json['10100ORG-000025'], color: 'warning'});/* 国际化处理： 请先维护该组织的国家地区属性！*/
                    return;
                }
                ajax({
                    url :'/nccloud/uapbd/org/checkinnercustsupp.do',
                    data:{pk_org: pk_orgarr},
                    success : (res) => {
                        if(res.success){
                            
                            if(res.data.exists){
                                toast({content : res.data.existscontent,color : 'warning'});
                                return ;
                            }else{
                                props.modal.show('innercustsupp');
                                props.form.setFormStatus('innercustsupp','edit');
                                props.form.EmptyAllFormValue('innercustsupp');
                                
                                props.form.setFormItemsValue('innercustsupp',{code:{value:getDefData('orgunit_code', props.config.datasource),display:getDefData('orgunit_code', props.config.datasource)}});
                                
                                props.form.setFormItemsValue('innercustsupp',{custname:{value:getDefData('orgunit_name', props.config.datasource),display:getDefData('orgunit_name', props.config.datasource)}});
                                props.form.setFormItemsValue('innercustsupp',{custshortname:{value:getDefData('orgunit_shortname', props.config.datasource),display:getDefData('orgunit_shortname', props.config.datasource)}});
                            }
                        }
                    }
                });
            break;

        case'editVAT':
        //维护vat
            if(!_this.state.childstate.financeorg){
                toast({content: _this.state.json['10100ORG-000026'], color: 'warning'});/* 国际化处理： 业务单元中财务才能维护VAT！*/
                return;
            }
            ajax({
                url :'/nccloud/uapbd/org/vatquery.do',
                data:{pk_org: pk_org},
                success : (res) => {
                    if(res.success){
                        
                        props.modal.show('orgvatfunclet');
                        if(res.data){
                            props.editTable.setTableData('orgvatfunclet',res.data.orgvatfunclet);
                        }else{
                            props.editTable.setTableData('orgvatfunclet',{rows: []});
                        }
                        props.button.setButtonDisabled(['vatdel'],true);
                        props.editTable.setStatus('orgvatfunclet','browse');
                        props.button.setButtonVisible(['vatadd','vatdel','vatedit','vatrefresh'],true);
                        props.button.setButtonVisible(['vatsave','vatcancel','vatlinedel'],false);
                    }
                }
            });
            break;

        case'orgunitreldept':
        //业务单元关联部门
            
            ajax({
                url :'/nccloud/uapbd/org/querytreenode.do',
                data:{pk_org: pk_org},
                success : (res) => {
                    if(res.success){
                        
                        props.modal.show('orgdept');
                        //转换树的父子关系
                        //let treeData = dealTreeData(res.data);
                        props.syncTree.setSyncTreeData('orgunittree', res.data);
                        //设置默认中第一行
                        props.syncTree.setNodeSelected('orgunittree', pk_org);
                        _this.onSelectEve( pk_org,null,true);
                        // if(res.data[0].refpk!=='root'){
                        //     props.onSelectEve( res.data[0].refpk,null,true);
                        // }
                    }else{
                        alert(res.message);
                    }
                }
            });
            break;
        case'copy':
            setDefData('orgunit_btnopr',props.config.datasource,'copy');
            //cacheTools.set('orgunit_btnopr','copy');
            props.setUrlParam({
                status: 'copy',
                pagecode:props.config.pagecode,
                pk_org: pk_org
            })

            //_this.getdata(pk_org);
            //清除表头先关信息
            props.form.setFormItemsValue('org',{'pk_org':{value:null,display:null}});
            props.form.setFormItemsValue('org',{'innercode':{value:null,display:null}});
            props.form.setFormItemsValue('org',{'code':{value:null,display:null}});
            props.form.setFormItemsValue('org',{'name':{value:null,display:null},'name2':{value:null,display:null},'name3':{value:null,display:null}});
            props.form.setFormItemsValue('org',{'shortname':{value:null,display:null},'shortname2':{value:null,display:null},'shortname3':{value:null,display:null}});
            
            //清空职能信息
            //_this.state.orgtypefloor
            //复制的时候，法人的上级公司不清空
            let corpfaterorg  = props.form.getFormItemsValue('corp','pk_fatherorg');
            //清空所有form数据
            _this.props.config.orgtypearr.map((obj)=>{
            //不显示停启用按钮，编辑态
            _this.toggleButtonShow (props,2,obj.subGrid);
            if('org' != obj.subGrid){
                props.form.setFormStatus(obj.subGrid,'edit');
                props.form.EmptyAllFormValue(obj.subGrid);
            }
            })
            if(_this.state.childstate.corp){
                //复制的时候，法人的上级公司不清空
                props.form.setFormItemsValue('corp',{'pk_fatherorg':{value:corpfaterorg.value,display:corpfaterorg.display}});
            }
            
            //如果上级组织为空，说明为根节点，n那么修改的时候需要把上级组织设置为非必填 pk_fatherorg.display == undefined || pk_fatherorg.display == ''

            // pk_fatherorgitem = meta1['org'].items.find((item) => item.attrcode == 'pk_fatherorg');
            // pk_fatherorgitem.required = true;
            // pk_fatherorgitem.disabled = false;
            // props.meta.setMeta(meta1);

            props.form.setFormItemsDisabled('org',{'pk_fatherorg':false});
            props.form.setFormItemsRequired('org',{'pk_fatherorg':true});

            props.form.setFormStatus('org','edit');
            buttonToggleShow(props,'add');
            //自动生成编码
            ajax({
                url:'/nccloud/uapbd/org/getcode.do',
                data: {pk_org:pk_org,status:status}, 
                success:(res)=>{
                    if(res.success){     
                        if(res.data){
                            props.form.setFormItemsDisabled('org',{code:!res.data.isCodeEdit});
                            props.form.setFormItemsValue('org',{'code':{value:res.data.newCode,display:res.data.newCode}});
                        }
                    }
                }
            });
            _this.dealrelationformstatus();
            _this.setState({
                showSubGrid:false
            })
            break;


        case 'print':
            let pks = getDefData('orgunit_allpkorg', props.config.datasource);//cacheTools.get('orgunit_allpkorg');
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                '/nccloud/uapbd/org/print.do', 
                {
                    //billtype:'',  //单据类型
                    funcode: props.config.appcode,      //功能节点编码，即模板编码
                    nodekey:'cardPrint',     //模板节点标识
                    oids: [pk_org]    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                },false
            );
            break;
        case 'export':
            let pks1 = getDefData('orgunit_allpkorg', props.config.datasource);//cacheTools.get('orgunit_allpkorg');
            _this.setState({
                pks: pks1
             },_this.refs.printOutput.open());
            // print(
            //     'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
            //     '/nccloud/uapbd/org/print.do', 
            //     {
            //         //billtype:'',  //单据类型
            //         funcode: props.config.appcode,      //功能节点编码，即模板编码
            //         //nodekey:'',     //模板节点标识
            //         nodekey:'cardPrint', 
            //         outputType:'output',
            //         oids: [pk_org]    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
            //     }
            // );
            break;

        case'setorgroot':
            promptBox({
                color:'info',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: _this.state.json['10100ORG-000027'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 提示*/
                noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                content: _this.state.json['10100ORG-000028'],/* 国际化处理： 您确定要设置成根业务单元吗？*/
                beSureBtnClick: () =>{
                    _this.onSetUnitOrgRoot();
                }   
            })
            //props.modal.show('setorgroot');
            break;

        case'setcorproot':
            promptBox({
                color:'info',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: _this.state.json['10100ORG-000027'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 提示*/
                noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                content: _this.state.json['10100ORG-000029'],/* 国际化处理： 您确定要设置成根公司吗？*/
                beSureBtnClick: () =>{
                    _this.onSetCorpRoot();
                }   
            })
            //props.modal.show('setcorproot');
            break;

        case'setadminorgroot':
            promptBox({
                color:'info',// 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: _this.state.json['10100ORG-000027'],// 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 提示*/
                noFooter: false,// 是否显示底部按钮(确定、取消),默认显示(false),非必输
                content: _this.state.json['10100ORG-000030'],/* 国际化处理： 您确定要设置成根行政组织吗？*/
                beSureBtnClick: () =>{
                    _this.onSetAdminOrgRoot();
                }   
            })
            //props.modal.show('setadminorgroot');
            break;
        default:
            break;
    }
}

    //切换页面状态--设置按钮显示和业务状态
function  toggleShow (props,enablestate){
        if(enablestate =='2'){//启用状态
            props.button.setButtonsVisible({
                disable:true,
                enable:false,
            });
        }else{
            props.button.setButtonsVisible({
                disable:false,
                enable:true,
            });
        }
    }



    function buttonToggleShow(props,status){
        //let status = props.getUrlParam('status');
        //按钮的显示状态
        if(status == 'add' || status == 'saveadd'){
            props.button.setButtonVisible(['save','saveadd','cancel'],true);
            props.button.setButtonVisible(['edit','delete','copy','enable','disable','add','more','refresh'],false);
            props.button.setButtonVisible(['versions','auxiliary','orgunitreldept','printpage','setroot','back'],false);
        }else if(status =='edit'){
            props.button.setButtonVisible(['save','cancel'],true);
            props.button.setButtonVisible(['edit','delete','copy','enable','disable','add','saveadd','more','refresh'],false);
            props.button.setButtonVisible(['versions','auxiliary','orgunitreldept','printpage','setroot','back'],false);
        }else{
            //设置根节点按钮，只有集团管理员登录才可以看见
            let setroot = getDefData('orgunit_setroot', props.config.datasource);//cacheTools.get('orgunit_setroot');
            props.button.setButtonVisible(['setroot-2'],setroot);
            props.button.setButtonVisible(['save','saveadd','cancel','back'],false);
            props.button.setButtonVisible(['edit','delete','copy','enable','disable','add','more','refresh'],true);
            props.button.setButtonVisible(['versions','auxiliary','orgunitreldept','printpage'],true);
        }
    }


     /**
     * 处理树数据
     * @param data
     * @returns {*}
     */
function dealTreeData(data){
    let deleteDataChildrenProp = function(node){
        node.iconBox = {
            delIcon:false,
            editIcon:false,
            addIcon:false
        }
        if(!node.children || node.children.length == 0) {
            delete node.children;
        }
        else{
            node.isLeaf = false;
            node.children.forEach( (e) => {
                deleteDataChildrenProp(e);
            } );
        }
    };
    data.forEach( (e) => {
        e.iconBox = {
            delIcon:false,
            editIcon:false,
            addIcon:false
        }
        deleteDataChildrenProp(e);
    });
    return data;
}

/**
     * 停启用等修改数据后，表头ts和停启用字段更新
     * @param data
     * @returns {*}
     */
    function dealdefaultdata(data,props,display,value,onlyupdatets,pk_org){
        //停启用之后不用刷新所有数据，只需要把停启用状态修改就可以了
        if(onlyupdatets){
            props.form.setFormItemsValue('org',{'ts':{value:data[pk_org],display:null}});
        }else{
            props.form.setFormItemsValue('org',{'ts':{value:data[pk_org],display:null},
                'enablestate':{value:value,display:display}});
        }
        
        //如果有缓存数据，也需要把缓存的数据修改
        let enablecarddata = getDefData('orgunit_carddata_'+pk_org,props.config.datasource);
        if(enablecarddata){
            enablecarddata.find((item) => {
                if(item.hasOwnProperty('org')){
                    if(onlyupdatets){
                        item.org.rows[0].values.ts.value = data[pk_org];
                    }else{
                        item.org.rows[0].values.enablestate.display = display;
                        item.org.rows[0].values.enablestate.value = value;
                        item.org.rows[0].values.ts.value = data[pk_org];
                    }
                }
            });
            //修改完数据之后，需要更新缓存数据
            setDefData('orgunit_carddata_'+pk_org,props.config.datasource,enablecarddata);
        }
    }



//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS