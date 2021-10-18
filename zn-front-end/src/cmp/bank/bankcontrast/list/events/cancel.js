/*DZeCFzjhPz/PRV4fBKEyvqT/oxr39TZrFudhXLDQfqhxDy+62BrK0tBsUfJC3i4S*/
import { base } from 'nc-lightapp-front';
import moment from 'moment';
const { NCDatePicker, NCRadio, NCFormControl,NCDiv } = base;
const format = "YYYY-MM-DD";

export const cancelContrastData= {
    contrastVo:{
        m_pk_contrastaccount: null,
        m_contrastdate: moment().format(format),
        batchnumber: null,
    },
    glContrastVo:{
        m_pk_contrastaccount: null,
        m_pk_corp: null
    },
    flag: '0'
};

// 取消勾对内容
export function cancelContrastContent () {
    let { cancelContrast }= this.state;
    return (
        <div className="cancel-content">
            <NCDiv fieldid="cancel" areaCode={NCDiv.config.List}>
            <NCRadio.NCRadioGroup
                name="cancelcontrast"
                selectedValue={cancelContrast.flag}
                onChange={e => {
                    cancelContrast.flag= e;
                    if (['0', '1'].includes(e)) {
                        cancelContrast.contrastVo.batchnumber= null;
                    } else {
                        cancelContrast.contrastVo.m_contrastdate= null;
                    }
                    this.setState({cancelContrast});
                }}>
                <ul>
                    <li>
                    <NCDiv fieldid={this.lang('0071')} areaCode={NCDiv.config.ListItem}>
                        <NCRadio 
                            value="0"
                        >{this.lang('0071')}</NCRadio> 
                        <NCDatePicker
                            fieldid="checkdate"
                            format={format}
                            disabled={cancelContrast.flag!== '0'}
                            value={cancelContrast.flag=== '0' ? cancelContrast.contrastVo.m_contrastdate : null}
                            onChange={onChange.bind(this, 'cancelContrast', 'm_contrastdate')}
                        />
                    </NCDiv>
                    </li>
                    <li>
                    <NCDiv fieldid={this.lang('0072')} areaCode={NCDiv.config.ListItem}>
                        <NCRadio 
                            value="1"
                        >{this.lang('0072')}</NCRadio>  
                        <NCDatePicker
                            fieldid="businessdate"
                            format={format}
                            disabled={cancelContrast.flag!== '1'}
                            value={cancelContrast.flag=== '1' ? cancelContrast.contrastVo.m_contrastdate : null}
                            onChange={onChange.bind(this, 'cancelContrast', 'm_contrastdate')}
                        />
                        </NCDiv>
                    </li>
                    <li>
                    <NCDiv fieldid={this.lang('0073')} areaCode={NCDiv.config.ListItem}>
                        <NCRadio 
                            value="2"
                        >{this.lang('0073')}</NCRadio>
                        <NCFormControl
                            fieldid="businessdate"
                            disabled={cancelContrast.flag!== '2'}
                            value={cancelContrast.contrastVo.batchnumber || ''}
                            onChange={onChange.bind(this, 'cancelContrast', 'batchnumber')}
                        />
                        </NCDiv>
                    </li>
                </ul>
            </NCRadio.NCRadioGroup>
            </NCDiv>
        </div>
    );
}

function onChange (obj, name, val) {
    let { cancelContrast }= this.state;
    switch (obj) {
        case 'cancelContrast':
            cancelContrast['contrastVo'][name]= val;
            this.setState({cancelContrast});
    }
}
/*DZeCFzjhPz/PRV4fBKEyvqT/oxr39TZrFudhXLDQfqhxDy+62BrK0tBsUfJC3i4S*/