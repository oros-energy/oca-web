# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
from odoo.tests import HttpCase, tagged


@tagged("post_install", "-at_install")
class TestTimelineView(HttpCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.view = cls.env["ir.ui.view"].create(
            {
                "name": "ir.cron.timeline.test",
                "model": "ir.cron",
                "type": "timeline",
                "arch": '<timeline date_start="nextcall" default_group_by="model_id"/>',
            }
        )
        cls.action = cls.env["ir.actions.act_window"].create(
            {
                "name": "Cron timeline (test)",
                "res_model": "ir.cron",
                "view_mode": "timeline,list",
                "view_id": cls.view.id,
            }
        )

    def test_view_definition(self):
        self.assertEqual(self.view.type, "timeline")
        views = self.env["ir.cron"].get_views([(self.view.id, "timeline")])
        self.assertIn("timeline", views["views"])

    def test_timeline_view_loads(self):
        self.start_tour(
            f"/odoo/action-{self.action.id}", "web_timeline_view_loads", login="admin"
        )
