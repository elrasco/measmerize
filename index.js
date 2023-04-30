/**
 * ---> here starts the program <---
 *
 * 1) read nodes.json
 * 2) looking for root elements (ones without parentId)
 * 3) for each root element looking for children
 * 4) recursively for each child looking for children
 * 5) evrytime children are found, they sorted by first child
 */
(() => {
  const fs = require("fs");
  const rawdata = fs.readFileSync("./input/nodes.json");
  const nodes = JSON.parse(rawdata);

  const _nodes = JSON.parse(JSON.stringify(nodes)); //deep copy of the initial array

  const trees = sortBySiblings(filterAndPop(_nodes, isRoot));

  for (let i = 0; i < trees.length; i++) {
    addChildrenTo(trees[i], _nodes);
  }

  console.log(JSON.stringify(trees));

  process.exit();
})();

/**
 * filters and pops the filterd elements from the original array
 * @param {*} arr the orignal array
 * @param {*} fn
 * @returns A shallow copy of a portion of the given array
 */
function filterAndPop(arr, fn) {
  let filteredValues = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    if (fn(arr[i])) {
      filteredValues.push(arr.splice(i, 1)[0]);
    }
  }
  return filteredValues;
}

/**
 *
 * @param {*} node
 * @returns true if parentId is null
 */
function isRoot(node) {
  return node.parentId === null;
}

function addChildrenTo(element, nodes) {
  element.children = sortBySiblings(
    filterAndPop(nodes, (node) => node.parentId === element.nodeId)
  );

  for (let i = 0; i < element.children.length; i++) {
    addChildrenTo(element.children[i], nodes);
  }
}

/**
 *
 * @param {*} nodes nodes with same parent
 * @returns nodes sorted by sibling. first child first
 */
function sortBySiblings(nodes) {
  const nodesSortedBySiblings = [...nodes]; //I have to keep the initial order of the array
  for (let i = 0; i < nodes.length; i++) {
    const node = { ...nodes[i] };

    // if node has a previous sibling, move the element to the right side of the sibling
    if (node.previousSiblingId !== null) {
      const nodeWithPreviousSiblingIndex = nodesSortedBySiblings.findIndex(
        (n) => n.nodeId === node.nodeId
      );
      const previousSiblingNodeIndex = nodesSortedBySiblings.findIndex(
        (n) => n.nodeId === node.previousSiblingId
      );
      moveElement(
        nodesSortedBySiblings,
        nodeWithPreviousSiblingIndex,
        previousSiblingNodeIndex
      );
    }
  }
  return nodesSortedBySiblings;
}

function moveElement(array, fromIndex, toIndex) {
  array.splice(toIndex + 1, 0, array.splice(fromIndex, 1)[0]);
  return array;
}
