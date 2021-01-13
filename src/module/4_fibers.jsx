import React from 'react'
import ReactDOM from 'react-dom'

// const element = (
//   <div id="foo">
//     <a>bar</a>
//     <b />
//   </div>
// )

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => 
        typeof child === 'object'
          ? child
          : createTextElement(child)
      )
    }
  }
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

const isProperty = key => key !== "children"

function createDom (fiber) {
  // console.info(ele, container)
  const dom = fiber.type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(fiber.type)
  
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => dom[name] = fiber.props[name]);
  console.info('dom', dom);
  return dom;
}

function render(element, container) {
  // TODO set next unit of work
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  }

}

// 是否有后续的任务
let nextUnitOfWork = null;

function workLoop (deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
};

requestIdleCallback(workLoop)

function performUnitOfWork (fiber) {
  // todo
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  // create new fiber
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      // 同级
      prevSibling.sibling = newFiber;
    }
    
    // 设置前一个 同级别的 fiber 对象，用于串联 fiber 关系
    prevSibling = newFiber;
    index ++;
  }

  // 查找下一个工作单元。 先是 子元素 再到 兄弟元素， 最后是父元素的 兄弟元素
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      // 兄弟元素
      return nextFiber.sibling;
    } else {
      // uncle 
      nextFiber = nextFiber.parent;
    }
  }
}

const Dedoo = {
  createElement,
  render
};

// const element = Dedoo.createElement(
//   'div',
//   { id: 'foo'},
//   React.createElement('span', null, 'this is span'),
//   Dedoo.createElement("b")
// )

/** @jsx Dedoo.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)

const container = document.getElementById("root")
// ReactDOM.render(element, container);
Dedoo.render(element, container)

