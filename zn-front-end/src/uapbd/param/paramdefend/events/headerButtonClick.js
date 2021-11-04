//q/BnXiNAKNv5ujGVOAfUTkdHWpVXd3hv81rIszrLtz+DUJkWrdpIOcYXlxYCFADd
import { ajax, toast , promptBox} from 'nc-lightapp-front';

function refreshpagestatus(_this, status) {
    _this.initPageStatus(status);
    _this.props.syncTree.setNodeDisable('paramdeftree', !status);
}
export default function (props, id) {
    let _this = this;
    switch (id) {
        case 'assignment':
            debugger
            if (!(_this.state.foolRole && _this.state.foolRole.value)) {
                toast({ content: _this.state.json['10120PARA-000000'], color: 'warning' });/* 国际化处理： 角色不能为空*/
                return;
            }
            if (!(_this.state.foolOrg && _this.state.foolOrg.value)) {
                toast({ content: _this.state.json['10120PARA-000001'], color: 'warning' });/* 国际化处理： 组织单元不能为空*/
                return;
            }
            refreshpagestatus(_this, false);
          
            // props.syncTree.disabledSearch(true);
            _this.setState({disTreeSearch: true})
            break;
        case 'refresh':
            // _this.loadTableData(_this.props.syncTree.getSelectNode('paramdeftree'), _this.state.foolOrg.value, _this.state.foolRole.value);
            _this.loadTree('refresh');
            break;
        case 'cancel':

           promptBox({
                        color: 'warning',
                        content:_this.state.json['10120PARA-000020'],
                        beSureBtnClick: () => {
                        _this.loadTableData(_this.props.syncTree.getSelectNode('paramdeftree'), _this.state.foolOrg.value, _this.state.foolRole.value);
                        refreshpagestatus(_this, true);
                        _this.setState({disTreeSearch: false});
                        }
                      });
            break;
        case 'sell':
            selectRows(_this, true);
            break;
        case 'canll':
            selectRows(_this, false);
            break;
        case 'save':
            let rows = _this.props.editTable.getAllRows('paramdef');
            console.log('rows', rows);
            let pk_sysinits = [];
            if (rows && rows.length > 0) {
                for (let index = 0; index < rows.length; index++) {
                    if (!rows[index].values.isCheck.value) {
                        pk_sysinits.push(rows[index].values.pk_sysinit.value);
                    }
                }
            }
            let selecteditem = _this.props.syncTree.getSelectNode('paramdeftree');
            if (!selecteditem) {
                return;
            }
            ajax({
                loading: true,
                url: '/nccloud/uapbd/paramdefend/save.do',
                data: {
                    pk_org: _this.state.foolOrg.value,
                    pk_role: _this.state.foolRole.value,
                    pk_sysinits: pk_sysinits,
                    selectNode: selecteditem.nodeData
                },
                success: (res) => {
                    if (res && res.success) {
                        toast({ color: 'success', content: _this.state.json['10120PARA-000019'] });
                        refreshpagestatus(_this, true);
                    }
                }
            })
            break;
    }

}


function selectRows(_this, sell) {
    let length = _this.props.editTable.getAllRows('paramdef').length;
    if (length > 0) {
        for (let index = 0; index < length; index++) {
            _this.props.editTable.setValByKeyAndIndex('paramdef', index, 'isCheck', { value: sell });
        }
    }
}

//q/BnXiNAKNv5ujGVOAfUTkdHWpVXd3hv81rIszrLtz+DUJkWrdpIOcYXlxYCFADd