/**
 * Apps Script cho thiệp mời Trương Thế Bách — DAV
 *
 * BẮT BUỘC sau khi dán:
 * Deploy → Manage deployments → biểu tượng bút → Version: New version → Deploy
 *
 * Execute as: Me
 * Who has access: Anyone
 *
 * Sheet:
 * https://docs.google.com/spreadsheets/d/1F3GS5Id72F1PDbfLJ6922QqQ4e_tFajzib36mdNjRrQ
 */

var SHEET_ID = '1F3GS5Id72F1PDbfLJ6922QqQ4e_tFajzib36mdNjRrQ';
var ADMIN_KEY = 'bach2026';

function ss_() {
  return SpreadsheetApp.openById(SHEET_ID);
}

function json_(obj, callback) {
  var text = JSON.stringify(obj);
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + text + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(text)
    .setMimeType(ContentService.MimeType.JSON);
}

function ensureSheets_() {
  var ss = ss_();
  var specs = {
    Guests: ['name', 'aliases', 'relation', 'message', 'honorific'],
    Responses: ['timestamp', 'guest_name', 'attending', 'companions', 'phone', 'message_to_bach', 'user_agent', 'opened_at'],
    Opens: ['timestamp', 'guest_name', 'match_type', 'referrer']
  };
  Object.keys(specs).forEach(function (name) {
    var sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    var headers = specs[name];
    var first = sh.getRange(1, 1, 1, headers.length).getValues()[0];
    var empty = first.every(function (c) { return !c; });
    if (empty) sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  });
}

function rowsAsObjects_(sheetName) {
  var sh = ss_().getSheetByName(sheetName);
  if (!sh) return [];
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values.shift().map(function (h) { return String(h).trim(); });
  return values
    .filter(function (r) { return r.some(function (c) { return c !== '' && c !== null; }); })
    .map(function (r) {
      var o = {};
      headers.forEach(function (h, i) { o[h] = r[i]; });
      return o;
    });
}

function parseBody_(e) {
  var data = {};
  if (e && e.parameter) {
    Object.keys(e.parameter).forEach(function (k) { data[k] = e.parameter[k]; });
  }
  if (e && e.postData && e.postData.contents) {
    try {
      var parsed = JSON.parse(e.postData.contents);
      Object.keys(parsed).forEach(function (k) { data[k] = parsed[k]; });
    } catch (err) {}
  }
  return data;
}

function writeOpen_(data) {
  ensureSheets_();
  ss_().getSheetByName('Opens').appendRow([
    new Date(),
    data.guest_name || '',
    data.match_type || '',
    data.referrer || ''
  ]);
}

function writeResponse_(data) {
  ensureSheets_();
  ss_().getSheetByName('Responses').appendRow([
    new Date(),
    data.guest_name || '',
    data.attending || '',
    data.companions || 0,
    data.phone || '',
    data.message_to_bach || '',
    data.user_agent || '',
    data.opened_at || ''
  ]);
}

function handle_(data) {
  var action = String(data.action || '');
  if (action === 'open') {
    writeOpen_(data);
    return { ok: true, saved: 'open' };
  }
  if (action === 'submit') {
    writeResponse_(data);
    return { ok: true, saved: 'submit' };
  }
  if (action === 'list') {
    if (ADMIN_KEY && data.key && data.key !== ADMIN_KEY) {
      return { ok: false, error: 'unauthorized' };
    }
    return {
      ok: true,
      guests: rowsAsObjects_('Guests'),
      opens: rowsAsObjects_('Opens'),
      responses: rowsAsObjects_('Responses')
    };
  }
  ensureSheets_();
  return { ok: true, guests: rowsAsObjects_('Guests') };
}

function doPost(e) {
  return json_(handle_(parseBody_(e)));
}

function doGet(e) {
  var data = (e && e.parameter) ? e.parameter : {};
  return json_(handle_(data), data.callback);
}
