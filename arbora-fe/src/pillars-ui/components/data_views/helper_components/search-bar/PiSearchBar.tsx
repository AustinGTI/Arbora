import React from 'react';
import {HStack, Icon, Input, InputGroup, InputLeftElement, InputProps, InputRightElement} from "@chakra-ui/react";
import {BsSearch, BsX} from "react-icons/bs";
import {inputVariantToTextInputStyling} from "../../../forms/inputs/text/helpers.ts";
import {InputVariant} from "../../../forms/inputs/types.ts";

interface PiSearchBarProps extends Omit<InputProps, "variant"> {
    input_variant?: InputVariant
    onSearch: (search_query: string) => void
}

const PiSearchBar = React.forwardRef<HTMLInputElement, PiSearchBarProps>
(({
      input_variant = InputVariant.ROUNDED, onSearch,
      width, height,
      flexGrow, flex, ...input_props
  }, ref) => {
    const [search_query, setSearchQuery] = React.useState<string>('')

    const variant_styling_props = React.useMemo(() => {
        return inputVariantToTextInputStyling(input_variant)
    }, [input_variant]);

    const handleCancelSearch = React.useCallback(() => {
        setSearchQuery('')
    }, [setSearchQuery]);

    React.useEffect(() => {
        onSearch(search_query)
    }, [search_query]);

    return (
        <InputGroup size={"md"} {...{width, height, flexGrow, flex}}>
            <InputLeftElement height={'35px'} pointerEvents="none">
                <Icon color={variant_styling_props.borderColor} boxSize={"1rem"} as={BsSearch}/>
            </InputLeftElement>
            <Input
                ref={ref} type="text" fontSize={".8rem"} h={'35px'}
                onChange={(e) => {
                    const value = e.target.value
                    setSearchQuery(value)
                }}

                value={search_query}
                textTransform={"capitalize"} {...variant_styling_props} {...input_props}/>

            <InputRightElement w={'40px'}>
                <HStack justify={'flex-end'}>
                    {
                        search_query && (
                            <Icon
                                onClick={handleCancelSearch}
                                color={variant_styling_props.borderColor}
                                boxSize={"1.4rem"}
                                as={BsX}/>
                        )
                    }
                </HStack>
            </InputRightElement>
        </InputGroup>
    )
})

export default PiSearchBar