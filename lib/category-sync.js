const fs = require('fs').promises;
const { existsSync } = require('fs');
const path = require('path');

const SITE_URLS = {
  derma: 'https://khaihoanderma.com',
  pharma: 'https://khaihoanpharma.com'
};

const DEFAULT_DERMA_CATEGORIES = [
  'Phục hồi da', 'Trị Mụn', 'Chăm Sóc Da', 'Chăm Sóc Mắt',
  'Chống Nắng', 'Cơ Thể', 'Dưỡng Ẩm', 'Làm Sạch Da',
  'Môi', 'Phụ Kiện', 'Thuốc', 'Tóc'
].map((name, index) => ({
  id: index + 1,
  name,
  fullName: name,
  parent: 0,
  parentName: null,
  isParent: true,
  children: []
}));

const DEFAULT_PHARMA_TREE = [
  {
    name: 'Chăm sóc cá nhân',
    children: [
      'Chăm sóc răng miệng',
      'Miếng dán, dầu & cao xoa',
      'Sức khỏe giới tính',
      'Vệ sinh cơ thể'
    ]
  },
  {
    name: 'Dinh dưỡng & thực phẩm bổ sung',
    children: []
  },
  {
    name: 'Dược mỹ phẩm',
    children: [
      'Chăm sóc da mụn',
      'Chống nắng',
      'Dưỡng ẩm da',
      'Làm sạch da'
    ]
  },
  {
    name: 'Mẹ & bé',
    children: [
      'Chăm sóc bé',
      'Chăm sóc mẹ bầu & sau sinh'
    ]
  },
  {
    name: 'Thiết bị y tế',
    children: [
      'Máy đo đường huyết',
      'Máy đo huyết áp',
      'Máy xông khí dung',
      'Nhiệt kế',
      'Thiết bị theo dõi sức khỏe'
    ]
  },
  {
    name: 'Thuốc',
    children: [
      'Thuốc chăm sóc da & niêm mạc',
      'Thuốc chống dị ứng',
      'Thuốc cơ xương khớp',
      'Thuốc da liễu',
      'Thuốc đái tháo đường',
      'Thuốc đường uống',
      'Thuốc gan mật',
      'Thuốc huyết học',
      'Thuốc kháng vi sinh vật',
      'Thuốc kháng viêm',
      'Thuốc mắt, tai, mũi & họng',
      'Thuốc nhi khoa',
      'Thuốc nội tiết',
      'Thuốc thần kinh',
      'Thuốc tiêu hóa & dạ dày',
      'Thuốc tim mạch & huyết áp',
      'Thuốc tuyến yên & tuyến giáp',
      'Thuốc vitamin & khoáng chất'
    ]
  },
  {
    name: 'Thực phẩm bảo vệ sức khỏe',
    children: [
      'Hỗ trợ kiểm soát cân nặng',
      'Hỗ trợ làm đẹp',
      'Hỗ trợ tiêu hóa',
      'Hỗ trợ xương khớp',
      'Vitamin & khoáng chất'
    ]
  },
  {
    name: 'Vật tư y tế',
    children: [
      'Bông, băng & gạc',
      'Găng tay y tế',
      'Khẩu trang y tế',
      'Sát khuẩn & khử khuẩn'
    ]
  }
];

function buildDefaultPharmaCategories() {
  const list = [];
  let idCounter = 100;
  for (const group of DEFAULT_PHARMA_TREE) {
    const parentId = ++idCounter;
    const parentItem = {
      id: parentId,
      name: group.name,
      fullName: group.name,
      parent: 0,
      parentName: null,
      isParent: true,
      children: []
    };
    list.push(parentItem);
    for (const childName of group.children) {
      const childItem = {
        id: ++idCounter,
        name: childName,
        fullName: `${group.name} > ${childName}`,
        parent: parentId,
        parentName: group.name,
        isParent: false,
        children: []
      };
      parentItem.children.push({ id: childItem.id, name: childItem.name, fullName: childItem.fullName });
      list.push(childItem);
    }
  }
  return list;
}

function decodeHtmlEntities(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .trim();
}

function formatCategories(rawItems) {
  if (!Array.isArray(rawItems)) return [];

  const map = new Map();
  rawItems.forEach(item => {
    if (!item || typeof item.id !== 'number') return;
    map.set(item.id, {
      id: item.id,
      name: decodeHtmlEntities(item.name || ''),
      slug: item.slug || '',
      parent: typeof item.parent === 'number' ? item.parent : 0,
      count: item.count || 0
    });
  });

  const roots = [];
  const childrenByParent = new Map();

  map.forEach(item => {
    if (item.parent === 0) {
      roots.push(item);
    } else {
      if (!childrenByParent.has(item.parent)) childrenByParent.set(item.parent, []);
      childrenByParent.get(item.parent).push(item);
    }
  });

  roots.sort((a, b) => a.name.localeCompare(b.name, 'vi'));

  const result = [];
  const tree = [];

  for (const root of roots) {
    const children = childrenByParent.get(root.id) || [];
    children.sort((a, b) => a.name.localeCompare(b.name, 'vi'));

    const parentNode = {
      id: root.id,
      name: root.name,
      fullName: root.name,
      parent: 0,
      parentName: null,
      isParent: true,
      count: root.count,
      children: []
    };
    result.push(parentNode);

    const treeNode = {
      id: root.id,
      name: root.name,
      fullName: root.name,
      children: []
    };

    for (const child of children) {
      const childNode = {
        id: child.id,
        name: child.name,
        fullName: `${root.name} > ${child.name}`,
        parent: root.id,
        parentName: root.name,
        isParent: false,
        count: child.count,
        children: []
      };
      result.push(childNode);
      parentNode.children.push({ id: child.id, name: child.name, fullName: childNode.fullName });
      treeNode.children.push({ id: child.id, name: child.name, fullName: childNode.fullName });
    }

    tree.push(treeNode);
  }

  // Handle orphan categories (parent category not in root list)
  map.forEach(item => {
    if (item.parent !== 0 && !map.has(item.parent)) {
      const orphanNode = {
        id: item.id,
        name: item.name,
        fullName: item.name,
        parent: item.parent,
        parentName: 'Khác',
        isParent: false,
        count: item.count,
        children: []
      };
      result.push(orphanNode);
      tree.push({ id: item.id, name: item.name, fullName: item.name, children: [] });
    }
  });

  return { categories: result, tree };
}

async function fetchLiveCategories(siteType = 'derma') {
  const baseUrl = SITE_URLS[siteType] || SITE_URLS.derma;
  let page = 1;
  let allRaw = [];

  while (true) {
    const url = `${baseUrl}/wp-json/wp/v2/product_cat?per_page=100&page=${page}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'MCP-Khai-Hoan-Web/1.0' },
      signal: AbortSignal.timeout(12000)
    });

    if (!res.ok) break;
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) break;
    allRaw = allRaw.concat(data);
    if (data.length < 100) break;
    page++;
    if (page > 10) break; // safety limit
  }

  if (!allRaw.length) {
    throw new Error(`Không thể lấy danh mục từ website ${baseUrl}`);
  }

  const { categories, tree } = formatCategories(allRaw);
  return {
    siteType,
    url: baseUrl,
    total: categories.length,
    rootsCount: tree.length,
    categories,
    tree,
    scannedAt: new Date().toISOString()
  };
}

function getFallbackCategories(siteType = 'derma') {
  if (siteType === 'pharma') {
    const categories = buildDefaultPharmaCategories();
    const tree = categories.filter(c => c.isParent).map(p => ({
      id: p.id,
      name: p.name,
      fullName: p.fullName,
      children: p.children
    }));
    return {
      siteType: 'pharma',
      url: SITE_URLS.pharma,
      total: categories.length,
      rootsCount: tree.length,
      categories,
      tree,
      fallback: true
    };
  }

  const categories = DEFAULT_DERMA_CATEGORIES;
  const tree = categories.map(c => ({ id: c.id, name: c.name, fullName: c.fullName, children: [] }));
  return {
    siteType: 'derma',
    url: SITE_URLS.derma,
    total: categories.length,
    rootsCount: tree.length,
    categories,
    tree,
    fallback: true
  };
}

async function getCategories(siteType = 'derma', { cacheDir = null, forceRefresh = false } = {}) {
  const normalizedSite = siteType === 'pharma' ? 'pharma' : 'derma';
  const cacheFile = cacheDir ? path.join(cacheDir, `categories_${normalizedSite}.json`) : null;

  if (!forceRefresh && cacheFile && existsSync(cacheFile)) {
    try {
      const content = await fs.readFile(cacheFile, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.categories) && parsed.categories.length) {
        return parsed;
      }
    } catch {}
  }

  if (forceRefresh) {
    try {
      const liveData = await fetchLiveCategories(normalizedSite);
      if (cacheFile) {
        try {
          await fs.writeFile(cacheFile, JSON.stringify(liveData, null, 2), 'utf8');
        } catch {}
      }
      return liveData;
    } catch (err) {
      // If live fetch fails, try cache before fallback
      if (cacheFile && existsSync(cacheFile)) {
        try {
          const content = await fs.readFile(cacheFile, 'utf8');
          const parsed = JSON.parse(content);
          if (parsed && Array.isArray(parsed.categories) && parsed.categories.length) {
            parsed.fetchError = err.message;
            return parsed;
          }
        } catch {}
      }
      const fallback = getFallbackCategories(normalizedSite);
      fallback.fetchError = err.message;
      return fallback;
    }
  }

  // Not forced refresh, try live with fallback
  try {
    const liveData = await fetchLiveCategories(normalizedSite);
    if (cacheFile) {
      try {
        await fs.writeFile(cacheFile, JSON.stringify(liveData, null, 2), 'utf8');
      } catch {}
    }
    return liveData;
  } catch (err) {
    const fallback = getFallbackCategories(normalizedSite);
    fallback.fetchError = err.message;
    return fallback;
  }
}

module.exports = {
  SITE_URLS,
  DEFAULT_DERMA_CATEGORIES,
  decodeHtmlEntities,
  formatCategories,
  fetchLiveCategories,
  getFallbackCategories,
  getCategories
};
