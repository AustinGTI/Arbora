import {RxReset} from "react-icons/rx";
import {useFormContext} from "react-hook-form";
import PiButton, {PiButtonProps} from "../../buttons/PiButton.tsx";

interface ResetButtonProps extends PiButtonProps {

}

export default function ResetButton(button_props: ResetButtonProps) {
    const {reset, formState: {isDirty}} = useFormContext()

    return (
        <PiButton
            label={'Reset'}
            icon={RxReset}
            isDisabled={!isDirty}
            onClick={() => reset()}
            {...button_props}
        />
    )
}