import {StandardConsole} from "../../../../core/helpers/logging.ts";

export function getParentModalId(element: HTMLElement): string {
    let parent_modal_id = ''
    let parent: HTMLElement | null = element
    while (parent) {
        if (parent.dataset.modalId) {
            parent_modal_id = parent.dataset.modalId
            break
        }
        parent = parent.parentElement
    }
    return parent_modal_id;
}

/**
 * checks if the element is a child of a modal with the given id
 * @param element - the element being tested
 * @param modal_id - the modal id
 */
export function isChildOfModal(element: HTMLElement, modal_id: string): boolean {
    const parent_modal_id = getParentModalId(element)
    StandardConsole.log(`parent modal id is "${parent_modal_id}" and test modal id is "${modal_id}" so the click is`, parent_modal_id.includes(modal_id) ? 'in the modal (so modal not closed)' : 'not in the modal (so modal closed)')
    // if the parent modal_id has the given modal id within it, then it is a child of the modal with the given id
    return parent_modal_id.includes(modal_id)
}
