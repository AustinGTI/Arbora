import React from 'react'
import {ExtraFormContext} from "../PiForm.tsx";
import PiButton, {PiButtonProps} from "../../buttons/PiButton.tsx";

type PiFormSubmitButtonProps = PiButtonProps & {}

export default function PiFormSubmitButton(button_props: PiFormSubmitButtonProps) {
    const {
        form_button_loading
    } = React.useContext(ExtraFormContext)

    return (
        <PiButton isLoading={form_button_loading} label={'Submit'} type={"submit"} {...button_props}/>
    )
}