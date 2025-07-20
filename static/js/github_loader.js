const username = "UNVISLATE";
const MAX_ITEMS = 3;

// ========== UTILS ========== //
const formatDate = (iso) => new Date(iso).toLocaleDateString("en-GB");
const truncate = (str, len) => (str.length > len ? str.slice(0, len) + "..." : str);
const fetchJSON = (url) => fetch(url).then((r) => r.json());
const createEl = (tag, cls, html = "") => {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (html) el.innerHTML = html;
  return el;
};

// ========== SKELETON HELPERS ========== //
function showProfileSkeleton() {
  const container = document.querySelector(".github-profile");
  container.innerHTML = `
      <div class="skeleton-box" style="width: 70px; height: 70px; border-radius: 50%;"></div>
      <div class="github-info">
        <h3 class="skeleton-box" style="width: 100px; height: 1.5em;"></h3>
        <p class="skeleton-box" style="width: 150px; height: 1.3em;"></p>
        <p class="skeleton-box" style="width: 150px; height: 1.3em;"></p>
      </div>`;
}

function showRepoSkeletons(count = 3) {
  const container = document.querySelector(".github-repositories");
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const skeleton = createEl("div", "repository skeleton");
    skeleton.innerHTML = `
      <div class="repo-title">
        <div class="skeleton-box" style="width: 80%; height: 1.5em;"></div>
      </div>
      <p class="skeleton-box" style="width: 90%; height: 1.2em;"></p>
      <div class="repo-stats">
        ${Array.from({ length: 4 }).map(() => `
          <div class="item">
            <div class="skeleton-icon"></div>
            <span class="skeleton-box" style="width: 60%; height: 1.2em;"></span>
          </div>
        `).join("")}
      </div>`;
    container.appendChild(skeleton);
  }
}

function showGistSkeletons(count = 3) {
  const container = document.querySelector(".github-gists");
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const skeleton = createEl("div", "gist skeleton");
    skeleton.innerHTML = `
      <div class="gist-title">
        <div class="skeleton-icon"></div>
        <div class="skeleton-box" style="width: 60%; height: 1.5em;"></div>
      </div>
      <div class="gist-files">
        ${Array.from({ length: 2 }).map(() => `<span class="skeleton-box" style="width: 70%; height: 1.2em; margin: 3px 0"></span>`).join("")}
      </div>
      <div class="gist-code">
        <div class="skeleton-box" style="width: 100%; height: 6em;"></div>
      </div>`;
    container.appendChild(skeleton);
  }
}

// ========== PROFILE ========== //
async function loadProfile() {
  showProfileSkeleton();
  const container = document.querySelector(".github-profile");
  try {
    const data = await fetchJSON(`https://api.github.com/users/${username}`);
    container.innerHTML = `
      <img src="${data.avatar_url}" alt="GitHub Profile Picture">
      <div class="github-info">
        <a href="https://github.com/${username}" target="_blank"><h3>${data.login}</h3></a>
        <p>Repositories: <span>${data.public_repos}</span></p>
        <p>Gists: <span>${data.public_gists}</span></p>
      </div>`;
  } catch (err) {
    container.innerHTML = `<p class="error">Unable to load profile.</p>`;
  }
}

// ========== PROJECTS ========== //
async function loadRepositories() {
  showRepoSkeletons();
  const container = document.querySelector(".github-repositories");
  try {
    const repos = await fetchJSON(`https://api.github.com/users/${username}/repos`);
    container.innerHTML = "";
    const sortedRepos = repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, MAX_ITEMS);

    sortedRepos.forEach((repo) => {
      const a = createEl("a", "repository");
      a.href = repo.html_url;
      a.target = "_blank";

      const name = truncate(repo.name || "None", 20);
      const title = `
        <div class="repo-title">
          <img src="/static/img/icons/github-repository.svg" alt="Repository Icon">
          <p>${name}</p>
          ${repo.archived ? `
            <div class="arhive-warning">
              <img src="/static/img/icons/repository-arhive.svg" alt="Archive Icon">
              <span data-i18n="github.additional.arhive">arhived</span>
            </div>` : ""}
        </div>`;

      const description = repo.description
        ? `<p>${truncate(repo.description, 80)}</p>`
        : "";

      const stats = `
        <div class="repo-stats">
          <div class="item">
            <img src="/static/img/icons/star.svg" alt="Stars Icon">
            <p>Stars: <span>${repo.stargazers_count}</span></p>
          </div>
          <div class="item">
            <img src="/static/img/icons/fork.svg" alt="Forks Icon">
            <p>Forks: <span>${repo.forks_count}</span></p>
          </div>
          <div class="item">
            <img src="/static/img/icons/calendar.svg" alt="Calendar Icon">
            <p>Created at: <span>${formatDate(repo.created_at)}</span></p>
          </div>
          <div class="item">
            <img src="/static/img/icons/calendar.svg" alt="Calendar Icon">
            <p>Last update: <span>${formatDate(repo.updated_at)}</span></p>
          </div>
        </div>`;

      a.innerHTML = title + description + stats;
      container.appendChild(a);
    });
  } catch (err) {
    container.innerHTML = `<p class="error">Failed to load repositories.</p>`;
  }
}

// ========== GISTS ========== //
async function loadGists() {
  showGistSkeletons();
  const container = document.querySelector(".github-gists");
  try {
    const gists = await fetchJSON(`https://api.github.com/users/${username}/gists`);
    container.innerHTML = "";
    const displayed = gists.slice(0, MAX_ITEMS);

    for (const gist of displayed) {
      const a = createEl("a", "gist");
      a.href = gist.html_url;
      a.target = "_blank";

      const name = truncate(gist.description || "No name", 25);
      const title = `
        <div class="gist-title">
          <img src="/static/img/icons/gist.svg" alt="Gist Icon">
          <p>${name}</p>
        </div>`;

      const filesList = Object.values(gist.files)
        .slice(0, 3)
        .map((f) => `<span>${f.filename}</span>`)
        .join("");

      const codeContainer = createEl("div", "gist-code");
      const codeEl = createEl("pre");
      const codeInner = createEl("code");
      codeInner.classList.add("language-python");

      const firstFile = Object.values(gist.files)[0];
      try {
        const raw = await fetch(firstFile.raw_url).then((r) => r.text());
        const snippet = raw
          .split("\n")
          .slice(0, 5)
          .map((line) => truncate(line, 40))
          .join("\n");
        codeInner.textContent = snippet;
      } catch {
        codeInner.textContent = "[Unable to fetch code]";
      }

      codeEl.appendChild(codeInner);
      codeContainer.appendChild(codeEl);

      a.innerHTML = title;
      a.innerHTML += `<div class="gist-files">${filesList}</div>`;
      a.appendChild(codeContainer);
      container.appendChild(a);
    }

    if (window.hljs) hljs.highlightAll();
  } catch (err) {
    container.innerHTML = `<p class="error">Failed to load gists.</p>`;
  }
}

// ========== INIT ========== //
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  loadRepositories();
  loadGists();
});
