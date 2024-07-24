import React from 'react'
import {StandardConsole} from "@leta-frontend/common/global-utils/helpers/logging";
import {getParentModalId} from "./helpers";

export function calculateZIndexAboveModal(modal_id: string): number {
    // z index is the number of sections in the modal_id * 1000
    // this formula is a good enough approximation to ensure that the dropdown is always above the modal
    const modal_level = modal_id.split('-').length
    return modal_level * 1000
}


/**
 * a hook used to get the modal id of a modal when it is open
 * it is used to get the modal path of a modal by appending a randomly generated string to the parent modal id
 * this allows us to determine the parent modals of a modal which is not possible through the dom as modals are opened
 * in a portal
 *
 * primarily useful for checking if a click is in the descendants of a modal thus allowing us to only close the
 * modal if the click is outside of the modal or its descendants
 * @param ref
 * @param modal_is_open
 */
export default function useModalId(ref: React.RefObject<HTMLElement>, modal_is_open: boolean): string {
    const [modal_id, setModalId] = React.useState<string>('')
    React.useEffect(() => {
        if (!ref.current || !modal_is_open) return
        // get the closest parent with a modal id
        let parent_modal_id = getParentModalId(ref.current)
        const modal_id = parent_modal_id + (parent_modal_id.length ? '-' : '') + Math.random().toString(36).substring(2, 7)

        setModalId(modal_id)
        StandardConsole.log('new modal open with id of ', modal_id,)
    }, [modal_is_open]);
    return modal_id;
}
