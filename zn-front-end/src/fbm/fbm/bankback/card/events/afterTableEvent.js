/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/
import { cardEvent } from "../../../../public/container/index";
export function afterTableEvent(
  props,
  moduleId,
  key,
  value,
  changedrows,
  index,
  record,
  type,
  method
) {
  console.log(moduleId, key, value, changedrows, index);
  const eventData = this.props.createTabsBodyAfterEventData(
    this.pageId,
    this.formId,
    this.tabOrder,
    moduleId,
    key,
    changedrows
  );
  if (key === "pk_register") {
    cardEvent.setBodyAfterEventData.call(this, eventData).then(res => {
      props.form.setAllFormValue({
        [this.formId]: res.data.head && res.data.head[this.formId]
      });
    });
  }
}

/*yrJb1LOfoOHhNP+PrTGyMqZpgZmnynsgWCkGKc63hvhma3L4t2oi9DLO0dpsa9PU*/