/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/
import { constant } from '../../config/config'

export default function onrowDoubleclick(record, index, props, e)  {
    this.props.pushTo(constant.cardpath, {
        status: 'browse',
		id: record.pk_accountagiotage.value
    });
}
/*FQlJAOCgUwSCenFUN6ZaBa2cq3b3zM39TnebVaIjYGaEyLYQmc7WVIuoiaR7dsbJ*/