from odoo.tests import tagged

from odoo.addons.web.tests.test_js import HootCommon, unit_test_error_checker


@tagged("post_install", "-at_install")
class TestWebWidgetX2Many2DMatrix(HootCommon):
    def test_js(self):
        addons = self._get_addons_from_asset_bundle("web.assets_unit_tests")
        filters = self._get_hoot_module_filters(addons, ["web_widget_x2many_2d_matrix"])
        self.browser_js(
            f"/web/tests?headless&loglevel=2&preset=desktop&timeout=15000{filters}",
            "",
            "",
            login="admin",
            timeout=1800,
            success_signal="[HOOT] Test suite succeeded",
            error_checker=unit_test_error_checker,
        )
