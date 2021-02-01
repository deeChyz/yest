class TagManagerHelper {
  setDataLayer () {
    window.dataLayer = window.dataLayer || [];
  }

  // TODO::check method params typing
  createProductInstance (
    id,
    name = 'product',
    price = '1',
    brand = '',
    category = '',
    quantity = 1
  ) {
    return {
      id, name, price, brand, category, quantity
    };
  }

  getModifyEntity (method, listName, entity) {
    return {
      [method]: {
        [listName]: [
          entity
        ]
      }
    };
  }

  modifyDataLayerObject (
    modifyingEntityObjectName,
    modifyingEntity,
    eventName,
    eventCategory,
    eventAction,
    eventNonInteractive
  ) {
    this.setDataLayer();
    window.dataLayer.push({
      [ modifyingEntityObjectName ]: modifyingEntity,
      'event': eventName,
      'gtm-ee-event-category': eventCategory,
      'gtm-ee-event-action': eventAction,
      'gtm-ee-event-non-interaction': eventNonInteractive
    });
  }

  modifyEcommerceObject (
    entity,
    method,
    listName,
    eventAction,
    eventNonInteractive,
    eventName = 'gtm-ee-event',
    eventCategory = 'Enhanced Ecommerce'
  ) {
    this.modifyDataLayerObject(
      'ecommerce',
      this.getModifyEntity(method, listName, entity),
      eventName,
      eventCategory,
      eventAction,
      eventNonInteractive
    );
  }
}

export default new TagManagerHelper();
