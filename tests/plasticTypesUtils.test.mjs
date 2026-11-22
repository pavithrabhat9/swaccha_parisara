import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizePlasticCodeParam,
  getRecyclabilityStatus,
  getPlasticCategory,
  filterPlasticTypes,
  getPlasticAnchorId,
} from '../src/utils/plasticTypesUtils.js';
import { PLASTIC_TYPES_GUIDE } from '../src/data/plasticTypesGuide.js';
import { learnApi } from '../src/services/learnApi.js';
import { devControls } from '../src/services/devControls.js';

test('normalizePlasticCodeParam resolves numeric codes, abbreviations, and resin hash anchors', () => {
  assert.equal(normalizePlasticCodeParam('1'), 1);
  assert.equal(normalizePlasticCodeParam('#2'), 2);
  assert.equal(normalizePlasticCodeParam('pet'), 1);
  assert.equal(normalizePlasticCodeParam('PETE'), 1);
  assert.equal(normalizePlasticCodeParam('HDPE'), 2);
  assert.equal(normalizePlasticCodeParam('pvc'), 3);
  assert.equal(normalizePlasticCodeParam('LDPE'), 4);
  assert.equal(normalizePlasticCodeParam('pp'), 5);
  assert.equal(normalizePlasticCodeParam('ps'), 6);
  assert.equal(normalizePlasticCodeParam('other'), 7);
  assert.equal(normalizePlasticCodeParam('#resin-5'), 5);
  assert.equal(normalizePlasticCodeParam('resin-7'), 7);
  assert.equal(normalizePlasticCodeParam('0'), null);
  assert.equal(normalizePlasticCodeParam('8'), null);
  assert.equal(normalizePlasticCodeParam('unknown'), null);
  assert.equal(normalizePlasticCodeParam(''), null);
  assert.equal(normalizePlasticCodeParam(null), null);
});

test('getRecyclabilityStatus and getPlasticCategory map all 7 statuses consistently', () => {
  assert.equal(getRecyclabilityStatus('widely'), 'widely');
  assert.equal(getRecyclabilityStatus('yes'), 'widely');
  assert.equal(getRecyclabilityStatus('sometimes'), 'sometimes');
  assert.equal(getRecyclabilityStatus('limited'), 'sometimes');
  assert.equal(getRecyclabilityStatus('rarely'), 'rarely');
  assert.equal(getRecyclabilityStatus('special'), 'rarely');
  assert.equal(getRecyclabilityStatus('no'), 'rarely');

  assert.equal(getPlasticCategory('widely'), 'recyclable');
  assert.equal(getPlasticCategory('yes'), 'recyclable');
  assert.equal(getPlasticCategory('sometimes'), 'special');
  assert.equal(getPlasticCategory('limited'), 'special');
  assert.equal(getPlasticCategory('special'), 'special');
  assert.equal(getPlasticCategory('rarely'), 'not_recyclable');
  assert.equal(getPlasticCategory('no'), 'not_recyclable');
});

test('filterPlasticTypes preserves resin order 1..7 and supports all/recyclable/special/not_recyclable', () => {
  const all = filterPlasticTypes(PLASTIC_TYPES_GUIDE.types, 'all');
  assert.deepEqual(all.map((t) => t.code), [1, 2, 3, 4, 5, 6, 7]);

  const widely = filterPlasticTypes(PLASTIC_TYPES_GUIDE.types, 'recyclable');
  assert.deepEqual(widely.map((t) => t.code), [1, 2]);

  const sometimes = filterPlasticTypes(PLASTIC_TYPES_GUIDE.types, 'special');
  assert.deepEqual(sometimes.map((t) => t.code), [4, 5]);

  const rarely = filterPlasticTypes(PLASTIC_TYPES_GUIDE.types, 'not_recyclable');
  assert.deepEqual(rarely.map((t) => t.code), [3, 6, 7]);
});

test('getPlasticAnchorId generates stable anchor IDs', () => {
  assert.equal(getPlasticAnchorId(1), 'resin-1');
  assert.equal(getPlasticAnchorId(7), 'resin-7');
});

test('PLASTIC_TYPES_GUIDE has complete original content, local image paths, alt text, and zero political terms', () => {
  assert.equal(PLASTIC_TYPES_GUIDE.types.length, 7);
  assert.equal(PLASTIC_TYPES_GUIDE.relatedGuides.length, 3);
  assert.equal(PLASTIC_TYPES_GUIDE.introParagraphs.length, 2);

  const expectedSlugs = ['pet', 'hdpe', 'pvc', 'ldpe', 'pp', 'ps', 'other'];
  const expectedStatuses = ['widely', 'widely', 'rarely', 'sometimes', 'sometimes', 'rarely', 'rarely'];

  PLASTIC_TYPES_GUIDE.types.forEach((item, idx) => {
    assert.equal(item.code, idx + 1);
    assert.equal(item.slug, expectedSlugs[idx]);
    assert.equal(item.status, expectedStatuses[idx]);
    assert.equal(item.imagePath, `/images/learn/plastic-types/${expectedSlugs[idx]}.jpg`);
    assert.ok(item.imageAlt && item.imageAlt.length > 10, `Missing alt for code ${item.code}`);
    assert.ok(item.whatItIs && item.whatItIs.length > 30, `Missing whatItIs for code ${item.code}`);
    assert.ok(Array.isArray(item.examples) && item.examples.length >= 3, `Missing examples for code ${item.code}`);
    assert.ok(item.recyclabilityExplanation && item.recyclabilityExplanation.length > 15);
    assert.ok(item.tip && item.tip.length > 15);
  });

  const serialized = JSON.stringify(PLASTIC_TYPES_GUIDE).toLowerCase();
  assert.equal(/\b(mla|mp|politician|minister|party)\b/.test(serialized), false);
});

test('learnApi.getPlasticTypesGuide returns cloned guide data and respects simulated failure', async () => {
  devControls.setSimulation({ fail: false, delayMs: 0 });
  const guide = await learnApi.getPlasticTypesGuide();
  assert.equal(guide.types.length, 7);
  assert.equal(guide.types[0].abbreviation, 'PET');

  devControls.setSimulation({ fail: 'learn', delayMs: 0 });
  await assert.rejects(() => learnApi.getPlasticTypesGuide(), /Simulated learn service failure/);
  devControls.setSimulation({ fail: false, delayMs: 0 });
});

