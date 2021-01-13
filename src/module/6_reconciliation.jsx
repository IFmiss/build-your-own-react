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

const isEvent = key => key.startsWith('on');
const isProperty = key => key !== "children" && !isEvent(key);

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

function commitRoot() {
  // TODO add nodes to dom
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  // 记录最后一个 fiber 树，用于和新的任务比较
  currentRoot = wipRoot;
  wipRoot = null
}

function commitWork(fiber) {
  if(!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;

  // PLACEMENT
  if (fiber.effectTag === 'PLACEMENT' &&
    fiber.dom !== null) {
    domParent.appendChild(fiber.dom);
  } else if (
    fiber.effectTag === 'UPDATE' &&
    fiber.dom !== null) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  } else if (fiber.effectTag === 'DELETION') {
    domParent.removeChild(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

const isNew = (prev, next) => key => prev[key] !== next[key]; // 是否更新的/
const isGone = (prev, next) => key => !(key in next); // 是否移除
function updateDom(dom, prevProps, nextProps) {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(
      k => (
        // 新属性中不存在该属性
        !(k in nextProps) ||
        // 或者是否是更新的属性
        isNew(prevProps, nextProps)(k)
      )
    )
    .forEach(name => {
      // 找到事件
      const eventName = name.toLowerCase().substring(2);
      // 移除事件
      dom.removeEventListener(
        eventName,
        prevProps[name]
      )
    })

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(k => dom[k] = '')
  
  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(k => dom[k] = nextProps[k])

  // Add new Event Handle
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
  .forEach(name => {
    const eventName = name.toLowerCase().substring(2);
    dom.addEventListener(
      name,
      nextProps[name]
    )
  })
}

function render(element, container) {
  // TODO set next unit of work
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    }
  }
  deletions = [];
  nextUnitOfWork = wipRoot;
}

// 是否有后续的任务
let nextUnitOfWork = null;

// 进行中的根
let wipRoot = null;

let currentRoot = null;

let deletions = null;

function workLoop (deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 如果已经结束，且 wipRoot 存在，执行commit 
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop);
};

requestIdleCallback(workLoop)

function performUnitOfWork (fiber) {
  // todo
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // create new fiber
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

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

function reconcileChildren(wipFiber, elements) {
  let index = 0
  let oldFiber =
    wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null

  while (
    index < elements.length ||
    oldFiber != null
  ) {
    const element = elements[index]
    let newFiber = null

    const sameType =
      oldFiber &&
      element &&
      element.type == oldFiber.type

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      }
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      wipFiber.child = newFiber
    } else if (element) {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
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

