// a function that iterates through every node in .milkdown-editor and adds an AI button to
// every header

import {StandardConsole} from "../helpers/logging.ts";
import {createAIMainButton, HeadingTag} from "./buttons.ts";

//todo: make this customizable to a specific dom element and its children

function editorInEditMode(elem: Element | Document) {
    return elem.querySelector('.milkdown-wrapper.edit-mode') !== null
}

interface HeaderTreeNode {
    coords: string
    level: number
    children: string[]
}


function iterateThroughHeaders(action: (header_key: string, header: Element, level: number) => void, editor_id?: string) {
    if (editor_id && !document.querySelector('#' + editor_id)) {
        StandardConsole.warn(`editor id ${editor_id} not found`)
        return
    }
    const elem = (editor_id ? document.querySelector('#' + editor_id)! : document)

    const headers = elem.querySelectorAll('.md-header')

    if (editorInEditMode(elem)) {
        return
    }

    const header_tree = new Map<string, HeaderTreeNode>()
    const node_stack: HeaderTreeNode[] = []

    // iterate through every single header and create a header tree structure
    // use tree to determine header ids
    headers.forEach((header) => {
        const level = parseInt(header.className.split('md-header-')[1])
        let coords: string

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

        action(coords, header, level)
    })
}

export function addAIButtonToHeaders(editor_id?: string) {
    iterateThroughHeaders((header_key, header, level) => {
        // add a class to the header based on its key, first remove any pre-existing header-key class
        header.className = header.className.replace(/header-key-\d+/g, '')
        header.className += ` header-key-${header_key.replace(/\./g, '-')}`

        // if there is no AI button, add one
        if (header.querySelector('.header-ai-btn')) {
            StandardConsole.log('i see one')
            return
        }

        header.appendChild(createAIMainButton(header_key, `h${level}` as HeadingTag))
        StandardConsole.log('child appended')
    }, editor_id)
}
