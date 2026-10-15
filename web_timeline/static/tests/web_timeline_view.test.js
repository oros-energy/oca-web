import {
    contains,
    defineModels,
    fields,
    models,
    mountView,
    onRpc,
    preloadBundle,
} from "@web/../tests/web_test_helpers";
import {describe, expect, test} from "@odoo/hoot";
import {queryAll} from "@odoo/hoot-dom";

describe.current.tags("desktop");

class Partner extends models.Model {
    name = fields.Char();
    _records = [
        {id: 1, name: "Partner 1"},
        {id: 2, name: "Partner 2"},
        {id: 3, name: "Partner 3"},
    ];
}

class Order extends models.Model {
    name = fields.Char();
    date_start = fields.Date();
    date_end = fields.Date();
    partner_id = fields.Many2one({relation: "partner"});
    _records = [
        {
            id: 1,
            name: "Record 1",
            date_start: "2024-01-01",
            date_end: "2024-01-02",
            partner_id: 1,
        },
        {
            id: 2,
            name: "Record 2",
            date_start: "2024-01-03",
            date_end: "2024-02-05",
            partner_id: 1,
        },
        {
            id: 3,
            name: "Record 3",
            date_start: "2024-01-10",
            date_end: "2024-01-15",
            partner_id: 2,
        },
        {
            id: 4,
            name: "Record 4",
            date_start: "2024-01-15",
            date_end: "2024-02-01",
            partner_id: 3,
        },
    ];
}

defineModels([Partner, Order]);
preloadBundle("web_timeline.vis-timeline_lib");
onRpc("has_access", () => true);

const ARCH = `<timeline date_start="date_start" date_stop="date_end" default_group_by="partner_id"/>`;
const BUTTONS = ["today", "scale_day", "scale_week", "scale_month", "scale_year"];

function checkActiveButton(active) {
    for (const button of BUTTONS) {
        const selector = `.oe_timeline_button_${button}`;
        if (button === active) {
            expect(selector).toHaveClass("btn-primary");
        } else {
            expect(selector).not.toHaveClass("btn-primary");
        }
    }
}

function getItemContents(text) {
    return queryAll(".vis-item-content").filter((el) => el.textContent.includes(text));
}

test("basic timeline view", async () => {
    await mountView({type: "timeline", resModel: "order", arch: ARCH});
    expect(".oe_timeline_view").toHaveCount(1);
});

test("click today slot", async () => {
    await mountView({type: "timeline", resModel: "order", arch: ARCH});
    await contains(".oe_timeline_button_today").click();
    checkActiveButton("today");
});

test("click month slot", async () => {
    await mountView({type: "timeline", resModel: "order", arch: ARCH});
    await contains(".oe_timeline_button_scale_month").click();
    checkActiveButton("scale_month");
});

test("delete button on a selected item", async () => {
    await mountView({type: "timeline", resModel: "order", arch: ARCH});
    const items = getItemContents("Record 2");
    expect(items).toHaveLength(1);
    await contains(items[0]).click();
    expect(items[0].parentElement.querySelectorAll(".vis-delete")).toHaveLength(1);
});

test("no delete button when delete is disabled", async () => {
    await mountView({
        type: "timeline",
        resModel: "order",
        arch: `<timeline date_start="date_start" date_stop="date_end" default_group_by="partner_id" delete="0"/>`,
    });
    const items = getItemContents("Record 2");
    expect(items).toHaveLength(1);
    await contains(items[0]).click();
    expect(items[0].parentElement.querySelectorAll(".vis-delete")).toHaveLength(0);
});
