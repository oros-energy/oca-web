/* License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html). */
import {registry} from "@web/core/registry";

registry.category("web_tour.tours").add("web_timeline_view_loads", {
    steps: () => [
        {
            content: "The timeline renderer and the vis-timeline canvas are shown",
            trigger: ".oe_timeline_view .oe_timeline_widget .vis-timeline",
        },
        {
            content: "Switch the scale to week",
            trigger: ".oe_timeline_button_scale_week",
            run: "click",
        },
        {
            content: "The week scale is active",
            trigger: ".oe_timeline_button_scale_week.btn-primary",
        },
    ],
});
