/**
 * sidebar.js — shared sidebar for all pages.
 * Edit overviewLinks / resourceLinks here to update navigation across the entire site.
 */
(function () {
  const OWNER_ID = '1195147448541261855';
  const SB_URL = 'https://pwbvvzskdzuccnskduiz.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3YnZ2enNrZHp1Y2Nuc2tkdWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MDcyMTMsImV4cCI6MjA4NzI4MzIxM30.r5G_RQgEkudLkSLn4QUBviJAzum3tHm2Z4zqytxl1kQ';

  // ── Edit these arrays to add / remove / reorder nav links ──────────────────
  const overviewLinks = [
    { href: 'index.html',           label: 'Home' },
    { href: 'index.html#features',  label: 'Features' },
    { href: 'index.html#updates',   label: 'Updates' },
    { href: 'index.html#stats',     label: 'Stats' },
  ];
  const resourceLinks = [
    { href: 'changelog.html',   label: 'Changelog' },
    { href: 'settings.html',    label: 'Settings' },
    { href: 'marketplace.html', label: 'Marketplace' },
  ];
  // ──────────────────────────────────────────────────────────────────────────

  const page = location.pathname.split('/').pop() || 'index.html';

  function isActive(href) {
    return href.split('#')[0].split('/').pop() === page;
  }
  function navHtml(links) {
    return links.map(l =>
      `<a href="${l.href}"${isActive(l.href) ? ' class="active"' : ''}>${l.label}</a>`
    ).join('');
  }

  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const resourcesGroup = `<div class="sidebar-group"><h4>Resources</h4><nav class="nav-links">${navHtml(resourceLinks)}<a href="admin.html" id="adminLink" style="display:none">Admin</a></nav></div>`;

  if (sidebar.querySelector('#homeNav')) {
    // Page has its own scroll-spy Overview (index.html, changelog.html) — only inject Resources
    const last = sidebar.querySelector('.sidebar-group:last-child');
    if (last && !last.querySelector('#homeNav')) last.remove();
    sidebar.insertAdjacentHTML('beforeend', resourcesGroup);
  } else {
    // Replace entire sidebar (settings.html, marketplace.html, etc.)
    sidebar.innerHTML = `<div class="sidebar-group"><h4>Overview</h4><nav class="nav-links">${navHtml(overviewLinks)}</nav></div>${resourcesGroup}`;
  }

  // Show admin link for logged-in admins using cached localStorage data
  async function checkAdmin() {
    try {
      const raw = localStorage.getItem('incorp_user');
      if (!raw) return;
      const user = JSON.parse(raw);
      if (!user?.id) return;
      const link = document.getElementById('adminLink');
      if (!link) return;
      if (user.id === OWNER_ID) { link.style.display = ''; return; }
      const res = await fetch(
        `${SB_URL}/rest/v1/user_settings?discord_id=eq.${user.id}&select=is_admin`,
        { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
      );
      if (!res.ok) return;
      const rows = await res.json();
      if (rows?.[0]?.is_admin) link.style.display = '';
    } catch {}
  }

  checkAdmin();
})();
