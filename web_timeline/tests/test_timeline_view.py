# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
from odoo.tests import TransactionCase, tagged


@tagged("post_install", "-at_install")
class TestTimelineView(TransactionCase):
    def test_view_definition(self):
        view = self.env["ir.ui.view"].create(
            {
                "name": "ir.cron.timeline.test",
                "model": "ir.cron",
                "type": "timeline",
                "arch": '<timeline date_start="nextcall" default_group_by="model_id"/>',
            }
        )
        views = self.env["ir.cron"].get_views([(view.id, "timeline")])
        self.assertIn("timeline", views["views"])
