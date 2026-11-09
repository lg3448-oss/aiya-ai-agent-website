"""Run with Python and Playwright installed; uses local Chrome, no live services."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import unittest

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class WebsiteChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT)))
        Thread(target=cls.server.serve_forever, daemon=True).start()
        cls.url = f'http://127.0.0.1:{cls.server.server_port}'
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(channel='chrome', headless=True)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()
        cls.server.shutdown()

    def setUp(self):
        self.page = self.browser.new_page(viewport={'width': 390, 'height': 844}, reduced_motion='reduce')
        self.page.goto(self.url)

    def tearDown(self):
        self.page.close()

    def test_mobile_menu_state_and_escape(self):
        menu = self.page.locator('[data-menu]')
        menu.click()
        self.assertEqual(menu.get_attribute('aria-expanded'), 'true')
        self.page.locator('[data-nav-links] a').first.click()
        self.assertEqual(menu.get_attribute('aria-expanded'), 'false', 'Following a link must reset expanded state')
        self.page.evaluate('scrollTo(0, 0)')
        menu.click()
        self.page.keyboard.press('Escape')
        self.assertEqual(menu.get_attribute('aria-expanded'), 'false')
        self.assertTrue(menu.evaluate('(el) => el === document.activeElement'))

    def test_menu_closes_outside_and_after_breakpoint_change(self):
        menu = self.page.locator('[data-menu]')
        menu.click()
        self.page.locator('.hero-actions').click(position={'x': 3, 'y': 3})
        self.assertEqual(menu.get_attribute('aria-expanded'), 'false')
        self.page.evaluate('scrollTo(0, 0)')
        menu.click()
        self.page.set_viewport_size({'width': 1200, 'height': 900})
        self.page.set_viewport_size({'width': 390, 'height': 844})
        self.page.wait_for_function('document.querySelector("[data-menu]").getAttribute("aria-expanded") === "false"')
        self.assertEqual(menu.get_attribute('aria-expanded'), 'false')

    def test_tool_selection_accessibility(self):
        tool = self.page.locator('.tool').first
        self.assertEqual(tool.get_attribute('aria-pressed'), 'true')
        tool.click()
        self.assertEqual(tool.get_attribute('aria-pressed'), 'false')
        self.assertEqual(self.page.locator('[data-count]').inner_text(), '3')

    def test_motion_controls_and_service_exploration(self):
        self.page.emulate_media(reduced_motion='no-preference')
        self.page.reload()
        control = self.page.locator('[data-motion-toggle]')
        self.assertEqual(control.count(), 1)
        control.click()
        self.assertEqual(control.get_attribute('aria-pressed'), 'true')
        self.page.locator('[data-orbit-service="1"]').click()
        self.assertIn('Connect', self.page.locator('[data-orbit-detail]').inner_text())
        self.page.emulate_media(reduced_motion='reduce')
        self.page.locator('#demo').scroll_into_view_if_needed()
        self.page.locator('[data-scenario="research"]').click()
        self.assertEqual(self.page.locator('[data-typed]').inner_text(), self.page.locator('[data-brief]').inner_text())
        self.assertEqual(self.page.locator('.satellite').first.evaluate('(el) => getComputedStyle(el).animationName'), 'none')

    def test_typing_and_orbits_pause_without_hiding_content(self):
        self.page.set_viewport_size({'width': 1366, 'height': 768})
        self.page.emulate_media(reduced_motion='no-preference')
        self.page.reload()
        self.page.locator('#demo').evaluate('(el)=>el.scrollIntoView({behavior:"instant"})')
        self.page.wait_for_function('document.querySelector("[data-typed]").classList.contains("is-typing")')
        self.assertEqual(self.page.locator('[data-typed]').get_attribute('aria-hidden'), 'true')
        self.page.locator('[data-motion-toggle]').click()
        self.assertEqual(self.page.locator('[data-typed]').inner_text(), self.page.locator('[data-brief]').inner_text())
        self.page.locator('#delivery').evaluate('(el)=>el.scrollIntoView({behavior:"instant"})')
        self.page.wait_for_function('document.querySelector(".service-universe").classList.contains("is-inview")')
        self.page.locator('[data-orbit-service="1"]').click(timeout=3000)
        self.assertIn('Connect', self.page.locator('[data-orbit-detail]').inner_text())
        satellite = self.page.locator('.satellite').first
        self.assertEqual(satellite.evaluate('(el)=>getComputedStyle(el).animationPlayState'), 'paused')
        self.page.locator('[data-motion-toggle]').click()
        self.assertEqual(satellite.evaluate('(el)=>getComputedStyle(el).animationPlayState'), 'running')

    def test_menu_icon_has_contrast(self):
        self.assertNotEqual(self.page.locator('.menu-button span').first.evaluate('(el) => getComputedStyle(el).backgroundColor'), 'rgb(255, 255, 255)')

    def test_self_hosted_fonts_load(self):
        self.assertGreater(self.page.evaluate('async family => (await document.fonts.load(`550 48px "${family}"`)).length', 'Bricolage Grotesque'), 0)
        self.assertGreater(self.page.evaluate('async family => (await document.fonts.load(`400 16px "${family}"`)).length', 'Instrument Sans'), 0)
        self.assertIn('Bricolage Grotesque', self.page.locator('h1').evaluate('(el) => getComputedStyle(el).fontFamily'))

    def test_workflow_and_integrated_images_share_the_hero(self):
        self.assertEqual(self.page.locator('.hero .hero-visual img').count(), 1)
        self.assertEqual(self.page.locator('.context-image img').count(), 1)
        artwork = self.page.locator('.hero-visual')
        self.assertEqual(artwork.evaluate('(el) => getComputedStyle(el).borderRadius'), '0px')
        self.assertNotEqual(artwork.evaluate('(el) => getComputedStyle(el).maskImage'), 'none')
        self.assertEqual(self.page.locator('#demo #workflow-panel').count(), 1)
        self.assertEqual(self.page.locator('#workflow-panel').count(), 1)
        self.page.get_by_role('button', name='Watch the workflow', exact=True).click(timeout=3000)
        self.assertEqual(self.page.locator('[data-stage="2"]').get_attribute('aria-pressed'), 'true')
        self.assertEqual(self.page.locator('[data-flow-status]').inner_text(), 'Ready for your review')

    def test_workflow_scenarios_and_stages(self):
        self.page.get_by_role('tab', name='Market research', exact=True).click(timeout=3000)
        self.assertIn('competitors', self.page.locator('[data-brief]').inner_text().lower())
        self.assertEqual(self.page.get_by_role('tab', name='Market research', exact=True).get_attribute('aria-selected'), 'true')
        self.page.locator('[data-stage="2"]').click()
        self.assertIn('review', self.page.locator('[data-output-title]').inner_text().lower())
        self.assertEqual(self.page.locator('[data-stage="2"]').get_attribute('aria-pressed'), 'true')
        self.page.get_by_role('tab', name='Content operations', exact=True).click()
        self.assertIn('content', self.page.locator('[data-brief]').inner_text().lower())
        self.assertEqual(self.page.locator('[data-stage="0"]').get_attribute('aria-pressed'), 'true')

    def test_animated_tour_can_pause_and_stops_at_review(self):
        self.page.emulate_media(reduced_motion='no-preference')
        self.page.get_by_role('button', name='Watch the workflow', exact=True).click()
        self.page.get_by_role('button', name='Pause workflow', exact=True).click()
        self.assertEqual(self.page.locator('[data-stage="0"]').get_attribute('aria-pressed'), 'true')
        self.page.get_by_role('button', name='Watch the workflow', exact=True).click()
        self.page.wait_for_function('document.querySelector("[data-flow-status]").textContent === "Ready for your review"', timeout=6000)
        self.assertEqual(self.page.locator('[data-stage="3"]').get_attribute('aria-pressed'), 'false')
        self.assertTrue(self.page.get_by_role('button', name='Replay workflow', exact=True).is_visible())

    def test_desktop_fullscreen_wheel_and_keyboard_navigation(self):
        self.page.set_viewport_size({'width': 1440, 'height': 900})
        self.page.reload()
        self.page.evaluate('() => document.fonts.ready')
        self.assertEqual(self.page.locator('[data-screen]').count(), 7)
        self.assertTrue(self.page.evaluate('document.documentElement.classList.contains("fullpage-ready")'))
        self.assertGreaterEqual(self.page.locator('[data-screen]').first.bounding_box()['height'], 899)
        self.assertGreaterEqual(float(self.page.locator('.eyebrow').evaluate('(el) => parseFloat(getComputedStyle(el).fontSize)')), 15)
        self.page.mouse.move(1100, 500)
        self.page.mouse.wheel(0, 160)
        self.page.wait_for_function('Math.abs(document.getElementById("demo").getBoundingClientRect().top) < 2', timeout=4000)
        self.page.keyboard.press('PageDown')
        self.page.wait_for_function('Math.abs(document.getElementById("delivery").getBoundingClientRect().top) < 2', timeout=4000)
        self.page.keyboard.press('PageUp')
        self.page.wait_for_function('Math.abs(document.getElementById("demo").getBoundingClientRect().top) < 2', timeout=4000)

    def test_mobile_keeps_natural_scrolling(self):
        self.assertFalse(self.page.evaluate('document.documentElement.classList.contains("fullpage-ready")'))
        self.page.mouse.wheel(0, 240)
        self.page.wait_for_function('scrollY > 50')
        self.assertLess(self.page.evaluate('scrollY'), self.page.locator('#demo').evaluate('(el) => el.offsetTop'))

    def test_desktop_animation_does_not_skip_chapters(self):
        self.page.set_viewport_size({'width': 1440, 'height': 900})
        self.page.emulate_media(reduced_motion='no-preference')
        self.page.reload()
        self.page.evaluate('() => document.fonts.ready')
        self.page.mouse.move(1100, 500)
        for _ in range(3):
            self.page.mouse.wheel(0, 160)
        self.page.wait_for_function('!document.documentElement.classList.contains("is-paging") && Math.abs(document.getElementById("demo").getBoundingClientRect().top)<2', timeout=5000)
        self.assertGreaterEqual(self.page.locator('#delivery').bounding_box()['y'], 899)
        self.assertTrue(self.page.locator('.nav').evaluate('(el) => el.contains(document.elementFromPoint(innerWidth-150,40))'))

    def test_expanded_faq_scrolls_before_next_chapter(self):
        self.page.set_viewport_size({'width': 1100, 'height': 650})
        self.page.reload()
        self.page.locator('#faq details').evaluate_all('(items) => items.forEach(item => item.open=true)')
        self.page.locator('#faq').evaluate('(el) => el.scrollIntoView({behavior:"instant",block:"start"})')
        self.page.wait_for_function('document.querySelector("#faq").getBoundingClientRect().height > innerHeight')
        start = self.page.evaluate('scrollY')
        self.page.mouse.move(800, 440)
        self.page.mouse.wheel(0, 120)
        self.page.wait_for_function('start => scrollY > start + 10', arg=start)
        self.assertLess(self.page.evaluate('scrollY'), self.page.locator('#contact').evaluate('(el) => el.offsetTop'))

    def test_workflow_keyboard_and_faq(self):
        first = self.page.get_by_role('tab', name='Restaurant marketing', exact=True)
        first.focus(timeout=3000)
        self.page.keyboard.press('ArrowRight')
        self.assertEqual(self.page.get_by_role('tab', name='Market research', exact=True).get_attribute('aria-selected'), 'true')
        self.page.keyboard.press('End')
        self.assertEqual(self.page.get_by_role('tab', name='Content operations', exact=True).get_attribute('aria-selected'), 'true')
        faq = self.page.locator('#faq details').first
        faq.locator('summary').focus()
        self.page.keyboard.press('Enter')
        self.assertTrue(faq.evaluate('(el) => el.open'))
        self.page.keyboard.press('Enter')
        self.assertFalse(faq.evaluate('(el) => el.open'))

    def test_workflow_is_local_and_reduced_motion_is_respected(self):
        requests = []
        self.page.on('request', lambda request: requests.append(request.url) if request.resource_type in ('fetch', 'xhr') or not request.url.startswith(self.url) else None)
        self.page.get_by_role('tab', name='Market research', exact=True).click()
        self.page.locator('[data-stage="3"]').click()
        self.assertEqual(requests, [], 'Workflow examples must not call live services')
        self.assertFalse(self.page.locator('.sample-output').evaluate('(el) => el.getAnimations().some(animation => animation.playState === "running")'))

    def test_navigation_targets_and_no_javascript_faq(self):
        missing = self.page.locator('a[href^="#"]').evaluate_all('(links) => links.map(link => link.getAttribute("href")).filter(hash => !document.getElementById(hash.slice(1)))')
        self.assertEqual(missing, [])
        context = self.browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 844})
        page = context.new_page()
        page.goto(self.url)
        faq = page.locator('#faq details').first
        faq.locator('summary').click()
        self.assertTrue(faq.evaluate('(el) => el.open'))
        self.assertTrue(page.locator('[data-brief]').is_visible())
        context.close()

    def test_no_javascript_content_visible(self):
        context = self.browser.new_context(java_script_enabled=False)
        page = context.new_page()
        page.goto(self.url)
        self.assertEqual(page.locator('.hero-copy').evaluate('(el) => getComputedStyle(el).opacity'), '1')
        context.close()

    def test_layout_assets_and_links(self):
        errors = []
        self.page.on('pageerror', lambda error: errors.append(str(error)))
        for width in (320, 390, 768, 1024, 1440):
            self.page.set_viewport_size({'width': width, 'height': 900})
            self.page.reload()
            self.assertTrue(self.page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Horizontal overflow at {width}px')
            self.assertEqual(self.page.locator('a[href*="trycloudflare"]').count(), 0)
            self.page.locator('.context-image').scroll_into_view_if_needed()
            self.page.locator('#workflow-panel').scroll_into_view_if_needed()
            self.page.wait_for_function('Array.from(document.images).every(img => img.complete && img.naturalWidth > 0)')
            self.assertTrue(self.page.locator('img').evaluate_all('(images) => images.every(img => img.complete && img.naturalWidth > 0)'))
            self.page.locator('[data-stage="2"]').click()
            self.assertTrue(self.page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
            self.page.locator('[data-stage="0"]').click()
            if width == 768:
                output = ROOT / 'output' / 'playwright'
                output.mkdir(parents=True, exist_ok=True)
                self.page.screenshot(path=str(output / 'tablet.png'), full_page=True)
        self.assertEqual(errors, [])
        output = ROOT / 'output' / 'playwright'
        output.mkdir(parents=True, exist_ok=True)
        self.page.evaluate('scrollTo(0,0)')
        self.page.reload()
        self.page.locator('.context-image').scroll_into_view_if_needed()
        self.page.wait_for_function('Array.from(document.images).every(img => img.complete && img.naturalWidth > 0)')
        self.page.evaluate('() => document.fonts.ready')
        self.page.evaluate('scrollTo(0,0)')
        self.page.screenshot(path=str(output / 'desktop.png'), full_page=True)
        self.page.locator('.hero').screenshot(path=str(output / 'hero-desktop.png'))
        self.page.locator('.control-note').screenshot(path=str(output / 'context-desktop.png'))
        self.page.set_viewport_size({'width': 390, 'height': 844})
        self.page.reload()
        self.page.locator('.context-image').scroll_into_view_if_needed()
        self.page.wait_for_function('Array.from(document.images).every(img => img.complete && img.naturalWidth > 0)')
        self.page.evaluate('() => document.fonts.ready')
        self.page.evaluate('scrollTo(0,0)')
        self.page.screenshot(path=str(output / 'mobile.png'), full_page=True)
        self.page.locator('.hero').screenshot(path=str(output / 'hero-mobile.png'))


if __name__ == '__main__':
    unittest.main()
