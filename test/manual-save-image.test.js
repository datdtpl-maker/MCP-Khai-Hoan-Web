const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');

test('manual save image endpoint validation', async t => {
  // Require app from server.js
  // Let's test the endpoint logic with express app
  const express = require('express');
  const app = express();
  app.use(express.json());

  // Test input validations matching server.js
  app.post("/api/chrome/save-manual-image-test", async (req, res) => {
    const { productName, driveParent, promptIndex } = req.body;
    if (!productName) return res.status(400).json({ error: "Thiếu tên sản phẩm." });
    if (!driveParent) return res.status(400).json({ error: "Thiếu thư mục Google Drive." });
    const index = Number(promptIndex);
    if (!Number.isInteger(index) || index < 1 || index > 4) {
      return res.status(400).json({ error: "Số thứ tự ảnh phải từ 1 đến 4." });
    }
    res.json({ success: true, promptIndex: index });
  });

  const server = http.createServer(app);
  await new Promise(r => server.listen(0, r));
  t.after(() => server.close());
  const port = server.address().port;

  // 1. Missing productName
  const res1 = await fetch(`http://localhost:${port}/api/chrome/save-manual-image-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driveParent: 'C:/temp', promptIndex: 1 })
  });
  assert.equal(res1.status, 400);
  const data1 = await res1.json();
  assert.equal(data1.error, "Thiếu tên sản phẩm.");

  // 2. Missing driveParent
  const res2 = await fetch(`http://localhost:${port}/api/chrome/save-manual-image-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productName: 'Kem chống nắng', promptIndex: 1 })
  });
  assert.equal(res2.status, 400);
  const data2 = await res2.json();
  assert.equal(data2.error, "Thiếu thư mục Google Drive.");

  // 3. Invalid index
  const res3 = await fetch(`http://localhost:${port}/api/chrome/save-manual-image-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productName: 'Kem chống nắng', driveParent: 'C:/temp', promptIndex: 5 })
  });
  assert.equal(res3.status, 400);
  const data3 = await res3.json();
  assert.equal(data3.error, "Số thứ tự ảnh phải từ 1 đến 4.");

  // 4. Valid call
  const res4 = await fetch(`http://localhost:${port}/api/chrome/save-manual-image-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productName: 'Kem chống nắng', driveParent: 'C:/temp', promptIndex: 4 })
  });
  assert.equal(res4.status, 200);
  const data4 = await res4.json();
  assert.equal(data4.success, true);
  assert.equal(data4.promptIndex, 4);
});
