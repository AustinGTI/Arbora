import {Graphics as PixiGraphics} from '@pixi/graphics'
import {BranchDirection, NormalBranchConfig, TrunkBranchConfig} from "../types.ts";
import {Coords2D} from "../../types.ts";

export function displayPoints(g: PixiGraphics, points: Coords2D[], color: number, radius: number = 3) {
    g.beginFill(color)
    points.forEach(point => {
        g.drawCircle(point.x, point.y, radius)
    })
    g.endFill()
}

export function renderTrunk(u: Coords2D, g: PixiGraphics, config: TrunkBranchConfig, completion: number): Coords2D {
    const {girth, length, taper, roundness: b} = config
    const v: Coords2D = {x: u.x, y: u.y - length * completion}
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

export function renderBranch(u: Coords2D, g: PixiGraphics, config: NormalBranchConfig, direction: BranchDirection, _completion: number): Coords2D {
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

export function renderBranchV2(u: Coords2D, g: PixiGraphics, config: NormalBranchConfig, direction: BranchDirection, _completion: number): Coords2D {
    const {v_length: lv, h_length: lh, inner_curve, girth} = config

    const mul = direction === 'left' ? 1 : -1

    const ub: Coords2D = {x: u.x - inner_curve * lh * mul, y: u.y}
    const cp1: Coords2D = {x: u.x - lh * mul, y: u.y}
    const vb: Coords2D = {x: cp1.x, y: cp1.y - lh * inner_curve}
    const v: Coords2D = {x: cp1.x, y: cp1.y - lv}


    g.moveTo(u.x, u.y)

    // if the height of the branch is too low, do not draw a quadratic curve
    if (u.y - v.y < girth * 1.1 || lh < girth) {
        g.lineTo(cp1.x, cp1.y)
    } else {
        g.lineTo(ub.x, ub.y)
        g.quadraticCurveTo(cp1.x, cp1.y, vb.x, vb.y)
    }

    g.lineTo(v.x, v.y)


    return v
}


/**
 * takes in the start vec control point and end vec of a quadratic curve and a unit interval and returns a u,cp and v of the curve
 * that stops unit_interval of the way through the curve
 * @param u
 * @param cp
 * @param v
 * @param unit_interval
 */
function partialQuadraticCurve(u: Coords2D, cp: Coords2D, v: Coords2D, unit_interval: number): [Coords2D, Coords2D, Coords2D] {
    // Ensure unit_interval is between 0 and 1
    unit_interval = Math.max(0, Math.min(1, unit_interval));

    // Calculate the new endpoint
    const n_v = {
        x: u.x + (cp.x - u.x) * unit_interval * 2 + (v.x - 2 * cp.x + u.x) * unit_interval * unit_interval,
        y: u.y + (cp.y - u.y) * unit_interval * 2 + (v.y - 2 * cp.y + u.y) * unit_interval * unit_interval
    };

    // Calculate the new control point
    const n_cp = {
        x: u.x + (cp.x - u.x) * unit_interval,
        y: u.y + (cp.y - u.y) * unit_interval
    };

    return [u, n_cp, n_v];
}


/**
 * takes in u,cp and v of a quadratic curve and returns the inner and outer quadratic curves based on the thickness. the distance
 * between ui and uo should be thickness same with vi and vo. cpi and cpo should be such that when rendered, the thickness between the 2 curves
 * at all points corresponding to each other is thickness
 * @param u
 * @param cp
 * @param v
 * @param girth
 */
function calculateInnerAndOuterQuadraticCurves(u: Coords2D, cp: Coords2D, v: Coords2D, girth: number, mul: number): {
    inner: [Coords2D, Coords2D, Coords2D],
    outer: [Coords2D, Coords2D, Coords2D]
} {
    // Helper function to calculate the normal vector
    function calculateNormal(p1: Coords2D, p2: Coords2D): Coords2D {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const mag = Math.sqrt(dx * dx + dy * dy);
        return {x: -dy / mag, y: dx / mag}; // Rotate by 90 degrees
    }

    // Calculate tangent vectors at start and end points (approximation)
    const u_cp_t = calculateNormal(u, cp);
    const cp_v_t = calculateNormal(cp, v);

    // u_cp_t.y = Math.abs(u_cp_t.y)
    // cp_v_t.x = mul * cp_v_t.x

    // Calculate the inner and outer control points by moving the points along the normals
    const r = girth / 2;

    const ui: Coords2D = {
        x: u.x,
        y: u.y - r
    };
    const uo: Coords2D = {
        x: u.x,
        y: u.y + r
    };
    const vi: Coords2D = {
        x: v.x + r * mul,
        y: v.y
    };
    const vo: Coords2D = {
        x: v.x - r * mul,
        y: v.y
    };

    // Assuming the control point is shifted in the same way
    const cpi: Coords2D = {
        x: cp.x + (u_cp_t.x + cp_v_t.x) * r,
        y: cp.y + (u_cp_t.y + cp_v_t.y) * r
    };
    const cpo: Coords2D = {
        x: cp.x - (u_cp_t.x + cp_v_t.x) * r,
        y: cp.y - (u_cp_t.y + cp_v_t.y) * r
    };

    return {
        inner: [ui, mul == 1 ? cpi : cpo, vi],
        outer: [uo, mul == 1 ? cpo : cpi, vo]
    };
}

function renderEdgeBranch(u: Coords2D, g: PixiGraphics, config: NormalBranchConfig, direction: BranchDirection, completion: number): void {
    const {girth: gu, v_length: lv, h_length: lh} = config;
    const ru = gu / 2
    const mul = direction === 'left' ? 1 : -1;

    const ui: Coords2D = {x: u.x, y: u.y - ru}
    const uo: Coords2D = {x: u.x, y: u.y + ru}

    // the vertical and horizontal proportions of the total length, for use in completion calculation
    const vpp = lv / (lv + lh)
    const hpp = lh / (lv + lh)

    g.moveTo(ui.x, ui.y);

    // we do not draw a curve, just an edge
    if (completion <= hpp) {
        const h_completion = completion / hpp
        const vvi: Coords2D = {x: ui.x - lh * h_completion * mul, y: ui.y}
        const vvo: Coords2D = {x: uo.x - lh * h_completion * mul, y: uo.y}

        g.lineTo(vvi.x, vvi.y);
        g.lineTo(vvo.x, vvo.y);
        g.lineTo(uo.x, uo.y);

        g.endFill()
        return
    } else {
        const v_completion = (completion - hpp) / vpp

        const cci: Coords2D = {x: ui.x - (lh - ru) * mul, y: ui.y}
        const cco: Coords2D = {x: uo.x - (lh + ru) * mul, y: uo.y}

        const vvi: Coords2D = {x: ui.x - (lh - ru) * mul, y: ui.y - v_completion * (lv - ru)}
        const vvo: Coords2D = {x: uo.x - (lh + ru) * mul, y: uo.y - v_completion * (lv + ru)}


        g.lineTo(cci.x, cci.y)
        g.lineTo(vvi.x, vvi.y)
        g.lineTo(vvo.x, vvo.y)
        g.lineTo(cco.x, cco.y)
        g.lineTo(uo.x, uo.y)

        g.endFill()
        return
    }

}

export function renderBranchV3(u: Coords2D, g: PixiGraphics, config: NormalBranchConfig, direction: BranchDirection, completion: number): void {

    const {girth: gu, v_length: lv, h_length: lh, inner_curve: c} = config;
    const ru = gu / 2;  // Radius of the branch
    const mul = direction === 'left' ? 1 : -1;

    if (lh <= gu || lv <= gu) {
        // we do not draw a curve, just an edge
        return renderEdgeBranch(u, g, config, direction, completion)
    }

    /**
     * the curve radius of the branch quadratic curve
     */
    const cr = c * Math.min(lh, lv)


    // branch endpoint
    const cp: Coords2D = {x: u.x - lh * mul, y: u.y};
    const v: Coords2D = {x: u.x - lh * mul, y: u.y - lv};

    const ucp: Coords2D = {x: u.x - (lh - cr) * mul, y: u.y}
    const vcp: Coords2D = {x: v.x, y: v.y + (lv - cr)}

    const {
        outer: [ucpo, cpo, vcpo],
        inner: [ucpi, cpi, vcpi]
    } = calculateInnerAndOuterQuadraticCurves(ucp, cp, vcp, gu, mul);

    // g.beginFill('red')
    // g.drawCircle(ucpi.x, ucpi.y, 3)
    // g.drawCircle(ucpo.x, ucpo.y, 3)

    // g.beginFill('green')
    // g.drawCircle(cpi.x, cpi.y, 3)
    // g.drawCircle(cpo.x, cpo.y, 3)

    // g.beginFill('blue')
    // g.drawCircle(vcpi.x, vcpi.y, 3)
    // g.drawCircle(vcpo.x, vcpo.y, 3)


    const ui: Coords2D = {x: u.x, y: u.y - ru}
    const uo: Coords2D = {x: u.x, y: u.y + ru}

    // the vertical and horizontal proportions of the total length, for use in completion calculation
    const vpp = lv / (lv + lh)
    const hpp = lh / (lv + lh)
    const cpp = cr / (lv + lh)

    g.moveTo(ui.x, ui.y);

    // if the completion is before the curves starts, the branch is a simple rectangle
    if (completion <= hpp - cpp) {
        const h_completion = completion / hpp
        const vvi: Coords2D = {x: ui.x - lh * h_completion * mul, y: ui.y}
        const vvo: Coords2D = {x: uo.x - lh * h_completion * mul, y: uo.y}

        g.lineTo(vvi.x, vvi.y);
        g.lineTo(vvo.x, vvo.y);
        g.lineTo(uo.x, uo.y);

        g.endFill()
        return
    }
    // if the completion is between when the curve starts and before it ends, the branch is a partially complete curve
    if (completion > hpp - cpp && completion <= hpp + cpp) {
        const curve_completion = (completion - (hpp - cpp)) / (2 * cpp)
        // for both outer and inner curves, we get the partial cp and v
        const [_ui, ccpi, vvi] = partialQuadraticCurve(ucpi, cpi, vcpi, curve_completion)
        const [_uo, ccpo, vvo] = partialQuadraticCurve(ucpo, cpo, vcpo, curve_completion)


        g.lineTo(ucpi.x, ucpi.y)
        g.quadraticCurveTo(ccpi.x, ccpi.y, vvi.x, vvi.y)
        g.lineTo(vvo.x, vvo.y)
        g.quadraticCurveTo(ccpo.x, ccpo.y, ucpo.x, ucpo.y)
        g.lineTo(uo.x, uo.y)

        g.endFill()
        return
    }

    // if the completion is after the completion of the curve, we draw the whole curve then the partial rectangle after
    if (completion > hpp + cpp) {
        const v_completion = (completion - hpp - cpp) / (vpp - cpp)
        const vvi: Coords2D = {x: vcpi.x, y: vcpi.y - (lv - cr) * v_completion}
        const vvo: Coords2D = {x: vcpo.x, y: vcpo.y - (lv - cr) * v_completion}

        g.lineTo(ucpi.x, ucpi.y)
        g.quadraticCurveTo(cpi.x, cpi.y, vcpi.x, vcpi.y)
        g.lineTo(vvi.x, vvi.y)
        g.lineTo(vvo.x, vvo.y)
        g.lineTo(vcpo.x, vcpo.y)
        g.quadraticCurveTo(cpo.x, cpo.y, ucpo.x, ucpo.y)
        g.lineTo(uo.x, uo.y)

        g.endFill()
        return
    }
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
