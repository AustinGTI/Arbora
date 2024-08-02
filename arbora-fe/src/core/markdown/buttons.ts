import {DocumentViewTabKey, setActiveNote, setActiveTab} from "../redux/home/home_slice.ts";
import {store} from "../redux";

interface AIButtonDimensionsConfig {
    container_size: number
    container_ml: number
    container_mt: number

    main_button_size: number

    action_button_size: number
    action_button_spacing: number
}

export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const AI_BUTTON_DIMENSIONS: { [key in HeadingTag]: AIButtonDimensionsConfig } = {
    'h1': {
        container_size: 30,
        container_ml: 5,
        container_mt: 4,
        main_button_size: 30,
        action_button_size: 20,
        action_button_spacing: 2
    },
    'h2': {
        container_size: 30,
        container_ml: 5,
        container_mt: 4,
        main_button_size: 30,
        action_button_size: 20,
        action_button_spacing: 2
    },
    'h3': {
        container_size: 30,
        container_ml: 5,
        container_mt: 4,
        main_button_size: 30,
        action_button_size: 20,
        action_button_spacing: 2
    },
    'h4': {
        container_size: 30,
        container_ml: 5,
        container_mt: 4,
        main_button_size: 30,
        action_button_size: 20,
        action_button_spacing: 2
    },
    'h5': {
        container_size: 30,
        container_ml: 5,
        container_mt: 4,
        main_button_size: 30,
        action_button_size: 20,
        action_button_spacing: 2
    },
    'h6': {
        container_size: 30,
        container_ml: 5,
        container_mt: 4,
        main_button_size: 30,
        action_button_size: 20,
        action_button_spacing: 2
    }
}

interface ActionButtonSpecifications {
    key: string
    action: (header_key: string) => void
}

const ACTION_BUTTON_SPECS: ActionButtonSpecifications[] = [
    {
        key: 'to-flash-cards',
        action: (header_id: string) => {
            store.dispatch(setActiveTab(DocumentViewTabKey.FLASH_CARDS))
            store.dispatch(setActiveNote(header_id))
        }
    },
    {
        key: 'to-qa',
        action: (header_id: string) => {
            store.dispatch(setActiveTab(DocumentViewTabKey.QA))
            store.dispatch(setActiveNote(header_id))
        }
    },
    {
        key: 'to-explain',
        action: (header_id: string) => {
            store.dispatch(setActiveTab(DocumentViewTabKey.EXPLAIN))
            store.dispatch(setActiveNote(header_id))
        }
    }
]

function createAIActionButton(btn_specs: ActionButtonSpecifications, header_id: string, tag: HeadingTag) {
    const size = `${AI_BUTTON_DIMENSIONS[tag].action_button_size}px`
    const button_wrapper = document.createElement('div')
    button_wrapper.style.cssText = `
        position: absolute;
        width: ${size};
        height: ${size};
        left: 10;
        top: 50%;
    `

    const button = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

    button.setAttribute('id', `ai-action-button-${header_id}-${btn_specs.key}`)
    button.setAttribute('class', 'header-ai-btn')
    button.setAttribute('width', size)
    button.setAttribute('height', size)
    button.setAttribute('viewBox', '0 0 50 50')

    button.style.cssText = `
        position: relative;
        top:-50%;
        width: 100%;
        height: 100%;
        left: 0;
        transition: left 0.2s;
        cursor: pointer;
    `

    button.innerHTML = '<circle cx="25" cy="25" r="20" stroke="black" stroke-width="3" fill="green" />'
    button.style.cursor = 'pointer'

    button.addEventListener('click', () => {
        console.log(`clicked on ai action button of ${header_id} key ${btn_specs.key}`)
        btn_specs.action(header_id)
    })

    button_wrapper.appendChild(button)

    return button_wrapper
}

export function createAIMainButton(header_id: string, tag: HeadingTag): Element {
    const dimensions = AI_BUTTON_DIMENSIONS[tag]

    const container = document.createElement('div')
    container.setAttribute('id', `ai-button-container-${header_id}`)
    container.style.cssText = `
         position: absolute;
         display: inline-block;
         flex-direction: row;
         margin-left: ${dimensions.container_ml}px;
         margin-top: ${dimensions.container_mt}px;
         height: ${dimensions.container_size}px;
         width: ${dimensions.container_size}px;
      `

    const main_wrapper = document.createElement('div')

    main_wrapper.style.cssText = `
        position: absolute;
        left: 0;
        top: 50%;
        width: ${dimensions.main_button_size}px;
        height: ${dimensions.main_button_size}px;
        cursor: pointer;
      `

    const main_svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    main_svg.setAttribute('width', `${dimensions.main_button_size}px`)
    main_svg.setAttribute('height', `${dimensions.main_button_size}px`)
    main_svg.setAttribute('viewBox', '0 0 50 50')

    main_svg.innerHTML = '<circle cx="25" cy="25" r="20" stroke="black" stroke-width="3" fill="red" />'
    main_svg.style.cursor = 'pointer'
    main_svg.style.cssText = `
        position: relative;
        width: 100%;
        height: 100%;
        top: -50%;
        cursor: pointer;
      `

    main_wrapper.appendChild(main_svg)

    ACTION_BUTTON_SPECS.forEach((btn_specs) => {
        const nav_button = createAIActionButton(btn_specs, header_id, tag)
        container.appendChild(nav_button)
    })

    container.appendChild(main_wrapper)

    // add an event listener to the main button that offsets the action buttons on hover

    container.addEventListener('mouseover', (e) => {
        ACTION_BUTTON_SPECS.forEach(({key}, index) => {
            const nav_button = document.getElementById(`ai-action-button-${header_id}-${key}`)
            if (nav_button) {
                nav_button.style.left = `${dimensions.main_button_size + (dimensions.action_button_spacing * 2 + dimensions.action_button_size) * index}px`
            }
            (e.currentTarget as HTMLDivElement).style.width = `${dimensions.main_button_size + (dimensions.action_button_spacing * 2 + dimensions.action_button_size) * ACTION_BUTTON_SPECS.length}px`
        })
    })

    container.addEventListener('mouseleave', (e) => {
        ACTION_BUTTON_SPECS.forEach(({key}) => {
            const nav_button = document.getElementById(`ai-action-button-${header_id}-${key}`)
            if (nav_button) {
                nav_button.style.left = '10'
            }
            (e.currentTarget as HTMLDivElement).style.width = '30px'
        })
    })


    return container
}