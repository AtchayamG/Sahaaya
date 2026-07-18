async (page) => {
  await page.addScriptTag({ path: "node_modules/axe-core/axe.min.js" });
  const accessibility = await page.evaluate(async () => {
    const result = await globalThis.axe.run();
    return result.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
    }));
  });
  await page.setViewportSize({ width: 360, height: 800 });
  const viewport = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  return { accessibility, viewport };
}
