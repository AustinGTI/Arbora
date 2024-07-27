import React from "react";
import {ConditionalInputContainer} from "../helper-components/PiInputContainer.tsx";
import PhoneInput from "react-phone-number-input";

import "react-phone-number-input/style.css";
import {InputSpecifications, InputVariant} from "../types";
import useFormControllerConditionally from "../../hooks/useFormControls";
import {inputVariantToTextInputStyling} from "./helpers";

export type CountryCode =
    'AC' | 'AD' | 'AE' | 'AF' | 'AG' | 'AI' | 'AL' | 'AM' | 'AO' | 'AR' | 'AS' | 'AT' | 'AU' | 'AW'
    | 'AX' | 'AZ' | 'BA' | 'BB' | 'BD' | 'BE' | 'BF' | 'BG' | 'BH' | 'BI' | 'BJ' | 'BL' | 'BM' | 'BN'
    | 'BO' | 'BQ' | 'BR' | 'BS' | 'BT' | 'BW' | 'BY' | 'BZ' | 'CA' | 'CC' | 'CD' | 'CF' | 'CG' | 'CH'
    | 'CI' | 'CK' | 'CL' | 'CM' | 'CN' | 'CO' | 'CR' | 'CU' | 'CV' | 'CW' | 'CX' | 'CY' | 'CZ' | 'DE'
    | 'DJ' | 'DK' | 'DM' | 'DO' | 'DZ' | 'EC' | 'EE' | 'EG' | 'EH' | 'ER' | 'ES' | 'ET' | 'FI' | 'FJ'
    | 'FK' | 'FM' | 'FO' | 'FR' | 'GA' | 'GB' | 'GD' | 'GE' | 'GF' | 'GG' | 'GH' | 'GI' | 'GL' | 'GM'
    | 'GN' | 'GP' | 'GQ' | 'GR' | 'GT' | 'GU' | 'GW' | 'GY' | 'HK' | 'HN' | 'HR' | 'HT' | 'HU' | 'ID'
    | 'IE' | 'IL' | 'IM' | 'IN' | 'IO' | 'IQ' | 'IR' | 'IS' | 'IT' | 'JE' | 'JM' | 'JO' | 'JP' | 'KE'
    | 'KG' | 'KH' | 'KI' | 'KM' | 'KN' | 'KP' | 'KR' | 'KW' | 'KY' | 'KZ' | 'LA' | 'LB' | 'LC' | 'LI'
    | 'LK' | 'LR' | 'LS' | 'LT' | 'LU' | 'LV' | 'LY' | 'MA' | 'MC' | 'MD' | 'ME' | 'MF' | 'MG' | 'MH'
    | 'MK' | 'ML' | 'MM' | 'MN' | 'MO' | 'MP' | 'MQ' | 'MR' | 'MS' | 'MT' | 'MU' | 'MV' | 'MW' | 'MX'
    | 'MY' | 'MZ' | 'NA' | 'NC' | 'NE' | 'NF' | 'NG' | 'NI' | 'NL' | 'NO' | 'NP' | 'NR' | 'NU' | 'NZ'
    | 'OM' | 'PA' | 'PE' | 'PF' | 'PG' | 'PH' | 'PK' | 'PL' | 'PM' | 'PR' | 'PS' | 'PT' | 'PW' | 'PY'
    | 'QA' | 'RE' | 'RO' | 'RS' | 'RU' | 'RW' | 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SG' | 'SH' | 'SI'
    | 'SJ' | 'SK' | 'SL' | 'SM' | 'SN' | 'SO' | 'SR' | 'SS' | 'ST' | 'SV' | 'SX' | 'SY' | 'SZ' | 'TA'
    | 'TC' | 'TD' | 'TG' | 'TH' | 'TJ' | 'TK' | 'TL' | 'TM' | 'TN' | 'TO' | 'TR' | 'TT' | 'TV' | 'TW'
    | 'TZ' | 'UA' | 'UG' | 'US' | 'UY' | 'UZ' | 'VA' | 'VC' | 'VE' | 'VG' | 'VI' | 'VN' | 'VU' | 'WF'
    | 'WS' | 'XK' | 'YE' | 'YT' | 'ZA' | 'ZM' | 'ZW';

export type PhoneNumberInputProps =
    InputSpecifications<string>
    & Omit<React.ComponentProps<typeof PhoneInput>, "onChange" | "value">
    & {
    /**
     * the placeholder for the input
     */
    placeholder?: string;
    /**
     * a country code for the default country, by default it is set to "KE" for Kenya
     */
    default_country?: CountryCode;
}

/**
 * A phone number input component, as a form, it sets the key 'name' to the phone number,
 * as a generic input, it calls the function onInputChange with the phone number, this function is also
 * available for form inputs for potential side effects when a form text is set
 * @constructor
 */
export default function PhoneNumberInput
({
     name, input_type, input_variant = InputVariant.ROUNDED,
     label, is_required, default_country = 'KE',
     placeholder, onInputChange, ...props
 }: PhoneNumberInputProps) {
    const {
        ref, onChange, onBlur, form_value, error
    } = useFormControllerConditionally({name, input_type});

    const [curr_value, setCurrValue] = React.useState<string>(form_value ?? '')


    const {borderRadius} = React.useMemo(() => {
        return inputVariantToTextInputStyling(input_variant)
    }, [input_variant]);


    // if the curr_value changes, change the form text
    React.useEffect(() => {
        if (onChange) {
            onChange(curr_value)
        }
        if (onInputChange) {
            onInputChange(curr_value)
        }
    }, [curr_value]);

    return (
        <ConditionalInputContainer name={name} input_type={input_type} isRequired={is_required} label={label}
                                   error={error?.message}>
            <PhoneInput
                ref={ref}
                onBlur={onBlur}
                onChange={(value) => {
                    setCurrValue(value ?? '')
                }}
                value={curr_value}
                international
                defaultCountry={default_country}
                className={"form-phone-input"}
                border={"1px solid #CBD5E0"}
                style={{
                    borderRadius
                }}
                placeholder={placeholder}
                {...props}
            />
        </ConditionalInputContainer>
    );
}