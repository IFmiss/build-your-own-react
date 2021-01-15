function createElement(
  type: DedooElementType,
  props: object,
  ...children
): DedooElement {
  return {
    type,
    props: {
      ...props,
      children: children?.map(
        child =>
          typeof child === 'object'
            ? child
            : createTextElement(child)
      )
    },
  }
}

function createTextElement(child: string): DedooElement {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: child,
      children: []
    }
  };
}