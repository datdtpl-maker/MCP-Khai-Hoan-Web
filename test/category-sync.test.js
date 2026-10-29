const test = require('node:test');
const assert = require('node:assert/strict');
const {
  decodeHtmlEntities,
  formatCategories,
  getFallbackCategories,
  getCategories
} = require('../lib/category-sync');

test('decodeHtmlEntities decodes common HTML entities in category names', () => {
  assert.equal(decodeHtmlEntities('Bông, băng &amp; gạc'), 'Bông, băng & gạc');
  assert.equal(decodeHtmlEntities('Mẹ &amp; bé'), 'Mẹ & bé');
  assert.equal(decodeHtmlEntities('&#039;Test&#039;'), "'Test'");
  assert.equal(decodeHtmlEntities('&quot;Trị mụn&quot;'), '"Trị mụn"');
  assert.equal(decodeHtmlEntities(null), '');
});

test('formatCategories builds hierarchy with parent and children', () => {
  const raw = [
    { id: 1, name: 'Dược mỹ phẩm', parent: 0, count: 10 },
    { id: 2, name: 'Chăm sóc da mụn', parent: 1, count: 5 },
    { id: 3, name: 'Dưỡng ẩm da', parent: 1, count: 3 },
    { id: 4, name: 'Thuốc', parent: 0, count: 20 }
  ];

  const { categories, tree } = formatCategories(raw);
  assert.equal(categories.length, 4);
  assert.equal(tree.length, 2);

  const duocMyPhamNode = categories.find(c => c.name === 'Dược mỹ phẩm');
  assert.ok(duocMyPhamNode);
  assert.equal(duocMyPhamNode.isParent, true);
  assert.equal(duocMyPhamNode.children.length, 2);

  const daMunNode = categories.find(c => c.name === 'Chăm sóc da mụn');
  assert.ok(daMunNode);
  assert.equal(daMunNode.isParent, false);
  assert.equal(daMunNode.fullName, 'Dược mỹ phẩm > Chăm sóc da mụn');
  assert.equal(daMunNode.parent, 1);
});

test('getFallbackCategories returns standard categories for derma and pharma', () => {
  const derma = getFallbackCategories('derma');
  assert.equal(derma.siteType, 'derma');
  assert.equal(derma.categories.length, 12);
  assert.ok(derma.categories.some(c => c.name === 'Trị Mụn'));

  const pharma = getFallbackCategories('pharma');
  assert.equal(pharma.siteType, 'pharma');
  assert.ok(pharma.categories.length >= 40);
  assert.ok(pharma.categories.some(c => c.name === 'Chăm sóc da mụn'));
  assert.ok(pharma.categories.some(c => c.fullName === 'Dược mỹ phẩm > Chăm sóc da mụn'));
});
