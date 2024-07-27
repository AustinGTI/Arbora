import React from 'react'
import {Mention, MentionsInput} from "react-mentions"
import {Textarea, TextareaProps} from "@chakra-ui/react";
import {ConditionalInputContainer} from "../helper-components/PiInputContainer.tsx";
import {InputSpecifications} from "../types";
import useFormControllerConditionally from "../../hooks/useFormControls";
import {MentionPack} from "./types";

export type TextAreaInputProps =
    InputSpecifications<string>
    & Omit<TextareaProps, "isRequired" | "onChange" | "onBlur" | "value">
    & {
    /**
     * the number of rows for the textarea
     */
    rows?: number
    mention_packs?: MentionPack[]
}
export default function PiTextAreaInput
({
     input_type = 'form', rows, mention_packs = [],
     name, label, description, is_required, onInputChange, ...props
 }: TextAreaInputProps) {
    const {
        form_value, error, onBlur,
        onChange, ref
    } = useFormControllerConditionally({input_type, name})

    const local_ref = React.useRef<HTMLInputElement | null>(null);

    const [curr_value, setCurrValue] = React.useState<string>(form_value ?? '')
    const [cursor_position, setCursorPosition] = React.useState<number | null>(null)

    // when current text changes, call onChange and onInputChange if they exist
    // React.useEffect(() => {
    //     if (onInputChange) {
    //         onInputChange(curr_value)
    //     }
    //     if (onChange) {
    //         onChange(curr_value)
    //     }
    // }, [curr_value]);

    const input_value = React.useMemo(() => {
        if (input_type === 'form') {
            return form_value ?? ''
        } else {
            return curr_value
        }
    }, [input_type, form_value, curr_value]);

    const setInputValue = React.useCallback((value: string) => {
        if (onInputChange) {
            onInputChange(value)
        }
        if (input_type === 'form') {
            if (onChange) onChange(value)
        } else {
            setCurrValue(value ?? '')
        }
    }, [input_type, onChange, setCurrValue, onInputChange]);

    // update the position of the cursor
    React.useEffect(() => {
        if (cursor_position !== null && local_ref.current) {
            local_ref.current?.setSelectionRange(cursor_position, cursor_position)
        }
    }, [cursor_position, curr_value]);

    return (
        <ConditionalInputContainer
            input_type={input_type} name={name} description={description}
            isRequired={is_required} label={label} error={error?.message}>
            {
                mention_packs.length ?
                    <MentionsInput
                        inputRef={ref}
                        rows={rows}
                        placeholder={props.placeholder}
                        style={{
                            width: '100%',
                            minHeight: 12 * 1.375 * (rows ?? 1),
                            maxHeight: 12 * 1.375 * (rows ?? 1),
                            '&multiLine': {
                                control: {
                                    paddingTop: '0.5rem',
                                    paddingLeft: '1rem',
                                    overflow: 'auto',
                                },
                                highlighter: {
                                    fontSize: '0.75rem',
                                    boxSizing: 'border-box',
                                    lineHeight: 1.375,
                                    pointerEvents: 'none',
                                    maxHeight: 12 * 1.375 * (rows ?? 1) - 16,
                                    zIndex: 99
                                },
                                input: {

                                    boxSizing: 'border-box',
                                    wordWrap: 'break-word',
                                    padding: 0,
                                    touchAction: 'manipulation',
                                    overflow: 'auto',
                                    resize: 'vertical',
                                    width: '100%',
                                    outline: '2px solid transparent',
                                    outlineOffset: '2px',
                                    // position: 'relative',
                                    paddingInlineStart: '1rem',
                                    paddingInlineEnd: '1rem',
                                    border: '1px solid',
                                    borderRadius: '3px',

                                    backgroundColor: "white",
                                    margin: 0,
                                    paddingTop: '0.5rem',
                                    paddingBottom: '0.5rem',
                                    paddingLeft: '1rem',
                                    paddingRight: '1rem',
                                    borderWidth: "1px",
                                    _hover: {
                                        borderColor: "gray",
                                    },
                                    fontSize: '0.75rem',
                                    borderColor: "black",
                                    lineHeight: 1.375,
                                },
                            },
                            suggestions: {
                                list: {
                                    backgroundColor: 'white',
                                    border: '1px solid rgba(0,0,0,0.15)',
                                    fontSize: '0.75rem',
                                },
                                item: {
                                    padding: '5px 15px',
                                    '&focused': {
                                        backgroundColor: '#fee',
                                    },
                                    fontSize: '0.75rem',
                                },
                            }
                        }}
                        onChange={(e) => {
                            setInputValue(e.target.value)
                            // setCurrValue(e.target.text)
                        }}
                        onBlur={onBlur}
                        value={input_value}>
                        {mention_packs.map(({trigger, markup, options}) => {
                            return (
                                <Mention
                                    key={trigger}
                                    trigger={trigger}
                                    style={{
                                        fontSize: '0.75rem',
                                        // fontWeight: '600',
                                        borderRadius: '3px',
                                        color: 'red',
                                        backgroundColor: '#fdd'
                                    }}
                                    markup={markup ?? '#(__id__)'}
                                    displayTransform={(id) => `@${id} `}
                                    data={options}/>
                            )
                        })}
                    </MentionsInput>
                    : <Textarea
                        ref={ref}
                        bg={"white"}
                        m={0} rows={rows}
                        border={"1px"}
                        fontSize={"sm"}
                        borderRadius={3}
                        onBlur={onBlur}
                        onChange={(e) => {
                            setInputValue(e.target.value)
                            setCursorPosition(e.target.selectionStart)
                        }}
                        value={input_value}
                        {...props}/>
            }
        </ConditionalInputContainer>
    );

}
