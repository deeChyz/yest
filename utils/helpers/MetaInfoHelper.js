class MetaInfoHelper {
  get defaultTitle () {
    return 'Yest.by';
  }

  get defaultDescriptionText () {
    return '';
  }

  get defaultKeywordsText () {
    return '';
  }

  createHeadWithMetaObject (title = '', descriptionContent = '', keywordsContent = '') {
    let headWithMetaObject = { title: '', meta: [] };

    if (title) headWithMetaObject = Object.assign(headWithMetaObject, { title });

    if (descriptionContent) {
      headWithMetaObject.meta.push({
        hid: 'description',
        name: 'description',
        content: descriptionContent
      });
    }

    if (keywordsContent) {
      headWithMetaObject.meta.push({
        hid: 'keywords',
        name: 'keywords',
        content: keywordsContent
      });
    }

    return headWithMetaObject;
  }

  createJsonldObject (context, type, itemListElement) {
    return {
      '@context': context,
      '@type': type,
      itemListElement,
    };
  }

  getDefaultHeadWithMetaObject () {
    return this.createHeadWithMetaObject(
      this.defaultTitle,
      this.defaultDescriptionText,
      this.defaultKeywordsText
    );
  }
}

export default new MetaInfoHelper();
