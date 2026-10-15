# Copyright 2024 Tecnativa - Carlos Lopez
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
from odoo.tests import tagged

from odoo.addons.web.tests.test_js import HootCommon, unit_test_error_checker


@tagged("post_install", "-at_install")
class TestWebTimeline(HootCommon):
    def test_hoot(self):
        addons = self._get_addons_from_asset_bundle("web.assets_unit_tests")
        filters = self._get_hoot_module_filters(addons, ["web_timeline"])
        self.browser_js(
            f"/web/tests?headless&loglevel=2&preset=desktop&timeout=15000{filters}",
            "",
            "",
            login="admin",
            timeout=1800,
            success_signal="[HOOT] Test suite succeeded",
            error_checker=unit_test_error_checker,
        )
