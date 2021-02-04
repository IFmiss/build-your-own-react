import { isProperty } from "./utils";
import {
  setNextUnitOfWork,
} from './concurrent';
import { setWipRoot } from "./commit";
import { getCurrentRoot, setDeletions } from "./reconciliation";

export function createDom(fiber: DedooFiber) {
  // * create dom nodes
  // 创建元素
  // 判断类型。文本直接
  const dom = 
    fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type as keyof HTMLElementTagNameMap);
  
  // 设置属性
  // 过滤children
  if (fiber.props) {
    console.info('Object.keys(fiber.props)', Object.keys(fiber.props).filter(isProperty))
  }
  fiber.props && Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props?.[name];
    })
  
  return dom;
}


function render(element: DedooElement, container: Element | DocumentFragment | null) {
  // TODO set next unit of work
  // 我们将创建DOM节点的部分保留在其自身的功能中，稍后将使用它
  // ! 我们将跟踪纤维树的根。我们称其为进行中的工作根或wipRoot
  let wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    // 我们还将替代属性添加到每根光纤。
    // ! 该属性是旧光纤的链接，旧光纤是我们在上一个提交阶段提交给DOM的光纤。
    alternate: getCurrentRoot()
  }
  setDeletions([]);
  setWipRoot(wipRoot);
  setNextUnitOfWork(wipRoot);
};

export default render;
