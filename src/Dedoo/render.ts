import { isProperty } from "./utils";

function render(element: DedooElement, container: Element | DocumentFragment | null) {
  // * create dom nodes
  // 创建元素
  // 判断类型。文本直接
  const dom = 
    element.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(element.type as keyof HTMLElementTagNameMap);
  
  // 设置属性
  // 过滤children
  element.props && Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props?.[name];
    })

  // 子元素递归渲染
  element.props?.children.forEach(child => {
    render(child, dom as HTMLElement);
  })
  container?.appendChild(dom);
}

export default render;
