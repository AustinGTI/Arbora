import React from 'react'
import {Box, StackProps, VStack} from "@chakra-ui/react";
import {GenericContainerProps} from "../types";

export interface PiContainerLayer {
    key: React.Key,
    content: React.ReactNode
}

type PiLayerContainerProps<ContainerDataContext extends Object> = {
    /**
     * the layers to be rendered in the container, each layer must follow the PiContainerLayer interface consisting of a key
     * and a content prop, the key must be unique and the content prop is the component to be rendered when the layer is active
     */
    layers: PiContainerLayer[],
    /**
     * This is the single_doc_section context that is exposed to the layers, it can be accessed within any layer inside
     * the data_props.container_data_context prop
     */
    container_data_context: ContainerDataContext,
    /**
     * the initial layers among the layers passed to the container to be displayed, if not provided, the first layer
     * in the layers prop will be used, the initial layer must be one of the layers provided in the layers prop
     */
    initial_layer?: PiContainerLayer,
} & StackProps & GenericContainerProps

export interface PiLayerContainerContextProps<ContainerDataContext extends Object> {
    navigation_props: {
        layers: PiContainerLayer[],
        active_layer: PiContainerLayer,
        refreshLayers: () => void,
        goToLayer: (layer_key: React.Key) => void,
    },
    data_props: {
        container_data_context: ContainerDataContext,
    }

}

export const PiLayerContainerContext = React.createContext<PiLayerContainerContextProps<any>>({
    navigation_props: {
        layers: [],
        active_layer: {key: '', content: <></>},
        refreshLayers: () => null,
        goToLayer: () => null,
    },
    data_props: {
        container_data_context: {},
    }
})

/**
 * A PiLayerContainer allows a user to have multiple views in one container. The views are called layers. Only one layer
 * is visible at a time. The user can switch between layers using the goToLayer function in the PiLayerContainerContext and store the container
 * single_doc_section context in the container_data_context prop. The container single_doc_section context can be accessed and modified within any layer under
 * data_props
 * @constructor
 */
export default function PiLayerContainer<ContainerData extends Object>({
                                                                           layers,
                                                                           initial_layer,
                                                                           container_data_context,
                                                                           data_loading,
                                                                           data_error,
                                                                           ...stack_props
                                                                       }: PiLayerContainerProps<ContainerData>) {
    const [container_key, setContainerKey] = React.useState<number>(0)
    // if there are no layers, throw an error, a layer layout must contain at least one layer
    if (layers.length === 0) {
        throw new Error('PiLayerContainer must contain at least one layer.')
    }
    const [active_layer, setActiveLayer] = React.useState<PiContainerLayer>(
        (initial_layer && layers.find((layer) => layer.key === initial_layer.key)) ?? layers[0]
    )

    const layer_container_context: PiLayerContainerContextProps<ContainerData> = React.useMemo(() => ({
        navigation_props: {
            layers: layers,
            active_layer: active_layer,
            refreshLayers: () => setContainerKey((prev) => prev + 1),
            goToLayer: (layer_key: React.Key) => {
                // find the layer with the given key
                const layer = layers.find((layer) => layer.key === layer_key)
                // if the layer is not found, throw an error
                if (!layer) {
                    throw new Error(`Layer with key ${layer_key} not found`)
                } else {
                    setActiveLayer(layer)
                }
            }
        },
        data_props: {
            container_data_context,
        }
    }), [layers, active_layer, container_data_context, setActiveLayer, setContainerKey])
    return (
        // display all layers but only the active one has a display attribute of block (all others are none)
        <PiLayerContainerContext.Provider value={layer_container_context}>
            {/*<DataContainer w={'100%'} h={'100%'} data_loading={data_loading} data_error={data_error} {...stack_props}>*/}
            <VStack className={'layer-container'} key={`layer-container-${container_key}`} w={'100%'}
                    h={'100%'} {...stack_props}>
                {
                    layers.map((layer) => (
                        <Box key={layer.key} w={'100%'} h={'100%'}
                             display={active_layer.key === layer.key ? 'block' : 'none'}>
                            {layer.content}
                        </Box>
                    ))
                }
            </VStack>
            {/*</DataContainer>*/}
        </PiLayerContainerContext.Provider>
    )
}