/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/
import { ajax } from 'nc-lightapp-front';
import { accCard, baseReqUrl, javaUrl } from '../../cons/constant';

export function afterEvent(props, moduleId, key, value, oldvalue, index, record) {
	if (key === 'pk_bankdoc') {
		let eventData = this.props.createHeadAfterEventData(
			this.pageId,
			accCard.headCode,
			accCard.tableCode,
			moduleId,
			key,
			value
		);
		ajax({
			url: `${baseReqUrl}${javaUrl.accAfterEvent}.do`,
			async: false,
			data: eventData,
			success: (res) => {
				const incidentaObj = res.data.head.head.rows[0].values;
				let incidentalData = {
					combineaccnum: incidentaObj.combineaccnum,
					combineaccname: incidentaObj.combineaccname,
					combinenum: incidentaObj.combinenum,
					orgnumber: incidentaObj.orgnumber,
					bankarea: incidentaObj.bankarea,
					province: incidentaObj.province,
					city: incidentaObj.city,
					customernumber: incidentaObj.customernumber
				};
				//console.log(incidentalData);
				this.props.form.setFormItemsValue(accCard.headCode, incidentalData);
			}
		});
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/