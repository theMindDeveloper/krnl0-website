/* Download page: asks GitHub for the releases, offers the newest one for this computer, and lets you pick any
   other version. Every link starts on the releases page, so without script (or without GitHub) it still works. */
(() => {
  const REPO = 'theMindDeveloper/krnl0';
  const PAGE = `https://github.com/${REPO}/releases`;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const k = (name, r = document) => $(`[data-k="${name}"]`, r);

  // which computer is this
  const ua = navigator.userAgent, plat = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
  const phone = /iPhone|iPad|iPod|Android/i.test(ua) || (/Mac/i.test(plat) && navigator.maxTouchPoints > 1);
  const os = /Win/i.test(plat) || /Windows/i.test(ua) ? 'windows' : /Mac/i.test(plat) || /Mac OS X/i.test(ua) ? 'mac' : /Linux|X11/i.test(plat + ua) && !/Android/i.test(ua) ? 'linux' : 'windows';
  const NAME = { windows: 'Windows', mac: 'Mac', linux: 'Linux' };
  const SYS = { windows: 'Windows 10 and 11', mac: 'Mac with Apple silicon', linux: 'Linux' };
  const KIND = { windows: '.exe', mac: '.dmg', linux: '.AppImage' };

  // the installer for each system in one release
  const pick = (assets) => {
    const real = assets.filter((a) => !/\.blockmap$|\.yml$/i.test(a.name));
    const one = (re) => real.find((a) => re.test(a.name));
    return {
      windows: one(/\.exe$/i),
      mac: one(/arm64.*\.dmg$/i) || one(/\.dmg$/i),
      linux: one(/\.AppImage$/i) || one(/\.deb$/i) || one(/linux.*\.(tar\.gz|zip)$/i),
    };
  };
  const mb = (b) => `${Math.round(b / 1048576)} MB`;

  const box = $('.dl-box'), pickBox = $('.dl-pick'), btn = $('#ver-b'), list = $('#ver-list');
  if (phone) { const p = $('.dl-phone'); if (p) p.hidden = false; }
  box.dataset.os = os;
  k('label', box).textContent = phone ? 'On your computer' : 'Looks like you are on';
  k('sys', box).textContent = SYS[os];
  k('go-t', box).textContent = `Download for ${NAME[os]}`;
  $$('.dl-os').forEach((c) => c.classList.toggle('is-yours', c.dataset.os === os));

  let releases = [], cur = 0;

  const show = (i) => {
    cur = i; const r = releases[i]; if (!r) return;
    k('ver').textContent = i === 0 ? `${r.tag} · latest` : r.tag;
    $$('[role="option"]', list).forEach((o, j) => o.setAttribute('aria-selected', String(j === i)));
    // the big button: this computer's file for the chosen version
    const mine = r.files[os], go = k('go', box);
    if (mine) {
      go.href = mine.url; go.removeAttribute('aria-disabled');
      k('go-t', box).textContent = `Download for ${NAME[os]}`;
      k('meta', box).textContent = `Version ${r.tag.replace(/^v/, '')} · ${mine.size} · ${KIND[os]}`;
    } else {
      go.href = r.page;
      k('go-t', box).textContent = 'See this release on GitHub';
      k('meta', box).textContent = `${r.tag} has no ${NAME[os]} version yet. Pick another version, or see the release.`;
    }
    // the three cards
    $$('.dl-os').forEach((c) => {
      const f = r.files[c.dataset.os], a = $('.dl-file', c);
      // missing in this version: point at the newest version that has it, if any
      const alt = f ? null : releases.find((x) => x.files[c.dataset.os]);
      c.classList.toggle('is-none', !f);
      a.href = f ? f.url : alt ? alt.files[c.dataset.os].url : r.page;
      k('file', c).textContent = f ? `${f.name} · ${f.size} ↓` : alt ? `Not in ${r.tag} yet · get ${alt.tag} ↓` : 'Coming soon · see the releases';
    });
    const w = k('win-file'); if (w && r.files.windows) w.textContent = r.files.windows.name;
    const none = $('.dl-linux-none'); if (none) none.hidden = !!r.files.linux;
  };

  // the version list: an app-styled listbox, keyboard and pointer
  const open = (on) => {
    list.hidden = !on; btn.setAttribute('aria-expanded', String(on));
    if (on) { const o = $$('[role="option"]', list)[cur]; list.focus(); if (o) { list.setAttribute('aria-activedescendant', o.id); o.scrollIntoView({ block: 'nearest' }); } }
  };
  let hi = 0;
  const light = (j) => { const os_ = $$('[role="option"]', list); hi = Math.max(0, Math.min(os_.length - 1, j)); os_.forEach((o, n) => o.classList.toggle('hi', n === hi)); list.setAttribute('aria-activedescendant', os_[hi].id); os_[hi].scrollIntoView({ block: 'nearest' }); };
  btn.addEventListener('click', () => { const on = list.hidden; open(on); if (on) light(cur); });
  list.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); light(hi + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); light(hi - 1); }
    else if (e.key === 'Home') { e.preventDefault(); light(0); }
    else if (e.key === 'End') { e.preventDefault(); light(releases.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(hi); open(false); btn.focus(); }
    else if (e.key === 'Escape' || e.key === 'Tab') { open(false); if (e.key === 'Escape') btn.focus(); }
  });
  list.addEventListener('click', (e) => { const o = e.target.closest('[role="option"]'); if (!o) return; show(+o.dataset.i); open(false); btn.focus(); });
  document.addEventListener('pointerdown', (e) => { if (!list.hidden && !pickBox.contains(e.target)) open(false); });

  const fill = (rels) => {
    releases = rels; if (!rels.length) return;
    list.innerHTML = '';
    rels.forEach((r, i) => {
      const li = document.createElement('li');
      li.id = `ver-${i}`; li.role = 'option'; li.setAttribute('role', 'option'); li.dataset.i = String(i);
      const sys = ['windows', 'mac', 'linux'].filter((s) => r.files[s]).map((s) => NAME[s]).join(', ');
      li.innerHTML = `<b></b><span></span>`;
      li.firstChild.textContent = i === 0 ? `${r.tag} · latest` : r.tag;
      li.lastChild.textContent = `${r.date} · ${sys}`;
      list.append(li);
    });
    pickBox.hidden = false;
    // start on the newest version that has this computer's file
    const first = rels.findIndex((r) => r.files[os]);
    show(first < 0 ? 0 : first);
  };

  // GitHub's answer is kept for an hour, so moving around the site doesn't ask again
  try { const c = JSON.parse(sessionStorage.getItem('krnl-rels') || 'null'); if (c && Date.now() - c.at < 36e5) { fill(c.rels); return; } } catch (_) {}
  fetch(`https://api.github.com/repos/${REPO}/releases?per_page=30`, { headers: { Accept: 'application/vnd.github+json' } })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((all) => {
      const rels = all.filter((r) => !r.draft && !r.prerelease).map((r) => {
        const f = pick(r.assets || []), files = {};
        for (const s in f) if (f[s]) files[s] = { url: f[s].browser_download_url, name: f[s].name, size: mb(f[s].size) };
        return { tag: r.tag_name, page: r.html_url || PAGE, date: (r.published_at || '').slice(0, 10), files };
      }).filter((r) => Object.keys(r.files).length);
      try { sessionStorage.setItem('krnl-rels', JSON.stringify({ at: Date.now(), rels })); } catch (_) {}
      fill(rels);
    })
    .catch(() => {});
})();
