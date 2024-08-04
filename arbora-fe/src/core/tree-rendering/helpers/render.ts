import {Graphics as PixiGraphics} from '@pixi/graphics'
import {BranchDirection, BranchState, NormalBranchConfig, TrunkBranchConfig} from "../types.ts";
import {Coords2D} from "../../types.ts";

export function branchStateToOpacity(opacity: number, branch_state: BranchState): number {
    switch (branch_state) {
        case BranchState.HIDDEN:
            return 0.1
        case BranchState.HIGHLIGHTED:
            return 1
        case BranchState.NORMAL:
        default:
            return opacity
    }
}

export function renderTrunk(u: Coords2D, g: PixiGraphics, config: TrunkBranchConfig): Coords2D {
    const {girth, length, taper, roundness: b} = config
    const v: Coords2D = {x: u.x, y: u.y - length}
    const ru = girth / 2
    const rv = (girth * taper) / 2

    // base of tree
    const uu: Coords2D = {x: u.x, y: u.y + ru * b}
    // top of tree
    const vv: Coords2D = {x: v.x, y: v.y - rv * b}

    // region LEFT SECTION
    // ? ........................

    // base of straight section u
    const ubl: Coords2D = {x: uu.x - ru * (1 - b), y: uu.y}

    // base of straight section v
    const vbl: Coords2D = {x: vv.x - rv * (1 - b), y: vv.y}

    // bezier curve to the top
    const cpl1: Coords2D = {x: ubl.x - ru * b, y: ubl.y}
    const cpl2: Coords2D = {x: vbl.x - rv * b, y: vbl.y}

    // ? ........................
    // endregion ........................

    // region RIGHT SECTION
    // ? ........................

    const ubr: Coords2D = {x: uu.x + ru * (1 - b), y: uu.y}

    const vbr: Coords2D = {x: vv.x + rv * (1 - b), y: vv.y}

    // bezier curve to the top
    const cpr1: Coords2D = {x: ubr.x + ru * b, y: ubr.y}
    const cpr2: Coords2D = {x: vbr.x + rv * b, y: vbr.y}

    // ? ........................
    // endregion ........................


    g.moveTo(uu.x, uu.y)
    g.lineTo(ubl.x, ubl.y)
    g.bezierCurveTo(cpl1.x, cpl1.y, cpl2.x, cpl2.y, vbl.x, vbl.y)
    g.lineTo(vbr.x, vbr.y)
    g.bezierCurveTo(cpr2.x, cpr2.y, cpr1.x, cpr1.y, ubr.x, ubr.y)
    g.lineTo(uu.x, uu.y)

    g.endFill()

    return v
}

export function renderBranch(u: Coords2D, g: PixiGraphics, config: NormalBranchConfig, direction: BranchDirection): Coords2D {
    const {girth: gu, inner_curve: bi, outer_curve: bo, taper, v_length: lv, h_length: lh} = config
    const ru = gu / 2
    const gv = gu * taper
    const rv = gv / 2

    const mul = direction === 'left' ? 1 : -1

    const ui: Coords2D = {x: u.x, y: u.y - ru}
    const uo: Coords2D = {x: u.x, y: u.y + ru}

    const outer_curve_length = Math.min(lh, lv)

    const ubo: Coords2D = {x: uo.x - mul * (1 - bo) * outer_curve_length, y: uo.y}
    const cpo: Coords2D = {x: uo.x - mul * lh, y: uo.y}

    const vbo: Coords2D = {x: cpo.x, y: cpo.y - outer_curve_length}
    const vo: Coords2D = {x: cpo.x, y: cpo.y - lv}
    const vv: Coords2D = {x: vo.x + mul * rv, y: vo.y - rv}
    const v: Coords2D = {x: vo.x + mul * rv, y: vo.y}

    const inner_curve_length = Math.min(lh - gv, lv - gu)

    const ubi: Coords2D = {x: ui.x - mul * (1 - bi) * inner_curve_length, y: ui.y}
    const cpi: Coords2D = {x: ui.x - mul * (lh - gv), y: ui.y}

    const vbi: Coords2D = {x: cpi.x, y: cpi.y - inner_curve_length * bi}
    const vi: Coords2D = {x: cpi.x, y: cpi.y - (lv - gu)}


    g.beginFill('#704241', Math.min(1, gu / 30))

    g.moveTo(ui.x, ui.y)
    g.lineTo(ubi.x, ubi.y)
    g.quadraticCurveTo(cpi.x, cpi.y, vbi.x, vbi.y)
    g.lineTo(vi.x, vi.y)
    g.quadraticCurveTo(vv.x, vv.y, vo.x, vo.y)
    g.lineTo(vbo.x, vbo.y)
    g.quadraticCurveTo(cpo.x, cpo.y, ubo.x, ubo.y)
    g.lineTo(uo.x, uo.y)

    g.endFill()

    return v
}

export function renderBranchV2(u: Coords2D, g: PixiGraphics, config: NormalBranchConfig, direction: BranchDirection): Coords2D {
    const {v_length: lv, h_length: lh, inner_curve} = config

    const mul = direction === 'left' ? 1 : -1

    const ub: Coords2D = {x: u.x - inner_curve * lh * mul, y: u.y}
    const cp1: Coords2D = {x: u.x - lh * mul, y: u.y}
    const vb: Coords2D = {x: cp1.x, y: cp1.y - lh * inner_curve}
    const v: Coords2D = {x: cp1.x, y: cp1.y - lv}

    g.moveTo(u.x, u.y)

    g.lineTo(ub.x, ub.y)
    g.quadraticCurveTo(cp1.x, cp1.y, vb.x, vb.y)

    g.lineTo(v.x, v.y)

    return v
}

export function renderCanopy(u: Coords2D, g: PixiGraphics, canopy_radius: number): void {
    const height = 1.5

    const ul: Coords2D = {x: u.x - canopy_radius, y: u.y}
    const utl: Coords2D = {x: ul.x, y: ul.y - canopy_radius * height}
    const utr: Coords2D = {x: u.x + canopy_radius, y: ul.y - canopy_radius * height}
    const ur: Coords2D = {x: utr.x, y: u.y}

    g.moveTo(ul.x, ul.y)
    g.bezierCurveTo(utl.x, utl.y, utr.x, utr.y, ur.x, ur.y)

}