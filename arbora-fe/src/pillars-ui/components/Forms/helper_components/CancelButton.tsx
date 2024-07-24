import PiButton, {PiButtonProps} from "../../buttons/PiButton.tsx";
import {PiButtonIcon, PiButtonPalette} from "../../buttons/types.ts";

interface CancelButtonProps extends PiButtonProps {

}

export default function CancelButton(button_props: CancelButtonProps) {
    return (
        <PiButton
            label={'Cancel'}
            icon={PiButtonIcon.CLOSE}
            palette={PiButtonPalette.RED_WHITE}
            {...button_props}/>
    )
}