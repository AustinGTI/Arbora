// a function that iterates through every node in .milkdown-editor and adds an AI button to
// every header

import {StandardConsole} from "../helpers/logging.ts";

//todo: make this customizable to a specific dom element and its children

function editorInEditMode() {
    return document.querySelector('.milkdown-wrapper.edit-mode') !== null
}

interface HeaderTreeNode {
    coords: string
    level: number
    children: string[]
}

export function addAIButtonToHeaders() {
    const headers = document.querySelectorAll('.md-header')

    if (editorInEditMode()) {
        return
    }

    const header_tree = new Map<string, HeaderTreeNode>()
    const node_stack: HeaderTreeNode[] = []

    // iterate through every single header and create a header tree structure
    // use tree to determine header ids
    headers.forEach((header) => {
        const level = parseInt(header.className.split('md-header-')[1])
        let coords = ''

        while (node_stack.length && node_stack.slice(-1)[0].level >= level) {
            if (!node_stack.slice(-1)[0].coords.includes('.')) {
                break
            }
            node_stack.pop()
        }

        if (node_stack.length == 0) {
            coords = '1'
        } else {
            if (node_stack.slice(-1)[0].level >= level) {
                coords = (parseInt(node_stack.slice(-1)[0].coords) + 1).toString()
            } else {
                coords = node_stack.slice(-1)[0].coords + '.' + (header_tree.get(node_stack.slice(-1)[0].coords)!.children.length + 1).toString()
            }
        }

        if (node_stack.length && coords.includes('.')) {
            const parent_coords = coords.split('.').slice(0, -1).join('.')
            header_tree.get(parent_coords)!.children.push(coords)
        }

        // add to stack and structure
        const new_node: HeaderTreeNode = {
            coords: coords,
            level: level,
            children: []
        }
        node_stack.push(new_node)
        header_tree.set(coords, new_node)


        // if there is no AI button, add one
        if (header.querySelector('.header-ai-btn')) {
            StandardConsole.log('i see one')
            return
        }
        const header_key = coords

        const aiButton = document.createElement('button')
        aiButton.className = 'header-ai-btn'
        aiButton.innerHTML = 'AI'
        aiButton.style.marginLeft = '1rem'
        aiButton.onclick = () => {
            StandardConsole.log('AI Button Clicked: ' + header_key)
        }
        header.appendChild(aiButton)
        StandardConsole.log('child appended')
    })
}