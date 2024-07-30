// a flex layout component may possess multiple types of styling for different layers of the layout
import {CSSProperties} from "react";
import {Flex, HStack, VStack} from "@chakra-ui/react";
import {FlexContainer} from "./FlexContainer";
import {CardContainer} from "./CardContainers";

interface DividerStyling {
    color: string;
    thickness: string | number;
}
export interface LayoutStyling {
    root_styling: CSSProperties | undefined;
    branch_styling: CSSProperties | undefined;
    leaf_styling: CSSProperties | undefined;
    divider_styling: DividerStyling | undefined;
}

export const LAYOUTS = {
    FLEX: Flex,
    HSTACK: HStack,
    VSTACK: VStack,
    FLEX_LAYOUT: FlexContainer,
    CARD_LAYOUT: CardContainer,
}

export interface GenericContainerProps {
    /**
     * whether or not the single_doc_section passed to the container is loading
     */
    data_loading?: boolean;
    /**
     * whether or not the single_doc_section passed to the container is not available due to an error
     */
    data_error?: boolean;
}