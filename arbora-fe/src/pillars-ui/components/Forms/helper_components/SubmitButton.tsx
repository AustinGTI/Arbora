import React from 'react'
import {ExtraFormContext} from "../PiForm.tsx";
import PiButton, {PiButtonProps} from "../../buttons/PiButton.tsx";

type SubmitButtonProps = PiButtonProps & {}

export default function SubmitButton(button_props: SubmitButtonProps) {
    const {
        form_button_loading
    } = React.useContext(ExtraFormContext)

    return (
        <PiButton isLoading={form_button_loading} label={'Submit'} type={"submit"} {...button_props}/>
    )
}